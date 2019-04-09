import React, { Component } from 'react';
import { TouchableHighlight, StyleSheet, Text, View, ScrollView, Alert, ImageBackground, Image, TextInput, StatusBar, Platform, TouchableOpacity, AsyncStorage } from 'react-native';
import {
  widthPercentageToDP as wp, heightPercentageToDP as hp,
  listenOrientationChange as loc, removeOrientationListener as rol
} from 'react-native-responsive-screen';
import Statusbar from './status';
import { Button, Header } from 'react-native-elements';
import Loader from './loader';
import Constants from './constants';
import moment from 'moment';
const fontName = (Platform.OS === 'ios') ? 'Bahnschrift' : 'bahnschrift';
const fontNameBold = (Platform.OS === 'ios') ? 'Bahnschrift_Bold' : 'bahnschrift_bold';
const apiUrl = Constants.API_URL;
const imgUrl = Constants.IMAGE_URL;
//import SideMenu from './src/screens/sidemenu';

type Props = {};
class caselist extends Component<Props> {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      dataRes: {},
      loading: false,
      dataMsg: ''
    }

  }

  renderItems() {
    let table = [];
    if (this.state.status == 'success') {
      // Outer loop to create parent
      for (let i = 0; i < this.state.dataRes.length; i++) {
        //Create the parent and add the children
        let val = this.state.dataRes[i];
        let key = i;
        var str = moment(val.created).format('h:mm:ss a');

        table.push(<TouchableOpacity key={key} style={styles.container1} onPress={() => this.props.navigation.navigate('ViewCase', {
          itemId: val.id
        })}>
          <View style={styles.boxstyle}>
            <View style={{ width: wp('62%'), alignItems: 'flex-start' }}>
              <Text style={styles.headingtext}>{val.name}</Text>
            </View>
            <View style={{ width: wp('22%'), alignItems: 'flex-end' }}>
              <Text style={styles.headingtextright}>{val.status} case</Text>
            </View>
          </View>

          <View style={styles.boxstyle}>
            <View style={styles.boxAstyle}>
              <Text style={styles.textleft}>{val.description}</Text>
            </View>
            <View style={styles.boxBstyle}>
              <Text style={styles.textright}>RefNo. {val.ref_num}</Text>
              <Text style={styles.textright}>{str}</Text>
            </View>
          </View>
        </TouchableOpacity>)
      }
    } else {
      table.push(<Text key={'errMsg'} style={{ fontFamily: fontName, color: '#000', textAlign: 'center', fontSize: wp('4.5%') }}>{this.state.dataMsg}</Text>)
    }
    return table;
  }

  componentDidMount() {
    loc(this);
    this._isMounted = true;
    if (this._isMounted) {
    AsyncStorage.getItem("user_id").then((info) => {
      if (info) {
        this.state = {
          user_id: info
        }
        fetch(apiUrl + 'object=reportcase&action=fetchCases&user_id=' + this.state.user_id)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
            if (responseJson.status == 'success') {
              this.setState({ dataRes: responseJson.data, status: 'success' })
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

  render() {
    
    return (
      <View style={{ backgroundColor: '#8c8c8c', width: '100%', height: '100%' }}>
        <Statusbar backgroundColor="#282828" barStyle="light-content" />
        <Loader
          loading={this.state.loading} />
        <View>
          <Header backgroundColor='#282828'
            outerContainerStyles={{
              borderBottomWidth: 0,// remove shadow on iOS
            }}
            borderBottomWidth='0'
            leftComponent={{ icon: 'menu', color: '#fff', size: wp('8%'), onPress: () => this.props.navigation.openDrawer() }}
            centerComponent={{ text: 'Case List', style: { color: '#fff', fontSize: wp('7%'), fontFamily: fontName } }}
          />
        </View>
        <ScrollView style={{ marginTop: hp('2%') }}>
          {this.renderItems()}
        </ScrollView>
      </View>
    );
  }

}

export default caselist;

const styles = StyleSheet.create({
  headingtext: {
    marginLeft: 8,
    color: 'white',
    fontSize: wp('4.5%'),
    fontFamily: fontNameBold
  },
  headingtextright: {
    color: 'white',
    fontSize: wp('4.5%'),
    color: '#1aff8c',
    textAlign: 'right',
    fontFamily: fontName
  },
  textleft: {
    color: '#fff',
    fontSize: wp('3.5%'),
    marginLeft: wp('2%'),
    fontFamily: fontName
  },
  textright: {
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
    alignItems: 'flex-end',
    paddingRight: wp('2%')
  },
  container: {
    width: wp('94%'),
    height: 'auto',
    backgroundColor: 'black',
    alignSelf: 'center',
    borderRadius: 8,
    marginBottom: 6,
  },
  container1: {
    width: wp('94%'),
    height: 'auto',
    backgroundColor: 'black',
    alignSelf: 'center',
    borderRadius: 8,
    paddingBottom: 12,
    paddingTop: 4,
    marginBottom: hp('2%'),
  },
});
