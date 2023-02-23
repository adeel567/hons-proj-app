import * as React from 'react';
import { Alert, RefreshControl, ScrollView, View } from 'react-native';
import { ActivityIndicator} from 'react-native-paper';
import { axiosInstance } from '../api';
import { DeliveryProgress } from '../components/DeliveryProgress';
import { RequestOrderCancellation } from '../components/RequestOrderCancellation';
import { AuthContext } from '../context/AuthContext';
import { OpenItem } from '../components/OpenItem';
import { OrderDetailsContentCard } from '../components/OrderDetailsContentCard';
import { OrderDetailsTrackCard } from '../components/OrderDetailsTrackCard';


/**
 * Screen that has the order details.
 * @param {navigation,route}
 * @returns Screen
 */
export const OrderDetailsScreen = ({ navigation, route }) => {
    var orderNo = route.params.order_id
    const [orderInfo, setOrderInfo] = React.useState();
    const [loading, setLoading] = React.useState("false");
    const { triggerOrderRefresh, setTriggerOrderRefresh } = React.useContext(AuthContext)
    const [refreshing, setRefreshing] = React.useState(false);
    const [itemVisible, setItemVisible] = React.useState();
    const [itemVisibleID, setItemVisibleID] = React.useState();

    const openModal = (id) => {
        setItemVisibleID(id)
        setItemVisible(true)
    };

    const loadOrderData = () => {
        setLoading(true)

        axiosInstance.get("/orders/" + orderNo)
            .then((response) => {
                setOrderInfo(response.data)
                setLoading(false);
            })
            .catch(e => {
                console.log(e)
                Alert.alert('An error occurred :(', "Issue connecting to ILP API, please try again later.", [
                    {
                        text: 'Try Again',
                        onPress: () => loadOrderData(),
                    },
                    { text: 'OK' },
                ]);
            })
    }

    React.useEffect(() => {
        loadOrderData() //refresh on first load
    }, [triggerOrderRefresh, route])

    React.useEffect(() => {
        navigation.setOptions({ headerTitle: "Order #" + orderNo })
    }, [orderNo])

    if (loading) {
        return (<ActivityIndicator testID='loading' animating={true} />)
    }

    return (
        <ScrollView testID='scrollView' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadOrderData} />}>
            <OpenItem visible={itemVisible} setVisible={setItemVisible} itemID={itemVisibleID} usage={"order"} />
            <DeliveryProgress title={"Status"} status={orderInfo.status} delivery_date={orderInfo.delivery_date} style={{ marginTop: 20, marginBottom: 10, marginHorizontal: 10, borderRadius: 10 }} />
            <OrderDetailsTrackCard orderInfo={orderInfo} navigation={navigation}/>
            <OrderDetailsContentCard orderInfo={orderInfo} openModal={openModal}/>
            {orderInfo.status === "PLACED" ? <RequestOrderCancellation id={orderNo} style={{ marginVertical: 15, marginHorizontal: 10, borderRadius: 10 }} /> : <></>}

        </ScrollView>
    )
}