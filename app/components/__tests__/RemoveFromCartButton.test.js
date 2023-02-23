import React, { useContext } from 'react';
import { fireEvent, render, screen} from '@testing-library/react-native'
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

it("Add to cart should call correct URL", async() => {
    jest.spyOn(axiosInstance,"delete")
    jest.spyOn(Alert, 'alert')

    renderButton(69)
    fireEvent.press(screen.getByText("Remove"))
    expect(axiosInstance.delete).toHaveBeenCalledWith("/cart/item/69");
    screen.debug()
})