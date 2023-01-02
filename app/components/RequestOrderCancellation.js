import * as React from 'react';
import { Alert } from 'react-native';
import { Button, Card, Paragraph } from 'react-native-paper';
import { axiosInstance } from '../api';
import { AuthContext } from '../context/AuthContext';


/**
 * Requests cancellation on the backend for an order in the form of a button 
 * Prompts for confirmation before making the request.
 * @param {*} props.id id of the order to cancel
 */
export const RequestOrderCancellation = (props) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const {triggerOrderRefresh, setTriggerOrderRefresh} = React.useContext(AuthContext)


    const cancelCall = () => {
        Alert.alert("Order Cancellation.", "Are you sure you want to request to cancel this order?",
        [
            {text: "Confirm", onPress: cancelCall2},
            {text: "Cancel"}
        ]
        )
    }

    const cancelCall2 = () => {
        setIsLoading(true)
        axiosInstance.delete(`/orders/${props.id}`)
        .then((response) => {
            setIsLoading(false)
            setTriggerOrderRefresh(!triggerOrderRefresh)
                        if (response.status = 200) {
                Alert.alert('Order Cancellation', response.data.res, [
                    { text: 'OK'},
                ]);            }
        })
        .catch((error) => {
            setIsLoading(false)
            console.log(error)
            var err_text = "Issue when communicating with ILP API, please try again later."
            if (error?.response?.data?.res) { 
                err_text = error.response.data.res;
            }
            Alert.alert('Order Cancellation.', err_text, [
                { text: 'OK'},
            ])
        })
    }

    return (
        <Card {...props}>
            <Card.Title title="Cancel Order"/>
            <Card.Content>
                <Button style={{marginHorizontal:50}} loading={isLoading} color="red"  mode={"contained"} icon={"close-octagon"} onPress={cancelCall}>{props.children}
                    Request Cancellation
                </Button>
            </Card.Content>
        </Card>
    )
}
