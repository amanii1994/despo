import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, TouchableOpacity, Platform,Linking } from 'react-native';
import Statusbar from './status';
import {
  widthPercentageToDP as wp, heightPercentageToDP as hp,
  listenOrientationChange as loc, removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { Header, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from './constants';
const apiUrl = Constants.API_URL;
const imgUrl = Constants.IMAGE_URL;
const fontName = (Platform.OS === 'ios') ? 'Bahnschrift' : 'bahnschrift';
const fontNameBold = (Platform.OS === 'ios') ? 'Bahnschrift_Bold' : 'bahnschrift_bold';
export default class Contact extends Component {
  componentDidMount() {
    loc(this);
  }
  componentWillMount() {
    rol(this);
  }
  render() {
    return (
      <View style={{ backgroundColor: '#8c8c8c', width: '100%', height: '100%' }}>
        <Statusbar backgroundColor="#282828" barStyle="light-content" />
        <View>
          <Header backgroundColor='#282828'
            borderBottomWidth='0'
            outerContainerStyles={{
              borderBottomWidth: 0,// remove shadow on iOS
            }}   
            //  leftComponent={{ icon: 'arrowleft', color: '#fff', size: 33, onPress: () => this.props.navigation.openDrawer() }}
            leftComponent={<Icon
              name={'keyboard-backspace'}
              color={'#fff'}
              size={wp('7.5%')}
              onPress={() => this.props.navigation.navigate('Home')}
            />}
            centerComponent={{ text: 'Contact Us', style: { color: '#fff', fontSize:wp('7%'), fontFamily: fontName } }}
          />
        </View>
        <ScrollView>
          <View style={{marginTop:hp('2%')}}>
            <Text style={{ marginLeft:wp('2%'),textAlign: 'center', lineHeight:hp('3%'), fontFamily: fontName ,fontSize:wp('4%')}}>CDL Dispo is provided to you by CDL Consultants, Inc. CDL Consultants provides safety and compliance services to motor carriers and professional drivers in all 50 states. In today’s highly regulated environment it is important that those in the trucking industry exercise diligence and understand options that exist to manage and mitigate violations that can cause high scores and poor ratings. These factors increase the cost of doing business and decrease profitability. CDL Consultants has the expertise and experience to guide companies through these difficult times. Let us work for you.</Text>
          </View>
          <View>
            <View style={{ alignSelf: 'center' }}>
              <Text style={{ textAlign: 'center', lineHeight:hp('5%'), fontFamily: fontName ,fontSize:wp('4.8%')}}>
                <Icon
                  name='email'
                  type='font-awesome'
                  size={wp('4.8%')}
                  color='black'
                />  dispo@cdlconsultants.com</Text>
            </View>
            <View style={{ alignSelf: 'center' }}>
              <Text style={{ textAlign: 'center', lineHeight: 22, fontFamily: fontName, fontSize:wp('4.8') }}>
                <Icon
                  name='phone'
                  type='font-awesome'
                  size={wp('4.8%')}
                  color='black'
                />  888-391-9381</Text>
            </View>
          </View>
          <View style={{marginTop:hp('2%')}}>
            <View style={{ flexDirection: 'row',alignSelf:'center'}}>
              <View style={{ width: wp('50%'),height:hp('12%') ,justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com/cdlconsultant/')} style={styles.touchstyle}>
                  <Text style={styles.touchtext}><Icon
                    name='facebook'
                    type='font-awesome'
                    size={wp('6%')}
                    color='white'
                  />  Facebook</Text>
                </TouchableOpacity>
              </View>
              <View style={{ width:wp('50%'), justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => Linking.openURL('https://search.google.com/local/writereview?placeid=ChIJXZPDbaqTD4gR0q0_4JS0xjg')} style={styles.touchstyle}>
                  <Text style={{ textAlign: 'center', lineHeight: 22, color: 'white', fontSize: 20, fontFamily: fontName }}><Icon
                    name='google'
                    type='font-awesome'
                    size={wp('6%')}
                    color='white'
                  />  Google</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ alignSelf: 'center', marginTop: '5%', marginBottom:'20%', width: '100%' }}>
              <View style={{ width: '40%', justifyContent: 'center', alignSelf: 'center', alignItems: 'center', }}>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.yelp.com/biz/cdl-consultants-waukegan')} style={styles.touchstyle}>
                  <Text style={styles.touchtext}><Icon
                    name='yelp'
                    type='font-awesome'
                    size={wp('6%')}
                    color='white'
                  />  Yelp</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  touchtext:{ 
    textAlign: 'center', 
    lineHeight: 22, 
    color: 'white', 
    fontSize:wp('5.4%'), 
    fontFamily: fontName 
  },
  touchstyle:{ 
    width: wp('45%'),
    backgroundColor: 'black', 
    borderRadius: 24,
    borderWidth: 0.5,
    alignSelf:'center',
    padding:wp('4%') 
  },
});
