import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Button, Card, Paragraph} from 'react-native-paper';
import { Alert, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import MapView, { Geojson } from 'react-native-maps';
import marker from '../../assets/marker-icon.png'
import { axiosInstance } from '../api';
import { AuthContext } from '../context/AuthContext';


export const ChooseDeliveryLocation = (props) => {
    const navigation = useNavigation();
    const [isLoading, setisLoading] = React.useState(false);
    const thres = 6;

    const {setCartDeliveryLocation, cartDeliveryLocation} = React.useContext(AuthContext);
    const [region, setRegion] = React.useState({
        longitude: cartDeliveryLocation ? cartDeliveryLocation.delivery_longitude :  -3.1883802,
        latitude: cartDeliveryLocation ? cartDeliveryLocation.delivery_latitude : 55.94399411,
        latitudeDelta: cartDeliveryLocation ? 0.00069 : 0.01,
        longitudeDelta: cartDeliveryLocation? 0.00069 : 0.01
    });

    const onRegionChange = (newRegion, {isGesture:boolean}) => {
      if (region.latitude.toFixed(thres) !== newRegion.latitude.toFixed(thres)
          || region.longitude.toFixed(thres) !== newRegion.longitude.toFixed(thres)) {
            setRegion(newRegion)
          }
    }

    React.useEffect( () => {
      if (cartDeliveryLocation?.delivery_latitude) {
        navigation.setOptions({headerTitle: "Update Delivery Location"})
      }

    },[])

    // React.useEffect( () => {
    //   setisLoading(true)
    //   axiosInstance.get("/checkout/validate/no-fly-zone")
    //   .then((response) => {
    //     // setNFZ(JSON.parse(response.data['geojson']))
    //     console.log(nfz)
    //     console.log(nfz2)
    //   })
    //   setisLoading(false)
    // },[])



    const confirmLocation = () => {
        setisLoading(true)
        const params = {
            "delivery_longitude": region.longitude,
            "delivery_latitude": region.latitude
        }
        axiosInstance.post("checkout/validate/delivery-location",params)
        .then((response) => {
            if (response.data.status = 200) {
                setCartDeliveryLocation(params)
                // navigation.navigate("Choose Delivery Date")
                setisLoading(false)
                navigation.goBack()
            }
        })
        .catch((error) => {
            var err_text = "Issue when communicating with ILP API, please try again later."
            console.log(error)
            if (error?.response?.data?.res) { //if error from API exists, return that message instead.
                err_text = error.response.data.res[0]
            }
            setisLoading(false)
            Alert.alert('Issue with the chosen location.', err_text, [
                { text: 'OK'},
            ]);
        })
    }

    if (isLoading) {
      return (<ActivityIndicator animating={true}/>)
    } else {
    return (
        <View style={styles.map}>
        <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={onRegionChange}
            showsUserLocation={true}
        >
            <Geojson
                geojson={out}
            />
            <Geojson
                geojson={nfz}
            />
        </MapView>
        <View style={styles.markerFixed}>
            <Image style={styles.marker} source={marker} />
        </View>
        <SafeAreaView style={styles.footer}>
            {/* {isLoading ? 
            <ActivityIndicator animating={true}/>
            : */}
            <Button onPress={confirmLocation} mode="contained" color='green' loading={isLoading} style={styles.button}>Confirm Location</Button>
        </SafeAreaView>
        </View>
    )}
}
const out = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "MultiPolygon",
          "coordinates": [
              [
                  [
                      [
                          0,
                          90
                      ],
                      [
                          180,
                          90
                      ],
                      [
                          180,
                          -90
                      ],
                      [
                          0,
                          -90
                      ],
                      [
                          -180,
                          -90
                      ],
                      [
                          -180,
                          0
                      ],
                      [
                          -180,
                          90
                      ],
                      [
                          0,
                          90
                      ]
                      ],
                  [
                      [
                      -3.192473,
                      55.946233
                      ],
                      [
                      -3.192473,
                      55.942617
                      ],
                      [
                      -3.184319,
                      55.942617
                      ],
                      [
                      -3.184319,
                      55.946233
                      ],
                      [
                      -3.192473,
                      55.946233
                      ]
                  ]
              ]
          ]
        }
      }
    ]
  }






