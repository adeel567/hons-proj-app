import React, { useContext } from "react";
import fetchMock from "fetch-mock";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { axiosInstance } from "../../api";
import { RegisterScreen } from "../RegisterScreen";
import { AuthContext, AuthProvider } from "../../context/AuthContext";
import { Provider as PaperProvider, TextInput } from "react-native-paper";
import { Alert } from "react-native";

const renderScreen = () => {
  return render(
    <AuthProvider>
      <RegisterScreen />
    </AuthProvider>
  );
};

it("All elements exist", async () => {
  renderScreen();
  screen.getByText("Pop your details in below to sign up!");
  screen.getAllByText("First Name");
  screen.getAllByText("Last Name");
  screen.getAllByText("Username");
  screen.getAllByText("Email");
  screen.getAllByText("Password");
  screen.getAllByText("Confirm Password");
});

it("Warning should show for empty values.", async () => {
  renderScreen();
  fireEvent.changeText(screen.getAllByText("Email")[0], "MYMAIL");
  fireEvent.changeText(screen.getAllByText("Email")[0], "");
  screen.getByText("Email cannot be empty!");
});

it("Submit form with no details", async () => {
  jest.spyOn(Alert, "alert");
  renderScreen();
  fireEvent.press(screen.getByText("Register"));
  expect(Alert.alert).toHaveBeenCalled();
});

it("Submit form with mismatching password", async () => {
  jest.spyOn(Alert, "alert");
  renderScreen();
  fireEvent.changeText(screen.getAllByText("First Name")[0], "A");
  fireEvent.changeText(screen.getAllByText("Last Name")[0], "B");
  fireEvent.changeText(screen.getAllByText("Email")[0], "C@D.COM");
  fireEvent.changeText(screen.getAllByText("Username")[0], "ABC");
  fireEvent.changeText(screen.getAllByText("Password")[0], "Password123$");
  fireEvent.changeText(
    screen.getAllByText("Confirm Password")[0],
    "Password123$"
  );

  fireEvent.press(screen.getByText("Register"));
  expect(Alert.alert).toHaveBeenCalled();
});

it("Submiting a valid form should call register function", async () => {
  const register = jest.fn();
  const isLoading = false;
  render(
    <AuthContext.Provider value={{ isLoading, register }}>
      <RegisterScreen />
    </AuthContext.Provider>
  );
  fireEvent.changeText(screen.getAllByText("First Name")[0], "A");
  fireEvent.changeText(screen.getAllByText("Last Name")[0], "B");
  fireEvent.changeText(screen.getAllByText("Email")[0], "C@D.COM");
  fireEvent.changeText(screen.getAllByText("Username")[0], "ABC");
  fireEvent.changeText(screen.getAllByText("Password")[0], "Password123$");
  fireEvent.changeText(
    screen.getAllByText("Confirm Password")[0],
    "Password123$"
  );
  fireEvent.press(screen.getByText("Register"));

  expect(register).toHaveBeenCalledWith(
    "A",
    "B",
    "ABC",
    "C@D.COM",
    "Password123$"
  );
});
