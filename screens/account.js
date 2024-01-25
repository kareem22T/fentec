import {
    StyleSheet, Text, TouchableOpacity, SafeAreaView, View, Image, TextInput, ScrollView, Modal, ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TimerMixin from 'react-timer-mixin';
import * as SecureStore from 'expo-secure-store';
import Nav from './../components/mainNav';
import { Feather, MaterialIcons, MaterialCommunityIcons, Entypo, AntDesign, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
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

export default function Account({ navigation, route }) {
    let user;
    if (route.params.user)
        user = route.params.user;

    const translations = {
        "en": {
            "logout": "Log Out",
            "password": "Password",
            "change_laguage": "Change Language",
            "edit_email": "Edit Email",
            "edit_phone": "Edit Phone",
            "change_password": "Change Password",
            "old_password": "Old Password",
            "new_password": "New Password",
            "new_password_com": "New Password Confirmation",
            "change": "Change",
            "edit": "Edit",
            "cancel": "Cancel",
            "save": "Save",
        },
        "fr": {
            "logout": "Se déconnecter",
            "password": "Mot de passe",
            "change_laguage": "Changer de Langue",
            "edit_email": "Modifier l'e-mail",
            "edit_phone": "Modifier le téléphone",
            "change_password": "Changer le mot de passe",
            "old_password": "ancien mot de passe",
            "new_password": "nouveau mot de passe",
            "new_password_com": "Confirmation mot de passe",
            "change": "Changes le",
            "edit": "Modifier",
            "cancel": "Annuler",
            "save": "Modifier",
        },
        "ar": {
            "logout": "تسجيل خروج",
            "password": "كلمة المرور",
            "change_laguage": "تغيير اللغة",
            "edit_email": "تعديل البريد الإلكتروني",
            "edit_phone": "تعديل رقم الهاتف",
            "change_password": "تغير كلمة المرور",
            "old_password": "كلمة المرور القديمة",
            "new_password": "كلمة المرور الجديدة",
            "new_password_com": "تأكيد كلمة السر الجديدة",
            "change": "تغير",
            "edit": "تعديل",
            "cancel": "الغاء",
            "save": "حفظ",
        }
    }
    const [emailfocused, setEmailfocused] = useState(false);
    const handleEmailFocus = () => {
        setEmailfocused(true);
    };
    const [email, setEmail] = useState(user ? user.email : '');
    const handleCancelEditEmail = () => {
        setEmail(user.email)
        setIsShowEditEmail(false)
    }
    const handleEditEmail = async (token) => {
        setLoading(true)
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/edit-email`, {
                new_email: email,
                api_password: 'Fentec@scooters.algaria'
            },
            {
                headers: {
                    'AUTHORIZATION': `Bearer ${token}`
                }
            },);

            if (response.data.status === true) {
                await SecureStore.setItemAsync('user_token', response.data.data.token)
                setErrors([]);
                setSuccessMsg(response.data.message);
                TimerMixin.setTimeout(() => {
                    setLoading(false);
                    navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'Verify',
                            params: {
                              email: email,
                              token: response.data.data.token,
                            },
                          },
                        ],
                      });
                }, 1500)
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

    const [phonefocused, setPhonefocused] = useState(false);
    const handlePhoneFocus = () => {
        setEmailfocused(true);
    };
    const [phone, setPhone] = useState(user ? user.phone : '');
    const handleCancelEditPhone = () => {
        setPhone(user.phone)
        setIShowEditPhone(false)
        setSuccessMsg('')
    }
    const handleEditPhone = async (token) => {
        setLoading(true)
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/edit-phone`, {
                new_phone: phone,
                api_password: 'Fentec@scooters.algaria'
            },
            {
                headers: {
                    'AUTHORIZATION': `Bearer ${token}`
                }
            },);

            if (response.data.status === true) {
                await SecureStore.setItemAsync('user_token', response.data.data.token)
                setErrors([]);
                setSuccessMsg(response.data.message);
                TimerMixin.setTimeout(() => {
                    setLoading(false);
                    navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'Profile',
                            params: {}, // No params to pass in this case
                          },
                        ],
                      });
                }, 1500)
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

    const [oldPasswordfocused, setOldPasswordfocused] = useState(false);
    const handleOldPasswordFocus = () => {
        setEmailfocused(true);
    };
    const [oldPassword, setOldPassword] = useState('');
    const handleCancelEditPassword = () => {
        setIShowEditPassword(false)
    }
    const [newPasswordfocused, setNewPasswordfocused] = useState(false);
    const handleNewPasswordFocus = () => {
        setEmailfocused(true);
    };
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmationfocused, setNewPasswordConfirmationfocused] = useState(false);
    const handleNewPasswordConfirmationFocus = () => {
        setEmailfocused(true);
    };
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
    const handleChangePassword = async (token) => {
        setLoading(true)
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/change-password`, {
                old_password: oldPassword,
                new_password: newPassword,
                new_password_confirmation: newPasswordConfirmation,
                api_password: 'Fentec@scooters.algaria'
            },
            {
                headers: {
                    'AUTHORIZATION': `Bearer ${token}`
                }
            },);

            if (response.data.status === true) {
                setErrors([]);
                setSuccessMsg(response.data.message);
                TimerMixin.setTimeout(() => {
                    setLoading(false);
                    navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'Profile',
                            params: {}, // No params to pass in this case
                          },
                        ],
                      });
                }, 1500)
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

    const handleChanePhoto = async (token) => {
        const formData = new FormData();

        if (image)
            formData.append('profile_img', {
                name: 'photo.jpg',
                uri: image,
                type: 'image/jpeg',
            })

        formData.append('api_password', 'Fentec@scooters.algaria')


        setLoading(true)
        setErrors([])
        console.log(token);
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/change-profile-pic`, formData,
                {
                    headers: {
                        'AUTHORIZATION': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                },

            );

            if (response.data.status === true) {
                setErrors([]);
                setSuccessMsg(response.data.message);
                await SecureStore.setItemAsync('user_token', response.data.data.token)
                TimerMixin.setTimeout(() => {
                    setLoading(false);
                    navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'Profile',
                            params: {}, // No params to pass in this case
                          },
                        ],
                      });
                }, 1500)
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
            console.log(error);
        }
    }


    // edit language ....
    const [isShowEditLanguage, setIsShowEditLanguage] = useState(false);
    const [isShowEditEmail, setIsShowEditEmail] = useState(false);
    const [iShowEditPhone, setIShowEditPhone] = useState(false);
    const [iShowEditPassword, setIShowEditPassword] = useState(false);
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

    const handleLogout = async () => {
        await SecureStore.setItemAsync('user_token', '')
        navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Profile',
                params: {}, // No params to pass in this case
              },
            ],
          });
        }
    const [scrollY, setScrollY] = useState(0);
    const onScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setScrollY(offsetY);
    };

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [token, setToken] = useState('')
    
    const getStoredToken = async () => {
        const user_token = await SecureStore.getItemAsync('user_token');
        if (user_token)
            setToken(user_token)
    }

    useEffect(() => {
        getStoredToken()
        getStoredLang();
    }, []);

    return (
        <SafeAreaView style={[styles.wrapper]}>
            <BackgroundImage></BackgroundImage>
            <Nav active="3" navigation={navigation} user={user}/>
            <ScrollView onScroll={onScroll} scrollEventThrottle={16} style={{ position: 'relative' }}>
            <Text style={{
                    position: 'absolute', top: scrollY + 50, right: 20, color: "#fff",
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
                    position: 'absolute', top: scrollY + 50, right: 20, color: "#fff",
                    padding: 1 * 16,
                    marginLeft: 10,
                    fontSize: 1 * 16,
                    backgroundColor: '#12c99b',
                    fontFamily: 'Outfit_600SemiBold',
                    borderRadius: 1.25 * 16,
                    zIndex: 9999999999,
                    display: successMsg == '' ? 'none' : 'flex'
                }}>{successMsg}</Text>
                {loading && (
                    <View style={{
                        width: '100%',
                        height: '100%',
                        zIndex: 336,
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
                <View style={styles.contianer}>
                    <View style={styles.profile}>
                        <View style={styles.bg}></View>
                        <View style={styles.head}>
                            <TouchableOpacity onPress={pickImage} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={image ? { uri: image } : (user && user.photo_path ? { uri: 'https://adminandapi.fentecmobility.com/images/uploads/' + user.photo_path } : require('./../assets/imgs/default_user.jpg'))}
                                    style={{ width: 100, height: 100, resizeMode: 'cover', borderRadius: 100, borderWidth: 4, borderColor: 'rgba(255, 115, 0, 1)' }} />
                                {image ? 
                                (
                                    <TouchableOpacity style={{ width: 30, height: 30, backgroundColor: 'rgba(255, 115, 0, 1)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: -17 }} onPress={() => handleChanePhoto(token)}>
                                        <AntDesign name="check" size={13} color="#fff" />
                                    </TouchableOpacity>
                                ) :
                                (
                                    <View style={{ width: 30, height: 30, backgroundColor: 'rgba(255, 115, 0, 1)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: -17 }}>
                                        <FontAwesome5 name="edit" size={13} color="#fff" />
                                    </View>
                                )
                                }
                            </TouchableOpacity>

                            {user && (
                                <Text style={styles.name}>{user.name}</Text>
                            )}
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
                        {user && (
                            <View style={[styles.input, { paddingLeft: 70 }]}><Text style={[styles.input_text, { color: '#000' }]}>{user.phone}</Text></View>
                        )}
                        <FontAwesome name="phone" size={35} color="black" style={{ position: 'absolute', left: 40 }} />
                        <FontAwesome5 name="edit" size={30} color="rgba(255, 115, 0, 1)" style={{ position: 'absolute', right: 40 }} onPress={() => {setIShowEditPhone(true)}} />
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        {user && (
                            <View style={[styles.input, { paddingLeft: 70, paddingRight: 60 }]}><Text style={[styles.input_text, { color: '#000', fontSize: 16, lineHeight: 30 }]}>{user.email}</Text></View>
                        )}
                        <MaterialIcons name="email" size={35} color="black" style={{ position: 'absolute', left: 40 }} />
                        <TouchableOpacity onPress={() => setIsShowEditEmail(true)} style={{ position: 'absolute', right: 40 }} >
                            <FontAwesome5 name="edit" size={30} color="rgba(255, 115, 0, 1)" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <View style={[styles.input, { paddingLeft: 70, paddingRight: 60 }]}><Text style={[styles.input_text, { color: '#000', fontSize: 16, lineHeight: 30 }]}>{screenContent.password}</Text></View>
                        <Entypo name="lock" size={35} color="black" style={{ position: 'absolute', left: 40 }} />
                        <TouchableOpacity onPress={() => setIShowEditPassword(true)} style={{ position: 'absolute', right: 40 }} >
                            <FontAwesome5 name="edit" size={30} color="rgba(255, 115, 0, 1)" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <TouchableOpacity onPress={() => handleLogout()} style={[styles.input, styles.btn]}><Text style={[styles.input_text, { textAlign: 'left', width: '100%' }]}><MaterialCommunityIcons name="logout" size={30} color="black" /> { screenContent.logout }</Text></TouchableOpacity>
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
                        <Text style={[styles.name, lang == 'ar' && {lineHeight: 40, fontSize: 28}]}>{screenContent.change_laguage}</Text>
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
                                <Text style={[styles.button_text, { color: '#000' }]}>{screenContent.cancel}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => storeLang()} style={[styles.btn, { width: '40%', alignItems: 'center' }]}>
                                <Text style={[styles.button_text, { color: '#fff' }]}>{screenContent.save}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Modal>

            <Modal
                animationType='fade'
                transparent={true}
                visible={isShowEditEmail}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <MaterialCommunityIcons name="email-edit-outline" size={60} color="rgba(255, 115, 0, 1)" style={{marginBottom: 5}} />
                        <Text style={[styles.name, lang == 'ar' && {lineHeight: 40, fontSize: 28}]}>{screenContent.edit_email}</Text>
                        {user && (
                            <TextInput
                                placeholder={screenContent.email_e}
                                onChangeText={setEmail}
                                value={email}
                                onFocus={() => handleEmailFocus()}
                                onBlur={() => setEmailfocused(false)}
                                style={[
                                    styles.input,
                                    emailfocused && {
                                        borderColor: 'rgba(255, 115, 0, 1)',
                                        borderWidth: 2
                                    },
                                    {
                                        padding: 1.25 * 16,
                                        marginTop: 10,
                                        marginBottom: 20
                                    }
                                ]}

                            />
                        )}
                        <View style={{ flexDirection: 'row', alignItems: 'end', gap: 20, }}>
                            <TouchableOpacity onPress={() => handleCancelEditEmail()} style={[styles.btn, { backgroundColor: '#c2c2c2', width: '40%', alignItems: 'center' }]}>
                                <Text style={[styles.button_text, { color: '#000' }]}>{screenContent.cancel}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleEditEmail(token)} style={[styles.btn, { width: '40%', alignItems: 'center' }]}>
                                <Text style={[styles.button_text, { color: '#fff' }]}>{screenContent.edit}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Modal>

            <Modal
                animationType='fade'
                transparent={true}
                visible={iShowEditPhone}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <Feather name="phone" size={60} color="rgba(255, 115, 0, 1)" />
                    <Text style={[styles.name, lang == 'ar' && {lineHeight: 40, fontSize: 28}]}>{screenContent.edit_phone}</Text>
                        {user && (
                            <TextInput
                                placeholder={screenContent.email_e}
                                onChangeText={setPhone}
                                value={phone}
                                onFocus={() => handlePhoneFocus()}
                                onBlur={() => setPhonefocused(false)}
                                style={[
                                    styles.input,
                                    phonefocused && {
                                        borderColor: 'rgba(255, 115, 0, 1)',
                                        borderWidth: 2
                                    },
                                    {
                                        marginTop: 10,
                                        marginBottom: 20
                                    }
                                ]}

                            />
                        )}
                        <View style={{ flexDirection: 'row', alignItems: 'end', gap: 20, }}>
                            <TouchableOpacity onPress={() => handleCancelEditPhone()} style={[styles.btn, { backgroundColor: '#c2c2c2', width: '40%', alignItems: 'center' }]}>
                                <Text style={[styles.button_text, { color: '#000' }]}>{screenContent.cancel}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleEditPhone(token)} style={[styles.btn, { width: '40%', alignItems: 'center' }]}>
                                <Text style={[styles.button_text, { color: '#fff' }]}>{screenContent.edit}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Modal>

            <Modal
                animationType='fade'
                transparent={true}
                visible={iShowEditPassword}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <AntDesign name="lock" size={60} color="rgba(255, 115, 0, 1)" />
                        <Text style={[styles.name, lang == 'ar' && {lineHeight: 40, fontSize: 28}]}>{screenContent.change_password}</Text>
                        <TextInput
                            placeholder={screenContent.old_password}
                            onChangeText={setOldPassword}
                            value={oldPassword}
                            onFocus={() => handleOldPasswordFocus()}
                            onBlur={() => setOldPasswordfocused(false)}
                            style={[
                                styles.input,
                                oldPasswordfocused && {
                                    borderColor: 'rgba(255, 115, 0, 1)',
                                    borderWidth: 2
                                },
                                currentLang == 'ar' && {
                                    textAlign: 'right',
                                },
                                {
                                    marginTop: 10,
                                    marginBottom: 20
                                }
                            ]}

                        />
                        <TextInput
                            placeholder={screenContent.new_password}
                            onChangeText={setNewPassword}
                            value={newPassword}
                            onFocus={() => handleNewPasswordFocus()}
                            onBlur={() => setNewPasswordfocused(false)}
                            style={[
                                styles.input,
                                newPasswordfocused && {
                                    borderColor: 'rgba(255, 115, 0, 1)',
                                    borderWidth: 2
                                },
                                currentLang == 'ar' && {
                                    textAlign: 'right',
                                },
                                {
                                    marginTop: 10,
                                    marginBottom: 20
                                }
                            ]}

                        />
                        <TextInput
                            placeholder={screenContent.new_password_com}
                            onChangeText={setNewPasswordConfirmation}
                            value={newPasswordConfirmation}
                            onFocus={() => handleNewPasswordConfirmationFocus()}
                            onBlur={() => setNewPasswordConfirmationfocused(false)}
                            style={[
                                styles.input,
                                newPasswordConfirmationfocused && {
                                    borderColor: 'rgba(255, 115, 0, 1)',
                                    borderWidth: 2
                                },
                                currentLang == 'ar' && {
                                    textAlign: 'right',
                                },
                                {
                                    marginTop: 10,
                                    marginBottom: 20
                                }
                            ]}

                        />
                        <View style={{ flexDirection: 'row', alignItems: 'end', gap: 20, }}>
                            <TouchableOpacity onPress={() => handleCancelEditPassword()} style={[styles.btn, { backgroundColor: '#c2c2c2', width: '40%', alignItems: 'center' }]}>
                                <Text style={[styles.button_text, { color: '#000' }]}>{screenContent.cancel}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleChangePassword(token)} style={[styles.btn, { width: '40%', alignItems: 'center' }]}>
                                <Text style={[styles.button_text, { color: '#fff' }]}>{screenContent.change}</Text>
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
        marginTop: 70,
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
        marginTop: 50
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