import React, { useContext } from 'react';
import { fireEvent, render, screen, waitFor} from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import { Alert } from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper'
import { OrderDetailsContentCard } from '../OrderDetailsContentCard';


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
          "pence": 163,
          "restaurant_id": 2,
          "restaurant_name": "Greggs"
        },
        {
          "id": 420,
          "name": "Sprite 500ml",
          "description": "No description provided.",
          "pence": 167,
          "restaurant_id": 3,
          "restaurant_name": "Tesco"
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

const openModal = jest.fn() // mock the call to modal

const renderCard = () => {
    return render(
        <AuthContext.Provider value={{}}>
            <PaperProvider>
                    <OrderDetailsContentCard openModal={openModal} orderInfo={order}></OrderDetailsContentCard>
                </PaperProvider>
        </AuthContext.Provider>
    )
}

it("All order total details are rendered", async() => {
    renderCard(order)
    await waitFor(() => {
        screen.getByText("Contents")
        screen.getByText("Subtotal:")
        screen.getByText("£3.30")
        screen.getByText("Delivery Cost:")
        screen.getByText("£0.50")
        screen.getByText("Total:")
        screen.getByText("£3.80")
    })
})

it("Each item is rendered", async() => {
    renderCard(order)
    await waitFor(() => {
        screen.getByText("Diet coke 500ml")
        screen.getByText("Sold by Greggs")
        screen.getByText("£1.63")
        screen.getByText("Sprite 500ml")
        screen.getByText("Sold by Tesco")
        screen.getByText("£1.67")
    })
})

it("Tapping on an item should trigger the modal", async() => {
    renderCard(order)
    await waitFor(() => {
        fireEvent.press(screen.getByText(order.items[0].name))
        expect(openModal).toHaveBeenCalledWith(order.items[0].id)
    })
})
