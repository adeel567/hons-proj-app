import React, {createContext, useEffect, useState, useContext} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button, Card, TextInput, Title} from 'react-native-paper';
import { ScrollView, View, StyleSheet, Alert} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import { PasswordField } from '../components/PasswordField';
import { NonEmptyTextField } from '../components/NonEmptyTextField';

/**
 * Screen for registering a new user.
 * Uses the authcontext to do the registraiton and automatically logging in the new user.
 */
export const RegisterScreen = () => {   
    const {isLoading, register} = useContext(AuthContext);

    const [username, setUsername] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const register_local = () => {
        if (password != confirmPassword) {
            Alert.alert('An error occurred :(', "Passwords do not match", [
                { text: 'OK'},
            ]);
            return
        } 
        if (password.length==0 || username.length==0 || firstName.length==0 || lastName.length==0 || confirmPassword.length==0 || email.length==0) {
            Alert.alert('An error occurred :(', "No field can be left empty", [
                { text: 'OK'},
            ]);
            return
        }
        register(firstName,lastName,username,email,password)

    }
 
    return(
        <SafeAreaView>
            <ScrollView>
                <View style={style.content}>
                    <Title style={style.title}>Pop your details in below to sign up!</Title>
                    <NonEmptyTextField label={"First Name"} text={firstName} setText={setFirstName}/>
                    <NonEmptyTextField label={"Last Name"} text={lastName} setText={setLastName}/>
                    <NonEmptyTextField label={"Username"} text={username} setText={setUsername}/>
                    <NonEmptyTextField label={"Email"} text={email} setText={setEmail}/>
                    <PasswordField password={password} setPassword={setPassword}/>
                    <PasswordField label={"Confirm Password"} password={confirmPassword} setPassword={setConfirmPassword}/>
                    <Button style={style.button} loading={isLoading} onPress={register_local} mode="contained"> Register</Button>
                </View>
            </ScrollView>
         </SafeAreaView>
    )
}

export const style = StyleSheet.create({
    content: {
        marginHorizontal:25,
        justifyContent:"space-evenly",
    },
    title: {
        marginBottom: 15
    }
})