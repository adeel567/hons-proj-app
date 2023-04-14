import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Divider, IconButton, List, Paragraph, Title, ActivityIndicator } from 'react-native-paper';
import {filter, orderBy}  from 'lodash';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

/**
 * Takes a vendor's information and shows a more detailed about screen for them,
 * such as the location.
 * @param {*} nav_route  
 * @returns VendorAbout screen
 */
export const VendorAboutScreen = ({navigation, route}) => {
    const vendor = route.params.vendor

    return (
        <View style={styles.container}>
            <Card style={{marginTop:25, borderTopLeftRadius:10, borderTopRightRadius:10, borderBottomLeftRadius:0, borderBottomRightRadius:0}}>
                <Card.Title title="Location"/>
                <Card.Content>
                    <Paragraph>
                        Tap on point below for the location information.
                    </Paragraph>
                </Card.Content>
            </Card>

            <MapView 
                style={styles.map}
 		provider={PROVIDER_GOOGLE}
                initialRegion= {{
                    latitude:vendor.latitude,
                    longitude:vendor.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                }}
                >
                    <Marker
                        testID='marker'
                        title={vendor.name}
                        coordinate={{latitude: vendor.latitude, longitude: vendor.longitude}}
                        description={vendor.description}
                        />
                </MapView>


           

                <Card style={{marginTop:25, borderRadius:10}}>
                    <Card.Title title="Description"/>
                    <Card.Content>
                        <Paragraph>{vendor.description}</Paragraph>
                    </Card.Content>
                </Card>
        </View>


      );
    }


    

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        marginHorizontal:15
      },
      map: {
        width: '100%',
        height: '40%',
        borderBottomLeftRadius:15, borderBottomRightRadius:15
        // marginBottom:-100
      },
    });