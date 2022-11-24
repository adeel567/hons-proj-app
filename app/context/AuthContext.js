import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {createContext, useEffect, useState} from 'react';
import { axiosInstance } from '../api';
import {setAuthTokens, isLoggedIn, getAccessToken, getRefreshToken, clearAuthTokens} from 'react-native-axios-jwt';
import {Alert} from 'react-native';


const BASE_URL = "http://10.69.69.253"

export const AuthContext = createContext();
export const AuthProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  const [myIsLoggedIn, setMyIsLoggedIn] = useState(false);
  const [counter, setCounter] = useState(0);

  const register = (firstname, lastname, email, password) => {
    setIsLoading(true);

    axios
      .post(`${BASE_URL}/register`, {
        firstname,
        lastname,
        email,
        password
      })
    //   .then(res => {
        
    //     let userInfo = res.data.user;
    //     setUserInfo(userInfo);
    //     AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    //     setIsLoading(false);
    //     console.log(userInfo);
    //   })
      .catch(e => {
        console.log(`register error ${e}`);
        setIsLoading(false);
      });
  };

  const login = (username, password) => {
    setIsLoading(false);

    const params = {
        "username": username,
        "password": password
    }

    axiosInstance.post("/auth/login", params).then( (response) => {
        setCounter(counter+1);
        setAuthTokens({
            accessToken: response.data.access,
            refreshToken: response.data.refresh

        })
        .then(
            axiosInstance.get("/profile").then((response) => {
                let userInfo = response.data;
                setUserInfo(userInfo);
                AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                setIsLoading(false);
              })
              .catch(e => {
                console.log(`profile error ${e}`);
                setIsLoading(false);
              })
        )
        
        console.log("PENIS LAND: " + response.data.access);

    })
    .catch(error => {
        console.log(`login error ${error}`);
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
    clearAuthTokens().then(setIsLoading(false))
    setCounter(counter-1);
  };

  const updateLoggedIn = () => {
    setSplashLoading(true)
    isLoggedIn().then( (val) => {setMyIsLoggedIn(val)})
    console.log('logged in: ' + myIsLoggedIn)
    setSplashLoading(false)
  };

  useEffect(() => {
    updateLoggedIn();
    console.log("updating*******")
  },[counter]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        myIsLoggedIn,
        userInfo,
        splashLoading,
        register,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};