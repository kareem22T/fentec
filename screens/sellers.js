import MapView, { Marker, Callout, Polygon } from 'react-native-maps';
import { StyleSheet, View, Text, ActivityIndicator, Modal, TouchableOpacity, Linking } from 'react-native';
import Nav from '../components/mainNav';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { MaterialIcons, Entypo, MaterialCommunityIcons, FontAwesome5, FontAwesome6, AntDesign } from '@expo/vector-icons';
import axios from 'axios'
import TimerMixin from 'react-timer-mixin';
import { PROVIDER_GOOGLE } from 'react-native-maps'
import Icon from 'react-native-vector-icons/Entypo';
import * as SecureStore from 'expo-secure-store';

export default function Sellers({ navigation, route }) {
    const [location, setLocation] = useState(null);
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
            "navigate_msg": "Nearest FenPay point",
            "share_msg_1": "Share app with your",
            "share_msg_2": "friends to get free points",
            "how_to_use_1": "How to",
            "how_to_use_2": "use the",
            "how_to_use_3": "application",
            "how_to_ride_1": "How to",
            "how_to_ride_2": "ride the",
            "how_to_ride_3": "scooter",
            "contact_us": "Contact us",
            "navToSeller": "Navigate to seller location",
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
            "navToSeller": "Accéder au vendeur",
            "navigate_msg": "point de FenPay le plus proche",
            "share_msg_1": "Partagez l'application avec ",
            "share_msg_2": "vos amis pour obtenir des points gratuits",
            "how_to_use_1": "Comment utiliser",
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
            "navToSeller": "انتقل الي البائع",
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

    const getStoredLang = async () => {
        const storedLang = await SecureStore.getItemAsync('lang');
        
        if (storedLang) {
            setScreenContent(translations[storedLang])
            setCurrentLag(storedLang)
        }
    }

    const [scooters, setScooters] = useState([])
    const [nearestScooter, setNearestScooter] = useState([])
    const [nearestScooterMsg, setNearestScooterMsg] = useState("")
    const [showNearestScooterPopUp, setShowNearestScooterPopUp] = useState(false)

    const [showScooterDetails, setShowScooterDetails] = useState(false)
    const [readyToNavigate, setReadyToNavigate] = useState({})
    const [currentBattary, setCurrentBattary] = useState(0)
    const [currentPhone, setCurrentPhone] = useState('')
    const [currentUser, setCurrentUser] = useState('')
    const [currentDurationFar, setCurrentDurationFar] = useState()
    const [showQrScanner, setShowQrScanner] = useState(false)
    const [scooterIdSelected, setScooterIdSelected] = useState(0)

    const [showNav, setShowNav] = useState(true)
    const [region, setRegion] = React.useState({
        latitude: 30.0480392,
        longitude: 31.2363747,
        latitudeDelta: 0.02,
        longitudeDelta: 0.002
    })

    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    let user;
    if (route.params.user)
        user = route.params.user;

    const calculateDistance = async (origin, destination, apiKey) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=${apiKey}`);
            
            // Extracting duration from response
            const durationText = response.data.rows[0].elements[0].duration.text;
            const durationValue = response.data.rows[0].elements[0].duration.value;
    
            console.log(`Duration: ${durationText}`);
    
            return durationText;
        } catch (error) {
            console.error('Error calculating duration:', error);
            throw error;
        }
    }
    
    const cetnerLocation = async () => {

        // Get the user's current location permission status.
        let { status } = await Location.getForegroundPermissionsAsync();

        // If the user has denied location permission, prompt them again.
        if (status !== 'granted') {
            let { status } = await Location.requestForegroundPermissionsAsync();

            // If the user still denies location permission, return.
            if (status !== 'granted') {
                return;
            }
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        if (location) {
            setRegion({
                latitude: 30.0480392,
                longitude: 31.2363747,
                latitudeDelta: 0.03,
                longitudeDelta: 0.002
            })
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.002
            })
        }
    }

    const fetchScooters = async () => {
        setLoading(true)
        setErrors([])
        try {
            const response = await axios.get(`https://adminandapi.fentecmobility.com/map/sellers`);
            // console.log(response);
            if (response.data.status === true) {
                setErrors([]);
                // setSuccessMsg(response.data.message);
                TimerMixin.setTimeout(() => {
                    setLoading(false);
                    setScooters(response.data.data)
                    
                }, 1500);
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

    const handleNotifyScooter = async () => {
        setLoading(true)
        setErrors([])
        try {
            const response = await axios.get(`https://adminandapi.fentecmobility.com/map/scooter-notify?id=${scooterIdSelected}`);
            // console.log(response);
            if (response.data.status === true) {
                setErrors([]);
                setLoading(false);
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

    const getNearstScooter = async () => {
        setErrors([])
        // Get the user's current location permission status.
        let { status } = await Location.getForegroundPermissionsAsync();

        // If the user has denied location permission, prompt them again.
        if (status !== 'granted') {
            let { status } = await Location.requestForegroundPermissionsAsync();

            // If the user still denies location permission, return.
            if (status !== 'granted') {
                return;
            }
        }
        if (location) {
            setLoading(true)
            try {
                const response = await axios.get(`https://adminandapi.fentecmobility.com/map/nearest-seller?lat=${location.coords.latitude}&lng=${location.coords.longitude}&lang=${currentLang}`,
                    {
                        headers: {
                            "api_password": "Fentec@scooters.algaria"
                        }
                    });

                if (response.data.status === true) {
                    console.log(response);
                    setErrors([]);
                    // setSuccessMsg(response.data.message);
                    TimerMixin.setTimeout(() => {
                        setLoading(false);
                        setNearestScooter(response.data.data)
                        setNearestScooterMsg(response.data.message)
                        setShowNearestScooterPopUp(true)
                    }, 1500);
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
    }

    const navigateToDestenation = (lat, lng) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

        Linking.openURL(url);

        setShowNearestScooterPopUp(false)
        setShowScooterDetails(false)
    };

    const handleMarkerPress = (coords, batt, id, phone, name) => {
        setShowSeller(false)
        setReadyToNavigate(coords)
        console.log(batt);
        setCurrentBattary(batt)
        setCurrentPhone(phone)
        setCurrentUser(name)
        setShowScooterDetails(true)
        setScooterIdSelected(id)
        if (location) {
            const origin = `${location.coords.latitude},${location.coords.longitude}`; // replace latitude and longitude with actual values
            const destination = `${coords.latitude},${coords.longitude}`; // replace latitude and longitude with actual values
            const apiKey = 'AIzaSyD92ePxBG5Jk6mM3djSW49zs3dRKJroWRk';
    
            calculateDistance(origin, destination, apiKey)
            .then(duration => {
                // Use the duration value as needed
                setCurrentDurationFar(duration)
            })
            .catch(error => {
                // Handle error
                console.error('Error:', error);
            })
        }
        setShowSeller(true)
    }


    useEffect(() => {
        fetchScooters();
        () => cetnerLocation;
        (async () => {

            // Get the user's current location permission status.
            let { status } = await Location.getForegroundPermissionsAsync();

            // If the user has denied location permission, prompt them again.
            if (status !== 'granted') {
                let { status } = await Location.requestForegroundPermissionsAsync();

                // If the user still denies location permission, return.
                if (status !== 'granted') {
                    return;
                }
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            if (location) {
                setRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.002
                })
            }
        })();
    }, []);
    const [zones, setZones] = useState([]);
    const [showSeller, setShowSeller] = useState(false);

    useEffect(() => {
      getStoredLang();

    }, []);
    
    return (
        <View style={{ flex: 1 }}>
            {/* {
                showNav && (
                    <Nav scooterDurationFar={currentDurationFar} battary_charge={currentBattary} showQrScanner={() => setShowQrScanner(true)} closeScanner={() => setShowQrScanner(false)} showScanner={showQrScanner} whereIdTheScooter={() => handleNotifyScooter()} navToScooter={() => navigateToDestenation(readyToNavigate.latitude, readyToNavigate.longitude)} showIotDetails={showScooterDetails} closeDetailsScooter={() => setShowScooterDetails(false)} active="2"  user={user} navigation={navigation} goToMyLocation={() => cetnerLocation()} getNearstScooter={() => getNearstScooter()} />
                )
            } */}
            {
                (showSeller && readyToNavigate.latitude && readyToNavigate.longitude && currentBattary) && (
                    <View style={{
                        width: "100%", position: 'absolute', bottom: 100, zIndex: 9999, left: 0, padding: 20 
                    }}>
                        <View style={[styles.choiceWrapper, styles.choiceActive, { width: '100%', gap: 10}]}>
                            <View style={{padding: 0, marginTop: 24}}>
                                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '90%', marginBottom: 10}}><Text><Entypo name="location" size={30} color="black" /> </Text><Text style={{ fontSize: 16 }}>{currentBattary}</Text></View>
                                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '90%', marginBottom: 10}}><Text><Entypo name="phone" size={30} color="black" /> </Text><Text style={{ fontSize: 16 }}>{currentPhone}</Text></View>
                                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: '90%'}}><Text><Entypo name="user" size={30} color="black" /> </Text><Text style={{ fontSize: 16 }}>{currentUser}</Text></View>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 10, width: "100%", justifyContent: 'center', marginTop: 16 }}>
                                <TouchableOpacity onPress={() => navigateToDestenation(readyToNavigate.latitude, readyToNavigate.longitude)} style={[styles.choiceWrapper, styles.choiceActive, { backgroundColor: 'rgba(255, 115, 0, 1)',  flexDirection: 'row', gap: 10, padding: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 8 }]}><FontAwesome5 name="directions" size={16} color="black" /><Text>{screenContent.navToSeller}</Text></TouchableOpacity>
                            </View>
                            <TouchableOpacity style={{ position: 'absolute', top: 15, right: 15 }} onPress={() => {setShowSeller(false)}}><AntDesign name="close" size={28} color="red" /></TouchableOpacity>
                        </View>
                    </View>
                )
            }
            <View style={{ flexDirection: 'row', gap: 7, position: 'absolute', bottom: 20, left: 0, padding: 20, width: '100%', justifyContent: 'center', zIndex: 9999 }}>
                <TouchableOpacity style={[styles.choiceWrapper, styles.choiceActive, {flexDirection: "row", alignItems: 'center', gap: 8, backgroundColor: "rgba(255, 115, 0, 1)"}]} onPress={getNearstScooter}>
                    <Text style={{fontFamily: "Outfit_400Regular", lineHeight: 18, fontSize: 14, color: "#fff"}}>
                        {screenContent.navigate_msg}
                    </Text>
                    <Entypo name="direction" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.choiceWrapper, styles.choiceActive]} onPress={cetnerLocation}>
                    <MaterialIcons name="my-location" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {loading && (
                <View style={{
                    width: '100%',
                    height: '100%',
                    zIndex: 3399996,
                    justifyContent: 'center',
                    alignContent: 'center',
                    marginTop: 22,
                    backgroundColor: 'rgba(0, 0, 0, .5)',
                    position: 'absolute',
                    top: 10,
                    left: 0,
                }}>
                    <ActivityIndicator size="200px" color="#ff7300" />
                </View>
            )}
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
            <Text style={{
                position: 'absolute', top: 70, right: 20, color: "#fff",
                padding: 1 * 16,
                marginLeft: 10,
                fontSize: 1 * 16,
                backgroundColor: '#12c99b',
                fontFamily: 'Outfit_600SemiBold',
                // fontWeight: 600,
                borderRadius: 1.25 * 16,
                zIndex: 9999999999,
                display: successMsg == '' ? 'none' : 'flex'
            }}>{successMsg}</Text>

            <Modal
                animationType='fade'
                transparent={true}
                visible={showNearestScooterPopUp}
            >

                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ fontSize: 18, marginBottom: 15, fontFamily: "Outfit_500Medium", textAlign: 'center' }}>{nearestScooterMsg}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'end', gap: 20, }}>
                            <TouchableOpacity onPress={() => setShowNearestScooterPopUp(false)} style={{ backgroundColor: '#c2c2c2', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5, width: 100, alignItems: 'center' }}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigateToDestenation(nearestScooter.scooter.latitude, nearestScooter.scooter.longitude)} style={{ backgroundColor: '#ff7300', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5, width: 100, alignItems: 'center', color: '#fff' }}>
                                <Text style={{ color: '#fff' }}>Navigate</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Modal>

            <View style={styles.head}>
                <TouchableOpacity onPress={() => {navigation.push("Profile")}} style={[styles.input, { width: 'auto', backgroundColor: 'rgba(255, 115, 0, 1)', padding: 18, height: 60, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 15 }]}>
                    <FontAwesome5 name="long-arrow-alt-left" size={24} color="#fff" />
                </TouchableOpacity>
                <GooglePlacesAutocomplete
                    placeholder="Search"
                    fetchDetails={true}
                    GooglePlacesSearchQuery={{
                        rankby: "distance"
                    }}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        console.log(data, details)
                        setRegion({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            latitudeDelta: 0.02,
                            longitudeDelta: 0.002
                        })
                    }}
                    query={{
                        key: "AIzaSyD92ePxBG5Jk6mM3djSW49zs3dRKJroWRk",
                        components: "country:dz",
                        types: "address",
                        radius: 30000,
                        location: `${region.latitude}, ${region.longitude}`
                    }}
                    styles={{
                        container: styles.input,
                        listView: { backgroundColor: "white" }
                    }}
                />
            </View>

            <MapView
                style={styles.map}
                initialRegion={region}
                region={region}
                mapType='terrain'
                provider={PROVIDER_GOOGLE}
            >
                {
                    zones && (
                        zones.map((zone, index) => (
                              <Polygon
                                key={index}
                                coordinates={JSON.parse(zone.path).map(item => ({ latitude: item.lat, longitude: item.lng }))}
                                fillColor={parseInt(zone.type) == 0 ? 'rgba(255, 0, 0, .35)' : (parseInt(zone.type) == 1 ? 'rgba(0, 255, 0, .35)' : 'rgba(255, 165, 0, .35)')}
                                strokeColor='#000'
                                options={{
                                    strokeColor: '#000',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                    fillColor: "#ff0000",
                                    fillOpacity: 0.35,
                                  }} // Pass options as a single object
                              />
                        ))
                    )
                }
                {location && (
                    <Marker
                        coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
                        icon={<Icon name="location-pin" size={24} color="black" />}
                        style={[{ width: 24, height: 24 }]} // Adjust size as needed
                        />
                )}
                {scooters.length > 0 && (
                    // Iterate through the scooters array
                    scooters.map((scooter) => (
                        <Marker key={scooter.id} onPress={() => handleMarkerPress({ latitude: parseFloat(scooter.latitude), longitude: parseFloat(scooter.longitude)}, scooter.address , scooter.id, scooter.phone, scooter.name)} coordinate={{ latitude: parseFloat(scooter.latitude), longitude: parseFloat(scooter.longitude) }} image={ require('./../assets/imgs/icons/seller_icon.png')}>
                        </Marker>
                    ))
                )}

            </MapView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    head: {
        position: 'absolute',
        top: 30,
        padding: 20,
        left: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'start',
        zIndex: 555,
        gap: 10
    },
    input: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.25 * 16,
        lineHeight: 1.5 * 16,
        textAlign: 'left',
        padding: 5,
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
        width: "100%",
    },
    shadow: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    map: {
        width: '100%',
        height: '105%',
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '90%',
        padding: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
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

});
