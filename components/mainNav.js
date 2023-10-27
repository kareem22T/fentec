import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import * as React from 'react';
import { Entypo, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function LoginHeader(props) {
    navigation = props.navigation
    let goToMyLocation = props.goToMyLocation
    return (
        <View style={styles.wrapper}>
            {props.active == 2 && (
                <View style={{ flexDirection: 'row', gap: 7 }}>
                    <TouchableOpacity style={[styles.choiceWrapper, styles.choiceActive]} onPress={() => navigation.navigate('Profile')}>
                        <Entypo name="direction" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.choiceWrapper, styles.choiceActive, { backgroundColor: 'rgba(255, 115, 0, 1)' }]} onPress={goToMyLocation}>
                        <MaterialIcons name="qr-code-scanner" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.choiceWrapper, styles.choiceActive]} onPress={goToMyLocation}>
                        <MaterialIcons name="my-location" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            )}
            <View style={styles.contianer}>
                <TouchableOpacity style={[styles.choiceWrapper, props.active == 1 && styles.choiceActive]} onPress={() => navigation.navigate('Profile')}>
                    <Entypo name="home" size={40} color={props.active == 1 ? 'rgba(255, 115, 0, 1)' : 'black'} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.choiceWrapper, props.active == 2 && styles.choiceActive]} onPress={() => navigation.navigate('Map')}>
                    <Ionicons name="map-sharp" size={40} color={props.active == 2 ? 'rgba(255, 115, 0, 1)' : 'black'} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.choiceWrapper, props.active == 3 && styles.choiceActive]} onPress={() => navigation.navigate('Account')}>
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
    }
});
