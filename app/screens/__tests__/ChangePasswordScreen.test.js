import React, { useContext } from 'react';
import { fireEvent, render, screen} from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import { Alert } from 'react-native';
import { ChangePasswordScreen } from '../ChangePasswordScreen';

/**
 * Tests the password reset screen by mocking the API calls and user interactions.
 */

const navigation = { navigate: jest.fn() }; //mock navigation
const logout = jest.fn();

const renderScreen = () => {
    return render(
        <ChangePasswordScreen navigation={navigation}/>
    )
}

it("All elements exist", async () => {
    renderScreen()
    screen.getAllByText("Old Password")
    screen.getAllByText("Password")
    screen.getAllByText("Confirm Password")
    screen.getByText("Submit Change Password")
})

it("Trying to submit empty fields should fail", async () => {
    renderScreen()
    fireEvent.press(screen.getByText("Submit Change Password"))
    screen.getAllByText("Password cannot be empty!")
})

it("Old and new password must be different", async () => {
    jest.spyOn(Alert, 'alert')
    renderScreen()
    fireEvent.changeText(screen.getAllByText("Old Password")[0],"password")
    fireEvent.changeText(screen.getAllByText("Password")[0],"password")
    fireEvent.changeText(screen.getAllByText("Confirm Password")[0],"password")
    fireEvent.press(screen.getByText("Submit Change Password"))
    expect(Alert.alert).toHaveBeenCalledWith("Change Password.", "Old and new password must not be the same.", [{"text": "OK"}])
})

it("Passwords must match", async () => {
    jest.spyOn(Alert, 'alert')
    renderScreen()
    fireEvent.changeText(screen.getAllByText("Old Password")[0],"password")
    fireEvent.changeText(screen.getAllByText("Password")[0],"password123")
    fireEvent.changeText(screen.getAllByText("Confirm Password")[0],"password1234")
    fireEvent.press(screen.getByText("Submit Change Password"))
    expect(Alert.alert).toHaveBeenCalledWith("Change Password.", "Passwords do not match.", [{"text": "OK"}])
})

it("API call should be made if fields are correct.", async () => {
    jest.spyOn(Alert, 'alert')
    jest.spyOn(axiosInstance, "post");
    axiosInstance.post.mockResolvedValue({ status:200, data: {"res": "Password change was successful."} }); //mock success

    const data = {
        "old_password": "Password123!",
        "new_password": "Password1234!"
    }
    renderScreen()
    fireEvent.changeText(screen.getAllByText("Old Password")[0],data.old_password)
    fireEvent.changeText(screen.getAllByText("Password")[0],data.new_password)
    fireEvent.changeText(screen.getAllByText("Confirm Password")[0],data.new_password)
    fireEvent.press(screen.getByText("Submit Change Password"))
    expect(axiosInstance.post).toHaveBeenCalledWith(
        "/auth/change-password",
        data
    );
})

