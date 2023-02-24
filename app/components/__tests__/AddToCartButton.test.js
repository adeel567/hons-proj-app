import React, { useContext } from 'react';
import { fireEvent, render, screen, waitFor} from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import { Alert } from 'react-native';
import { AddToCartButton } from '../AddToCartButton';

const navigation = { navigate: jest.fn() }; //mock navigation
const fetchCartContent = jest.fn();

const renderButton = (id) => {
    return render(
        <AuthContext.Provider value={{fetchCartContent}}>
                <AddToCartButton navigation={navigation} id={id}>Add</AddToCartButton>
        </AuthContext.Provider>
    )
}

it("Add to cart should call correct URL", async() => {
    jest.spyOn(axiosInstance,"post")
    jest.spyOn(Alert, 'alert')

    await waitFor(() => {
        renderButton(69)
        fireEvent.press(screen.getByText("Add"))
        expect(axiosInstance.post).toHaveBeenCalledWith("/cart/item/69");    
    })
})

it("Add to cart should show success message", async() => {
    jest.spyOn(axiosInstance,"post")
    axiosInstance.post.mockResolvedValue({ status:200, data: {res:"success"}});
    jest.spyOn(Alert, 'alert')
    await waitFor(() => {
        renderButton(69)
        fireEvent.press(screen.getByText("Add"))
        expect(axiosInstance.post).toHaveBeenCalledWith("/cart/item/69");
        expect(Alert.alert).toHaveBeenCalledWith("Add to cart", "success", expect.anything())    
    })
})

it("Add to cart should show failure message on failure", async() => {
    jest.spyOn(axiosInstance,"post")
    axiosInstance.post.mockRejectedValue({response:{ status:400, data: {"res": "error message"} }});
    jest.spyOn(Alert, 'alert')
    await waitFor(() => {
        renderButton(69)
        fireEvent.press(screen.getByText("Add"))
        expect(axiosInstance.post).toHaveBeenCalledWith("/cart/item/69");
        expect(Alert.alert).toHaveBeenCalledWith("Add to cart", "error message", expect.anything())    
    })
})

it("Add to cart should show generic failure message if API fails", async() => {
    jest.spyOn(axiosInstance,"post")
    axiosInstance.post.mockRejectedValue({response:{ status:400, data: {} }});
    jest.spyOn(Alert, 'alert')
    await waitFor(() => {
        renderButton(69)
        fireEvent.press(screen.getByText("Add"))
        expect(axiosInstance.post).toHaveBeenCalledWith("/cart/item/69");
        expect(Alert.alert).toHaveBeenCalledWith("Add to cart", "Issue when communicating with ILP API, please try again later.", expect.anything())    
    })
})