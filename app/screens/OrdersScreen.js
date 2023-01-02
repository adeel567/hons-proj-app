import React, { useContext } from 'react';
import { Button, Card, IconButton, Paragraph, Provider, Subheading, Title } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { axiosInstance } from '../api';
import { Alert, FlatList, RefreshControl, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { OrderHeader } from '../components/OrderHeader';
import {filter, orderBy, uniq, map}  from 'lodash';


export const OrdersScreen = () => {
    const navigation = useNavigation();
    const [orders, setOrders] = React.useState([])
    const [fullOrders, setFullOrders] = React.useState([])
    const [loading, setLoading] = React.useState("false");
    const [refresh, setRefresh] = React.useState(false)
    const [sortVal, setSortVal] = React.useState("date-desc")
    const [filterVal, setFilterVal] = React.useState("ALL")
    const [query, setQuery] = React.useState("");
    const [altered, setAltered] = React.useState(false);
    const {triggerOrderRefresh, setTriggerOrderRefresh} = React.useContext(AuthContext)


    const loadOrderData = () => {
        setLoading(true)

        axiosInstance.get("/orders")
        .then((response) => {
            setOrders(response.data)
            setFullOrders(response.data)
            setOrders(doSort(response.data)) //default on render
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
        setOrders(doSort(orders)); //do when sort value changes
    },[sortVal])

    React.useEffect( () => {
        doFilter() //do when filter value changes
    }, [filterVal])

    const doSort = (data) => {
        switch(sortVal) {
            case "date-asc":
                var dd = (orderBy(data, ['delivery_date'],['asc']))
                return dd
            case "date-desc":
                var dd = (orderBy(data, ['delivery_date'],['desc']))
                return dd
            case "ID-asc":
                var dd = (orderBy(data, ['id'],['asc']))
                return dd
            case "ID-desc":
                var dd = (orderBy(data, ['id'],['desc']))
                return dd
    
        }
    }

    const doFilter = () => {
        var filtered_data = fullOrders;
        setAltered(false)
        if (filterVal !== "ALL") {
        filtered_data = (filter(filtered_data, {'status': filterVal}))
        setAltered(true)
        }

        filtered_data = doSort(filtered_data);
        setOrders(filtered_data)
    }


    const doSearch = (query) => {
        setQuery(query)
        const query_formatted = query.toLowerCase();
        var filtered_data = fullOrders.filter(order => {
            var ord = ("Order #"+order.id.toString()).toLowerCase()
            return(ord.includes(query_formatted) ||
            order.delivery_date.toLowerCase().includes(query_formatted))
        })
        filtered_data = doSort(filtered_data);
        setOrders(filtered_data);
    }



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
            ListHeaderComponent={<OrderHeader altered={altered} sortVal={sortVal} setSortVal={setSortVal}  setFilterVal={setFilterVal} setQuery={setQuery} query={query} onChange={doSearch} />}
            ListEmptyComponent = {noResults}
            renderItem = {({ item }) => {
                const on_press = () => {
                    navigation.navigate('OrderDetailsScreen', {order_id:item.id})
                }

                const restaurant_names = () => { //get the unique names of restaurants from the items
                    var x = (uniq((map(item.items,'restaurant_name'))))
                    if (x.length == 2) {
                        return x[0] + " & " + x[1]
                    } else {
                        return x[0]
                    }
                }

                        return (
                    <Card style={{marginVertical:10, marginHorizontal:25, borderRadius:10}} onPress={on_press}>
                        <Card.Title style={{marginBottom:-5}} title={"Order #" + item.id}/>

                        <Card.Content style={{flexDirection: "row"}}>
                        <View style={{flex:5}}>
                            <Paragraph style={{color:"dimgrey"}} >{restaurant_names()}</Paragraph>
                            <Paragraph>Delivery date: {item.delivery_date}</Paragraph>

                        </View>
                        <View style={{flex:2, alignItems: "center"}}>
                            <Paragraph style={{color:"dimgrey"}}>{item.status}</Paragraph>
                            <Paragraph>£{Number(((item.total_pence)/100)).toFixed(2)}</Paragraph>
                        </View>

                        </Card.Content>
                    </Card>
            ) 
            }}
            keyExtractor={(item) => item.id}
            refreshControl={
                <RefreshControl  refreshing={false} onRefresh={loadOrderData} />
            }
           />
            )
        }
