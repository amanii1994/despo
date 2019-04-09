import React, { Component } from 'react';
import { TouchableHighlight, ScrollView, StyleSheet, Text, View, Image, TextInput, Platform } from 'react-native';
import Statusbar from './status';
import {
  widthPercentageToDP as wp, heightPercentageToDP as hp,
  listenOrientationChange as loc, removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { Button } from 'react-native-elements';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
//import {createStyles, maxWidth, minWidth } from 'react-native-media-queries';
export default class Login extends Component {
  componentDidMount() {
    loc(this);
  }
  componentWillMount() {
    rol(this);
  }
  render() {
    return (
      <View style={{ backgroundColor: '#CAC6C5', width: '100%', height: '100%' }}>
        <ScrollView>
          <Statusbar backgroundColor="#8c8c8c" barStyle="light-content" />
          <View style={{ marginBottom: 70 }}>
            <Image source={require('./img/header.jpg')}
              style={{
                width: wp('100%'),
                height: hp('19%'),
                position: 'relative'
              }} />
            <View style={{ position: 'absolute', alignSelf: 'center', marginBottom: 33 }}>
              <View style={{ alignSelf: 'center', marginTop: hp('12%'), position: 'relative' }}>
                <Image source={require('./img/profilepic.jpg')}
                  style={{ width: 100, height: 100, borderRadius: 50 }} />
                <Image source={require('./img/plus1.png')} style={{ position: 'absolute', bottom: 0, right: 0 }} />
              </View>
            </View>
          </View>

          <KeyboardAwareScrollView style={styles.container} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={false}>
            <View style={styles.container}>
              <Image source={require('./img/user1.png')} style={styles.iconstyle} />
              <TextInput placeholder='User'
                placeholderTextColor='black'
                style={styles.inputtextstyle}
                onChangeText={text => this.setState({ user: text })} />
            </View>
          </KeyboardAwareScrollView>


          <KeyboardAwareScrollView style={styles.container} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={false}>
            <View style={styles.container}>
              <Image source={require('./img/mail1.png')} style={styles.iconstyle} />
              <TextInput placeholder='Email address'
                placeholderTextColor='black'
                style={styles.inputtextstyle}
                onChangeText={text => this.setState({ user: text })} />
            </View>
          </KeyboardAwareScrollView>

          <View style={styles.container1}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={require('./img/gender.png')} style={{ marginTop: 4 }} />
              <Text style={styles.radiotext1}>Gender</Text>
              <RadioGroup size={16} style={{ flexDirection: 'row', marginTop: -4 }} color='black'>
                <RadioButton><Text style={styles.buttontext}>Male</Text></RadioButton>
                <RadioButton><Text style={styles.buttontext}>Female</Text></RadioButton>
              </RadioGroup>
            </View>
          </View>

          <KeyboardAwareScrollView style={styles.container} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={false}>
            <View style={styles.container}>
              <Image source={require('./img/phone.png')} style={styles.iconstyle} />
              <TextInput placeholder='Phone'
                placeholderTextColor='black'
                style={styles.inputtextstyle}
                onChangeText={text => this.setState({ phone: text })} />
            </View>
          </KeyboardAwareScrollView>

          <KeyboardAwareScrollView style={styles.container} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={false}>
            <View style={styles.container}>
              <Image source={require('./img/city.png')} style={styles.iconstyle} />
              <TextInput placeholder='City'
                placeholderTextColor='black'
                style={styles.inputtextstyle}
                onChangeText={text => this.setState({ city: text })} />
            </View>
          </KeyboardAwareScrollView>

          <KeyboardAwareScrollView style={styles.container} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={false}>
            <View style={styles.container}>
              <Image source={require('./img/state.png')} style={styles.iconstyle} />
              <TextInput placeholder='State'
                placeholderTextColor='black'
                style={styles.inputtextstyle}
                onChangeText={text => this.setState({ state: text })} />
            </View>
          </KeyboardAwareScrollView>

          <View style={styles.container}>
            <Image source={require('./img/zipcode.png')} style={styles.iconstyle} />
            <TextInput placeholder='Zip code'
              placeholderTextColor='black'
              style={styles.inputtextstyle}
              onChangeText={text => this.setState({ zip: text })} />
          </View>

          <KeyboardAwareScrollView style={styles.container}
            resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={false}>
            <View style={styles.container}>
              <Image source={require('./img/calendar.png')} style={styles.iconstyle} />
              <TextInput placeholder='Birth date'
                placeholderTextColor='black'
                style={styles.inputtextstyle}
                onChangeText={text => this.setState({ date: text })} />
            </View>
          </KeyboardAwareScrollView>

          <KeyboardAwareScrollView style={styles.container}
            resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={false}>
            <View style={styles.container}>
              <Image source={require('./img/hand.png')} style={styles.iconstyle} />
              <TextInput placeholder='Business Name'
                placeholderTextColor='black'
                style={styles.inputtextstyle}
                onChangeText={text => this.setState({ business: text })} />
            </View>
          </KeyboardAwareScrollView>

          <KeyboardAwareScrollView style={styles.container} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={false}>
            <View style={styles.container}>
              <Image source={require('./img/code.png')} style={styles.iconstyle} />
              <TextInput placeholder='EIN'
                placeholderTextColor='black'
                style={styles.inputtextstyle}
                onChangeText={text => this.setState({ ein: text })} />
            </View>
          </KeyboardAwareScrollView>

          <View style={styles.buttoncontainer}>
            <Button buttonStyle={{
              backgroundColor: '#fff',
              width: 180,
              height: 42,
              borderRadius: 24,
              borderWidth: 0.5
            }}
              loadingProps={{ size: 'small', color: 'black' }}
              title='SIGNUP'
              textStyle={styles.textstyle}
              onPress={() => this.handleSubmit()}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttontext: {
    fontFamily: 'Bahnschrift',
    fontSize: 18,
    color: 'black',
    marginTop: -6,
  },
  iconstyle: {
    alignSelf: 'center'
  },
  // buttoncontainer:{
  //  alignSelf:'center',
  // },
  textstyle: {
    ...Platform.select({
      ios: {
        fontFamily: 'Bahnschrift',
        fontSize: 20,
        color: 'black',
        paddingBottom: Platform.OS === 'ios' ? 24 : 0,
      },
      android: {
        fontFamily: 'Bahnschrift',
        fontSize: 20,
        color: 'black',
      }
    }),
  },
  radiotext1: {
    fontFamily: 'Bahnschrift',
    fontSize: 18,
    color: 'black',
    marginLeft: 12,
  },
  inputtextstyle: {
    fontFamily: 'Bahnschrift',
    fontSize: 18,
    padding: 0,
    borderBottomWidth: 1,
    width: wp('50%'),
    marginLeft: 8,

  },
  container: {
    marginBottom: hp('5%'),
    flexDirection: 'row',
    alignSelf: 'center',
    width: wp('60%'),
  },
  container1: {
    alignSelf: 'center',
    flexDirection: 'row',
    width: wp('60%'),
    marginBottom: hp('2.6%'),
  },
  buttoncontainer: {
    ...Platform.select({
      ios: {
        marginBottom: hp('9%'),
        alignSelf: 'center',
        flex: 1,
      },
      android: {
        marginBottom: hp('9%'),
        alignSelf: 'center',
        flex: 1,
      }
    }),
  },
});

