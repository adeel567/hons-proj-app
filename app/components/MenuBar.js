import * as React from 'react';
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
                accessibilityValue={"search-bar"}
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
          anchor={<IconButton testID='sortIcon' onPress={showSort} icon="sort" size={30} color="dimgrey" />}>
          <Menu.Item testID='sortNameAsc' icon={"sort-alphabetical-ascending"} onPress={() => {props.setSortVal("name-asc"), hideSort()}} title="Name (asc)" />
          <Menu.Item testID='sortNameDesc' icon={"sort-alphabetical-descending"} onPress={() => {props.setSortVal("name-desc"), hideSort()}} title="Name (desc)" />
          <Divider/>
          <Menu.Item testID='sortPriceAsc' icon={"sort-numeric-ascending"} onPress={() => {props.setSortVal("price-asc"), hideSort()}} title="Price (asc)" />
          <Menu.Item testID='sortPriceDesc'icon={"sort-numeric-descending"} onPress={() => {props.setSortVal("price-desc"), hideSort()}} title="Price (desc)" />

        </Menu>
      </View>
        </View>
    )
}