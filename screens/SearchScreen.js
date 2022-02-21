import React from 'react';
import { View, Text, TextInput, StatusBar, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';

//import { getDistance, getPreciseDistance } from 'geolib';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geolocation from '@react-native-community/geolocation';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { Item, Input, Label, ListItem, Body, Picker, NativeBaseProvider, Button, Icon } from 'native-base';

import { ThemeColor } from '../colors/ThemeColor';

import axios from 'axios';
import Toast from 'react-native-simple-toast';
import Modal from "react-native-modal";
import * as geolib from 'geolib';
import call from 'react-native-phone-call';
import { Circle } from 'react-native-svg';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get('window').height;


class SearchScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            donorList: [],
            seekerLatitude: 0,
            seekerLongitude: 0,
            isVisible1: false,
            donorDetails: [],
            donorName: '',
            donorNumber: 0,
            donorBloodGroup: '',
            


        }
    }
    componentDidMount() {
        this.locateCurrentPosition();
        //this.calculatePreciseDistance();


        const { navigation } = this.props;
        const bloodGroup = this.props.navigation.getParam('bloodGroup', '');
        const searchFor = this.props.navigation.getParam('searchFor', '');


        console.log({ bloodGroup });
        console.log({ searchFor });

        const article = JSON.stringify({

        })

        var url = '';

        switch (searchFor) {
            case "Blood":121.150
                var url = 'http://192.168.121.150:8088/api/user/searchB/' + bloodGroup;
                console.log({ url })
                console.log("Blood selected")
                break;
            case "Plasma":
                var url = 'http://192.168.121.150:8088/api/user/searchP/' + bloodGroup;
                console.log({ url })
                console.log("Plasma selected")
                break;
            case "Covid Plasma":
                var url = 'http://192.168.121.150:8088/api/user/searchCP/' + bloodGroup;
                console.log({ url })
                console.log("Covid Plasma selected")
                break;
            default:
                console.log("Blood selected")
        }

        let config = {
            headers: {

                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        axios.get(url, article, config)
            .then(response => {
                if (response.status === 200) {

                    //console.log("response data", response.data);
                    this.setState({ donorList: response.data });
                    console.log("list from state: ", this.state.donorList)
                }
            })
            .catch(error => {
                console.log('There was an error!', error);
            });

          
    }
 
     
    calculatePreciseDistance() {
        console.log("Inside distance function")
        var pdis = geolib.getPreciseDistance(
            { latitude: 27.7182139, longitude: 85.5182088 },
            { latitude: 28.2176987, longitude: 84.0004532 }
        );

        //  var pdis = getPreciseDistance(
        //    {latitude: 27.7182139, longitude: 85.5182088},
        //    {latitude:28.2176987, longitude: 84.0004532},     
        //  );    
        console.log("distance: ", pdis);
    };

    locateCurrentPosition = () => {
        console.log("current position")
        Geolocation.getCurrentPosition(
            position => {

                console.log(JSON.stringify(position));

                this.setState({
                    seekerLatitude: position.coords.latitude,
                    seekerLongitude: position.coords.longitude,
                    error: null
                })
                console.log('position', position.coords.latitude)


            },
            error => console.log('No provider available'),
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 10000 }
        )

        //console.log('lat and lon', this.state.latitude, this.state.longitude);

    }

    checkRadius(latitude, longitude) {
        //console.log("latitide,longitude: ",latitude,longitude);
        var pdis = geolib.getPreciseDistance(
            { latitude: this.state.seekerLatitude, longitude: this.state.seekerLongitude },
            { latitude: latitude, longitude: longitude }
        );

        console.log("Distance: ", pdis)

        if (pdis < 5000){
            return true;
        }
            
        else{
            return false;
        }
            


    }

    async displayDonorDetails(id) {
        this.setState({ isVisible1: true })

        try {
            let response = await fetch('http://192.168.121.150:8088/api/user/getone/' + id, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: ''
            });

            let responseJson = await response.json();
            console.log('responseJson', responseJson);

            if (response.status === 200) {
                //console.log('responseJson', responseJson);
                this.setState({ donorName: responseJson.name, donorNumber: responseJson.number, donorBloodGroup: responseJson.blood_group });
                console.log("Individual donor details: ", this.state.donorDetails)

            }
        }
        catch (error) {
            console.log(error)
        }
    }

    callDonor(){
        const args = {
           
            number: this.state.donorNumber.toString(), // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
          }
           
          call(args).catch(console.error)
    }

    





    render() {
        return (
            <View style={{flex:1,backgroundColor:'white'}}>
                <Text style={{fontSize:16,color:'grey',alignSelf:'center',marginVertical:10,fontWeight:'600'}}>Click on the marker to see Donor Details</Text>
                <MapView

                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    showsUserLocation={true}
                    onRegionChangeComplete={this.handleRegionChange}
                    region={{
                        longitude: this.state.seekerLongitude,
                        latitude: this.state.seekerLatitude,
                        latitudeDelta: 0.11,
                        longitudeDelta: 0.11
                    }}>


                    {this.state.donorList.map((item, key) => (
                        <View key={key}>
                            {this.checkRadius(item.latitude, item.longitude) ?
                                <Marker
                                    coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                                   // title={item.name}
                                    onPress={() => this.displayDonorDetails(item._id)}
                                    pinColor={ThemeColor.red}
                                    

                                >
                                    <View>
                                        <TouchableOpacity>
                                            <Icon2 name="map-marker-radius" size={35} color={ThemeColor.red} />

                                        </TouchableOpacity>
                                    </View>
                                    </Marker>
                                : console.log("huhuhu")

                            }




                        </View>

                    ))}
                    <MapView.Circle
                    center = {{ latitude: this.state.seekerLatitude || 30, longitude: this.state.seekerLongitude || 120 }}
                    radius = { 5000 }
                    strokeColor = {ThemeColor.red}
                    fillColor ='rgba(196,196,196,0.35)'
                    strokeOpacity={0.1}
                    
                    strokeWidth = { 1}/>


                </MapView>
                
                <Modal
                    isVisible={this.state.isVisible1}
                    backdropColor='black'
                    backdropOpacity={0.3}
                    animationIn='bounceIn'
                    animationOut='fadeOut'
                    backdropTransitionOutTiming={0}
                    animationOutTiming={10}
                    animationInTiming={300}
                    onSwipeComplete={() => {
                        this.setState({ isVisible1: false })

                    }
                    }

                    swipeDirection={['right', 'left',]}
                    avoidKeyboard={true}

                    onBackButtonPress={() => this.setState({ isVisible1: false })}
                    onBackdropPress={() => this.setState({ isVisible1: false })}
                    deviceWidth={windowWidth}
                    propagateSwipe={true}
                    scrollOffset={0.5}
                    scrollHorizontal={true}
                >
                  
                    <View style={styles.cardModal}>
                        <ScrollView>

                            <View style={styles.cardModalView}>
                                <Text style={{ alignSelf: 'center', marginVertical: 10 }}>Donor Details:</Text>
                                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                                    <Text style={styles.text1}>Name:</Text>
                                    <Text style={styles.text2}>    {this.state.donorName}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                                    <Text style={styles.text1}>Blood Group:</Text>
                                    <Text style={styles.text2}>    {this.state.donorBloodGroup}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                                    <Text style={styles.text1}>Number:</Text>
                                    <Text style={styles.text2}>    {this.state.donorNumber}</Text>
                                    <TouchableOpacity
                                    onPress={()=>this.callDonor()}
                                    style={styles.phone}
                                    >
                                    <Icon1 name="phone" size={20} color={ThemeColor.white}/>
                                    </TouchableOpacity>
                                </View>

                            </View>
                            <TouchableOpacity
                            onPress={()=>this.setState({isVisible1:false})}
                            style = {styles.box}
                            >
                            
                                <Text style={{color:'white',fontWeight:'bold',fontSize:16}}>Close</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>


                </Modal>
               
            </View>
        )
    }
}

export default SearchScreen;

const styles = StyleSheet.create({
    map: {
        width: Math.round(windowWidth),
        height: Math.round(windowHeight )
    },
    cardModalView: {
        height: 220,
        paddingVertical: 10,


    },
    cardModal: {

        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: Math.round(windowWidth * 0.7),
        alignSelf: 'center',


    },

    text1: {
        fontSize: 16,
        color: 'grey'
    },
    text2: {
        fontSize: 16,
        fontWeight: '600',
    },
    box:{
        backgroundColor:ThemeColor.red,
        height:50,
        marginBottom:20,
        alignSelf:'center',
        borderRadius:5,
        width: Math.round(windowWidth * 0.5),
        alignItems:'center',
        justifyContent:'center'
    },
    phone:{
        position:'absolute',
        right:5,
        backgroundColor:'green',
        width:40,
        height:40,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        marginTop:-6

    }

})