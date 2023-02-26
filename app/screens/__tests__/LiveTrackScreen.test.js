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
import { LiveTrackScreen } from "../LiveTrackScreen";
import { Provider as PaperProvider } from "react-native-paper";

const navigation = { navigate: jest.fn(), setOptions: jest.fn() }; //mock navigation

var trackingInfo = {
  queue: {
    relative_position: 2,
    current_delivery: 1,
    overall_position: 3,
    length: 5,
  },
  drone_location: {
    longitude: -3.1878490000000004,
    latitude: 55.944623903810566,
  },
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
  delivery_info: {
    longitude: -3.1888,
    latitude: 55.9437,
    status: "CONFIRMED",
  },
};


const order = {
  id: 17,
  delivery_date: "2023-01-02",
  delivery_longitude: -3.1888,
  delivery_latitude: 55.9437,
  delivery_pence: 50,
  subtotal_pence: 330,
  total_pence: 380,
  owner: 19,
  status: "CONFIRMED",
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

const route1 = {
  params: { orderInfo: order, orderNo: order.id },
  navigation: navigation,
}; //mock the route being given.

const triggerOrderRefresh = jest.fn();

const renderScreen = (route) => {
  return render(
    <AuthContext.Provider value={{ triggerOrderRefresh }}>
      <PaperProvider>
        <LiveTrackScreen navigation={navigation} route={route} />
      </PaperProvider>
    </AuthContext.Provider>
  );
};

it("On load, a call should be made to get tracking info", async () => {
  jest.spyOn(axiosInstance, "get");
  axiosInstance.get.mockResolvedValue({ status: 202, data: {} }); //tracking not yet available
  renderScreen(route1);

  await waitFor(() => {
    expect(axiosInstance.get).toBeCalledWith("/track/" + order.id);
  });
});

it("API failure should fail gracefully", async () => {
  jest.spyOn(axiosInstance, "get");
  jest.spyOn(Alert, "alert");

  axiosInstance.get.mockRejectedValue({
    response: { status: 404, data: { res: "error" } },
  });
  renderScreen(route1);

  await waitFor(() => {
    expect(axiosInstance.get).toBeCalledWith("/track/" + order.id);
    expect(screen.queryAllByA11yValue("Map")).toHaveLength[0]; //no map rendered
    expect(Alert.alert).toHaveBeenCalledWith(
      "An error occurred :(",
      expect.anything(),
      expect.anything()
    );
  });
});

it("If tracking not yet available then just show markers", async () => {
  jest.spyOn(axiosInstance, "get");
  axiosInstance.get.mockResolvedValue({ status: 404, data: {} }); //tracking not yet available
  renderScreen(route1);

  await waitFor(() => {
    expect(axiosInstance.get).toBeCalledWith("/track/" + order.id);
    expect(screen.getByTestId("deliveryMarker")).toHaveProp("coordinate", {
      latitude: order.delivery_latitude,
      longitude: order.delivery_longitude,
    });
    expect(screen.getAllByTestId("pickupMarker")[0]).toHaveProp("coordinate", {
      latitude: order.pickups[0].latitude,
      longitude: order.pickups[0].longitude,
    });
    expect(screen.queryByTestId("refreshButton")).toBeNull(); //live track footer shouldnt show when not trackable
  });
});

it("If tracking available then also have drone marker.", async () => {
  jest.spyOn(axiosInstance, "get");
  axiosInstance.get.mockResolvedValue({ status: 200, data: trackingInfo }); //tracking not yet available
  renderScreen(route1);

  await waitFor(() => {
    expect(axiosInstance.get).toBeCalledWith("/track/" + order.id);
    expect(screen.getByTestId("deliveryMarker")).toHaveProp("coordinate", {
      latitude: order.delivery_latitude,
      longitude: order.delivery_longitude
    },
      "title", "Delivery Location"
    );
    expect(screen.getAllByTestId("pickupMarker")[0]).toHaveProp("coordinate", {
      latitude: order.pickups[0].latitude,
      longitude: order.pickups[0].longitude
    },
      "title", "pickup",
      "description", "Greggs"
    );
    screen.getByTestId("refreshButton")
    expect(screen.getByTestId("droneMarker")).toHaveProp("coordinate", {
        latitude: trackingInfo.drone_location.latitude,
        longitude: trackingInfo.drone_location.longitude
    })
  });
});

it("Trackable but now delivered should be similar as untrackable but with footer.", async () => {
    jest.spyOn(axiosInstance, "get");
    axiosInstance.get.mockResolvedValue({ status: 200, data: trackingInfo }); //tracking not yet available
    renderScreen(route1);
  
    await waitFor(() => {
      expect(axiosInstance.get).toBeCalledWith("/track/" + order.id);
      expect(screen.getByTestId("deliveryMarker")).toHaveProp("coordinate", {
        latitude: order.delivery_latitude,
        longitude: order.delivery_longitude,
      });
      expect(screen.getAllByTestId("pickupMarker")[0]).toHaveProp("coordinate", {
        latitude: order.pickups[0].latitude,
        longitude: order.pickups[0].longitude,
      });
      screen.queryByTestId("refreshButton") //live track footer *should* show as it will have a message saying order complete.
    });
  });
  