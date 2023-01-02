import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useState} from 'react';
import { axiosInstance } from '../api';
import {setAuthTokens, isLoggedIn, getAccessToken, getRefreshToken, clearAuthTokens} from 'react-native-axios-jwt';
import {Alert} from 'react-native';
import { Modal, Portal, Text, Button, Provider } from 'react-native-paper';



export const AuthContext = createContext();
export const AuthProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [myIsLoggedIn, setMyIsLoggedIn] = useState(false);
  const [cartContent, setCartContent] = useState({});
  const [cartBadge, setCartBadge] = useState(0);
  const [cartDeliveryLocation, setCartDeliveryLocation] = useState();
  const [cartDeliveryDate, setCartDeliveryDate] = useState();
  const [triggerOrderRefresh, setTriggerOrderRefresh] = useState(false);

  const register = (firstname, lastname, username, email, password) => {

    var params = {
      "username": username,
      "email": email,
      "password": password,
      "first_name": firstname,
      "last_name": lastname
    }

    axiosInstance.post("/auth/register", params)
    .then( (response) => {
      if (response.data.status = 200) { //on successful register,try login
        login(username,password)
      }})
    .catch( error => {
        console.log(error.response.data)
        var err_text = "Issue when communicating with ILP API, please try again later."
        if (error?.response?.data) { //if error from API exists, return that message instead.
            var values = Object.keys(error.response.data).map(function (key) { return error.response.data[key][0]; }); //need to change API
            var values = values.join('\n')
            err_text = values;
        }
        Alert.alert('An error occurred :(', err_text, [
            { text: 'OK'},
        ]);
      })
  };

  const login = (username, password) => {

    const params = {
        "username": username,
        "password": password
    }

    axiosInstance.post("/auth/login", params).then( (response) => {
        setAuthTokens({
            accessToken: response.data.access,
            refreshToken: response.data.refresh

        })
        .then(() => {
          refreshCache();
          console.log("token: " + response.data.access);
          setMyIsLoggedIn(true);
        })
    })
    .catch(error => {
        console.log(`login error ${error}`);
        console.log(error.data)
        var err_text = "Issue when communicating with ILP API, please try again later."
        if (error?.response?.data?.detail) { //if error from API exists, return that message instead.
            err_text = error.response.data.detail;
        }
        Alert.alert('An error occurred :(', err_text, [
            { text: 'OK'},
        ]);
      });
 
    
  };

  const logout = () => {
    console.log("logging out..")
    axiosInstance.delete("/profile/push-token") //remove push token when logged out.
    .then( () => {
      clearAuthTokens().then(setMyIsLoggedIn(false))
      AsyncStorage.clear();
    })
    .catch((error) => {
      console.log(error.response.data)
      setMyIsLoggedIn(false)
    })

  };



  const fetchCartContent = async () => {
    axiosInstance.get("/cart").then((response) => {
      setCartContent(response.data);
      setCartBadge(response.data.items.length)
      AsyncStorage.setItem('cartContent', JSON.stringify(response.data));
      console.log(response.data)
    })
    .catch(e => {
      console.log(`fetch cart error ${e}`);
    })
  }

  const fetchOrders = async () => {

  }



  const fetchUserInfo = () => {
    axiosInstance.get("/profile").then((response) => {
      setUserInfo(response.data);
      AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      console.log(response.data)
    })
    .catch(e => {
      console.log(`fetch profile error ${e}`);
      logout()
    })
  }

  const refreshLoggedIn = () => {
    setIsLoading(true)
    isLoggedIn().then((val) => {
      setMyIsLoggedIn(val)
      console.log(`EEEEE ${val}`)
      if (val) {
        refreshCache();
      }
      console.log(`refreshLog ${myIsLoggedIn}`)
      setIsLoading(false)
    })
  }


  useEffect(() => {
    console.log("auth use effect")
    if (!myIsLoggedIn) {
      refreshLoggedIn();
    }
  },[]);

  const refreshCache = () => {
    var x = fetchUserInfo();
    var y = fetchCartContent();    
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        myIsLoggedIn,
        userInfo,
        refreshCache,
        register,
        login,
        logout,

        cartContent,
        cartBadge,
        fetchCartContent,

        cartDeliveryLocation,
        setCartDeliveryLocation,
        cartDeliveryDate,
        setCartDeliveryDate,

        triggerOrderRefresh,
        setTriggerOrderRefresh
      }}>
      {children}
    </AuthContext.Provider>
  );
};