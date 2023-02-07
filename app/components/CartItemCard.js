import React from 'react';
import { ActivityIndicator, Button, Card, Divider, IconButton, Modal, Paragraph, Portal, Provider, Subheading, Text, Title } from 'react-native-paper';
import { Alert, FlatList, RefreshControl, View } from 'react-native';
import { AddToCartButton } from '../components/AddToCartButton';
import { RemoveFromCartButton } from '../components/RemoveFromCartButton';

/**
 * Card for each item in the cart.
 * Each card can be tapped to open a modal, and have actions to add/remove from cart.
 * @param {*} props 
 * @returns 
 */
export const CartItemCard = (props) => {
    const item = props.item;
    const navigation = props.navigation;
    const openModal = props.openModal;

    return (
        <View style={{ marginHorizontal: 25, marginVertical: 10 }}>
            <Card style={{ borderRadius: 10 }} onPress={() => { openModal(item.id) }}>
                <Card.Title title={item.name} subtitle={"Sold by " + item.restaurant_name} />
                <Card.Content style={{ alignItems: "flex-end" }}>
                    <Paragraph>£{Number(((item.pence) / 100)).toFixed(2)}</Paragraph>
                </Card.Content>
                <Card.Actions style={{ marginTop: -39 }}>
                    <AddToCartButton navigation={navigation} id={item.id}>Add another</AddToCartButton>
                    <RemoveFromCartButton navigation={navigation} id={item.id}>Remove</RemoveFromCartButton>
                </Card.Actions>
            </Card>
        </View>
    )
}