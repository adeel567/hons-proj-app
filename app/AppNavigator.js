import React, { useCallback, useContext, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, Text} from '@react-navigation/native';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { HomeScreen } from './screens/HomeScreen';
import { AuthContext } from './context/AuthContext';
import { View} from 'react-native';
import { Button, Card, TextInput, Title } from 'react-native-paper';



const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
    const {myIsLoggedIn, isLoading} = useContext(AuthContext);
    if (isLoading) {
        return (
            <View>
            <Title>AAAAAAA.</Title>
            <Title>AAAAAAA.</Title>
            <Title>AAAAAAA.</Title>
            <Title>AAAAAAA.</Title>
            </View>
        )
    }

    return(
        <NavigationContainer>
            {myIsLoggedIn ? <AppStack/> : <AuthStack/>}
        </NavigationContainer>
    )
}

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};