import React, { useContext } from 'react';
import { fireEvent, render, screen, waitFor} from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import { Alert } from 'react-native';
import { DeliveryProgress } from '../DeliveryProgress';
import {Provider as PaperProvider} from 'react-native-paper'


const delivery_date = "2023-04-20";

const renderComponent = (status) => {
    return render(
        <DeliveryProgress title={"Delivery Status"} 
            status={status} delivery_date={delivery_date}/>

    )
}

it("Text should render correctly when delivered", async() => {
    await waitFor(() => {
        renderComponent("DELIVERED")
        screen.getByText("Order status is delivered.")
        screen.getByText("Delivered on 2023-04-20.")
    })
})

it("Text should render correctly when on stages before delivery", async() => {
    await waitFor(() => {
        renderComponent("PICKUP")
        screen.getByText("Order status is pickup.")
        screen.getByText("Delivery is on 2023-04-20.")
    })
})

it("Correct set of icons for a status", async() => {
    await waitFor(() => {
        renderComponent("PICKUP")
        screen.getByTestId("progressIconsPickup")
    })
})

it("Previous state shouldn't exist.", async() => {
    await waitFor(() => {
        renderComponent("DELIVERY")
        screen.getByTestId("progressIconsDelivery")
        expect(screen.queryAllByTestId("PICKUP")).toHaveLength(0)
    })
})