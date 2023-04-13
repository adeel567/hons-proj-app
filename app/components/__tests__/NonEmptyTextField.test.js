import React, { useContext } from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { NonEmptyTextField } from "../NonEmptyTextField";

const setText = jest.fn();
const label = "email"

const renderCard = () => {
  return render(
    <PaperProvider>
      <NonEmptyTextField setText={setText} text={""} label={label} />
    </PaperProvider>
  );
};

it("Entering text and then leaving blank should show a warning", async () => {
  renderCard();
  await waitFor(() => {
    fireEvent.changeText(screen.getByTestId("textField"), "new string");
    fireEvent.changeText(screen.getByTestId("textField"), "");
    screen.getByText(label + " cannot be empty!");
  });
});

it("Altering text should call prop's set function", async () => {
  renderCard();
  await waitFor(() => {
    fireEvent.changeText(screen.getByTestId("textField"), "new string");
    expect(setText).toHaveBeenCalledWith("new string");
  });
});
