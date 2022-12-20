import React, { useCallback, useContext, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, Text} from '@react-navigation/native';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { HomeScreen } from './screens/HomeScreen';
import { VendorScreen } from './screens/VendorScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { CartScreen } from './screens/CartScreen';
import { AuthContext } from './context/AuthContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';
import { VendorAbout } from './components/VendorAbout';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import {ChooseDeliveryLocation} from './screens/ChooseDeliveryLocation'
// import {ChooseDeliveryDate} from './screens/ChooseDeliveryDate'


const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const {myIsLoggedIn, isLoading} = useContext(AuthContext);
    if (isLoading) {
        return (
          <SafeAreaView>
            <ActivityIndicator animating={true}/>
          </SafeAreaView>
        )
    }

    console.log(`returning ${myIsLoggedIn}`)
    return(
        <NavigationContainer>
            {myIsLoggedIn ? <AppStack/> : <AuthStack/>}
        </NavigationContainer>
    )
}

export const AppStack = () => {
  const {cartBadge} = useContext(AuthContext);
  return (
    <Tab.Navigator>

      <Tab.Screen
        name="Home" 
        component={HomeStack} 
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={25} />
          )
        }}
      />

      <Tab.Screen
        name="CartStacl" 
        component={CartStack} 
        options={{
          tabBarLabel: "Cart",
          tabBarBadge: cartBadge>0 ? cartBadge : false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cart" color={color} size={25} />
          )
        }}
      />

      <Tab.Screen
        name="Orders" 
        component={OrdersScreen} 
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clipboard" color={color} size={25} />
          )
        }}
      />

    
      <Tab.Screen
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cogs" color={color} size={25} />
          )
        }}
      />



    </Tab.Navigator>
  );
};

export const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen options={{headerShown:false}} name="HomePage" component={HomeScreen} />
      <Stack.Screen name="VendorScreen" component={VendorScreen} />
      <Stack.Screen name="About"  component={VendorAbout}/>
    </Stack.Navigator>
  )
}

const CartStack = () => {
  return(
    <Stack.Navigator>
    <Stack.Screen options={{headerShown:true}} name="Cart" component={CartScreen} />
    <Stack.Screen name="Choose Delivery Location" component={ChooseDeliveryLocation} />
    {/* <Stack.Screen name="Choose Delivery Date" component={ChooseDeliveryDate} /> */}

    </Stack.Navigator>
  )
}