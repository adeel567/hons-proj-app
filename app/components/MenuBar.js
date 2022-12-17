import { Icon } from '@rneui/base';
import * as React from 'react';
import { TextInput } from 'react-native';
import { View } from 'react-native';
import { Menu, Divider, Modal, Dialog, Portal, Text, Button, Provider, ToggleButton, IconButton, MaterialIcons, Searchbar} from 'react-native-paper';


export const MenuBar = (props) => {
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
                placeholder='Search for menu items.' 
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
          <Menu.Item icon={"sort-alphabetical-ascending-variant"} onPress={() => {props.setSortVal("name-asc"), hideSort()}} title="Name (asc)" />
          <Menu.Item icon={"sort-alphabetical-descending-variant"} onPress={() => {props.setSortVal("name-desc"), hideSort()}} title="Name (desc)" />
          <Divider/>
          <Menu.Item icon={"sort-numeric-ascending-variant"} onPress={() => {props.setSortVal("price-asc"), hideSort()}} title="Price (asc)" />
          <Menu.Item icon={"sort-numeric-descending-variant"} onPress={() => {props.setSortVal("price-desc"), hideSort()}} title="Price (desc)" />

        </Menu>
      </View>
        </View>
    )
}