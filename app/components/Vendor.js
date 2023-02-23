import * as React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Chip } from 'react-native-paper';

/**
 * Card for a vendor on the home page.
 * @param {*} props vendor item which is to be displayed.
 * @returns VendorCard
 */
export const Vendor = (props) => {

    const on_press = () => {
        props.navigation.navigate('VendorScreen', {vendor:props.item})
    }
    return(
    <Card accessibilityValue={"vendor-card"} style={{marginBottom:30, marginHorizontal:25}} onPress={on_press}>
        <Card.Cover source={{ uri: props.image}} />
        <Card.Content>
            <Title testID='vendorTitle' style={{marginTop:7}}>{props.name}</Title>
            <Paragraph>{props.description}</Paragraph>
        </Card.Content>
    </Card>
    )
}