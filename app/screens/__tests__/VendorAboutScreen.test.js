import React, { useContext } from 'react';
import { fireEvent, render, screen, waitFor} from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import { Alert } from 'react-native';
import {ResetPasswordScreen} from '../ResetPasswordScreen'
import { VendorScreen } from '../VendorScreen';
import { VendorAboutScreen } from '../VendorAboutScreen';

/**
 * Tests the vendor about screen by checking if the map and descriptions have loaded correctly.
 */

const navigation = { navigate: jest.fn(), setOptions: jest.fn()}; //mock navigation

const vendor = 
    {  
    "id": 2,
    "name": "Greggs",
    "description": "No description provided.",
    "longitude": -3.191257,
    "latitude": 55.945626,
    "image": "/media/images/restaurants/default.png"
    }


const route={params: {vendor: vendor}} //mock the route being given.

const renderScreen = () => {
    return render(
            <VendorAboutScreen navigation={navigation} route={route}/>
    )
}

it("All elements exist", async() => {
    renderScreen()
    await waitFor(() => {
        screen.getAllByText(vendor.description)[0]
        screen.getAllByText("Tap on point below for the location information.")[0]
        screen.getAllByA11yValue("Map")[0] //test if map loaded
        screen.getAllByA11yValue("Marker")[0] //test if marker loaded
    })
})

it("Test if marker is correct", async() => {
    renderScreen()
    await waitFor(() => {
        expect(screen.getByTestId('marker'))
        .toHaveProp('coordinate', { latitude: vendor.latitude, longitude: vendor.longitude })
        expect(screen.getByTestId('marker'))
        .toHaveProp('title', vendor.name)
    })
})