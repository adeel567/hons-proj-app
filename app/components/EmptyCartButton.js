import React, { useContext } from 'react';
import { Button } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { axiosInstance } from '../api';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';

/**
 * Empties the entire cart and tells context to refresh
 * @param {*} props 
 * @returns 
 */
export const EmptyCartButton = (props) => {
    const {fetchCartContent, setCartDeliveryLocation, setCartDeliveryDate} = React.useContext(AuthContext)
    const [isLoading, setIsLoading] = React.useState(false);

    const emptyCall = () => {
        Alert.alert("Empty Cart", "Are you sure you want to empty the cart?",
        [
            {text: "Confirm", onPress:emptyCall2},
            {text: "Cancel"}
        ]
        )
    }

    const emptyCall2 = () => {
        setIsLoading(true)
        axiosInstance.delete(`/cart`)
        .then((response) => {
            setCartDeliveryLocation()
            setCartDeliveryDate()
            setIsLoading(false)
            fetchCartContent()
            if (response.status = 200) {
                Alert.alert('Empty Cart', response.data.res, [
                    { text: 'OK'},
                ]);            }
        })
        .catch((error) => {
            setIsLoading(false)
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
        // isLoading ?
        // <ActivityIndicator animating={true}/>
        // :
        <Button {...props} loading={isLoading} color="red"  mode={"elevated"} icon={"delete"} onPress={emptyCall}>{props.children}</Button>
    )
}