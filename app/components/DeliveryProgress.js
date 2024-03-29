import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, IconButton, Paragraph } from "react-native-paper";

/**
 * Renders a little grapic of the current delivery status.
 * Each icon remains greyed out if not happened yet.
 * @param {Status} props current status
 * @returns
 */
function DeliveryProgressBar(props) {
  switch (props.status) {
    case "PLACED":
      return (
        <View style={style.container} testID="progressIconsPlaced">
          <IconButton
            icon="timer-sand"
            size={30}
            color="black"
            style={style.icon}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="check"
            size={30}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="store"
            size={30}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="truck-delivery"
            size={30}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="package-variant-closed"
            size={30}
            color="lightgrey"
            style={style.icon}
          />
        </View>
      );

    case "CONFIRMED":
      return (
        <View style={style.container} testID="progressIconsConfirmed">
          <IconButton
            icon="timer-sand"
            size={30}
            color="black"
            style={style.icon}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            color="black"
            style={style.icon}
          />
          <IconButton icon="check" size={30} color="black" style={style.icon} />
          <IconButton
            icon="arrow-right"
            size={20}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="store"
            size={30}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="truck-delivery"
            size={30}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="package-variant-closed"
            size={30}
            color="lightgrey"
            style={style.icon}
          />
        </View>
      );
    case "PICKUP":
      return (
        <View style={style.container} testID="progressIconsPickup">
          <IconButton
            icon="timer-sand"
            size={30}
            color="black"
            style={style.icon}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            color="black"
            style={style.icon}
          />
          <IconButton icon="check" size={30} color="black" style={style.icon} />
          <IconButton
            icon="arrow-right"
            size={20}
            color="black"
            style={style.icon}
          />
          <IconButton icon="store" size={30} color="black" style={style.icon} />
          <IconButton
            icon="arrow-right"
            size={20}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="truck-delivery"
            size={30}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="package-variant-closed"
            size={30}
            color="lightgrey"
            style={style.icon}
          />
        </View>
      );
    case "DELIVERY":
      return (
        <View style={style.container} testID="progressIconsDelivery">
          <IconButton
            icon="timer-sand"
            size={30}
            color="black"
            style={style.icon}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            color="black"
            style={style.icon}
          />
          <IconButton icon="check" size={30} color="black" style={style.icon} />
          <IconButton
            icon="arrow-right"
            size={20}
            color="black"
            style={style.icon}
          />
          <IconButton icon="store" size={30} color="black" style={style.icon} />
          <IconButton
            icon="arrow-right"
            size={20}
            color="black"
            style={style.icon}
          />
          <IconButton
            icon="truck-delivery"
            size={30}
            color="black"
            style={style.icon}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="package-variant-closed"
            size={30}
            color="lightgrey"
            style={style.icon}
          />
        </View>
      );
    case "DELIVERED":
      return (
        <View style={style.container} testID="progressIconsDelivered">
          <IconButton
            icon="timer-sand"
            size={30}
            color="black"
            style={style.icon}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            color="black"
            style={style.icon}
          />
          <IconButton icon="check" size={30} color="black" style={style.icon} />
          <IconButton
            icon="arrow-right"
            size={20}
            color="black"
            style={style.icon}
          />
          <IconButton icon="store" size={30} color="black" style={style.icon} />
          <IconButton
            icon="arrow-right"
            size={20}
            color="black"
            style={style.icon}
          />
          <IconButton
            icon="truck-delivery"
            size={30}
            color="black"
            style={style.icon}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            color="black"
            style={style.icon}
          />
          <IconButton
            icon="package-variant-closed"
            size={30}
            color="black"
            style={style.icon}
          />
        </View>
      );
    case "CANCELLED":
      return (
        <View style={style.container}>
          <IconButton
            icon="timer-sand"
            size={30}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="check"
            size={30}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="store"
            size={30}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="truck-delivery"
            size={30}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            color="lightgrey"
            style={style.icon}
          />
          <IconButton
            icon="package-variant-closed"
            size={30}
            color="lightgrey"
            style={style.icon}
          />
        </View>
      );
  }
}

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 0,
  },
});

/**
 * Takes the status as a prop and renders a status bar with icons
 * and the status information as text below
 */
export const DeliveryProgress = (props) => {
  return (
    <Card {...props}>
      <Card.Title title={props.title} />
      <Card.Content style={{ alignItems: "center" }}>
        <DeliveryProgressBar status={props.status} />
        <Paragraph testID="progressStatusText">
          Order status is {props.status.toLowerCase()}.
        </Paragraph>
        {props.status === "CANCELLED" ? (<></>) :
<>
        {props.status === "DELIVERED" ? (
    <Paragraph>Delivered on {props.delivery_date}.</Paragraph>
) : (
    <Paragraph>Delivery is on {props.delivery_date}.</Paragraph>
)}
       </> }
      </Card.Content>
    </Card>
  );
};



