import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TextInput, ScrollView, Platform, TouchableOpacity,Alert,AsyncStorage } from 'react-native';
import Statusbar from './status';
import {
  widthPercentageToDP as wp, heightPercentageToDP as hp,
  listenOrientationChange as loc, removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { Header, CheckBox, Button } from 'react-native-elements';
import Constants from './constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//import RF from "react-native-responsive-fontsize";
const fontName = (Platform.OS === 'ios') ? 'Bahnschrift' : 'bahnschrift';
const fontNameBold = (Platform.OS === 'ios') ? 'Bahnschrift_Bold' : 'bahnschrift_bold';
const apiUrl = Constants.API_URL;
const imgUrl = Constants.IMAGE_URL;
export default class commentAll extends Component {
  _isMounted = false;
  state = {
    checked1: false,
    checked2: false,
    checked3: false,
    msg: '',
    id:'',
    name: '',
    phone: '',
    email : ''
  };

  handleSubmit() {
    if (this.state.msg) {
      AsyncStorage.getItem("userdata").then((info) => {
        if (info) {
          let dt = JSON.parse(info);
          fetch(apiUrl + 'object=reportcase&action=comment', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
        body: 'msg=' + this.state.msg + '&user_id=' + dt.id + '&user_name=' + dt.name
      }).then((response) => 
        response.json())
        .then((responseJson) => {
          if (responseJson.status == 'success') {
            Alert.alert('Message send successfully !!')
            this.props.navigation.navigate('Home');
          } else {
            Alert.alert(responseJson.msg);
          }
        }).catch((error) => {
          console.error(error);
          if (error == 'TypeError: Network request failed') {
            Alert.alert('Something went wrong', 'Kindly check if the device is connected to stable cellular data plan or WiFi.');
          }
        });
        }
      }).done();  
    } else {
      Alert.alert('Please enter message properly!!');
    }
  }

  componentDidMount() {
    loc(this);
  }
  componentWillMount() {
    rol(this);
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    return (
      <View style={{ backgroundColor: '#CAC6C5', width: '100%', height: '100%' }}>
        <Statusbar backgroundColor="#282828" barStyle="light-content" />
        <View>
          <Header backgroundColor='#282828'
            borderBottomWidth='0'
            outerContainerStyles={{
              borderBottomWidth: 0,// remove shadow on iOS
            }}
            leftComponent={{ icon: 'menu', color: '#fff', size:wp('7.5%'), onPress: () => this.props.navigation.openDrawer() }}
            centerComponent={{ text: 'Comments', style: { color: '#fff', fontSize: wp('6.5%'), fontFamily: fontName } }}
          />
        </View>
        <ScrollView>
          <View style={{ width: wp('52%'), paddingLeft: 4, marginLeft: wp('2%'), marginTop: hp('2%'), marginBottom: hp('1%') }}>
            {/* <View style={{ width: wp('auto'), borderRadius: 8, padding: 12, backgroundColor: 'black', }}>
              {/* <TouchableOpacity onPress={() => { this.props.navigation.navigate('CommentAll') }}>
                <Text style={styles.Atextstyle}>General message</Text>
              </TouchableOpacity> 
            </View> */}
            <View style={{ width: wp('auto'), borderRadius: 8, padding: 12, textAlign: 'left' }}>
              {/* <TouchableOpacity
               onPress={() => { this.props.navigation.navigate('CommentOne') }}
              >
                <Text style={{ 
                   fontFamily: fontNameBold,
                   fontSize: wp('5.4%'),
                   color: 'black',
                  }}>Specific attorneys</Text>
              </TouchableOpacity> */}
            </View>
          </View>


          <View style={styles.bottomContainer}>
            <TextInput
              multiline={true}
              numberOfLines={5}
              style={{ fontFamily: fontName, textAlignVertical: "top" }}
              onChangeText={text => this.setState({ msg: text })} 
              placeholder=''
            />
          </View>

          <View style={styles.buttoncontainer}>
            <Button buttonStyle={{
              backgroundColor: '#000',
              width: 180,
              height: 42,
              borderRadius: 24,
              borderWidth: 0.5
            }}
              loadingProps={{ size: 'small', color: 'black' }}
              title='SUBMIT'
              textStyle={{ fontSize: wp('5.4%'), color: '#fff', fontFamily: fontNameBold }}
              onPress={() => this.handleSubmit()}
            />
          </View>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttoncontainer: {
    alignSelf: 'center',
    marginBottom: hp('6%')
  },
  Atextstyle: {
    fontFamily: fontNameBold,
    fontSize: wp('5.4'),
    color: 'white',
    textAlign: 'center'
  },
  textareaContainer: {
    height: 180,
    padding: 5,
    backgroundColor: '#F5FCFF',
  },

  bottomContainer: {
    width: wp('94%'),
    padding: 4,
    height: hp('24%'),
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: hp('6%'),
  }
});