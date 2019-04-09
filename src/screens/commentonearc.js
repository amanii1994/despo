import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TextInput, ScrollView, Platform,TouchableOpacity, AsyncStorage } from 'react-native';
import Statusbar from './status';
import {
  widthPercentageToDP as wp, heightPercentageToDP as hp,
  listenOrientationChange as loc, removeOrientationListener as rol
} from 'react-native-responsive-screen';
import moment from 'moment';
import { Header,Icon } from 'react-native-elements';
//import RF from "react-native-responsive-fontsize";
import Constants from './constants';
const apiUrl = Constants.API_URL;
const imgUrl = Constants.IMAGE_URL;
const fontName = (Platform.OS === 'ios') ? 'Bahnschrift' : 'bahnschrift';
const fontNameBold = (Platform.OS === 'ios') ? 'Bahnschrift_Bold' : 'bahnschrift_bold';

export default class CommentOne extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      dataRes: {},
      dataMsg: '',
      status: '',
    }
  }
  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      AsyncStorage.getItem("user_id").then((info) => {
        if (info) {
          fetch(apiUrl + 'object=user&action=fetchSpecificMessageArc&user_id=' + info)
            .then((response) =>
              response.json())
            .then((responseJson) => {
              //console.log(responseJson)
              if (responseJson.status == 'success') {
                this.setState({ dataRes: responseJson.result, status: 'success' })
              } else {
                this.setState({ dataMsg: responseJson.msg, status: 'error' })
              }
            }).catch((error) => {
              console.error(error);
              if (error == 'TypeError: Network request failed') {
                Alert.alert('Something went wrong', 'Kindly check if the device is connected to stable cellular data plan or WiFi.');
              }
            });
        }
      }).done();
    }
    loc(this);
  }
  componentWillReceiveProps() {
    this._isMounted = true;
    if (this._isMounted) {
      AsyncStorage.getItem("user_id").then((info) => {
        if (info) {
          fetch(apiUrl + 'object=user&action=fetchSpecificMessageArc&user_id=' + info)
            .then((response) =>
              response.json())
            .then((responseJson) => {
              //console.log(responseJson)
              if (responseJson.status == 'success') {
                this.setState({ dataRes: responseJson.result, status: 'success' })
              } else {
                this.setState({ dataMsg: responseJson.msg, status: 'error' })
              }
            }).catch((error) => {
              console.error(error);
              if (error == 'TypeError: Network request failed') {
                Alert.alert('Something went wrong', 'Kindly check if the device is connected to stable cellular data plan or WiFi.');
              }
            });
        }
      }).done();
      }
  }
    componentWillMount() {
      rol(this);
    }
    componentWillUnmount() {
      this._isMounted = false;
    }
    
    renderItems() {
      let table = []
      if (this.state.status == 'success') {
        // Outer loop to create parent
        for (let i = 0; i < this.state.dataRes.length; i++) {
          //Create the parent and add the children
          let val = this.state.dataRes[i];
          let key = i;
          table.push(<TouchableOpacity key={key} style={styles.containerFeed}>
            <View style={styles.boxstyle}>
              <View style={{ width: wp('90%'), justifyContent: 'center', padding: '2%' }}>
                <Text style={{ textAlign: 'justify', color: 'white', fontSize: wp('3.5%'), fontFamily: fontName }}>{val.title}</Text>
                {/* <Text style={{ textAlign: 'justify', color: 'white', fontSize: wp('3.5%'), fontFamily: fontName }}>{val.message}</Text> */}
                <Text style={{ textAlign: 'justify', color: 'white', fontSize: wp('3.5%'), fontFamily: fontName, paddingTop: hp('1%') }}>Created: {moment(val.created).format('h:mm:ss a')}</Text>           
              </View>
            </View>
          </TouchableOpacity>)
        }
      } else {
        table.push(<Text key={'errMsg'} style={{ fontFamily: fontName, color: '#000', textAlign: 'center', fontSize: wp('4.5%') }}>{this.state.dataMsg}</Text>)
      }
      return table;
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
              leftComponent={{ icon: 'menu', color: '#fff', size: wp('7.5%'), onPress: () => this.props.navigation.openDrawer() }}
              centerComponent={{ text: 'Archived', style: { color: '#fff', fontSize: wp('6.5%'), fontFamily: fontName } }}
            />
          </View>
          <ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'center', width: wp('80%'), marginLeft: wp('8%'), marginRight: wp('3%'), marginTop: hp('2%'), marginBottom: hp('2%') }}>
              <View style={{ width: 'auto', borderRadius: 8, padding: 12, textAlign: 'left' }}>
                <TouchableOpacity style={{width:wp('43%')}}
                  onPress={() => { this.props.navigation.navigate('MessageArc') }} >
                  <Text style={{
                    fontFamily: fontNameBold,
                    fontSize: wp('5.4%'),
                    alignSelf:'center',
                    color: 'black',
                  }}>General</Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: 'auto', borderRadius: 8, padding: 12, backgroundColor: 'black', textAlign: 'right' }}>
                <TouchableOpacity style={{width:wp('43%')}}
                  onPress={() => { this.props.navigation.navigate('CommentOneArc') }} >
                  <Text style={{
                    fontFamily: fontNameBold,
                    fontSize: wp('5.4%'),
                    alignSelf:'center',
                    color: 'white',
                  }}>Specific</Text>
                </TouchableOpacity>
              </View>
            </View>
            {this.renderItems()}
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
      fontFamily: fontName,
      fontSize: wp('5%'),
      color: 'black',
    },
    bottomContainer: {
      height: hp('20%'),
      width: wp('95%'),
      alignSelf: 'center',
      borderRadius: 8,
      borderWidth: 1,
      marginBottom: hp('6%'),
    },
    containerFeed: {
      width: wp('94%'),
      height: 'auto',
      backgroundColor: 'black',
      alignSelf: 'center',
      borderRadius: 8,
      paddingBottom: 12,
      paddingTop: 4,
      marginBottom: hp('2%'),
    },
    boxstyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 1,
      marginBottom: 1,
      marginLeft: wp('2%'),
      marginRight: wp('2%'),
    },
  });