import {
    StyleSheet, Text, TouchableOpacity, SafeAreaView, View, Image, TextInput, ScrollView, ActivityIndicator,
    Modal
} from 'react-native';
import React, { useState, useEffect } from 'react';
import LoginHeader from '../components/loginHeader';
import axios from 'axios';
import TimerMixin from 'react-timer-mixin';
import * as SecureStore from 'expo-secure-store';
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

export default function Register({ navigation }) {
    const [currentLang, setCurrentLag] = useState('ar')
    const translations = {
        "en": {
            "head": "already have an account?",
            "login": "Log in",
            "register": "Sign up",
            "or": "or",
            "google_btn": "Continue with Google",
            "face_btn": "Continue with Facebook",
            "email_e": "Email",
            "phone": "Phone Number",
            "back": "back",
            "enter_phone": "Enter You Phone Number",
            "p_password": "Password"
        },
        "fr": {
            "head": "Vous avez déjà un compte?",
            "login": "Se connecter",
            "register": "s'inscrire",
            "or": "ou",
            "google_btn": "Continuez avec Google",
            "face_btn": "Continuez avec Facebook",
            "email_e": "E-mail",
            "enter_phone": "Entrez votre numéro de téléphone",
            "phone": "Numéro de téléphone",
            "back": "dos",
            "p_password": "Mot de passe"
        },
        "ar": {
            "head": "هل لديك حساب؟",
            "login": "تسجيل الدخول",
            "register": "تسجيل",
            "or": "أو",
            "enter_phone": "أدخل رقم هاتفك",
            "google_btn": "تابع بواسطة جوجل",
            "face_btn": "تابع بواسطة فيسبوك",
            "email_e": "البريد الالكتروني",
            "back": "رجوع",
            "phone": "رقم الهاتف",
            "p_password": "كلمة المرور"
        }
    }
    const [screenContent, setScreenContent] = useState(translations.ar);

    const getStoredLang = async () => {
        const storedLang = await SecureStore.getItemAsync('lang');
        if (storedLang) {
            setScreenContent(translations[storedLang])
            setCurrentLag(storedLang)
        }
    }

    const [emailfocused, setEmailfocused] = useState(false);
    const handleEmailFocus = () => {
        setEmailfocused(true);
    };

    const [phonefocused, setPhonefocused] = useState(false);
    const handlePhoneFocus = () => {
        setPhonefocused(true);
    };

    const [passfocused, setPassfocused] = useState(false);
    const handlePassFocus = () => {
        setPassfocused(true);
    };

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [googlePassword, setGooglePassword] = useState("");
    const [name, setName] = useState("");

    const [loading, setLoading] = useState(false);
    const [showPhonePopUp, setShowPhonePopUp] = useState(false);
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');

    const registerMethod = async () => {
        setLoading(true)
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/register`, {
                email: email,
                phone: phone,
                password: password,
                api_password: 'Fentec@scooters.algaria'
            });

            if (response.data.status === true) {
                await SecureStore.setItemAsync('user_token', response.data.data.token)
                setErrors([]);
                setSuccessMsg(response.data.message);
                TimerMixin.setTimeout(() => {
                    setLoading(false);
                    navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'Verify',
                            params: {
                              email: email,
                              token: response.data.data.token,
                            },
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

    const registerGoogle = async () => {
        setLoading(true)
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/register`, {
                email: email,
                phone: phone,
                password: googlePassword,
                sign_up_type: "Google",
                api_password: 'Fentec@scooters.algaria'
            });

            if (response.data.status === true) {
                await SecureStore.setItemAsync('user_token', response.data.data.token)
                setErrors([]);
                setSuccessMsg(response.data.message);
                TimerMixin.setTimeout(() => {
                    setLoading(false);
                    navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'Last',
                            params: {
                              email: email,
                              googleName: name,
                              token: response.data.data.token,
                            },
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

    const [scrollY, setScrollY] = useState(0);

    const onScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setScrollY(offsetY);
    };
    useEffect(() => {
        getStoredLang();
    }, []);

    
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
            // setToken(response.authentication.accessToken);
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
          setName(user.name)
          setEmail(user.email)
          setGooglePassword("Google")
            setShowPhonePopUp(true)
          setUserInfo(user);
        } catch (error) {
          // Add your own error handler here
        }
      };
    

      const [user, setUser] = useState(null);
      const [requestF, responseF, promptAsyncF] = Facebook.useAuthRequest({
        clientId: "799352772304910",
      });
    
      useEffect(() => {
        console.log(responseF);
        console.log(responseF);
        console.log(responseF);
        if (responseF && responseF.type === "success" && responseF.authentication) {
          (async () => {
            const userInfoResponse = await fetch(
              `https://graph.facebook.com/me?access_token=${responseF.authentication.accessToken}&fields=id,name,picture.type(large)`
            );
            const userInfo = await userInfoResponse.json();
            console.log(userInfo);
            console.log(JSON.stringify(responseF, null, 2));
          })();
        }
      }, [responseF]);
    
      const handlePressAsync = async () => {
        const result = await promptAsyncF();
        if (result.type !== "success") {
          alert("Uh oh, something went wrong");
          return;
        }
      };
    return (
        <ScrollView onScroll={onScroll} scrollEventThrottle={16} style={{ position: 'relative' }}>
                <Modal
                    animationType="slide"
                    visible={showPhonePopUp}
                    transparent={true}
                    style={{height: "100%"}}
                    >
                        <View
                        style={
                            {
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#fff",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 40
                            }
                        }>
                            <Text style={{
                                position: 'absolute', top:  50, right: 20, color: "#fff",
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
                                position: 'absolute', top:  50, right: 20, color: "#fff",
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
                                    backgroundColor: 'rgba(0, 0, 0, .5)',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                }}>
                                    <ActivityIndicator size="200px" color="#ff7300" />
                                </View>
                            )}

                            <Image source={require('./../assets/imgs/PT.png')} style={{
                                width: '100%',
                                height: '100%',
                                resizeMode: 'cover',
                                position: 'absolute',
                                top: 0,
                                left: 0
                            }} />
                            <Text style={{fontFamily: 'Outfit_500Medium', fontSize: 24, width: "100%", textAlign: "center"}}>
                                {screenContent.enter_phone}
                            </Text>
                            <View style={{width: "95%", justifyContent: 'center', alignItems: 'center', gap: 24}}>
                                <TextInput
                                    placeholder={screenContent.phone}
                                    onChangeText={setPhone}
                                    value={phone}
                                    onFocus={() => handlePhoneFocus()}
                                    onBlur={() => setPhonefocused(false)}
                                    style={[
                                        styles.input,
                                        phonefocused && {
                                            borderColor: 'rgba(255, 115, 0, 1)',
                                            borderWidth: 2
                                        },
                                        currentLang == 'ar' && {
                                            textAlign: 'right',
                                        },
                                    ]}

                                />
                                <View style={{flexDirection: "row", width: "100%", gap: 16, justifyContent: 'center'}}>
                                    <TouchableOpacity style={[styles.button, {backgroundColor: "gray", width: "40%"}]} onPress={() => handleBack()}>
                                        <Text style={styles.button_text}>{screenContent.back}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.button, {width: "40%"}]} onPress={() => registerGoogle()}>
                                        <Text style={styles.button_text}>{screenContent.register}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                </Modal>
            <SafeAreaView style={styles.wrapper}>
                <LoginHeader active={3}></LoginHeader>
                <BackgroundImage></BackgroundImage>
                <Text style={{
                    position: 'absolute', top:  50, right: 20, color: "#fff",
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
                    position: 'absolute', top:  50, right: 20, color: "#fff",
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
                <View style={styles.contianer}>
                    <Image style={styles.main_img} source={require('./../assets/imgs/register.png')} />
                    <View style={{ flexDirection: currentLang == 'ar' ? 'row-reverse' : 'row', gap: 10 }}>
                        <Text style={styles.question}>{screenContent.head}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}><Text style={styles.ans}>{screenContent.login}</Text></TouchableOpacity>
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
                    {/* <TouchableOpacity style={[styles.f_btn, currentLang == 'ar' && { flexDirection: 'row-reverse', justifyContent: 'end' }]}
                        // disabled={!requestF}
                        onPress={() => {
                            handlePressAsync();
                        }}>
                    
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
                            placeholder={screenContent.phone}
                            onChangeText={setPhone}
                            value={phone}
                            onFocus={() => handlePhoneFocus()}
                            onBlur={() => setPhonefocused(false)}
                            style={[
                                styles.input,
                                phonefocused && {
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
                        <TouchableOpacity style={styles.button} onPress={() => registerMethod()}>
                            <Text style={styles.button_text}>{screenContent.register}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
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
