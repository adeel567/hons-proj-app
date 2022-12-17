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
  const [splashLoading, setSplashLoading] = useState(false);
  const [myIsLoggedIn, setMyIsLoggedIn] = useState(false);
  const [cartContent, setCartContent] = useState({});
  const [cartBadge, setCartBadge] = useState(0);
  // const [counter, setCounter] = useState(0);

  const register = (firstname, lastname, username, email, password) => {
    setIsLoading(true);

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
        setIsLoading(false);
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
    setIsLoading(false)
  };

  const login = (username, password) => {
    setIsLoading(true);

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
          setIsLoading(false)  
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
        setIsLoading(false);
      });
 
    
  };

  const logout = () => {
    console.log("logging out..")
    setIsLoading(true);
    clearAuthTokens().then(setMyIsLoggedIn(false))
    AsyncStorage.clear();
    setIsLoading(false)
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

  const fetchUserInfo = () => {
    setIsLoading(true)
    axiosInstance.get("/profile").then((response) => {
      setUserInfo(response.data);
      AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
      console.log(response.data)
      setIsLoading(false)
    })
    .catch(e => {
      console.log(`fetch profile error ${e}`);
      setIsLoading(false);
    })

   
  }

  // const updateLoggedIn = async () => {
  //   isLoggedIn().then( (val) => {
  //     setMyIsLoggedIn(val)
  //     console.log('logged in: ' + myIsLoggedIn)
  //     if (myIsLoggedIn && Object.keys(userInfo).length === 0 ) {
  //       try {
  //         const value = AsyncStorage.getItem("userInfo");
      
  //         if (value !== null) {
  //           setUserInfo(JSON.parse(value));
  //         }
  //       } catch (e) {
  //         alert('Failed to fetch userInfo from storage');
  //       }
  //     }
  // })};

  const refreshLoggedIn = () => {
    setIsLoading(true)
    isLoggedIn().then((val) => {
      setMyIsLoggedIn(val)
      console.log(`EEEEE ${val}`)
      if (val) {
        refreshCache();
      }
      console.log(`refreshLog ${myIsLoggedIn}`)
    })
    setIsLoading(false)
  }


  useEffect(() => {
    console.log("updating*******1")
    if (!myIsLoggedIn) {
      refreshLoggedIn();
    }
  },[]);

  const refreshCache = () => {
    setIsLoading(true)
    var x = fetchUserInfo();
    var y = fetchCartContent();    
    setIsLoading(false)
  }

  // const addToCart = (id) => {
  // axiosInstance.post(`/cart/item/${id}`).then( (response) => {

  // )}


  return (
    <AuthContext.Provider
      value={{
        isLoading,
        myIsLoggedIn,
        userInfo,
        splashLoading,
        refreshCache,
        register,
        login,
        logout,
        cartContent,
        cartBadge,
        fetchCartContent
        // addToCart
      }}>
      {children}
    </AuthContext.Provider>
  );
};