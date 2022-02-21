import React from 'react';
import { View, Text, Image, TextInput, StatusBar, StyleSheet, TouchableOpacity, Switch, Dimensions, ScrollView, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';
import { Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { ThemeColor } from '../colors/ThemeColor';


import Modal from "react-native-modal";
import Toast from 'react-native-simple-toast';


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get('window').height;




class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible1: false,
            isEnabled: false,
            selectedGroup: 'key1',
            ItemList: [
                { props: "A+", value: "key1" },
                { props: "A-", value: "key2" },
                { props: "B+", value: "key3" },
                { props: "B-", value: "key4" },
            ],
            name: '--',
            number: '--',
            blood_group: '--',

            checkedDonateBlood: false,
            checkedDonatePlasma: false,
            checkedDonateCovPlasma: false,
            checkedCovYes: false,
            checkedCovNo: false,
            opacityDynamic: 0.5,
            status: "--",
            userId: ',',
            latitude: 0,
            longitude: 0,


        }
    }

    async componentDidMount() {
        this.getuserProfile();

    }

    async getuserProfile() {
        let _userId = await AsyncStorage.getItem('donorId');
        var userId = JSON.parse(_userId);
        console.log("ID", userId);
        this.setState({ userId: userId });

        try {
            let response = await fetch('http://192.168.121.150:8088/api/user/getprofile/' + userId, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: ''
            });

            let responseJson = await response.json();


            if (response.status === 200) {
                console.log('responseJson', responseJson);
                this.setState({
                    name: responseJson.name, number: responseJson.number, blood_group: responseJson.blood_group,
                    isEnabled: responseJson.availability, checkedDonateBlood: responseJson.donate_blood, checkedDonatePlasma: responseJson.donate_plasma,
                    checkedDonateCovPlasma: responseJson.donate_cov_plasma, latitude: responseJson.latitude, longitude: responseJson.longitude
                });
                this.state.isEnabled ? this.setState({ opacityDynamic: 1, status: "Active" }) : this.setState({ opacityDynamic: 0.5, status: "Inactive" })

                responseJson.cov_recov ? this.setState({ checkedCovYes: true }) : this.setState({ checkedCovNo: true })


            }
        }
        catch (error) {
            console.log(error)
        }
    }


    cancelEdit() {
        this.setState({ isVisible1: false })
    }
    async saveEdit() {
        this.setState({ isVisible1: false });
        const article = JSON.stringify({
            name: this.state.name,
            number: this.state.number,
            blood_group: this.state.blood_group,
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            availability: this.state.isEnabled,
            donate_blood: this.state.checkedDonateBlood,
            donate_plasma: this.state.checkedDonatePlasma,
            donate_cov_plasma: this.state.checkedDonateCovPlasma,
            cov_recov: this.state.covRecov,


        })
        console.log("request data",article)



        let config = {
            headers: {
    
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          }
    
          axios.put('http://192.168.121.150:8088/api/user/update/'+this.state.userId, article, config)
            .then(response => {
              if (response.status === 200) {
                console.log(response.data);
                console.log("created");
                //Toast.show('Donor Information Updated', Toast.LONG, ['UIAlertController',]);
               
              }
            })
            .catch(error => {
              // console.log(error.response.data);
              console.log('There was an error!', error);
            });

            this.getuserProfile();


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

    render() {
        return (
            <View style={{ flex: 1, }}>

                <ScrollView>
                    <Image
                        style={styles.userLogo}

                        source={require('../images/user1.png')}
                    />


                    <View style={styles.container}>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.text} >Name: </Text>
                            <Text style={styles.text2}>{this.state.name}</Text>

                        </View>



                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.text}>Phone Number: </Text>
                            <Text style={styles.text2}>{this.state.number}</Text>

                        </View>


                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.text}>Blood Group: </Text>
                            <Text style={styles.text2}>{this.state.blood_group}</Text>

                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.text}>Donation Status: </Text>
                            <Text style={styles.text2}>{this.state.status}</Text>

                        </View>



                    </View>
                    <TouchableOpacity
                        style={{ ...styles.inputBox, justifyContent: 'center' }}
                        onPress={() => this.setState({ isVisible1: true })}
                    //onPress={()=>this.props.navigation.navigate('DonateForm')}
                    >
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>

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
                                    <Text style={{ marginBottom: 5 }}>Name: </Text>
                                    <TextInput
                                        value={this.state.name}
                                        style={styles.inputLine}
                                        onChangeText={(name) => this.setState({ name })}
                                        
                                    />
                                    <Text style={{ marginTop: 10, marginBottom: -10 }}>Select Blood Group: </Text>


                                    <View style={{ ...styles.inputLine, marginTop: 20 }}>

                                        <RNPickerSelect
                                            onValueChange={
                                                (value) => this.setState({ blood_group: value })
                                            }
                                            items={[
                                                { label: 'A+', value: 'A+' },
                                                { label: 'A-', value: 'A-' },
                                                { label: 'B+', value: 'B+' },
                                                { label: 'B-', value: 'B-' },
                                                { label: 'AB+', value: 'AB+' },
                                                { label: 'AB-', value: 'AB-' },
                                                { label: 'O+', value: 'O+' },
                                                { label: 'O-', value: 'O-' },
                                            ]}
                                        />
                                    </View>

                                    <View style={{ marginTop: 30, flexDirection: 'row', }}>
                                        <Text style={{ fontSize: 16 }}>Available for Donation</Text>
                                        <Switch
                                            trackColor={{ false: "#767577", true: ThemeColor.red }}
                                            thumbColor={this.state.isEnabled ? "grey" : "#f4f3f4"}
                                            ios_backgroundColor="#3e3e3e"

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
                                        style={{ opacity: this.state.opacityDynamic }}>

                                        <View style={styles.checkBoxLine}>
                                            <Checkbox
                                                color={ThemeColor.red}
                                                status={this.state.checkedDonateBlood ? 'checked' : 'unchecked'}
                                                onPress={() => this.handleChangeCheckBox1()}
                                            />
                                            <Text style={{ fontSize: 16 }}>Donate Blood</Text>
                                        </View>
                                        <View style={styles.checkBoxLine}>
                                            <Checkbox
                                                color={ThemeColor.red}
                                                status={this.state.checkedDonatePlasma ? 'checked' : 'unchecked'}
                                                onPress={() => this.handleChangeCheckBox2()}
                                            />
                                            <Text style={{ fontSize: 16 }}>Donate Plasma</Text>
                                        </View>

                                        <View style={styles.checkBoxLine}>
                                            <Checkbox
                                                color={ThemeColor.red}
                                                status={this.state.checkedDonateCovPlasma ? 'checked' : 'unchecked'}
                                                onPress={() => this.handleChangeCheckBox3()}
                                            />
                                            <Text style={{ fontSize: 16 }}>Donate Covid Plasma</Text>
                                        </View>


                                        <View style={{ marginTop: 20 }}>
                                            <Text style={{ fontSize: 16, marginBottom: -5 }}>Covid Recovered?</Text>
                                            <View style={styles.checkBoxLine}>
                                                <Checkbox
                                                    color={ThemeColor.red}
                                                    status={this.state.checkedCovYes ? 'checked' : 'unchecked'}
                                                    onPress={() => this.handleChangeCheckBox4()}
                                                />
                                                <Text style={{ fontSize: 16 }}>Yes</Text>
                                            </View>

                                            <View style={styles.checkBoxLine}>
                                                <Checkbox
                                                    color={ThemeColor.red}
                                                    status={this.state.checkedCovNo ? 'checked' : 'unchecked'}
                                                    onPress={() => this.handleChangeCheckBox5()}
                                                />
                                                <Text style={{ fontSize: 16 }}>No</Text>
                                            </View>


                                        </View>
                                    </View>

                                    <View style={styles.saveEdit}>

                                        <TouchableOpacity
                                            onPress={() => this.saveEdit()}

                                            style={styles.save}>
                                            <Text style={styles.editText}>Save</Text>

                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => this.cancelEdit()}
                                            style={styles.save}
                                        >
                                            <Text style={styles.editText}>Cancel</Text>

                                        </TouchableOpacity>

                                    </View>


                                </View>






                            </ScrollView>
                        </View>


                    </Modal>


                </ScrollView >

            </View >
        )
    }
}

