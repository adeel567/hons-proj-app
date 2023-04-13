import React, { useContext } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import { Alert } from 'react-native';
import { RemoveFromCartButton } from '../RemoveFromCartButton';

const navigation = { navigate: jest.fn() }; //mock navigation
const fetchCartContent = jest.fn();

const renderButton = (id) => {
    return render(
        <AuthContext.Provider value={{fetchCartContent}}>
                <RemoveFromCartButton navigation={navigation} id={id}>Remove</RemoveFromCartButton>
        </AuthContext.Provider>
    )
}

it("Removing from cart should call correct API URL", async() => {
    jest.spyOn(axiosInstance,"delete")
    jest.spyOn(Alert, 'alert')

    renderButton(69)
    fireEvent.press(screen.getByText("Remove"))
    expect(axiosInstance.delete).toHaveBeenCalledWith("/cart/item/69");
    screen.debug()
})

it("Removing from cart should show success message from API", async() => {
    jest.spyOn(axiosInstance, "delete");
    axiosInstance.delete.mockResolvedValue({ status:200, data: {res:"success"}});
    jest.spyOn(Alert, 'alert')
    await waitFor(() => {
        renderButton()
        fireEvent.press(screen.getByText("Remove"))
        // Alert.alert.mock.calls[0][2][0].onPress()
        expect(axiosInstance.delete).toHaveBeenCalledWith("/cart/item/69");
        expect(Alert.alert).toHaveBeenCalledWith("Remove From Cart", "success", expect.anything())    
    })
})

it("Empty cart should show failure message", async() => {
    jest.spyOn(axiosInstance, "delete");
    axiosInstance.delete.mockRejectedValue({response:{ status:400, data: {"res": "error message"} }});
    jest.spyOn(Alert, 'alert')
    await waitFor(() => {
        renderButton()
        fireEvent.press(screen.getByText("Remove"))
        // Alert.alert.mock.calls[0][2][0].onPress()
        expect(axiosInstance.delete).toHaveBeenCalledWith("/cart/item/69");
        expect(Alert.alert).toHaveBeenCalledWith("Remove From Cart", "error message", expect.anything())    
    })
})

it("Empty cart should show generic failure message on API issues", async() => {
    jest.spyOn(axiosInstance, "delete");
    axiosInstance.delete.mockRejectedValue({response:{ status:400, data: {} }});
    jest.spyOn(Alert, 'alert')
    await waitFor(() => {
        renderButton()
        fireEvent.press(screen.getByText("Remove"))
        expect(axiosInstance.delete).toHaveBeenCalledWith("/cart/item/69");
        expect(Alert.alert).toHaveBeenCalledWith("Remove From Cart", "Issue when communicating with ILP API, please try again later.", expect.anything())    
    })
})