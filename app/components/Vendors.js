import * as React from 'react';
import { Alert, RefreshControl, View } from 'react-native';
import { ActivityIndicator, HelperText, TextInput, Title } from 'react-native-paper';
import { FlatList } from 'react-native';
import { Vendor } from './Vendor';
import { HomeHeader } from './HomeHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { axiosInstance, BASE_URL } from '../api';
import {filter, orderBy}  from 'lodash';


export const Vendors = (props) => {
    const [vendors, setVendors] = React.useState([])
    const [fullVendors, setFullVendors] = React.useState([])
    const [loading, setLoading] = React.useState("false");
    const [refresh, setRefresh] = React.useState(false)
    const [sortVal, setSortVal] = React.useState("name-asc")
    const [query, setQuery] = React.useState("");

    const loadVendorData = () => {
        setLoading(true)

        axiosInstance.get("/restaurants")
        .then((response) => {
            setFullVendors(response.data)
            setVendors(doSort(response.data)) //default on render
        })
        .catch(e => {
            console.log(e)
            Alert.alert('An error occurred :(', "Issue connecting to ILP API, please try again later.", [
                { 
                    text: 'Try Again',
                    onPress: () => loadVendorData(),
                },
                { text: 'OK'},
            ]);
            })
        .finally(()=> {setLoading(false)})

    }

    React.useEffect( () => {
        loadVendorData();
    },[])

    React.useEffect( () => {
        setVendors(doSort(vendors));
    },[sortVal])

    const doSort = (data) => {
        switch(sortVal) {
            case "name-asc":
                var dd = (orderBy(data, ['name'],['asc']))
                return dd
            case "name-desc":
                var dd = (orderBy(data, ['name'],['desc']))
                return dd
        }
    }


    const doSearch = (query) => {
        setQuery(query)
        const query_formatted = query.toLowerCase();
        var filtered_data = fullVendors.filter(vendor => {
            return(vendor.name.toLowerCase().includes(query_formatted) ||
            vendor.description.toLowerCase().includes(query_formatted))
        })
        filtered_data = doSort(filtered_data);
        setVendors(filtered_data);
    }

    if (loading) {
        return (<ActivityIndicator animating={true}/>)
    }

    const noResults = () => {
        return (<Title style={{alignSelf:"center"}}>No results found!</Title>)
    }

    return(
        <FlatList 
            style={{
                // marginBottom:150,
            }}
            ListHeaderComponent={<HomeHeader sortVal={sortVal} setSortVal={setSortVal} setQuery={setQuery} query={query} onChange={doSearch} />}
            data={vendors}
            ListEmptyComponent = {noResults}
            renderItem = {({ item }) => {
               return (
                <Vendor navigation={props.navigation} item={item} name={item.name} description={item.description} image={BASE_URL.concat(item.image)}/>
               ) 
            }}
            keyExtractor={item => item.id}
            refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={loadVendorData} />
              }
            />
        )
}