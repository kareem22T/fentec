import {
    StyleSheet, Text, TouchableOpacity, SafeAreaView, View, Image, TextInput, ScrollView, ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Nav from './../components/mainNav';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { AppState } from 'react-native';
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
    const [appState, setAppState] = useState(AppState.currentState);
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
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentLang, setCurrentLag] = useState('ar')
    const [screenContent, setScreenContent] = useState(translations.ar);
    const [user, setUser] = useState(null)
    const [notificationToken, setNotificationToken] = useState('')
    const [token, setToken] = useState('')

    const getStoredLang = async () => {
        const storedLang = await SecureStore.getItemAsync('lang');
        if (storedLang) {
            setScreenContent(translations[storedLang])
            setCurrentLag(storedLang)
        }
    }

    const getStoredToken = async () => {
        const user_token = await SecureStore.getItemAsync('user_token');
        if (user_token)
            return user_token

        return '';
    }

    const checkIsFirstTime = async () => {
        const isFirst = await SecureStore.getItemAsync('isFirstTime')
        if (isFirst)
            return !(isFirst === 'no')

        return true;
    }

    const getUser = async (token, notificationToken) => {
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/get-user`, {
                api_password: 'Fentec@scooters.algaria',
                notification_token: notificationToken,
            },
                {
                    headers: {
                        'AUTHORIZATION': `Bearer ${token}`
                    }
                },);

            if (response.data.status === true) {
                setLoading(false);
                setErrors([]);
                setUser(response.data.data.user);
                return response.data.data.user;
            } else {
                setLoading(false);
                setErrors(response.data.errors);
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

    const seenVerifyMsg = async (token) => {
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/seen-approving-msg`, {
                api_password: 'Fentec@scooters.algaria',
            },
                {
                    headers: {
                        'AUTHORIZATION': `Bearer ${token}`
                    }
                },);

            if (response.data.status === true) {
                setLoading(false);
                setErrors([]);
            } else {
                setLoading(false);
                setErrors(response.data.errors);
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

    const showScreens = (first = true, user, token) => {
        if (!user && first) {
            navigation.navigate('Welcome')
        } else if (!user && !first) {
            navigation.navigate('Login')
        } else if (user.verify && user.name != null) {
            setLoading(false)
        } else if (user && !user.verify) {
            navigation.navigate('Verify', { email: user.email, token: token });
        } else if (!user.name) {
            navigation.navigate('Last', { email: user.email, token: token });
        }
    }

    useEffect(() => {
        getStoredToken().then((res) => {
            let token = res
            checkIsFirstTime().then((isfirst) => {
                if (token) {
                    setToken(token)
                    getUser(token).then((user) => {
                        showScreens(isfirst, user, token)
                        if (user && user.approved && !user.approving_msg_seen)
                            seenVerifyMsg(token)
                    })
                } else {
                    showScreens(isfirst, res)
                }
            })
        });
        getStoredLang();
    }, []);
    return (
        <SafeAreaView style={[styles.wrapper]}>
            <BackgroundImage></BackgroundImage>
            <Nav active="1" navigation={navigation} user={user} />
            <TouchableOpacity onPress={() => navigation.navigate('Notifications', { user: user })} style={{ position: 'absolute', zIndex: 999, top: 30, right: 40 }}>
                <Ionicons name="notifications" size={40} color="rgba(255, 115, 0, 1)" />
            </TouchableOpacity>
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
            <ScrollView>
                <View style={styles.contianer}>
                    {(user && user.rejected == true) && (<Text style={[styles.title, styles.approvingAlert]}>
                        You Account has been rejected because: {'\n'}
                        <Text>
                            {user.rejection_reason} {'\n'}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Last', { user: user, token: token })}><Text style={{ color: '#fff', fontFamily: 'Outfit_600SemiBold', fontSize: 20, textAlign: 'center' }}>Edit Profile Now</Text></TouchableOpacity>
                    </Text>)}
                    {(user && !user.approved && !user.rejected) && (<Text style={[styles.title, styles.approvingAlert]}>
                        Your Account is under review we will approve your account in some hours ! {'\n'}
                        <Text>
                            You will receive an Email with approve or reject if your information wasn't correct.
                        </Text>
                    </Text>)}
                    {(user && user.approved == true && !user.approving_msg_seen) && (<Text style={[styles.title, styles.approvingAlert, { backgroundColor: "#12c99b", borderColor: '#12c99b' }]}>
                        Your Account has been approved ! {'\n'}
                        <Text>
                            You can enjoy the experience now.
                        </Text>
                    </Text>)}
                    <Text style={[styles.title, ((user && !user.approved) || (user && !user.approving_msg_seen)) && { marginTop: 10 }]}>
                        Hello friend,{'\n'}
                        Ride responsible, Enjoy freely
                    </Text>
                    <View style={styles.profile}>
                        <View style={styles.bg}></View>
                        <View style={styles.head}>
                            {user && user.photo_path ? (
                                <Image
                                    source={{ uri: 'https://adminandapi.fentecmobility.com/images/uploads/' + user.photo_path }}
                                    alt="fentec logo"
                                    style={styles.profile_img}
                                />
                            ) : (
                                <Image source={require('./../assets/imgs/user.jpg')} alt="fentec logo" style={styles.profile_img} />
                            )}
                            {user && (
                                <Text style={styles.name}>{user.name}</Text>
                            )}
                        </View>
                        <View style={styles.details}>
                            <TouchableOpacity style={styles.trips} onPress={() => navigation.navigate('Trips', { user: user })}>
                                <Text style={styles.trips_text}>Trips</Text>
                                <Text style={[styles.trips_text, { color: "rgba(255, 115, 0, 1)" }]}>0</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.trips} onPress={() => navigation.navigate('Points', { user: user })}>
                                <Text style={styles.trips_text}>Points</Text>
                                {user && (
                                    <Text style={[styles.trips_text, { color: "rgba(255, 115, 0, 1)" }]}>{user.coins}</Text>
                                )}

                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.contianer_bg}>
                        <Image source={require('./../assets/imgs/map.png')} style={{ width: '100%', height: 200, borderRadius: 16, overflow: 'hidden' }} />
                        <Text style={styles.navigate_Text}>Navigate to nearest points seller</Text>
                    </View>
                    <View style={styles.profile}>
                        <View style={styles.bg}></View>
                        <View style={styles.head}>
                            <Image source={require('./../assets/imgs/share.png')} alt="fentec logo" style={{ width: 250, height: 120, resizeMode: 'contain' }} />
                            <Text style={styles.name}>
                                Share app with your {'\n'}
                                friends to get free points
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.btn}><Text style={styles.button_text}>Share</Text></TouchableOpacity>
                    </View>
                    <View style={styles.how_container}>
                        <View style={styles.how_element}>
                            <Ionicons name="ios-help-circle-outline" size={60} color="rgba(255, 115, 0, 1)" />
                            <Text style={styles.name}>
                                How to {'\n'}
                                use the {'\n'}
                                application
                            </Text>
                        </View>
                        <View style={styles.how_element}>
                            <MaterialCommunityIcons name="human-scooter" size={60} color="rgba(255, 115, 0, 1)" />
                            <Text style={styles.name}>
                                How to {'\n'}
                                ride the {'\n'}
                                scooter
                            </Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={[styles.name, { fontSize: 22, fontFamily: 'Outfit_700Bold' }]}>Contact us</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 15, marginBottom: 15 }}>
                            <Entypo name="facebook" size={35} color="'rgba(255, 115, 0, 1)'" />
                            <FontAwesome5 name="instagram-square" size={35} color="'rgba(255, 115, 0, 1)'" />
                            <MaterialIcons name="email" size={44} color="'rgba(255, 115, 0, 1)'" />
                            <FontAwesome name="phone-square" size={37} color="'rgba(255, 115, 0, 1)'" />
                        </View>
                        <Text style={[styles.name, { color: 'rgba(255, 115, 0, 1)' }]}>
                            Terms and conditions {'\n'}
                            Service agreement {'\n'}
                            Privacy police
                        </Text>
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
    approvingAlert: {
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ab002b",
        backgroundColor: '#e41749',
        width: '90%',
        fontFamily: 'Outfit_400Regular',
        color: '#fff',
        fontSize: 16
    },
    profile: {
        // padding: 16,
        paddingTop: 16,
        paddingBottom: 16,
        width: '90%',
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
        fontSize: 22,
        textAlign: 'center'
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
    navigate_Text: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 18,
        textAlign: 'center',
        margin: 5,
        color: 'rgba(255, 115, 0, 1)'
    },
    btn: {
        paddingTop: 16,
        paddingBottom: 18,
        borderRadius: 1.25 * 16,
        backdropFilter: "blur(1)",
        width: "90%",
        backgroundColor: "#ff7300",
        transition: "all .3s ease-in",
        border: "3 solid #ff7300",
        // marginBottom: 1.25 * 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button_text: {
        color: "#fff",
        fontFamily: 'Outfit_700Bold',
        fontSize: 28,
        textAlign: "center",
    },
    how_container: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20
    },
    how_element: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
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
        padding: 14,
        marginBottom: 10,
        marginTop: 10,
        gap: 10,
        width: '48%'
    }
});