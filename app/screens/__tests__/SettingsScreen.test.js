import React, { useContext } from 'react';
import { fireEvent, render, screen} from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import { Alert } from 'react-native';
import { SettingsScreen } from '../SettingsScreen';

const userInfo = {
    "username": "s.goodman",
    "first_name": "Saul",
    "last_name": "Goodman",
    "email": "saul.goodman@law.ed.ac.uk"
}

const navigation = { navigate: jest.fn() }; //mock navigation
const logout = jest.fn();

const renderScreen = () => {
    return render(
        <AuthContext.Provider value={{userInfo, logout}}>
            <SettingsScreen navigation={navigation}/>
            </AuthContext.Provider>
    )
}

it("All elements exist", async () => {
    renderScreen()
    screen.getByText("Profile")
    screen.getByText("Username:")
    screen.getByText(userInfo.username)
    screen.getByText("First Name:")
    screen.getByText(userInfo.first_name)
    screen.getByText("Last Name:")
    screen.getByText(userInfo.last_name)
    screen.getByText("Email:")
    screen.getByText(userInfo.email)

    screen.getByText("Account")
    screen.getByText("Change Password")

    screen.getByRole("button", {name:"logout"})
})

it("Navigate to change password", async () => {
    renderScreen()
    fireEvent.press(screen.getByText("Change Password"))
    expect(navigation.navigate).toHaveBeenCalledWith("Change Password")
})

it("Should call logout when logging out", async () => {
    renderScreen()
    fireEvent.press(screen.getByText("logout"))
    expect(logout).toHaveBeenCalled();
})