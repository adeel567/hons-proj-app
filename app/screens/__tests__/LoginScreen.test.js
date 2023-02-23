import React, { useContext } from 'react';
import fetchMock from 'fetch-mock';
import { fireEvent, render, screen} from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import {Provider as PaperProvider, TextInput} from 'react-native-paper'
import { Alert } from 'react-native';
import { LoginScreen } from '../LoginScreen';


const renderScreen = () => {
    return render(
        <AuthProvider>
            <LoginScreen/>
        </AuthProvider>
    )
}

it("All elements exist", async () => {
    renderScreen()
    screen.getByText("Welcome back, please login.")
    screen.getAllByText("Username")
    screen.getAllByText("Password")
    screen.getAllByText("Login")
    screen.getAllByText("New here? Register")
    screen.getAllByText("Forgot?")
});

it("Cannot login with blank fields", async () => {
    jest.spyOn(Alert, 'alert')
    renderScreen()
    fireEvent.press(screen.getByText("Login"))
    expect(Alert.alert).toHaveBeenCalledWith("Login Error", "username and password cannot be empty", [{"text": "OK"}])
})

it("Blank fields should show a warning", async () => {
    jest.spyOn(Alert, 'alert')
    renderScreen()
    fireEvent.changeText(screen.getAllByText("Username")[0],"my_username")
    fireEvent.changeText(screen.getAllByText("Username")[0],"")
    screen.getByText("Username cannot be empty!")

    fireEvent.changeText(screen.getAllByText("Password")[0],"my_password")
    fireEvent.changeText(screen.getAllByText("Password")[0],"")
    screen.getByText("Password cannot be empty!")
})

it("Logging in with non-blank details should call the login context function", async () => {
    const login = jest.fn();
    const isLoading = false;
    render(
        <AuthContext.Provider value={{isLoading, login}}>
            <LoginScreen/>
        </AuthContext.Provider>
    )
    fireEvent.changeText(screen.getAllByText("Username")[0], "my_username")
    fireEvent.changeText(screen.getAllByText("Password")[0], "my_password")
    fireEvent.press(screen.getByText("Login"))

    expect(login).toHaveBeenCalledWith("my_username", "my_password")

})

it("Navigate to register screen", async () => {
    const navigation = { navigate: jest.fn() }; //mock navigation
    render(
        <AuthProvider>
            <LoginScreen navigation={navigation}/>
        </AuthProvider>
    )
    fireEvent.press(screen.getByText("New here? Register"))
    expect(navigation.navigate).toHaveBeenCalledWith("Register")
})

it("Navigate to reset password screen", async () => {
    const navigation = { navigate: jest.fn() }; //mock navigation
    render(
        <AuthProvider>
            <LoginScreen navigation={navigation}/>
        </AuthProvider>
    )
    fireEvent.press(screen.getByText("Forgot?"))
    expect(navigation.navigate).toHaveBeenCalledWith("Reset Password")
})