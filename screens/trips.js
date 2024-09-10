import {
    StyleSheet, Text, SafeAreaView, View, Image, ScrollView, TouchableOpacity
} from 'react-native';
import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import Nav from './../components/mainNav';
import axios from 'axios';
import TimerMixin from 'react-timer-mixin';

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

export default function Trips({ navigation, route }) {
    const translations = {
        "en": {
            "trips": "My Trips",
            "points": "Points",
        },
        "fr": {
            "trips": "Mes parcours",
            "points": "Points",
        },
        "ar": {
            "trips": "رحلاتي",
            "points": "نقاط",
        }
    }
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(true);

    const [currentLang, setCurrentLag] = useState('ar')
    const [screenContent, setScreenContent] = useState(translations.ar);

    const getStoredLang = async () => {
        const storedLang = await SecureStore.getItemAsync('lang');
        if (storedLang) {
            setScreenContent(translations[storedLang])
        }
    }

    const [trips, setTrips] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(null);

    const handlePrev = () => {
        if (currentPage > 1) {
            let current = currentPage -1
            getTripHistory(route.params.user.id, current)
        }
    }
    
    const handleNext = () => {
        if (currentPage < lastPage) {
            let current = currentPage + 1
            getTripHistory(route.params.user.id, current)
        }
    }

    const getTripHistory = async (user_id, current = 1) => {
        setLoading(true);
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/get-trips`, {
                api_password: 'Fentec@scooters.algaria',
                page: current,
                user_id: user_id,
            },
            {
                headers: {
                    'AUTHORIZATION': `Bearer ${route.params.token}`
                }
            })
                setLoading(false);
                setErrors(response.data.errors);
                setTrips(response.data.data)
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

    // TimerMixin.setTimeout(() => {
    //     getTripHistory(route.params.user.id)
    // }, 2000);                


    useEffect(() => {
        getTripHistory(route.params.user.id)
        getStoredLang();
    }, []);

    return (
        <SafeAreaView style={[styles.wrapper]}>
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
                    <Text style={[styles.head, {textAlign: 'center'}, currentLang == "ar" && {fontSize: 30, lineHeight: 43}]}>{ screenContent.trips }</Text>
                <View style={styles.contianer}>
                    {                    
                        trips.length > 0 &&
                        (
                            
                            <View style={{width: "100%", alignItems: 'center'}}>
                                {trips.map((trip) => (
                                    <View style={styles.contianer_bg}>
                                        <View style={{ flexDirection: 'row', gap: 15, justifyContent: 'space-between', padding: 10 }}>
                                            <Image source={require('./../assets/imgs/icons/destination_icon.png')} style={{ height: 70, resizeMode: 'contain' }} />
                                            <View style={{ height: 66, justifyContent: 'space-between', width: "60%", gap: 5 }}>
                                                <Text style={{ fontSize: 13, fontFamily: 'Outfit_700Bold', width: "100%" }}>{trip.starting_location}</Text>
                                                <Text style={{ fontSize: 13, fontFamily: 'Outfit_700Bold', width: "100%"  }}>{trip.ending_location}</Text>
                                            </View>
                                            <View style={{ height: 66, justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 18, fontFamily: 'Outfit_700Bold', color: "rgba(255, 115, 0, 1)", textAlign: 'center' }}>{new Date(trip.ended_at).toLocaleDateString("en-US", { day: "2-digit", month: "short" })}</Text>
                                                <Text style={{ fontSize: 18, fontFamily: 'Outfit_700Bold', color: "rgba(255, 115, 0, 1)", textAlign: 'center' }}>- {(trip.duration * 15) }</Text>
                                            </View>
                                        </View>                                
                                    </View>                                
                                ))}
                                {
                                    lastPage > 1 && (
                                        <View style={{flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center', padding: 10}}>
                                            <TouchableOpacity onPress={() => handlePrev()} style={{backgroundColor: "rgba(255, 115, 0, 1)", width:35, height: 35, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center'}}>
                                                <Image source={require('./../assets/imgs/icons/angle-left.png')} style={styles.navigate_img} />
                                            </TouchableOpacity>
                                            <Text style={{fontFamily: "Outfit_600SemiBold", fontSize: 18}}>{currentPage} / {lastPage}</Text>
                                            <TouchableOpacity onPress={() => handleNext()} style={{backgroundColor: "rgba(255, 115, 0, 1)", width:35, height: 35, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center'}}>
                                                <Image source={require('./../assets/imgs/icons/angle-right.png')} style={styles.navigate_img} />
                                            </TouchableOpacity>
                                        </View>
                                            
                                        )
                                    }
                            </View>
                        )
                    }
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
    navigate_img: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        opacity: 1,
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