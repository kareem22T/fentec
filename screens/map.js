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
            const response = await axios.get(`https://adminandapi.fentecmobility.com/map/scooters`);
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
                const response = await axios.get(`https://adminandapi.fentecmobility.com/map/nearest-scooter?lat=${location.coords.latitude}&lng=${location.coords.longitude}`,
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

    const handleMarkerPress = (coords, batt, id) => {
        setShowNav(false)
        setReadyToNavigate(coords)
        console.log(batt);
        setCurrentBattary(batt)
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
        setShowNav(true)
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
                    <Nav scooterDurationFar={currentDurationFar} battary_charge={currentBattary} showQrScanner={() => setShowQrScanner(true)} closeScanner={() => setShowQrScanner(false)} showScanner={showQrScanner} whereIdTheScooter={() => handleNotifyScooter()} navToScooter={() => navigateToDestenation(readyToNavigate.latitude, readyToNavigate.longitude)} showIotDetails={showScooterDetails} closeDetailsScooter={() => setShowScooterDetails(false)} active="2"  user={user} navigation={navigation} goToMyLocation={() => cetnerLocation()} getNearstScooter={() => getNearstScooter()} />
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
                {/* <View style={[styles.input, { width: 'auto', padding: 18, height: 60, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 15 }]}>
                    <FontAwesome5 name="coins" size={24} color="rgba(255, 199, 0, 1)" />
                    {user && (
                        <Text style={{ fontSize: 18, fontFamily: 'Outfit_600SemiBold', }}>{user.coins}</Text>
                    )}
                </View> */}
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
                        <Marker key={scooter.id} onPress={() => handleMarkerPress({ latitude: parseFloat(scooter.latitude), longitude: parseFloat(scooter.longitude)}, scooter.battary_charge, scooter.id)} coordinate={{ latitude: parseFloat(scooter.latitude), longitude: parseFloat(scooter.longitude) }} image={parseInt(scooter.battary_charge) > 60 ? require('./../assets/imgs/icons/high_charge.png') : (parseInt(scooter.battary_charge) < 30 ? require('./../assets/imgs/icons/low_charge.png') : require('./../assets/imgs/icons/medium_charge.png'))}>
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
