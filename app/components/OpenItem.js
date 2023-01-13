import * as React from 'react';
import { Button, Card, Paragraph, IconButton, Provider, Divider, Text, ActivityIndicator, Portal, Modal} from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { Alert, View } from 'react-native';
import { axiosInstance, BASE_URL } from '../api';
import { MenuItem } from './MenuItem';
import { useNavigation } from '@react-navigation/native';


export const OpenItem = (props) => {
    const navigation = useNavigation();
    const hideModal = () => {props.setVisible(false)};
    const containerStyle = {padding: 20};
    const [itemDetails, setItemDetails] = React.useState();
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchItem = () => {
        setIsLoading(true)

        axiosInstance.get("/item/" + props.itemID)
        .then((response) => {
            setItemDetails(response.data)
            setIsLoading(false)
        })
        .catch(e => {
            console.log(e)
            setIsLoading(false)
            Alert.alert('An error occurred :(', "Issue connecting to ILP API, please try again later.", [
                { 
                    text: 'Try Again',
                    onPress: () => fetchItem(),
                },
                { text: 'OK'},
            ]);
        })
        hideModal() //if can't be found then just hide.
    }

    React.useEffect( () => {
        if (props.itemID > 0) {
            fetchItem()
        }
    },[props.itemID])

    if (isLoading) {
        return (
            <Portal>
                <Modal visible={props.visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <ActivityIndicator animating={true}/>
                </Modal>
            </Portal>
        )
    }

    return (
        <Portal>
            <Modal visible={props.visible} onDismiss={hideModal} contentContainerStyle={containerStyle} >
            <MenuItem item={itemDetails} usage={props.usage}  navigation = {navigation} setVisible={props.setVisible}/>
            </Modal>
         </Portal>
    );
}