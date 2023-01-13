import * as React from 'react';
import { Alert, RefreshControl, ScrollView, View } from 'react-native';
import { ActivityIndicator, Card, Divider, IconButton, List, Paragraph, Text } from 'react-native-paper';
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
    },[triggerOrderRefresh,route])

    React.useEffect( () => {
        navigation.setOptions({headerTitle: "Order #" + orderNo})
    },[orderNo])

    if (loading) {
        return (<ActivityIndicator animating={true}/>)
    }

    const navigate_livetrack = () => {
        navigation.navigate("Live Track", {orderNo:orderNo, orderInfo: orderInfo})
    }

    return (
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadOrderData}/>}>
            <DeliveryProgress title={"Status"} status={orderInfo.status} delivery_date={orderInfo.delivery_date} style={{marginTop:20, marginBottom:10, marginHorizontal:10, borderRadius:10}}/>

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
                    <Card.Title
                        title="Contents"
                        />
                    <Card.Content style={{marginBottom:10, marginTop:-15}}>
                        {
                            orderInfo.items.map( (item,index) => {
                                return(
                                    <List.Item
                                        key={index}
                                        style={{marginLeft:-10}}
                                        title = {item.name}
                                        description = {"Sold by " + item.restaurant_name}
                                        descriptionStyle = {{fontSize:12}}
                                        right= {props => <Text style={{marginTop:8}}>{"£" + Number(((item.pence)/100)).toFixed(2)}</Text>}
                                        />
                                )
                            }
                            )
                        }
                        <Divider/>
                        <List.Item
                            style={{marginBottom:-20,marginLeft:-10}}
                            title = "Subtotal:"
                            right= {props => <Text style={{marginTop:8}}>{"£" + Number(((orderInfo.subtotal_pence)/100)).toFixed(2)}</Text>}
                            />
                        <List.Item
                            style={{marginBottom:-20,marginLeft:-10}}
                            title = "Delivery cost:"
                            right= {props => <Text style={{marginTop:8}}>{"£" + Number(((orderInfo.delivery_pence)/100)).toFixed(2)}</Text>}
                            />
                        <List.Item
                            style={{marginBottom:-20,marginLeft:-10}}
                            title = "Total:"
                            right= {props => <Text style={{marginTop:8}}>{"£" + Number(((orderInfo.total_pence)/100)).toFixed(2)}</Text>}
                            />

                    </Card.Content>
                    </Card>
            




            {orderInfo.status === "PLACED" ?<RequestOrderCancellation id={orderNo} style={{marginVertical:15, marginHorizontal:10, borderRadius:10}}/> : <></> }
            
        </ScrollView>
    )
}