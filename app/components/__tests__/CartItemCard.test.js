import React, { useContext } from 'react';
import { fireEvent, render, screen, waitFor} from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import { Alert } from 'react-native';
import { CartItemCard } from '../CartItemCard';

const item = 
    {
        "id": 69,
        "name": "Diet coke 500ml",
        "description": "No description provided.",
        "pence": 165,
        "restaurant_id": 2,
        "restaurant_name": "Greggs"
    }

const fetchCartContent = jest.fn();

const renderCard = () => {
    return render(
        <AuthContext.Provider value={{fetchCartContent}}>
                <CartItemCard item={item}></CartItemCard>
        </AuthContext.Provider>
    )
}

it("Correctly rendered all text and buttons", async() => {
    renderCard()
    await waitFor(() => {
        screen.getByText("Diet coke 500ml")
        screen.getByText("Sold by Greggs")
        screen.getByText("£1.65") //parsed from 165 -> £1.65
        screen.getByText("Add another") //buttons
        screen.getByText("Remove")
    })
})