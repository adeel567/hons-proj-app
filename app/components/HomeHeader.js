import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { View, StyleSheet } from 'react-native';
import { Title, Headline, Divider, Menu, IconButton, Searchbar } from 'react-native-paper';

/**
 * Header 
 * @param {*} props 
 * @returns 
 */
export const HomeHeader = (props) => {
  const [visible, setVisible] = React.useState(false);
  const { userInfo } = useContext(AuthContext);
  const showSort = () => setVisible(true);
  const hideSort = () => setVisible(false);

  return (
    <View>
      <View style={style.container}>
        <Title style={style.title}>Hello {userInfo.first_name}.</Title>
        <Headline style={style.title}>What would you like</Headline>
        <Headline style={style.title}>to order for lunch today?</Headline>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 50,
          marginBottom: 15,
          alignSelf: "center",
          alignItems: "center"
        }}>
        <Searchbar
          style={{
            borderRadius: 10,
          }}
          accessibilityValue={"search-bar"}
          placeholder='Search for restaurants.'
          onChangeText={queryText => props.onChange(queryText)}
          value={props.query} />

        <View
          style={{
            marginRight: -10,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Menu
            visible={visible}
            onDismiss={hideSort}
            anchor={<IconButton  testID='sortIcon' accessibilityValue={"filter-icon-button"} onPress={showSort} icon="sort" size={30} color="dimgrey" />}>
            <Menu.Item testID='sortAsc' icon={"sort-alphabetical-ascending"} onPress={() => { props.setSortVal("name-asc"), hideSort() }} title="Name (asc)" />
            <Divider />
            <Menu.Item testID='sortDesc' icon={"sort-alphabetical-descending"} onPress={() => { props.setSortVal("name-desc"), hideSort() }} title="Name (desc)" />
          </Menu>
        </View>
      </View>
    </View>

  )
}

export const style = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    marginVertical: 25
  },
  title: {
    fontSize: 32,
    marginBottom: 5
  },
  subheading: {
    marginHorizontal: 25,
    marginBottom: 5
  }
})