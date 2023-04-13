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
import { Provider as PaperProvider } from "react-native-paper";
import { ChooseDeliveryLocation } from "../ChooseDeliveryLocation";
import { DEFAULT_LONGITUDE, DEFAULT_LATITUDE } from "../ChooseDeliveryLocation";

const navigation = {
  navigate: jest.fn(),
  setOptions: jest.fn(),
  goBack: jest.fn(),
}; //mock navigation
const setCartDeliveryLocation = jest.fn(); //mock function
var cartDeliveryLocation = {
  delivery_longitude: DEFAULT_LONGITUDE,
  delivery_latitude: DEFAULT_LATITUDE,
};

afterEach(() => {
  jest.clearAllMocks();
});

const renderScreen = () => {
  return render(
    <AuthContext.Provider
      value={{ setCartDeliveryLocation, cartDeliveryLocation }}
    >
      <PaperProvider>
        <ChooseDeliveryLocation navigation={navigation} />
      </PaperProvider>
    </AuthContext.Provider>
  );
};

it("All elements exist when first choosing", async () => {
  await waitFor(() => {
    renderScreen();

    screen.queryAllByA11yValue("Map");
    screen.getByText("Confirm Location");
  });
});

it("Confirming location should make an API call and on success return back to previous screen.", async () => {
  jest.spyOn(axiosInstance, "post");
  axiosInstance.post.mockResolvedValue({
    status: 200,
    data: { res: "success" },
  }); //coordinates were accepted

  await waitFor(() => {
    //can't pan during test, so should send default value.
    renderScreen();

    fireEvent.press(screen.getByText("Confirm Location"));
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "checkout/validate/delivery-location",
      {
        delivery_latitude: DEFAULT_LATITUDE,
        delivery_longitude: DEFAULT_LONGITUDE,
      }
    );
    expect(navigation.goBack).toHaveBeenCalled(); //return
  });
});

it("On failed coordinate choosing, a message should be shown and stay on current screen.", async () => {
  jest.spyOn(axiosInstance, "post");
  jest.spyOn(Alert, "alert");

  axiosInstance.post.mockRejectedValue({
    status: 400,
    data: { res: "failure" },
  }); //coordinates were rejected

  await waitFor(() => {
    //can't pan during test, so should send default value.
    renderScreen();

    fireEvent.press(screen.getByText("Confirm Location"));
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "checkout/validate/delivery-location",
      {
        delivery_latitude: DEFAULT_LATITUDE,
        delivery_longitude: DEFAULT_LONGITUDE,
      }
    );
    expect(navigation.goBack).not.toHaveBeenCalled(); //return
    expect(Alert.alert).toHaveBeenCalledWith(
      "Issue with the chosen location",
      expect.anything(),
      expect.anything()
    );
  });
});

it("If coordinate already set, then default to that location, and be in update mode", async () => {
  cartDeliveryLocation = {
    delivery_longitude: -3, //example location set.
    delivery_latitude: 55,
  };

  jest.spyOn(axiosInstance, "post");
  jest.spyOn(Alert, "alert");

  axiosInstance.post.mockResolvedValue({
    status: 200,
    data: { res: "success" },
  }); //coordinates were accepted

  await waitFor(() => {
    //can't pan during test, so should send default value.
    renderScreen();

    fireEvent.press(screen.getByText("Confirm Location"));
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "checkout/validate/delivery-location",
      {
        delivery_latitude: cartDeliveryLocation.delivery_latitude,
        delivery_longitude: cartDeliveryLocation.delivery_longitude,
      }
    );
    expect(navigation.setOptions).toHaveBeenCalled(); //header being changed to Update instead of default
    expect(navigation.goBack).toHaveBeenCalled(); //return on success
  });
});
