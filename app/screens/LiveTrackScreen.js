import * as React from "react";
import { useNavigation } from "@react-navigation/native";
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
import MapView, { Geojson, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import drone from "../../assets/drone.png";
import shop from "../../assets/shop.png";
import { axiosInstance } from "../api";
import { AuthContext } from "../context/AuthContext";
import { LiveTrackFooter } from "../components/LiveTrackFooter";
import { perimeter } from "../../assets/perimeter";
import { nfz } from "../../assets/nfz";

/**
 * Live tracking screen. This can adapt to showing just the delivery locations if no live tracking is available.
 * Displays all the pickips and delivery locations.
 * Shows the live location of the drone (if available)
 * Must be manually refreshed, or refreshes on a push notification becoming available.
 * Shows a queue card that details how many orders until yours, or when to head to the delivery location (if available)
 * @param {*}
 * @returns
 */
export const LiveTrackScreen = ({ route, navigation }) => {
  const orderInfo = route.params.orderInfo;
  const orderNo = route.params.orderNo;
  const [trackable, setTrackable] = React.useState(orderInfo.trackable);
  const [trackingInfo, setTrackingInfo] = React.useState();
  const [refreshTracking, setRefreshTracking] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(true);
  const { triggerOrderRefresh } = React.useContext(AuthContext);

  const loadTrackingData = () => {
    setIsRefreshing(true);
    axiosInstance
      .get("/track/" + orderNo)
      .then((response) => {
        if (response.status === 200) {
          //if tracking is available
          setTrackable(true);
          setTrackingInfo(response.data);
        } else {
          setTrackable(false);
        }
        setIsLoading(false);
        setIsRefreshing(false);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert(
          "An error occurred :(",
          "Issue connecting to ILP API, please try again later.",
          [
            {
              text: "Try Again",
              onPress: () => loadTrackingData(),
            },
            { text: "OK" },
          ]
        );
      });
  };

  React.useEffect(() => {
    loadTrackingData(); //refresh on first load
  }, [refreshTracking, triggerOrderRefresh]); //refresh when triggered in context

  React.useEffect(() => {
    trackable
      ? navigation.setOptions({ headerTitle: "Live Track Order #" + orderNo })
      : navigation.setOptions({ headerTitle: "Delivery Location #" + orderNo });
  }, [trackable]);

  const onRefresh = () => {
    setRefreshTracking(!refreshTracking);
  };

  if (isLoading) {
    return <ActivityIndicator animating={true} />;
  }

  return (
    <View style={styles.map}>
      <MapView
		provider={PROVIDER_GOOGLE}
        mapPadding={trackable ? { bottom: 250 } : { bottom: 0 }}
        style={styles.map}
        initialRegion={{
          latitude: trackable
            ? orderInfo.delivery_latitude - 0.001
            : orderInfo.delivery_latitude,
          longitude: orderInfo.delivery_longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        <Geojson geojson={perimeter} />
        <Geojson geojson={nfz} />
        {trackable && trackingInfo.delivery_info.status !== "DELIVERED" ? ( //drone is shown when not delivered and is trackable
          <Marker
            title={"Drone"}
            testID={"droneMarker"}
            icon={drone}
            description={
              "Making delivery " + trackingInfo.queue.current_delivery
            }
            coordinate={{
              longitude: trackingInfo.drone_location.longitude,
              latitude: trackingInfo.drone_location.latitude,
            }}
          />
        ) : (
          <></>
        )}

        {orderInfo.pickups.map(
          (
            pickup,
            index //display each restaurant as a custom marker
          ) => (
            <Marker
              title="Pickup"
              testID="pickupMarker"
              key={index}
              icon={shop}
              description={pickup.name}
              coordinate={{
                longitude: pickup.longitude,
                latitude: pickup.latitude,
              }}
            />
          )
        )}

        <Marker //display delivery location as a default marker.
          title={"Delivery Location"}
          testID="deliveryMarker"
          coordinate={{
            longitude: orderInfo.delivery_longitude,
            latitude: orderInfo.delivery_latitude,
          }}
        />
      </MapView>

      <SafeAreaView testID="LTFooter" style={styles.footer}>
        <LiveTrackFooter
          trackable={trackable}
          trackingInfo={trackingInfo}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {},
  map: {
    flex: 1,
  },
  markerFixed: {
    left: "50%",
    marginLeft: -24,
    marginTop: -48,
    position: "absolute",
    top: "50%",
  },
  marker: {
    height: 48,
    width: 48,
  },
  footer: {
    bottom: 0,
    position: "absolute",
    width: "100%",
    padding: 25,
  },
  region: {
    color: "#fff",
    lineHeight: 20,
    margin: 20,
  },
});
