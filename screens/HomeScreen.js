import React from 'react';
import { View, Text, TextInput, StatusBar, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native';

import { ThemeColor } from '../colors/ThemeColor';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import Icon4 from 'react-native-vector-icons/AntDesign';
import { } from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

import Collapsible from 'react-native-collapsible';
import { Appbar } from 'react-native-paper';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get('window').height;

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed1: true,
      text1: "Blood Group",
      isCollapsed2: true,
      text2: "Blood/Plasma",
      iconUp: 'chevron-up',
      iconDown: 'chevron-down',

      displayForm: 'flex',


    }
  }

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', async () => {
      let _donorId = await AsyncStorage.getItem('donorId');
      let donorId = JSON.parse(_donorId);
      console.log("donorId:", donorId)
      if (donorId !== null) {
        this.setState({ displayForm: 'none' })
      }
      else
        this.setState({ displayForm: 'flex' })
    })
    let _donorId = await AsyncStorage.getItem('donorId');
    let donorId = JSON.parse(_donorId);
    console.log("donorId:", donorId)
    if (donorId !== null) {
      this.setState({ displayForm: 'none' })
    }
    else
      this.setState({ displayForm: 'flex' })



  }

  async searchDonor() {
    console.log("Buton Pressed")
    if(this.state.text1==='Blood Group'||this.state.text2==='Blood/Plasma'){
      Toast.show('Please Select All the Fields', Toast.LONG, ['UIAlertController',]);
    }
    else{
      this.props.navigation.navigate('SearchScreen', { "bloodGroup": this.state.text1, "searchFor": this.state.text2 });
    }
   



  }

  render() {
    return (


      <View style={{ backgroundColor: '#fff', flex: 1, }}>
        <ScrollView>
          {/* <Appbar.Header style={{ backgroundColor: ThemeColor.background }}>


          <Appbar.Content >


          </Appbar.Content>

          

        </Appbar.Header> */}

          <StatusBar

            backgroundColor={ThemeColor.red}
            barStyle="light-content"
          />

          <View style={{ flexDirection: 'row' }}>

            <Image
              style={styles.userLogo}

              source={require('../images/logo1.png')}
            />

            <View style={{ marginTop: 10, flexDirection: 'column', justifyContent: 'center', position: 'absolute', right: 10 }}>
              <TouchableOpacity
                style={styles.formRound}
                onPress={() => this.props.navigation.navigate('ProfileScreen')}
              >
                <Icon3

                  name='user-edit' size={25} style={{ color: ThemeColor.red, }} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.formRound, display: this.state.displayForm }}
                onPress={() => this.props.navigation.navigate('DonateForm')}
              >
                <Icon1

                  name='wpforms' size={25} style={{ color: ThemeColor.red, }} />

              </TouchableOpacity>


            </View>

          </View>


          <Text style={{ marginTop: 60, color: ThemeColor.red, fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>Search For:</Text>

          <TouchableOpacity
            onPress={() => this.setState({ isCollapsed1: !this.state.isCollapsed1 })}
            style={{ ...styles.search, marginTop: 40 }}
          >
            <Text style={styles.searchText}>{this.state.text1}</Text>
            <Icon
              style={styles.icon}
              name={this.state.isCollapsed1 ? this.state.iconDown : this.state.iconUp} size={18} />

          </TouchableOpacity>
          <View style={styles.bloodGroups}>
            <Collapsible
              collapsed={this.state.isCollapsed1}
            >
              <View style={styles.row1}>

                <TouchableOpacity
                  onPress={() => this.setState({ text1: "A+", isCollapsed1: true })}
                  style={styles.round}
                >
                  <Text style={styles.text1}>A+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.round}
                  onPress={() => this.setState({ text1: "A-", isCollapsed1: true })}
                >
                  <Text style={styles.text1}>A-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.round}
                  onPress={() => this.setState({ text1: "B+", isCollapsed1: true })}
                >
                  <Text style={styles.text1}>B+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.round}
                  onPress={() => this.setState({ text1: "B-", isCollapsed1: true })}
                >
                  <Text style={styles.text1}>B-</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row1}>
                <TouchableOpacity
                  style={styles.round}
                  onPress={() => this.setState({ text1: "AB+", isCollapsed1: true })}
                >
                  <Text style={styles.text1}>AB+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.round}
                  onPress={() => this.setState({ text1: "AB-", isCollapsed1: true })}
                >
                  <Text style={styles.text1}>AB-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.round}
                  onPress={() => this.setState({ text1: "O+", isCollapsed1: true })}
                >
                  <Text style={styles.text1}>O+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.round}
                  onPress={() => this.setState({ text1: "O-", isCollapsed1: true })}
                >
                  <Text style={styles.text1}>O-</Text>
                </TouchableOpacity>
              </View>
            </Collapsible>

          </View>

          <TouchableOpacity
            onPress={() => this.setState({ isCollapsed2: !this.state.isCollapsed2 })}
            style={styles.search}
          >
            <Text style={styles.searchText}>{this.state.text2}</Text>
            <Icon
              style={styles.icon}
              name={this.state.isCollapsed2 ? this.state.iconDown : this.state.iconUp} size={18} />

          </TouchableOpacity>

          <View>
            <Collapsible collapsed={this.state.isCollapsed2}>
              <View>
                <TouchableOpacity
                  onPress={() => this.setState({ text2: "Blood", isCollapsed2: true })}
                  style={styles.searchFor}>
                  <Text style={styles.text1}>Blood</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ text2: "Plasma", isCollapsed2: true })}
                  style={styles.searchFor}>
                  <Text style={styles.text1}>Plasma</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ text2: "Covid Plasma", isCollapsed2: true })}
                  style={styles.searchFor}>
                  <Text style={styles.text1}>Covid Plasma</Text>
                </TouchableOpacity>
              </View>
            </Collapsible>
          </View>

          <TouchableOpacity
            onPress={() => {
              this.setState({
                text1: "Blood Group", text2: "Blood/Plasma"
              });
              this.searchDonor();
            }}
            style={{ ...styles.searchButton }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: ThemeColor.white }}>SEARCH</Text>
            {/* <Icon1 name="search" color={ThemeColor.white} size={25} style={{position:'absolute',right:30}} /> */}

          </TouchableOpacity>

          <View style={styles.cardView}>
            <View style={styles.card}>

              <Swiper
                style={styles.swiperBox}
                showsButtons={false}
                autoplay={true}
                // horizontal={false}
                // dotStyle={{ display: 'none' }}
                activeDotStyle={{ marginBottom: -10 }}
                dotStyle={{ marginBottom: -10 }}
                activeDotColor={ThemeColor.red}
                inactiveDotColor='white'
                autoplayTimeout={3}
                loop={false}
              >
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', }}  >
                  {/* <Image style={styles.swiperImg} source={require('../images/logo1.png')}/> */}
                  <Text style={styles.swiperText}>"Donate blood and be the reason of smile to many faces".</Text>

                </View>


                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.swiperText}>"Never refuse to donate blood if you can, as you may be the next needy."</Text>

                </View>

              </Swiper >

            </View>
          </View>






        </ScrollView >
      </View >
    )
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    marginTop: '5%',
    borderWidth: 2,
    borderColor: ThemeColor.background,
    borderRadius: 10,
    marginHorizontal: Math.round(windowWidth * 0.1),
    height: Math.round(windowHeight * 0.08),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ThemeColor.background,


  },
  icon: {
    color: ThemeColor.red,
    marginLeft: 10,
    fontWeight: '600'

  },
  searchText: {
    color: ThemeColor.red,
    fontSize: 18,
    fontWeight: '600'
  },
  round: {
    borderWidth: 1,
    height: Math.round(windowWidth * 0.14),
    width: Math.round(windowWidth * 0.14),
    borderRadius: Math.round(windowWidth * 0.14),
    borderColor: ThemeColor.red,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ThemeColor.red,
    marginHorizontal: 10,
  },
  text1: {
    color: ThemeColor.white,
    fontWeight: '600',
    fontSize: 18

  },

  bloodGroups: {
    //  marginHorizontal: Math.round(windowWidth * 0.1),
    alignItems: 'center'


  },
  row1: {
    flexDirection: 'row',
    marginTop: 30

  },

  searchButton: {
    height: Math.round(windowHeight * 0.08),
    width: Math.round(windowWidth * 0.8),
    borderWidth: 1,
    borderColor: ThemeColor.red,
    backgroundColor: ThemeColor.red,
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',

    marginTop: 40

  },

  searchFor: {
    marginTop: '5%',
    borderWidth: 2,
    borderColor: ThemeColor.red,
    borderRadius: 10,
    marginHorizontal: Math.round(windowWidth * 0.1),
    height: Math.round(windowHeight * 0.08),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ThemeColor.red,

  },
  formRound: {
    backgroundColor: 'white',
    borderRadius: 60,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    width: 60,
    height: 60,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20



  },
  userLogo: {
    height: 110,
    width: 110,
    zIndex: 1,
    marginLeft: 20,
    marginTop: 40

  },
  swiperBox: {
    // height: Math.round(windowHeight * 0.2),
    // width: Math.round(windowWidth * 0.6),
    // paddingHorizontal: 10

  },
  swiperText: {
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: 'black',
    elevation: 3,
    shadowOpacity: 0.7,
    shadowOffset: {
      height: 4,
      width: 4,
    },

    shadowRadius: 5,
    marginHorizontal: 30,


  },
  cardView: {

    height: Math.round(windowHeight * 0.16),
    marginBottom: 10,
    marginTop: 60,

    //  justifyContent: 'center',
  },

  swiperImg: {
    height: 60,
    width: 60,
  }

})