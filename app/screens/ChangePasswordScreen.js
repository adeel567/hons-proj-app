import React, {createContext, useEffect, useState, useContext} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button, Card, TextInput, Title} from 'react-native-paper';
import { ScrollView, View, StyleSheet, Alert} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import { PasswordField } from '../components/PasswordField';
import { NonEmptyTextField } from '../components/NonEmptyTextField';
import { useNavigation } from '@react-navigation/native';
import { axiosInstance } from '../api';


export const ChangePasswordScreen = () => {   
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = React.useState(false)
    const [oldPassword, setOldPassword] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const doGoBack = () => {
        navigation.goBack()
    }

    const change_local = () => {
        if (password.length==0 || oldPassword.length==0 || confirmPassword.length==0) {
            Alert.alert('Change Password.', "No field can be left empty.", [
                { text: 'OK'},
            ]);
            return
        }
        if (password != confirmPassword) {
            Alert.alert('Change Password.', "Passwords do not match.", [
                { text: 'OK'},
            ]);
            return
        } 
        if (oldPassword == password) {
            Alert.alert('Change Password.', "Old and new password must not be the same.", [
                { text: 'OK'},
            ]);
            return
        }
        changePassword(oldPassword,password)
    }



    const changePassword = (oldPassword, newPassword) => {
        setIsLoading(true);
        const data = {
            "old_password" : oldPassword,
            "new_password": newPassword
        }
        axiosInstance.post("/auth/change-password", data)
        .then(() => {
          Alert.alert('Change Password.', "Password change was successful", [
            { text: 'OK', onPress:doGoBack},
        ]);
        })
        .catch((error) => {
            console.log(error.response.data)
            var err_text = "Issue when communicating with ILP API, please try again later."
            if (error?.response?.data?.res) {
              err_text = error.response.data.res;
            }
            if (error?.response?.data?.new_password) {
                err_text = error.response.data.new_password[0];
            }
            if (error?.response?.data?.old_password) {
                err_text = error.response.data.old_password[0];
            }
        Alert.alert('Change Password.', err_text, [
              { text: 'OK'},
          ]);
        })
        .finally(() => {setIsLoading(false)})
    }
 
    return(
        <SafeAreaView>
            <ScrollView>
                <View style={style.content}>
                    {/* <Title style={style.title}>Change your password.</Title> */}
                    <PasswordField label={"Old Password"} password={oldPassword} setPassword={setOldPassword}/>
                    <PasswordField password={password} setPassword={setPassword}/>
                    <PasswordField label={"Confirm Password"} password={confirmPassword} setPassword={setConfirmPassword}/>
                    <Button loading={isLoading} style={style.button} onPress={change_local} mode="contained">Submit Change Password</Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export const style = StyleSheet.create({
    content: {
        marginHorizontal:25,
        marginVertical:25,
        justifyContent:"space-evenly",
    },
    title: {
        marginBottom: 15
    }
})