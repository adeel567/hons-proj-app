import * as React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Chip } from 'react-native-paper';

export const Vendor = (props) => {

    const on_press = () => {
        props.navigation.navigate('VendorScreen', {vendor:props.item})
    }
    return(
    <Card style={{marginBottom:30, marginHorizontal:25}} onPress={on_press}>
        <Card.Cover source={{ uri: props.image}} />
        {/* <Card.Title title="Card Title" subtitle="Card Subtitle" /> */}
        <Card.Content>
            <Title style={{marginTop:7}}>{props.name}</Title>
            <Paragraph>{props.description}</Paragraph>
        </Card.Content>
    </Card>
    )
}