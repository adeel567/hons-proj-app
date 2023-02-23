import React, { useContext } from 'react';
import { fireEvent, render, screen, act} from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import { Alert } from 'react-native';
import { EmptyCartButton } from '../EmptyCartButton';

const navigation = { navigate: jest.fn() }; //mock navigation
const fetchCartContent = jest.fn(); //mock fetching cats
const setCartDeliveryDate = jest.fn() //mock these authContext methods
const setCartDeliveryLocation = jest.fn()



afterEach(() => {
    jest.clearAllMocks();
  });

const renderButton = () => {
    return render(
        <AuthContext.Provider value={{fetchCartContent:fetchCartContent, setCartDeliveryDate:setCartDeliveryDate, 
            setCartDeliveryLocation:setCartDeliveryLocation}}>
                <EmptyCartButton navigation={navigation}>Empty</EmptyCartButton>
        </AuthContext.Provider>
    )
}


it("Empty press should call a confirmation box", async() => {
    jest.spyOn(Alert, 'alert')
    renderButton()
    fireEvent.press(screen.getByText("Empty"))
    expect(Alert.alert).toHaveBeenCalled();
})


it("Empty should call empty endpoint after confirmation (left button)", async() => {
    jest.spyOn(axiosInstance, "delete");
    jest.spyOn(Alert, 'alert')
    axiosInstance.delete.mockResolvedValue({ status:200, data: {"res": "error"} });


    renderButton()
    fireEvent.press(screen.getByText("Empty"))
    expect(Alert.alert).toHaveBeenCalled();
    Alert.alert.mock.calls[0][2][0].onPress()
    expect(axiosInstance.delete).toHaveBeenCalledWith(
        "/cart",
    );
})