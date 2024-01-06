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

export default function YouWon({ navigation }) {
    const translations = {
        "en": {
            "title": "Thanks for joining",
            "title_span": "Fentec",
            "collect_q": "You won free",
            "collect_span": "+10 Points",
            "button": "Use them!"
        },
        "fr": {
            "title": "Merci de rejoindre",
            "title_span": " de Fentec`",
            "collect_q": "Vouz avez gagne",
            "collect_span": "+10 points",
            "button": "Utilisez les!"
        },
        "ar": {
            "title": "شكرا للانضمام",
            "title_span": "فنتك",
            "collect_q": " قد ربحت مجاناً",
            "collect_span": "+10 نقاط",
            "button": "استخدمهم الان!"
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
                        {'\n'}
                        <Text style={{ color: "rgba(255, 115, 0, 1)", fontFamily: "Outfit_600SemiBold" }}>{screenContent.collect_span}</Text>
                    </Text>
                    <Image source={require('./../assets/imgs/avatar.png')} alt="fentec logo" style={styles.avatar} />
                    <View style={styles.choices_container}>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
                            <Text style={styles.button_text}>{screenContent.button}</Text>
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
    avatar: {
        width: "65%",
        marginRight: 20,
        marginTop: 20,
        resizeMode: 'contain'
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
        paddingLeft: 30,
        paddingRight: 30
    }
});
