import React, { useContext } from 'react';
import { ActivityIndicator, Button } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { axiosInstance } from '../api';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export const SubmitOrderButton = (props) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = React.useState(false);
    const {setTriggerOrderRefresh, triggerOrderRefresh, fetchCartContent, setCartDeliveryLocation, setCartDeliveryDate, cartDeliveryLocation, cartDeliveryDate, } = React.useContext(AuthContext)

    const goToOrder = (id) => {
        setTriggerOrderRefresh(!triggerOrderRefresh)
        navigation.navigate('OrderStack', {
            screen: 'OrderDetailsScreen',
            params: {order_id: id},
            initial: false
          })
    
    }

    const submitCall = () => {
        Alert.alert("Submit Order.", "Are you sure you want to submit this order?",
        [
            {text: "Cancel"},
            {text: "Confirm", onPress: submitCall2}
        ]
        )
    }

    const submitCall2 = () => {
        if (!(cartDeliveryLocation && cartDeliveryDate)) {
            Alert.alert('Submit Order.', "A valid delivery date and location must be set before submitting an order.", [
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

        

        axiosInstance.post(`/checkout/submit`, params)
        .then((response) => {
            setCartDeliveryDate();
            setCartDeliveryLocation();
            fetchCartContent().then(setIsLoading(false))
            if (response.status = 200) {
                const id = response.data.order_number
                Alert.alert('Submit order', response.data.res, [
                    { 
                        text: 'Go To Order',
                        onPress: () => {goToOrder(id)}
                    },
                    { text: 'OK'},
                    
                ]);            
            }
        })
        .catch((error) => {
            fetchCartContent()
            setIsLoading(false)
            console.log(error)
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
        <Button {...props} loading={isLoading} style={{borderRadius:5}} color={"green"} mode={"contained"}  icon={"cart-check"} onPress={submitCall}>{props.children}</Button>
    )
}