// import React from 'react';
// import { View, Text, ScrollView, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native';

//import { createAppContainer } from 'react-navigation';
// import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from './screens/HomeScreen';
import DonateForm from './screens/DonateForm';

import React from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import OtpScreen from './screens/OtpScreen';
import SearchScreen from './screens/SearchScreen';



const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: () => ({
        headerShown: false,
      })
    },
    DonateForm: DonateForm,
    RegisterScreen:RegisterScreen,
    ProfileScreen:ProfileScreen,
    OtpScreen:OtpScreen,
    SearchScreen:SearchScreen,
  },
  {
    initialRouteName: 'RegisterScreen',
    headerMode:"screen"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return  <AppContainer screenProps={{ ...this.state }} />;
   
  }
}

