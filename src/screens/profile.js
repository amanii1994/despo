import React, { Component } from 'react';
import { TouchableHighlight, StyleSheet, Text, View, ScrollView, ImageBackground, AsyncStorage, Alert, TouchableOpacity, Image, TextInput, StatusBar, Platform, KeyboardAvoidingView, PermissionsAndroid } from 'react-native';
import {
  widthPercentageToDP as wp, heightPercentageToDP as hp,
  listenOrientationChange as loc, removeOrientationListener as rol
} from 'react-native-responsive-screen';
import Statusbar from './status';
import Loader from './loader';
import { Button, Header } from 'react-native-elements';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import DatePicker from 'react-native-datepicker';
import KeyboardManager from 'react-native-keyboard-manager';
import Constants from './constants';
const apiUrl = Constants.API_URL;
const imgUrl = Constants.IMAGE_URL;
const fontName = (Platform.OS === 'ios') ? 'Bahnschrift' : 'bahnschrift';
const fontNameBold = (Platform.OS === 'ios') ? 'Bahnschrift_Bold' : 'bahnschrift_bold';
type Props = {};
//KeyboardManager.setEnable(true);
class Profile extends Component<Props> {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      ImageSource: null,
      data: null,
      Image_TAG: '',
      img: '',
      loading: false,
      name: '',
      gender: '',
      mobile: '',
      city:'',
      state: '',
      zipcode: '',
      dob: '',
      business_name: '',
      ein:''
    }
  }
  onSelect = (value) => {
    this.setState({ gender: value })
    console.log(value)
  };
  componentDidMount() {
    this._isMounted = true;
    loc(this);
    if (this._isMounted) {
      var that = this;
      AsyncStorage.getItem("userdata").then((info) => {
        if (info) {
          let dt = JSON.parse(info);
          Object.keys(dt).forEach(function (key) {
            // console.log(key)
            // console.log(dt[key])
            that.setState({
              [key]: dt[key]
            })
          });
          if (that.state.img) {
            that.setState({ ImageSource: imgUrl + that.state.img });
          }
          this.setState({ loading: false });
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
  validateText = (text, name, fieldName) => {
    var error;
    let regTxt = /^[a-zA-Z ]*$/;
    if (name == 'name') {
      if (text) {
        if (reg.test(regTxt) === false) {
          error = 2;
          msg = 'please enter correct ' + fieldName + ' !!';
          this.setState({ [name]: msg });
        } else {
          error = '';
          this.setState({ [name]: '' });
        }
      } else {
        error = 1;
        msg = 'please enter ' + fieldName + ' !!';
        this.setState({ [name]: msg });
      }
    } else {
      if (text && text !== undefined) {
        error = '';
        this.setState({ [name]: '' });
      } else {
        error = 1;
        msg = 'please enter ' + fieldName + ' !!';
        this.setState({ [name]: msg });
      }
    }
    return error;
  }
  handleSubmit = () => {
    var fnames = ['name', 'gender', 'phone', 'city', 'state', 'zipcode', 'dob', 'business name', 'ein'];
    var valNames = ['name', 'gender', 'mobile', 'city', 'state', 'zipcode', 'dob', 'business_name', 'ein'];
    var errNames = ['nameError', 'genderError', 'phoneError', 'cityError', 'stateError', 'zipcodeError', 'dobError', 'business_nameError', 'einError'];
    var formStatus = '';

    for (let i = 0; i < 9; i++) {
      let valKey = valNames[i];
      let text = this.state[valKey];
      formStatus += this.validateText(text, errNames[i], fnames[i]);
    }
    if (formStatus.length > 0) {
      return false;
    } else {
      //console.log('name=' + this.state.name + '&gender=' + this.state.gender + '&mobile=' + this.state.mobile + '&city=' + this.state.city + '&state=' + this.state.state + '&zipcode=' + this.state.zipcode + '&dob=' + this.state.dob + '&business_name=' + this.state.business_name + '&ein=' + this.state.ein + '&img=' + this.state.img + '&user_id=' + this.state.id)
      fetch(apiUrl + 'object=user&action=profileUpdate', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
        body: 'name=' + this.state.name + '&gender=' + this.state.gender + '&mobile=' + this.state.mobile + '&city=' + this.state.city + '&state=' + this.state.state + '&zipcode=' + this.state.zipcode + '&dob=' + this.state.dob + '&business_name=' + this.state.business_name + '&ein=' + this.state.ein + '&img=' + this.state.img + '&user_id=' + this.state.id
      }).then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          if (responseJson.status == 'success') {
            AsyncStorage.setItem("userdata", JSON.stringify(responseJson.data));
            Alert.alert('profile updated !!')
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

  uploadImageToServer = () => {
    RNFetchBlob.fetch('POST', apiUrl + 'object=user&action=fileUpload', {
      Authorization: "Bearer access-token",
      otherHeader: "foo",
      'Content-Type': 'multipart/form-data',
    }, [
        { name: 'image', filename: 'image.jpg', type: 'image/jpg', data: this.state.data },
      ]).then((resp) => resp.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.status == 'success') {
          this.setState({ img: responseJson.filename, ImageSource: imgUrl + responseJson.filename, loading: false });

        } else {
          Alert.alert('Something went wrong !!');
        }
      }).catch((err) => {
        console.log(err);
        Alert.alert('Something went wrong !!');
      })
  }
  selectPhotoTapped() {
    //  Alert.alert('hjdshdjsd');
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };
        this.setState({
          loading: true,
          data: response.data
        });
        this.uploadImageToServer();
      }
    });
  }
  render() {
    return (
      <View style={{ backgroundColor: '#8c8c8c', width: '100%', height: '100%' }}>
        <Statusbar backgroundColor="#282828" barStyle="light-content" />
        <View>
          <Loader
            loading={this.state.loading} />
          <Header backgroundColor='#282828'
            outerContainerStyles={{
              borderBottomWidth: 0,// remove shadow on iOS
            }}
            borderBottomWidth='0'
            leftComponent={{ icon: 'menu', color: '#fff', size: wp('8%'), onPress: () => this.props.navigation.openDrawer() }}
            centerComponent={{ text: 'Edit Profile', style: { color: '#fff', fontSize: wp('7%'), fontFamily: fontName } }}
          />
        </View>
        <ScrollView keyboardDismissMode='on-drag'>
          <View style={{ marginBottom: 70 }}>
            <Image source={require('./img/header.jpg')}
              style={{
                width: wp('100%'),
                height: hp('19%'),
                position: 'relative'
              }} />
            <View style={{ position: 'absolute', alignSelf: 'center', marginBottom: 33 }}  >
              <View style={{ alignSelf: 'center', marginTop: hp('12%'), position: 'relative' }}>
                {this.state.ImageSource === null ? <Image source={require('./img/no-user.png')} style={{ width: 100, height: 100, borderRadius: 50 }} /> : <Image source={{ uri: this.state.ImageSource }} style={{ width: 100, height: 100, borderRadius: 50 }} />}
                <TouchableOpacity activeOpacity={.5} onPress={this.selectPhotoTapped.bind(this)} style={{ position: 'absolute', bottom: 0, right: 0 }}>
                  <Image source={require('./img/plus1.png')} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <KeyboardAvoidingView enabled>
            <View style={styles.containerOuter} enabled>
              <View style={styles.container}>
                <Image source={require('./img/user1.png')} style={styles.iconstyle} />
                <TextInput placeholder='Name'
                  placeholderTextColor='black'
                  style={styles.inputtextstyle}
                  value={this.state.name}
                  onChangeText={text => this.setState({ name: text })} />
              </View>
              <Text style={styles.errorText}>{this.state.nameError}</Text>
            </View>

            {/* <View style={styles.containerOuter} enabled>
              <View style={styles.container}>
                <Image source={require('./img/mail1.png')} style={styles.iconstyle} />
                <TextInput placeholder='Email address'
                  placeholderTextColor='black'
                  style={styles.inputtextstyle}
                  onChangeText={text => this.setState({ email: text })} />
              </View>
              <Text style={styles.errorText}>{this.state.emailError}</Text>
            </View> */}

            <View style={{
              ...Platform.select({
                ios: {
                  marginBottom: hp('2%'),
                },
                android: {
                  marginBottom: hp('1%'),
                }
              }),
            }}>
              <View style={styles.container}>
                <Image source={require('./img/gender.png')} style={{ marginTop: 4 }} />
                <Text style={styles.radiotext1}>Gender</Text>
                <RadioGroup
                  size={wp('4.8%')}
                  selectedIndex={this.state.gender === 'male' ? 0 : 1}
                  style={{ flexDirection: 'row', marginTop: -4 }} color='black' onSelect={(index, value) => this.onSelect(value)}>
                  <RadioButton value='male'><Text style={styles.buttontext}>Male</Text></RadioButton>
                  <RadioButton value='female'><Text style={styles.buttontext}>Female</Text></RadioButton>
                </RadioGroup>
              </View>
              <Text style={styles.errorText}>{this.state.genderError}</Text>
            </View>

            <View style={styles.containerOuter} enabled>
              <View style={styles.container}>
                <Image source={require('./img/phone.png')} style={styles.iconstyle} />
                <TextInput placeholder='Phone'
                  placeholderTextColor='black'
                  style={styles.inputtextstyle}
                  value={this.state.mobile}
                  onChangeText={text => this.setState({ mobile: text })} />
              </View>
              <Text style={styles.errorText}>{this.state.phoneError}</Text>
            </View>

            <View style={styles.containerOuter} enabled>
              <View style={styles.container}>
                <Image source={require('./img/city.png')} style={styles.iconstyle} />
                <TextInput placeholder='City'
                  placeholderTextColor='black'
                  style={styles.inputtextstyle}
                  value={this.state.city}
                  onChangeText={text => this.setState({ city: text })} />
              </View>
              <Text style={styles.errorText}>{this.state.cityError}</Text>
            </View>

            <View style={styles.containerOuter} enabled>
              <View style={styles.container}>
                <Image source={require('./img/state.png')} style={styles.iconstyle} />
                <TextInput placeholder='State'
                  placeholderTextColor='black'
                  value={this.state.state}
                  style={styles.inputtextstyle}
                  onChangeText={text => this.setState({ state: text })} />
              </View>
              <Text style={styles.errorText}>{this.state.stateError}</Text>
            </View>

            <View style={{
              ...Platform.select({
                ios: {
                  marginBottom: hp('2%'),
                },
                android: {
                  marginBottom: hp('1%'),
                }
              }),
            }} enabled>
              <View style={styles.container}>
                <Image source={require('./img/zipcode.png')} style={styles.iconstyle} />
                <TextInput placeholder='Zip code'
                  placeholderTextColor='black'
                  style={styles.inputtextstyle}
                  value={this.state.zipcode}
                  onChangeText={text => this.setState({ zipcode: text })} />
              </View>
              <Text style={styles.errorText}>{this.state.zipcodeError}</Text>
            </View>

            <View resetScrollToCoords={{ x: 0, y: 0 }} style={{
              ...Platform.select({
                ios: {
                  marginBottom: hp('2%'),
                },
                android: {
                  marginBottom: hp('1%'),
                }
              }),
            }} enabled>
              <View style={styles.container}>
                <Image source={require('./img/calendar.png')} style={styles.iconstyle} />
                {/* <TextInput placeholder='Birth date'
                placeholderTextColor='black'
                style={styles.datestyle}
                onChangeText={this.showInp.bind(this)}
              /> */}

                <DatePicker
                  style={{ width: '92%', paddingBottom: '6%', marginTop: 0, marginBottom: 0 }}
                  date={this.state.dob}
                  mode="date"
                  placeholder="Birth date"
                  format="YYYY-MM-DD"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  showIcon={false}

                  customStyles={{
                    // dateIcon: {
                    //   position: 'absolute',
                    //   left: 0,
                    //   top: 4,
                    //   marginLeft: 0
                    // },
                    dateInput: {
                      ...Platform.select({
                        ios: {
                          fontFamily: 'Bahnschrift',
                          fontSize: wp('4.8%'),
                          borderBottomWidth: 1,
                          borderTopWidth: 0,
                          padding: 0,
                          lineHeight: 0,
                          borderLeftWidth: 0,
                          borderRightWidth: 0,
                          borderColor: '#000',
                          flex: 1,
                          color: '#000',
                          justifyContent: "flex-end",
                          alignItems: "stretch",
                          marginTop: 0, marginBottom: 0
                        },
                        android: {
                          fontFamily: 'bahnschrift',
                          fontSize: wp('4.8%'),
                          padding: 0,
                          lineHeight: 0,
                          borderBottomWidth: 1,
                          borderTopWidth: 0,
                          padding: 0,
                          lineHeight: 0,
                          borderLeftWidth: 0,
                          borderRightWidth: 0,
                          borderColor: '#000',
                          justifyContent: "flex-end",
                          flex: 1,
                          alignItems: "stretch",
                          marginTop: 0, marginBottom: 0
                        }
                      })
                    },
                    placeholderText: {
                      ...Platform.select({
                        ios: {
                          fontFamily: 'Bahnschrift',
                          fontSize: wp('4.8%'),
                          color: '#000',
                        },
                        android: {
                          fontFamily: 'bahnschrift',
                          fontSize: wp('4.8%'),
                          color: '#000',
                        }
                      })
                    },
                    dateText: {
                      ...Platform.select({
                        ios: {
                          fontFamily: 'Bahnschrift',
                          fontSize: wp('4.8%'),
                          color: '#000',
                        },
                        android: {
                          fontFamily: 'bahnschrift',
                          fontSize: wp('4.8%'),
                          color: '#000',
                        }
                      })
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => { this.setState({ dob: date }) }}
                />
              </View>
              <Text style={styles.errorText}>{this.state.dobError}</Text>
            </View>

            <View style={styles.containerOuter} resetScrollToCoords={{ x: 0, y: 0 }} enabled>
              <View style={styles.container}>
                <Image source={require('./img/hand.png')} style={styles.iconstyle} />
                <TextInput placeholder='Business Name'
                  value={this.state.business_name}
                  placeholderTextColor='black'
                  style={styles.inputtextstyle}
                  onChangeText={text => this.setState({ business_name: text })} />
              </View>
              <Text style={styles.errorText}>{this.state.business_nameError}</Text>
            </View>

            <View style={styles.containerOuter} enabled>
              <View style={styles.container}>
                <Image source={require('./img/code.png')} style={styles.iconstyle} />
                <TextInput placeholder='EIN'
                  value={this.state.ein}
                  placeholderTextColor='black'
                  style={styles.inputtextstyle}
                  onChangeText={text => this.setState({ ein: text })} />
              </View>
              <Text style={styles.errorText}>{this.state.einError}</Text>
            </View>

            <View style={styles.buttoncontainer}>
              <Button buttonStyle={{
                backgroundColor: '#fff',
                width: 180,
                height: 42,
                borderRadius: 24,
                borderWidth: 0.5
              }}
                loadingProps={{ size: 'small', color: 'black' }}
                fontFamily={fontName}
                title='SUBMIT'
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
export default Profile;
const styles = StyleSheet.create({
  buttontext: {
    ...Platform.select({
      ios: {
        fontFamily: 'Bahnschrift',
        fontSize: 16,
        color: 'black',
        marginTop: 0,
      },
      android: {
        fontFamily: 'bahnschrift',
        fontSize: 16,
        color: 'black',
        marginTop: -6,
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
  textstyle: {
    ...Platform.select({
      ios: {
        fontFamily: 'Bahnschrift',
        fontSize: 20,
        color: 'black',
      },
      android: {
        fontFamily: 'bahnschrift',
        fontSize: 20,
        color: 'black',
      }
    }),
  },
  radiotext1: {
    ...Platform.select({
      ios: {
        fontFamily: 'Bahnschrift',
        fontSize: wp('4.8%'),
        color: 'black',
        marginLeft: 6,
        marginTop: hp('0.6%'),
      },
      android: {
        fontFamily: 'bahnschrift',
        fontSize: wp('4.8%'),
        color: 'black',
        marginLeft: 12
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
  datestyle: {
    ...Platform.select({
      ios: {
        fontFamily: 'Bahnschrift',
        fontSize: 16,
        borderBottomWidth: 1,
        flex: 1,
        color: '#000',
        justifyContent: "center",
        alignItems: "stretch",

      },
      android: {
        fontFamily: 'bahnschrift',
        fontSize: 16,
        padding: 0,
        color: '#000',
        borderBottomWidth: 1,
        justifyContent: "center",
        flex: 1,
        alignItems: "stretch",

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

