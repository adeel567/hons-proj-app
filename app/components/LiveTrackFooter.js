import * as React from "react";
import {
  ActivityIndicator,
  Button,
  Card,
  Divider,
  Paragraph,
  Subheading,
} from "react-native-paper";
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

/**
 * Provides the footer which displays the queue information and a button to refresh said information.
 * Used on the live track screen.
 * @param {trackable, trackingInfo, isRefreshing, onRefresh}
 * @returns
 */
export const LiveTrackFooter = (props) => {
  const trackable = props.trackable;
  const trackingInfo = props.trackingInfo;
  const isRefreshing = props.isRefreshing;
  const onRefresh = props.onRefresh;

  if (trackable) {
    return (
      <View>
        <Card style={{ marginBottom: 20 }}>
          <Card.Title title="Delivery Queue" />
          {trackingInfo.delivery_info.status === "DELIVERED" ? (
            <Card.Content style={{ alignItems: "center" }}>
              <Subheading>
                No tracking info as order is{" "}
                {trackingInfo.delivery_info.status.toLowerCase()}.
              </Subheading>
            </Card.Content>
          ) : (
            <Card.Content style={{ alignItems: "center" }}>
              {trackingInfo.delivery_info.status === "PICKUP" ||
              trackingInfo.delivery_info.status === "DELIVERY" ? (
                <View style={{ alignItems: "center" }}>
                  <Subheading style={{ fontWeight: "bold" }}>
                    Your order is on its way!
                  </Subheading>
                  <Subheading>
                    Its status is{" "}
                    {trackingInfo.delivery_info.status.toLowerCase()}.
                  </Subheading>
                  <Subheading>Head outside soon to retrieve it.</Subheading>
                </View>
              ) : (
                <View style={{ alignItems: "center" }}>
                  <Subheading style={{ fontWeight: "bold" }}>
                    There are {trackingInfo.queue.relative_position} orders
                    infront of you.
                  </Subheading>
                  <Paragraph>
                    Your lunch is delivery {trackingInfo.queue.overall_position}
                    .
                  </Paragraph>
                  <Paragraph>
                    The drone is currently completing delivery{" "}
                    {trackingInfo.queue.current_delivery}.
                  </Paragraph>
                  <Paragraph>
                    There are {trackingInfo.queue.length} orders to deliver
                    today.
                  </Paragraph>
                </View>
              )}
            </Card.Content>
          )}
        </Card>
        <Button
          icon={"refresh"}
          onPress={onRefresh}
          mode="contained"
          color="blue"
          loading={isRefreshing}
        >
          Refresh
        </Button>
      </View>
    );
  }

  //if not trackable, then no card to view.
  return <></>;
};
