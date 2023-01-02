import { ListItemSubtitle } from '@rneui/base/dist/ListItem/ListItem.Subtitle';
import * as React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Subheading } from 'react-native-paper';
import { AddToCartButton } from './AddToCartButton';

export const MenuItem = (props) => {
    return(
    <Card style={{marginBottom:30, marginHorizontal:25}}>
        <Card.Cover source={{ uri: props.image}} />
        <Card.Content>
            <Title style={{marginTop:7}}>{props.item.name}</Title>
            <Paragraph>{props.item.description}</Paragraph>
            <Subheading>£{Number(((props.item.pence)/100)).toFixed(2)}</Subheading>
        </Card.Content>
        <Card.Actions style={{alignSelf: "center"}}>
            <AddToCartButton color="goldenrod" navigation={props.navigation} id={props.item.id}>Add to cart</AddToCartButton>
        </Card.Actions>
    </Card>
    )
}