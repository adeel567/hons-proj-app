import React, { useContext } from 'react';
import { Button, Card, Divider, IconButton, Paragraph, Provider, Subheading, Title } from 'react-native-paper';
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
            <View style={{marginBottom:15}}>
            </View>

            }
            data={cartContent.items}
            ListEmptyComponent = {noResults}
            renderItem = {({ item }) => {
            return (
                <View style={{marginHorizontal:25, marginVertical:10}}>
                    <Card style={{borderRadius:10}}>
                        <Card.Title title={item.name} subtitle={"Sold by " + item.restaurant_name}/>
                        <Card.Content style={{alignItems:"flex-end"}}>
                            <Paragraph>£{Number(((item.pence)/100)).toFixed(2)}</Paragraph>
                        </Card.Content>
                        <Card.Actions style={{marginTop:-39}}>
                            <AddToCartButton id={item.id}>Add another</AddToCartButton>
                            <RemoveFromCartButton id={item.id}>Remove</RemoveFromCartButton>
                        </Card.Actions>
                    </Card>
                </View>
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
                    return (
                    <View>
                        <CartFooter 
                        deliveryDate={cartDeliveryDate} 
                        deliveryLocation={cartDeliveryLocation}
                        // setDeliveryLocation={setDeliveryLocation} 
                        showDatePickerSingle={showDatePickerSingle}
                        setShowDatePickerSingle={setShowDatePickerSingle}/>
                    </View>
                    )
                }
            }}



           />
           </View>
            )
        }
