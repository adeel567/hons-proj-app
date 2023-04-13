import React, { useContext } from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { axiosInstance } from "../../api";
import { AuthContext, AuthProvider } from "../../context/AuthContext";
import { Alert } from "react-native";
import { Vendor } from "../Vendor";

const vendor = {
  id: 2,
  name: "Greggs",
  description: "No description provided.",
  longitude: -3.191257,
  latitude: 55.945626,
  image: "https://cdn.com/media/images/restaurants/default.png",
};

const navigation = { navigate: jest.fn() };

const renderCard = () => {
  return render(
    <AuthContext.Provider value={{}}>
      <Vendor
        navigation={navigation}
        name={vendor.name}
        description={vendor.description}
        item={vendor}
      ></Vendor>
    </AuthContext.Provider>
  );
};

it("Correctly rendered all text and image", async () => {
  renderCard();

  await waitFor(() => {
    screen.getByText("Greggs");
    screen.getByText("No description provided.");
    screen.getByTestId("vendorImage"); //cover image
  });
});

it("Clicking on vendor should take you to that page", async () => {
  renderCard();

  await waitFor(() => {
    fireEvent.press(screen.getByText("Greggs"));
    expect(navigation.navigate).toHaveBeenCalledWith(
      "VendorScreen",
      expect.anything()
    );
  });
});
