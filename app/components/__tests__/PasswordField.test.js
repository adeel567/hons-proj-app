import React, { useContext } from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { PasswordField } from "../PasswordField";
import { Provider as PaperProvider } from "react-native-paper";

const setPass = jest.fn();

const renderCard = () => {
  return render(
    <PaperProvider>
      <PasswordField setPassword={setPass} password={""} />
    </PaperProvider>
  );
};

it("Entering text and then leaving blank should show a warning", async () => {
  renderCard();
  await waitFor(() => {
    fireEvent.changeText(screen.getByTestId("passwordField"), "new password");
    fireEvent.changeText(screen.getByTestId("passwordField"), "");
    screen.getByText("Password cannot be empty!");
  });
});

it("Altering password should call prop's set function", async () => {
  renderCard();
  await waitFor(() => {
    fireEvent.changeText(screen.getByTestId("passwordField"), "new password");
    expect(setPass).toHaveBeenCalledWith("new password");
  });
});
