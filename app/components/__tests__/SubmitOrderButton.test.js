import React, { useContext } from 'react';
import { fireEvent, render, screen, act} from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import { Alert } from 'react-native';
import { SubmitOrderButton } from '../SubmitOrderButton';

const navigation = { navigate: jest.fn() }; //mock navigation
const fetchCartContent = jest.fn(); //mock fetching cats

const setCartDeliveryDate = jest.fn() //mock these authContext methods
const setCartDeliveryLocation = jest.fn()
const triggerOrderRefresh = jest.fn()


const loc = {
    delivery_longitude: 1.0,
    delivery_latitude: 2.0
}
const date = "2069-01-01"

afterEach(() => {
    jest.clearAllMocks();
  });

const renderButton = () => {
    return render(
        <AuthContext.Provider value={{cartDeliveryDate:date, cartDeliveryLocation:loc, fetchCartContent:fetchCartContent,
            setCartDeliveryDate:setCartDeliveryDate, setCartDeliveryLocation:setCartDeliveryLocation, triggerOrderRefresh:triggerOrderRefresh }}>
                <SubmitOrderButton navigation={navigation}>Submit</SubmitOrderButton>
        </AuthContext.Provider>
    )
}

const renderButtonInvalid = () => {
    return render(
        <AuthContext.Provider value={{cartDeliveryDate:"", cartDeliveryLocation:"", fetchCartContent:fetchCartContent,
            setCartDeliveryDate:setCartDeliveryDate, setCartDeliveryLocation:setCartDeliveryLocation, triggerOrderRefresh:triggerOrderRefresh }}>
                <SubmitOrderButton navigation={navigation}>Submit</SubmitOrderButton>
        </AuthContext.Provider>
    )
}

it("Submit should call a confirmation box", async() => {
    jest.spyOn(Alert, 'alert')
    renderButton()
    fireEvent.press(screen.getByText("Submit"))
    expect(Alert.alert).toHaveBeenCalled();
})

it("Submit should call a warning box on failure of not setting items", async() => {
    jest.spyOn(Alert, 'alert')
    renderButtonInvalid()
    fireEvent.press(screen.getByText("Submit"))
    Alert.alert.mock.calls[0][2][1].onPress()
    expect(Alert.alert).toHaveBeenCalledWith("Submit Order.", "A valid delivery date and location must be set before submitting an order.", [{"text": "OK"}]);
})


it("Submit should call place order after confirming", async() => {
    jest.spyOn(axiosInstance, "post");
    jest.spyOn(Alert, 'alert')

    renderButton()
    fireEvent.press(screen.getByText("Submit"))
    expect(Alert.alert).toHaveBeenCalled();
    Alert.alert.mock.calls[0][2][1].onPress()
    expect(axiosInstance.post).toHaveBeenCalledWith(
        "/checkout/submit",
        {
            delivery_date:date,
            delivery_longitude:loc.delivery_longitude,
            delivery_latitude:loc.delivery_latitude
        }
    );
})