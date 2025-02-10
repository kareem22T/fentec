import {
    StyleSheet, ScrollView, SafeAreaView, Text, View, TouchableOpacity, Image, TextInput, ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import LoginHeader from '../components/loginHeader';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import TimerMixin from 'react-timer-mixin';

import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const BackgroundImage = () => {
    return (
        <Image source={require('./../assets/imgs/PT.png')} style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
        }} />
    )
}

export default function Login({ navigation }) {
    const [currentLang, setCurrentLag] = useState('ar')
    const translations = {
        "en": {
            "head": "Do not have an account?",
            "login": "Log in",
            "register": "Sign up",
            "or": "or",
            "google_btn": "Continue with Google",
            "face_btn": "Continue with Facebook",
            "email_e": "Email or Phone Number",
            "phone": "Phone Number",
            "p_password": "Password",
            "forgotPassword": "Forgot Your Password?"
        },
        "fr": {
            "head": "Vous n'avez pas de compte??",
            "login": "Se connecter",
            "register": "s'inscrire",
            "or": "ou",
            "google_btn": "Continuez avec Google",
            "face_btn": "Continuez avec Facebook",
            "email_e": "E-mail",
            "phone": "Numéro de téléphone",
            "p_password": "Mot de passe",
            "forgotPassword": "Mot de passe oublié?"
        },
        "ar": {
            "head": "ليس لديك حساب؟",
            "login": "تسجيل الدخول",
            "register": "تسجيل",
            "or": "أو",
            "google_btn": "تابع بواسطة جوجل",
            "face_btn": "تابع بواسطة فيسبوك",
            "email_e": "البريد الالكتروني او رقم الهاتف",
            "phone": "رقم الهاتف",
            "p_password": "كلمة المرور",
            "forgotPassword": "نسيت كلمة السر؟"
        }
    }
    const [screenContent, setScreenContent] = useState(translations.ar);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [googlePassword, setGooglePassword] = useState("");
    const [name, setName] = useState("");
  // Handle sign in with Google
  const [gToken, setgToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const getLocalUser = async () => {
    const data = await SecureStore.getItemAsync("userData");
    if (!data) return null;
    return JSON.parse(data);
  };


  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "22085097857-mqlve8k4delb5b0i2vdik1g8hki9vr3g.apps.googleusercontent.com",
    iosClientId: "22085097857-vqgh29rhn6v7h2u892hvqltrbh9dfk9i.apps.googleusercontent.com"
  });

  const handleBack = () => {
    setShowPhonePopUp(false)
    setEmail("")
    setName("")
    setGooglePassword("")
  }

  useEffect(() => {
    handleEffect();
  }, [response, gToken]);

    async function handleEffect() {
        const user = await getLocalUser();
        if (!user) {
        if (response?.type === "success") {
            getUserInfo(response.authentication.accessToken);
        }
        } else {
        setUserInfo(user);
        setErrors([])
        console.log(user);
        setName(user.name)
        setEmail(user.email)
        setGooglePassword("Google")
        setShowPhonePopUp(true)
        console.log("loaded locally");
        console.log(user);
        setLoading(true)
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/login-google`, {
                email: user.email,
                password: "Google",
                sign_up_type: "Google",
                api_password: 'Fentec@scooters.algaria'
            });

            if (response.data.status === true) {
                await SecureStore.setItemAsync('user_token', response.data.data.token)
                setLoading(false);
                setErrors([]);
                setSuccessMsg(response.data.message);
                TimerMixin.setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'Profile',
                            params: {}, // No params to pass in this case
                          },
                        ],
                      });                      
                }, 1500)
            } else {
                setLoading(false);
                setErrors(response.data.errors);
                TimerMixin.setTimeout(() => {
                    setErrors([]);
                }, 2000);
            }
        } catch (error) {
            setLoading(false);
            setErrors(["Server error, try again later."]);
            console.error(error);
        }

        }
    }

    const getUserInfo = async (gToken) => {
        if (!gToken) return;
        try {
        //   setLoading(true);
          const response = await fetch(
            "https://www.googleapis.com/userinfo/v2/me",
            {
              headers: { Authorization: `Bearer ${gToken}` },
            }
          );
    
          const user = await response.json();
          console.log(user);
          setLoading(true)
          setErrors([])
          try {
              const response = await axios.post(`https://adminandapi.fentecmobility.com/login-google`, {
                  email: user.email,
                  password: "Google",
                  sign_up_type: "Google",
                  api_password: 'Fentec@scooters.algaria'
              });
  
              if (response.data.status === true) {
                  await SecureStore.setItemAsync('user_token', response.data.data.token)
                  setLoading(false);
                  setErrors([]);
                  setSuccessMsg(response.data.message);
                  TimerMixin.setTimeout(() => {
                      navigation.reset({
                          index: 0,
                          routes: [
                            {
                              name: 'Profile',
                              params: {}, // No params to pass in this case
                            },
                          ],
                        });                      
                  }, 1500)
              } else {
                  setLoading(false);
                  setErrors(response.data.errors);
                  TimerMixin.setTimeout(() => {
                      setErrors([]);
                  }, 2000);
              }
          } catch (error) {
              setLoading(false);
              setErrors(["Server error, try again later."]);
              console.error(error);
          }
            setUserInfo(user);
        } catch (error) {
          // Add your own error handler here
        }
      };
    

    const registerGoogle = async () => {
    }

    const [emailfocused, setEmailfocused] = useState(false);
    const handleEmailFocus = () => {
        setEmailfocused(true);
    };
    const [passfocused, setPassfocused] = useState(false);
    const handlePassFocus = () => {
        setPassfocused(true);
    };

    const getStoredLang = async () => {
        const storedLang = await SecureStore.getItemAsync('lang');
        if (storedLang) {
            setScreenContent(translations[storedLang])
            setCurrentLag(storedLang)
        }
    }

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');

    const loginMethode = async () => {
        setLoading(true)
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/login`, {
                lang: currentLang,
                emailorphone: email,
                password: password,
                api_password: 'Fentec@scooters.algaria'
            });

            if (response.data.status === true) {
                await SecureStore.setItemAsync('user_token', response.data.data.token)
                setLoading(false);
                setErrors([]);
                setSuccessMsg(response.data.message);
                TimerMixin.setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'Profile',
                            params: {}, // No params to pass in this case
                          },
                        ],
                      });                      
                }, 1500)
            } else {
                setLoading(false);
                setErrors(response.data.errors);
                TimerMixin.setTimeout(() => {
                    setErrors([]);
                }, 2000);
            }
        } catch (error) {
            setLoading(false);
            setErrors(["Server error, try again later."]);
            console.error(error);
        }
    }

    useEffect(() => {
        getStoredLang();
    }, []);

    return (
        <ScrollView style={styles.wrapper} contentContainerStyle={{flexGrow: 1}}>
                <LoginHeader active={3}></LoginHeader>
                <BackgroundImage></BackgroundImage>
                <Text style={{
                    position: 'absolute', top: 50, right: 20, color: "#fff",
                    padding: 1 * 16,
                    marginLeft: 10,
                    fontSize: 1 * 16,
                    backgroundColor: '#e41749',
                    fontFamily: 'Outfit_600SemiBold',
                    borderRadius: 1.25 * 16,
                    zIndex: 9999999999,
                    display: errors.length ? 'flex' : 'none'
                }}>{errors.length ? errors[0] : ''}</Text>
                <Text style={{
                    position: 'absolute', top: 50, right: 20, color: "#fff",
                    padding: 1 * 16,
                    marginLeft: 10,
                    fontSize: 1 * 16,
                    backgroundColor: '#12c99b',
                    fontFamily: 'Outfit_600SemiBold',
                    borderRadius: 1.25 * 16,
                    zIndex: 9999999999,
                    display: successMsg == '' ? 'none' : 'flex'
                }}>{successMsg}</Text>
                {loading && (
                    <View style={{
                        width: '100%',
                        height: '100%',
                        zIndex: 336,
                        justifyContent: 'center',
                        alignContent: 'center',
                        marginTop: 22,
                        backgroundColor: 'rgba(0, 0, 0, .5)',
                        position: 'absolute',
                        top: 10,
                        left: 0,
                    }}>
                        <ActivityIndicator size="200px" color="#ff7300" />
                    </View>
                )}
                <View style={[styles.contianer]}>
                    <View style={{ flexDirection: currentLang == 'ar' ? 'row-reverse' : 'row', gap: 10, marginTop: 35 }}>
                        <Text style={styles.question}>{screenContent.head}</Text>
                        <TouchableOpacity><Text style={styles.ans} onPress={() => navigation.navigate('Register')}>{screenContent.register}</Text></TouchableOpacity>
                    </View>
                    <Text style={styles.or}>{screenContent.or}</Text>
                    <TouchableOpacity style={[styles.g_btn, currentLang == 'ar' && { flexDirection: 'row-reverse', justifyContent: 'end' }]} 
                    disabled={!request}
                    onPress={() => {
                      promptAsync();
                    }}>
                        <Image style={styles.g_f_img} source={require('./../assets/imgs/google.png')} />
                        <Text style={styles.g_btn_text}>{screenContent.google_btn}</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={[styles.f_btn, currentLang == 'ar' && { flexDirection: 'row-reverse', justifyContent: 'end' }]}>
                        <Image style={styles.g_f_img} source={require('./../assets/imgs/facebook.png')} />
                        <Text style={styles.f_btn_text}>{screenContent.face_btn}</Text>
                    </TouchableOpacity> */}
                    <Text style={styles.or}>{screenContent.or}</Text>
                    <View style={{ gap: 15, width: '100%', alignItems: 'center' }}>
                        <TextInput
                            placeholder={screenContent.email_e}
                            onChangeText={setEmail}
                            value={email}
                            onFocus={() => handleEmailFocus()}
                            onBlur={() => setEmailfocused(false)}
                            style={[
                                styles.input,
                                emailfocused && {
                                    borderColor: 'rgba(255, 115, 0, 1)',
                                    borderWidth: 2
                                },
                                currentLang == 'ar' && {
                                    textAlign: 'right',
                                },
                            ]}

                        />
                        <TextInput
                            placeholder={screenContent.p_password}
                            onChangeText={setPassword}
                            value={password}
                            secureTextEntry={true}
                            onFocus={() => handlePassFocus()}
                            onBlur={() => setPassfocused(false)}
                            style={[
                                styles.input,
                                passfocused && {
                                    borderColor: 'rgba(255, 115, 0, 1)',
                                    borderWidth: 2
                                },
                                currentLang == 'ar' && {
                                    textAlign: 'right',
                                },
                            ]}
                        />
                        <View style={{width: "100%", alignItems: 'center'}}>
                            <TouchableOpacity style={styles.button} onPress={() => loginMethode()}>
                                <Text style={styles.button_text}>{screenContent.login}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("EnterEmail")}>
                                <Text style={{fontFamily: "Outfit_500Medium", color: "rgba(255, 115, 0, 1)"}}>{screenContent.forgotPassword}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View></View>
                    <View></View>
                </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    contianer: {
        padding: 1.25 * 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 1 * 16,
        alignItems: 'center',
        flex: 1,
        width: '100%',
        zIndex: 3
    },
    main_img: {
        width: 130,
        height: 80,
        resizeMode: 'contain',
        opacity: 1,
        marginTop: 10
    },
    or: {
        fontSize: 1.5 * 16,
        lineHeight: 2 * 16,
        textAlign: "center",
        fontFamily: 'Outfit_600SemiBold',
    },
    input: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.25 * 16,
        lineHeight: 1.5 * 16,
        textAlign: 'left',
        padding: 1.25 * 16,
        borderRadius: 1.25 * 16,
        backgroundColor: "#fff",
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        width: "95%",
    },
    button: {
        padding: 18,
        borderRadius: 1.25 * 16,
        fontSize: 1.25 * 16,
        width: "95%",
        backgroundColor: "#ff7300",
        transition: "all .3s ease-in",
        marginBottom: 1.25 * 16,
    },
    button_text: {
        color: "#fff",
        fontFamily: 'Outfit_700Bold',
        fontSize: 28,
        textAlign: "center",
    },
    g_f_img: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
    g_btn: {
        backgroundColor: "#fff",
        padding: 1.25 * 16,
        borderRadius: 1.25 * 16,
        display: "flex",
        justifyContent: 'start',
        alignItems: "center",
        flexDirection: 'row',
        gap: 1.25 * 16,
        width: "100%",
        color: '#000',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    f_btn: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        padding: 1.25 * 16,
        borderRadius: 1.25 * 16,
        display: "flex",
        justifyContent: 'start',
        alignItems: "center",
        flexDirection: 'row',
        gap: 1.25 * 16,
        width: "100%",
        backgroundColor: '#1877f2',

    },
    g_btn_text: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.1 * 16,
        textAlign: "center",
        lineHeight: 1.25 * 16,
        color: '#000'
    },
    f_btn_text: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.1 * 16,
        textAlign: "center",
        lineHeight: 1.25 * 16,
        color: '#fff'
    },
    question: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 1.25 * 16,
        lineHeight: 1.5 * 16,
        textAlign: "center",
        color: "#000",
    },
    ans: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.25 * 16,
        textAlign: "center",
        color: "#ff7300",

    }
});
