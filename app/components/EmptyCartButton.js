import React, { useContext } from 'react';
import { Button } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { axiosInstance } from '../api';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export const EmptyCartButton = (props) => {
    const {fetchCartContent} = React.useContext(AuthContext)

    const emptyCall = () => {
        axiosInstance.delete(`/cart`)
        .then((response) => {
            fetchCartContent()
            if (response.status = 200) {
                Alert.alert('Empty cart', response.data.res, [
                    { text: 'OK'},
                ]);            }
        })
        .catch((error) => {
            fetchCartContent()
            var err_text = "Issue when communicating with ILP API, please try again later."
            if (error?.response?.data?.res) { 
                err_text = error.response.data.res;
            }
            Alert.alert('Add item to cart', err_text, [
                { text: 'OK'},
            ])
        })
    }

    return (
        <Button onPress={emptyCall}>{props.children}</Button>
    )
}