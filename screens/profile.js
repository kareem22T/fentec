import {
    StyleSheet, Text, TouchableOpacity, SafeAreaView, View, Image, TextInput, ScrollView, ActivityIndicator,
    Linking
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Nav from './../components/mainNav';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import TimerMixin from "react-timer-mixin";
import axios from 'axios';
import { AppState } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import { name as appName } from './../app.json';
import Share from 'react-native-share'; // Import react-native-share for sharing

// Register the app
AppRegistry.registerComponent(appName, () => App);

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
    const [isSurvey, SetIsSurvey] = useState(false)
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null)
    const translations = {
        "en": {
            "msg_1": "Your Account has been rejected because:",
            "msg_ban": "Your Account has been Banned because:",
            "more_details": "for More Details",
            "Call": "Call",
            "msg_2": "Your Account is under review we will approve your account in some hours !",
            "msg_3": "You will receive an Email with approve or reject if your information wasn't correct.",
            "msg_4": "Your Account has been approved !",
            "msg_5": "You can enjoy the experience now.",
            "title_1": "Hello friend !",
            "title_2": "Ride Responsibly and Enjoy Freely",
            "trips": "Trips",
            "points": "Points",
            "navigate_msg": "Navigate to nearest FenPay point.",
            "share_msg_1": "Share app with your",
            "share_msg_2": "friends to get free points",
            "invitation_code_msg": `Here is `,
            "invitation_code_msg_2": ` FenTec invitation code`,
            "how_to_use_1": "How to",
            "how_to_use_2": "use the",
            "how_to_use_3": "application",
            "how_to_ride_1": "How to",
            "how_to_ride_2": "ride the",
            "how_to_ride_3": "scooter",
            "contact_us": "Contact us",
            "tandc": "Terms and conditions",
            "seanda": "Service agreement",
            "privace": "Privacy police",
            "leave_feedback": "Leave a feedback",
            "submit": "Submit",
            "comment": "Comment (optional)",
            "bad": "Bad",
            "good": "Good",
            "cool": "Cool!",
            "share": "Share",
            "survey_success_msg": "Your review has been sent successfully. Thank you",
            "survey_error_msg": "Please choose your impression of the experience!",
        },
        "fr": {
            "msg_1": "Votre compte a été rejeté car:",
            "msg_ban": "Votre compte a été suspendu en raison de:",
            "more_details": "pour plus de détails",
            "Call": "Appelez",
            "msg_2": "Votre compte est en cours de révision, nous approuverons votre compte dans quelques heures !",
            "msg_3": "Vous recevrez un e-mail avec approuver ou rejeter si vos informations n'étaient pas correctes.",
            "msg_4": "Your Account has been approved !",
            "msg_5": "Vous pouvez profiter de l'expérience maintenant.",
            "leave_feedback": "Laisser un commentaire",
            "title_1": "Salut Notre Ami !",
            "title_2": "Roulez avec responsabilitè, Profitez librement",
            "trips": "Parcours",
            "points": "Points",
            "navigate_msg": "Trouver le point de FenPay le plus proche",
            "share_msg_1": "Partagez l'application avec ",
            "share_msg_2": "vos amis pour obtenir des points gratuits",
            "how_to_use_1": "Comment utiliser",
            "invitation_code_msg": `Voici le code d'invitation `,
            "invitation_code_msg_2": ` FenTec`,
            "how_to_use_2": "l’Application",
            "how_to_use_3": "FenTec Mobility",
            "how_to_ride_1": "Comment  ",
            "how_to_ride_2": "utiliser la ",
            "how_to_ride_3": "Trottinette",
            "contact_us": "Contactez-nous",
            "tandc": "Termes et conditions",
            "seanda": "Service agreement",
            "privace": "Politique de confidentialité",
            "submit": "Soumettre",
            "share": "Partager",
            "comment": "Commentaire (facultatif)",
            "bad": "Mauvais",
            "good": "Bien",
            "cool": "Cool!",
            "survey_success_msg": "Votre avis a été envoyé avec succès. Merci!",
            "survey_error_msg": "Veuillez choisir votre impression de l'expérience!",
        },
        "ar": {
            "msg_1": "لقد تم رفض حسابك للأسباب التالية:",
            "msg_ban": "لقد تم حظر حسابك للأسباب التالية:",
            "Call": "اتصل",
            "share": "شارك",
            "more_details": "للمزيد من التفاصيل ",
            "msg_2": "حسابك قيد المراجعة، وسنوافق على حسابك خلال بضع ساعات!",
            "msg_3": "ستصلك رسالة بالبريد الإلكتروني بالموافقة أو الرفض إذا لم تكن معلوماتك صحيحة.",
            "msg_4": "تمت الموافقة على حسابك!",
            "msg_5": "يمكنك الاستمتاع بالتجربة الآن.",
            "title_1": "مرحبا يا صديقي!",
            "title_2": "تنقل بمسؤولية وتمتع بحرية",
            "invitation_code_msg": `إليك رمز دعوة `,
            "invitation_code_msg_2": `  الي FenTec`,
            "leave_feedback": "اترك لنا انطباعك",
            "trips": "الرحلات",
            "points": "النقاط",
            "navigate_msg": "إنتقل إلى أقرب نقطة FenPay",
            "share_msg_1": "شارك التطبيق مع",
            "share_msg_2": "أصدقائك للحصول على نقاط مجانية",
            "how_to_use_1": "كيف",
            "how_to_use_2": "تستخدم",
            "how_to_use_3": "التطبيق",
            "how_to_ride_1": "كيفية  ",
            "how_to_ride_2": "ركوب ",
            "how_to_ride_3": "الاسكوتر",
            "contact_us": "تواصل معنا",
            "tandc": "الأحكام والشروط",
            "seanda": "اتفاقية خدمات",
            "privace": "سياسة الخصوصية",
            "submit": "ارسال",
            "comment": "التعليق (اختياري)",
            "bad": "سيء",
            "good": "جيد",
            "cool": "رائع!",
            "survey_success_msg": "تم ارسال تقيمك بنجاح شكرا لك!",
            "survey_error_msg": "يرجع اختيار انطباعك عن التجربة!",
        }
    }
    const [currentLang, setCurrentLag] = useState('ar')
    const [screenContent, setScreenContent] = useState(translations.ar);

    const [notificationToken, setNotificationToken] = useState('')
    const [token, setToken] = useState('')
    const [tripsNum, setTripsNum] = useState(0)
    const [showFeedBack, setShowFedBack] = useState(false)
    const [selectedReaction, setSelectedReaction] = useState(null)
    const [comment, setComment] = useState(null)

    const handleShare = async () => {
        try {
            // Fetch invitation code from API
            const response = await axios.post(`https://adminandapi.fentecmobility.com/get-invitation-code`, {
                api_password: 'Fentec@scooters.algaria',
                notification_token: notificationToken,
            },
                {
                    headers: {
                        'AUTHORIZATION': `Bearer ${token}`
                    }
                },);
            const invitationCode = response.data.invitation_code;
    
            // Share invitation code
            await Share.open({
                title: 'Share Invitation Code',
                message: `${screenContent.invitation_code_msg} ${user.name} ${screenContent.invitation_code_msg_2} : ${invitationCode} \n \n https://fentecmobility.com/`,
                // You can also add other options here like url, subject, etc.
            });
        } catch (error) {
            console.error('Error fetching invitation code or sharing:', error);
        }
    };

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

    const setNotificationTokenUser = async (token, notificationToken) => {
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/user/save-notification-token`, {
                api_password: 'Fentec@scooters.algaria',
                notification_token: notificationToken,
            },
                {
                    headers: {
                        'AUTHORIZATION': `Bearer ${token}`
                    }
                },);

            if (response.data.status === true) {
                
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
            navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'Welcome',
                    params: {}, // No params to pass in this case
                  },
                ],
              });                      
        } else if (!user && !first) {
            navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'Login',
                    params: {}, // No params to pass in this case
                  },
                ],
              });                      

        } else if (user.verify && user.name != null) {
            setLoading(false)
        } else if (user && !user.verify) {
            navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'Verify',
                    params: { email: user.email, token: token }, // No params to pass in this case
                  },
                ],
              });                      
        } else if (!user.name) {
            navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'Last',
                    params: { email: user.email, token: token }, // No params to pass in this case
                  },
                ],
              });                      
        }
    }
    const registerForPushNotificationsAsync = async () => {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }

        // Get the token that uniquely identifies this device
        const expoPushToken = await Notifications.getDevicePushTokenAsync({
            projectId: '0b8b914c-162e-4a76-8e5b-cb57403454cc',
        });
        setNotificationToken(expoPushToken.data)
        console.log('Expo Push Token:', expoPushToken);
        return expoPushToken.data;
    };

    const [isNotification, setIsNotification] = useState(false)
    const [notificationTitle, setNotificationTitle] = useState(null)
    const [notificationBody, setNotificationBody] = useState(null)
    useEffect(() => {
        const testShowSurvey = async () =>{
            let sur = await SecureStore.setItemAsync('surveay', "true");
            if (sur) {
                SetIsSurvey(true)
            } else {
                SetIsSurvey(false)
            }
        }

        testShowSurvey();


        getStoredToken().then((res) => {
            let token = res
            checkIsFirstTime().then((isfirst) => {
                if (token) {
                    setToken(token)
                    getUser(token).then(async user => {
                        await messaging().subscribeToTopic('Journey_channel_' + user.id );
                        showScreens(isfirst, user, token)
                        if (user && user.approved && !user.approving_msg_seen)
                            seenVerifyMsg(token)
                    })
                } else {
                    showScreens(isfirst, res)
                }
            })
        });
        const getFCMToken = async () => {
            const fcmToken = await messaging().getToken();
            if (!await SecureStore.getItemAsync('fcm_token'))
                await SecureStore.setItemAsync("fcm_token", fcmToken)
        
            let tokenFcm = await SecureStore.getItemAsync('fcm_token')
            console.log('FCM Token:', tokenFcm);

            getStoredToken().then((res) => {
                let token = res
                setNotificationTokenUser(token, tokenFcm)
            });    

            await messaging().subscribeToTopic('all_users');
            console.log('Subscribed to topic: all_users');
          };
        
          getFCMToken();
          messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
          });
          const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('Received FCM Notification:', remoteMessage);
            if (remoteMessage.from !== "/topics/Journey_channel_" + user.id) {

                setIsNotification(true)
                setNotificationTitle(remoteMessage.notification.title)
                setNotificationBody(remoteMessage.notification.body)
                
                if (remoteMessage.from !== "/topics/all_users")
                    getUser(token)
                
                TimerMixin.setTimeout(() => {
                    setIsNotification(false)
                }, 4000);
            }

          });  
      
          getStoredLang();
          return unsubscribe;      
    }, []);
    const getTripsNum = async (user_id, current = 1) => {
        setLoading(true);
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/get-trips-num`, {
                api_password: 'Fentec@scooters.algaria',
                user_id: user_id,
            },
            {
                headers: {
                    'AUTHORIZATION': `Bearer ${token}`
                }
            })
                setTripsNum(response.data)
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
        if (user)
        getTripsNum(user.id)
    }, [user])
    useEffect(() => {
        const getShowSurvey = async () => {
            let showSur = await SecureStore.getItem('show_survey')
            console.log("xxx", showSur);
            if (showSur) {
                setShowFedBack(true)
            }
        }

        getShowSurvey()

    }, [showFeedBack])
    const handleSubmitSurvey = async () => {
        setLoading(true);
        setErrors([])
        if (!selectedReaction) {

            setErrors([screenContent.survey_error_msg]);
            setLoading(false);
        } else
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/put-survey`, {
                api_password: 'Fentec@scooters.algaria',
                comment: comment,
                reaction: selectedReaction
            },
            {
                headers: {
                    'AUTHORIZATION': `Bearer ${token}`
                }
            })
                let showSur = await SecureStore.setItemAsync('show_survey', '')
                setShowFedBack(false)
                setSuccessMsg(screenContent.survey_success_msg);
                TimerMixin.setTimeout(() => {
                    setLoading(false)
                    setSuccessMsg("")
                    setErrors([]);
                }, 2000);                
        } catch (error) {
            setLoading(false);
            setErrors(["Server error, try again later."]);
            console.error(error);
        }
    }
    return (
        <SafeAreaView style={[styles.wrapper]}>
            <BackgroundImage></BackgroundImage>
            <Nav active="1" navigation={navigation} user={user} />
            <TouchableOpacity onPress={() => navigation.push('Notifications', { user: user })} style={{ position: 'absolute', zIndex: 999, top: 30, right: 40 }}>
                <Ionicons name="notifications" size={40} color="rgba(255, 115, 0, 1)" />
                {
                    (user && user.has_unseened_notifications == true) && (
                        <View style={[styles.title, styles.approvingAlert, {width: 20, height: 20, borderRadius: 20, marginTop: 0, padding: 0, borderColor: "white", position: 'absolute', top: 0 }]}></View>
                    )
                }
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
            {isNotification && (
                <TouchableOpacity onPress={() => navigation.push('Notifications', { user: user })} style={{
                    width: '94%',
                    zIndex: 9999999999,
                    justifyContent: 'center',
                    alignContent: 'center',
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: "rgba(255, 115, 0, 1)",
                    marginTop: 22,
                    backgroundColor: '#fff',
                    position: 'absolute',
                    top: 20,
                    left: "3%",
                    padding: 10
                }}>
                    <View style={{flexDirection: 'row', gap: 5, alignItems: "center"}}>
                        <Ionicons name="notifications" size={24} color="rgba(255, 115, 0, 1)" />
                        <Text style={{fontSize: 20, fontFamily: "Outfit_700Bold"}}>{notificationTitle}</Text>
                    </View>
                    <Text style={{fontSize: 16, fontFamily: "Outfit_500Medium", paddingLeft: 29}}>{notificationBody}</Text>
                </TouchableOpacity>
            )}
            {
                showFeedBack && (
                    <View style={{height: "100%", width: "100%", position: "absolute", top: 0, left: 0, zIndex: 99999, backgroundColor: "rgba(0, 0, 0, .4)"}}>
                        <View style={[{position: "absolute", bottom: 40, width: "100%", left: 0, paddingHorizontal: 20, zIndex: 9999999}]}>
                            <View style={[styles.contianer_bg, styles.shadow, {width: "100%", padding: 20}]}>
                                <Text style={{fontSize: 22, fontFamily: 'Outfit_700Bold', textAlign: "center", marginBottom: 8}}>{ screenContent.leave_feedback }</Text>
                                <View style={{display: 'flex', justifyContent: "center", alignItems: "center", gap: 24, flexDirection: "row"}}>
                                    <TouchableOpacity onPress={() => {setSelectedReaction(1)}} style={[(selectedReaction !== 1 && selectedReaction !== null) && {opacity: .5}]}>
                                        <Image source={require('./../assets/imgs/bad-icon.png')} style={{width: 60, height: 60, resizeMode: "cover"}} />
                                        <Text style={{fontSize: 18, fontFamily: "Outfit_600SemiBold", textAlign: "center", marginTop: 8}}>{screenContent.bad}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {setSelectedReaction(2)}} style={[(selectedReaction !== 2 && selectedReaction !== null) && {opacity: .5}]}>
                                        <Image source={require('./../assets/imgs/good.png')} style={{width: 60, height: 60, resizeMode: "cover"}}/>
                                        <Text style={{fontSize: 18, fontFamily: "Outfit_600SemiBold", textAlign: "center", marginTop: 8}}>{screenContent.good}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {setSelectedReaction(3)}} style={[(selectedReaction !== 3 && selectedReaction !== null) && {opacity: .5}]}>
                                        <Image source={require('./../assets/imgs/cool.png')} style={{width: 60, height: 60, resizeMode: "cover"}}/>
                                        <Text style={{fontSize: 18, fontFamily: "Outfit_600SemiBold", textAlign: "center", marginTop: 8}}>{screenContent.cool}</Text>
                                    </TouchableOpacity>
                                </View>
                                <TextInput
                                style={[styles.contianer_bg, {width: "100%", borderRadius: 10, height: 120, padding: 12, fontSize: 16, textAlignVertical: 'top'}]}
                                multiline
                                value={comment}
                                onChangeText={text => setComment(text)}
                                placeholder={screenContent.comment}
                                />
                                <TouchableOpacity onPress={() => handleSubmitSurvey()} style={[styles.button, {width: "100%", padding: 12, borderRadius: 10}]}>
                                    <Text style={styles.button_text}>
                                        {screenContent.submit}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
            }
            <Text style={{
                    position: 'absolute', top:  50, right: 20, color: "#fff",
                    padding: 1 * 16,
                    marginLeft: 10,
                    fontSize: 1 * 16,
                    backgroundColor: '#e41749',
                    fontFamily: 'Outfit_600SemiBold',
                    borderRadius: 1.25 * 16,
                    zIndex: 9999999999,
                    display: errors.length ? 'flex' : 'none'
                }}>{errors.length ? errors[0] : ''}</Text>
                <Text style={{
                    position: 'absolute', top:  50, right: 20, color: "#fff",
                    padding: 1 * 16,
                    marginLeft: 10,
                    fontSize: 1 * 16,
                    backgroundColor: '#12c99b',
                    fontFamily: 'Outfit_600SemiBold',
                    borderRadius: 1.25 * 16,
                    zIndex: 9999999999,
                    display: successMsg == '' ? 'none' : 'flex'
                }}>{successMsg}</Text>
            <ScrollView>
                <View style={styles.contianer}>
                    {(user && user.rejected == true) && (<Text style={[styles.title, styles.approvingAlert]}>
                        {screenContent.msg_1} {'\n'}
                        <Text>
                            {user.rejection_reason} {'\n'}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Last', { user: user, token: token })}><Text style={{ color: '#fff', fontFamily: 'Outfit_600SemiBold', fontSize: 20, textAlign: 'center' }}>Edit Profile Now</Text></TouchableOpacity>
                    </Text>)}
                    {(user && user.isBanned == true) && (<Text style={[styles.title, styles.approvingAlert]}>
                        {screenContent.msg_ban} {'\n'}
                        <Text>
                            {user.ban_reason} {'\n'}
                        </Text>
                        <Text style={{ color: '#fff', fontFamily: 'Outfit_600SemiBold', fontSize: 20, textAlign: 'center' }}>{screenContent.Call} +213676551489 {screenContent.more_details}</Text>
                    </Text>)}
                    {(user && !user.approved && !user.rejected && !user.isBanned) && (<Text style={[styles.title, styles.approvingAlert]}>

                        {screenContent.msg_2} {'\n'}
                        <Text>
                        {screenContent.msg_3}
                            
                        </Text>
                    </Text>)}
                    {(user && user.approved == true && !user.approving_msg_seen) && (<Text style={[styles.title, styles.approvingAlert, { backgroundColor: "#12c99b", borderColor: '#12c99b' }]}>
                        {screenContent.msg_4} {'\n'}
                        <Text>
                        {screenContent.msg_5}
                        </Text>
                    </Text>)}
                    <Text style={[styles.title, ((user && !user.approved) || (user && !user.approving_msg_seen)) && { marginTop: 10 }, currentLang == 'ar' && {lineHeight: 35, fontSize: 25}]}>
                    {screenContent.title_1} {'\n'}
                    {screenContent.title_2}
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
                            <TouchableOpacity style={styles.trips} onPress={() => navigation.push('Trips', { user: user, token: token })}>
                                <Text style={styles.trips_text}>{screenContent.trips}</Text>
                                <Text style={[styles.trips_text, { color: "rgba(255, 115, 0, 1)" }]}>{tripsNum}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.trips} onPress={() => navigation.push('Points', { user: user , token: token })}>
                                <Text style={styles.trips_text}>{screenContent.points}</Text>
                                {user && (
                                    <Text style={[styles.trips_text, { color: "rgba(255, 115, 0, 1)" }]}>{user.coins}</Text>
                                )}

                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => {
                        navigation.push('Sellers', { user: user, token: token })
                    }} style={styles.contianer_bg}>
                        <Image source={require('./../assets/imgs/map.png')} style={{ width: '100%', height: 200, borderRadius: 16, overflow: 'hidden' }} />
                        <Text style={[styles.navigate_Text, currentLang == "ar" && {fontSize: 22}]}>{screenContent.navigate_msg}</Text>
                    </TouchableOpacity>
                    <View style={styles.profile}>
                        <View style={styles.bg}></View>
                        <View style={styles.head}>
                            <Image source={require('./../assets/imgs/share.png')} alt="fentec logo" style={{ width: 250, height: 120, resizeMode: 'contain' }} />
                            <Text style={[styles.name, currentLang == "ar" && {fontFamily: "Outfit_600SemiBold"}]}>
                                {screenContent.share_msg_1} {'\n'}
                                {screenContent.share_msg_2}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => {handleShare()}} style={styles.btn}><Text style={styles.button_text}>{ screenContent.share}</Text></TouchableOpacity>
                    </View>
                    <View style={styles.how_container}>
                        <TouchableOpacity onPress={() => {navigation.push('HowToUseApp')}} style={styles.how_element}>
                            <Ionicons name="ios-help-circle-outline" size={60} color="rgba(255, 115, 0, 1)" />
                            <Text style={[styles.name, currentLang == "ar" && {fontFamily: "Outfit_600SemiBold"}]}>
                                {screenContent.how_to_use_1} {'\n'}
                                {screenContent.how_to_use_2} {'\n'}
                                {screenContent.how_to_use_3}
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.how_element}>
                            <MaterialCommunityIcons name="human-scooter" size={60} color="rgba(255, 115, 0, 1)" />
                            <Text style={[styles.name, currentLang == "ar" && {fontFamily: "Outfit_600SemiBold"}]}>
                                {screenContent.how_to_ride_1} {'\n'}
                                {screenContent.how_to_ride_2} {'\n'}
                                {screenContent.how_to_ride_3}
                            </Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={[styles.name, { fontSize: 22, fontFamily: 'Outfit_700Bold' }]}>{screenContent.contact_us}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 15, marginBottom: 15 }}>
                            <TouchableOpacity onPress={() => {Linking.openURL('https://www.facebook.com/profile.php?id=61564285140098&mibextid=qi2Omg&rdid=lgjCa9G4ilqBLg3h&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2FJhifFbsE52pYV6mz%2F%3Fmibextid%3Dqi2Omg')}}>
                                <Entypo name="facebook" size={35} color="'rgba(255, 115, 0, 1)'" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {Linking.openURL('https://www.instagram.com/fentec_mobility?igsh=MTN5MXlndHVoODd3cg%3D%3D')}}>
                                <FontAwesome5 name="instagram-square" size={35} color="'rgba(255, 115, 0, 1)'" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {Linking.openURL('mailto:Contact@fentecmobility.com')}}>
                                <MaterialIcons name="email" size={44} color="'rgba(255, 115, 0, 1)'" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {Linking.openURL('tel:+213660980645')}}>
                            <FontAwesome name="phone-square" size={37} color="'rgba(255, 115, 0, 1)'" />
                            </TouchableOpacity>
                        </View>
                        <View >

                            <TouchableOpacity onPress={() => {Linking.openURL('https://fentecmobility.com/terms-and-conditions')}}>
                                <Text style={[styles.name, { color: 'rgba(255, 115, 0, 1)' }, currentLang == "ar" && {fontSize: 22, fontFamily: 'Outfit_700Bold' } ]}>
                                    {screenContent.tandc} {'\n'}
                                    {screenContent.seanda} 
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginTop: 16}} onPress={() => {Linking.openURL('https://fentecmobility.com/Privacy-Police')}}>
                                <Text style={[styles.name, { color: 'rgba(255, 115, 0, 1)' }, currentLang == "ar" && {fontSize: 22,  fontFamily: 'Outfit_700Bold' } ]}>
                                    {screenContent.privace}
                                </Text>
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
    button: {
        padding: 18,
        borderRadius: 1.25 * 16,
        fontSize: 1.25 * 16,
        width: "95%",
        backgroundColor: "#ff7300",
        transition: "all .3s ease-in",
        marginBottom: 1.25 * 16,
    },
    button_text: {
        color: "#fff",
        fontFamily: 'Outfit_700Bold',
        fontSize: 28,
        textAlign: "center",
    },
    popup: {

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