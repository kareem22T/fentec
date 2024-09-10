import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Linking, Platform, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import TimerMixin from 'react-timer-mixin';
import axios from 'axios';
import * as ImageManipulator from 'expo-image-manipulator';
import * as SecureStore from 'expo-secure-store';

const CameraComponent = ({navigation, route}) => {
    const translations = {
        "en": {
            "takeInstruction": "1-Please park the scooter in a secure place. ",
            "takeInstruction2": "2-Tie it to a post or tree.",
            "takeInstruction3": " 3-Take a clear photo of the scooter. ",
            "takePhoto": "Take Photo",
            "retake": "Retake",
            "submit": "Submit",
            "note": "Please note, if you do not follow the previous steps, your account will be suspended.",
        },
        "fr": {
            "takeInstruction": "1-Veuillez garer la trottinette dans un endroit sécurisé.",
            "takeInstruction2": "2-Attachez-le à un poteau ou à un arbre. ",
            "takeInstruction3": "3-Prenez une photo claire du trottinette.",
            "takePhoto": "Prendre une photo",
            "retake": "Reprendre",
            "submit": "Soumettre",
            "note": " Attention, si vous ne suivez pas les étapes précédentes, votre compte sera suspendu.",
        },
        "ar": {
            "takeInstruction": "الرجاء ركن المركبة في مكان آمن. ",
            "takeInstruction2": "ربطها بعمود أو شجرة.",
            "takeInstruction3": "أخذ صورة واضحة.",
            "takePhoto": "خذ صورة",
            "retake": "اعادة",
            "submit": "ارسال",
            "note": "حذاري في حالة عدم القيام بالخطوات السابقة سيتم إيقاف حسابك.",
        }
    }
    const [screenContent, setScreenContent] = useState(translations.ar);

    const getStoredLang = async () => {
        const storedLang = await SecureStore.getItemAsync('lang');
        if (storedLang)
            setScreenContent(translations[storedLang])
    }

    const [hasPermission, setHasPermission] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
    const [photo, setPhoto] = useState(null);
    const cameraRef = useRef(null);
    const requestPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status === 'granted') {
          setHasPermission(true);
        } else {
          // Permission was denied or permissions were never requested before
          // You can handle this case by showing a message to the user or retrying
          // the permission request after a delay, for example:
          setTimeout(() => {
            requestPermission();
          }, 1000); // Retry after 1 second
        }
      };
                
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        getStoredLang();
    }, []);
    const toggleFlash = () => {
        setFlashMode(
            flashMode === Camera.Constants.FlashMode.on
                ? Camera.Constants.FlashMode.off
                : Camera.Constants.FlashMode.on
        );
    };

    const toggleCamera = () => {
        setType(
            type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    };

    const openAppSettings = () => {
        if (Platform.OS === 'ios') {
          Linking.openURL('app-settings:');
        } else {
          Linking.openSettings();
        }
      };

      const takePhoto = async () => {
        if (cameraRef.current) {
          // Capture the photo with desired options (e.g., ratio, quality)
          let photo = await cameraRef.current.takePictureAsync({
            quality: 0.8, // Adjust quality for compression (0-1, lower = smaller size)
            aspect: [4, 3], // Optional: Set aspect ratio (e.g., 4:3 for portrait)
          });
      
          // Compress the captured photo using ImageManipulator
          const compressedPhoto = await ImageManipulator.manipulateAsync(
            photo.uri,
            [], // Optional: Add resize or other manipulation options here
            { compress: 0.4 } // Adjust compression level (0-1, lower = smaller size)
          );
      
          // Update the photo state with the compressed version
          setPhoto(compressedPhoto);
        }
      };
        const retakePhoto = () => {
        setPhoto(null);
    };

    const sendPhotoToBackend = async () => {
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append('photo', {
                name: 'photo.jpg', // Optional, if the server expects a specific filename
              uri: photo.uri,
              type: 'image/jpeg',
            });
            const response = await axios.post(`https://adminandapi.fentecmobility.com/submit-trip`, formData,
                {
                    headers: {
                        'AUTHORIZATION': `Bearer ${route.params.token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                },

            );

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
            TimerMixin.setTimeout(() => {
                setErrors([]);
            }, 2000);
        }
      };
      
      if (hasPermission === null) {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <Text style={{ marginTop: 50, textAlign: 'center', color: "#ff7300", fontFamily: 'Outfit_500Medium', width: "100%", padding: 16, fontSize: 18 }}>No access to camera</Text>
                <View style={{  gap: 0, justifyContent: 'center', alignItems: 'center', width: "100%"}}>
                    <Text style={{ textAlign: 'center', color: "black", fontFamily: "Outfit_600SemiBold", width: "100%", padding: 16, fontSize: 22 }}>
                        {screenContent.takeInstruction} {'\n'} {screenContent.takeInstruction2} {'\n'} {screenContent.takeInstruction3}
                    </Text>
                    <Text style={{ textAlign: 'center', color: "#ff7300", fontFamily: 'Outfit_500Medium', width: "100%", padding: 16, fontSize: 18 }}>
                        {screenContent.note}
                    </Text>
                </View>
                <View style={{  bottom: 10, left: 0, width: "100%", justifyContent: 'center', alignItems: "center"}}>
                        <TouchableOpacity onPress={openAppSettings} style={{
                            margin: 10, padding: 18,
                            borderRadius: 1.25 * 16,
                            fontSize: 1.25 * 16,
                            width: "100",
                            backgroundColor: "#ff7300",
                            transition: "all .3s ease-in",
                            flexDirection: "row",
                            justifyContent: 'center',
                            alignItems: 'center'

                        }}>
                            <AntDesign name="camerao" size={40} color="white" />
                            <Text style={{
                                fontSize: 18, color: "#fff",
                                fontFamily: 'Outfit_700Bold',
                                fontSize: 28,
                                textAlign: "center",
                            }}>  {screenContent.takePhoto}
                            </Text>
                        </TouchableOpacity>

                </View>
            </View>
        )
    }
    if (hasPermission === false) {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <Text style={{ marginTop: 50, textAlign: 'center', color: "#ff7300", fontFamily: 'Outfit_500Medium', width: "100%", padding: 16, fontSize: 18 }}>No access to camera</Text>
                <View style={{  gap: 0, justifyContent: 'center', alignItems: 'center', width: "100%"}}>
                    <Text style={{ textAlign: 'center', color: "black", fontFamily: "Outfit_600SemiBold", width: "100%", padding: 16, fontSize: 22 }}>
                        {screenContent.takeInstruction} {'\n'} {screenContent.takeInstruction2} {'\n'} {screenContent.takeInstruction3}
                    </Text>
                    <Text style={{ textAlign: 'center', color: "#ff7300", fontFamily: 'Outfit_500Medium', width: "100%", padding: 16, fontSize: 18 }}>
                        {screenContent.note}
                    </Text>
                </View>
                <View style={{  bottom: 10, left: 0, width: "100%", justifyContent: 'center', alignItems: "center"}}>
                        <TouchableOpacity onPress={requestPermission} style={{
                            margin: 10, padding: 18,
                            borderRadius: 1.25 * 16,
                            fontSize: 1.25 * 16,
                            width: "100",
                            backgroundColor: "#ff7300",
                            transition: "all .3s ease-in",
                            flexDirection: "row",
                            justifyContent: 'center',
                            alignItems: 'center'

                        }}>
                            <AntDesign name="camerao" size={40} color="white" />
                            <Text style={{
                                fontSize: 18, color: "#fff",
                                fontFamily: 'Outfit_700Bold',
                                fontSize: 28,
                                textAlign: "center",
                            }}>  Allow Permission
                            </Text>
                        </TouchableOpacity>

                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
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
            {photo ? (
                <View style={{ flex: 1 }}>
                    <Image source={{ uri: photo.uri }} style={{ flex: 1 }} />
                    <View style={{ position: 'absolute', padding: 20, bottom: 10, left: 0, width: "100%", flexDirection: 'row', justifyContent: 'center', alignItems: "center"}}>
                        <TouchableOpacity onPress={retakePhoto} style={{
                            margin: 10, padding: 18,
                            borderRadius: 1.25 * 16,
                            fontSize: 1.25 * 16,
                            width: "50%",
                            backgroundColor: "#ff7300",
                            transition: "all .3s ease-in",
                            flexDirection: "row",
                            justifyContent: 'center',
                            alignItems: 'center'

                        }}>
                            <MaterialCommunityIcons name="camera-retake-outline" size={30} color="white" />
                            <Text style={{
                                fontSize: 18, color: "#fff",
                                fontFamily: 'Outfit_700Bold',
                                fontSize: 22,
                                textAlign: "center",
                            }}>  {screenContent.retake}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={sendPhotoToBackend} style={{
                            margin: 10, padding: 18,
                            borderRadius: 1.25 * 16,
                            fontSize: 1.25 * 16,
                            width: "50%",
                            backgroundColor: "#ff7300",
                            transition: "all .3s ease-in",
                            flexDirection: "row",
                            justifyContent: 'center',
                            alignItems: 'center'

                        }}>
                            <FontAwesome5 name="check-circle" size={30} color="white" />
                            <Text style={{
                                fontSize: 18, color: "#fff",
                                fontFamily: 'Outfit_700Bold',
                                fontSize: 22,
                                textAlign: "center",
                            }}>  {screenContent.submit}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <Camera
                    style={{ flex: 1, resizMode: "contain" }}
                    type={type}
                    flashMode={flashMode}
                    ref={cameraRef}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 50,
                                right: 30
                            }}
                            onPress={toggleFlash}
                        >
                            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                                <FontAwesome name="flash" size={60} color="white" />
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 50,
                                left: 30
                            }}
                            onPress={toggleCamera}
                        >
                            <Text>
                                <MaterialCommunityIcons name="camera-flip-outline" size={60} color="white" />
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
            )}
            <View style={{ position: 'absolute', top: 200, left: 0, gap: 0, justifyContent: 'center', alignItems: 'center', width: "100%"}}>
                <Text style={{ textAlign: 'center', color: "white", fontFamily: "Outfit_600SemiBold", width: "100%", padding: 16, fontSize: 22 }}>
                    {screenContent.takeInstruction} {'\n'} {screenContent.takeInstruction2} {'\n'} {screenContent.takeInstruction3}
                </Text>
                <Text style={{ textAlign: 'center', color: "#ff7300", fontFamily: 'Outfit_500Medium', width: "100%", padding: 16, fontSize: 18 }}>
                    {screenContent.note}
                </Text>
            </View>
            {!photo && (
                <View style={{ position: 'absolute', bottom: 10, left: 0, width: "100%", justifyContent: 'center', alignItems: "center"}}>
                    <TouchableOpacity onPress={takePhoto} style={{
                        margin: 10, padding: 18,
                        borderRadius: 1.25 * 16,
                        fontSize: 1.25 * 16,
                        width: "100",
                        backgroundColor: "#ff7300",
                        transition: "all .3s ease-in",
                        flexDirection: "row",
                        justifyContent: 'center',
                        alignItems: 'center'

                    }}>
                        <AntDesign name="camerao" size={40} color="white" />
                        <Text style={{
                            fontSize: 18, color: "#fff",
                            fontFamily: 'Outfit_700Bold',
                            fontSize: 28,
                            textAlign: "center",
                        }}>  {screenContent.takePhoto}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default CameraComponent;
