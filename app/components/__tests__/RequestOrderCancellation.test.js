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
import { RequestOrderCancellation } from "../RequestOrderCancellation";

const navigation = { navigate: jest.fn() }; //mock navigation
const triggerOrderRefresh = jest.fn(); //mock these authContext methods
const setTriggerOrderRefresh = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

const orderId = 420;

const renderButton = () => {
  return render(
    <AuthContext.Provider
      value={{
        triggerOrderRefresh: triggerOrderRefresh,
        setTriggerOrderRefresh: setTriggerOrderRefresh,
      }}
    >
      <RequestOrderCancellation id={orderId} navigation={navigation}>
        Request Cancellation
      </RequestOrderCancellation>
    </AuthContext.Provider>
  );
};

it("Requesting cancellation should show warning message", async () => {
  jest.spyOn(Alert, "alert");
  jest.spyOn(axiosInstance, "delete");
  axiosInstance.delete.mockResolvedValue({
    status: 200,
    data: { res: "success" },
  });

  await waitFor(() => {
    renderButton();

    fireEvent.press(screen.getByText("Request Cancellation"));
    expect(Alert.alert).toHaveBeenCalled();
    expect(axiosInstance.delete).not.toHaveBeenCalled();
  });
});

it("Cancellation request should show failure message on failure", async () => {
  jest.spyOn(Alert, "alert");
  jest.spyOn(axiosInstance, "delete");
  axiosInstance.delete.mockRejectedValue({
    response: { status: 400, data: { res: "error" } },
  });

  await waitFor(() => {
    renderButton();

    fireEvent.press(screen.getByText("Request Cancellation"));
    expect(Alert.alert).toHaveBeenCalled();
    Alert.alert.mock.calls[0][2][0].onPress(); //press left button
    expect(axiosInstance.delete).toHaveBeenCalledWith("/orders/" + orderId);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Order Cancellation",
      "error",
      expect.anything()
    );
  });
});

it("Cancellation request on success should show success message", async () => {
  jest.spyOn(Alert, "alert");
  jest.spyOn(axiosInstance, "delete");
  axiosInstance.delete.mockResolvedValue({
    status: 200,
    data: { res: "success" },
  });

  await waitFor(() => {
    renderButton();

    fireEvent.press(screen.getByText("Request Cancellation"));
    expect(Alert.alert).toHaveBeenCalled();
    Alert.alert.mock.calls[0][2][0].onPress(); 
    expect(axiosInstance.delete).toHaveBeenCalledWith("/orders/" + orderId);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Order Cancellation",
      "success",
      expect.anything()
    );
  });
});
