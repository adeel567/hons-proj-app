import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { Vendors } from "../components/Vendors.js";

/**
 * Wrapper around the Vendors component to render the home screen.
 * @param {} navigation object
 * @returns HomeScreen
 */
export const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView>
      <Vendors navigation={navigation} />
    </SafeAreaView>
  );
};
