import React, { useContext } from 'react';
import { Button } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { axiosInstance } from '../api';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export const AddToCartButton = (props) => {
    const navigation = useNavigation();
    const {fetchCartContent} = React.useContext(AuthContext)

    const goToCart = () => { 
        navigation.navigate('Cart');
    }

    const addCall = () => {
        axiosInstance.post(`/cart/item/${props.id}`)
        .then((response) => {
            fetchCartContent()
            if (response.status = 200) {
                Alert.alert('Add to cart.', response.data.res, [
                    { text: "View Cart", onPress:goToCart},
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
                { text: "View Cart", onPress:goToCart},
                { text: 'OK'},
            ])
        })
    }

    return (
        <Button {...props} onPress={addCall}>{props.children}</Button>
    )
}