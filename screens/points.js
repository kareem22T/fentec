import {
    StyleSheet, Text, SafeAreaView, View, Image, ScrollView, Modal
} from 'react-native';
import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import Nav from './../components/mainNav';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';


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

export default function Points({ navigation, route }) {
    const translations = {
        "en": {
            "my_points": "My Points",
            "History": "History",
            "share_1": "Share this code",
            "share_2": "with points  seller",
        },
        "fr": {
            "my_points": "Mes points",
            "History": "Histoire",
            "share_1": "Partage ce code",
            "share_2": "avec vendeur de points",
        },
        "ar": {
            "my_points": "نقاطي",
            "History": "السجل",
            "share_1": "شارك هذا الرمز",
            "share_2": "مع بائع النقاط",
        }
    }
    const [currentLang, setCurrentLag] = useState('ar')
    const [screenContent, setScreenContent] = useState(translations.ar);
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([])

    const getStoredLang = async () => {
        const storedLang = await SecureStore.getItemAsync('lang');
        if (storedLang) {
            setScreenContent(translations[storedLang])
        }
    }

    const getHistory = async (token) => {
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/get-charges-history`, {
                api_password: 'Fentec@scooters.algaria',
            },
                {
                    headers: {
                        'AUTHORIZATION': `Bearer ${token}`
                    }
                },);

            if (response.data.status === true) {
                setLoading(false);
                setHistory(response.data.data.charge_process);
                return response.data.data.charge_process;
            } else {
                setLoading(false);
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

    useEffect(() => {
        getHistory(route.params.token).then(res => {
            setHistory(res)
        })
        getStoredLang();
    }, []);

    return (
        <SafeAreaView style={styles.wrapper}>
            <BackgroundImage></BackgroundImage>
            <Nav active="1" navigation={navigation} user={route.params.user} />
            <ScrollView>
                <View style={styles.contianer}>
                    <View style={styles.profile}>
                        <View style={styles.bg}></View>
                        <View style={styles.head}>
                        {route.params.user && route.params.user.photo_path ? (
                                <Image
                                    source={{ uri: 'https://adminandapi.fentecmobility.com/images/uploads/' + route.params.user.photo_path }}
                                    alt="fentec logo"
                                    style={{ width: 100, height: 100, resizeMode: 'cover', borderRadius: 100, borderWidth: 4, borderColor: 'rgba(255, 115, 0, 1)' }} />
                            ) : (
                                <Image source={require('./../assets/imgs/user.jpg')} alt="fentec logo" style={styles.profile_img} />
                            )}

                            {route.params.user && (
                                <Text style={styles.name}>{route.params.user.name}</Text>
                            )}
                        </View>
                    </View>
                    <Text style={[styles.head, currentLang == "ar" && {fontSize: 30, lineHeight: 43}]}>{screenContent.my_points}</Text>
                    <View>
                        {route.params.user && (
                            <Text style={[styles.head, { color: 'rgba(255, 115, 0, 1)' }]}><FontAwesome5 name="coins" size={24} color="rgba(255, 115, 0, 1)" /> {route.params.user.coins}</Text>
                        )}
                    </View>
                    <View style={[styles.contianer_bg, { padding: 20 }]}>
                        <Text style={[styles.head, { textAlign: 'center', fontSize: 20, lineHeight: 30 }, currentLang == 'ar' && {fontSize: 25, lineHeight: 33}]}>
                            {screenContent.share_1} {'\n'}
                            {screenContent.share_2} 
                        </Text>
                        <View style={[styles.contianer_bg, { padding: 20, width: '100%' }]}>
                        {route.params.user && (
                            <Text style={[styles.head, { color: "rgba(255, 115, 0, 1)", textAlign: 'center' }]}>{ "SpecialUser_" +  route.params.user.id}</Text>
                        )}
                        </View>
                    </View>
                    {                    
                        history.length > 0 &&
                        (
                            <View style={styles.tbody}>
                                <Text style={[styles.head, {textAlign: 'center'}, currentLang == "ar" && {fontSize: 30, lineHeight: 43}]}>{screenContent.History}</Text>
                                {history.map((result) => (
                                    <View style={styles.result} key={result.id}>
                                        <Text style={styles.result_txt}>{result.seller_name}</Text>
                                        <Text style={styles.result_txt}>{new Date(result.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: "2-digit" }) }</Text>
                                        <Text style={[styles.result_txt, { fontFamily: "Outfit_700Bold", color: 'rgba(255, 115, 0, 1)' }]}>{result.amount}</Text>
                                    </View>
                                ))}
                            </View>
                        )
                    }                
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
    tbody: {
        padding: 10,
        gap: 10,
    },
    result_txt: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.15 * 16,
        // fontWeight: 600,
        lineHeight: 1.5 * 16,
        textAlign: 'left',
    },
    result: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.25 * 16,
        // fontWeight: 600,
        lineHeight: 1.5 * 16,
        textAlign: 'left',
        padding: 1.5 * 16,
        borderRadius: 1.25 * 16,
        backgroundColor: "rgba(255, 255, 255, 1)",
        width: "90%",
        color: 'gray',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        margin: 3,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
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