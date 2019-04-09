import React, { Component } from 'react';
import { View, StyleSheet, WebView,Image, Text, TextInput, ScrollView, Platform, Alert, TouchableOpacity } from 'react-native';
import Statusbar from './status';
import {
  widthPercentageToDP as wp, heightPercentageToDP as hp,
  listenOrientationChange as loc, removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { Header, CheckBox, Button } from 'react-native-elements';
import moment from 'moment';
import PDFView from 'react-native-view-pdf';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from './constants';
const apiUrl = Constants.API_URL;
const imgUrl = Constants.CASE_IMAGE_URL;
const fontName = (Platform.OS === 'ios') ? 'Bahnschrift' : 'bahnschrift';
const fontNameBold = (Platform.OS === 'ios') ? 'Bahnschrift_Bold' : 'bahnschrift_bold';
class viewcase extends Component<Props>{
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      dataRes: {},
      feedData: {},
      loading: false,
      dataMsg: '',
      show: true,
      selectedCheckbox: {}, // keep selected item in state, by default its empty meaning nothing is selected
      checkboxValue: [
        {
          label: "Closed",
          value: 1
        },
        {
          label: "Continued",
          value: 2
        }
      ]
    }
  }
  CheckMe = selectedCheckbox => {
    // Alert.alert('sjksjdskd');
    this.setState({ selectedCheckbox }); // update selected item

  };
  renderItems() {
    let table = [];
    if (this.state.feedData) {
      // Outer loop to create parent
      for (let i = 0; i < this.state.feedData.length; i++) {
        //Create the parent and add the children
        let val = this.state.feedData[i];
        let key = i;
        if (i == 0) {
          table.push(<View key={'testing'} style={{ marginBottom: hp('2%'), marginTop: hp('2%'), paddingLeft: 10 }}><Text style={{ fontFamily: fontName, fontSize: wp('6%') }}>Previous Feedback</Text></View>)
        }
        table.push(<TouchableOpacity key={key} style={styles.containerFeed}>
          <View style={styles.boxstyle}>
            <View style={{ width: wp('90%'), justifyContent: 'center', padding: '2%' }}>
              <Text style={{ textAlign: 'justify', color: 'white', fontSize: wp('3.5%'), fontFamily: fontName }}>{val.feedback}</Text>
              <Text style={{ textAlign: 'justify', color: 'white', fontSize: wp('3.5%'), fontFamily: fontName, paddingTop: hp('1%') }}>Created: {moment(val.created).format('h:mm:ss a')}</Text>
            </View>
          </View>
        </TouchableOpacity>)
      }
    }
    return table;
  }
  renderImages() {
    let table = [];
    if (this.state.status == 'success') {
      if (this.state.img) {    
        // Outer loop to create parent
        for (let i = 0; i < this.state.img.length; i++) {
          let imgName = this.state.img[i].data;
           //Create the parent and add the children
           let img = imgUrl + imgName;
          if(imgName.includes('.pdf') === true){
            table.push(<PDFView
              fadeInDuration={250.0}
              style={{ width: wp(20), height: hp(10), marginRight: wp(2),marginTop:hp('1.5%') }}
              resource={img}
              resourceType={'url'}
              onLoad={() => console.log(`PDF rendered from `)}
              onError={() => console.log('Cannot render PDF', error)}
              key={i}
          />
      )
          }else{
            table.push(<Image
              style={{ width: wp(20), height: hp(10), marginRight: wp(2),marginTop:hp('1.5%') }}
              source={{ uri: img }}
              key={i}
            />)
          }     
        }
        return table;
      }
    }
  }
  handleSubmit() {
    var status = this.state.selectedCheckbox.value;
    if (this.state.feedback !== undefined) {
      var feedback = this.state.feedback;
    } else {
      var feedback = '';
    }
    var id = this.props.navigation.getParam('itemId');
    if (status && id) {
      //  console.log('status=' + status + '&feedback=' + feedback+ '&case_id=' + id);
      fetch(apiUrl + 'object=reportcase&action=updateCase', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
        body: 'status=' + status + '&feedback=' + feedback + '&case_id=' + id
      }).then((response) => response.json())
        .then((responseJson) => {
          //  console.log(responseJson)
          if (responseJson.status == 'success') {
            Alert.alert('successfully saved!!')
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
    } else {
      Alert.alert('Please select status!!');
    }
  }
  componentDidMount() {
    this._isMounted = true;
    var id = this.props.navigation.getParam('itemId');
    if (this._isMounted) {
    fetch(apiUrl + 'object=reportcase&action=getSingleCase&case_id=' + id)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        if (responseJson.status == 'success') {
          if (responseJson.data.status == 'closed') {
            this.setState({ dataRes: responseJson.data, status: 'success', show: false, feedData: responseJson.feedback, img: responseJson.img })
          } else {
            this.setState({ dataRes: responseJson.data, status: 'success', show: true, feedData: responseJson.feedback, img: responseJson.img })
          }
        } else {
          this.setState({ dataMsg: responseJson.msg, status: 'error', show: false })
        }
      }).catch((error) => {
        console.error(error);
        if (error == 'TypeError: Network request failed') {
          Alert.alert('Something went wrong', 'Kindly check if the device is connected to stable cellular data plan or WiFi.');
        }
      });
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
    const { checkboxValue, selectedCheckbox } = this.state;
    return (
      <View style={{ backgroundColor: '#CAC6C5', width: '100%', height: '100%' }}>
        <Statusbar backgroundColor="#282828" barStyle="light-content" />
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
            centerComponent={{ text: 'View Case', style: { color: '#fff', fontSize: wp('7%'), fontFamily: fontName } }}
          />
        </View>
        <ScrollView>
          {this.state.status == 'error' ? <Text key={'errMsg'} style={{ fontFamily: fontName, color: '#000', textAlign: 'center', fontSize: wp('4.5%'), marginTop: hp('2%') }}>{this.state.dataMsg}</Text> :
            <TouchableOpacity style={styles.container1} >
              <View style={styles.boxstyle}>
                <View style={{ width: wp('62%'), alignItems: 'flex-start' }}>
                  <Text style={{ marginLeft: 8, color: 'white', fontSize: wp('4.5%'), fontFamily: fontNameBold }}>Name: {this.state.dataRes.name}</Text>
                </View>
                <View style={{ width: wp('22%'), alignItems: 'flex-end' }}>
                  <Text style={{ color: 'white', fontSize: wp('4.5%'), color: '#1aff8c', textAlign: 'right', fontFamily: fontName }}>{this.state.dataRes.status} case</Text>
                </View>
              </View>

              <View style={styles.boxstyle}>
                <View style={styles.boxAstyle}>
                  <Text style={{ color: '#fff', fontSize: wp('3.5%'), marginLeft: 8, fontFamily: fontName }}>Description: {this.state.dataRes.description}</Text>
                  <Text style={{ color: '#fff', fontSize: wp('3.5%'), marginLeft: 8, fontFamily: fontName }}>Created: {moment(this.state.dataRes.created).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                </View>
                <View style={styles.boxBstyle}>
                  <Text style={styles.textleft}>RefNo. {this.state.dataRes.ref_num}</Text>
                </View>
              </View>
            </TouchableOpacity>}
          <ScrollView horizontal={true} style={styles.containerImage}>
            {this.renderImages()}
          </ScrollView>
          {this.state.feedData ? this.renderItems() : ''}
          {this.state.show ?
            <View style={{ marginTop: hp('2%') }}>
              <View style={styles.container}>
                <View style={styles.checkstyle}>
                  <CheckBox
                    containerStyle={{ backgroundColor: 'black', borderWidth: 0 }}
                    checkedColor='#fff'
                    uncheckedColor='#fff'
                    size={30}
                    checked={checkboxValue[0].value === selectedCheckbox.value}
                    onPress={(value, index) => this.CheckMe(checkboxValue[0])}
                  />
                </View>
                <View style={{ alignSelf: 'center', width: wp('70') }}>
                  <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { alert('ok') }} >
                    <Text style={styles.Atextstyle}>Closed</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.container}>
                <View style={styles.checkstyle}>
                  <CheckBox
                    containerStyle={{ backgroundColor: 'black', borderWidth: 0 }}
                    checkedColor='#fff'
                    checkedColor='#fff'
                    size={30}
                    checked={checkboxValue[1].value === selectedCheckbox.value}
                    onPress={(value, index) => this.CheckMe(checkboxValue[1])}
                  />
                </View>
                <View style={{ alignSelf: 'center', width: wp('70') }}>
                  <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { alert('ok') }} >
                    <Text style={styles.Atextstyle}>Continued</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ marginBottom: hp('2%'), paddingLeft: 10 }}><Text style={{ fontFamily: fontName, fontSize: wp('6%') }}>Feedback</Text></View>
              <View style={styles.bottomContainer}>
                <TextInput
                  multiline={true}
                  numberOfLines={5}
                  placeholder='Lorem Ipsum is simply dummuy text of the printing and typesetting industry'
                  style={{ fontFamily: fontName, textAlignVertical: "top" }}
                  onChangeText={text => this.setState({ feedback: text })}
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
                  fontFamily={fontName}
                  textStyle={styles.buttontext}
                  onPress={() => this.handleSubmit()}
                />
              </View>
            </View> : null}
        </ScrollView>
      </View>
    );
  }
}
export default viewcase;
const styles = StyleSheet.create({
  buttontext: {
    ...Platform.select({
      ios: {
        fontFamily: fontNameBold,
        fontSize: wp('5.4%'),
        color: '#fff',
        padding: hp('1%'),
        paddingBottom: Platform.OS === 'ios' ? 24 : 0,
      },
      android: {
        fontFamily: fontNameBold,
        fontSize: wp('5.4%'),
        color: '#fff',
      }
    }),
  },
  containerImage: {
    width: wp('94%'),
    height: 'auto',
    alignSelf: 'center',
    flexDirection: 'row', 
    flexWrap: 'wrap'
  },
  buttoncontainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: hp('2%')
  },
  Atextstyle: {
    ...Platform.select({
      ios: {
        fontFamily: fontName,
        fontSize: wp('5.4%'),
        color: '#fff',
        textAlign: 'left',
        alignSelf: 'flex-start'
      },
      android: {
        fontFamily: fontName,
        fontSize: wp('5.4%'),
        color: '#fff',
        textAlign: 'left',
        alignSelf: 'flex-start'
      }
    }),
  },
  textareaContainer: {
    height: 180,
    padding: 5,
    backgroundColor: '#F5FCFF',
  },

  checkstyle: {
    width: wp('20%'),
    borderRightWidth: 1,
    borderRightColor: '#fff'
  },
  textstyle: {
    color: '#fff',
    fontSize: 12,
  },
  textleft: {
    color: '#fff',
    fontSize: wp('3.5%'),
    textAlign: 'right',
    fontFamily: fontName
  },
  boxstyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 1,
    marginBottom: 1,
    marginLeft: wp('2%'),
    marginRight: wp('2%'),
  },
  boxAstyle: {
    width: wp('62%'),
  },

  boxBstyle: {
    width: wp('30%'),
    flexDirection: 'column',
    // alignItems: 'flex-end',
    paddingRight: wp('2%')
  },
  container: {
    width: wp('94%'),
    height: 'auto',
    flexDirection: 'row',
    backgroundColor: 'black',
    alignSelf: 'center',
    borderRadius: 8,
    padding: 10,
    marginBottom: hp('4%')
  },
  container1: {
    width: wp('94%'),
    height: 'auto',
    backgroundColor: 'black',
    alignSelf: 'center',
    borderRadius: 8,
    paddingBottom: 12,
    paddingTop: 4,
    marginTop: hp('3%'),
    //marginBottom: hp('4%')
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