import * as React from 'react';
import { View, FlatList, RefreshControl, KeyboardAvoidingView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MenuItem } from '../components/MenuItem';
import { axiosInstance, BASE_URL } from '../api';
import { Card, Divider, IconButton, List, Paragraph, Title, ActivityIndicator } from 'react-native-paper';
import { MenuBar } from '../components/MenuBar';
import {filter, orderBy}  from 'lodash';

export const VendorScreen = ({navigation,route}) => {
    const vendor = route.params.vendor
    const image_url = BASE_URL.concat(vendor.image);

    const [menu, setMenu] = React.useState([])
    const [fullMenu, setFullMenu] = React.useState([])
    const [loading, setLoading] = React.useState("false");
    const [refresh, setRefresh] = React.useState(false)
    const [sortVal, setSortVal] = React.useState("name-asc")
    const [query, setQuery] = React.useState("");

    const viewAbout = () => {
        navigation.navigate('About', {vendor:vendor})
    }

    const loadMenuData = () => {
        setLoading(true)

        axiosInstance.get("/menu/".concat(vendor.id))
        .then((response) => {
            setFullMenu(response.data)
            setMenu(doSort(response.data)) //default on render
            setLoading(false)
        })
        .catch(e => {
            console.log(e)
            setLoading(false)
            Alert.alert('An error occurred :(', "Issue connecting to ILP API, please try again later.", [
                { 
                    text: 'Try Again',
                    onPress: () => loadMenuData(),
                },
                { text: 'OK'},
            ]);
            })
    }

    React.useEffect( () => {
        navigation.setOptions({headerTitle: route.params.vendor.name})
        loadMenuData();
    },[])

    React.useEffect( () => {
        setMenu(doSort(menu));
    },[sortVal])

    const doSort = (data) => {
        switch(sortVal) {
            case "name-asc":
                var dd = (orderBy(data, ['name'],['asc']))
                return dd
            case "name-desc":
                var dd = (orderBy(data, ['name'],['desc']))
                return dd
            case "price-asc":
                var dd = (orderBy(data, ['pence'],['asc']))
                return dd
            case "price-desc":
                var dd = (orderBy(data, ['pence'],['desc']))
                return dd
        }
    }

    const doSearch = (query) => {
        setQuery(query)
        const query_formatted = query.toLowerCase();
        var filtered_data = fullMenu.filter(menu => {
            return(menu.name.toLowerCase().includes(query_formatted) ||
            menu.description.toLowerCase().includes(query_formatted))
        })
        filtered_data = doSort(filtered_data);
        setMenu(filtered_data);
    }

    if (loading) {
        return (<ActivityIndicator animating={true}/>)
    }

    const noResults = () => {
        return (<Title style={{alignSelf:"center"}}>No results found!</Title>)
    }

    return (
            <FlatList 
                style={{
                }}
                ListHeaderComponent=
                {

                <View>
                    <Card>
                        <Card.Cover source={{uri: image_url}}/>
                    </Card>

                    <Card style={{marginVertical:25, marginHorizontal:10, borderRadius:10}}
                        onPress={viewAbout}>
                        <Card.Title
                            title={vendor.name}
                            subtitle="Tap to view about info and location."
                            right={(props) => <IconButton {...props} icon="chevron-right"/>}
                            />
                    </Card>
                    {/* <Title style={{}}>Menu</Title> */}
                    <KeyboardAvoidingView>
                        <MenuBar sortVal={sortVal} setSortVal={setSortVal} setQuery={setQuery} query={query} onChange={doSearch} />
                    </KeyboardAvoidingView>

                </View>

                }
                data={menu}
                ListEmptyComponent = {noResults}
                renderItem = {({ item }) => {
                return (
                    <MenuItem item={item} navigation={navigation} usage={"vendor"}/>
                ) 
                }}
                keyExtractor={item => item.id}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={loadMenuData} />
                }
                /> 
    )

}