import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export const OrderDetailsScreen = ({navigation,route}) => {

    React.useEffect( () => {
        navigation.setOptions({headerTitle: "Order #" + route.params.order_id})
    },[route.params.order_id])


    return (
        <SafeAreaView></SafeAreaView>
    )
}