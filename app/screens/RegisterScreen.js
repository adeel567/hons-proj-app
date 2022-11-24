import React, {createContext, useEffect, useState, useContext} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button, Card, TextInput, Title} from 'react-native-paper';
import { ScrollView, View, StyleSheet, Alert} from 'react-native';
import {AuthContext} from '../context/AuthContext';


export const RegisterScreen = () => {   
    const {isLoading, register} = useContext(AuthContext);

    const [username, setUsername] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");


    const register_local = () => {register()}
 
    return(
        <SafeAreaView>
            <ScrollView>
                {/* <Appbar>
                    <Appbar.BackAction/>
                    <Appbar.Content title="Register as a new user"/>
                </Appbar> */}
                <View style={style.content}>
                <TextInput  label="First name"/>
                <TextInput label="Last name"/>
                <TextInput label="Email address" keyboardType='email-address'/>
                <TextInput label="Password" secureTextEntry={true} right={<TextInput.Icon name="eye-off-outline"/>}/>
                <TextInput label="Confirm password" secureTextEntry={true} right={<TextInput.Icon name="eye-off-outline"/>}/>
                <Button style={style.button} onPress={register_local} mode="contained"> Register</Button>
                </View>
            </ScrollView>
         </SafeAreaView>
    )
}

export const style = StyleSheet.create({
        content: {
            padding: 25,
        },
        button: {
            marginTop:15,
        }
})