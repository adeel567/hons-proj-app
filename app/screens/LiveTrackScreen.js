import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Button, Card, Divider, Paragraph, Subheading} from 'react-native-paper';
import { Alert, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import MapView, { Geojson, Marker } from 'react-native-maps';
import drone from '../../assets/drone.png'
import shop from '../../assets/shop.png'
import { axiosInstance } from '../api';


export const LiveTrackScreen = ({route}) => {
    const orderInfo = route.params.orderInfo
    const orderNo = route.params.orderNo
    const navigation = useNavigation();
    const [trackable, setTrackable] = React.useState(orderInfo.trackable);
    const [trackingInfo, setTrackingInfo] = React.useState();
    const [refreshTracking, setRefreshTracking] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true);

    const loadTrackingData = () => {
        setIsLoading(true)
        axiosInstance.get("/track/"+orderNo)
        .then((response) => {
            if (response.status === 200) { //if tracking is available
                setTrackable(true)
                setTrackingInfo(response.data)
                setIsLoading(false)
            } else {
                setTrackable(false)
                setIsLoading(false)
            }
        })
        .catch(e => {
            console.log(e)
            setIsLoading(false)
            Alert.alert('An error occurred :(', "Issue connecting to ILP API, please try again later.", [
                { 
                    text: 'Try Again',
                    onPress: () => loadTrackingData(),
                },
                { text: 'OK'},
            ]);
            })
    }

    React.useEffect(() => {
        loadTrackingData() //refresh on first load
    },[refreshTracking])

    React.useEffect( () => {
        trackable ? navigation.setOptions({headerTitle: "Live Track Order #" + orderNo}) : navigation.setOptions({headerTitle: "Delivery Location #" + orderNo})
    },[trackable])

    const onRefresh = () => {
        setRefreshTracking(!refreshTracking)
    }

    if (isLoading) {
        return <ActivityIndicator animating={true}/>
    }


    return (
        <View style={styles.map}>
        <MapView
            mapPadding={trackable ? {bottom:250} : {bottom:0}}
            style={styles.map}
            initialRegion= {{
                latitude: trackable ? orderInfo.delivery_latitude -0.001 : orderInfo.delivery_latitude,
                longitude: orderInfo.delivery_longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }}
            showsUserLocation={true}
        >
            {(trackable && trackingInfo.delivery_info.status !== "DELIVERED") ? //drone is shown when not delivered and is trackable
            <Marker
                title={"Drone"}
                icon={drone}
                description={"Making delivery " + trackingInfo.queue.current_delivery}
                coordinate={{longitude:trackingInfo.drone_location.longitude,latitude:trackingInfo.drone_location.latitude}}
            />
            : <></>}

            {orderInfo.pickups.map((pickup,index) => (
                    (<Marker
                        title="Pickup"
                        key={index}
                        icon={shop}
                        description={pickup.name}
                        coordinate={{longitude:pickup.longitude ,latitude:pickup.latitude}}
                    />)
            ))}

            <Marker
                title={"Delivery Location"}
                coordinate={{longitude:orderInfo.delivery_longitude,latitude:orderInfo.delivery_latitude}}
                />
        </MapView>

        <SafeAreaView style={styles.footer}>
            {trackable ?
            <View>
            <Card style={{marginBottom:20}}>
                <Card.Title title="Delivery Queue"/>
                {trackingInfo.delivery_info.status === "DELIVERED" ?
                <Card.Content style={{alignItems:"center"}}>
                    <Subheading>No tracking info as order is {trackingInfo.delivery_info.status.toLowerCase()}.</Subheading>
                </Card.Content>
                :
                <Card.Content style={{alignItems:"center"}}>
                    {trackingInfo.delivery_info.status==="PICKUP" || trackingInfo.delivery_info.status==="DELIVERY"
                        ?
                        <View style={{alignItems:"center"}}>
                            <Subheading  style={{"fontWeight": "bold"}}>Your order is on its way!</Subheading>
                            <Subheading>Its status is {trackingInfo.delivery_info.status.toLowerCase()}.</Subheading>
                            <Subheading>Head outside soon to retrieve it.</Subheading>
                        </View>
                        :
                        <View style={{alignItems:"center"}}>
                            <Subheading style={{"fontWeight": "bold"}}>There are {trackingInfo.queue.relative_position} orders infront of you.</Subheading>
                            <Paragraph>Your lunch is delivery {trackingInfo.queue.overall_position}.</Paragraph>
                            <Paragraph>The drone is currently completing delivery {trackingInfo.queue.current_delivery}.</Paragraph>
                            <Paragraph>There are {trackingInfo.queue.length} orders to deliver today.</Paragraph>
                        </View>

                    }
                </Card.Content>
                } 
            </Card>
            <Button icon={"refresh"} onPress={onRefresh} mode="contained" color='blue' loading={isLoading} style={styles.button}>Refresh</Button>
            </View>
            : <></>}
        </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
    },
    map: {
    flex: 1
    },
    markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%'
    },
    marker: {
    height: 48,
    width: 48
    },
    footer: {
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    bottom: 0,
    position: 'absolute',
    width: '100%',
    padding:25
    },
    region: {
    color: '#fff',
    lineHeight: 20,
    margin: 20
    }
})