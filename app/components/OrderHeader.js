import { Icon } from '@rneui/base';
import * as React from 'react';
import { TextInput } from 'react-native';
import { View } from 'react-native';
import { Menu, Divider, Modal, Dialog, Portal, Text, Button, Provider, ToggleButton, IconButton, MaterialIcons, Searchbar} from 'react-native-paper';


export const OrderHeader = (props) => {
    const [visible, setVisible] = React.useState(false);
    const showSort = () => setVisible(true);
    const hideSort = () => setVisible(false);

    const [visible2, setVisible2] = React.useState(false);
    const showFilter = () => setVisible2(true);
    const hideFilter = () => setVisible2(false);

    return (
      <View
        style={{marginHorizontal:25}}
        >
        <View
        style={{
            flexDirection:"row",
            marginHorizontal: 45,
            marginTop:25,
            marginBottom:5,
            alignSelf:"center", 
            alignItems:"center"           
        }}>
            <Searchbar
                style={{
                    borderRadius: 10,
                }}
                placeholder='Search for orders.' 
                onChangeText={queryText => props.onChange(queryText)}
                value = {props.query}/>

      <View
        style={{
            marginLeft: 5,
            marginRight:-5,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Menu
          visible={visible}
          onDismiss={hideSort}
          anchor={<IconButton onPress={showSort} icon="sort" size={30} color="dimgrey"/>}>
          <Menu.Item icon={"sort-numeric-ascending"} onPress={() => {props.setSortVal("ID-asc"), hideSort()}} title="Order ID (asc)" />
          <Menu.Item icon={"sort-numeric-descending"} onPress={() => {props.setSortVal("ID-desc"), hideSort()}} title="Order ID (desc)" />
          <Divider />
          <Menu.Item icon={"sort-calendar-ascending"} onPress={() => {props.setSortVal("date-asc"), hideSort()}} title="Delivery Date (asc)" />
          <Menu.Item icon={"sort-calendar-descending"} onPress={() => {props.setSortVal("date-desc"), hideSort()}} title="Delivery Date (desc)" />

        </Menu>
        </View>
        <View
        style={{marginLeft:-10, marginRight:-15}}
        >
        <Menu
          visible={visible2}
          onDismiss={hideFilter}
          anchor= {props.altered ? <IconButton onPress={showFilter} icon="filter" size={30} /> : <IconButton onPress={showFilter} icon="filter" color="dimgrey" size={30} />} 
          >
          <Menu.Item onPress={() => {props.setFilterVal("PLACED"), hideFilter()}} title="Placed" />
          <Menu.Item onPress={() => {props.setFilterVal("CONFIRMED"), hideFilter()}} title="Confirmed" />
          <Menu.Item onPress={() => {props.setFilterVal("PICKUP"), hideFilter()}} title="Pickup" />
          <Menu.Item onPress={() => {props.setFilterVal("DELIVERY"), hideFilter()}} title="Delivery (out for)" />
          <Menu.Item onPress={() => {props.setFilterVal("DELIVERED"), hideFilter()}} title="Delivered" />
          <Menu.Item onPress={() => {props.setFilterVal("CANCELLED"), hideFilter()}} title="Cancelled" />
          <Divider />
          <Menu.Item onPress={() => {props.setFilterVal("ALL"), hideFilter()}} title="All" />
        </Menu>
        </View>
        </View>
        </View>

    )
}