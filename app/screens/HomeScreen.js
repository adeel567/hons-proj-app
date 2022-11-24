import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, TextInput, Title } from 'react-native-paper';
import { View, StyleSheet, AsyncStorage} from 'react-native';
import { axiosInstance } from '../api';
import {AuthContext} from '../context/AuthContext';
import {setAuthTokens, isLoggedIn, getAccessToken, getRefreshToken, clearAuthTokens} from 'react-native-axios-jwt';


export const HomeScreen = () => {
    const {userInfo, logout, myIsLoggedIn} = useContext(AuthContext);

    const tests = () => {
        console.log(userInfo)
        getAccessToken().then((res) => {console.log(res)})
        getRefreshToken().then((res) => {console.log(res)})
        console.log(myIsLoggedIn)

    }

    return(
        <SafeAreaView>
            <Button onPress={logout}>DEATH</Button>
            <Button onPress={tests}>TEST</Button>
            <Title>Hello {userInfo.first_name}</Title>

        </SafeAreaView>
    )
}
