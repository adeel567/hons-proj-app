import React, { useContext } from "react";
import { Button } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../api";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";

export const RemoveFromCartButton = (props) => {
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

  const removeCall = () => {
    setIsLoading(true);
    axiosInstance
      .delete(`/cart/item/${props.id}`)
      .then((response) => {
        if ((response.status = 200)) {
          Alert.alert("Remove From Cart", response.data.res, [
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
        Alert.alert("Remove From Cart", err_text, [
          { text: "View Cart", onPress: goToCart },
          { text: "OK" },
        ]);
      })
      .finally(() => {
        setIsLoading(false), fetchCartContent();
      });
  };

  return (
    <Button
      {...props}
      loading={isLoading}
      icon={"cart-minus"}
      disabled={isLoading}
      color={"darkorange"}
      onPress={removeCall}
    >
      {props.children}
    </Button>
  );
};
