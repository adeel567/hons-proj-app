import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Button,
  Card,
  TextInput,
  Title,
} from "react-native-paper";
import { View, StyleSheet, Alert } from "react-native";
import { axiosInstance } from "../api";
import { setAuthTokens } from "react-native-axios-jwt";
import { NonEmptyTextField } from "../components/NonEmptyTextField";
import { PasswordField } from "../components/PasswordField";
import { AuthContext } from "../context/AuthContext";

/**
 * The screen for logging into the app.
 * Will use the AuthContext to do the login itself.
 * @param {*} props navigation prop,
 * @returns login view.
 */
export const LoginScreen = (props) => {
  const navigation = props.navigation;

  const register = () => navigation.navigate("Register");
  const on_forgot = () => navigation.navigate("Reset Password");

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { isLoading, login } = useContext(AuthContext);

  //Does some local validation before calling the login function of the auth context.
  const login_local = () => {
    if (username.length == 0 || password.length == 0) {
      Alert.alert("Login Error", "username and password cannot be empty", [
        { text: "OK" },
      ]);
    } else {
      login(username, password);
    }
  };

  return (
    <View style={style.supercontainer}>
      <View style={style.container}>
        <Title style={style.title}>Welcome back, please login.</Title>
        <NonEmptyTextField
          id="Username"
          label={"Username"}
          text={username}
          setText={setUsername}
        />
        <PasswordField
          id="Password"
          password={password}
          setPassword={setPassword}
        />
        <View style={style.buttons}>
          <Button loading={isLoading} onPress={login_local} mode="contained">
            Login
          </Button>
          <Button onPress={register}>New here? Register</Button>
          <View style={style.forgot}>
            <Button mode="text" compact="true" onPress={on_forgot}>
              Forgot?
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};
export const style = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  supercontainer: {
    flex: 1,
    justifyContent: "center",
  },
  forgot: {
    alignItems: "flex-start",
  },
  title: {
    marginBottom: 15,
  },
});
