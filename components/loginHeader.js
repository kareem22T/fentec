import { StyleSheet, View, Image, Text } from 'react-native';
import * as React from 'react';

export default function LoginHeader(props) {

    return (
        <View style={styles.contianer}>
            <View style={styles.step_wrapper}>
                <Text style={props.active == 1 ? styles.step_active : styles.step}></Text>
                <Image source={require('./../assets/imgs/icons/globe.png')} style={styles.step_img} />
            </View>
            <View style={styles.step_wrapper}>
                <Text style={props.active == 2 ? styles.step_active : styles.step}></Text>
                <Image source={require('./../assets/imgs/icons/cards.png')} style={styles.step_img} />
            </View>
            <View style={styles.step_wrapper}>
                <Text style={props.active == 3 ? styles.step_active : styles.step}></Text>
                <Image source={require('./../assets/imgs/icons/user.png')} style={styles.step_img} />
            </View>
            <View style={styles.step_wrapper}>
                <Image source={require('./../assets/imgs/icons/caret-right.png')} style={styles.last_img} />
                <Text style={{ height: 21 }}></Text>
            </View>
            <View style={styles.header_after}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    contianer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 40,
        marginBottom: 30,
        zIndex: 3,
        paddingRight: 20,
        paddingLeft: 20,
    },
    heading: {
        // fontFamily: './../assets/fonts/Outfit-SemiBold.ttf',
        fontSize: 2.5 * 16,
        // fontWeight: '600',
        lineHeight: 55,
        letterSpacing: 0,
        textAlign: 'center',
        marginTop: 30
    },
    header_after: {
        width: '90%',
        height: 3,
        backgroundColor: '#000',
        position: 'absolute',
        left: 35,
        top: 7,
        zIndex: -1,
    },
    step_wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    step: {
        width: 1 * 16,
        height: 1 * 16,
        backgroundColor: '#000',
        borderRadius: 50,
        borderColor: 'black',
        borderWidth: 3,
        position: 'relative',
    },
    step_active: {
        width: 1 * 16,
        height: 1 * 16,
        backgroundColor: '#000',
        borderRadius: 50,
        borderColor: 'black',
        borderWidth: 3,
        position: 'relative',
        backgroundColor: '#ff7300'
    },
    step_img: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        opacity: 1
    },
    last_img: {
        width: 25,
        height: 24,
        resizeMode: 'contain',
        opacity: 1,
        transform: [{ translateY: -3 }, { translateX: -5 }],
    }
});
