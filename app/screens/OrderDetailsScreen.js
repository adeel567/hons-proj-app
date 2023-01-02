import * as React from 'react';
import { Alert } from 'react-native';
import { ActivityIndicator, Card, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { axiosInstance } from '../api';
import { DeliveryProgress } from '../components/DeliveryProgress';
import { RequestOrderCancellation } from '../components/RequestOrderCancellation';
import { AuthContext } from '../context/AuthContext';

export const OrderDetailsScreen = ({navigation,route}) => {
    var orderNo = route.params.order_id
    const [orderInfo, setOrderInfo] = React.useState();
    const [loading, setLoading] = React.useState("false");
    const {triggerOrderRefresh, setTriggerOrderRefresh} = React.useContext(AuthContext)


    const loadOrderData = () => {
        setLoading(true)

        axiosInstance.get("/orders/"+orderNo)
        .then((response) => {
            setOrderInfo(response.data)
            setLoading(false)
        })
        .catch(e => {
            console.log(e)
            setLoading(false)
            Alert.alert('An error occurred :(', "Issue connecting to ILP API, please try again later.", [
                { 
                    text: 'Try Again',
                    onPress: () => loadOrderData(),
                },
                { text: 'OK'},
            ]);
            })
        return
    }

    React.useEffect(() => {
        loadOrderData() //refresh on first load
    },[triggerOrderRefresh])

    React.useEffect( () => {
        navigation.setOptions({headerTitle: "Order #" + orderNo})
    },[orderNo])

    if (loading) {
        return (<ActivityIndicator animating={true}/>)
    }



    return (
        <SafeAreaView>
            <DeliveryProgress status={orderInfo.status} style={{marginBottom:15, marginHorizontal:10, borderRadius:10}}/>
            <Card style={{marginVertical:15, marginHorizontal:10, borderRadius:10}}>
                        <Card.Title
                            title="Order Summary"
                            subtitle="Tap to view the contents of the order."
                            right={(props) => <IconButton {...props} icon="chevron-right"/>}
                            />
                    </Card>

            {orderInfo.status === "PLACED" ?<RequestOrderCancellation id={orderNo} style={{marginVertical:15, marginHorizontal:10, borderRadius:10}}/> : <></> }
            

        </SafeAreaView>
    )
}