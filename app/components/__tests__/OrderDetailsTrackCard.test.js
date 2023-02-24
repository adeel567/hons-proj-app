import React, { useContext } from 'react';
import { fireEvent, render, screen, waitFor} from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import { Alert } from 'react-native';
import { MenuItem } from '../MenuItem';
import { OrderDetailsTrackCard } from '../OrderDetailsTrackCard';

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
      "trackable": true
    }

const order2 = 
{
    "id": 17,
    "delivery_date": "2023-01-02",
    "delivery_longitude": -3.1888,
    "delivery_latitude": 55.9437,
    "delivery_pence": 50,
    "subtotal_pence": 330,
    "total_pence": 380,
    "owner": 19,
    "status": "DELIVERED",
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

const navigation = { navigate: jest.fn(), setOptions: jest.fn()};

const renderCard = (order) => {
    return render(
        <AuthContext.Provider value={{}}>
                <OrderDetailsTrackCard navigation={navigation} orderInfo={order}></OrderDetailsTrackCard>
        </AuthContext.Provider>
    )
}

it("Renders correct screen when already delivered", async() => {
    renderCard(order)
    await waitFor(() => { 
        screen.getByText("Delivery Location")
        screen.getByText("Tap to view delivery location.")
    })
})

it("Renders correct screen when tracking is available", async() => {
    renderCard(order2)
    await waitFor(() => { 
        screen.getByText("Live Tracking")
        screen.getByText("Tap to view delivery location and live tracking.")
    })
})

it("Press on card should navigate to correct screen", async() => {
    renderCard(order2)
    await waitFor(() => { 
        fireEvent.press(screen.getByText("Live Tracking"));
        expect(navigation.navigate).toHaveBeenCalledWith("Live Track", )
    })
})