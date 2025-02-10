import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, View, Platform, ScrollView, StyleSheet, Text, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import LoginHeader from '../components/loginHeader';
import * as SecureStore from 'expo-secure-store';
import TimerMixin from 'react-timer-mixin';
import * as ImageManipulator from 'expo-image-manipulator';
import { AntDesign } from '@expo/vector-icons';
import DatePicker from '@react-native-community/datetimepicker';
import { Entypo } from "@expo/vector-icons";

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

export default function LastStep({ navigation, route }) {
    const [currentLang, setCurrentLag] = useState('ar')
    const [showDobDatePicker, setShowDobDatePicker] = useState(false)
const translations = {
    "en": {
        "head": route.params.user ? "Edit Profile" : "Last step",
        "name": "Name",
        "open_cam": "Open Camera",
        "open_gallery": "Select from gallery",
        "start": route.params.user ? "Edit Data" : "Let's Start !",
        "id": "Identity Verification",
        'dob': 'Date of Birth',
        'back_btn': "Back and delete my account!",
        'confirm_delete_title': "Delete Account",
        'confirm_delete_message': "Are you sure you want to delete your account? This action cannot be undone.",
        'confirm_delete_yes': "Yes, Delete",
        'confirm_delete_no': "No, Cancel",
        'camera_permission_message': "We need access to your camera to upload your profile photo.",
        'gallery_permission_message': "We need access to your gallery to upload your profile photo.",
        'identity_camera_permission_message': "We need access to your camera to upload your identity image. This is used to ensure that the vehicles are protected from future misuse.",
        'identity_gallery_permission_message': "We need access to your gallery to upload your identity image. This is used to ensure that the vehicles are protected from future misuse.",
    },
    "fr": {
        "head": "Dernière étape",
        "name": "Nom",
        "open_cam": "Ouvrir la caméra",
        "open_gallery": "la galerie",
        "start": "Allons-y",
        "id": "vérification d'identité",
        'back_btn': "Revenez et supprimez mon compte!",
        'dob': "date de naissance",
        'confirm_delete_title': "Supprimer le compte",
        'confirm_delete_message': "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
        'confirm_delete_yes': "Oui, supprimer",
        'confirm_delete_no': "Non, annuler",
        'camera_permission_message': "Nous avons besoin d'accéder à votre caméra pour télécharger votre photo de profil.",
        'gallery_permission_message': "Nous avons besoin d'accéder à votre galerie pour télécharger votre photo de profil.",
        'identity_camera_permission_message': "Nous avons besoin d'accéder à votre caméra pour télécharger votre image d'identité. Cela est utilisé pour garantir que les véhicules sont protégés contre toute utilisation future abusive.",
        'identity_gallery_permission_message': "Nous avons besoin d'accéder à votre galerie pour télécharger votre image d'identité. Cela est utilisé pour garantir que les véhicules sont protégés contre toute utilisation future abusive.",
    },
    "ar": {
        "head": route.params.user ? "تعديل الحساب" : "اخر خطوة",
        'name': "الاسم",
        "open_cam": "استعمل الكاميرا",
        "open_gallery": "اختر من المعرض",
        "start": route.params.user ? "تحديث البيانات" : "لنبدأ !",
        "id": "صورة من الهوية الشخصية",
        'back_btn': "العودة وحذف حسابي!",
        'dob': 'تاريخ الميلاد',
        'confirm_delete_title': "حذف الحساب",
        'confirm_delete_message': "هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.",
        'confirm_delete_yes': "نعم، احذف",
        'confirm_delete_no': "لا، إلغاء",
        'camera_permission_message': "نحتاج إلى الوصول إلى الكاميرا لتحميل صورة ملفك الشخصي.",
        'gallery_permission_message': "نحتاج إلى الوصول إلى المعرض لتحميل صورة ملفك الشخصي.",
        'identity_camera_permission_message': "نحتاج إلى الوصول إلى الكاميرا لتحميل صورة الهوية الخاصة بك. يتم استخدام هذه الصورة لضمان حماية المركبات من الاستخدام غير المشروع في المستقبل.",
        'identity_gallery_permission_message': "نحتاج إلى الوصول إلى المعرض لتحميل صورة الهوية الخاصة بك. يتم استخدام هذه الصورة لضمان حماية المركبات من الاستخدام غير المشروع في المستقبل.",
    }
};    const [screenContent, setScreenContent] = useState(translations.ar);

    const [showChoices, setShowChoices] = useState()
    const getStoredLang = async () => {
        const storedLang = await SecureStore.getItemAsync('lang');
        if (storedLang) {
            setScreenContent(translations[storedLang])
            setCurrentLag(storedLang)
        }
    }

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');

    const [image, setImage] = useState(null);
    const pickImage = async () => {
        // Request permission and show message
        Alert.alert(
            "Permission Request",
            screenContent.gallery_permission_message,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                        if (status !== 'granted') {
                            Alert.alert("Permission Denied", "You need to grant permission to access the gallery.");
                            return;
                        }

                        let result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.All,
                            allowsEditing: true,
                            aspect: [4, 4],
                            quality: 1,
                        });

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
                    }
                }
            ]
        );
    };

    const [Identity, setIdentity] = useState();

    const pickId = async () => {
        // Request permission and show message
        Alert.alert(
            "Permission Request",
            screenContent.identity_gallery_permission_message,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                        if (status !== 'granted') {
                            Alert.alert("Permission Denied", "You need to grant permission to access the gallery.");
                            return;
                        }

                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 1,
                        });

                        if (!result.cancelled) {
                            const compressedId = await ImageManipulator.manipulateAsync(
                                result.assets[0].uri,
                                [],
                                {
                                    compress: 0.5
                                }
                            );

                            setIdentity(compressedId.uri);
                        }
                    }
                }
            ]
        );
    }

    const [namefocused, setNamefocused] = useState(false);
    const handleNameFocus = () => {
        setNamefocused(true);
    };

    const [name, setName] = useState(route.params.user ? route.params.user.name : "");

    const [dobfocused, setDobfocused] = useState(false);
    const handleDobFocus = () => {
        setDobfocused(true);
    };

    const [dob, setDob] = useState(route.params.user && route.params.user.dob ? new Date(route.params.user.dob) : null);
    const [date, setDate] = useState(new Date);
    const [isShowDatePicker, setIsShowDatePicker] = useState(false);

    const ShowDatePicker = () => {
        setIsShowDatePicker(!isShowDatePicker)
    }

    const handleDobChange = (porpDate) => {
        setDob(porpDate)
        setDate(porpDate)
    }

    const handlechangeDob = (date) => {
        console.log(date.toISOString());
        setDob(date)
        setShowDobDatePicker(false)    
    }

    const sendLastStepData = async (token) => {
        const formData = new FormData();
        if (name)
            formData.append('name', name)

        if (dob)
            formData.append('dob', new Date(dob).toISOString().slice(0, 10))

        if (Identity)
            formData.append('identity', {
                name: 'identity.jpg',
                uri: Identity,
                type: 'image/jpeg',
            })

        if (image)
            formData.append('photo', {
                name: 'photo.jpg',
                uri: image,
                type: 'image/jpeg',
            })

        formData.append('api_password', 'Fentec@scooters.algaria')

        setLoading(true)
        setErrors([])
        try {
            const response = await axios.post(`https://adminandapi.fentecmobility.com/register_2`, formData,
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
                TimerMixin.setTimeout(() => {
                    setLoading(false);
                    if (route.params.user)
                        navigation.reset({
                            index: 0,
                            routes: [
                            {
                                name: 'Profile',
                                params: {}, // No params to pass in this case
                            },
                            ],
                        });
                    else
                        if (route.params.isEdit) {
                            navigation.reset({
                                index: 0,
                                routes: [
                                {
                                    name: 'Profile',
                                    params: {}, // No params to pass in this case
                                },
                                ],
                            });    
                        } else {
                            navigation.reset({
                                index: 0,
                                routes: [
                                {
                                    name: 'WhereKnow',
                                    params: {
                                    token: token,
                                    },
                                },
                                ],
                            });
                        }
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
            console.log(error);
        }
    }

    useEffect(() => {
        if (route.params.idPhoto)
            setIdentity(route.params.idPhoto)
        if (route.params.name)
            setName(route.params.name)
        if (route.params.googleName)
            setName(route.params.googleName)
        if (route.params.dob)
            setDob(route.params.dob)
        getStoredLang();
    }, []);

    const [showConfirmModal, setShowConfirmModal] = useState(false); // State for confirmation modal

    // Function to handle account deletion
    const deleteAccount = async () => {
        setLoading(true);
        
        try {
            const response = await axios.delete('https://adminandapi.fentecmobility.com/delete-my-account?api_password=Fentec@scooters.algaria',{
                headers: {
                    'Authorization': `Bearer ${route.params.token}`,
                },
            });

            if (response.data.status) {
                setLoading(false);
                setSuccessMsg(response.data.message);
                // Clear SecureStore and navigate to the login screen
                await SecureStore.deleteItemAsync('token');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            } else {
                setLoading(false);
                setErrors([response.data.message || "Failed to delete account."]);
            }
        } catch (error) {
            setLoading(false);
            setErrors(["Server error, try again later."]);
            console.log(error);
        }
    };

    const ConfirmDeleteModal = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={showConfirmModal}
            onRequestClose={() => setShowConfirmModal(false)}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>{screenContent.confirm_delete_title}</Text>
                    <Text style={styles.modalMessage}>{screenContent.confirm_delete_message}</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonYes]}
                            onPress={() => {
                                setShowConfirmModal(false);
                                deleteAccount();
                            }}
                        >
                            <Text style={styles.modalButtonText}>{screenContent.confirm_delete_yes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonNo]}
                            onPress={() => setShowConfirmModal(false)}
                        >
                            <Text style={styles.modalButtonText}>{screenContent.confirm_delete_no}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.wrapper}>
            <LoginHeader active={3}></LoginHeader>
            <BackgroundImage></BackgroundImage>
            {
                showDobDatePicker && (
                    <DatePicker
                    date={new Date().toString()}
                    value={dob ? dob : new Date()}
                    onChange={(date) => handlechangeDob(new Date(date['nativeEvent']['timestamp']))}
                    icon={<Entypo name="chevron-right" size={40} color="#689CA3" />}
                    />
                )
            }
            <Text style={{
                position: 'absolute', top: 50, right: 20, color: "#fff",
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
                position: 'absolute', top: 50, right: 20, color: "#fff",
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
            <ScrollView contentContainerStyle={styles.contianer}>
                <Text style={styles.head}>{screenContent.head}</Text>
                <TouchableOpacity onPress={pickImage} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {route.params.user && route.params.user.photo_path ? (
                        image ? (
                            <Image source={{ uri: image }}
                                style={{ width: 150, height: 150, resizeMode: 'cover', borderRadius: 100, borderWidth: 4, borderColor: 'rgba(255, 115, 0, 1)' }} />
                        ) : (
                            <Image source={{ uri: 'https://adminandapi.fentecmobility.com/images/uploads/' + route.params.user.photo_path }}
                                style={{ width: 150, height: 150, resizeMode: 'cover', borderRadius: 100, borderWidth: 4, borderColor: 'rgba(255, 115, 0, 1)' }} />
                        )
                    ) : (
                        <Image source={image ? { uri: image } : require('./../assets/imgs/default_user.jpg')}
                            style={{ width: 150, height: 150, resizeMode: 'cover', borderRadius: 100, borderWidth: 4, borderColor: 'rgba(255, 115, 0, 1)' }} />
                    )}

                    <View style={{ width: 40, height: 40, backgroundColor: 'rgba(255, 115, 0, 1)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: -20 }}>
                        <Image source={image ? require('./../assets/imgs/icons/pen-to-square-solid.png') : require('./../assets/imgs/icons/plus-solid.png')}
                            style={{ width: 20, height: 20, resizeMode: 'cover' }} />
                    </View>
                </TouchableOpacity>
                <View style={{ gap: 15, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <TextInput
                        placeholder={screenContent.name}
                        onChangeText={setName}
                        value={name}
                        onFocus={() => handleNameFocus()}
                        onBlur={() => setNamefocused(false)}
                        style={[
                            styles.input,
                            namefocused && {
                                borderColor: 'rgba(255, 115, 0, 1)',
                                borderWidth: 2
                            },
                            currentLang == 'ar' && {
                                textAlign: 'right',
                            },
                        ]}

                    />
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={isShowDatePicker}
                    >

                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <DatePicker
                                    mode='calendar'
                                    // selected={date}
                                    onDateChange={handleDobChange}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'end', gap: 20, }}>
                                    <TouchableOpacity onPress={() => setIsShowDatePicker(false)} style={{ backgroundColor: '#c2c2c2', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5, width: 80, alignItems: 'center' }}>
                                        <Text>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setIsShowDatePicker(false)} style={{ backgroundColor: '#ff7300', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5, width: 80, alignItems: 'center', color: '#fff' }}>
                                        <Text style={{ color: '#fff' }}>Ok</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                    </Modal>

                    <TouchableOpacity onPress={() => setShowDobDatePicker(true)} style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[styles.input, { color: 'gray' }, currentLang == 'ar' && {
                            textAlign: 'right',
                        },
                        showDobDatePicker && {
                            borderColor: 'rgba(255, 115, 0, 1)',
                            borderWidth: 2
                        },
                        ]}>
                            {dob && ( dob ?  String(new Date(dob).getDate()).padStart(2, '0') + " " + new Date(dob).toLocaleDateString("en-US", { month: 'long' }) + ", " + String(new Date(dob).getFullYear()) : "----")} {!dob && (screenContent.dob)}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowChoices(true)} style={[styles.input, { justifyContent: 'center', alignItems: 'center' }]}>
                        {Identity ? (
                            <Image source={Identity ? { uri: Identity } : (route.params.user ? { uri: 'https://adminandapi.fentecmobility.com/images/uploads/' + route.params.user.identity_path } : require('./../assets/imgs/icons/cam-solid.png'))}
                                style={[{ width: 50, height: 50, resizeMode: 'contain', }, (Identity || route.params.user) && {
                                    borderColor: 'rgba(255, 115, 0, 1)',
                                    borderWidth: 1,
                                    borderRadius: 4
                                }]} />

                        ) :
                        (
                            <AntDesign name="idcard" size={45} color="black" />
                        )}
                        <Text style={styles.id_text}>{screenContent.id}</Text>
                        {showChoices && (
                            <View style={{flexDirection: "row", width: "100%", gap: 10, justifyContent: "center", alignItems: 'center', marginTop: 10}}>
                                <TouchableOpacity onPress={() => navigation.navigate("TakePhotoId", {token: route.params.token, name: name, dob: dob})} style={{padding: 8, borderRadius: 8, backgroundColor: "rgba(255,115,0,1)", width: '46%'}}>
                                    <Text style={{textAlign: 'center', color: "white"}}>
                                        {screenContent.open_cam}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={pickId} style={{padding: 8, borderRadius: 8, backgroundColor: "rgba(255,115,0,1)", width: '46%'}}>
                                    <Text style={{textAlign: 'center', color: "white"}}>
                                        {screenContent.open_gallery}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => sendLastStepData(route.params.token)} >
                        <Text style={styles.button_text}>{screenContent.start}</Text>
                    </TouchableOpacity>
                    <ConfirmDeleteModal />
                    {
                        !route.params.user && (                            
                            <TouchableOpacity onPress={() => setShowConfirmModal(true)}>
                                <Text style={{
                                    textAlign: 'left',
                                    color: '#ff0034'
                                }}>{screenContent.back_btn}</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    contianer: {
        padding: 1.25 * 16,
        paddingTop: 0,
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 1 * 16,
        alignItems: 'center',
        width: '100%',
        zIndex: 3,
        position: 'relative',
    },
    head: {
        fontSize: 30,
        fontFamily: 'Outfit_600SemiBold',
        color: '#000'
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
        width: "95%",
    },
    button: {
        padding: 18,
        borderRadius: 1.25 * 16,
        fontSize: 1.25 * 16,
        width: "95%",
        backgroundColor: "#ff7300",
        transition: "all .3s ease-in",
        marginBottom: 0,
    },
    id_text: {
        fontSize: 23,
        fontFamily: "Outfit_600SemiBold",
        marginTop: 10
    },
    button_text: {
        color: "#fff",
        fontFamily: 'Outfit_700Bold',
        fontSize: 28,
        textAlign: "center",
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 22,
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
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Outfit_600SemiBold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 20,
    },
    modalButton: {
        padding: 10,
        borderRadius: 10,
        width: 100,
        alignItems: 'center',
    },
    modalButtonYes: {
        backgroundColor: '#ff0034',
    },
    modalButtonNo: {
        backgroundColor: '#c2c2c2',
    },
    modalButtonText: {
        color: '#fff',
        fontFamily: 'Outfit_600SemiBold',
    },
});