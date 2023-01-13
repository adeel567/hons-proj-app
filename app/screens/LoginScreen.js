import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, TextInput, Title } from 'react-native-paper';
import { View, StyleSheet, Alert} from 'react-native';
import { axiosInstance } from '../api';
import {setAuthTokens} from 'react-native-axios-jwt';
import {NonEmptyTextField} from '../components/NonEmptyTextField'
import {PasswordField} from '../components/PasswordField'
import {AuthContext} from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';



export const LoginScreen = (props) => {

    const register = () => props.navigation.navigate("Register")

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const {isLoading, login} = useContext(AuthContext);

    const login_local = () => {
        if (username.length == 0 || password.length == 0) {
            Alert.alert('User input error.', "username and password cannot be empty", [
                { text: 'OK'},
            ]);
        } else {
        login(username,password)
        }
    };

    const on_forgot = () => {
        Alert.alert('Forgot login.', "Please email app@adeel.uk to reset your login details.")
    }


    return (
            <View style={style.supercontainer}>
                <Spinner visible={isLoading}/>
                <View
                    style={style.container}
                >
                    <Title style={style.title}>Welcome back, please login.</Title>
                    <NonEmptyTextField label={"Username"} text={username} setText={setUsername}/>
                    <PasswordField password={password} setPassword={setPassword}/>
                    <View style={style.buttons}>
                        <Button
                            onPress={login_local}
                            mode="contained">
                            Login
                        </Button>
                        <Button
                            onPress={register}>
                            New here? Register
                        </Button>
                        <View style={style.forgot}>
                            <Button mode="text" compact="true" onPress={on_forgot} >
                                Forgot?
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
    )
}
export const style = StyleSheet.create({
    container: {
        marginHorizontal:25, flexDirection: 'column', justifyContent:'space-evenly'
    },
    supercontainer: {
        flex:1,
        justifyContent: 'center',
    },
    forgot: {
        alignItems:'flex-start',
    }
})