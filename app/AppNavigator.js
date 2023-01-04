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
import { VendorAboutScreen } from './screens/VendorAboutScreen';
import * as Notifications from 'expo-notifications';
import {ChooseDeliveryLocation} from './screens/ChooseDeliveryLocation'
import { OrderDetailsScreen } from './screens/OrderDetailsScreen';
import { Alert, Platform } from 'react-native';
import * as Device from 'expo-device';
import { axiosInstance } from './api';
import { useNavigation } from '@react-navigation/native';
import { LiveTrackScreen } from './screens/LiveTrackScreen';

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

    return(
        <NavigationContainer>
            {myIsLoggedIn ? <AppStack/> : <AuthStack/>}
        </NavigationContainer>
    )
}

export const AppStack = () => {
  const {cartBadge, setTriggerOrderRefresh, triggerOrderRefresh} = useContext(AuthContext);

  //do push notification enrollment when logged in only. 
  async function registerForPush() {
    let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    const params = {
      "push_token": token
    }
    axiosInstance.post("/profile/push-token", params)
    .catch((error) => {
      console.log(error.response.data)
    })

  } else {
    alert('Must use physical device for Push Notifications');
  }
  }

  ///handle push notifications
  const nav = useNavigation();

  const handleNotification = notificationRes => {
    const orderNo = notificationRes.notification.request.content.data.orderNo
    setTriggerOrderRefresh(!triggerOrderRefresh)

    nav.navigate('OrderStack', {
      screen: 'OrderDetailsScreen',
      params: {order_id: orderNo},
      initial: false
  
    })
  }

  useEffect(() => {
    Notifications.addNotificationResponseReceivedListener(handleNotification);
  },[])

  // const lastNotificationResponse = Notifications.useLastNotificationResponse();
  // useEffect(() => {
  //   if (lastNotificationResponse) {
  //     setTriggerOrderRefresh(!triggerOrderRefresh)
  //     const orderNo = lastNotificationResponse.notification.request.content.data.orderNo
  //     nav.navigate('OrderStack', {
  //       screen: 'OrderDetailsScreen',
  //       params: {order_id: orderNo},
  //       initial: false

  //     })
  //   }
  // },[lastNotificationResponse])

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    registerForPush()
  }, [] )



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
        name="CartStack" 
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
        name="OrderStack" 
        component={OrderStack} 
        options={{
          tabBarLabel: "Orders",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clipboard" color={color} size={25} />
          )
        }}
      />

    
      <Tab.Screen
        name="SettingsStack" 
        component={SettingsStack} 
        options={{
          tabBarLabel: "Settings",
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
      <Stack.Screen name="About"  component={VendorAboutScreen}/>
    </Stack.Navigator>
  )
}

const CartStack = () => {
  return(
    <Stack.Navigator>
    <Stack.Screen options={{headerShown:true}} name="Cart" component={CartScreen} />
    <Stack.Screen name="Choose Delivery Location" component={ChooseDeliveryLocation} />
    </Stack.Navigator>
  )
}

const OrderStack = () => {
  return(
    <Stack.Navigator>
    <Stack.Screen options={{headerShown:true}} name="Orders" component={OrdersScreen} />
    <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
    <Stack.Screen name="Live Track" component={LiveTrackScreen} />

    </Stack.Navigator>
  )
}

const SettingsStack = () => {
  return(
    <Stack.Navigator>
    <Stack.Screen options={{headerShown:true}} name="Settings" component={SettingsScreen} />

    </Stack.Navigator>
  )
}