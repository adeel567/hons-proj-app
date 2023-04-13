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
import { OrderDetailsScreen } from "../OrderDetailsScreen";

/**
 * Tests the order details by interacting with all viewable elements
 * The children of this screen are tested separately.
 * and tests interaction with the API
 */

afterEach(() => {
  jest.resetAllMocks();
});

const navigation = { navigate: jest.fn(), setOptions: jest.fn() }; //mock navigation
const fetchCartContent = jest.fn(); //mock function

const order = {
  id: 17,
  delivery_date: "2023-01-02",
  delivery_longitude: -3.1888,
  delivery_latitude: 55.9437,
  delivery_pence: 50,
  subtotal_pence: 330,
  total_pence: 380,
  owner: 19,
  status: "PICKUP",
  items: [
    {
      id: 69,
      name: "Diet coke 500ml",
      description: "No description provided.",
      pence: 165,
      restaurant_id: 2,
      restaurant_name: "Greggs",
    },
    {
      id: 69,
      name: "Diet coke 500ml",
      description: "No description provided.",
      pence: 165,
      restaurant_id: 2,
      restaurant_name: "Greggs",
    },
  ],
  pickups: [
    {
      id: 2,
      name: "Greggs",
      description: "No description provided.",
      longitude: -3.191257,
      latitude: 55.945626,
      image: "/media/images/restaurants/default.png",
    },
  ],
  trackable: false,
};

const route = { params: { order_id: order.id } }; //mock the route being given.

const renderScreen = () => {
  jest.spyOn(axiosInstance, "get");
  axiosInstance.get.mockResolvedValue({ status: 200, data: order });
  return render(
    <AuthContext.Provider value={{ fetchCartContent: fetchCartContent }}>
      <PaperProvider>
        <OrderDetailsScreen navigation={navigation} route={route} />
      </PaperProvider>
    </AuthContext.Provider>
  );
};

it("All elements exist", async () => {
  renderScreen();
  await waitFor(() => {
    //basic check for all components to be rendered.
    screen.getByTestId("progressStatusText");
    screen.getAllByText("Tap to view delivery location.");
    screen.getAllByText("Diet coke 500ml");
    expect(screen.queryAllByText("Request Cancellation")).toHaveLength(0);
  });
});

it("On load, a call to the API should be made.", async () => {
  jest.spyOn(axiosInstance, "get");
  axiosInstance.get.mockResolvedValue({ status: 200, data: order });
  render(
    <AuthContext.Provider value={{ fetchCartContent: fetchCartContent }}>
      <PaperProvider>
        <OrderDetailsScreen navigation={navigation} route={route} />
      </PaperProvider>
    </AuthContext.Provider>
  );
  expect(axiosInstance.get).toHaveBeenCalledWith("/orders/" + order.id);
});

it("On api failure, a safe error of just loading with no elements should occur", async () => {
  jest.spyOn(axiosInstance, "get");
  jest.spyOn(Alert, "alert");
  axiosInstance.get.mockRejectedValue({
    response: { status: 404, data: { res: "error" } },
  });

  render(
    <AuthContext.Provider value={{ fetchCartContent: fetchCartContent }}>
      <PaperProvider>
        <OrderDetailsScreen navigation={navigation} route={route} />
      </PaperProvider>
    </AuthContext.Provider>
  );
  await waitFor(() => {
    expect(axiosInstance.get).toHaveBeenCalledWith("/orders/" + order.id);

    screen.getByTestId("loading"); //on failure there should just be a blank loading screen with error message alert.

    expect(screen.queryAllByTestId("progressStatusText")).toHaveLength(0);
    expect(screen.queryAllByText("Diet coke 500ml")).toHaveLength(0);

    expect(Alert.alert).toHaveBeenCalledWith(
      "An error occurred :(",
      expect.anything(),
      expect.anything()
    );
  });
});

it("Clicking delivery tracker should take you to that page", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.press(screen.getByText("Tap to view delivery location."));
    expect(navigation.navigate).toHaveBeenCalledWith(
      "Live Track",
      expect.anything()
    );
  });
});
