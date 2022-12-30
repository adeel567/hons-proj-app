import React, { useContext } from 'react';
import { ActivityIndicator, Button } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { axiosInstance } from '../api';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export const SubmitOrderButton = (props) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = React.useState(false);
    const {fetchCartContent, setCartDeliveryLocation, setCartDeliveryDate, cartDeliveryLocation, cartDeliveryDate} = React.useContext(AuthContext)

    const goToOrder = (id) => {
        navigation.navigate("Orders")
        navigation.navigate("OrderDetailsScreen", {order_id:id})

    }

    const submitCall = () => {
        if (!(cartDeliveryLocation && cartDeliveryDate)) {
            Alert.alert('Submit order', "Valid delivery date and location must be set before submitting an order", [
                { text: 'OK'},
            ]);     
            return
        }
        setIsLoading(true)
        const params = {
            "delivery_date" : cartDeliveryDate,
            "delivery_longitude" : cartDeliveryLocation.delivery_longitude,
            "delivery_latitude" : cartDeliveryLocation.delivery_latitude
        }

        

        console.log(params)
        axiosInstance.post(`/checkout/submit`, params)
        .then((response) => {
            setCartDeliveryDate();
            setCartDeliveryLocation();
            fetchCartContent().then(setIsLoading(false))
            if (response.status = 200) {
                const id = response.data.order_number
                Alert.alert('Submit order', response.data.res, [
                    { 
                        text: 'Go To Orders',
                        onPress: goToOrder(id)
                    },
                    { text: 'OK'},
                    
                ]);            
            }
        })
        .catch((error) => {
            fetchCartContent()
            setIsLoading(false)
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
        isLoading ?
        <ActivityIndicator animating={true}/>
        :
        <Button {...props} icon={"cart-check"} onPress={submitCall}>{props.children}</Button>
    )
}