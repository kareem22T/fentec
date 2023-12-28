import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Text, ActivityIndicator, Modal, TouchableOpacity, Linking } from 'react-native';
import Nav from './../components/mainNav';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios'
import TimerMixin from 'react-timer-mixin';
import { PROVIDER_GOOGLE } from 'react-native-maps'

export default function Map({ navigation }) {
    const [location, setLocation] = useState(null);

    const [scooters, setScooters] = useState([])
    const [nearestScooter, setNearestScooter] = useState([])
    const [nearestScooterMsg, setNearestScooterMsg] = useState("")
    const [showNearestScooterPopUp, setShowNearestScooterPopUp] = useState(false)

    const [showScooterDetails, setShowScooterDetails] = useState(false)
    const [readyToNavigate, setReadyToNavigate] = useState({})

    const [showQrScanner, setShowQrScanner] = useState(false)

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
            const response = await axios.get(`https://a3376b12b14ee6fb735e8fe5a2e0491a.serveo.net/scooters`,
                {
                    headers: {
                        "api_password": "Fentec@scooters.algaria"
                    }
                });

            if (response.data.status === true) {
                setErrors([]);
                setSuccessMsg(response.data.message);
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
                const response = await axios.get(`https://a3376b12b14ee6fb735e8fe5a2e0491a.serveo.net/nearest-scooter?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`,
                    {
                        headers: {
                            "api_password": "Fentec@scooters.algaria"
                        }
                    });

                if (response.data.status === true) {
                    setErrors([]);
                    setSuccessMsg(response.data.message);
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

    const handleMarkerPress = (coords) => {
        setReadyToNavigate(coords)
        setShowScooterDetails(true)
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

    return (
        <View style={{ flex: 1 }}>
            <Nav showQrScanner={() => setShowQrScanner(true)} closeScanner={() => setShowQrScanner(false)} showScanner={showQrScanner} navToScooter={() => navigateToDestenation(readyToNavigate.latitude, readyToNavigate.longitude)} showIotDetails={showScooterDetails} closeDetailsScooter={() => setShowScooterDetails(false)} active="2" navigation={navigation} goToMyLocation={() => cetnerLocation()} getNearstScooter={() => getNearstScooter()} />

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

            <View style={styles.head}>
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
                <View style={[styles.input, { width: 'auto', padding: 18, height: 60, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 15 }]}>
                    <FontAwesome5 name="coins" size={24} color="rgba(255, 199, 0, 1)" />
                    <Text style={{ fontSize: 18, fontFamily: 'Outfit_600SemiBold', }}>255</Text>
                </View>
            </View>

            <MapView
                style={styles.map}
                initialRegion={region}
                region={region}
                mapType='terrain'
                provider={PROVIDER_GOOGLE}
            >
                {location && (
                    <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} icon={require('./../assets/imgs/icons/current_icon.png')} style={[{ width: 20, height: 20, resizeMode: 'contain' }]} />
                )}
                {scooters.length > 0 && (
                    // Iterate through the scooters array
                    scooters.map((scooter) => (
                        <Marker key={scooter.id} onPress={() => handleMarkerPress({ latitude: parseFloat(scooter.latitude), longitude: parseFloat(scooter.longitude) })} coordinate={{ latitude: parseFloat(scooter.latitude), longitude: parseFloat(scooter.longitude) }} image={parseInt(scooter.battary_charge) > 65 ? require('./../assets/imgs/icons/high_charge.png') : (parseInt(scooter.battary_charge) < 30 ? require('./../assets/imgs/icons/low_charge.png') : require('./../assets/imgs/icons/medium_charge.png'))}>
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
