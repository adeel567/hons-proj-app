import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Paragraph, IconButton, Provider} from 'react-native-paper';
import { EmptyCartButton } from './EmptyCartButton';
import { AuthContext } from '../context/AuthContext';
import { View } from 'react-native';
import DatePicker from 'react-native-neat-date-picker'
import { SubmitOrderButton } from './SubmitOrderButton';


export const CartFooter = (props) => {
    const {cartContent} = React.useContext(AuthContext)
    const navigation = useNavigation();
    const openDatePickerSingle = () => props.setShowDatePickerSingle(true)

    const goToCheckout1 = () => { 
        navigation.navigate('Choose Delivery Location');
    }

    const doOnSubmitOrder = () => {
        props.submitOrder()
    }





    return(
        <View>

            <Card>
                <Card.Content>
                    <Paragraph>Subtotal: {cartContent.subtotal_pence}</Paragraph>
                    <Paragraph>Delivery Cost: {cartContent.delivery_cost_pence}</Paragraph>
                    <Paragraph>Total: {cartContent.total_pence}</Paragraph>

                </Card.Content>
            </Card>

            <Card style={{marginVertical:25, marginHorizontal:0}}
                        onPress={goToCheckout1}>
                <Card.Title
                    title="Delivery Location"
                    subtitle= {props.deliveryLocation ? "Valid delivery location set" : "Tap to set delivery location."}
                    right={(props) => <IconButton {...props} icon="chevron-right"/>}
                    />
            </Card>

            <Card style={{marginVertical:25, marginHorizontal:0}}
            onPress={openDatePickerSingle}
                >
                <Card.Title
                    title={"Delivery Date"} 
                    subtitle= {props.deliveryDate ? props.deliveryDate : "Tap to set delivery date."}
                    right={(props) => <IconButton {...props} icon="chevron-right"/>}
                    />
            </Card>

            <SubmitOrderButton>Submit Order</SubmitOrderButton>
            <EmptyCartButton >Empty Cart</EmptyCartButton>


            
        </View>
    )

}