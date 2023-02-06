import React, {createContext, useEffect, useState, useContext} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button, Card, TextInput, Title} from 'react-native-paper';
import { ScrollView, View, StyleSheet, Alert} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import { PasswordField } from '../components/PasswordField';
import { NonEmptyTextField } from '../components/NonEmptyTextField';
import { axiosInstance } from '../api';


export const ResetPasswordScreen = () => {   
    const [isLoading, setIsLoading] = React.useState("");
    const [isLoading2, setIsLoading2] = React.useState("");

    const [email, setEmail] = React.useState("");
    const [token, setToken] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const reset_local = () => {
        if (email==0) {
            Alert.alert('Reset Password Error', "Email field can be left empty", [
                { text: 'OK'},
            ]);
            return
        }
        reset_password(email)
    }

    const confirm_reset_local = () => {
        if (password != confirmPassword) {
            Alert.alert('Reset Password Error', "Passwords do not match", [
                { text: 'OK'},
            ]);
            return
        } 
        if (password.length==0 || confirmPassword.length==0) {
            Alert.alert('Reset Password Error', "No password field can be left empty", [
                { text: 'OK'},
            ]);
            return
        }
        confirm_reset(token, password)
    }

    const reset_password = (email) => {
        setIsLoading(true);

        const params = {
            "email": email
        }

        axiosInstance.post("/auth/reset-password/", params)
        .then(() => {
            Alert.alert('Reset Password', "An email has been sent with a code for you to use to reset your password.", [
                { text: 'OK'},
            ]);
        })
        .catch((error) => {
            console.log(error)
            Alert.alert('"Reset Password Error"', err_text, [
                { text: 'OK'},
            ]);
        })
        .finally(() => {setIsLoading(false)})
      }


      const confirm_reset = (token, password) => {
        setIsLoading2(true);

        const params = {
            "password": password,
            "token": token
        }

        axiosInstance.post("/auth/reset-password/confirm/", params)
        .then(() => {
            Alert.alert('Reset Password', "Password was reset successfully", [
                { text: 'OK'},
            ]);
        })
        .catch((error) => {
            console.log(error.response.data)
            var err_text = "Issue when communicating with ILP API, please try again later."
            if (error?.response?.data?.detail) {
                err_text = "Code given was not recognised."
            }
            if (error?.response?.data?.password) {
                err_text = error.response.data.password[0];
            }
            Alert.alert('Reset Password Error', err_text, [
                { text: 'OK'},
            ]);
        })
        .finally(() => {setIsLoading2(false)})
      }

    
 
    return(
        <SafeAreaView>
            <ScrollView>
                <View style={style.content}>
                    <Title style={style.title}>Pop your email in below to reset your password!</Title>
                    <NonEmptyTextField label={"Email"} text={email} setText={setEmail}/>

                    <Button style={style.button} loading={isLoading} onPress={reset_local} mode="contained">Send Reset Code</Button>
                </View>
                <View style={style.content}>
                    <Title style={style.title}>Enter the code received in your email to set a new password.</Title>
                    <NonEmptyTextField label={"Code"} text={token} setText={setToken}/>
                    <PasswordField password={password} setPassword={setPassword}/>
                    <PasswordField label={"Confirm Password"} password={confirmPassword} setPassword={setConfirmPassword}/>
                    <Button style={style.button}loading={isLoading2}  onPress={confirm_reset_local} mode="contained">Confirm New Password</Button>

                </View>
            </ScrollView>
         </SafeAreaView>
    )
}

export const style = StyleSheet.create({
    content: {
        marginHorizontal:25,
        justifyContent:"space-evenly",
        marginBottom:25,
    },
    title: {
        marginBottom: 15
    }
})