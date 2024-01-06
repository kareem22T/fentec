import {
    StyleSheet, SafeAreaView, Text, TouchableOpacity, View, Image, TextInput, ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import LoginHeader from '../components/loginHeader';
import axios from 'axios';
import TimerMixin from 'react-timer-mixin';
import * as SecureStore from 'expo-secure-store';

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

export default function Verify({ navigation, route }) {
    const [currentLang, setCurrentLag] = useState('ar')
    const translations = {
        "en": {
            "msg": "We just have sent you an verification code to your email please, write it here",
            "sub_msg": "verification code sent to:",
            "edit_mail": "edit email",
            "ask_for_code": "Didn't receive the verification code?",
            "timer_words": "resend in",
            "btn": "Resend",
            "code_place": "Verification code",
            "submit": "Submit"
        },
        "fr": {
            "msg": "Nous venons de vous envoyer un code de vérification à votre e-mail \nS'il vous plaît écrivez le ici",
            "sub_msg": "Code de vérification envoyé à:",
            "edit_mail": "Modifier l'e-mail",
            "ask_for_code": "Didn't receive the verification code?",
            "timer_words": "Renouvellement en",
            "btn": "Renvoyer",
            "code_place": "Code de vérification",
            "submit": "Soumettre"
        },
        "ar": {
            "msg": "قد ارسلنا للتو رمز التحقق لبريدك الالكتروني, رجاء كتابته",
            "sub_msg": "تم ارسال رمز التحقق الي:",
            "edit_mail": "تعديل البريد الالكتروني",
            "ask_for_code": "لم تتلقى رمز التحقق؟",
            "timer_words": "اعد طلب الارسال بعد",
            "btn": "إعادة إرسال",
            "code_place": "رمز التحقق",
            "submit": "تاكيد"
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

    const [codeFocused, setCodeFocused] = useState(false);
    const [code, setCode] = useState('');
    const handleCodeFocused = () => {
        setCodeFocused(true);
    };

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');

    const verify = async (token) => {
        setLoading(true)
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/active-account`, {
                api_password: 'Fentec@scooters.algaria',
                code: code,
            },
                {
                    headers: {
                        'AUTHORIZATION': `Bearer ${token}`
                    }
                },);

            if (response.data.status === true) {
                setErrors([]);
                setSuccessMsg(response.data.message);
                TimerMixin.setTimeout(() => {
                    setLoading(false);
                    navigation.navigate('Last', { token: token })
                }, 1500);
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
    const sendCode = async (token) => {
        setLoading(true)
        console.log(token);
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/send-code`, {
                api_password: 'Fentec@scooters.algaria',
            },
                {
                    headers: {
                        'AUTHORIZATION': `Bearer ${token}`
                    }
                },);

            if (response.data.status === true) {
                setLoading(false);
                setErrors([]);
                setSuccessMsg(response.data.message);
                TimerMixin.setTimeout(() => {
                    setSuccessMsg('')
                    setCountdown(59)
                }, 2500);
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

    const [countdown, setCountdown] = useState(59);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown === 0) {
                    clearInterval(timer); // Stop the timer
                    // Do something else here when the countdown reaches zero
                    return 0; // Set countdown to 0
                } else {
                    return prevCountdown - 1; // Decrease countdown by 1
                }
            });
        }, 1000);

        getStoredLang();
        sendCode(route.params.token)
        return () => {
            clearInterval(timer); // Cleanup: clear the interval when the component unmounts
        };
    }, []);

    return (
        <SafeAreaView style={styles.wrapper}>
            <LoginHeader active={3}></LoginHeader>
            <BackgroundImage></BackgroundImage>
            {errors && (

                <Text style={{
                    position: 'absolute', top: 70, right: 20, color: "#fff",
                    padding: 1 * 16,
                    marginLeft: 10,
                    fontSize: 1 * 16,
                    backgroundColor: '#e41749',
                    fontFamily: 'Outfit_600SemiBold',
                    // fontWeight: 600,
                    borderRadius: 1.25 * 16,
                    zIndex: 9999999999,
                    display: errors.length ? 'flex' : 'none'
                }}>{errors.length ? errors[0] : ''}</Text>
            )}
            <Text style={{
                position: 'absolute', top: 70, right: 20, color: "#fff",
                padding: 1 * 16,
                marginLeft: 10,
                fontSize: 1 * 16,
                backgroundColor: '#12c99b',
                fontFamily: 'Outfit_600SemiBold',
                // fontWeight: 600,
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
            <View style={styles.container}>
                <View style={{ marginTop: 15 }}>
                    <Text style={styles.msg}>{screenContent.msg}</Text>
                    <View style={{ gap: 5, marginTop: 10, alignItems: 'center' }}>
                        <Text style={styles.subYemail}>{screenContent.sub_msg}</Text>
                        <Text style={styles.subYemail}>{route.params.email}</Text>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('./../assets/imgs/icons/angle-left-orang.png')} style={{ width: 20, height: 20, resizeMode: 'contain', opacity: 1 }} />
                            <Text style={[styles.subYemail, { color: "#ff7300", borderBottomColor: '#ff7300', borderBottomWidth: 1 }]}>{screenContent.edit_mail}</Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <TextInput
                                placeholder={screenContent.code_place}
                                onChangeText={setCode}
                                value={code}
                                onFocus={() => handleCodeFocused()}
                                onBlur={() => setCodeFocused(false)}
                                style={[
                                    styles.input,
                                    codeFocused && {
                                        borderColor: 'rgba(255, 115, 0, 1)',
                                        borderWidth: 2
                                    },
                                    currentLang == 'ar' && {
                                        textAlign: 'right',
                                    },
                                    code && {
                                        color: '#000'
                                    },
                                ]} />
                            <TouchableOpacity style={[styles.btn, { width: 'auto', paddingLeft: 10, paddingRight: 10, height: 66, marginBottom: 0, }]} onPress={() => verify(route.params.token)}><Text style={[styles.button_text, { fontSize: 1.25 * 16, }]}>{screenContent.submit}</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ width: '100%', gap: 5 }}>
                    <Text style={styles.subYemail}>
                        {screenContent.ask_for_code}
                    </Text>
                    <View style={{ width: '100%', alignItems: 'center', gap: 5 }}>
                        <Text style={[styles.subYemail, countdown != 0 ? { display: 'flex' } : { display: 'none' }]}>{screenContent.timer_words} {countdown} </Text>
                        <TouchableOpacity style={[styles.btn, countdown == 0 ? { opacity: 1 } : { opacity: .5 }]} onPress={countdown == 0 ? () => sendCode(route.params.token) : ''}><Text style={styles.button_text}>{screenContent.btn}</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        padding: 1.25 * 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 1 * 16,
        alignItems: 'center',
        width: '100%',
        flex: 1
    },
    msg: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.25 * 16,
        // fontWeight: '600',
        lineHeight: 1.5 * 16,
        letterSpacing: 0,
        textAlign: 'center',
    },
    subYemail: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 1.1 * 16,
        // fontWeight: '400',
        lineHeight: 1.5 * 16,
        letterSpacing: 0,
        textAlign: 'center',
    },
    input: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.25 * 16,
        // fontWeight: 600,
        lineHeight: 1.5 * 16,
        textAlign: 'left',
        padding: 1.25 * 16,
        borderRadius: 1.25 * 16,
        backgroundColor: "rgba(255, 255, 255, 1)",
        width: "60%",
        color: 'gray',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    btn: {
        paddingTop: 16,
        paddingBottom: 18,
        borderRadius: 1.25 * 16,
        backdropFilter: "blur(1)",
        width: "95%",
        backgroundColor: "#ff7300",
        transition: "all .3s ease-in",
        border: "3 solid #ff7300",
        marginBottom: 1.25 * 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button_text: {
        color: "#fff",
        fontFamily: 'Outfit_700Bold',
        fontSize: 28,
        textAlign: "center",
    },
});
