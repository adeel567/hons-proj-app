import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Paragraph, IconButton, Provider, Divider, Text} from 'react-native-paper';
import { EmptyCartButton } from './EmptyCartButton';
import { AuthContext } from '../context/AuthContext';
import { View } from 'react-native';
import DatePicker from 'react-native-neat-date-picker'
import { SubmitOrderButton } from './SubmitOrderButton';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';



export const CartFooter = (props) => {
    const {cartContent, isLoading, cartDeliveryDate, setCartDeliveryDate} = React.useContext(AuthContext)
    const navigation = useNavigation();

    const pickLocation = () => { 
        navigation.navigate('Choose Delivery Location');
    }

    const [date, setDate] = React.useState(new Date());

    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate;
      const stringDate = currentDate.toISOString().slice(0,10);
      setDate(currentDate);
      setCartDeliveryDate(stringDate)
    };
  
    const showMode = (currentMode) => {
      DateTimePickerAndroid.open({
        value: date,
        onChange,
        mode: currentMode,
        is24Hour: true,
        minimumDate: new Date()
      });
    };
  
    const showDatepicker = () => {
      showMode('date');
    };
  

    

    return(
        <View>

            <Card style={{marginHorizontal:25, marginTop:10, borderRadius:10}}>
                <Card.Title title={"Cart Summary"}/>
                <Card.Content style={{alignItems:"flex-end"}}>
                    <Paragraph>Subtotal: £{Number(((cartContent.subtotal_pence)/100)).toFixed(2)}</Paragraph>
                    <Paragraph>Delivery Cost: £{Number(((cartContent.delivery_cost_pence)/100)).toFixed(2)}</Paragraph>
                    <Paragraph>Total: £{Number(((cartContent.total_pence)/100)).toFixed(2)}</Paragraph>

                </Card.Content>
            </Card>

            <Divider  style={{marginTop:20}}/>

            <Card style={{marginHorizontal:10, marginTop:20, marginBottom:10, borderRadius:10}}
                        onPress={pickLocation}>
                <Card.Title
                    title="Delivery Location"
                    subtitle= {props.deliveryLocation ? "Valid delivery location set" : "Tap to set delivery location."}
                    right={(props) => <IconButton {...props} icon="chevron-right"/>}
                    />
            </Card>

            <Card style={{marginHorizontal:10, marginTop:10, marginBottom:20, borderRadius:10}}
            onPress={showDatepicker}
                >
                <Card.Title
                    title={"Delivery Date"} 
                    subtitle= {props.deliveryDate ? "Set to: " + props.deliveryDate : "Tap to set delivery date."}
                    right={(props) => <IconButton {...props} icon="chevron-right"/>}
                    />
            </Card>

            <View style={{marginHorizontal:50, height:100, justifyContent:"space-around"}}>
                <SubmitOrderButton>Submit Order</SubmitOrderButton>
                <EmptyCartButton>Empty Cart</EmptyCartButton>
            </View>            
        </View>
    )

}