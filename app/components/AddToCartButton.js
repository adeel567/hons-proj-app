import React, { useContext } from "react";
import { ActivityIndicator, Button } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../api";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

/**
 * Passes all parent props to child, and adds the item ID passed to cart
 * by using the API. Becomes loading icon while loading, and
 * displays an alert on success / failure.
 * @param {*} props.id id of the item to add to cart
 * @returns button which adds item to cart
 */
export const AddToCartButton = (props) => {
  const navigation = props.navigation;
  const { fetchCartContent } = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const goToCart = () => {
    navigation.navigate("Cart");
    doPropFunction();
  };

  const doPropFunction = () => {
    if (props.function) {
      props.function();
    }
  };

  const addCall = () => {
    setIsLoading(true);
    axiosInstance
      .post(`/cart/item/${props.id}`)
      .then((response) => {
        if ((response.status = 200)) {
          Alert.alert("Add to cart", response.data.res, [
            // { text: "View Cart", onPress: goToCart },
            { text: "OK" },
          ]);
        }
      })
      .catch((error) => {
        var err_text =
          "Issue when communicating with ILP API, please try again later.";
        if (error?.response?.data?.res) {
          err_text = error.response.data.res;
        }
        Alert.alert("Add to cart", err_text, [
          { text: "View Cart", onPress: goToCart },
          { text: "OK" },
        ]);
      })
      .finally(() => {
        fetchCartContent(), setIsLoading(false);
      });
  };

  return (
    <Button
      {...props}
      icon={"cart-plus"}
      color={"darkgreen"}
      disabled={isLoading}
      loading={isLoading}
      onPress={addCall}
    >
      {props.children}
    </Button>
  );
};
