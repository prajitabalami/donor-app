import React from 'react';
import { View, Text, TextInput, StatusBar, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { ThemeColor } from '../colors/ThemeColor';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Toast from 'react-native-simple-toast';


import { api } from '../utils';
import axios from 'axios';


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get('window').height;

class OtpScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            otp_type: 1,
            btnOpacity: 0.5,
            opac: 0.5,
            number: '',

        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        const number = this.props.navigation.getParam('number', '');
        this.setState({ number: number });
        const email = this.props.navigation.getParam('email', 0);
        console.log({ number });


    }


    async sendOtp() {
        console.log("Buton Pressed");
        console.log(this.state.code)
        const article = JSON.stringify({
            number: this.state.number,
            otp: this.state.code
        })



        let config = {
            headers: {

                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        axios.post('http://192.168.121.150:8088/api/user/signup/verify', article, config)
            .then(response => {


                if (response.status === 200) {

                    console.log("response data", response.data);


                    AsyncStorage.setItem('userId', JSON.stringify(response.data.data._id));

                    AsyncStorage.setItem('number', response.data.data.number);


                    this.props.navigation.navigate("Home")
                    Toast.show(response.data.message, Toast.LONG, ['UIAlertController',]);
                }
                if (response.status === 401) {
                    console.log("response data", response);
                    Toast.show(response.data.message, Toast.LONG, ['UIAlertController',]);

                }

            })
            .catch(error => {
                // console.log(error.response.data);
                console.log('There was an error!', error.response.data);
                Toast.show("Invalid OTP", Toast.LONG, ['UIAlertController',]);


            });



    }
    render() {

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBar
                    backgroundColor={ThemeColor.red}
                    barStyle="light-content"
                />
                <ScrollView>
                    <Image
                        style={styles.userLogo}

                        source={require('../images/logo1.png')}
                    />
                    <Text style={{ marginTop: 10, color: 'grey', alignSelf: 'center' }}>Enter Verification Code</Text>
                    <View style={{ marginTop: 20, alignSelf: 'center', marginHorizontal: 10 }}>
                        <SmoothPinCodeInput
                            cellSpacing={Math.round(windowWidth * 0.016)}
                            cellSize={Math.round(windowWidth * 0.12)}
                            codeLength={6}
                            editable={true}
                            cellStyle={{
                                borderBottomWidth: 1,
                                borderColor: 'gray',
                                borderWidth: 1,
                                borderRadius: 10,
                            }}
                            cellStyleFocused={{
                                borderColor: ThemeColor.red,
                            }}
                            value={this.state.code}
                            onTextChange={code => {
                                this.setState({ code });
                                // console.log(code.length)
                                if (code.length != 6) {
                                    this.setState({ btnOpacity: 0.5 })

                                }
                            }

                            }
                            onFulfill={() => {
                                this.setState({ btnOpacity: 1 });
                            }

                            }
                            textStyle={{ fontSize: 24 }}
                        />

                    </View>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={{ ...styles.button }}
                        onPress={() => this.sendOtp()}
                    >
                        <Text style={{ alignSelf: 'center', color: ThemeColor.white, fontSize: 16, fontWeight: '500' }}>SEND</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
}

export default OtpScreen;

const styles = StyleSheet.create({
    userLogo: {
        height: 110,
        width: 110,
        alignSelf: 'center',
        marginBottom: 70,
        marginTop: 50


    },
    button: {
        marginHorizontal: 30,
        backgroundColor: ThemeColor.red,
        color: ThemeColor.white,
        borderRadius: 15,
        height: 50,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 50,
        marginBottom: 20,
        marginHorizontal: 20,
        width: Math.round(windowWidth * 0.85)
    },

})