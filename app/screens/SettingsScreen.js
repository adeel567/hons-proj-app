import React, { useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider, Text, Avatar, Title, List, Button, IconButton } from 'react-native-paper';
import { View, StyleSheet, Platform} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export const SettingsScreen = () => {
    const navigation = useNavigation();
    const {userInfo, myIsLoggedIn, refreshCache, logout} = useContext(AuthContext);

    const go_changePass = () => {
        navigation.navigate("Change Password")

    }

    return (
        <View>
        <List.Section title={"Profile"} titleStyle={style.section_header}>
            <List.Item title="First Name:" description={userInfo.first_name}/>
            <List.Item title="Last Name:" description={userInfo.last_name}/>
            <List.Item title="Username:" description={userInfo.username}/>
            <List.Item title="Email:" description={userInfo.email}/>

        </List.Section>
        <List.Section title="Account" titleStyle={style.section_header}>
            <List.Item title="Change Password" onPress={go_changePass} right={(props) => <IconButton {...props} icon="chevron-right"/>}/>

        </List.Section>
            <Button icon={"logout"} style={{marginHorizontal:75}} color='red' onPress={logout}>logout</Button>
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