import * as React from "react";
import { Card, IconButton } from "react-native-paper";
import { OrderDetailsContentCard } from "../components/OrderDetailsContentCard";

/**
 * Renders the card which navigates to the tracking screen.
 * If live track is in progress, then this directs to the live traker, otherwise just the delivery location.
 * @param {*} props orderInfo and navigate prop.
 * @returns card
 */
export const OrderDetailsTrackCard = (props) => {
  const orderInfo = props.orderInfo;
  const navigation = props.navigation;

  const navigate_livetrack = () => {
    navigation.navigate("Live Track", {
      orderNo: orderInfo.id,
      orderInfo: orderInfo,
    });
  };

  if (orderInfo.trackable) {
    return (
      <Card
        onPress={navigate_livetrack}
        style={{ marginVertical: 10, marginHorizontal: 10, borderRadius: 10 }}
      >
        <Card.Title
          title="Live Track"
          subtitle="Tap to view delivery location and live tracking."
          right={(props) => <IconButton {...props} icon="chevron-right" />}
        />
      </Card>
    );
  }

  return (
    <Card
      onPress={navigate_livetrack}
      style={{ marginVertical: 10, marginHorizontal: 10, borderRadius: 10 }}
    >
      <Card.Title
        title="Delivery Location"
        subtitle="Tap to view delivery location."
        right={(props) => <IconButton {...props} icon="chevron-right" />}
      />
    </Card>
  );
};