export default ProfileScreen;

const styles = StyleSheet.create({
    containerView: {

        paddingHorizontal: 20,

    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        padding: 10,
        shadowColor: '#ffffff',
        elevation: 2,
        shadowOpacity: 0.7,
        shadowOffset: {
            height: 4,
            width: 4,
        },
        shadowRadius: 5,
        marginHorizontal: 30,
        marginTop: 50,
        paddingTop: 30,
        paddingBottom: 30


    },
    text: {
        flex: 1,
        fontSize: 16,
        padding: 5,
        color: 'grey',




    },
    text2: {
        fontSize: 16,
        padding: 5,
        color: "grey",
        fontWeight: 'bold'



    },
    userLogo: {
        height: 100,
        width: 100,
        zIndex: 1,
        alignSelf: 'center',
        marginTop: 50,

    },
    inputBox: {
        borderWidth: 1,
        borderColor: ThemeColor.red,
        backgroundColor: ThemeColor.red,
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        marginHorizontal: 30,
        height: 60,
        fontSize: 16,
        paddingLeft: 10


    },
    cardModalView: {
        height: 500,
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
        width: Math.round(windowWidth * 0.7),
        alignSelf: 'center',


    },

    inputLine: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,

    },
    checkBoxLine: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    saveEdit: {
        flexDirection: 'row',
        marginVertical: 5,

    },
    save: {
        borderWidth: 1,
        width: '50%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ThemeColor.red
    },
    cancel: {
        borderWidth: 1,
        width: '50%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ThemeColor.red
    },

    editText: {
        fontSize: 16,
        color: ThemeColor.background,
        alignSelf: 'center',
        fontSize: 16,
    }

})