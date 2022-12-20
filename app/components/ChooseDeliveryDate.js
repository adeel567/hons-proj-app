import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Paragraph} from 'react-native-paper';
import { Alert, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { axiosInstance } from '../api';
import { AuthContext } from '../context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';


export const ChooseDeliveryDate = () => {
    const navigation = useNavigation();
    const {setCartDeliveryDate} = React.useContext(AuthContext);
    return (
        <View>
         <DateTimePicker onChange={setCartDeliveryDate} value={new Date()} mode="date" />
        </View>
    )
  
  }