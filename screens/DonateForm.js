/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View, Text, TextInput, StatusBar, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Switch } from 'react-native';

//import { getDistance, getPreciseDistance } from 'geolib';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geolocation from '@react-native-community/geolocation';
import { PERMISSIONS, request } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Entypo';
import { Item, Input, Label, ListItem, Body, Picker, NativeBaseProvider, Button } from 'native-base';
import Icon1 from 'react-native-vector-icons/AntDesign';
import { ThemeColor } from '../colors/ThemeColor';
import { Checkbox } from 'react-native-paper';

import { api } from '../utils'
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';





import Modal from "react-native-modal";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get('window').height;

//  const dis = getDistance(
//    { latitude: 20.0504188, longitude: 64.4139099 },
//    { latitude: 51.528308, longitude: -0.3817765 },
//  );

var radio_props = [
  { label: 'A', value: 0 },
  { label: 'B', value: 1 },
  { label: 'AB', value: 2 },
  { label: 'O', value: 3 },
];




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      number: 0,
      latitude: 0,
      longitude: 0,

      isVisible1: false,
      isVisible2: false,
      checkedDonateBlood: false,
      checkedDonatePlasma: false,
      checkedDonateCovPlasma: false,
      checkedCovYes: false,
      checkedCovNo: false,
      covRecov: false,

      value: 0,
      value1: '',
      bloodGroup: 'Select Blood Group',
      isSelectedBlood: false,
      isEnabled: false,
      opacityDynamic: 0.4,
      userId: ''


    }
  }
  async componentDidMount() {
    let _userId = await AsyncStorage.getItem('userId');
    let userId = JSON.parse(_userId);
    this.setState({ userId: userId })

    let _number = await AsyncStorage.getItem('number');
    let number = JSON.parse(_number);
    console.log({number})
    this.setState({ number: number })
    this.requestLocationPermission();

    // this.calculatePreciseDistance();
  }

  //  calculatePreciseDistance = () => {
  //    // var pdis = getPreciseDistance(
  //    //   {latitude: 27.7182139, longitude: 85.5182088},
  //    //   {latitude:28.2176987, longitude: 84.0004532},     
  //    // //);
  //    var dlon = this.state.longitude2 - this.state.longitude1;
  //    var dlat = this.state.latitude2 - this.state.latitude1 ;
  //    console.log({dlon,dlat});
  //    var a = (Math.sin(dlat / 2)) ^ 2 + Math.cos(this.state.latitude1) * Math.cos(this.state.latitude2) * (Math.sin(dlon / 2)) ^ 2 
  //    console.log({a});
  //    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) 
  //    console.log({c})
  //    var d = parseInt(6367 * c);
  //    console.log("Distance:",d);
  //    // alert(
  //    //   `Precise Distance\n\n${d} Meter\nOR\n${d / 1000} KM`
  //    // );
  //  };



  requestLocationPermission = async () => {

    if (Platform.OS === 'ios') {
      var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      console.log('iphone', response);
      if (response === 'granted') {
        this.locateCurrentPosition();
      }
    } else {
      var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      console.log('android', response);
      if (response === 'granted') {
        console.log('Permission Granted for android')
        this.locateCurrentPosition();

      }

    }
  }

  locateCurrentPosition = () => {
    console.log("current position")
    Geolocation.getCurrentPosition(
      position => {

        console.log(JSON.stringify(position));

        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        })
        console.log('position', position.coords.latitude)


      },
      error => console.log('No provider available'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10000 }
    )

    console.log('lat and lon', this.state.latitude, this.state.longitude);

  }

  onMapPress(e) {
    console.log("In onMapPress. coordinate: ", e.nativeEvent.coordinate);


  }
  onRegionChange(region) {
    this.setState({ longitude: this.state.longitude, latitude: this.state.latitude });
    console.log(this.state.latitude, this.state.longitude)
  }
  handleChangeCheckBox1() {
    this.setState({ checkedDonateBlood: !this.state.checkedDonateBlood });
  }
  handleChangeCheckBox2() {
    this.setState({ checkedDonatePlasma: !this.state.checkedDonatePlasma });
  }
  handleChangeCheckBox3() {
    this.setState({ checkedDonateCovPlasma: !this.state.checkedDonateCovPlasma });
  }
  handleChangeCheckBox4() {
    this.setState({ checkedCovYes: !this.state.checkedCovYes, checkedCovNo: false, covRecov: true });

  }
  handleChangeCheckBox5() {
    this.setState({ checkedCovNo: !this.state.checkedCovNo, checkedCovYes: false, covRecov: false });
  }

  async saveInfo() {
    try {
      let responseJson = await api.addDonor(this.state.name, this.state.number, this.state.bloodGroup, this.state.latitude, this.state.longitude, this.state.isEnabled,
        this.state.checkedDonateBlood, this.state.checkedDonatePlasma, this.state.checkedDonateCovPlasma, this.state.covRecov
      )

      console.log('responseJson', responseJson);

    }
    catch (err) {
      console.log(err);
    }

  }

  addDonor() {
    if (this.state.name === '' || this.state.bloodGroup === 'Select Blood Group') {
      Toast.show('Please provide all the fields', Toast.LONG, ['UIAlertController',]);

    }
    else {
      const article = JSON.stringify({
        name: this.state.name,
        number: this.state.number,
        blood_group: this.state.bloodGroup,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        availability: this.state.isEnabled,
        donate_blood: this.state.checkedDonateBlood,
        donate_plasma: this.state.checkedDonatePlasma,
        donate_cov_plasma: this.state.checkedDonateCovPlasma,
        cov_recov: this.state.covRecov,
        userId: this.state.userId

      })
      console.log(article)




      let config = {
        headers: {

          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }

      axios.post('http://192.168.121.150:8088/api/user/create', article, config)
        .then(response => {
          if (response.status === 200) {
            console.log(response.data);
            console.log("created");
            Toast.show('Donor Registered', Toast.LONG, ['UIAlertController',]);
            this.props.navigation.navigate('Home');
            console.log("DonorId:", response.data._id)
            AsyncStorage.setItem('donorId', JSON.stringify(response.data._id));
          }
        })
        .catch(error => {
          // console.log(error.response.data);
          console.log('There was an error!', error);
        });

    }
  }

  mapPressed(e){   
      this.setState({
        latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude
      })
      console.log(this.state.latitude,this.state.longitude);

  }



  render() {
    return (

      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <ScrollView>
          <NativeBaseProvider>



            {/* <MapView

              provider={PROVIDER_GOOGLE}
              style={styles.map}
              showsUserLocation={true}
              onRegionChangeComplete={this.handleRegionChange}
              region={{
                longitude: this.state.longitude,
                latitude: this.state.latitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              }}>


              <Marker draggable
                coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                onPress={(e) => this.onMapPress(e)}
                onDragEnd={(e) => this.setState({ latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude })}

              >

              </Marker>
            </MapView> */}

            <Text style={styles.searchText}>Full Name:</Text>

            <TextInput
              //keyboardType="email-address"
              placeholder="Enter your Full Name"
              style={styles.inputBox}
              onChangeText={(value) => this.setState({ name: value })}
            />
            {/* <Text style={styles.searchText}>Phone Number:</Text> */}
            {/* <TextInput
              keyboardType="numeric"
              maxLength={10}
              placeholder="9812345678"
              style={styles.inputBox}
              onChangeText={(value) => this.setState({ number: value })}
            /> */}


            <Text style={styles.searchText}>Blood Group:</Text>
            <TouchableOpacity
              style={{ ...styles.mapBox, }}
              onPress={() => this.setState({ isVisible2: true })}
            >
              <Text style={{ fontSize: 18, color: 'grey', }}>{this.state.bloodGroup}</Text>
              <Icon2 name="chevron-down" size={20} style={{ position: 'absolute', right: 10 }} />
            </TouchableOpacity>




            <Text style={styles.searchText}>Location:</Text>
            <TouchableOpacity
              style={styles.mapBox}
              onPress={() => this.setState({ isVisible1: true })}
            >
              <Icon2 name="location" size={20} style={{ position: 'absolute', left: 10, }} />

              <Text style={{ fontSize: 18, color: 'grey', marginLeft: 25 }} >Click to Change Your Location</Text>
              <Icon2 name="chevron-down" size={20} style={{ position: 'absolute', right: 10 }} />

            </TouchableOpacity>

            <View style={{ marginTop: 40, flexDirection: 'row', marginHorizontal: 30 }}>
              <Text style={{ fontSize: 16 }}>Available for Donation</Text>
              <Switch
                trackColor={{ false: "#767577", true: ThemeColor.red }}
                thumbColor={this.state.isEnabled ? "grey" : "#f4f3f4"}
                value={this.state.isEnabled}

                onValueChange={() => {
                  this.setState({
                    isEnabled: !this.state.isEnabled
                  });

                  { this.state.isEnabled == true ? this.setState({ opacityDynamic: 0.4 }) : this.setState({ opacityDynamic: 1 }) }



                }}
                style={{ position: 'absolute', right: 5 }}
              />


            </View>

            <View pointerEvents={!this.state.isEnabled ? 'none' : 'auto'}
              style={{ opacity: this.state.opacityDynamic }}
            >

              <View style={styles.checkBoxLine}>
                <Checkbox
                  color={ThemeColor.red}
                  status={this.state.checkedDonateBlood ? 'checked' : 'unchecked'}
                  onPress={() => this.handleChangeCheckBox1()}
                />
                <Text onPress={() => this.handleChangeCheckBox1()} style={{ fontSize: 16 }}>Donate Blood</Text>
              </View>

              <View style={styles.checkBoxLine}>
                <Checkbox
                  color={ThemeColor.red}
                  status={this.state.checkedDonatePlasma ? 'checked' : 'unchecked'}
                  onPress={() => this.handleChangeCheckBox2()}
                />
                <Text onPress={() => this.handleChangeCheckBox2()}
                  style={{ fontSize: 16 }}>Donate Plasma</Text>
              </View>

              <View style={styles.checkBoxLine}>
                <Checkbox
                  color={ThemeColor.red}
                  status={this.state.checkedDonateCovPlasma ? 'checked' : 'unchecked'}
                  onPress={() => this.handleChangeCheckBox3()}
                />
                <Text onPress={() => this.handleChangeCheckBox3()} style={{ fontSize: 16 }}>Donate Covid Plasma</Text>
              </View>


              <View style={{marginTop:10 }}>
                <Text style={{ ...styles.searchText, marginBottom: -5 }}>Covid Recovered?</Text>
                <View style={styles.checkBoxLine}>
                  <Checkbox
                    color={ThemeColor.red}
                    status={this.state.checkedCovYes ? 'checked' : 'unchecked'}
                    onPress={() => this.handleChangeCheckBox4()}
                  />
                  <Text onPress={() => this.handleChangeCheckBox4()} style={{ fontSize: 16 }}>Yes</Text>
                </View>

                <View style={styles.checkBoxLine}>
                  <Checkbox
                    color={ThemeColor.red}
                    status={this.state.checkedCovNo ? 'checked' : 'unchecked'}
                    onPress={() => this.handleChangeCheckBox5()}
                  />
                  <Text onPress={() => this.handleChangeCheckBox5()} style={{ fontSize: 16 }}>No</Text>
                </View>

              </View>





            </View>


            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.button}
              onPress={() => this.addDonor()}
            >
              <Text style={{ ...styles.text1, alignSelf: 'center' }}>SAVE</Text>
            </TouchableOpacity>




            <Modal
              isVisible={this.state.isVisible1}
              backdropColor='black'
              backdropOpacity={0.3}
              animationIn='slideInUp'
              animationOut='slideOutDown'
              backdropTransitionOutTiming={0}
              animationOutTiming={300}
              animationInTiming={300}
              avoidKeyboard={true}
              onBackButtonPress={() => this.setState({ isVisible1: false })}
              onBackdropPress={() => this.setState({ isVisible1: false })}
              deviceWidth={windowWidth}
              propagateSwipe={true}
              scrollOffset={0.5}
              scrollHorizontal={true}
              style={{ marginHorizontal: 5 }}
            >
              <View style={{ alignItems: 'flex-end', }}>
                <Icon1
                  name='close' size={25} color='white'

                  onPress={() => this.setState({ isVisible1: false })}
                />
              </View>
              <Text style={{ fontSize: 12, marginBottom: 5, color: "white", }}>Hold and drag marker to change location.</Text>
              <MapView

                provider={PROVIDER_GOOGLE}
                style={styles.map}
                showsUserLocation={true}
                onRegionChangeComplete={this.handleRegionChange}
                region={{
                  longitude: this.state.longitude,
                  latitude: this.state.latitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01
                }}
                zoomTapEnabled={true}
                onPress={(e)=>this.mapPressed(e)}
                >


                <Marker draggable
                  coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                  onPress={(e) => this.onMapPress(e)}
                  onDragEnd={(e) => {
                    this.setState({
                      latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude
                    })
                    console.log(this.state.latitude, this.state.longitude)
                  }

                  }

                >

                </Marker>
              </MapView>

            </Modal>

            <Modal
              isVisible={this.state.isVisible2}
              backdropColor='black'
              backdropOpacity={0.3}
              animationIn='bounceIn'
              animationOut='fadeOut'
              backdropTransitionOutTiming={0}
              animationOutTiming={10}
              animationInTiming={300}
              onSwipeComplete={() => {
                this.setState({ isVisible2: false })

              }
              }

              swipeDirection={['right', 'left',]}
              avoidKeyboard={true}

              onBackButtonPress={() => this.setState({ isVisible2: false })}
              onBackdropPress={() => this.setState({ isVisible2: false })}
              deviceWidth={windowWidth}
              propagateSwipe={true}
              scrollOffset={0.5}
              scrollHorizontal={true}
            >
              <View style={styles.cardModal}>
                <ScrollView>
                  <View style={styles.cardModalView}>
                    <Text style={{ alignSelf: 'center', marginVertical: 10 }}>Select Your Blood Group</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flexDirection: 'column', marginRight: 100 }}>

                        <TouchableOpacity
                          style={styles.modalBloodGroup}
                          onPress={() => this.setState({ bloodGroup: 'A+', isVisible2: false })}

                        >
                          <Text style={styles.text1}>A+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.modalBloodGroup}
                          onPress={() => this.setState({ bloodGroup: 'A-', isVisible2: false })}

                        >
                          <Text style={styles.text1}>A-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.modalBloodGroup}
                          onPress={() => this.setState({ bloodGroup: 'B+', isVisible2: false })}

                        >
                          <Text style={styles.text1}>B+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.modalBloodGroup}
                          onPress={() => this.setState({ bloodGroup: 'B-', isVisible2: false })}

                        >
                          <Text style={styles.text1}>B-</Text>
                        </TouchableOpacity>
                      </View>


                      <View style={{ flexDirection: 'column' }}>


                        <TouchableOpacity
                          style={styles.modalBloodGroup}
                          onPress={() => this.setState({ bloodGroup: 'AB+', isVisible2: false })}

                        >
                          <Text style={styles.text1}>AB+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.modalBloodGroup}
                          onPress={() => this.setState({ bloodGroup: 'AB-', isVisible2: false })}

                        >
                          <Text style={styles.text1}>AB-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.modalBloodGroup}
                          onPress={() => this.setState({ bloodGroup: 'O+', isVisible2: false })}

                        >
                          <Text style={styles.text1}>O+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.modalBloodGroup}
                          onPress={() => this.setState({ bloodGroup: 'O-', isVisible2: false })}
                        >
                          <Text style={styles.text1}>O-</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>


            </Modal>


          </NativeBaseProvider>
        </ScrollView>
      </View>


    )
  }
}