const nfz = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "name": "McEwan Hall Complex",
          "fill": "#ff0000"
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -3.190975785255432,
                55.945267798202174
              ],
              [
                -3.1909194588661194,
                55.94518669034828
              ],
              [
                -3.1909355521202087,
                55.94515965435923
              ],
              [
                -3.190962374210357,
                55.945129614349256
              ],
              [
                -3.190889954566955,
                55.94499443401603
              ],
              [
                -3.190954327583313,
                55.94497941394988
              ],
              [
                -3.1908980011940002,
                55.944866763268045
              ],
              [
                -3.190962374210357,
                55.94484122906794
              ],
              [
                -3.1909731030464172,
                55.94479466665969
              ],
              [
                -3.1909301877021785,
                55.944754112258515
              ],
              [
                -3.190833628177643,
                55.944745100163594
              ],
              [
                -3.190801441669464,
                55.94467300332875
              ],
              [
                -3.191005289554596,
                55.944632448800185
              ],
              [
                -3.1909516453742977,
                55.94450627888413
              ],
              [
                -3.189685642719269,
                55.944706047728076
              ],
              [
                -3.1898894906044006,
                55.94512510834574
              ],
              [
                -3.189750015735626,
                55.945143132356606
              ],
              [
                -3.1897151470184326,
                55.94508605629341
              ],
              [
                -3.189650774002075,
                55.94509807231371
              ],
              [
                -3.189634680747986,
                55.94508455429062
              ],
              [
                -3.1891921162605286,
                55.94518819234711
              ],
              [
                -3.189186751842499,
                55.94529483411573
              ],
              [
                -3.1892189383506775,
                55.94541048753285
              ],
              [
                -3.1893745064735413,
                55.945538156488325
              ],
              [
                -3.189717829227447,
                55.945512622730895
              ],
              [
                -3.190975785255432,
                55.945267798202174
              ]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "name": "Teviot",
          "fill": "#ff0000"
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -3.189471065998077,
                55.94474359814759
              ],
              [
                -3.189385235309601,
                55.94475861830519
              ],
              [
                -3.1894147396087646,
                55.944812690824364
              ],
              [
                -3.189058005809784,
                55.94486826527927
              ],
              [
                -3.1890124082565308,
                55.944857751199336
              ],
              [
                -3.1889426708221436,
                55.94486826527927
              ],
              [
                -3.1889212131500244,
                55.94483071498065
              ],
              [
                -3.189001679420471,
                55.9448186988774
              ],
              [
                -3.1889373064041133,
                55.94469102755005
              ],
              [
                -3.1887710094451904,
                55.94471205579763
              ],
              [
                -3.1887897849082947,
                55.944752610242844
              ],
              [
                -3.188583254814148,
                55.94478415255978
              ],
              [
                -3.1885054707527156,
                55.94480668277041
              ],
              [
                -3.188360631465912,
                55.944826208942374
              ],
              [
                -3.18827748298645,
                55.944857751199336
              ],
              [
                -3.188320398330688,
                55.944935855725085
              ],
              [
                -3.1883955001831055,
                55.944922337645345
              ],
              [
                -3.1884410977363586,
                55.94501696410433
              ],
              [
                -3.1884223222732544,
                55.94503198415593
              ],
              [
                -3.1884196400642395,
                55.94505751823024
              ],
              [
                -3.188435733318329,
                55.94508755829614
              ],
              [
                -3.1884920597076416,
                55.94509206430401
              ],
              [
                -3.18853497505188,
                55.94506052223791
              ],
              [
                -3.188559114933014,
                55.94505451422238
              ],
              [
                -3.1885778903961177,
                55.94508455429062
              ],
              [
                -3.1887388229370117,
                55.94504850620593
              ],
              [
                -3.188757598400116,
                55.945090562301466
              ],
              [
                -3.189575672149658,
                55.944961389862804
              ],
              [
                -3.189471065998077,
                55.94474359814759
              ]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "name": "Wilkie Building",
          "fill": "#ff0000"
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -3.189708441495895,
                55.94468426846805
              ],
              [
                -3.189666867256164,
                55.94459790231641
              ],
              [
                -3.189239054918289,
                55.94466549323409
              ],
              [
                -3.1892256438732143,
                55.94463995890126
              ],
              [
                -3.1889882683753963,
                55.94467750938487
              ],
              [
                -3.189052641391754,
                55.94481118881095
              ],
              [
                -3.1892913579940796,
                55.94477363845699
              ],
              [
                -3.189283311367035,
                55.944751108227116
              ],
              [
                -3.189708441495895,
                55.94468426846805
              ]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "name": "Psychology and Neuroscience",
          "fill": "#ff0000"
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -3.1893154978752136,
                55.944416908278214
              ],
              [
                -3.1892524659633636,
                55.944283978508075
              ],
              [
                -3.187848329544067,
                55.944497266731524
              ],
              [
                -3.1879743933677673,
                55.94476237334369
              ],
              [
                -3.1882010400295258,
                55.94472632495912
              ],
              [
                -3.188132643699646,
                55.94459264524009
              ],
              [
                -3.1882748007774353,
                55.94457011490493
              ],
              [
                -3.1883391737937927,
                55.94471806386626
              ],
              [
                -3.189103603363037,
                55.9446001553489
              ],
              [
                -3.189058005809784,
                55.94450778090934
              ],
              [
                -3.188931941986084,
                55.944525805207526
              ],
              [
                -3.1888957321643825,
                55.94445445897809
              ],
              [
                -3.1890633702278137,
                55.944427422477844
              ],
              [
                -3.189076781272888,
                55.944455961005325
              ],
              [
                -3.1893154978752136,
                55.944416908278214
              ]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "name": "Chrystal Macmillan and Hugh Robson",
          "fill": "#ff0000"
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -3.190641850233078,
                55.94455434366252
              ],
              [
                -3.1906230747699733,
                55.94452129913378
              ],
              [
                -3.1907048821449275,
                55.94450627888413
              ],
              [
                -3.1906726956367493,
                55.94444244275808
              ],
              [
                -3.1910401582717896,
                55.944383863632204
              ],
              [
                -3.1910750269889827,
                55.94401511351047
              ],
              [
                -3.1909529864788055,
                55.94403388905976
              ],
              [
                -3.190948963165283,
                55.944027129863066
              ],
              [
                -3.1906579434871674,
                55.944070689109935
              ],
              [
                -3.1906633079051967,
                55.944081203403584
              ],
              [
                -3.18934366106987,
                55.944283978508075
              ],
              [
                -3.189467042684555,
                55.94454082544963
              ],
              [
                -3.1895622611045837,
                55.944525805207526
              ],
              [
                -3.189568966627121,
                55.94453707038965
              ],
              [
                -3.190224766731262,
                55.94443418160469
              ],
              [
                -3.1903065741062164,
                55.944604661413486
              ],
              [
                -3.1905077397823334,
                55.94457311895037
              ],
              [
                -3.190494328737259,
                55.94454082544963
              ],
              [
                -3.1905654072761536,
                55.9445295602686
              ],
              [
                -3.1905801594257355,
                55.944564106813345
              ],
              [
                -3.190641850233078,
                55.94455434366252
              ]
            ]
          ]
        }
      }
    ]
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
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
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
