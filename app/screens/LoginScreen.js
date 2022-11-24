import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, TextInput, Title } from 'react-native-paper';
import { View, StyleSheet, Alert} from 'react-native';
import { axiosInstance } from '../api';
import {setAuthTokens} from 'react-native-axios-jwt';
import {UsernameField} from '../components/UsernameField'
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


    return (
        // <SafeAreaView>
            <View style={style.supercontainer}>
                <Spinner visible={isLoading}/>
                <View
                    style={style.container}
                >
                    <Title style={style.title}>Welcome back, please login.</Title>
                    <UsernameField username={username} setUsername={setUsername}/>
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
                    </View>
                </View>
            </View>
        // </SafeAreaView>
    )
}
export const style = StyleSheet.create({
    container: {
        padding: 20, flexDirection: 'column', justifyContent:'space-evenly', height: 350
    },
    supercontainer: {
        flex:1,
        justifyContent: 'center'
    }
})