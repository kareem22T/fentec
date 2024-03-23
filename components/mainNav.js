import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import * as React from 'react';
import { Entypo, FontAwesome, Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import QrScanner from './../screens/qrScanner'
import { useState, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import { name as appName } from './../app.json';
import PushNotification from 'react-native-push-notification';
import * as SecureStore from 'expo-secure-store';
import TimerMixin from 'react-timer-mixin';
import Slider from 'react-native-slide-to-unlock';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';

PushNotification.createChannel(
  {
    channelId: 'default-channel-id',
    channelName: 'Default Channel',
    channelDescription: 'A default notification channel',
    soundName: 'default',
    importance: 4,
    vibrate: true,
  },
  created => console.log(`Channel created: ${created}`)
);

// Register the app
AppRegistry.registerComponent(appName, () => App);

export default function LoginHeader(props) {
    navigation = props.navigation
    let goToMyLocation = props.goToMyLocation
    let getNearstScooter = props.getNearstScooter
    let closeDetailsScooter = props.closeDetailsScooter
    let navToScooter = props.navToScooter
    let closeScanner = props.closeScanner
    let showQrScanner = props.showQrScanner
    let user = props.user

    const [serialNum, setSerialNum] = useState('')
    const [serialNumfocused, setSerialNumfocused] = useState(false);
    const [isOnJourney, setIsOnJourney] = useState(false);
    const [token, setToken] = useState('')

    const handelserialNumfocused = () => {
        setSerialNumfocused(true);
    };

    const getisOnJourney = async () => {
        const is = await SecureStore.getItemAsync('is_on_journey');
        if (is)
            return is

        return '';
    }
    const getStoredToken = async () => {
        const user_token = await SecureStore.getItemAsync('user_token');
        if (user_token)
            return user_token

        return '';
    }
    const unlockManualy = async () => {
        // console.log("hello");
        try {
            setLoading(true)
            const response = await axios.post("https://adminandapi.fentecmobility.com/unlock-scooter", {
                api_password: 'Fentec@scooters.algaria',
                scooter_serial: serialNum
            },
            {
                headers: {
                    'AUTHORIZATION': `Bearer ${token}`
                }
            },);
            if (response.data.status === true) {
                await SecureStore.setItemAsync('is_on_journey', "true");
                setSuccessMsg(response.data.message)
                TimerMixin.setTimeout(() => {
                    props.navigation.push('Map', {user: user})
                }, 2000)    
            } else {
                setLoading(false);
                setErrors(response.data.errors);
                TimerMixin.setTimeout(() => {
                    setErrors([]);
                }, 2000);
            }

            setLoading(false);

        } catch (error) {
            setLoading(false);
            setErrors(["Something wrong, try again!"]);
            console.error(error);
            TimerMixin.setTimeout(() => {
                setErrors([]);
            }, 3000)
        }    
    }
    
    const handleEndJourney = async () => {
        // setIsOnJourney(false)
        try {
            setLoading(true)
            const response = await axios.post("https://adminandapi.fentecmobility.com/lock-scooter", {
                api_password: 'Fentec@scooters.algaria',
            },
            {
                headers: {
                    'AUTHORIZATION': `Bearer ${token}`
                }
            },);
            if (response.data.status === true) {
                setIsOnJourney(false)
                await SecureStore.setItemAsync('is_on_journey', "");
                setSuccessMsg(response.data.message);
                navigation.reset({
                    index: 0,
                    routes: [
                    {
                        name: 'takePhoto',
                        params: {token: token}, // No params to pass in this case
                    },
                    ],
                });

                TimerMixin.setTimeout(() => {
                    setSuccessMsg("")
                    setLoading(false)
                }, 3000)    
            } else {
                setErrors(response.data.errors);
            }
                        
        } catch (error) {
            // setIsOnJourney(true)
            setErrors(["Something wrong, try again!"]);
            console.error(error);
            TimerMixin.setTimeout(() => {
                setErrors([]);
            }, 3000)
        }    

    }
    const [successMsg, setSuccessMsg] = useState('');
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        getStoredToken().then(res => {
            setToken(res)
        })

        getisOnJourney().then(res => {
            if (res && res == "true")
                setIsOnJourney(true)
        })
        const getFCMToken = async () => {
          };
        
          getFCMToken();
          messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
          });
          const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('Received FCM Notification:', remoteMessage);
            if(remoteMessage.data && remoteMessage.data.unlock) {
                setSuccessMsg("Trip Started Successfuly, Enjoy it!");
                setIsOnJourney(true)
                await SecureStore.setItemAsync('is_on_journey', "true");
                TimerMixin.setTimeout(() => {
                    setSuccessMsg("");
                }, 3000)

            }
                
            if(remoteMessage.data && remoteMessage.data.lock) {
                setSuccessMsg("Trip Ended Successfuly, Hop you Enjoied it!");
                setIsOnJourney(false)
                await SecureStore.setItemAsync('is_on_journey', "");
                TimerMixin.setTimeout(() => {
                    setSuccessMsg("");
                }, 3000)

            }
                
          });  
      
          return unsubscribe;
    }, []);

    return (
        <>
            <Text style={{
                position: 'absolute', top: 0 + 50, right: 20, color: "#fff",
                padding: 1 * 16,
                marginLeft: 10,
                fontSize: 1 * 16,
                backgroundColor: '#12c99b',
                fontFamily: 'Outfit_600SemiBold',
                borderRadius: 1.25 * 16,
                zIndex: 9999999999,
                display: successMsg == '' ? 'none' : 'flex'
            }}>{successMsg}</Text>
            <Text style={{
                position: 'absolute', top: 70, right: 20, color: "#fff",
                padding: 1 * 16,
                marginLeft: 10,
                fontSize: 1 * 16,
                backgroundColor: '#e41749',
                fontFamily: 'Outfit_600SemiBold',
                // fontWeight: 600,
                borderRadius: 1.25 * 16,
                zIndex: 9999999999,
                display: errors.length ? 'flex' : 'none'
            }}>{errors.length ? errors[0] : ''}</Text>

            <View style={styles.wrapper}>
                {
                    !isOnJourney && props.active == 2? (
                        props.showIotDetails === false && props.showScanner === false ? (
                            <View style={{ flexDirection: 'row', gap: 7 }}>
                                <TouchableOpacity style={[styles.choiceWrapper, styles.choiceActive]} onPress={getNearstScooter}>
                                    <Entypo name="direction" size={24} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.choiceWrapper, styles.choiceActive, { backgroundColor: 'rgba(255, 115, 0, 1)' }]} onPress={showQrScanner}>
                                    <MaterialIcons name="qr-code-scanner" size={24} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.choiceWrapper, styles.choiceActive]} onPress={goToMyLocation}>
                                    <MaterialIcons name="my-location" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                        ) : (props.showScanner === false ? (
                            <View style={[styles.choiceWrapper, styles.choiceActive, { width: '90%', gap: 10, position: 'relative' }]}>
                                <View>
                                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}><Text><Entypo name="battery" size={30} color="black" /> </Text><Text style={{ fontSize: 18 }}>{props.battary_charge + "% Battary Charge"}</Text></View>
                                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}><Text><FontAwesome5 name="money-bill" size={24} color="black" /></Text><Text style={{ fontSize: 18 }}>5 points/minute</Text></View>
                                </View>
                                <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between', marginTop: 10 }}>
                                    <TouchableOpacity style={[styles.choiceWrapper, styles.choiceActive, { backgroundColor: 'rgba(255, 115, 0, 1)', width: 50, padding: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 8 }]} onPress={showQrScanner} ><MaterialCommunityIcons name="qrcode-scan" size={28} color="black" /></TouchableOpacity>
                                    <Text style={[styles.choiceWrapper, styles.choiceActive, { width: '58%', textAlign: 'center', fontSize: 18, fontFamily: 'Outfit_600SemiBold', padding: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 8 }]}>{props.scooterDurationFar + " far"}</Text>
                                    <TouchableOpacity onPress={navToScooter} style={[styles.choiceWrapper, styles.choiceActive, { backgroundColor: 'rgba(255, 115, 0, 1)', width: 50, padding: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 8 }]}><FontAwesome5 name="directions" size={30} color="black" /></TouchableOpacity>
                                </View>
                                <TouchableOpacity style={{ position: 'absolute', top: 15, right: 15 }} onPress={closeDetailsScooter}><AntDesign name="close" size={28} color="red" /></TouchableOpacity>
                            </View>
                        ) : (
                            <View style={[styles.choiceWrapper, styles.choiceActive, { width: '90%', gap: 10, position: 'relative', }]}>
                                <QrScanner navigation={navigation} user={user}/>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                                    <TextInput
                                        placeholder={'Write code manually'}
                                        onChangeText={setSerialNum}
                                        value={serialNum}
                                        onFocus={() => handelserialNumfocused()}
                                        onBlur={() => setSerialNumfocused(false)}
                                        keyboardType="numeric"
                                        style={[
                                            styles.input,
                                            serialNumfocused && {
                                                borderColor: 'rgba(255, 115, 0, 1)',
                                                borderWidth: 2
                                            },
                                        ]}
        
                                    />
                                    <TouchableOpacity onPress={() => unlockManualy()} style={[styles.choiceWrapper, styles.choiceActive, { backgroundColor: 'rgba(255, 115, 0, 1)', width: 60, padding: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 16 }]}><FontAwesome5 name="unlock" size={30} color="black" /></TouchableOpacity>
                                </View>
                                <TouchableOpacity style={{ position: 'absolute', top: -8, right: -8 }} onPress={closeScanner}><Text style={{width: 30, height: 30, backgroundColor: "red", borderRadius: 40, fontFamily: "Outfit_700Bold", fontSize: 18, color: "white", textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>x</Text></TouchableOpacity>
                            </View>
                        )
                        )
                    ) : (
                        isOnJourney ? (
                            loading ? (
                                <View style={{
                                    margin: 8,
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '80%',
                                    borderRadius: 50,
                                    maxWidth: 300,
                                    borderColor: "rgba(255, 115, 0, 1)",
                                    borderWidth: 2,
                                    elevation: 4,
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 0,
                                        height: 4,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 4,

                                }}>
                                <ActivityIndicator size="200px" color="#ff7300" />
                                </View>
                            ) : (
                                <Slider
                                    childrenContainer={{ backgroundColor: 'red' }}
                                    onEndReached={() => {
                                        handleEndJourney()
                                    }}
                                    containerStyle={{
                                        margin: 8,
                                        backgroundColor: 'white',
                                        borderRadius: 10,
                                        overflow: 'hidden',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '80%',
                                        borderRadius: 50,
                                        maxWidth: 300,
                                        borderColor: "rgba(255, 115, 0, 1)",
                                        borderWidth: 2,
                                        elevation: 4,
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 4,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 4,
                                    }}
                                    sliderElement={
                                        <View style={{
                                            borderRadius: 50,
                                            elevation: 4,
                                            shadowColor: '#000',
                                            shadowOffset: {
                                                width: 0,
                                                height: 4,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 4,
                                            width: 50,
                                            height: 50,
                                            backgroundColor: "#fff",
                                            margin: 5,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderWidth: 1,
                                            borderColor: "#00b341"
                                        }}>
            
                                                <Image
                                                    style={{
                                                        width: 30,
                                                        margin: 4,
                                                        height: 30,
                                                        backgroundColor: 'white',
                                                        
                                                }}
                                                source={require('./../assets/imgs/check-green.png')}
                                            />
                                            </View>
                                        }
                                        >
                                        <Text style={{backgroundColor: "white", fontFamily: "Outfit_600SemiBold", fontSize: 18, textAlign: "center", paddingLeft: 30}}>{'Slide To End Journey ' + '\n' + 'And Take photo'}</Text>
                                </Slider>
                            )
                        ) : 
                        (
                            <></>
                        )
                    )
                }
                <View style={styles.contianer}>
                    <TouchableOpacity style={[styles.choiceWrapper, props.active == 1 && styles.choiceActive]} onPress={() => navigation.push('Profile', { user: user })}>
                        <Entypo name="home" size={40} color={props.active == 1 ? 'rgba(255, 115, 0, 1)' : 'black'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.choiceWrapper, props.active == 2 && styles.choiceActive]} onPress={() => navigation.push('Map', { user: user })}>
                        <Ionicons name="map-sharp" size={40} color={props.active == 2 ? 'rgba(255, 115, 0, 1)' : 'black'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.choiceWrapper, props.active == 3 && styles.choiceActive]} onPress={() => navigation.push('Account', { user: user })}>
                        <FontAwesome name="user" size={40} color={props.active == 3 ? 'rgba(255, 115, 0, 1)' : 'black'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.choiceWrapper, props.active == 3 && styles.choiceActive, { display: 'none' }]} onPress={() => navigation.push('Account', { user: user })}>
                        <FontAwesome name="user" size={40} color={props.active == 3 ? 'rgba(255, 115, 0, 1)' : 'black'} />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        paddingBottom: 35,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        position: 'absolute',
        zIndex: 999,
        gap: 15
    },
    contianer: {
        width: '70%',
        padding: 15,
        borderRadius: 25,
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    choiceWrapper: {
        padding: 20,
        borderRadius: 16,
    },
    choiceActive: {
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
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
        width: "78%",
    },
});
