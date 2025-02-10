import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import TimerMixin from 'react-timer-mixin';
export default function App(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [token, setToken] = useState('')

    const askForCameraPermission = () => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })()
    }

    const getStoredToken = async () => {
        const user_token = await SecureStore.getItemAsync('user_token');
        if (user_token)
            return user_token

        return '';
    }


    const [successMsg, setSuccessMsg] = useState('');
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);


    // Request Camera Permission
    useEffect(() => {
        askForCameraPermission();
        getStoredToken().then(res => {
            setToken(res)
        })
    }, []);

    // What happens when we scan the bar code
    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        try {
            setLoading(true)
            const response = await axios.post("https://adminandapi.fentecmobility.com/unlock-scooter", {
                api_password: 'Fentec@scooters.algaria',
                scooter_serial: data
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
                    props.navigation.push('Map', {user: props.user})
                }, 2000)    
            } else {
                setLoading(false);
                setErrors(response.data.errors);
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
        console.log('Type: ' + type + '\nData: ' + data)
    };

    // Check permissions and return the screens
    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Requesting for camera permission</Text>
            </View>)
    }
    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={{ margin: 10 }}>No access to camera</Text>
                <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
            </View>)
    }

    // Return the View
    return (
        <>
            <Text style={{
                position: 'fixed', top: 0 + 0, right: 0, color: "#fff",
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
                position: 'fixed', top: 0 + 0, right: 0, color: "#fff",
                padding: 1 * 16,
                marginLeft: 10,
                fontSize: 1 * 16,
                backgroundColor: '#12c99b',
                fontFamily: 'Outfit_600SemiBold',
                borderRadius: 1.25 * 16,
                zIndex: 9999999999,
                display: successMsg == '' ? 'none' : 'flex'
            }}>{successMsg}</Text>
            <View style={styles.container}>
                <View style={styles.barcodebox}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={{ height: 550, width: 550 }} />
                </View>

                {
                    loading && (
                        <ActivityIndicator size="200px" color="#ff7300" />
                    )
                }

                {scanned && !loading && <Button title={'Scan again?'} onPress={() => setScanned(false)} color='tomato' />}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    maintext: {
        fontSize: 16,
        margin: 20,
    },
    barcodebox: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        width: 300,
        overflow: 'hidden',
        borderRadius: 30,
        backgroundColor: 'rgba(255, 115, 0, 1)',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20
    }
});
