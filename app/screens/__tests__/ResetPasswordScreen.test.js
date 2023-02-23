import React, { useContext } from 'react';
import { fireEvent, render, screen} from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import { Alert } from 'react-native';
import {ResetPasswordScreen} from '../ResetPasswordScreen'

/**
 * Tests the reset password screen
 * Does so by testing if each endpoint is called correctly, and handling bad user-entered data.
 */

const navigation = { navigate: jest.fn() }; //mock navigation
const logout = jest.fn();

const renderScreen = () => {
    return render(
        <ResetPasswordScreen navigation={navigation}/>
    )
}

it("All elements exist", async() => {
    renderScreen()
    screen.getAllByText("Email")
    screen.getByText("Send Reset Code")
    screen.getAllByText("Code")
    screen.getAllByText("Password")
    screen.getAllByText("Confirm Password")
    screen.getByText("Confirm New Password")
})

it("Trying to submit empty email should fail.", async () => {
    jest.spyOn(Alert, 'alert')
    renderScreen()
    fireEvent.press(screen.getByText("Send Reset Code"))
    expect(Alert.alert).toHaveBeenCalledWith("Reset Password Error", "Email given is invalid or empty", [{"text": "OK"}])
})

it("Trying to submit code with empty password should fail.", async () => {
    jest.spyOn(Alert, 'alert')
    renderScreen()
    fireEvent.changeText(screen.getAllByText("Code")[0],"my_code")
    fireEvent.press(screen.getByText("Confirm New Password"))
    expect(Alert.alert).toHaveBeenCalledWith("Reset Password Error", "Code and/or password fields cannot be left empty", [{"text": "OK"}])
    })

it("Trying to submit passwords with empty code should fail.", async () => {
    jest.spyOn(Alert, 'alert')
    renderScreen()
    fireEvent.changeText(screen.getAllByText("Password")[0],"new_password")
    fireEvent.changeText(screen.getAllByText("Confirm Password")[0],"new_password")
    fireEvent.press(screen.getByText("Confirm New Password"))
    expect(Alert.alert).toHaveBeenCalledWith("Reset Password Error", "Code and/or password fields cannot be left empty", [{"text": "OK"}])
    })

it("Trying to submit with mismatched passwords should fail.", async () => {
    jest.spyOn(Alert, 'alert')
    renderScreen()
    fireEvent.changeText(screen.getAllByText("Password")[0],"new_password")
    fireEvent.changeText(screen.getAllByText("Confirm Password")[0],"new_password1")
    fireEvent.press(screen.getByText("Confirm New Password"))
    expect(Alert.alert).toHaveBeenCalledWith("Reset Password Error", "Passwords do not match", [{"text": "OK"}])
    })

it("Entering an incorrectly formatted email should be prevented.", async () => {
    jest.spyOn(Alert, 'alert')
    renderScreen()
    fireEvent.changeText(screen.getAllByText("Email")[0],"mail.adeel.uk")
    fireEvent.press(screen.getByText("Send Reset Code"))
    expect(Alert.alert).toHaveBeenCalledWith("Reset Password Error", "Email given is invalid or empty", [{"text": "OK"}])
})

it("Entering a well-formatted email should call the endpoint.", async () => {
    jest.spyOn(axiosInstance, "post");
    axiosInstance.post.mockResolvedValue({ status:200, data: {"res": "great success."} });
    const data = {
        "email": "mail@adeel.uk",
    }
    renderScreen()
    fireEvent.changeText(screen.getAllByText("Email")[0],data.email)
    fireEvent.press(screen.getByText("Send Reset Code"))
    expect(axiosInstance.post).toHaveBeenCalledWith(
        "/auth/reset-password/",
        data
    );
})

it("Entering a well-formatted code and password should call the endpoint.", async () => {
    jest.spyOn(axiosInstance, "post");
    axiosInstance.post.mockResolvedValue({ status:200, data: {"res": "great success."} });
    const data = {
        "token": "my_token",
        "password": "my_password"
    }
    renderScreen()
    fireEvent.changeText(screen.getAllByText("Password")[0],data.password)
    fireEvent.changeText(screen.getAllByText("Confirm Password")[0],data.password)
    fireEvent.changeText(screen.getAllByText("Code")[0],data.token)

    fireEvent.press(screen.getByText("Confirm New Password"))
    expect(axiosInstance.post).toHaveBeenCalledWith(
        "/auth/reset-password/confirm/",
        data
    );
})