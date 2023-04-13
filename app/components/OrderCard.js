import React, { useContext } from "react";
import { Card, Paragraph } from "react-native-paper";
import { View } from "react-native";
import { map } from "lodash";

/**
 * Card that previews the status of an order. Details restaurants, total price, delivery status and delivery date.
 * @param {*} props item and navigation prop
 * @returns Order card
 */
export const OrderCard = (props) => {
  const item = props.item;
  const navigation = props.navigation;

  const on_press = () => {
    navigation.navigate("OrderDetailsScreen", { order_id: item.id });
  };

  const format_restaurant_names = () => {
    //get the unique names of restaurants from the items
    var x = map(item.pickups, "name");
    if (x.length == 2) {
      return x[0] + " & " + x[1];
    } else {
      return x[0];
    }
  };

  return (
    <Card
      style={{ marginVertical: 10, marginHorizontal: 25, borderRadius: 10 }}
      onPress={on_press}
    >
      <Card.Title
        testID="orderTitle"
        style={{ marginBottom: -5 }}
        title={"Order #" + item.id}
      />

      <Card.Content style={{ flexDirection: "row" }}>
        <View style={{ flex: 5 }}>
          <Paragraph style={{ color: "dimgrey" }}>
            {format_restaurant_names()}
          </Paragraph>
          <Paragraph testID="orderDeliveryDate">
            Delivery date: {item.delivery_date}
          </Paragraph>
        </View>
        <View style={{ flex: 2, alignItems: "center" }}>
          <Paragraph style={{ color: "dimgrey" }}>{item.status}</Paragraph>
          <Paragraph>£{Number(item.total_pence / 100).toFixed(2)}</Paragraph>
        </View>
      </Card.Content>
    </Card>
  );
};
