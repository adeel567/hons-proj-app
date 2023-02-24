import * as React from "react";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Button, Card, Paragraph } from "react-native-paper";
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Geojson } from "react-native-maps";
import marker from "../../assets/marker-icon.png";
import { axiosInstance } from "../api";
import { AuthContext } from "../context/AuthContext";
import { perimeter } from "../../assets/perimeter";
import { nfz } from "../../assets/nfz";

const ZOOM_DELTA_OUT = 0.01; //Crop of map when no location chosen
const ZOOM_DELTA_IN = 0.00069; //Crop of map when a location has been chosen
const DEFAULT_LONGITUDE = -3.1883802;
const DEFAULT_LATITUDE = 55.94399411;
const CHANGE_THRESHOLD = 6; //To prevent map drift, there has to be a threshold on when to register a change of location.

export const ChooseDeliveryLocation = (props) => {
  const navigation = useNavigation();
  const [isLoading, setisLoading] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const { setCartDeliveryLocation, cartDeliveryLocation } =
    React.useContext(AuthContext);
  const [region, setRegion] = React.useState({
    longitude: cartDeliveryLocation
      ? cartDeliveryLocation.delivery_longitude
      : DEFAULT_LONGITUDE,
    latitude: cartDeliveryLocation
      ? cartDeliveryLocation.delivery_latitude
      : DEFAULT_LATITUDE,
    latitudeDelta: cartDeliveryLocation ? ZOOM_DELTA_IN : ZOOM_DELTA_OUT,
    longitudeDelta: cartDeliveryLocation ? ZOOM_DELTA_IN : ZOOM_DELTA_OUT,
  });

  const onRegionChange = (newRegion, { isGesture: boolean }) => {
    if (
      region.latitude.toFixed(CHANGE_THRESHOLD) !==
        newRegion.latitude.toFixed(CHANGE_THRESHOLD) ||
      region.longitude.toFixed(CHANGE_THRESHOLD) !==
        newRegion.longitude.toFixed(CHANGE_THRESHOLD)
    ) {
      setRegion(newRegion);
    }
  };

  React.useEffect(() => {
    if (cartDeliveryLocation?.delivery_latitude) {
      navigation.setOptions({ headerTitle: "Update Delivery Location" });
    }
  }, []);

  const confirmLocation = () => {
    setIsRefreshing(true);
    const params = {
      delivery_longitude: region.longitude,
      delivery_latitude: region.latitude,
    };
    axiosInstance
      .post("checkout/validate/delivery-location", params)
      .then((response) => {
        if ((response.data.status = 200)) {
          setCartDeliveryLocation(params);
          navigation.goBack();
        }
      })
      .catch((error) => {
        var err_text =
          "Issue when communicating with ILP API, please try again later.";
        console.log(error);
        if (error?.response?.data?.res) {
          //if error from API exists, return that message instead.
          err_text = error.response.data.res[0];
        }
        Alert.alert("Issue with the chosen location.", err_text, [
          { text: "OK" },
        ]);
      })
      .finally(() => {
        setisLoading(false), setIsRefreshing(false);
      });
  };

  if (isLoading) {
    return <ActivityIndicator animating={true} />;
  }

  return (
    <View style={styles.map}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChange}
        showsUserLocation={true}
      >
        <Geojson geojson={perimeter} />
        <Geojson geojson={nfz} />
      </MapView>
      <View style={styles.markerFixed}>
        <Image style={styles.marker} source={marker} />
      </View>
      <SafeAreaView style={styles.footer}>
        <Button
          onPress={confirmLocation}
          loading={isRefreshing}
          mode="contained"
          color="green"
          style={styles.button}
        >
          Confirm Location
        </Button>
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
    backgroundColor: "rgba(0, 0, 0, 0.25)",
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
