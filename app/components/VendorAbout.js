import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MenuItem } from '../components/MenuItem';
import { axiosInstance, BASE_URL } from '../api';
import { Card, Divider, IconButton, List, Paragraph, Title, ActivityIndicator } from 'react-native-paper';
import { MenuBar } from '../components/MenuBar';
import {filter, orderBy}  from 'lodash';
import MapView, { Marker } from 'react-native-maps';

export const VendorAbout = ({navigation, route}) => {
    const vendor = route.params.vendor

    return (
        <View style={styles.container}>
            <Card style={{marginTop:25}}>
                <Card.Title title="Location"/>
                <Card.Content>
                    <Paragraph>
                        Tap on point below for directions.
                    </Paragraph>
                </Card.Content>
            </Card>

            <MapView 
                style={styles.map}
                initialRegion= {{
                    latitude:vendor.latitude,
                    longitude:vendor.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                }}
                >
                    <Marker
                        title={vendor.name}
                        coordinate={{latitude: vendor.latitude, longitude: vendor.longitude}}
                        description={vendor.description}
                        />
                </MapView>


           

                <Card style={{marginTop:25}}>
                    <Card.Title title="Description"/>
                    <Card.Content>
                        <Paragraph>{vendor.description}</Paragraph>
                    </Card.Content>
                </Card>
                {/* <Card style={{marginTop:25}}>
                    <Card.Title title="Allergy Information"/>
                    <Card.Content>
                        <Paragraph>{vendor.description}</Paragraph>
                    </Card.Content>
                </Card> */}
        </View>


      );
    }


    

    const styles = StyleSheet.create({
      container: {
        flex: 1,
      },
      map: {
        width: '100%',
        height: '40%',
        // marginBottom:-100
      },
    });