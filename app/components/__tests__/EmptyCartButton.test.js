import React, { useContext } from 'react';
import { fireEvent, render, screen, waitFor} from '@testing-library/react-native'
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
    jest.spyOn(axiosInstance, "delete");
    renderButton()
    fireEvent.press(screen.getByText("Empty"))
    expect(Alert.alert).toHaveBeenCalled();
    expect(axiosInstance.delete).not.toHaveBeenCalled()
})

it("Empty should call empty endpoint after confirmation (left button)", async() => {
    jest.spyOn(axiosInstance, "delete");
    jest.spyOn(Alert, 'alert')
    axiosInstance.delete.mockResolvedValue({ status:200, data: {"res": "error"} });

    await waitFor(() => {
        renderButton()
        fireEvent.press(screen.getByText("Empty"))
        expect(Alert.alert).toHaveBeenCalled();
        Alert.alert.mock.calls[0][2][0].onPress()
        expect(axiosInstance.delete).toHaveBeenCalledWith(
            "/cart",
        );
    })

})

it("Empty cart should show success message", async() => {
    jest.spyOn(axiosInstance, "delete");
    axiosInstance.delete.mockResolvedValue({ status:200, data: {res:"success"}});
    jest.spyOn(Alert, 'alert')
    await waitFor(() => {
        renderButton()
        fireEvent.press(screen.getByText("Empty"))
        Alert.alert.mock.calls[0][2][0].onPress()
        expect(axiosInstance.delete).toHaveBeenCalledWith("/cart");
        expect(Alert.alert).toHaveBeenCalledWith("Empty Cart", "success", expect.anything())    
    })
})

it("Empty cart should show failure message", async() => {
    jest.spyOn(axiosInstance, "delete");
    axiosInstance.delete.mockRejectedValue({response:{ status:400, data: {"res": "error message"} }});
    jest.spyOn(Alert, 'alert')
    await waitFor(() => {
        renderButton()
        fireEvent.press(screen.getByText("Empty"))
        Alert.alert.mock.calls[0][2][0].onPress()
        expect(axiosInstance.delete).toHaveBeenCalledWith("/cart");
        expect(Alert.alert).toHaveBeenCalledWith("Empty Cart", "error message", expect.anything())    
    })
})

it("Empty cart should show generic failure message on API issues", async() => {
    jest.spyOn(axiosInstance, "delete");
    axiosInstance.delete.mockRejectedValue({response:{ status:400, data: {} }});
    jest.spyOn(Alert, 'alert')
    await waitFor(() => {
        renderButton()
        fireEvent.press(screen.getByText("Empty"))
        Alert.alert.mock.calls[0][2][0].onPress()
        expect(axiosInstance.delete).toHaveBeenCalledWith("/cart");
        expect(Alert.alert).toHaveBeenCalledWith("Empty Cart", "Issue when communicating with ILP API, please try again later.", expect.anything())    
    })
})