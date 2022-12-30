import { Icon } from '@rneui/base';
import * as React from 'react';
import { TextInput } from 'react-native';
import { View } from 'react-native';
import { Menu, Divider, Modal, Dialog, Portal, Text, Button, Provider, ToggleButton, IconButton, MaterialIcons, Searchbar} from 'react-native-paper';


export const OrderHeader = (props) => {
    const [visible, setVisible] = React.useState(false);
    const showSort = () => setVisible(true);
    const hideSort = () => setVisible(false);

    return (
        <View
        style={{
            flexDirection:"row",
            marginHorizontal: 50,
            marginBottom:15,
            alignSelf:"center", 
            alignItems:"center"           
        }}>
            <Searchbar
                style={{
                    borderRadius: 10,
                }}
                placeholder='Search for orders by ID or date.' 
                onChangeText={queryText => props.onChange(queryText)}
                value = {props.query}/>

      <View
        style={{
            marginRight:-10,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Menu
          visible={visible}
          onDismiss={hideSort}
          anchor={<IconButton onPress={showSort} icon="sort" size={30}/>}>
          <Menu.Item icon={"sort-numeric-ascending-variant"} onPress={() => {props.setSortVal("ID-asc"), hideSort()}} title="Order ID (asc)" />
          <Menu.Item icon={"sort-numeric-descending-variant"} onPress={() => {props.setSortVal("ID-desc"), hideSort()}} title="Order ID (desc)" />
          <Divider />
          <Menu.Item icon={"sort-calendar-ascending-variant"} onPress={() => {props.setSortVal("date-asc"), hideSort()}} title="Delivery Date (asc)" />
          <Menu.Item icon={"sort-calendar-descending-variant"} onPress={() => {props.setSortVal("date-desc"), hideSort()}} title="Delivery Date (desc)" />

        </Menu>
      </View>
        </View>
    )
}