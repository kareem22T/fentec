import {
    StyleSheet, Text, TouchableOpacity, SafeAreaView, View, Image, TextInput, ScrollView
} from 'react-native';
import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const BackgroundImage = () => {
    return (
        <Image source={require('./../assets/imgs/home_bg.png')} style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
        }} />
    )
}

export default function Profile({ navigation }) {
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


    useEffect(() => {
        getStoredLang();
    }, []);

    return (
        <SafeAreaView style={styles.wrapper}>
            <BackgroundImage></BackgroundImage>
            <ScrollView>
                <View style={styles.contianer}>
                    <Text style={styles.title}>
                        Hello friend,{'\n'}
                        Ride responsible, Enjoy freely
                    </Text>
                    <View style={styles.profile}>
                        <View style={styles.bg}></View>
                        <View style={styles.head}>
                            <Image source={require('./../assets/imgs/user.jpg')} alt="fentec logo" style={styles.profile_img} />
                            <Text style={styles.name}>Kareem Mohamed</Text>
                        </View>
                        <View style={styles.details}>
                            <TouchableOpacity style={styles.trips}>
                                <Text style={styles.trips_text}>Trips</Text>
                                <Text style={[styles.trips_text, { color: "rgba(255, 115, 0, 1)" }]}>50</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.trips}>
                                <Text style={styles.trips_text}>Points</Text>
                                <Text style={[styles.trips_text, { color: "rgba(255, 115, 0, 1)" }]}>280</Text>
                            </TouchableOpacity>
                        </View>
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
        fontSize: 1.25 * 16,
        fontFamily: 'Outfit_600SemiBold',
        lineHeight: 1.5 * 16,
        textAlign: 'center',
        marginTop: 70
    },
    profile: {
        padding: 16,
        width: "100%",
        gap: 1.25 * 16,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        // marginTop: 100
    },
    head: {
        alignItems: "center",
        justifyContent: "center",
        gap: 16
    },
    profile_img: {
        width: 16 * 7,
        height: 16 * 7,
        borderRadius: 8 * 7,
        resizeMode: "cover"
    },
    name: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 22
    },
    details: {
        width: '100%',
        flexDirection: "row",
        justifyContent: 'center',
        gap: 1.25 * 16
    },
    trips: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        color: 'black',
        width: '40%',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        gap: 10
    },
    trips_text: {
        fontSize: 1.25 * 16,
        fontFamily: 'Outfit_400Regular',
        textAlign: 'center',
    },
    bg: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        height: "85%",
        backgroundColor: '#ffffff', // Replace with your desired background color
        borderRadius: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    }
});