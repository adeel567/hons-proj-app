import { Icon } from '@rneui/base';
import * as React from 'react';
import { TextInput } from 'react-native';
import { View } from 'react-native';
import { Menu, Divider, Modal, Dialog, Portal, Text, Button, Provider, ToggleButton, IconButton, MaterialIcons, Searchbar} from 'react-native-paper';


export const HomeHeader = (props) => {
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
                placeholder='Search for restaurants.' 
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
          <Divider />
          <Menu.Item icon={"sort-alphabetical-descending-variant"} onPress={() => {props.setSortVal("name-desc"), hideSort()}} title="Name (desc)" />
        </Menu>
      </View>
        </View>
    )
}