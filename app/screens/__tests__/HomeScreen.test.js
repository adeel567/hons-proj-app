import React, { useContext } from 'react';
import { fireEvent, render, screen, waitFor} from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import {Provider as PaperProvider} from 'react-native-paper'
import { HomeScreen } from '../HomeScreen';

const userInfo = { //for greeting.
    "username": "s.goodman",
    "first_name": "Saul",
    "last_name": "Goodman",
    "email": "saul.goodman@law.ed.ac.uk"
}

afterEach(() => {
    jest.clearAllMocks();
  });

const mockVendor =
    [
        {
          "id": 1,
          "name": "Rudis",
          "description": "No description provided.",
          "longitude": -3.191065,
          "latitude": 55.945626,
          "image": "/media/images/restaurants/default.png"
        },
        {
          "id": 2,
          "name": "Greggs",
          "description": "No description provided.",
          "longitude": -3.191257,
          "latitude": 55.945626,
          "image": "/media/images/restaurants/default.png"
        }
    ]

const navigation = { navigate: jest.fn() }; //mock navigation

const renderScreen = () => {
    jest.spyOn(axiosInstance, "get");
    axiosInstance.get.mockResolvedValue({ status:200, data: mockVendor });
    return render(
        <AuthContext.Provider value={{userInfo}}>
            <PaperProvider>
                <HomeScreen navigation={navigation}/>
            </PaperProvider>
        </AuthContext.Provider>
    )
}


it("On load, a call to the API should be made.", async () => {
    jest.spyOn(axiosInstance, "get");
    axiosInstance.get.mockResolvedValue({ status:200, data: mockVendor });
    render(
        <AuthContext.Provider value={{userInfo}}>
            <HomeScreen navigation={navigation}/>
            </AuthContext.Provider>
    )
    expect(axiosInstance.get).toHaveBeenCalledWith("/restaurants")
})

it("On api failure, no items should show.", async () => {

    jest.spyOn(axiosInstance, "get");
    axiosInstance.get.mockResolvedValue({ status:404, data: {} });
    render(
        <AuthContext.Provider value={{userInfo}}>
            <HomeScreen navigation={navigation}/>
        </AuthContext.Provider>
    )
    await waitFor(() => {
        expect(axiosInstance.get).toHaveBeenCalledWith("/restaurants")
        screen.getByText("No vendors found!")
    })
})


it("All elements on the page", async () => {
    renderScreen()
    await waitFor(() => {
        //check part of each element, to see if they exist.
        screen.getByText("Hello " + userInfo.first_name + ".") //should have personal greeting 
        screen.getAllByAccessibilityValue("search-bar")[0]  
        screen.getAllByText("Rudis")
        screen.getAllByText("Greggs")
    })
})

it("Click on vendor should take you to their page", async () => {
    renderScreen()
    await waitFor(() => {
        fireEvent.press(screen.getByText("Greggs"))
        expect(navigation.navigate).toHaveBeenCalledWith("VendorScreen", expect.anything())
    
    })
})

it("Searching should work and render only valid results", async () => {
    renderScreen()
    await waitFor(() => {
        fireEvent.changeText(screen.getAllByPlaceholderText("Search for restaurants.")[0],"Greggs") 
        expect(screen.queryByText("Rudis")).toBeNull() //no rudis when searching for greggs
        screen.getByText("Greggs")
    })
})


it("Search on non-existing should return empty message", async () => {
    renderScreen()
    await waitFor(() => {
        fireEvent.changeText(screen.getAllByPlaceholderText("Search for restaurants.")[0],"garbagestring") 
        expect(screen.queryByText("Rudis")).toBeNull()
        expect(screen.queryByText("Greggs")).toBeNull() 
        screen.getByText("No vendors found!")
    })
})

it("Reset search should restore missing items", async () => {
    renderScreen()
    await waitFor(() => {
        fireEvent.changeText(screen.getAllByPlaceholderText("Search for restaurants.")[0],"garbagestring") 
        expect(screen.queryByText("Rudis")).toBeNull()
        expect(screen.queryByText("Greggs")).toBeNull() 
        screen.getByText("No vendors found!")
        fireEvent.changeText(screen.getAllByPlaceholderText("Search for restaurants.")[0],"") 
        screen.queryByText("Rudis")
        screen.queryByText("Greggs")
    })
})

it("Pressing sort should do sort (descending)", async () => {
    renderScreen()
    await waitFor(() => {
        fireEvent.changeText(screen.getAllByPlaceholderText("Search for restaurants.")[0],"") 
        fireEvent.press(screen.getByTestId("sortIcon"))
        fireEvent.press(screen.getByTestId("sortDesc"))
        expect(screen.getAllByTestId("vendorTitle")[0]).toHaveTextContent("Rudis");
    })
})

it("Pressing sort should do sort (descending)", async () => {
    renderScreen()
    await waitFor(() => {
        fireEvent.changeText(screen.getAllByPlaceholderText("Search for restaurants.")[0],"") 
        fireEvent.press(screen.getByTestId("sortIcon"))
        fireEvent.press(screen.getByTestId("sortAsc"))
        expect(screen.getAllByTestId("vendorTitle")[0]).toHaveTextContent("Greggs");
    })
})
