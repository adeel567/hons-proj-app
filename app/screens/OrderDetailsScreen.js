import * as React from 'react';
import { Alert, RefreshControl, ScrollView, View } from 'react-native';
import { ActivityIndicator, Card, IconButton, Paragraph } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { axiosInstance } from '../api';
import { DeliveryProgress } from '../components/DeliveryProgress';
import { RequestOrderCancellation } from '../components/RequestOrderCancellation';
import { AuthContext } from '../context/AuthContext';
import {filter, orderBy, uniq, map}  from 'lodash';
import MapView, { Marker } from 'react-native-maps';


export const OrderDetailsScreen = ({navigation,route}) => {
    var orderNo = route.params.order_id
    const [orderInfo, setOrderInfo] = React.useState();
    const [loading, setLoading] = React.useState("false");
    const {triggerOrderRefresh, setTriggerOrderRefresh} = React.useContext(AuthContext)
    const [refreshing, setRefreshing] = React.useState(false);


    const loadOrderData = () => {
        setLoading(true)

        axiosInstance.get("/orders/"+orderNo)
        .then((response) => {
            setOrderInfo(response.data)
            setLoading(false)
            console.log(response.data)
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

    const restaurant_names = () => { //get the unique names of restaurants from the items
        var x = (uniq((map(orderInfo.items,'restaurant_name'))))
        if (x.length == 2) {
            return x[0] + " & " + x[1]
        } else {
            return x[0]
        }
    }

    const navigate_livetrack = () => {
        navigation.navigate("Live Track", {orderNo:orderNo})
    }


    return (
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadOrderData}/>}>
            <DeliveryProgress title={"Status"} status={orderInfo.status} style={{marginTop:20, marginBottom:10, marginHorizontal:10, borderRadius:10}}/>

            {orderInfo.trackable ?
                <Card 
                    onPress={navigate_livetrack}
                    style={{marginVertical:10, marginHorizontal:10, borderRadius:10}}>
                        <Card.Title
                            title="Live Track"
                            subtitle="Tap to view delivery location and live tracking."
                            right={(props) => <IconButton {...props} icon="chevron-right"/>}
                            />
                </Card>
                :
                <Card 
                    onPress={navigate_livetrack}
                    style={{marginVertical:10, marginHorizontal:10, borderRadius:10}}>
                        <Card.Title
                            title="Delivery Location"
                            subtitle="Tap to view delivery location."
                            right={(props) => <IconButton {...props} icon="chevron-right"/>}
                            />
                </Card>
            }

            <Card style={{marginVertical:10, marginHorizontal:10, borderRadius:10}}>
                <Card.Title  title="Overview"/>
                <Card.Content>
                    <Paragraph>From: {restaurant_names()}</Paragraph>
                    <Paragraph>Delivery Date: {orderInfo.delivery_date}</Paragraph>
                    <Paragraph>Subtotal: £{Number(((orderInfo.subtotal_pence)/100)).toFixed(2)}</Paragraph>
                    <Paragraph>Delivery Cost: £{Number(((orderInfo.delivery_pence)/100)).toFixed(2)}</Paragraph>
                    <Paragraph>Total: £{Number(((orderInfo.total_pence)/100)).toFixed(2)}</Paragraph>

                </Card.Content>
            </Card>


            <Card style={{marginVertical:10, marginHorizontal:10, borderRadius:10}}>
                    <Card.Title
                        title="Contents"
                        subtitle="Tap to view the contents of the order."
                        right={(props) => <IconButton {...props} icon="chevron-right"/>}
                        />
                    </Card>
            




            {orderInfo.status === "PLACED" ?<RequestOrderCancellation id={orderNo} style={{marginVertical:15, marginHorizontal:10, borderRadius:10}}/> : <></> }
            
        </ScrollView>
    )
}