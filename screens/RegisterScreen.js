import React from 'react';
import { View, Text, TextInput, StatusBar, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { ThemeColor } from '../colors/ThemeColor';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { api } from '../utils';
import axios from 'axios';


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get('window').height;

class RegisterScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            number: '',
            email: '',
        }
    }
    componentDidMount() {
        AsyncStorage.removeItem("id");
        AsyncStorage.removeItem("donorId");
    }

    sendNumber() {
        
        console.log("Buton Pressed")
        if (this.state.number === '' || this.state.email === '') {
            Toast.show('Please Provide All the Fields', Toast.LONG, ['UIAlertController',]);
        }

        else if(!this.validateEmail()){
            Toast.show('Please enter a valid email.', Toast.LONG, ['UIAlertController',]); 
        }
        else if(!this.validateNumber()){
            Toast.show('Please enter a valid number.', Toast.LONG, ['UIAlertController',]);
        }

        else {
            const article = JSON.stringify({
                number: this.state.number,
                email: this.state.email
            })



            let config = {
                headers: {

                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }


            axios.post('http://192.168.121.150:8088/api/user/signup', article, config)
                .then(response => {
                    if (response.status === 200) {


                        console.log("response data", response.data);

                        // Toast.show('Information Saved', Toast.LONG, ['UIAlertController',]);
                        this.props.navigation.navigate('OtpScreen', { "number": this.state.number, "email": this.state.email });
                    }
                })
                .catch(error => {
                    // console.log(error.response.data);
                    console.log('There was an error!', error);
                });
        }

    }
    validateEmail() {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(this.state.email) === false) {
            console.log("Email is Not Correct");
           // this.setState({ email: text })
            return false;
        }
        else {
            //this.setState({ email: text })
            console.log("Email is Correct");
            return true;
        }
    }
    validateNumber(){
        if(this.state.number.length<10)
            return false
        else
            return true
    }

    async s() {
        try {
            let responseJson = await api.getOtp(this.state.number, this.state.email);
            console.log('Status', responseJson);
            // if (this.state.phnNumber.length < 10) {
            //     Toast.show('Please enter a valid number', Toast.LONG, ['UIAlertController',])
            //     this.setState({ spinner: false })

            // }

            // if (responseJson.Header.Status === 200) {


            //     this.setState({ spinner: false })

            //     //Toast.show('Check your message for verification code', Toast.LONG, ['UIAlertController',])

            //     this.props.navigation.navigate('OtpScreen', { "phnNumber": phnNumber, "otp": responseJson.Body.otp });
            // }
            // else {
            //     this.setState({ spinner: false })
            //     alert(responseJson.Error.message)
            // }
        }
        catch (error) {
            //Toast.show('Something went wrong', Toast.LONG, ['UIAlertController',])
            //this.setState({ spinner: false })
            console.log(error);
        }
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
                    <Text style={styles.searchText}>Number:</Text>
                    <TextInput
                        keyboardType="number-pad"
                        placeholder="Enter your Number"
                        maxLength={10}
                        style={styles.inputBox}
                        onChangeText={(value) => this.setState({ number: value })}
                    />
                    <Text style={styles.searchText}>Email:</Text>
                    <TextInput

                        placeholder="Enter your Email"
                        style={styles.inputBox}
                        onChangeText={(value) => this.setState({ email: value })}
                    />
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.button}
                        onPress={() => this.sendNumber()}
                    >
                        <Text style={{ alignSelf: 'center', color: ThemeColor.white, fontSize: 16, fontWeight: '500' }}>SEND</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>


        )
    }
}

export default RegisterScreen;

const styles = StyleSheet.create({
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

