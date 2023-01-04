import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Button, Card, Divider, Paragraph, Subheading} from 'react-native-paper';
import { Alert, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import MapView, { Geojson, Marker } from 'react-native-maps';
import drone from '../../assets/drone.png'
import shop from '../../assets/shop.png'
import { axiosInstance } from '../api';


export const LiveTrackScreen = ({route}) => {
    const orderNo = route.params.orderNo
    const navigation = useNavigation();
    const [trackingInfo, setTrackingInfo] = React.useState();
    const [refreshTracking, setRefreshTracking] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true);

    const loadTrackingData = () => {
        setIsLoading(true)

        axiosInstance.get("/track/"+orderNo)
        .then((response) => {
            setTrackingInfo(response.data)
            console.log(response.data)
            setIsLoading(false)
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
        return
    }

    React.useEffect(() => {
        loadTrackingData() //refresh on first load
    },[refreshTracking])

    React.useEffect( () => {
        navigation.setOptions({headerTitle: "Live Track Order #" + orderNo})
    },[])

    const onRefresh = () => {
        setRefreshTracking(!refreshTracking)
    }

    if (isLoading) {
        return <ActivityIndicator animating={true}/>
    }

    return (
        <View style={styles.map}>
        <MapView
            mapPadding={{bottom:150}}
            style={styles.map}
            initialRegion= {{
                latitude:trackingInfo ? trackingInfo.delivery_info.latitude-0.001 : 1,
                longitude:trackingInfo ? trackingInfo.delivery_info.longitude : 1,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }}
            showsUserLocation={true}
        >
            <Marker
                title={"Drone"}
                icon={drone}
                description={"Making delivery " + trackingInfo.queue.current_delivery}
                coordinate={{longitude:trackingInfo.drone_location.longitude,latitude:trackingInfo.drone_location.latitude}}
            />

            {trackingInfo.pickups.map((pickup,index) => (
                    (<Marker
                        title="Pickup"
                        key={index}
                        // icon={shop}
                        description={pickup.name}
                        coordinate={{longitude:pickup.longitude ,latitude:pickup.latitude}}
                    />)
            ))}

            <Marker
                title={"Delivery Location"}
                coordinate={{longitude:trackingInfo.delivery_info.longitude,latitude:trackingInfo.delivery_info.latitude}}
                />
        </MapView>

        <SafeAreaView style={styles.footer}>
            <Card style={{marginBottom:20}}>
                <Card.Title title="Delivery Queue"/>
                {trackingInfo.delivery_info.status == "DELIVERED" ?
                <Card.Content style={{alignItems:"center"}}>
                    <Subheading>There is no queue information available as the status is {trackingInfo.delivery_info.status.toLowerCase()}.</Subheading>
                </Card.Content>
                :
                <Card.Content style={{alignItems:"center"}}>
                    {trackingInfo.delivery_info.status==="PICKUP" || trackingInfo.delivery_info.status==="DELIVERY"
                        ?
                        <Subheading style={{"fontWeight": "bold"}}>Your order is being delivered! Head outside.</Subheading>
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