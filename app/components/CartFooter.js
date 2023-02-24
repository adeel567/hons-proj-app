import * as React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Button,
  Card,
  Paragraph,
  IconButton,
  Provider,
  Divider,
  Text,
} from "react-native-paper";
import { EmptyCartButton } from "./EmptyCartButton";
import { AuthContext } from "../context/AuthContext";
import { View } from "react-native";
import { SubmitOrderButton } from "./SubmitOrderButton";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

/**
 * Renders all parts of the cart which are below the dynamically generated items
 */
export const CartFooter = (props) => {
  const deliveryLocation = props.deliveryLocation;
  const deliveryDate = props.deliveryDate;

  const { cartContent, isLoading, setCartDeliveryDate } =
    React.useContext(AuthContext);
  const navigation = props.navigation;

  const pickLocation = () => {
    navigation.navigate("Choose Delivery Location");
  };

  const [date, setDate] = React.useState(new Date());

  //get tomorrow's date
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    const stringDate = currentDate.toISOString().slice(0, 10);
    setDate(currentDate);
    setCartDeliveryDate(stringDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
      minimumDate: new Date(),
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  return (
    <View>
      <Card style={{ marginHorizontal: 25, marginTop: 10, borderRadius: 10 }}>
        <Card.Title title={"Cart Summary"} />

        <Card.Content style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, justifyContent: "flex-start" }}>
            <Paragraph>Subtotal:</Paragraph>
            <Paragraph>Delivery Cost:</Paragraph>
            <Paragraph>Total:</Paragraph>
          </View>
          <View style={{ justifyContent: "flex-end" }}>
            <Paragraph>
              £{Number(cartContent.subtotal_pence / 100).toFixed(2)}
            </Paragraph>
            <Paragraph>
              £{Number(cartContent.delivery_cost_pence / 100).toFixed(2)}
            </Paragraph>
            <Divider />
            <Paragraph>
              £{Number(cartContent.total_pence / 100).toFixed(2)}
            </Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Divider style={{ marginTop: 20 }} />

      <Card
        style={{
          marginHorizontal: 10,
          marginTop: 20,
          marginBottom: 10,
          borderRadius: 10,
        }}
        onPress={pickLocation}
      >
        <Card.Title
          title="Delivery Location"
          subtitle={
            deliveryLocation
              ? "Valid delivery location set"
              : "Tap to set delivery location."
          }
          right={(props) => <IconButton {...props} icon="chevron-right" />}
        />
      </Card>

      <Card
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          marginBottom: 20,
          borderRadius: 10,
        }}
        onPress={showDatepicker}
      >
        <Card.Title
          title={"Delivery Date"}
          subtitle={
            deliveryDate
              ? "Set to: " + deliveryDate
              : "Tap to set delivery date."
          }
          right={(props) => <IconButton {...props} icon="chevron-right" />}
        />
      </Card>

      <View
        style={{
          marginHorizontal: 50,
          height: 100,
          justifyContent: "space-around",
        }}
      >
        <SubmitOrderButton navigation={navigation}>
          Submit Order
        </SubmitOrderButton>
        <EmptyCartButton>Empty Cart</EmptyCartButton>
      </View>
    </View>
  );
};
