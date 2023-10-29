import {
    StyleSheet, ScrollView, SafeAreaView, Text
} from 'react-native';
import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export default function Home({ navigation }) {
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

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

    const getUser = async (token) => {
        setLoading(true)
        setErrors([])
        try {
            const response = await axios.post(`https://9a41-197-37-230-100.ngrok-free.app/get-user`, {
                api_password: 'Fentec@scooters.algaria'
            },
                {
                    headers: {
                        'AUTHORIZATION': `Bearer ${token}`
                    }
                },);

            if (response.data.status === true) {
                setLoading(false);
                setErrors([]);
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

    const showScreens = (first = true, user, token) => {
        if (!user && first) {
            navigation.navigate('Welcome')
        } else if (!user && !first) {
            navigation.navigate('Login')
        } else if (user.verify && user.name != null) {
            navigation.navigate('Profile');
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
                    getUser(token).then((user) => {
                        showScreens(isfirst, user, token)
                    })
                } else {
                    showScreens(isfirst, res)
                }
            })
        });
    }, []);

    return (
        <SafeAreaView style={styles.wrapper}>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
});
