import React, { Component } from 'react';
import { TouchableHighlight, StyleSheet, Text, View, AsyncStorage, ImageBackground, Image, TextInput, StatusBar, Platform, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
//import Statusbar from 'statusbar';
import {
  widthPercentageToDP as wp, heightPercentageToDP as hp,
  listenOrientationChange as loc, removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { Button } from 'react-native-elements';
import Status from './status';
import Loader from './loader';
import Constants from './constants';
import { KeyboardSpacer } from 'react-native-keyboard-spacer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const fontName = (Platform.OS === 'ios') ? 'Bahnschrift' : 'bahnschrift';
const fontNameBold = (Platform.OS === 'ios') ? 'Bahnschrift_Bold' : 'bahnschrift_bold';
type Props = {};
const apiUrl = Constants.WITHOUT_AUTH_API_URL;
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
class Login extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
      loading: false
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
      this.setState({ emailError: 'Please enter email!!' });
    }
    return error;
  }
  validatePassword = (text) => {
    var error;
    if (text) {
      error = '';
      this.setState({ passwordError: '' });
    } else {
      error = 1;
      this.setState({ passwordError: 'Please enter password!!' });
    }
    return error;
  }

  handleSubmit = () => {
    Keyboard.dismiss();
    /******* custom validation ********/
    this.setState({ loading: true });
    var formStatus = '';
    formStatus += this.validateEmail(this.state.email);
    formStatus += this.validatePassword(this.state.password);
    if (formStatus.length > 0) {
      this.setState({ loading: false });
      return false;
    } else {
      //AsyncStorage.setItem("username", this.state.email);
      //this.props.navigation.navigate('Home');
      this.setState({ loading: false });
      fetch(apiUrl + 'login', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
        body: 'email=' + this.state.email + '&password=' + this.state.password
      }).then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.status == 'success') {
            //  console.log(responseJson.data[0])
            AsyncStorage.setItem("username", this.state.email);
            AsyncStorage.setItem("user_id", responseJson.data[0].id);
            AsyncStorage.setItem("userdata", JSON.stringify(responseJson.data[0]));
            Alert.alert('Successfully logged in!!');
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
  }
  componentDidMount() {
    loc(this);
  }
  componentWillMount() {
    rol(this);
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
            <Loader
              loading={this.state.loading} />
            <View style={styles.logostyle}>
              <Image source={require('./img/logo.png')} />
            </View>
            <KeyboardAvoidingView style={styles.containerOuter} enabled>
              <View style={styles.container}>
                <Image source={require('./img/mail1.png')} style={styles.iconstyle} />
                <TextInput placeholder='Email address'
                  placeholderTextColor='black'
                  autoCapitalize='none'
                  style={styles.inputtextstyle}
                  onChangeText={text => this.setState({ email: text })} />
              </View>
              <Text style={styles.errorText}>{this.state.emailError}</Text>
            </KeyboardAvoidingView>
            <KeyboardAvoidingView style={styles.containerOuter} enabled>
              <View style={styles.container}>
                <Image source={require('./img/lock2.png')} style={styles.iconstyle} />
                <TextInput placeholder='Password'
                  secureTextEntry={true}
                  autoCapitalize='none'
                  placeholderTextColor='black'
                  style={styles.inputtextstyle}
                  onChangeText={text => this.setState({ password: text })} />
              </View>
              <Text style={styles.errorText}>{this.state.passwordError}</Text>
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
                title='LOGIN'
                textStyle={styles.textstyle}
                onPress={() => this.handleSubmit()}
              />
            </View>


            <View style={{ marginTop: 10, alignSelf: 'center' }}>
              <TouchableHighlight>
                <Text style={{ fontFamily: fontName, fontSize: wp('5.4%'), }}
                  onPress={() => this.props.navigation.navigate('Forget')}
                >
                  Forgot Password?</Text>
              </TouchableHighlight>
            </View>

            <View style={styles.bottomcontainer}>
              <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                <Text style={{ fontFamily: fontName, fontSize: 20 }}>
                  If you Don't have account
                </Text>
                <TouchableHighlight>
                  <Text style={{ fontFamily: fontNameBold, fontSize: wp('5.6%') }} onPress={() => this.props.navigation.navigate('Signup')}> Signup</Text>
                </TouchableHighlight>
              </View>
            </View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Login;

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
        fontFamily: 'Bahnschrift',
        fontSize: wp('4.8%'),
        borderBottomWidth: 1,
        flex: 1,
        color: '#000',
        justifyContent: "center",
        alignItems: "stretch",
      },
      android: {
        fontFamily: 'bahnschrift',
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
        marginBottom: hp('5%'),
      },
      android: {
        marginBottom: hp('2.5%'),
      }
    }),
  },
  errorText: {
    color: 'red',
    marginTop: hp('1%'),
    textAlign: 'center'
  }
});
