import React, { useContext } from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { axiosInstance } from "../api";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import { Provider as PaperProvider } from "react-native-paper";
import { AppNavigator } from "../AppNavigator";

afterEach(() => {
  jest.clearAllMocks();
});

const renderScreen = (myIsLoggedIn, isRefreshing) => {
  return render(
    <AuthContext.Provider value={{myIsLoggedIn, isRefreshing}}>
      <PaperProvider>
        <AppNavigator/>
      </PaperProvider>
    </AuthContext.Provider>
  );
};


it("When not logged in there should only be the login stack visible", async () => {
    await waitFor(()=> {
        renderScreen(false,false)
        screen.getByTestId("loginButton")
    })
})

it("When the state is refreshing and logged out, expect loading only", async () => {
    await waitFor(()=> {
        renderScreen(false,true)
        expect(screen.queryByTestId("loginButton")).toBeNull()
    })
})

it("When the state is refreshing and logged in, expect loading only", async () => {
    await waitFor(()=> {
        renderScreen(true,true)
        expect(screen.queryByTestId("loginButton")).toBeNull()
    })
})

it("If logged in then there should be a navbar on screen with all of the stacks.", async () => {
    await waitFor(()=> {
        renderScreen(true,false)
        screen.getByText("Home")
        screen.getByText("Cart")
        screen.getByText("Orders")
        screen.getByText("Settings")
    })
})