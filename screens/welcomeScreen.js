import { StyleSheet, Text, TouchableOpacity, ScrollView, View, Image } from 'react-native';
import * as React from 'react';

const BackgroundImage = () => {
    return (
        <Image source={require('./../assets/imgs/PT.png')} style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
        }} />
    )
}

export default function Welcome({ navigation }) {


    return (
        <ScrollView style={styles.wrapper} contentContainerStyle={{flexGrow: 1}}>
            <BackgroundImage></BackgroundImage>
            <View style={styles.contianer}>
                <Text style={styles.heading}>
                    Welcome {'\n'}
                    to <Text style={styles.heading_span}>FenTec</Text> {'\n'}
                    Mobility
                </Text>
                <Image source={require('./../assets/imgs/adaptive-icon.png')} alt="fentec logo" style={styles.logo} />
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('chooseLanguage')}>
                    <View style={styles.btn_span}></View>
                    <Text style={styles.btn_text}>Let's go</Text>
                    <Image source={require('./../assets/imgs/icons/angles-right.png')} style={styles.btn_svg} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    contianer: {
        padding: 1.9 * 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        zIndex: 3
    },
    heading: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 50,
        lineHeight: 55,
        letterSpacing: 0,
        textAlign: 'center',
        marginTop: 30
    },
    heading_span: {
        color: '#ff7300'
    },
    logo: {
        opacity: 1,
        width: 330,
        height: 330,
        resizeMode: 'contain',
    },
    btn: {
        color: '#000',
        backgroundColor: '#fff',
        // Android
        elevation: 4,

        // iOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        width: '100%',
        borderRadius: 60,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 20,
        padding: 10,
        height: 'auto'
    },
    btn_text: {
        fontSize: 2 * 16,
        fontFamily: 'Outfit_600SemiBold',
        letterSpacing: 0,
        textAlign: 'center',
    },
    btn_span: {
        width: 45,
        height: 45,
        borderRadius: 50,
        backgroundColor: '#ff7300'
    },
    btn_svg: {
        opacity: 1,
        width: 35,
        height: 35,
        resizeMode: 'contain',
        marginEnd: 10
    }
});
