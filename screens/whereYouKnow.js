import {
    StyleSheet, Text, TouchableOpacity, SafeAreaView, View, Image, TextInput, ScrollView
} from 'react-native';
import React, { useState, useEffect } from 'react';
import LoginHeader from '../components/loginHeader';
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

export default function WhereKnow({ navigation }) {
    const translations = {
        "en": {
            "title": "How did you knew",
            "title_span": "Fentec?",
            "collect_q": "Collect free points or just ",
            "collect_span": "skip",
            "choice_1": "from the street",
            "choice_2": "social media platform",
            "choice_3": "your friend suggested this app?",
            "choice_3_input": "invitation code"
        },
        "fr": {
            "title": "Où avez vous entendu parler",
            "title_span": " de Fentec`?",
            "collect_q": "Collecter des points gratuits ou simplement ",
            "collect_span": "passer !",
            "choice_1": "Dans la rue ",
            "choice_2": "Plateformes des réseaux sociaux",
            "choice_3": "Votre ami a suggéré cette application?",
            "choice_3_input": "code d'invitation"
        },
        "ar": {
            "title": "كيف عرفت",
            "title_span": "فنتك؟",
            "collect_q": " اجمع النقاط المجانية أو مجرد",
            "collect_span": "تخطي",
            "choice_1": "Dans la rue",
            "choice_2": "منصة التواصل الاجتماعي",
            "choice_3": "اقترح صديقك هذا التطبيق؟",
            "choice_3_input": "رمز الدعوة"
        }
    }
    const [currentLang, setCurrentLag] = useState('ar')
    const [screenContent, setScreenContent] = useState(translations.ar);

    const getStoredLang = async () => {
        const storedLang = await SecureStore.getItemAsync('lang');
        if (storedLang) {
            setScreenContent(translations[storedLang])
            setCurrentLag(storedLang)
        }
    }

    const [invitationCode, setInvitationCode] = useState('')
    const [invitationCodeFocused, setInvitationCodeFocused] = useState(false);
    const handleInvitationCodeFocus = () => {
        setInvitationCodeFocused(true);
    };

    const [selectedChoice, setSelectedChoice] = useState(3)

    useEffect(() => {
        getStoredLang();
        setSelectedChoice(1)
    }, []);

    return (
        <SafeAreaView style={styles.wrapper}>
            <BackgroundImage></BackgroundImage>
            <ScrollView>
                <View style={styles.contianer}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                        <Image source={require('./../assets/imgs/adaptive-icon.png')} alt="fentec logo" style={styles.logo} />
                        <Text style={styles.title}>{screenContent.title}</Text>
                        <Text style={[styles.title, { color: "rgba(255, 115, 0, 1)" }]}>{screenContent.title_span}</Text>
                    </View>
                    <Text style={styles.collect_q}>
                        {screenContent.collect_q}
                        <Text style={{ color: "rgba(255, 115, 0, 1)", fontFamily: "Outfit_600SemiBold" }}>{screenContent.collect_span}</Text>
                    </Text>
                    <View style={styles.choices_container}>
                        <TouchableOpacity onPress={() => setSelectedChoice(1)}>
                            <Text style={[styles.input, { fontSize: 25, padding: 30, textAlign: 'center', color: 'rgba(255, 115, 0, 1)' }, selectedChoice !== 1 && { opacity: .5, color: '#000' }]}>{screenContent.choice_1}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedChoice(2)}>
                            <Text style={[styles.input, { fontSize: 25, padding: 30, textAlign: 'center', color: 'rgba(255, 115, 0, 1)' }, selectedChoice !== 2 && { opacity: .4, color: '#000' }]}>{screenContent.choice_2}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedChoice(3)} style={[styles.input, { gap: 15 }, selectedChoice !== 3 && { opacity: .5, gap: 0 }]}>
                            <Text style={[{ fontFamily: 'Outfit_600SemiBold', fontSize: 25, paddingLeft: 30, paddingRight: 30, textAlign: 'center', lineHeight: 35, color: 'rgba(255, 115, 0, 1)' }, selectedChoice !== 3 && { color: '#000' }]}>{screenContent.choice_3}</Text>
                            <TextInput
                                placeholder={screenContent.choice_3_input}
                                onChangeText={setInvitationCode}
                                value={invitationCode}
                                onFocus={() => handleInvitationCodeFocus()}
                                onBlur={() => setInvitationCodeFocused(false)}
                                style={[
                                    styles.input,
                                    invitationCodeFocused && {
                                        borderColor: 'rgba(255, 115, 0, 1)',
                                        borderWidth: 2
                                    },
                                    selectedChoice !== 3 && { display: 'none' },
                                    currentLang == 'ar' && {
                                        textAlign: 'right',
                                    },
                                ]}

                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.button_text}>Collect free points!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        marginTop: 70
    },
    contianer: {
        padding: '1.25rem',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        zIndex: 3,
        gap: 10
    },
    title: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 35,
    },
    collect_q: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 25,
        maxWidth: 210,
        textAlign: 'center'
    },
    navigate_btn: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: '#ff7300',
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        color: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    navigate_img: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        opacity: 1,
    },
    navigation: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
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
        width: "100%",
    },
    button: {
        padding: 18,
        borderRadius: 1.25 * 16,
        fontSize: 1.25 * 16,
        width: "100%",
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
    choices_container: {
        width: '100%',
        justifyContent: 'center',
        gap: 20,
        padding: 30
    }
});
