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

const CameraComponent = ({navigation, route}) => {
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
        navigation.push("Last", {idPhoto: photo.uri, token: route.params.token, name: route.params.name, dob: route.params.dob})
      };
      
      if (hasPermission === null) {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <Text style={{ marginTop: 50, textAlign: 'center', color: "#ff7300", fontFamily: 'Outfit_500Medium', width: "100%", padding: 16, fontSize: 18 }}>No access to camera</Text>
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
                            }}>  Take Photo
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
                            }}>  Retake
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
                            }}>  Submit
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
                        }}>  Take Photo
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default CameraComponent;
