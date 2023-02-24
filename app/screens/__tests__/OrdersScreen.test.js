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
import { OrdersScreen } from "../OrdersScreen";

/**
 * Tests the orders screen by interacting with all viewable elements
 * and tests interaction with the API
 */

const navigation = { navigate: jest.fn(), setOptions: jest.fn() }; //mock navigation
const fetchCartContent = jest.fn(); //mock function

const mockOrders = [
  {
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
  },
  {
    id: 21,
    delivery_date: "2022-12-25",
    delivery_longitude: -3.1888,
    delivery_latitude: 55.9437,
    delivery_pence: 50,
    subtotal_pence: 330,
    total_pence: 380,
    owner: 19,
    status: "CANCELLED",
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
  },
];

const renderScreen = () => {
  jest.spyOn(axiosInstance, "get");
  axiosInstance.get.mockResolvedValue({ status: 200, data: mockOrders });
  return render(
    <AuthContext.Provider value={{ fetchCartContent: fetchCartContent }}>
      <PaperProvider>
        <OrdersScreen navigation={navigation} />
      </PaperProvider>
    </AuthContext.Provider>
  );
};

it("All elements exist", async () => {
  renderScreen();
  await waitFor(() => {
    screen.getByTestId("searchbar");
    screen.getAllByText("Order #" + mockOrders[0].id); //check component is rendered in, thorough test done in component itself.
    screen.getAllByText("Order #" + mockOrders[1].id);
  });
});

it("On api failure, no items should show.", async () => {
  jest.spyOn(axiosInstance, "get");
  axiosInstance.get.mockResolvedValue({ status: 404, data: {} });
  render(
    <AuthContext.Provider value={{ fetchCartContent: fetchCartContent }}>
      <OrdersScreen navigation={navigation} />
    </AuthContext.Provider>
  );
  await waitFor(() => {
    expect(axiosInstance.get).toHaveBeenCalledWith("/orders");
    screen.getByText("No existing orders found.");
  });
});

it("On load, a call to the API should be made.", async () => {
  jest.spyOn(axiosInstance, "get");
  axiosInstance.get.mockResolvedValue({ status: 200, data: mockOrders });
  render(
    <AuthContext.Provider value={{ fetchCartContent: fetchCartContent }}>
      <OrdersScreen navigation={navigation} />
    </AuthContext.Provider>
  );
  expect(axiosInstance.get).toHaveBeenCalledWith("/orders");
});

it("Clicking on an order should take you to the screen for that order", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.press(screen.getByText("Order #21"));
    expect(navigation.navigate).toHaveBeenCalledWith("OrderDetailsScreen", {
      order_id: 21,
    });
  });
});

it("Pressing sort should do sort (id ascending)", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.press(screen.getByTestId("sortIcon"));
    fireEvent.press(screen.getByTestId("sortIdAsc"));
    expect(screen.getAllByTestId("orderDeliveryDate")[0]).toHaveTextContent(
      "Delivery date: 2023-01-02"
    );
  });
});

it("Pressing sort should do sort (id descending)", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.press(screen.getByTestId("sortIcon"));
    fireEvent.press(screen.getByTestId("sortIdDesc"));
    expect(screen.getAllByTestId("orderDeliveryDate")[0]).toHaveTextContent(
      "Delivery date: 2022-12-25"
    );
  });
});

it("Pressing sort should do sort (delivery date ascending)", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.press(screen.getByTestId("sortIcon"));
    fireEvent.press(screen.getByTestId("sortDateAsc"));
    expect(screen.getAllByTestId("orderDeliveryDate")[0]).toHaveTextContent(
      "Delivery date: 2022-12-25"
    );
  });
});

it("Pressing sort should do sort (delivery date descending)", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.press(screen.getByTestId("sortIcon"));
    fireEvent.press(screen.getByTestId("sortDateDesc"));
    expect(screen.getAllByTestId("orderDeliveryDate")[0]).toHaveTextContent(
      "Delivery date: 2023-01-02"
    );
  });
});

it("Pressing filter should do filter (pickup)", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.press(screen.getByTestId("filterIcon"));
    fireEvent.press(screen.getByTestId("filterPickup"));
    expect(screen.getAllByTestId("orderDeliveryDate")[0]).toHaveTextContent(
      "Delivery date: 2023-01-02"
    );
  });
});

it("Pressing filter should do filter (cancelled)", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.press(screen.getByTestId("filterIcon"));
    fireEvent.press(screen.getByTestId("filterCancelled"));
    expect(screen.getAllByTestId("orderDeliveryDate")[0]).toHaveTextContent(
      "Delivery date: 2022-12-25"
    );
  });
});

it("Pressing filter should do filter (unused e.g. placed)", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.press(screen.getByTestId("filterIcon"));
    fireEvent.press(screen.getByTestId("filterPlaced"));
    expect(screen.queryAllByTestId("orderDeliveryDate")).toHaveLength(0); //neither card on screen.
  });
});

it("Pressing filter should do filter (all)", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.press(screen.getByTestId("filterIcon"));
    fireEvent.press(screen.getByTestId("filterAll"));
    expect(screen.queryAllByTestId("orderDeliveryDate")).toHaveLength(2); //both cards on screen.
  });
});
