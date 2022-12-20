import React, { useContext } from 'react';
import { Button, Card, IconButton, Paragraph, Provider, Subheading, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { axiosInstance } from '../api';
import { Alert, FlatList, RefreshControl, View } from 'react-native';
import { AddToCartButton } from '../components/AddToCartButton';
import { RemoveFromCartButton } from '../components/RemoveFromCartButton';
import { EmptyCartButton } from '../components/EmptyCartButton';
import { BASE_URL } from '../api';
import { MenuItem } from '../components/MenuItem';
import { CartFooter } from '../components/CartFooter';
import DatePicker from 'react-native-neat-date-picker';

export const CartScreen = () => {
    const {cartContent, fetchCartContent, isLoading, cartDeliveryLocation, cartDeliveryDate, setCartDeliveryLocation, setCartDeliveryDate} = React.useContext(AuthContext)
    // const [deliveryLocation, setDeliveryLocation] = React.useState() //use context state instead
    // const [deliveryDate, setDeliveryDate] = React.useState()

    const [showDatePickerSingle, setShowDatePickerSingle] = React.useState(false)

    React.useEffect(() => {
        fetchCartContent() //refresh on first load
    },[])

    const onCancelSingle = () => {
        setShowDatePickerSingle(false)
      }
    
    const onConfirmSingle = (output) => {
        setShowDatePickerSingle(false)
        setCartDeliveryDate(output.dateString)
      }


    const noResults = () => {
        return (
            <View style={{padding:25}}>
                 <Title style={{alignSelf:"center"}}>No items in cart.</Title>
                 <Subheading style={{alignSelf:"center"}}>Time to do some shopping :D</Subheading>
            </View>
        )
    }

    if (isLoading) {
        return (<ActivityIndicator style={{padding:25}} animating={true}/>)
    }

    return (
        <View>
            <DatePicker
                    isVisible={showDatePickerSingle}
                    mode={'single'}
                    onCancel={onCancelSingle}
                    onConfirm={onConfirmSingle}
                    minDate={new Date()}
                />
        <FlatList 
            ListHeaderComponent=
            {
            <View>
            </View>

            }
            data={cartContent.items}
            ListEmptyComponent = {noResults}
            renderItem = {({ item }) => {
            return (
                <Card>
                    <Card.Content>
                    <Card.Title title={item.name}/>
                    <AddToCartButton id={item.id}>Add another</AddToCartButton>
                    <RemoveFromCartButton id={item.id}>Remove from Cart</RemoveFromCartButton>

                    </Card.Content>
                </Card>
            ) 
            }}
            keyExtractor={(item, index) => index}
            refreshControl={
                <RefreshControl  refreshing={false} onRefresh={fetchCartContent} />
            }
            ListFooterComponent= { () => {
                if (cartContent.items.length <=0) {
                    return (<View/>)
                } else {
                    return (<CartFooter 
                        deliveryDate={cartDeliveryDate} 
                        deliveryLocation={cartDeliveryLocation}
                        // setDeliveryLocation={setDeliveryLocation} 
                        showDatePickerSingle={showDatePickerSingle}
                        setShowDatePickerSingle={setShowDatePickerSingle}/>)
                }
            }}



           />
           </View>
            )
        }
