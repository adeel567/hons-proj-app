import React, { useContext } from 'react';
import { fireEvent, render, screen, waitFor} from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import { Alert } from 'react-native';
import { MenuItem } from '../MenuItem';

const item = 
    {
        "id": 69,
        "name": "Diet coke 500ml",
        "description": "No description provided.",
        "pence": 165,
        "restaurant_id": 2,
        "restaurant_name": "Greggs"
    }

const renderCard = (usage) => {
    return render(
        <AuthContext.Provider value={{}}>
                <MenuItem usage={usage} item={item}></MenuItem>
        </AuthContext.Provider>
    )
}

it("Correctly rendered all text and buttons when rendered in a store page", async() => {
    renderCard("vendor")
    await waitFor(() => { 
        screen.debug()
        screen.getByText("Diet coke 500ml")
        screen.getByText("£1.65") //parsed from 165 -> £1.65
        screen.getByText("Add to cart") //buttons
        expect(screen.queryAllByText("Remove")).toHaveLength(0)
    })
})

it("Correctly rendered all text and buttons when rendered in cart screen", async() => {
    renderCard("cart")
    await waitFor(() => { 
        screen.getByText("Diet coke 500ml")
        screen.getByText("£1.65") 
        screen.getByText("Add another")
        screen.getByText("Remove")
        expect(screen.queryAllByText("Add to cart")).toHaveLength(0)

    })
})

it("Correctly rendered all text and buttons when viewed in order screen", async() => {
    renderCard("order")
    await waitFor(() => { 
        screen.getByText("Diet coke 500ml")
        screen.getByText("£1.65") //parsed from 165 -> £1.65
        screen.getByText("Add to cart") //buttons
        expect(screen.queryAllByText("Remove")).toHaveLength(0)
    })
})