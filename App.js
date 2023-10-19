import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
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
import LastStep from './screens/LastStepScreen';
import WhereKnow from './screens/whereYouKnow';
import YouWon from './screens/YouWon';
import Profile from './screens/profile';

// views
import Home from './views/home'


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
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
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
          name="Last"
          component={LastStep}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
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