import React, { useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider, Text, Avatar, Title, List, Button } from 'react-native-paper';
import { View, StyleSheet, Platform} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {
    SettingsDividerShort,
    SettingsDividerLong,
    SettingsEditText,
    SettingsCategoryHeader,
    SettingsSwitch,
    SettingsPicker
  } from "react-native-settings-components";

export const SettingsScreen = () => {
    const {userInfo, logout, myIsLoggedIn, refreshCache} = useContext(AuthContext);
    // console.log(userInfo)

    // const refreshX = () => {
    //     ref()
    // }

    return (
        <SafeAreaView>
        <List.Section title={"Profile"} titleStyle={style.section_header}>
            <List.Item title="First Name:" description={userInfo.first_name}/>
            <List.Item title="Last Name:" description={userInfo.last_name}/>
            <List.Item title="Username:" description={userInfo.username}/>
            <List.Item title="Email:" description={userInfo.email}/>

        </List.Section>
        {/* <Button onPress={refreshX}>Test</Button> */}
        <Button onPress={logout}>logout</Button>

        </SafeAreaView>
    )
    



}

export const style = StyleSheet.create({
    container: {
        flex:1,padding:25, flexDirection: 'column', justifyContent:'space-evenly',
    },
    section_header: {
        fontSize:25
    }
})