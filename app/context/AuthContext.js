import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { axiosInstance } from '../api';
import { setAuthTokens, isLoggedIn, getAccessToken, getRefreshToken, clearAuthTokens } from 'react-native-axios-jwt';
import { Alert } from 'react-native';
import { Modal, Portal, Text, Button, Provider } from 'react-native-paper';


export const AuthContext = createContext();

/**
 * Provides functionality that is used acrosss the application.
 * In regards to authentication and global status such as the user profile.
 */
export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [myIsLoggedIn, setMyIsLoggedIn] = useState(false);
  const [cartContent, setCartContent] = useState({});
  const [cartBadge, setCartBadge] = useState(0);
  const [cartDeliveryLocation, setCartDeliveryLocation] = useState();
  const [cartDeliveryDate, setCartDeliveryDate] = useState();
  const [triggerOrderRefresh, setTriggerOrderRefresh] = useState(false);
  const [cartRefreshing, setCartRefreshing] = useState(false);


  /**
   * Register a user on the backend.
   * If successful it will also automatially log them in
   * If not, then an alert is displayed on screen.
   * @param {*} firstname 
   * @param {*} lastname 
   * @param {*} username 
   * @param {*} email 
   * @param {*} password 
   */
  const register = (firstname, lastname, username, email, password) => {
    setIsLoading(true)
    var params = {
      "username": username,
      "email": email,
      "password": password,
      "first_name": firstname,
      "last_name": lastname
    }

    axiosInstance.post("/auth/register", params)
      .then((response) => {
        if (response.data.status = 200) { //on successful register,try login
          login(username, password)
        }
      })
      .catch(error => {
        console.log(error.response.data)
        var err_text = "Issue when communicating with ILP API, please try again later."
        if (error?.response?.data) { //if error from API exists, return that message instead.
          var values = Object.keys(error.response.data).map(function (key) { return error.response.data[key][0]; }); //need to change API
          var values = values.join('\n')
          err_text = values;
        }
        Alert.alert('Register Error', err_text, [
          { text: 'OK' },
        ]);
      })
      .finally(() => {setIsLoading(false)})
  };

  /**
   * Logs in a user on the backend, then stores the access and refresh token for Axios to use.s
   * Also refreshes the cached information and sets the status as logged in, to trigger a change to authenticated views.
   * @param {*} username 
   * @param {*} password 
   */
  const login = (username, password) => {
    setIsLoading(true)

    const params = {
      "username": username,
      "password": password
    }

    axiosInstance.post("/auth/login", params).then((response) => {
      setAuthTokens({
        accessToken: response.data.access,
        refreshToken: response.data.refresh

      })
        .then(() => {
          setMyIsLoggedIn(true);
          refreshCache();
        })
    })
      .catch(error => {
        console.log(`login error ${error}`);
        console.log(error.data)
        var err_text = "Issue when communicating with ILP API, please try again later."
        if (error?.response?.data?.detail) { //if error from API exists, return that message instead.
          err_text = error.response.data.detail;
        }
        Alert.alert('Login Error', err_text, [
          { text: 'OK' },
        ]);
      })
      .finally(() => {setIsLoading(false)})
  };

  /**
   * Logs the user out and triggers a set to the login/register (unathenticated) views.
   * Also deletes any data stored locally, such as tokens.
   * Failure is done silently.
   */
  const logout = () => {
    setIsLoading(true)
    console.log("logging out...")
    axiosInstance.delete("/profile/push-token") //remove push token when logged out.
      .then(() => {
        setIsLoading(false)
        clearAuthTokens().then(setMyIsLoggedIn(false))
        AsyncStorage.clear();
      })
      .catch((error) => {
        console.log(error.response.data)
        setMyIsLoggedIn(false)
      })
      .finally(() => {setIsLoading(false)})
  };

  /**
   * Fetches the latest cart for a user, and stores it locally.
   */
  const fetchCartContent = async () => {
    setCartRefreshing(true)
    axiosInstance.get("/cart").then((response) => {
      setCartContent(response.data);
      setCartBadge(response.data.items.length)
      AsyncStorage.setItem('cartContent', JSON.stringify(response.data));
    })
      .catch(e => {
        console.log(`fetch cart error ${e}`);
      })
      .finally(() => {setCartRefreshing(false)})
  }


  /**
   * Grabs the profile information of the user
   */
  const fetchUserInfo = () => {
    axiosInstance.get("/profile").then((response) => {
      setUserInfo(response.data);
      AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
    })
      .catch(e => {
        console.log(`fetch profile error ${e}`);
        logout()
      })
  }

  /**
   * Used to check whether the token is still valid, and if so refresh locally held data.
   */
  const refreshLoggedIn = () => {
    setIsRefreshing(true)
    isLoggedIn()
      .then((val) => {
        setMyIsLoggedIn(val)
        if (val) {
          refreshCache();
        }
        console.log(`refreshLog ${myIsLoggedIn}`)
      })
      .finally(() => { setIsRefreshing(false) })
  }

  /**
   * Used when device wakes up from sleep, or launches app after inactivity.
   */
  useEffect(() => {
    console.log("auth use effect")
    if (!myIsLoggedIn) {
      refreshLoggedIn();
    }
  }, []);

  const refreshCache = () => {
    var x = fetchUserInfo();
    var y = fetchCartContent();
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isRefreshing,
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
        cartRefreshing,
        setCartRefreshing,

        triggerOrderRefresh,
        setTriggerOrderRefresh
      }}>
      {children}
    </AuthContext.Provider>
  );
};