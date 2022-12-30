import React, { useContext } from 'react';
import { Button, Card, IconButton, Paragraph, Provider, Subheading, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { axiosInstance } from '../api';
import { Alert, FlatList, RefreshControl, View } from 'react-native';
import { AddToCartButton } from '../components/AddToCartButton';
import { RemoveFromCartButton } from '../components/RemoveFromCartButton';
import { EmptyCartButton } from '../components/EmptyCartButton';
import { BASE_URL } from '../api';
import { MenuItem } from '../components/MenuItem';
import { CartFooter } from '../components/CartFooter';
import DatePicker from 'react-native-neat-date-picker';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


export const OrdersScreen = () => {
    const navigation = useNavigation();
    const [orders, setOrders] = React.useState([])
    const [fullOrders, setFullOrders] = React.useState([])
    const [loading, setLoading] = React.useState("false");
    const [refresh, setRefresh] = React.useState(false)
    const [sortVal, setSortVal] = React.useState("date-desc")
    // const [query, setQuery] = React.useState("");


    const loadOrderData = () => {
        setLoading(true)

        axiosInstance.get("/orders")
        .then((response) => {
            setOrders(response.data)
            setFullOrders(response.data)
            // setOrders(doSort(response.data)) //default on render
            setLoading(false)
            // console.log(orders[1])
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
    },[])


    const noResults = () => {
        return (
            <View style={{padding:25}}>
                 <Title style={{alignSelf:"center"}}>No existing orders.</Title>
                 <Subheading style={{alignSelf:"center"}}>Time to do some shopping :D</Subheading>
            </View>
        )
    }

    if (loading) {
        return (<ActivityIndicator style={{padding:25}} animating={true}/>)
    }

    return (
        <FlatList 
            data={orders}
            ListEmptyComponent = {noResults}
            renderItem = {({ item }) => {
                const on_press = () => {
                    navigation.navigate('OrderDetailsScreen', {order_id:item.id})
                }
                        return (
                <View style={{padding:25}}>
                    <Card onPress={on_press}>
                        <Card.Title title={"Order #" + item.id}/>
                        <Card.Content>
                        <Paragraph>Placed for: {item.delivery_date}</Paragraph>
                        </Card.Content>
                    </Card>
                </View>
            ) 
            }}
            keyExtractor={(item) => item.id}
            refreshControl={
                <RefreshControl  refreshing={false} onRefresh={loadOrderData} />
            }
           />
            )
        }
