import React, { useContext } from 'react';
import { fireEvent, render, screen} from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import { Alert } from 'react-native';
import { CartScreen } from '../CartScreen';
import {Provider as PaperProvider} from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

// Create a mock implementation of useNavigation()
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

const emptyCart = {
    "items":[]
}

const oneItemCart = {
    "items": [
      {
        "id": 69,
        "name": "Diet coke 500ml",
        "description": "No description provided.",
        "pence": 165,
        "restaurant_id": 2,
        "restaurant_name": "Greggs"
      }
    ],
    "subtotal_pence": 165,
    "delivery_cost_pence": 50,
    "total_pence": 215
  }

const navigation = { navigate: jest.fn() }; //mock navigation
const fetchCartContent = jest.fn();

const renderScreen = (cart) => {
    return render(
        <AuthContext.Provider value={{cartContent:cart, fetchCartContent, }}>
            <PaperProvider>
                <CartScreen navigation={navigation}/>
            </PaperProvider>
        </AuthContext.Provider>
    )
}

it("Call should be made to fetch cart and display the elements.", async () => {
    renderScreen(emptyCart)
    expect(fetchCartContent).toHaveBeenCalled();
    screen.getByText("No cart items found.")
    screen.getByText("Time to do some shopping :D")
})

it("Cart with item renders all its components.", async() => {
    renderScreen(oneItemCart)
    screen.getByText(oneItemCart.items[0].name)
    screen.getByText("Cart Summary")
    screen.getByText("Delivery Location")
    screen.getByText("Delivery Date")
    screen.getByText("Submit Order") //button is tested in its own component.
    screen.getByText("Empty Cart") //button is tested in its own component.
})

it("No footer info when the cart is empty", async() => {
    renderScreen(emptyCart)
    expect(screen.queryByText("Cart Summary")).toBeNull()
    expect(screen.queryByText("Delivery Location")).toBeNull()
    expect(screen.queryByText("Delivery Date")).toBeNull()
    expect(screen.queryByText("Submit Order")).toBeNull()
    expect(screen.queryByText("Empty Cart")).toBeNull()

})

it("Summary text should appear", async() => {
    renderScreen(oneItemCart)
    screen.getByText("Cart Summary")

    screen.getByText("Subtotal:")
    screen.getByText("Delivery Cost:")
    screen.getByText("Total:")

    screen.getAllByText("£1.65")
    screen.getByText("£0.50")
    screen.getByText("£2.15")
})

it("Click on delivery location", async() => {
    renderScreen(oneItemCart)
    fireEvent.press(screen.getByText("Delivery Location"))
    expect(navigation.navigate).toHaveBeenCalledWith("Choose Delivery Location")
})

it("Text should change when date picked", async() => {
    const date = "2069-01-02"
    render(
        <AuthContext.Provider value={{cartContent:oneItemCart, fetchCartContent, cartDeliveryDate:date}}>
            <PaperProvider>
                <CartScreen navigation={navigation}/>
            </PaperProvider>
        </AuthContext.Provider>
    )
    screen.getByText("Set to: "+date)

})

it("Text should change when location picked", async() => {
    const location = "NOT_NULL"
    render(
        <AuthContext.Provider value={{cartContent:oneItemCart, fetchCartContent, cartDeliveryLocation:location}}>
            <PaperProvider>
                <CartScreen navigation={navigation}/>
            </PaperProvider>
        </AuthContext.Provider>
    )
    screen.getByText("Valid delivery location set")

})

it("Choose date on calendar (android)", async() => {
    jest.spyOn(DateTimePickerAndroid,"open")
    renderScreen(oneItemCart)
    fireEvent.press(screen.getByText("Delivery Date"))
    expect(DateTimePickerAndroid.open).toHaveBeenCalled()
})
