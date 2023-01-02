import React, { useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider, Text, Avatar, Title, List, Button } from 'react-native-paper';
import { View, StyleSheet, Platform} from 'react-native';
import {AuthContext} from '../context/AuthContext';

export const SettingsScreen = () => {
    const {userInfo, logout, myIsLoggedIn, refreshCache} = useContext(AuthContext);


    return (
        <View>
        <List.Section title={"Profile"} titleStyle={style.section_header}>
            <List.Item title="First Name:" description={userInfo.first_name}/>
            <List.Item title="Last Name:" description={userInfo.last_name}/>
            <List.Item title="Username:" description={userInfo.username}/>
            <List.Item title="Email:" description={userInfo.email}/>

        </List.Section>
        {/* <Button onPress={refreshX}>Test</Button> */}
        {/* <List.Section title={"Account"} titleStyle={style.section_header}> */}
            <Button icon={"logout"} style={{marginHorizontal:75}} color='red' onPress={logout}>logout</Button>
        {/* </List.Section> */}

        </View>
    )
}

export const style = StyleSheet.create({
    container: {
        flex:1, flexDirection: 'column', justifyContent:'space-evenly',
    },
    section_header: {
        fontSize:25,
    }
})