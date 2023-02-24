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
import { VendorScreen } from "../VendorScreen";

/**
 * Tests the vendor screen by trying user interaction with all elements
 * and testing if the API and navigation function correctly.
 */

const navigation = { navigate: jest.fn(), setOptions: jest.fn() }; //mock navigation
const fetchCartContent = jest.fn(); //mock function

const vendor = {
  id: 2,
  name: "Greggs",
  description: "No description provided.",
  longitude: -3.191257,
  latitude: 55.945626,
  image: "/media/images/restaurants/default.png",
};

const mockMenu = [
  {
    id: 25,
    name: "Chargrill chicken oval bite",
    description: "No description provided.",
    pence: 699,
    restaurant: 2,
    image: "/media/images/items/default.png",
  },
  {
    id: 26,
    name: "Chicken club baguette",
    description: "No description provided.",
    pence: 355,
    restaurant: 2,
    image: "/media/images/items/default.png",
  },
];

const route = { params: { vendor: vendor } }; //mock the route being given.

const renderScreen = () => {
  jest.spyOn(axiosInstance, "get");
  axiosInstance.get.mockResolvedValue({ status: 200, data: mockMenu });
  return render(
    <AuthContext.Provider value={{ fetchCartContent: fetchCartContent }}>
      <PaperProvider>
        <VendorScreen navigation={navigation} route={route} />
      </PaperProvider>
    </AuthContext.Provider>
  );
};

it("All elements exist", async () => {
  renderScreen();
  await waitFor(() => {
    screen.getAllByAccessibilityValue("vendor-cover-image")[0];
    screen.getAllByAccessibilityValue("search-bar")[0];
    screen.getAllByAccessibilityValue("vendor-about-card")[0];
    screen.getAllByText(mockMenu[0].name);
    screen.getAllByText(mockMenu[1].name);
  });
});

it("On api failure, no items should show.", async () => {
  jest.spyOn(axiosInstance, "get");
  axiosInstance.get.mockResolvedValue({ status: 404, data: {} });
  render(
    <AuthContext.Provider value={{ fetchCartContent: fetchCartContent }}>
      <VendorScreen navigation={navigation} route={route} />
    </AuthContext.Provider>
  );
  await waitFor(() => {
    expect(axiosInstance.get).toHaveBeenCalledWith("/menu/" + vendor.id);
    screen.getByText("No items found!");
  });
});

it("On load, a call to the API should be made.", async () => {
  jest.spyOn(axiosInstance, "get");
  axiosInstance.get.mockResolvedValue({ status: 200, data: mockMenu });
  render(
    <AuthContext.Provider value={{ fetchCartContent: fetchCartContent }}>
      <VendorScreen navigation={navigation} route={route} />
    </AuthContext.Provider>
  );
  expect(axiosInstance.get).toHaveBeenCalledWith("/menu/" + vendor.id);
});

it("Clicking on about should take you to about screen for that vendor", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.press(screen.getByText("Greggs"));
    expect(navigation.navigate).toHaveBeenCalledWith(
      "About",
      expect.anything()
    );
  });
});

it("Searching should work and render only valid results", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.changeText(
      screen.getAllByPlaceholderText("Search for menu items.")[0],
      "Chargrill chicken oval bite"
    );
    expect(screen.queryByText("Chicken club baguette")).toBeNull();
    screen.getByText("Chargrill chicken oval bite");
  });
});

it("Search on non-existing should return empty message", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.changeText(
      screen.getAllByPlaceholderText("Search for menu items.")[0],
      "garbagestring"
    );
    expect(screen.queryByText("Chicken club baguette")).toBeNull();
    expect(screen.queryByText("Chargrill chicken oval bite")).toBeNull();
    screen.getByText("No items found!");
  });
});

it("Reset search should restore missing items", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.changeText(
      screen.getAllByPlaceholderText("Search for menu items.")[0],
      "garbagestring"
    );
    expect(screen.queryByText("Chicken club baguette")).toBeNull();
    expect(screen.queryByText("Chargrill chicken oval bite")).toBeNull();
    screen.getByText("No items found!");
    fireEvent.changeText(
      screen.getAllByPlaceholderText("Search for menu items.")[0],
      ""
    );
    screen.queryByText("Chicken club baguette");
    screen.queryByText("Chargrill chicken oval bite");
  });
});

it("Pressing sort should do sort (name desc)", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.changeText(
      screen.getAllByPlaceholderText("Search for menu items.")[0],
      ""
    );
    fireEvent.press(screen.getByTestId("sortIcon"));
    fireEvent.press(screen.getByTestId("sortNameDesc"));
    expect(screen.getAllByTestId("itemTitle")[0]).toHaveTextContent(
      "Chicken club baguette"
    );
  });
});

it("Pressing sort should do sort (name asc)", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.changeText(
      screen.getAllByPlaceholderText("Search for menu items.")[0],
      ""
    );
    fireEvent.press(screen.getByTestId("sortIcon"));
    fireEvent.press(screen.getByTestId("sortNameAsc"));
    expect(screen.getAllByTestId("itemTitle")[0]).toHaveTextContent(
      "Chargrill chicken oval bite"
    );
  });
});

it("Pressing sort should do sort (price desc)", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.changeText(
      screen.getAllByPlaceholderText("Search for menu items.")[0],
      ""
    );
    fireEvent.press(screen.getByTestId("sortIcon"));
    fireEvent.press(screen.getByTestId("sortPriceDesc"));
    expect(screen.getAllByTestId("itemTitle")[0]).toHaveTextContent(
      "Chargrill chicken oval bite"
    );
  });
});

it("Pressing sort should do sort (price asc)", async () => {
  renderScreen();
  await waitFor(() => {
    fireEvent.changeText(
      screen.getAllByPlaceholderText("Search for menu items.")[0],
      ""
    );
    fireEvent.press(screen.getByTestId("sortIcon"));
    fireEvent.press(screen.getByTestId("sortPriceAsc"));
    expect(screen.getAllByTestId("itemTitle")[0]).toHaveTextContent(
      "Chicken club baguette"
    );
  });
});
