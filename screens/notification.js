import {
    StyleSheet, Text, SafeAreaView, View, Image, ScrollView, Modal
} from 'react-native';
import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import Nav from './../components/mainNav';
import { Ionicons } from '@expo/vector-icons';


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

export default function Notifications({ navigation }) {
    const translations = {
        "en": {
        },
        "fr": {
        },
        "ar": {
        }
    }
    const [currentLang, setCurrentLag] = useState('ar')
    const [screenContent, setScreenContent] = useState(translations.ar);

    const getStoredLang = async () => {
        const storedLang = await SecureStore.getItemAsync('lang');
        if (storedLang) {
            setScreenContent(translations[storedLang])
        }
    }


    useEffect(() => {
        getStoredLang();
    }, []);

    return (
        <SafeAreaView style={[styles.wrapper]}>
            <BackgroundImage></BackgroundImage>
            <Nav active="1" navigation={navigation} />
            <ScrollView>
                <View style={styles.contianer}>
                    <Ionicons name="notifications" size={70} color="rgba(255, 115, 0, 1)" style={{ marginTop: 50 }} />
                    <Text style={styles.head}>Notifications</Text>
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
        gap: 10,
        paddingBottom: 160
    },
    title: {
        fontSize: 1.25 * 16,
        fontFamily: 'Outfit_600SemiBold',
        lineHeight: 1.5 * 16,
        textAlign: 'center',
        marginTop: 70
    },
    profile: {
        // padding: 16,
        paddingTop: 20,
        paddingBottom: 20,
        width: '65%',
        gap: 1.25 * 16,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 60
    },
    head: {
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        fontSize: 25,
        fontFamily: 'Outfit_700Bold'
    },
    profile_img: {
        width: 16 * 7,
        height: 16 * 7,
        borderRadius: 8 * 7,
        resizeMode: "cover",
        borderColor: "rgba(255, 115, 0, 1)",
        borderWidth: 3
    },
    name: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 22,
        textAlign: 'center'
    },
    bg: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        height: "80%",
        backgroundColor: '#ffffff', // Replace with your desired background color
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    contianer_bg: {
        width: '90%',
        backgroundColor: '#ffffff', // Replace with your desired background color
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        padding: 10,
        marginBottom: 10,
        marginTop: 10,
        gap: 10
    },
});