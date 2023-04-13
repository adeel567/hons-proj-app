import React, { useContext } from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { axiosInstance } from "../../api";
import { AuthContext, AuthProvider } from "../AuthContext";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { Alert } from "react-native";
import * as jwtModule from "react-native-axios-jwt";
import { spy } from "fetch-mock";

afterEach(() => {
  jest.clearAllMocks();
});

const MockRegisterButton = () => {
  const { register } = React.useContext(AuthContext);
  const helper = () => {
    register("Walter", "White", "hb", "hb@gmail.com", "Password!23");
  };
  return (
    <View>
      <Button onPress={helper}>register</Button>
    </View>
  );
};

it("Pressing register should send details to API and then attempt to login.", async () => {
  await waitFor(() => {
    jest.spyOn(axiosInstance, "post");
    axiosInstance.post.mockResolvedValue({
      status: 200,
      data: { res: "success" },
    });
    render(
      <AuthProvider>
        <MockRegisterButton />
      </AuthProvider>
    );
    fireEvent.press(screen.getByText("register"));
    expect(axiosInstance.post).toHaveBeenCalledWith("/auth/register", {
      email: "hb@gmail.com",
      first_name: "Walter",
      last_name: "White",
      password: "Password!23",
      username: "hb",
    });
    expect(axiosInstance.post).toHaveBeenCalledWith("/auth/login", {
      password: "Password!23",
      username: "hb",
    });
  });
});

it("Failing to register should trigger an error, and no login attempt.", async () => {
  await waitFor(() => {
    jest.spyOn(axiosInstance, "post");
    jest.spyOn(Alert, "alert");
    axiosInstance.post.mockRejectedValue({
      status: 401,
      data: { res: ["insecure password"] },
    });
    render(
      <AuthProvider>
        <MockRegisterButton />
      </AuthProvider>
    );
    fireEvent.press(screen.getByText("register"));
    expect(axiosInstance.post).toHaveBeenCalledWith("/auth/register", {
      email: "hb@gmail.com",
      first_name: "Walter",
      last_name: "White",
      password: "Password!23",
      username: "hb",
    });
    expect(axiosInstance.post).not.toHaveBeenCalledWith(
      "/auth/login",
      expect.anything()
    ); //no login attempt
    expect(Alert.alert).toHaveBeenCalledWith(
      "Register Error",
      expect.anything(),
      expect.anything()
    );
  });
});

const MockLoginButton = () => {
  const { login, myIsLoggedIn } = React.useContext(AuthContext);
  const helper = () => {
    login("walter", "password");
  };
  return (
    <View>
      <Button onPress={helper}>login</Button>
      <Text>Logged in {myIsLoggedIn}</Text>
    </View>
  );
};

it("Pressing login should send details to API,  store the token which was returned, and fetch user info", async () => {
  const spy = jest.spyOn(jwtModule, "setAuthTokens");
  spy.mockImplementation(() => Promise.resolve()); //mock storing keys

  await waitFor(() => {
    jest.spyOn(axiosInstance, "post");
    jest.spyOn(axiosInstance, "get");

    axiosInstance.post.mockResolvedValue({
      status: 200,
      data: { res: "success" },
    });
    render(
      <AuthProvider>
        <MockLoginButton />
      </AuthProvider>
    );
    fireEvent.press(screen.getByText("login"));
    expect(axiosInstance.post).toHaveBeenCalledWith("/auth/login", {
      password: "password",
      username: "walter",
    });
    expect(jwtModule.setAuthTokens).toHaveBeenCalled();
    expect(axiosInstance.get).toHaveBeenCalledWith("/profile");
  });
});

it("Failing to login should trigger an error", async () => {
  await waitFor(() => {
    jest.spyOn(axiosInstance, "post");
    jest.spyOn(Alert, "alert");
    axiosInstance.post.mockRejectedValue({
      status: 401,
      data: { res: "bad password" },
    });
    render(
      <AuthProvider>
        <MockLoginButton />
      </AuthProvider>
    );
    fireEvent.press(screen.getByText("login"));
    expect(Alert.alert).toHaveBeenCalledWith(
      "Login Error",
      expect.anything(),
      expect.anything()
    );
  });
});

const MockFetchCartButton = () => {
  const { fetchCartContent } = React.useContext(AuthContext);
  return (
    <View>
      <Button onPress={fetchCartContent}>cart</Button>
    </View>
  );
};

it("Should be able to fetch the latest content of the cart", async () => {
  await waitFor(() => {
    jest.spyOn(axiosInstance, "get");
    render(
      <AuthProvider>
        <MockFetchCartButton />
      </AuthProvider>
    );
    fireEvent.press(screen.getByText("cart"));
    expect(axiosInstance.get).toHaveBeenCalledWith("/cart");
  });
});

const MockLogoutButton = () => {
  const { logout, myIsLoggedIn } = React.useContext(AuthContext);
  return (
    <View>
      <Text>logged in {myIsLoggedIn}</Text>
      <Button onPress={logout}>logout</Button>
    </View>
  );
};

it("On log out, locally held keys should be cleared and push notifications deactivated.", async () => {
  jest.spyOn(axiosInstance, "delete");
  axiosInstance.delete.mockResolvedValue({
    status: 200,
    data: { res: "success" },
  });

  const spy = jest.spyOn(jwtModule, "clearAuthTokens");
  spy.mockImplementation(() => Promise.resolve()); //mock storing keys

  await waitFor(() => {
    render(
      <AuthProvider>
        <MockLogoutButton />
      </AuthProvider>
    );
    fireEvent.press(screen.getByText("logout"));
    expect(axiosInstance.delete).toHaveBeenCalledWith("/profile/push-token");
    expect(jwtModule.clearAuthTokens).toHaveBeenCalled();
  });
});

