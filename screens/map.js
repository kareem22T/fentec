import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import Nav from './../components/mainNav';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';

export default function App({ navigation }) {
    const [location, setLocation] = useState(null);

    const [region, setRegion] = React.useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.02,
        longitudeDelta: 0.002
    })

    const [pin, setPin] = React.useState({
        latitude: 37.78825,
        longitude: -122.4324
    })

    const [errorMsg, setErrorMsg] = useState(null);

    let cetnerLocation = async () => {

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        if (location) {
            setRegion({
                latitude: 37.78825,
                longitude: -122.4324,
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

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
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

    return (
        <View style={{ flex: 1 }}>
            <Nav active="2" navigation={navigation} goToMyLocation={() => cetnerLocation()} />
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
                provider="google"
                mapType='terrain'
            >
                {location && (
                    <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} icon={require('./../assets/imgs/icons/current_icon.png')} style={[{ width: 20, height: 20, resizeMode: 'contain' }]} />
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
});
