import {
    StyleSheet, Text, TouchableOpacity, SafeAreaView, View, Image,
    ScrollView
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
            "title": "preview",
            "screen_1_title": "Create an account and download the national ID card",
            "screen_1_title_2": "Charge your wallet from the nearest FentecPay point of sale",
            "screen_2_title": "Find the nearest scooter and scan the QR code",
            "screen_2_title_2": "Remove the safety belt and put on the helmet for your safety",
            "screen_3_title": "When you are finished, please park the trout in a safe place and return the safety harness",
            "screen_3_title_2": "Tirez sur la truite. Le vol est terminé avec succès.",
        },
        "fr": {
            "title": "Aperçu",
            "screen_1_title": "Créez un compte et téléchargez la carte d'identité nationale",
            "screen_1_title_2": "Rechargez votre portefeuille depuis le point de vente FentecPay le plus proche",
            "screen_2_title": "Trouvez le scooter le plus proche et scannez le code QR",
            "screen_2_title_2": "Retirez la ceinture de sécurité et mettez le casque pour votre sécurité",
            "screen_3_title": "Lorsque vous avez terminé, veuillez garer la truite dans un endroit sûr et rendre le harnais de sécurité.",
            "screen_3_title_2": "Shoot the trout. The flight is completed successfully",
        },
        "ar": {
            "title": "عرض",
            "screen_1_title": "إفتح حساب و حمل بطاقة التعريف الوطني",
            "screen_1_title_2": "إشحن محفظتك من اقرب نقطة بيع تابعة ل FentecPay",
            "screen_2_title": "إبحث عن أقرب تروتينات و قم بمسح QR code",
            "screen_2_title_2": "قم بنزع رباط الامان وضع الخوذة لسلامتك",
            "screen_3_title": "عند الانتهاء الرجاء ، ركن التروتينات في مكان آمن و إرجاع رباط الامان",
            "screen_3_title_2": "قم بتصوير التروتينات يتم إنهاء الرحلة بنجاح",
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
        <ScrollView style={styles.wrapper} contentContainerStyle={{flexGrow: 1}}>
            <LoginHeader active={2}></LoginHeader>
            <BackgroundImage></BackgroundImage>
            <View style={styles.contianer}>
                {
                    slideNo == 1 && (
                        <View style={styles.screenContainer}>
                            <View style={styles.cardWrapper}>
                                <Image source={require('./../assets/imgs/Vector.png')} style={styles.cardImage}/>
                                <Text style={styles.screenText}>
                                    {screenContent.screen_1_title}
                                </Text>
                            </View>
                            <View style={styles.cardWrapper}>
                                <Image source={require('./../assets/imgs/ph_hand-coins-fill.png')} style={styles.cardImage}/>
                                <Text style={styles.screenText}>
                                    {screenContent.screen_1_title_2}
                                </Text>
                            </View>
                        </View>
                    )
                }

                {
                    slideNo == 2 && (
                        <View style={styles.screenContainer}>
                            <View style={styles.cardWrapper}>
                                <Image source={require('./../assets/imgs/mage_qr-code-fill.png')} style={styles.cardImage}/>
                                <Text style={styles.screenText}>
                                    {screenContent.screen_2_title}
                                </Text>
                            </View>
                            <View style={styles.cardWrapper}>
                                <Image source={require('./../assets/imgs/ph_baseball-helmet-fill.png')}  style={styles.cardImage}/>
                                <Text style={styles.screenText}>
                                    {screenContent.screen_2_title_2}
                                </Text>
                            </View>
                        </View>
                    )
                }

                {
                    slideNo == 3 && (
                        <View style={styles.screenContainer}>
                            <View style={styles.cardWrapper}>
                                <Image source={require('./../assets/imgs/ic_round-lock.png')}  style={styles.cardImage}/>
                                <Text style={styles.screenText}>
                                    {screenContent.screen_3_title}
                                </Text>
                            </View>
                            <View style={styles.cardWrapper}>
                                <Image source={require('./../assets/imgs/teenyicons_camera-solid.png')}  style={styles.cardImage}/>
                                <Text style={styles.screenText}>
                                    {screenContent.screen_3_title_2}
                                </Text>
                            </View>
                        </View>
                    )
                }
                {
                    slideNo == 3 && (
                        <View style={styles.screenContainer}>
                            <View style={styles.cardWrapper}>
                                <Image source={require('./../assets/imgs/ic_round-lock.png')}  style={styles.cardImage}/>
                                <Text style={styles.screenText}>
                                    {screenContent.screen_3_title}
                                </Text>
                            </View>
                            <View style={styles.cardWrapper}>
                                <Image source={require('./../assets/imgs/teenyicons_camera-solid.png')}  style={styles.cardImage}/>
                                <Text style={styles.screenText}>
                                    {screenContent.screen_3_title_2}
                                </Text>
                            </View>
                        </View>
                    )
                }

                <View style={styles.navigation}>

                    <TouchableOpacity style={styles.navigate_btn} onPress={slideNo > 1 ? () => setSlideNo(slideNo - 1) : () => navigation.navigate('chooseLanguage')}>
                        <Image source={require('./../assets/imgs/icons/angle-left.png')} style={styles.navigate_img} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navigate_btn} onPress={slideNo < 4 ? () => setSlideNo(slideNo + 1) : () => setIsFirstTime().then(() => { navigation.navigate('Register') })}>
                        <Image source={require('./../assets/imgs/icons/angle-right.png')} style={styles.navigate_img} />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
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
    },
    screenContainer: {
        width: "100%",
        height: "85%",
        gap: 24,
        padding: 24,
        justifyContent: "center",
        alignItems: "center"
    },
    cardImage: {
        width: 150,
        height: 150,
        resizeMode: "contain"
    },
    cardWrapper: {
        justifyContent: 'center',
        alignItems: "center",
        gap: 40
    },
    screenText: {
        fontSize: 23,
        fontFamily: "Outfit_400Regular",
        textAlign: "center"
    }
});
