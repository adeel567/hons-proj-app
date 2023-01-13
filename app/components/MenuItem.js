import { ListItemSubtitle } from '@rneui/base/dist/ListItem/ListItem.Subtitle';
import * as React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Subheading } from 'react-native-paper';
import { BASE_URL } from '../api';
import { AddToCartButton } from './AddToCartButton';
import { RemoveFromCartButton } from './RemoveFromCartButton';


export const MenuItem = (props) => {

    const hideModal = () => {
        props.setVisible(false)
    }

    return(
    <Card style={{marginBottom:30, marginHorizontal:25}}>
        <Card.Cover source={{ uri: BASE_URL.concat(props.item.image)}} />
        <Card.Content>
            <Title style={{marginTop:7}}>{props.item.name}</Title>
            <Paragraph>{props.item.description}</Paragraph>
            <Subheading>£{Number(((props.item.pence)/100)).toFixed(2)}</Subheading>
        </Card.Content>
        {(!(props.cart)) ?
        <Card.Actions style={{alignSelf: "center"}} >
            <AddToCartButton function={hideModal} color="goldenrod" id={props.item.id} navigation={props.navigation}>Add to cart</AddToCartButton>
        </Card.Actions>
        :
        <Card.Actions style={{alignSelf: "center"}}>
            <AddToCartButton function={hideModal} id={props.item.id} navigation={props.navigation}>Add another</AddToCartButton>
            <RemoveFromCartButton function={hideModal} id={props.item.id} navigation={props.navigation}>Remove</RemoveFromCartButton>
        </Card.Actions>
        }
    </Card>
    )
}