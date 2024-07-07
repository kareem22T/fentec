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

const Lang = ({ navigation }) => {
    const [lang, setLang] = useState('ar');

    const storeLang = async () => {
        await SecureStore.setItemAsync('lang', lang)
        await SecureStore.setItemAsync('isFirstTime', 'no')
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <LoginHeader active={1}></LoginHeader>
            <BackgroundImage></BackgroundImage>
            <View style={styles.contianer}>
                <Text style={styles.heading}>
                    chose app’s {'\n'}
                    language
                </Text>
                <View style={styles.btns}>
                    <TouchableOpacity style={[styles.choose_btn, lang == 'ar' && {
                        borderColor: 'rgba(255, 115, 0, 1)',
                        backgroundColor: '#fff',
                        borderWidth: 3,
                        opacity: 1
                    }]} onPress={() => setLang('ar')}>
                        <Text style={styles.btn_big_text_ar}>مرحباً</Text>
                        <Text style={styles.btn_small_text_ar}>العربية</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.choose_btn, lang == 'en' && {
                        borderColor: 'rgba(255, 115, 0, 1)',
                        backgroundColor: '#fff',
                        borderWidth: 3,
                        opacity: 1
                    }]} onPress={() => setLang('en')}>
                        <Text style={styles.btn_big_text}>Welcome</Text>
                        <Text style={styles.btn_small_text}>English</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.choose_btn, lang == 'fr' && {
                        borderColor: 'rgba(255, 115, 0, 1)',
                        backgroundColor: '#fff',
                        borderWidth: 3,
                        opacity: 1
                    }]} onPress={() => setLang('fr')}>
                        <Text style={styles.btn_big_text}>Bienvenue</Text>
                        <Text style={styles.btn_small_text}>Française</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.navigation}>
                    <Text style={{ opacity: 0 }}>d</Text>
                    <TouchableOpacity style={styles.navigate_btn} onPress={() => storeLang().then(() => {
                        navigation.navigate('Register')
                    })}>
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
        padding: 1.25 * 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        zIndex: 3
    },
    heading: {
        fontSize: 2.5 * 16,
        fontWeight: '600',
        lineHeight: 55,
        letterSpacing: 0,
        textAlign: 'center',
        fontFamily: 'Outfit_600SemiBold',
        marginTop: 15
    },
    btns: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    choose_btn: {
        cursor: 'pointer',
        flexDirection: 'column',
        padding: 16,
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: 20,
        transition: 'all .3s ease-in',
        width: '90%',
        opacity: .6
    },
    btn_big_text: {
        fontSize: 2.3 * 16,
        fontFamily: 'Outfit_600SemiBold',
        lineHeight: 3.2 * 16,
        letterSpacing: 0,
        textAlign: 'center',
    },
    btn_small_text: {
        fontSize: 1.5 * 16,
        fontFamily: 'Outfit_500Medium',
        lineHeight: 2.4 * 16,
        letterSpacing: 0,
        textAlign: 'center',
    },
    btn_big_text_ar: {
        fontSize: 2.3 * 16,
        fontFamily: 'Outfit_600SemiBold',
        lineHeight: 3.2 * 16,
        letterSpacing: 0,
        textAlign: 'center',
    },
    btn_small_text_ar: {
        fontSize: 1.5 * 16,
        fontFamily: 'Outfit_500Medium',
        lineHeight: 2.4 * 16,
        letterSpacing: 0,
        textAlign: 'center',
    },
    navigate_btn: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: '#ff7300',
        boxShadow: '0 4 4 0 rgba(0, 0, 0, 0.25)',
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
    }
});

export default Lang;