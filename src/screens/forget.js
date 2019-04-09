import React, { Component } from 'react';
import { TouchableHighlight, StyleSheet, Text, View, ImageBackground, Image, TextInput, Platform, TouchableWithoutFeedback,Alert,KeyboardAvoidingView,Keyboard } from 'react-native';
// import Statusbar from 'statusbar';
import {
  widthPercentageToDP as wp, heightPercentageToDP as hp,
  listenOrientationChange as loc, removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { Button } from 'react-native-elements';
import Status from './status';
import Constants from './constants';
const apiUrl = Constants.WITHOUT_AUTH_API_URL;
const imgUrl = Constants.IMAGE_URL;
const fontName =(Platform.OS === 'ios') ? 'Bahnschrift' : 'bahnschrift';
const fontNameBold =(Platform.OS === 'ios') ? 'Bahnschrift_Bold' : 'bahnschrift_bold';
class Forget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailError: ""
    }
  }
  validateEmail = (text) => {
    var error;
    if (text) {
      let reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
      if (reg.test(text) === false) {
        error = 2;
        this.setState({ emailError: 'please enter correct email!!' });
      } else {
        error = '';
        this.setState({ emailError: '' });
      }
    } else {
      error = 1;
      this.setState({ emailError: 'please enter email!!' });
    }
    return error;
  }
  handleSubmit = () => {
    /******* custom validation ********/
    var formStatus = '';
    formStatus += this.validateEmail(this.state.email);
    if (formStatus.length > 0) {
      return false;
    } else {
      fetch(apiUrl + 'forgetPassword', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
        body: 'email=' + this.state.email
      }).then((response) => response.json())
        .then((responseJson) => {
          //console.log(responseJson);
          if (responseJson.status == 'failed') {
            Alert.alert(responseJson.msg);
          } else {
            Alert.alert('Your password is changed. Please check your email !!');
            this.props.navigation.navigate('LoginScreen');
          }
        }).catch((error) => {
          console.error(error);
          if(error == 'TypeError: Network request failed'){
            Alert.alert('Something went wrong', 'Kindly check if the device is connected to stable cellular data plan or WiFi.'); 
          }
          Alert(error);
        });
    }
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View>
        <Status backgroundColor="#8c8c8c" barStyle="light-content" />
        <ImageBackground source={require('./img/background1.jpg')}
          style={{
            width: '100%',
            height: '100%',
          }}>

          <View style={{ marginTop: hp('3%'), marginBottom: hp('7%'), alignSelf: 'center' }}>
            <Image source={require('./img/logo.png')} />
          </View>

          <KeyboardAvoidingView style={styles.containerOuter} enabled>
            <View style={styles.container}>
              <Image source={require('./img/mail1.png')} style={styles.iconstyle} />
              <TextInput placeholder='Email address'
                placeholderTextColor='black'
                style={styles.inputtextstyle}
                autoCapitalize='none'
                onChangeText={text => this.setState({ email: text })} />
            </View>
            <Text style={styles.errorText}>{this.state.emailError}</Text>
          </KeyboardAvoidingView>

          <View style={styles.buttoncontainer}>
            <Button buttonStyle={{
             backgroundColor: '#fff',
             width: wp('50%'),
             height: hp('6%'),
             borderRadius: 24,
             borderWidth: 0.5
            }}
              loadingProps={{ size: 'small', color: 'black' }}
              title='SUBMIT'
              fontFamily = {fontNameBold}
              textStyle={styles.textstyle}
              onPress={() => this.handleSubmit()}
            />
          </View>

          <View style={styles.bottomcontainer}>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <Text style={{ fontFamily: fontName, fontSize: 20 }}>
                If you have account
              </Text>
              <TouchableHighlight>
                <Text style={{ fontFamily: fontNameBold, fontSize: wp('5.6%'), }} onPress={() => this.props.navigation.navigate('Login')}> Login</Text>
              </TouchableHighlight>
            </View>
          </View>
        </ImageBackground>
      </View>
      </TouchableWithoutFeedback>

    );
  }
}
export default Forget;
const styles = StyleSheet.create({
  logostyle: {
    ...Platform.select({
      ios: {
        marginTop: hp('3%'),
        marginBottom: hp('7%'),
        alignSelf: 'center'
      },
      android: {
        marginTop: hp('2%'),
        marginBottom: hp('5%'),
        alignSelf: 'center'
      }
    }),
  },
  iconstyle: {
    ...Platform.select({
      ios: {
        marginRight: 4,
        alignSelf: 'center',
      },
      android: {
        alignSelf: 'center',
        marginRight: 4
      }
    }),
  },
  buttoncontainer: {
    alignSelf: 'center',
  },
  bottomcontainer: {
    ...Platform.select({
      ios: {
        marginBottom: hp('12%'),
        justifyContent: 'flex-end',
        flex: 1,
      },
      android: {
        marginBottom: hp('2%'),
        justifyContent: 'flex-end',
        flex: 1,
      }
    }),

  },
  textstyle: {
    ...Platform.select({
      ios: {
        fontFamily: fontNameBold,
        fontSize: wp('5.4%'),
        color: 'black',
        padding:hp('1%'),
        paddingBottom: Platform.OS === 'ios' ? 24 : 0,
      },
      android: {
        fontFamily: fontNameBold,
        fontSize: wp('5.4%'),
        color: 'black',
      }
    }),
  },
  inputtextstyle: {
    ...Platform.select({
      ios: {
        fontFamily: fontName,
        fontSize: wp('4.8%'),
        borderBottomWidth: 1,
        flex: 1,
        color: '#000',
       justifyContent: "center",
       alignItems: "stretch",
      },
      android: {
        fontFamily: fontName,
        fontSize: wp('4.8%'),
        padding: 0,
        borderBottomWidth: 1,
        justifyContent: "center",
        flex: 1,
        alignItems: "stretch",
      }
    }),
  },
  container: {
    ...Platform.select({
      ios: {
        alignSelf: 'center',
        flexDirection: 'row',
        width: wp('70%')
      },
      android: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: wp('75%')
      }
    }),
  },
  containerOuter: {
    ...Platform.select({
      ios: {
        marginBottom: hp('4%'),
      },
      android: {
        marginBottom: hp('3%'),
      }
    }),
  },
  errorText: {
    color: 'red',
    marginTop: hp('1%'),
    textAlign: 'center'
  }
});
