import React, { useContext } from "react";
import { ActivityIndicator, Subheading, Title } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import { Alert, FlatList, RefreshControl, View } from "react-native";
import { CartFooter } from "../components/CartFooter";
import { OpenItem } from "../components/OpenItem";
import { CartItemCard } from "../components/CartItemCard";

/**
 * Screen for all of the items in the cart.
 * From here more items can be added, or checkout can be completed.
 */
export const CartScreen = (props) => {
  const navigation = props.navigation;
  const {
    cartContent,
    fetchCartContent,
    cartDeliveryDate,
    cartDeliveryLocation,
    isLoading,
    cartRefreshing,
  } = React.useContext(AuthContext);
  const [itemVisible, setItemVisible] = React.useState();
  const [itemVisibleID, setItemVisibleID] = React.useState();

  React.useEffect(() => {
    fetchCartContent(); //refresh on first load
  }, []);

  //pops up a modal of an item in the cart's menu cards.
  const openModal = (id) => {
    setItemVisibleID(id);
    setItemVisible(true);
  };

  const noResults = () => {
    return (
      <View style={{ padding: 25 }}>
        <Title style={{ alignSelf: "center" }}>No cart items found.</Title>
        <Subheading style={{ alignSelf: "center" }}>
          Time to do some shopping :D
        </Subheading>
      </View>
    );
  };

  if (isLoading) {
    return <ActivityIndicator style={{ padding: 25 }} animating={true} />;
  }

  return (
    <View>
      {cartRefreshing ? <ActivityIndicator style={{ marginTop: 25 }} /> : <></>}
      <OpenItem
        navigation={navigation}
        visible={itemVisible}
        setVisible={setItemVisible}
        itemID={itemVisibleID}
        usage={"cart"}
      />
      <FlatList
        ListHeaderComponent={
          <View style={{ marginBottom: 15 }} /> //add buffer to top
        }
        data={cartContent.items}
        ListEmptyComponent={noResults}
        renderItem={({ item }) => {
          return (
            <CartItemCard
              item={item}
              navigation={navigation}
              openModal={openModal}
            />
          );
        }}
        keyExtractor={(item, index) => index}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchCartContent} />
        }
        ListFooterComponent={() => {
          if (cartContent.items.length <= 0) {
            return <View />;
          } else {
            return (
              <View>
                <CartFooter
                  navigation={navigation}
                  deliveryLocation={cartDeliveryLocation}
                  deliveryDate={cartDeliveryDate}
                />
              </View>
            );
          }
        }}
      />
    </View>
  );
};
