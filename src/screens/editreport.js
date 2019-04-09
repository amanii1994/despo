import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, TextInput, itemTextStyle, Platform, KeyboardAvoidingView, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import Statusbar from './status';
import {
  widthPercentageToDP as wp, heightPercentageToDP as hp,
  listenOrientationChange as loc, removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { Dropdown } from 'react-native-material-dropdown';
import { Header, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import Loader from './loader';
import Fcon from 'react-native-vector-icons/FontAwesome';
import RNFetchBlob from 'rn-fetch-blob';
import Constants from './constants';
const apiUrl = Constants.API_URL;
const imgUrl = Constants.IMAGE_URL;
const fontName = (Platform.OS === 'ios') ? 'Bahnschrift' : 'bahnschrift';
const fontNameBold = (Platform.OS === 'ios') ? 'Bahnschrift_Bold' : 'bahnschrift_bold';
export default class addReport extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      myArray: [],
      loading: false,
      img: null,
      selData: [],
      dataRes: {},
      imgRes: {},
      driver_name: '',
      state: '',
      ticket_number: '',
      description: '',
      id:''
    }
  }
  renderButtons() {
    let table = []
    // Outer loop to create parent
    for (let i = 0; i < this.state.myArray.length; i++) {
      //Create the parent and add the children
      table.push(<Image
        style={{ width: wp(20), height: hp(10), marginRight: wp(2) }}
        source={this.state.myArray[i]}
        key={i}
      />)
    }
    return table;
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
        
        if (responseJson.status == 'success') {
          if (this.state.img === null) {
            this.setState({ img: responseJson.filename })
          } else {
            let string = this.state.img + ',' + responseJson.filename;
            this.setState({ img: string })
          }
          this.setState({ loading: false });
        } else {
          Alert.alert('Something went wrong !!');
        }
      }).catch((err) => {
        console.log(err);
        Alert.alert('Something went wrong !!');
      })
  }
  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxImagesCount: 9,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.showImagePicker(options, (response) => {
      //console.log('Response = ', response);
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
          data: response.data,
          loading: true
        });
        if (this.state.myArray === null) {
          this.state.myArray.push(source)
        } else {
          this.setState({ myArray: this.state.myArray.concat(source) })
        }
        this.uploadImageToServer();
      }
    });
  }
  delImage(id,case_id) {
    this.setState({ loading: true });
    fetch(apiUrl + 'object=reportcase&action=delImage&img_id=' + id+'&case_id='+case_id)
      .then((response) =>
        // console.log(response)
        response.json())
      .then((responseJson) => {
        this.setState({ loading: false, imgRes:responseJson.img });
        if (responseJson.status == 'error') {
          Alert.alert(responseJson.msg)
        }
      }).catch((error) => {
        console.error(error);
        if (error == 'TypeError: Network request failed') {
          Alert.alert('Something went wrong', 'Kindly check if the device is connected to stable cellular data plan or WiFi.');
        }
      });
  }
  renderImges() {
    if (this.state.status == 'success') {
      if (this.state.imgRes) {
        let table = [];
        // Outer loop to create parent
        for (let i = 0; i < this.state.imgRes.length; i++) {
          //Create the parent and add the children
          let img = imgUrl + this.state.imgRes[i].data;
          table.push(<View style={{ position: 'relative' }} key={i}>
            <Image
              style={{ width: wp(20), height: hp(10), marginRight: wp(2), marginTop: hp('1.5%') }}
              source={{ uri: img }}
            />
            <TouchableOpacity activeOpacity={.5} onPress={this.delImage.bind(this, this.state.imgRes[i].id, this.state.imgRes[i].report_id)} style={{ position: 'absolute', bottom: 0, left: wp('14%'), backgroundColor: '#fff' }}>
              <Fcon
                name={'times-circle'}
                size={wp('7%')}
              />
            </TouchableOpacity></View>
          )
        }
        return table;
      }
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
    var fnames = ['driver name', 'ticket number', 'state', 'description'];
    var valNames = ['driver_name', 'ticket_number', 'state', 'description'];
    var errNames = ['driver_nameErr', 'ticket_numberErr', 'stateErr', 'descriptionErr'];
    var formStatus = '';

    for (let i = 0; i < 4; i++) {
      let valKey = valNames[i];
      let text = this.state[valKey];
      formStatus += this.validateText(text, errNames[i], fnames[i]);
    }
    if (formStatus.length > 0) {
      return false;
    } else {
      //console.log('driver_name=' + this.state.driver_name + '&ticket_number=' + this.state.ticket_number + '&state=' + this.state.state + '&attorney_info=' + this.state.name + '&description=' + this.state.description + '&case_id=' + this.state.dataRes.id + '&img=' + this.state.img);
      fetch(apiUrl + 'object=reportcase&action=update', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
        body: 'driver_name=' + this.state.driver_name + '&ticket_number=' + this.state.ticket_number + '&state=' + this.state.state + '&attorney_info=' + this.state.name + '&description=' + this.state.description + '&case_id=' + this.state.dataRes.id + '&img=' + this.state.img
       }).then((response) => response.json())
        .then((responseJson) => {
          // console.log(responseJson)
          if (responseJson.status == 'success') {
            Alert.alert('Report updated successfully !!');
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
    this._isMounted = true;
    loc(this);
    if (this._isMounted) {
      AsyncStorage.getItem("userdata").then((info) => {
        if (info) {
          let dt = JSON.parse(info);
          this.setState({
            id: dt.id,
            name: dt.name
          })
        }
      }).done();
      var id = this.props.navigation.getParam('itemId');
      fetch(apiUrl + 'object=reportcase&action=getSingleCase&case_id=' + id)
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status == 'success') {
            this.setState({
              dataRes: responseJson.data,
              status: 'success',
              driver_name: responseJson.data.driver_name,
              state: responseJson.data.state,
              ticket_number: responseJson.data.ticket_number,
              description: responseJson.data.description,
              show: false,
              imgRes: responseJson.img
            });
          } else {
            this.setState({ 
              dataMsg: responseJson.msg, 
              status: 'error', 
              show: false, 
              imgRes: responseJson.img        
            })
          }
        }).catch((error) => {
          console.error(error);
          if (error == 'TypeError: Network request failed') {
            Alert.alert('Something went wrong', 'Kindly check if the device is connected to stable cellular data plan or WiFi.');
          }
        });
    }
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
        <Loader
          loading={this.state.loading} />
        <View>
          <Header backgroundColor='#282828'
            borderBottomWidth='0'
            outerContainerStyles={{
              borderBottomWidth: 0,// remove shadow on iOS
            }}
            leftComponent={<Icon
              name={'keyboard-backspace'}
              color={'#fff'}
              size={wp('8%')}
              onPress={() => this.props.navigation.navigate('Home')}
            />}
            centerComponent={{ text: 'Edit Updates', style: { color: '#fff', fontSize: wp('7%'), fontFamily: fontName } }}
          />
        </View>
        <ScrollView>
          <View style={{ marginTop: hp('4%') }}>
            <KeyboardAvoidingView style={styles.containerOuter} enabled>
              <View style={styles.container}>
                <Image source={require('./img/driver.png')} style={styles.iconstyle} />
                <TextInput placeholder='Driver name'
                  placeholderTextColor='black'
                  autoCapitalize='none'
                  value={this.state.driver_name}
                  style={styles.inputtextstyle}
                  onChangeText={text => this.setState({ driver_name: text })}
                />
              </View>
              <Text style={styles.errorText}>{this.state.driver_nameErr}</Text>
            </KeyboardAvoidingView>


            <KeyboardAvoidingView style={styles.containerOuter} enabled>
              <View style={styles.container}>
                <Image source={require('./img/ticket.png')} style={styles.iconstyle} />
                <TextInput placeholder='Ticket number'
                  placeholderTextColor='black'
                  autoCapitalize='none'
                  value={this.state.ticket_number}
                  style={styles.inputtextstyle}
                  onChangeText={text => this.setState({ ticket_number: text })}
                />
              </View>
              <Text style={styles.errorText}>{this.state.ticket_numberErr}</Text>
            </KeyboardAvoidingView>


            <KeyboardAvoidingView style={styles.containerOuter}>
              <View style={styles.container}>
                <Image source={require('./img/state.png')} style={styles.iconstyle} />
                <TextInput placeholder='State'
                  placeholderTextColor='black'
                  autoCapitalize='none'
                  value={this.state.state}
                  style={styles.inputtextstyle}
                  onChangeText={text => this.setState({ state: text })}
                />
              </View>
              <Text style={styles.errorText}>{this.state.stateErr}</Text>
            </KeyboardAvoidingView>

            <KeyboardAvoidingView style={styles.containerOuter}>
              <View style={styles.container}>
                <Image source={require('./img/justice.png')} style={styles.iconstyle} />
                <TextInput placeholder='Attorney Info'
                  placeholderTextColor='black'
                  autoCapitalize='none'
                  style={styles.inputtextstyle}
                  value={this.state.name}
                  editable={false}
                  selectTextOnFocus={false}
                  onChangeText={text => this.setState({ attorney_info: text })}
                />
              </View>
              <Text style={styles.errorText}>{this.state.attorney_infoErr}</Text>
            </KeyboardAvoidingView>

            <KeyboardAvoidingView style={styles.containerOuter}>
              <View style={styles.container}>
                <Image source={require('./img/catalogue.png')} style={styles.iconstyle} />
                <TextInput placeholder='Description'
                  placeholderTextColor='black'
                  autoCapitalize='none'
                  style={styles.inputtextstyle}
                  value={this.state.description}
                  onChangeText={text => this.setState({ description: text })}
                />
              </View>
              <Text style={styles.errorText}>{this.state.descriptionErr}</Text>
            </KeyboardAvoidingView>

            <KeyboardAvoidingView style={styles.containerOuter}>
              <View style={styles.container}>
                <Image source={require('./img/hammer.png')} style={styles.iconstyle} />
                <TouchableOpacity activeOpacity={.5} onPress={this.selectPhotoTapped.bind(this)} >
                  <Text style={styles.inputtextstylePic}>Court Dispo photos</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
            <View style={styles.containerOuter}>
              <ScrollView style={styles.containerImage} horizontal={true}>
                {this.renderButtons()}
              </ScrollView>
              <ScrollView style={styles.containerImage} horizontal={true}>
                {this.renderImges()}
              </ScrollView>
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
          </View>
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
        fontSize: wp('5.4%'),
        color: 'white',
        paddingBottom: Platform.OS === 'ios' ? 24 : 0,
      },
      android: {
        fontFamily: fontNameBold,
        fontSize: wp('5.4%'),
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
  inputtextstylePic: {
    ...Platform.select({
      ios: {
        fontFamily: 'Bahnschrift',
        fontSize: wp('4.8%'),
        flex: 1,
        color: '#000',
        justifyContent: "center",
        alignItems: "stretch",
      },
      android: {
        fontFamily: 'bahnschrift',
        fontSize: wp('4.8%'),
        padding: 0,
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
  containerImage: {
    ...Platform.select({
      ios: {
        alignSelf: 'center',
        flexDirection: 'row', flexWrap: 'wrap',
        width: wp('70%')
      },
      android: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: wp('75%'),
        flexWrap: 'wrap',
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

