import React, { useContext } from 'react';
import { fireEvent, render, screen} from '@testing-library/react-native'
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

    renderButton(69)
    fireEvent.press(screen.getByText("Add"))
    expect(axiosInstance.post).toHaveBeenCalledWith("/cart/item/69");
})