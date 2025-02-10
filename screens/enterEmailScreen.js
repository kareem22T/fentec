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

export default function EnterEmail({ navigation, route }) {
    const [currentLang, setCurrentLag] = useState('ar')
    const translations = {
        "en": {
            "msg": "Enter Your Email",
            "edit_mail": "edit email",
            "ask_for_Email": "Didn't receive the verification Email?",
            "timer_words": "resend in",
            "btn": "Send Verfication code",
            "Email_place": "Your Email",
            "submit": "Submit"
        },
        "fr": {
            "msg": "Entrer votre Email",
            "edit_mail": "Modifier l'e-mail",
            "ask_for_Email": "Didn't receive the verification Email?",
            "timer_words": "Renouvellement en",
            "btn": "Renvoyer",
            "Email_place": "Votre Email",
            "submit": "Soumettre"
        },
        "ar": {
            "msg": "أدخل بريدك الإلكتروني",
            "sub_msg": "تم ارسال رمز التحقق الي:",
            "edit_mail": "تعديل البريد الالكتروني",
            "ask_for_Email": "لم تتلقى رمز التحقق؟",
            "timer_words": "اعد طلب الارسال بعد",
            "btn": " إرسال رمز التاكيد",
            "Email_place": "بريدك الالكتروني",
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

    const [EmailFocused, setEmailFocused] = useState(false);
    const [Email, setEmail] = useState('');
    const handleEmailFocused = () => {
        setEmailFocused(true);
    };

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');

    const sendCode = async (email) => {
        setLoading(true)
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/send-forgot-code`, {
                api_password: 'Fentec@scooters.algaria',
                lang: currentLang,
                email: email
            },)
            if (response.data.status === true) {
                setLoading(false);
                setErrors([]);
                setSuccessMsg(response.data.message);
                TimerMixin.setTimeout(() => {
                    navigation.navigate("ForgotPasswordScreen")
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

        getStoredLang();
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
                        <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <TextInput
                                placeholder={screenContent.Email_place}
                                onChangeText={setEmail}
                                value={Email}
                                onFocus={() => handleEmailFocused()}
                                onBlur={() => setEmailFocused(false)}
                                style={[
                                    styles.input,
                                    {width: "100%"},
                                    EmailFocused && {
                                        borderColor: 'rgba(255, 115, 0, 1)',
                                        borderWidth: 2
                                    },
                                    currentLang == 'ar' && {
                                        textAlign: 'right',
                                    },
                                    Email && {
                                        color: '#000'
                                    },
                                ]} />
                        </View>
                    </View>
                </View>
                <View style={{ width: '100%', gap: 5 }}>
                    <View style={{ width: '100%', alignItems: 'center', gap: 5 }}>
                        <TouchableOpacity style={[styles.btn]} onPress={() => sendCode(Email)}><Text style={styles.button_text}>{screenContent.btn}</Text></TouchableOpacity>
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
