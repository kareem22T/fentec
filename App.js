import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Outfit_600SemiBold, Outfit_500Medium, Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';


const Stack = createNativeStackNavigator();

// screens 
import WelcomeScreen from './screens/welcomeScreen'
import chooseLangScreen from './screens/chooseLangScreen';
import PreviewApp from './screens/previewScreen';
import RegisterScreen from './screens/registerScreen';
import VerifyScreen from './screens/verifyScreen';
import LoginScreen from './screens/loginScreen';
import EnterEmailScreen from './screens/enterEmailScreen';
import ForgotPasswordScreen from './screens/forgotPasswordScreen';
import LastStep from './screens/LastStepScreen';
import WhereKnow from './screens/whereYouKnow';
import YouWon from './screens/YouWon';
import Profile from './screens/profile';
import Trips from './screens/trips';
import Points from './screens/points';
import Notifications from './screens/notification';
import Map from './screens/map';
import Account from './screens/account';
import EditEmail from './screens/editEmailScreen';
import takePhoto from './screens/takePhotoScreen';
import TakePhotoId from './screens/takeIdPhoto';
import Sellers from './screens/sellers';
import HowToUseApp from './screens/HowToUseApp';

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HowToUseApp"
          component={HowToUseApp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="chooseLanguage"
          component={chooseLangScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Preview"
          component={PreviewApp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WhereKnow"
          component={WhereKnow}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="YouWon"
          component={YouWon}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EnterEmail"
          component={EnterEmailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="takePhoto"
          component={takePhoto}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Verify"
          component={VerifyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditEmail"
          component={EditEmail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Last"
          component={LastStep}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TakePhotoId"
          component={TakePhotoId}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Trips"
          component={Trips}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Points"
          component={Points}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Map"
          component={Map}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Sellers"
          component={Sellers}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});