import React, { useContext } from 'react';
import { Button, Card, IconButton, Paragraph, Provider, Subheading, Title } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { axiosInstance } from '../api';
import { Alert, FlatList, RefreshControl, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { OrderHeader } from '../components/OrderHeader';
import {filter, orderBy, uniq, map}  from 'lodash';
import { useFocusEffect } from '@react-navigation/native';
import { OrderCard } from '../components/OrderCard';

/**
 * View for viewing all the orders that have been placed.
 * Grabs the orders from the API.
 * Has no props.
 */
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
        })
        .catch(e => {
            console.log(e)
            Alert.alert('An error occurred :(', "Issue connecting to ILP API, please try again later.", [
                { 
                    text: 'Try Again',
                    onPress: () => loadOrderData(),
                },
                { text: 'OK'},
            ]);
            })
        .finally(()=> {setLoading(false)})
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

    //Does search on local copy, by searching the #ID and date.
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

    //return when there are no orders, either none placed or a bad search term.
    const noResults = () => {
        return (
            <View style={{padding:25}}>
                 <Title style={{alignSelf:"center"}}>No existing orders found.</Title>
                 <Subheading style={{alignSelf:"center"}}>Time to do some shopping :D</Subheading>
            </View>
        )
    }

    //loading indicator while async data is fetched.
    if (loading) {
        return (<ActivityIndicator style={{padding:25}} animating={true}/>)
    }

    return (
        <FlatList 
            data={orders}
            ListHeaderComponent={<OrderHeader altered={altered} sortVal={sortVal} setSortVal={setSortVal}  setFilterVal={setFilterVal} setQuery={setQuery} query={query} onChange={doSearch} />}
            ListEmptyComponent = {noResults}
            renderItem = {({ item }) => {
                return (
                <OrderCard item={item} navigation={navigation}/>
                )
            }}
            keyExtractor={(item) => item.id}
            refreshControl={
                <RefreshControl  refreshing={false} onRefresh={loadOrderData} />
            }
           />
            )
        }
