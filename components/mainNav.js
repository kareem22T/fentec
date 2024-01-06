import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import * as React from 'react';
import { Entypo, FontAwesome, Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import QrScanner from './../screens/qrScanner'
import { useState, useEffect } from 'react';

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
    const handelserialNumfocused = () => {
        setSerialNumfocused(true);
    };

    return (
        <View style={styles.wrapper}>
            {props.active == 2 && (
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
                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}><Text><Entypo name="battery" size={30} color="black" /> </Text><Text style={{ fontSize: 18 }}>90% - Ride for 50 Km</Text></View>
                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}><Text><FontAwesome5 name="money-bill" size={24} color="black" /></Text><Text style={{ fontSize: 18 }}>5 points/minute</Text></View>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between', marginTop: 10 }}>
                            <TouchableOpacity style={[styles.choiceWrapper, styles.choiceActive, { backgroundColor: 'rgba(255, 115, 0, 1)', width: 50, padding: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 8 }]} onPress={showQrScanner} ><MaterialCommunityIcons name="qrcode-scan" size={28} color="black" /></TouchableOpacity>
                            <Text style={[styles.choiceWrapper, styles.choiceActive, { width: '58%', textAlign: 'center', fontSize: 18, fontFamily: 'Outfit_600SemiBold', padding: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 8 }]}>5 min. from you</Text>
                            <TouchableOpacity onPress={navToScooter} style={[styles.choiceWrapper, styles.choiceActive, { backgroundColor: 'rgba(255, 115, 0, 1)', width: 50, padding: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 8 }]}><FontAwesome5 name="directions" size={30} color="black" /></TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ position: 'absolute', top: 15, right: 15 }} onPress={closeDetailsScooter}><Ionicons name="md-close-circle-sharp" size={28} color="red" /></TouchableOpacity>
                    </View>
                ) : (
                    <View style={[styles.choiceWrapper, styles.choiceActive, { width: '90%', gap: 10, position: 'relative', }]}>
                        <QrScanner />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                            <TextInput
                                placeholder={'Write code manually'}
                                onChangeText={setSerialNum}
                                value={serialNum}
                                onFocus={() => handelserialNumfocused()}
                                onBlur={() => setSerialNumfocused(false)}
                                style={[
                                    styles.input,
                                    serialNumfocused && {
                                        borderColor: 'rgba(255, 115, 0, 1)',
                                        borderWidth: 2
                                    },
                                ]}

                            />
                            <TouchableOpacity onPress={navToScooter} style={[styles.choiceWrapper, styles.choiceActive, { backgroundColor: 'rgba(255, 115, 0, 1)', width: 60, padding: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 16 }]}><FontAwesome5 name="unlock" size={30} color="black" /></TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ position: 'absolute', top: -8, right: -8 }} onPress={closeScanner}><Ionicons name="md-close-circle-sharp" size={28} color="red" /></TouchableOpacity>
                    </View>
                )
                )
            )}
            <View style={styles.contianer}>
                <TouchableOpacity style={[styles.choiceWrapper, props.active == 1 && styles.choiceActive]} onPress={() => navigation.push('Profile', { user: user })}>
                    <Entypo name="home" size={40} color={props.active == 1 ? 'rgba(255, 115, 0, 1)' : 'black'} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.choiceWrapper, props.active == 2 && styles.choiceActive]} onPress={() => navigation.push('Map', { user: user })}>
                    <Ionicons name="map-sharp" size={40} color={props.active == 2 ? 'rgba(255, 115, 0, 1)' : 'black'} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.choiceWrapper, props.active == 3 && styles.choiceActive]} onPress={() => navigation.navigate('Account', { user: user })}>
                    <FontAwesome name="user" size={40} color={props.active == 3 ? 'rgba(255, 115, 0, 1)' : 'black'} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.choiceWrapper, props.active == 3 && styles.choiceActive, { display: 'none' }]} onPress={() => navigation.navigate('Account', { user: user })}>
                    <FontAwesome name="user" size={40} color={props.active == 3 ? 'rgba(255, 115, 0, 1)' : 'black'} />
                </TouchableOpacity>
            </View>
        </View>
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