const styles = StyleSheet.create({

  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    width: Math.round(windowWidth * 0.95),
    height: Math.round(windowHeight * 0.7)
  },
  cardModalView: {
    height: 350,
    paddingVertical: 10,


  },
  cardModal: {

    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    width: Math.round(windowWidth * 0.7),
    alignSelf: 'center',


  },

  mapBox: {
    borderWidth: 2,
    borderColor: ThemeColor.background,
    borderRadius: 15,
    height: 60,
    backgroundColor: ThemeColor.background,
    marginHorizontal: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row'
  },
  text1: {
    color: ThemeColor.white,
    fontWeight: '600',
    fontSize: 18

  },
  inputBox: {
    borderWidth: 1,
    borderColor: ThemeColor.background,
    backgroundColor: ThemeColor.background,
    borderRadius: 15,
    marginHorizontal: 30,
    height: 60,
    fontSize: 18,
    paddingLeft: 10


  },
  searchText: {

    fontSize: 16,
    marginHorizontal: 30,
    marginTop: 20,
    marginBottom: 10

  },

  modal2: {
    fontSize: 15,
    marginHorizontal: 30,
    marginTop: 20,
    marginBottom: 10,


  },
  bloodBox: {
    marginTop: '5%',
    borderWidth: 2,
    borderColor: ThemeColor.background,
    borderRadius: 15,
    marginHorizontal: Math.round(windowWidth * 0.08),
    height: Math.round(windowHeight * 0.1),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ThemeColor.background,
  },
  modalBloodGroup: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: ThemeColor.red,
    backgroundColor: ThemeColor.red,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
  },
  checkbox: {
    alignSelf: "center",
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: ThemeColor.red,
    color: ThemeColor.white,
    borderRadius: 15,
    height: 50,
    justifyContent: 'center',

    width: Math.round(windowWidth * 0.8),
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 20



  },
  checkBoxLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 5
  }
});

export default App;
