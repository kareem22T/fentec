import {
    StyleSheet, Text, TouchableOpacity, SafeAreaView, View, Image
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

export default function PreviewApp({ navigation }) {
    const [slideNo, setSlideNo] = useState(1);
    const translations = {
        "en": {
            "title": "preview"
        },
        "fr": {
            "title": "Aperçu"
        },
        "ar": {
            "title": "عرض"
        }
    }
    const [screenContent, setScreenContent] = useState(translations.ar);

    const getStoredLang = async () => {
        const storedLang = await SecureStore.getItemAsync('lang');
        if (storedLang)
            setScreenContent(translations[storedLang])
    }

    const setIsFirstTime = async () => {
        await SecureStore.setItemAsync('isFirstTime', 'no')
    }

    useEffect(() => {
        getStoredLang();
    }, []);

    return (
        <SafeAreaView style={styles.wrapper}>
            <LoginHeader active={2}></LoginHeader>
            <BackgroundImage></BackgroundImage>
            <View style={styles.contianer}>
                <Text>{screenContent.title} {slideNo}</Text>
                <View style={styles.navigation}>

                    <TouchableOpacity style={styles.navigate_btn} onPress={slideNo > 1 ? () => setSlideNo(slideNo - 1) : () => navigation.navigate('Lang')}>
                        <Image source={require('./../assets/imgs/icons/angle-left.png')} style={styles.navigate_img} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navigate_btn} onPress={slideNo < 3 ? () => setSlideNo(slideNo + 1) : () => setIsFirstTime().then(() => { navigation.navigate('Register') })}>
                        <Image source={require('./../assets/imgs/icons/angle-right.png')} style={styles.navigate_img} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    contianer: {
        padding: '1.25rem',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        zIndex: 3
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
    }
});
