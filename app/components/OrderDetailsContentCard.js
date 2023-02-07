import * as React from 'react';
import { Card, Divider, List, Text } from 'react-native-paper';

/**
 * Renders card that displays the content in the cart.
 * 
 * @param {*} props orderInfo and the modal to open. 
 * @returns 
 */
export const OrderDetailsContentCard = (props) => {
    const orderInfo = props.orderInfo;
    const openModal = props.openModal;

    return (
        <Card style={{ marginVertical: 10, marginHorizontal: 10, borderRadius: 10 }}>
            <Card.Title
                title="Contents"
            />
            <Card.Content style={{ marginBottom: 10, marginTop: -5 }}>
                {
                    orderInfo.items.map((item, index) => {
                        return (
                            <List.Item
                                onPress={() => { openModal(item.id) }}
                                key={index}
                                style={{ marginLeft: -10 }}
                                title={item.name}
                                description={"Sold by " + item.restaurant_name}
                                descriptionStyle={{ fontSize: 12 }}
                                right={props => <Text style={{ marginTop: 8 }}>{"£" + Number(((item.pence) / 100)).toFixed(2)}</Text>}
                            />
                        )
                    }
                    )
                }
                <Divider />
                <List.Item
                    style={{ marginBottom: -20, marginLeft: -10 }}
                    title="Subtotal:"
                    right={props => <Text style={{ marginTop: 8 }}>{"£" + Number(((orderInfo.subtotal_pence) / 100)).toFixed(2)}</Text>}
                />
                <List.Item
                    style={{ marginBottom: -20, marginLeft: -10 }}
                    title="Delivery Cost:"
                    right={props => <Text style={{ marginTop: 8 }}>{"£" + Number(((orderInfo.delivery_pence) / 100)).toFixed(2)}</Text>}
                />
                <List.Item
                    style={{ marginBottom: -20, marginLeft: -10 }}
                    title="Total:"
                    right={props => <Text style={{ marginTop: 8 }}>{"£" + Number(((orderInfo.total_pence) / 100)).toFixed(2)}</Text>}
                />
            </Card.Content>
        </Card>
    )
}