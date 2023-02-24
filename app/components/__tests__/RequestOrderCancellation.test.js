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
  jest.spyOn(axiosInstance, "delete");
  axiosInstance.delete.mockResolvedValue({
    status: 200,
    data: { res: "success" },
  });
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

const renderButton2 = () => {
  jest.spyOn(axiosInstance, "delete");
  axiosInstance.delete.mockRejectedValue({
    response: { status: 400, data: { res: "error" } },
  });
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

  await waitFor(() => {
    renderButton();

    fireEvent.press(screen.getByText("Request Cancellation"));
    expect(Alert.alert).toHaveBeenCalled();
    expect(axiosInstance.delete).not.toHaveBeenCalled();
  });
});

it("Cancellation request should call empty endpoint after confirmation (left button)", async () => {
  jest.spyOn(Alert, "alert");

  await waitFor(() => {
    renderButton2();

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

// it("Empty cart should show success message", async() => {
//     jest.spyOn(axiosInstance, "delete");
//     axiosInstance.delete.mockResolvedValue({ status:200, data: {res:"success"}});
//     jest.spyOn(Alert, 'alert')
//     await waitFor(() => {
//         renderButton()
//         fireEvent.press(screen.getByText("Empty"))
//         Alert.alert.mock.calls[0][2][0].onPress()
//         expect(axiosInstance.delete).toHaveBeenCalledWith("/cart");
//         expect(Alert.alert).toHaveBeenCalledWith("Empty Cart", "success", expect.anything())
//     })
// })

// it("Empty cart should show failure message", async() => {
//     jest.spyOn(axiosInstance, "delete");
//     axiosInstance.delete.mockRejectedValue({response:{ status:400, data: {"res": "error message"} }});
//     jest.spyOn(Alert, 'alert')
//     await waitFor(() => {
//         renderButton()
//         fireEvent.press(screen.getByText("Empty"))
//         Alert.alert.mock.calls[0][2][0].onPress()
//         expect(axiosInstance.delete).toHaveBeenCalledWith("/cart");
//         expect(Alert.alert).toHaveBeenCalledWith("Empty Cart", "error message", expect.anything())
//     })
// })

// it("Empty cart should show generic failure message on API issues", async() => {
//     jest.spyOn(axiosInstance, "delete");
//     axiosInstance.delete.mockRejectedValue({response:{ status:400, data: {} }});
//     jest.spyOn(Alert, 'alert')
//     await waitFor(() => {
//         renderButton()
//         fireEvent.press(screen.getByText("Empty"))
//         Alert.alert.mock.calls[0][2][0].onPress()
//         expect(axiosInstance.delete).toHaveBeenCalledWith("/cart");
//         expect(Alert.alert).toHaveBeenCalledWith("Empty Cart", "Issue when communicating with ILP API, please try again later.", expect.anything())
//     })
// })
