import MapView, { Marker, Callout, Polygon } from 'react-native-maps';
import { StyleSheet, View, Text, ActivityIndicator, Modal, TouchableOpacity, Linking } from 'react-native';
import Nav from './../components/mainNav';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios'
import TimerMixin from 'react-timer-mixin';
import { PROVIDER_GOOGLE } from 'react-native-maps'
import Icon from 'react-native-vector-icons/Entypo';

export default function Map({ navigation, route }) {
    const [location, setLocation] = useState(null);
    const [scooters, setScooters] = useState([])
    const [nearestScooter, setNearestScooter] = useState([])
    const [nearestScooterMsg, setNearestScooterMsg] = useState("")
    const [showNearestScooterPopUp, setShowNearestScooterPopUp] = useState(false)
    const [showScooterDetails, setShowScooterDetails] = useState(false)
    const [readyToNavigate, setReadyToNavigate] = useState({})
    const [currentBattary, setCurrentBattary] = useState(0)
    const [currentIotId, setCurrentIotId] = useState('')
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
    const [currentLang, setCurrentLag] = useState('ar')
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [permissionAction, setPermissionAction] = useState(null);

    let user;
    if (route.params.user)
        user = route.params.user;

    const calculateDistance = async (origin, destination, apiKey, lang = 'en') => {
        try {
            const languageParam = `&language=${lang}`;
            const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&mode=walking&key=${apiKey}${languageParam}`);
            const durationText = response.data.rows[0].elements[0].duration.text;
            const durationValue = response.data.rows[0].elements[0].duration.value;
            console.log(`Walking Duration: ${durationText}`);
            return durationText;
        } catch (error) {
            console.error('Error calculating duration:', error);
            throw error;
        }
    }

    const requestLocationPermission = async (action) => {
        setPermissionAction(action);
        setShowPermissionModal(true);
    }

    const handlePermissionResponse = async (granted) => {
        setShowPermissionModal(false);
        if (granted) {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                if (permissionAction === 'center') {
                    cetnerLocation();
                } else if (permissionAction === 'nearest') {
                    getNearstScooter();
                }
            }
        }
    }

    const cetnerLocation = async () => {
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
            requestLocationPermission('center');
            return;
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
    }

    const fetchScooters = async () => {
        setLoading(true)
        setErrors([])
        try {
            const response = await axios.get(`https://adminandapi.fentecmobility.com/map/scooters`);
            if (response.data.status === true) {
                setErrors([]);
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
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
            requestLocationPermission('nearest');
            return;
        }
        
        if (location) {
            setLoading(true)
            try {
                const response = await axios.get(`https://adminandapi.fentecmobility.com/map/nearest-scooter?lat=${location.coords.latitude}&lng=${location.coords.longitude}`,
                    {
                        headers: {
                            "api_password": "Fentec@scooters.algaria"
                        }
                    });

                    console.log(response.data);
                if (response.data.status === true) {
                    setErrors([]);
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

    const handleMarkerPress = (coords, batt, id, iot_id) => {
        setShowNav(false)
        setReadyToNavigate(coords)
        console.log(batt);
        setCurrentBattary(batt)
        setCurrentIotId(iot_id)
        setShowScooterDetails(true)
        setScooterIdSelected(id)
        if (location) {
            const origin = `${location.coords.latitude},${location.coords.longitude}`;
            const destination = `${coords.latitude},${coords.longitude}`;
            const apiKey = 'AIzaSyD92ePxBG5Jk6mM3djSW49zs3dRKJroWRk';
    
            calculateDistance(origin, destination, apiKey, route.params.lang ? route.params.lang : 'en')
            .then(duration => {
                setCurrentDurationFar(duration)
            })
            .catch(error => {
                console.error('Error:', error);
            })
        }
        setShowNav(true)
    }

    useEffect(() => {
        fetchScooters();
        // getStoredLang();
        (async () => {
            let { status } = await Location.getForegroundPermissionsAsync();
            if (status !== 'granted') {
                requestLocationPermission('center');
                return;
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

    useEffect(() => {
      const fetchZones = async () => {
        const response = await fetch("https://adminandapi.fentecmobility.com/get-zones");
        const zoneData = await response.json();
        setZones(zoneData);
        console.log(zoneData[0].path);
      };
    
      fetchZones();
    }, []);
    
    return (
        <View style={{ flex: 1 }}>
            {
                showNav && (
                    <Nav scooterDurationFar={currentDurationFar} battary_charge={currentBattary} showQrScanner={() => setShowQrScanner(true)} closeScanner={() => setShowQrScanner(false)} showScanner={showQrScanner} whereIdTheScooter={() => handleNotifyScooter()} navToScooter={() => navigateToDestenation(readyToNavigate.latitude, readyToNavigate.longitude)} showIotDetails={showScooterDetails} closeDetailsScooter={() => setShowScooterDetails(false)} active="2"  user={user} navigation={navigation} goToMyLocation={() => cetnerLocation()} getNearstScooter={() => getNearstScooter()} iot_id={currentIotId} />
                )
            }

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
                            <TouchableOpacity onPress={() => setShowNearestScooterPopUp(false)} style={{ backgroundColor: '#c2c2c2', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5, width: 80, alignItems: 'center' }}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigateToDestenation(nearestScooter.scooter.latitude, nearestScooter.scooter.longitude)} style={{ backgroundColor: '#ff7300', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5, width: 80, alignItems: 'center', color: '#fff' }}>
                                <Text style={{ color: '#fff' }}>Navigate</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Modal>

            <Modal
                animationType='fade'
                transparent={true}
                visible={showPermissionModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ fontSize: 18, marginBottom: 15, fontFamily: "Outfit_500Medium", textAlign: 'center' }}>
                            We need access to your location to ensure you are in the right zone and to help you find the nearest scooter or nearest point seller.
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'end', gap: 20, }}>
                            <TouchableOpacity onPress={() => handlePermissionResponse(false)} style={{ backgroundColor: '#c2c2c2', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5, width: 80, alignItems: 'center' }}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handlePermissionResponse(true)} style={{ backgroundColor: '#ff7300', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5, width: 80, alignItems: 'center', color: '#fff' }}>
                                <Text style={{ color: '#fff' }}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.head}>
                <GooglePlacesAutocomplete
                    placeholder="Search"
                    fetchDetails={true}
                    GooglePlacesSearchQuery={{
                        rankby: "distance"
                    }}
                    onPress={(data, details = null) => {
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
                        components: "country:eg",
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
                                  }}
                              />
                        ))
                    )
                }
                {location && (
                    <Marker
                        coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
                        icon={<Icon name="location-pin" size={24} color="black" />}
                        style={[{ width: 24, height: 24 }]}
                        />
                )}
                {scooters.length > 0 && (
                    scooters.map((scooter) => (
                        <Marker key={scooter.id} onPress={() => handleMarkerPress({ latitude: parseFloat(scooter.latitude), longitude: parseFloat(scooter.longitude)}, scooter.battary_charge, scooter.id, scooter.iot_id)} coordinate={{ latitude: parseFloat(scooter.latitude), longitude: parseFloat(scooter.longitude) }} image={parseInt(scooter.battary_charge) > 60 ? require('./../assets/imgs/icons/high_charge.png') : (parseInt(scooter.battary_charge) < 30 ? require('./../assets/imgs/icons/low_charge.png') : require('./../assets/imgs/icons/medium_charge.png'))}>
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
    }
});