import React, { useContext } from 'react';
import { fireEvent, render, screen, waitFor} from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import { Alert } from 'react-native';
import { OrderCard } from '../OrderCard';
import {Provider as PaperProvider} from 'react-native-paper'


const order = 
    {
      "id": 17,
      "delivery_date": "2023-01-02",
      "delivery_longitude": -3.1888,
      "delivery_latitude": 55.9437,
      "delivery_pence": 50,
      "subtotal_pence": 330,
      "total_pence": 380,
      "owner": 19,
      "status": "PICKUP",
      "items": [
        {
          "id": 69,
          "name": "Diet coke 500ml",
          "description": "No description provided.",
          "pence": 165,
          "restaurant_id": 2,
          "restaurant_name": "Greggs"
        },
        {
          "id": 420,
          "name": "Diet coke 500ml",
          "description": "No description provided.",
          "pence": 165,
          "restaurant_id": 2,
          "restaurant_name": "Greggs"
        }
      ],
      "pickups": [
        {
          "id": 2,
          "name": "Greggs",
          "description": "No description provided.",
          "longitude": -3.191257,
          "latitude": 55.945626,
          "image": "/media/images/restaurants/default.png"
        },
        {
            "id": 3,
            "name": "Tesco",
            "description": "No description provided.",
            "longitude": -3.191257,
            "latitude": 55.945626,
            "image": "/media/images/restaurants/default.png"
          }
      ],
      "trackable": false
    }

const order2 = 
{
    "id": 18,
    "delivery_date": "2023-01-02",
    "delivery_longitude": -3.1888,
    "delivery_latitude": 55.9437,
    "delivery_pence": 50,
    "subtotal_pence": 165,
    "total_pence": 215,
    "owner": 19,
    "status": "PLACED",
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
    "pickups": [
    {
        "id": 2,
        "name": "Greggs",
        "description": "No description provided.",
        "longitude": -3.191257,
        "latitude": 55.945626,
        "image": "/media/images/restaurants/default.png"
    }
    ],
    "trackable": false
}
const navigation = {navigate: jest.fn()}
const renderCard = (orderParam) => {
    return render(
        <AuthContext.Provider value={{}}>
            <PaperProvider>
                    <OrderCard navigation={navigation} item={orderParam}></OrderCard>
                </PaperProvider>
        </AuthContext.Provider>
    )
}

it("All item details are rendered correctly (two vendors)", async() => {
    renderCard(order)
    await waitFor(() => {
        screen.debug();
        screen.getByText("Order #17")
        screen.getByText("Greggs & Tesco") //merging all the names
        screen.getByText("PICKUP")
        screen.getByText("Delivery date: 2023-01-02")
        screen.getByText("£3.80") //from pence
    })
})

it("All item details are rendered correctly (one vendor)", async() => {
    renderCard(order2)
    await waitFor(() => {
        screen.debug();
        screen.getByText("Order #18")
        screen.getByText("Greggs") //single name
        screen.getByText("PLACED")
        screen.getByText("Delivery date: 2023-01-02")
        screen.getByText("£2.15") 
    })
})

it("Click on order should take you to screen with correct parameters", async() => {
    renderCard(order)
    await waitFor(() => {
        fireEvent.press(screen.getByText("Order #17"))
        expect(navigation.navigate).toBeCalledWith("OrderDetailsScreen", {order_id: 17})
    })
})