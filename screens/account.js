import {
    StyleSheet, Text, TouchableOpacity, SafeAreaView, View, Image, TextInput, ScrollView, Modal
} from 'react-native';
import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import Nav from './../components/mainNav';
import { SimpleLineIcons, MaterialIcons, MaterialCommunityIcons, Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';


const BackgroundImage = () => {
    return (
        <Image source={require('./../assets/imgs/setting_bg.png')} style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
        }} />
    )
}

export default function Account({ navigation }) {
    const translations = {
        "en": {
        },
        "fr": {
        },
        "ar": {
        }
    }
    const [currentLang, setCurrentLag] = useState('ar')
    const [screenContent, setScreenContent] = useState(translations.ar);

    const [image, setImage] = useState(null);
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            const compressedImage = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [],
                {
                    compress: 0.5
                }
            );

            setImage(compressedImage.uri);
        }
    };

    // edit language ....
    const [isShowEditLanguage, setIsShowEditLanguage] = useState(false);
    const [lang, setLang] = useState('ar');
    const storeLang = async () => {
        await SecureStore.setItemAsync('lang', lang)
        setIsShowEditLanguage(false)
        getStoredLang()
    }

    const getStoredLang = async () => {
        const storedLang = await SecureStore.getItemAsync('lang');
        if (storedLang) {
            setScreenContent(translations[storedLang])
            setCurrentLag(storedLang)
            setLang(storedLang)
        }
    }
    // ---------


    useEffect(() => {
        getStoredLang();
    }, []);

    return (
        <SafeAreaView style={[styles.wrapper]}>
            <BackgroundImage></BackgroundImage>
            <Nav active="3" navigation={navigation} />
            <ScrollView>
                <View style={styles.contianer}>
                    <View style={styles.profile}>
                        <View style={styles.bg}></View>
                        <View style={styles.head}>
                            <TouchableOpacity onPress={pickImage} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={image ? { uri: image } : require('./../assets/imgs/default_user.jpg')}
                                    style={{ width: 100, height: 100, resizeMode: 'cover', borderRadius: 100, borderWidth: 4, borderColor: 'rgba(255, 115, 0, 1)' }} />
                                <View style={{ width: 30, height: 30, backgroundColor: 'rgba(255, 115, 0, 1)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: -17 }}>
                                    <FontAwesome5 name="edit" size={13} color="#fff" />
                                </View>
                            </TouchableOpacity>

                            <Text style={styles.name}>Kareem Mohamed</Text>
                        </View>
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <View style={[styles.input, { paddingLeft: 70 }]}><Text style={[styles.input_text, { color: '#000' }]}>{currentLang == 'en' ? "English" : (currentLang == "fr" ? "Française" : "العربية")}</Text></View>
                        <MaterialIcons name="language" size={35} color="black" style={{ position: 'absolute', left: 40 }} />
                        <TouchableOpacity onPress={() => setIsShowEditLanguage(true)} style={{ position: 'absolute', right: 40 }} >
                            <FontAwesome5 name="edit" size={30} color="rgba(255, 115, 0, 1)" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <TouchableOpacity style={[styles.input, { paddingLeft: 70 }]}><Text style={[styles.input_text, { color: '#000' }]}>01550552371</Text></TouchableOpacity>
                        <FontAwesome name="phone" size={35} color="black" style={{ position: 'absolute', left: 40 }} />
                        <FontAwesome5 name="edit" size={30} color="rgba(255, 115, 0, 1)" style={{ position: 'absolute', right: 40 }} />
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <TouchableOpacity style={[styles.input, { paddingLeft: 70, paddingRight: 60 }]}><Text style={[styles.input_text, { color: '#000', fontSize: 16, lineHeight: 30 }]}>kotbekareem74@gmail.com</Text></TouchableOpacity>
                        <MaterialIcons name="email" size={35} color="black" style={{ position: 'absolute', left: 40 }} />
                        <FontAwesome5 name="edit" size={30} color="rgba(255, 115, 0, 1)" style={{ position: 'absolute', right: 40 }} />
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <TouchableOpacity style={[styles.input, { paddingLeft: 70, paddingRight: 60 }]}><Text style={[styles.input_text, { color: '#000', fontSize: 16, lineHeight: 30 }]}>Password</Text></TouchableOpacity>
                        <Entypo name="lock" size={35} color="black" style={{ position: 'absolute', left: 40 }} />
                        <FontAwesome5 name="edit" size={30} color="rgba(255, 115, 0, 1)" style={{ position: 'absolute', right: 40 }} />
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <TouchableOpacity style={[styles.input, styles.btn]}><Text style={[styles.input_text, { textAlign: 'left', width: '100%' }]}><MaterialCommunityIcons name="logout" size={30} color="black" /> Log Out</Text></TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Modal
                animationType='fade'
                transparent={true}
                visible={isShowEditLanguage}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <FontAwesome name="language" size={60} color="rgba(255, 115, 0, 1)" />
                        <Text style={styles.name}>Change Language</Text>
                        <View style={styles.lan_btns}>
                            <TouchableOpacity style={[styles.choose_btn, lang == 'ar' && {
                                borderColor: 'rgba(255, 115, 0, 1)',
                                backgroundColor: '#fff',
                                borderWidth: 3,
                                opacity: 1
                            }]} onPress={() => setLang('ar')}>
                                <Text style={styles.btn_small_text}>العربية</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.choose_btn, lang == 'en' && {
                                borderColor: 'rgba(255, 115, 0, 1)',
                                backgroundColor: '#fff',
                                borderWidth: 3,
                                opacity: 1
                            }]} onPress={() => setLang('en')}>
                                <Text style={styles.btn_small_text}>English</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.choose_btn, lang == 'fr' && {
                                borderColor: 'rgba(255, 115, 0, 1)',
                                backgroundColor: '#fff',
                                borderWidth: 3,
                                opacity: 1
                            }]} onPress={() => setLang('fr')}>
                                <Text style={styles.btn_small_text}>française</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'end', gap: 20, }}>
                            <TouchableOpacity onPress={() => setIsShowEditLanguage(false)} style={[styles.btn, { backgroundColor: '#c2c2c2', width: '40%', alignItems: 'center' }]}>
                                <Text style={[styles.button_text, { color: '#000' }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => storeLang()} style={[styles.btn, { width: '40%', alignItems: 'center' }]}>
                                <Text style={[styles.button_text, { color: '#fff' }]}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Modal>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        marginTop: 70
    },
    contianer: {
        padding: '1.25rem',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        zIndex: 3,
        gap: 10,
        paddingBottom: 160
    },
    title: {
        fontSize: 1.25 * 16,
        fontFamily: 'Outfit_600SemiBold',
        lineHeight: 1.5 * 16,
        textAlign: 'center',
        marginTop: 70
    },
    profile: {
        // padding: 16,
        paddingTop: 20,
        paddingBottom: 20,
        width: '65%',
        gap: 1.25 * 16,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40
    },
    head: {
        alignItems: "center",
        justifyContent: "center",
        gap: 16
    },
    profile_img: {
        width: 16 * 7,
        height: 16 * 7,
        borderRadius: 8 * 7,
        resizeMode: "cover",
        borderColor: "rgba(255, 115, 0, 1)",
        borderWidth: 3
    },
    name: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 22,
        textAlign: 'center'
    },
    details: {
        width: '100%',
        flexDirection: "row",
        justifyContent: 'center',
        gap: 1.25 * 16
    },
    trips: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        color: 'black',
        width: '40%',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        gap: 10
    },
    trips_text: {
        fontSize: 1.25 * 16,
        fontFamily: 'Outfit_400Regular',
        textAlign: 'center',
    },
    bg: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        height: "80%",
        backgroundColor: '#ffffff', // Replace with your desired background color
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    contianer_bg: {
        width: '90%',
        backgroundColor: '#ffffff', // Replace with your desired background color
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        padding: 10,
        marginBottom: 10,
        marginTop: 10,
        gap: 10
    },
    navigate_Text: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 18,
        textAlign: 'center',
        margin: 5,
        color: 'rgba(255, 115, 0, 1)'
    },
    btn: {
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 1.25 * 16,
        backdropFilter: "blur(1)",
        width: "90%",
        backgroundColor: "#ff7300",
        transition: "all .3s ease-in",
        border: "3 solid #ff7300",
        // marginBottom: 1.25 * 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button_text: {
        color: "#fff",
        fontFamily: 'Outfit_700Bold',
        fontSize: 28,
        textAlign: "center",
    },
    how_container: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20
    },
    how_element: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#ffffff', // Replace with your desired background color
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        padding: 14,
        marginBottom: 10,
        marginTop: 10,
        gap: 10,
        width: '48%'
    },
    input: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.25 * 16,
        // fontWeight: 600,
        lineHeight: 1.5 * 16,
        textAlign: 'left',
        padding: 1.5 * 16,
        borderRadius: 1.25 * 16,
        backgroundColor: "rgba(255, 255, 255, 1)",
        width: "90%",
        color: 'gray',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    input_text: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.5 * 16,
        textAlign: 'left',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, .5)'
    },
    modalView: {
        // margin: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: '100%',
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
    },
    lan_btns: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        gap: 10
    },
    choose_btn: {
        padding: 10,
        borderRadius: 10,
        opacity: .5,
        width: 110,
        borderWidth: 1,
        borderColor: 'gray'
    },
    btn_small_text: {
        fontSize: 19,
        fontFamily: "Outfit_600SemiBold",
        textAlign: 'center',
    }
});