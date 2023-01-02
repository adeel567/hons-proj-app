import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {Vendors} from '../components/Vendors.js'

export const HomeScreen = ({navigation}) => {
    const {userInfo} = useContext(AuthContext);


    return(
        <SafeAreaView>
            <Vendors navigation={navigation}/>
        </SafeAreaView>
    )
}

