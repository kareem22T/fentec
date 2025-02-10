import {
    StyleSheet, Text, SafeAreaView, View, Image, ScrollView, ActivityIndicator, TouchableOpacity
} from 'react-native';
import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import Nav from './../components/mainNav';
import TimerMixin from 'react-timer-mixin';
import { Ionicons } from '@expo/vector-icons';
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

export default function Notifications({ navigation, route }) {
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
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(null);

    const getStoredLang = async () => {
        const storedLang = await SecureStore.getItemAsync('lang');
        if (storedLang) {
            setScreenContent(translations[storedLang])
        }
    }

    const handlePrev = () => {
        if (currentPage > 1) {
            let current = currentPage -1
            getNotificationHistory(route.params.user.id, current)
        }
    }
    
    const handleNext = () => {
        if (currentPage < lastPage) {
            let current = currentPage + 1
            getNotificationHistory(route.params.user.id, current)
        }
    }

    const getNotificationHistory = async (user_id, current = 1) => {
        setLoading(true);
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/get-user-notification`, {
                api_password: 'Fentec@scooters.algaria',
                page: current,
                user_id: user_id,
            })
                setLoading(false);
                setErrors(response.data.errors);
                setNotifications(response.data.data)
                setCurrentPage(response.data.current_page)
                setLastPage(response.data.last_page)
                TimerMixin.setTimeout(() => {
                    setErrors([]);
                }, 2000);                
        } catch (error) {
            setLoading(false);
            setErrors(["Server error, try again later."]);
            console.error(error);
        }
    }


    useEffect(() => {
        getNotificationHistory(route.params.user.id)
        getStoredLang();
    }, []);

    return (
        <SafeAreaView style={[styles.wrapper]}>
            {loading && (
                <View style={{
                    width: '100%',
                    height: '100%',
                    zIndex: 9999999999,
                    justifyContent: 'center',
                    alignContent: 'center',
                    marginTop: 22,
                    backgroundColor: '#fff',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}>
                    <ActivityIndicator size="200px" color="#ff7300" />
                </View>
            )}

            <BackgroundImage></BackgroundImage>
            <Nav active="1" navigation={navigation} />
            <ScrollView>
                <View style={styles.contianer}>
                    <Ionicons name="notifications" size={70} color="rgba(255, 115, 0, 1)" style={{ marginTop: 50 }} />
                    <Text style={styles.head}>Notifications</Text>
                    {                    
                        notifications.length > 0 &&
                        (
                            <View style={{width: "100%", alignItems: 'center'}}>
                                {notifications.map((result) => (
                                    <View style={styles.result} key={result.id}>
                                        <Text style={styles.result_txt}>{result.title}</Text>
                                        <Text style={[styles.result_txt, {fontFamily: "Outfit_500Medium", fontSize: 14}]}>{result.body}</Text>
                                        <Text style={[styles.result_txt, {fontFamily: "Outfit_500Medium", fontSize: 14}]}>{new Date(result.created_at).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                                    </View>
                                ))}
                                <View style={{flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center', padding: 10}}>
                                    <TouchableOpacity onPress={() => handlePrev()} style={{backgroundColor: "rgba(255, 115, 0, 1)", width:35, height: 35, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center'}}>
                                        <Image source={require('./../assets/imgs/icons/angle-left.png')} style={styles.navigate_img} />
                                    </TouchableOpacity>
                                    <Text style={{fontFamily: "Outfit_600SemiBold", fontSize: 18}}>{currentPage} / {lastPage}</Text>
                                    <TouchableOpacity onPress={() => handleNext()} style={{backgroundColor: "rgba(255, 115, 0, 1)", width:35, height: 35, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center'}}>
                                        <Image source={require('./../assets/imgs/icons/angle-right.png')} style={styles.navigate_img} />
                                    </TouchableOpacity>
                                </View>
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
    result_txt: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.15 * 16,
        // fontWeight: 600,
        lineHeight: 1.5 * 16,
        textAlign: 'left',
    },
    navigate_img: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        opacity: 1,
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
        gap: 10,
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