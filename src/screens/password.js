import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, TextInput, AsyncStorage,itemTextStyle, Platform, KeyboardAvoidingView,Alert } from 'react-native';
import Statusbar from './status';
import {
  widthPercentageToDP as wp, heightPercentageToDP as hp,
  listenOrientationChange as loc, removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { Header, Button } from 'react-native-elements';
import Loader from './loader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from './constants';
const apiUrl = Constants.API_URL;
const imgUrl = Constants.IMAGE_URL;
const fontName = (Platform.OS === 'ios') ? 'Bahnschrift' : 'bahnschrift';
const fontNameBold = (Platform.OS === 'ios') ? 'Bahnschrift_Bold' : 'bahnschrift_bold';
export default class Password extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      oldPasswd: '',
      newPasswd: '',
      confPasswd: '',
      oldPasswdErr: '',
      newPasswdErr: '',
      confPasswdErr: '',
      loading : false,
      user_id:''
    }
  }
  validateText = (text, name, fieldName) => {
    var error;
    if (text && text !== undefined) {
      error = '';
      this.setState({ [name]: '' });
    } else {
      error = 1;
      msg = 'please enter ' + fieldName + ' !!';
      this.setState({ [name]: msg });
    }
    return error;
  }
  handleSubmit = () => {
    var fnames = ['old password', 'new password', 'confirm password'];
    var valNames = ['oldPasswd', 'newPasswd', 'confPasswd'];
    var errNames = ['oldPasswdErr', 'newPasswdErr', 'confPasswdErr'];;
    var formStatus = '';
    for (let i = 0; i < 3; i++) {
      let valKey = valNames[i];
      let text = this.state[valKey];
      formStatus += this.validateText(text, errNames[i], fnames[i]);
    }
    if (formStatus.length > 0) {
      this.setState({loading:false});
      return false;
    } else {
      if(this.state.newPasswd === this.state.confPasswd){
          console.log('user_id=' + this.state.id + '&oldPasswd=' + this.state.oldPasswd + '&newPasswd=' + this.state.newPasswd)
          fetch(apiUrl + 'object=user&action=changePasswd', {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
            }),
            body: 'user_id=' + this.state.user_id + '&oldPasswd=' + this.state.oldPasswd + '&newPasswd=' + this.state.newPasswd
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson.status == 'success') {
                Alert.alert('password updated !!')
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
      }else{
        Alert.alert('Confirm password is not matched!!');
      }   
    }
  }
  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      var u_id = AsyncStorage.getItem('user_id');
      this.setState({ user_id : u_id });
    }
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
        <Loader
            loading={this.state.loading} />
          <Header backgroundColor='#282828'
            borderBottomWidth='0'
            outerContainerStyles={{
              borderBottomWidth: 0,// remove shadow on iOS
            }}
            leftComponent={{ icon: 'menu', color: '#fff', size:wp('8%'), onPress: () => this.props.navigation.openDrawer() }}
            centerComponent={{ text: 'Change Password', style: { color: '#fff', fontSize: wp('7%'), fontFamily: fontName } }}
          />
        </View>
        <ScrollView >
          <KeyboardAvoidingView style={{ marginTop: hp('4%') }} enabled>
            <View style={styles.containerOuter} enabled>
              <View style={styles.container}>
                <Image source={require('./img/Oldlock.png')} style={styles.iconstyle} />
                <TextInput placeholder='Old Password'
                  placeholderTextColor='black'
                  secureTextEntry={true}
                  autoCapitalize='none'
                  style={styles.inputtextstyle}
                  onChangeText={text => this.setState({ oldPasswd: text })}
                />
              </View>
              <Text style={styles.errorText}>{this.state.oldPasswdErr}</Text>
            </View>
            <View style={styles.containerOuter} enabled>
              <View style={styles.container}>
                <Image source={require('./img/newpassword.png')} style={styles.iconstyle} />
                <TextInput placeholder='New Password'
                  placeholderTextColor='black'
                  secureTextEntry={true}
                  autoCapitalize='none'
                  style={styles.inputtextstyle}
                  onChangeText={text => this.setState({ newPasswd: text })}
                />
              </View>
              <Text style={styles.errorText}>{this.state.newPasswdErr}</Text>
            </View>
            <View style={styles.containerOuter}>
              <View style={styles.container}>
                <Image source={require('./img/login.png')} style={styles.iconstyle} />
                <TextInput placeholder='Confirm Password'
                  placeholderTextColor='black'
                  secureTextEntry={true}
                  autoCapitalize='none'
                  style={styles.inputtextstyle}
                  onChangeText={text => this.setState({ confPasswd: text })}
                />
              </View>
              <Text style={styles.errorText}>{this.state.confPasswdErr}</Text>
            </View>
            <View style={styles.buttoncontainer}>
              <Button buttonStyle={{
                backgroundColor: 'black',
                width: wp('50%'),
                height: hp('6%'),
                borderRadius: 24,
                borderWidth: 0.5
              }}
                loadingProps={{ size: 'small', color: 'white' }}
                title='SUBMIT'
                fontFamily={fontName}
                textStyle={styles.textstyle}
                onPress={() => this.handleSubmit()}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttoncontainer: {
    alignSelf: 'center',

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
        fontSize: 20,
        color: 'white',
        paddingBottom: Platform.OS === 'ios' ? 24 : 0,
      },
      android: {
        fontFamily: fontNameBold,
        fontSize: 20,
        color: 'white',
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
        marginBottom: hp('4%'),
      },
      android: {
        marginBottom: hp('3%'),
      }
    }),
  },
  errorText: {
    ...Platform.select({
      ios: {
        fontFamily: 'Bahnschrift',
        color: 'red',
        marginTop: hp('1%'),
        textAlign: 'center'

      },
      android: {
        fontFamily: 'bahnschrift',
        color: 'red',
        marginTop: hp('1%'),
        textAlign: 'center'

      }
    }),
  }
});

