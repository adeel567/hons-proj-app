import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title, Headline, Divider} from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {Vendors} from '../components/Vendors.js'

export const HomeScreen = ({navigation}) => {
    const {userInfo} = useContext(AuthContext);


    return(
        <SafeAreaView>
            <View style={style.container}>
                <Title style={style.titty}>Hello {userInfo.first_name}.</Title>
                <Headline style={style.titty}>What would you like</Headline>
                <Headline style={style.titty}>to order for lunch today?</Headline>
            </View>
            {/* <Title style={style.subheading}>Restaurants.</Title> */}
            <Vendors navigation={navigation}/>
            

        </SafeAreaView>
    )
}

export const style = StyleSheet.create({
    container: {
        marginHorizontal:25,
        marginVertical:25
    },
    titty: {
        fontSize:32,
        marginBottom:5
    },
    subheading: {
        marginHorizontal:25,
        marginBottom:5
    }
})