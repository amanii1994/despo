import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import {
  widthPercentageToDP as wp, heightPercentageToDP as hp,
  listenOrientationChange as loc, removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { ScrollView, Text, View, StyleSheet, Image, Platform, TouchableOpacity, AsyncStorage } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import Constants from './constants';
const apiUrl = Constants.API_URL;
const imgUrl = Constants.IMAGE_URL;
const fontName = (Platform.OS === 'ios') ? 'Bahnschrift' : 'bahnschrift';
const fontNameBold = (Platform.OS === 'ios') ? 'Bahnschrift_Bold' : 'bahnschrift_bold';
class SideMenu extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      img: '',
      name: '',
    }
  }
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }
  componentWillReceiveProps() {
    this._isMounted = true;
    if (this._isMounted) {
    AsyncStorage.getItem("userdata").then((info) => {
      if (info) {
        let dt = JSON.parse(info);
        this.setState({ name: dt.name });
        if (dt.img) {
          this.setState({ img: imgUrl + dt.img });
        }
      }
    }).done();
  }
  }
  logout() {
    AsyncStorage.setItem("username", "");
    AsyncStorage.setItem("user_id", "");
    AsyncStorage.setItem("userdata", "");
    AsyncStorage.clear();
    this.props.navigation.navigate('Login');
  }
  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      AsyncStorage.getItem("userdata").then((info) => {
        if (info) {
          let dt = JSON.parse(info);
          this.setState({ name: dt.name });
          if (dt.img) {
            this.setState({ img: imgUrl + dt.img });
          }
        }
      }).done();
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
      <View style={styles.container}>
        <ScrollView>
          <View style={{ justifyContent: 'center', alignSelf: 'center', marginTop: hp('5%'), }}>
            {this.state.img ? <Image source={{ uri: this.state.img }} style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 1, borderColor: '#fff' }} /> : <Image source={require('./img/no-user-white.png')} style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 1, borderColor: '#fff' }} />}
            <Text style={{ color: '#fff', textAlign: 'center', paddingTop: hp('1%'), fontFamily: fontNameBold, fontSize: 18 }}>
              {this.state.name}
            </Text>
          </View>
          <View style={{ marginTop: hp('2%') }}>
            <TouchableOpacity style={styles.navSectionStyle} onPress={() => this.props.navigation.navigate('Home')}>
              <Image source={require('./img/home.png')}
                style={{ marginTop: hp('1%') }}
              />
              <Text style={{ color: '#fff', textAlign: 'center', paddingTop: hp('1%'), fontFamily: fontNameBold, fontSize: 18 }}> Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navSectionStyle} onPress={() => this.props.navigation.navigate('Profile')}>
              <Image source={require('./img/man-user-white.png')}
                style={{ marginTop: hp('1%') }}
              />
              <Text style={{ color: '#fff', textAlign: 'center', paddingTop: hp('1%'), fontFamily: fontNameBold, fontSize: 18 }}> Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navSectionStyle} onPress={() => this.props.navigation.navigate('CaseList')}>
              <Image source={require('./img/layout.png')}
                style={{ marginTop: hp('1%') }}
              />
              <Text style={{ color: '#fff', textAlign: 'center', paddingTop: hp('1%'), fontFamily: fontNameBold, fontSize: 18 }}> Case List</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navSectionStyle} onPress={() => this.props.navigation.navigate('CommentAll')}>
              <Image source={require('./img/folder.png')}
                style={{ marginTop: hp('1%') }}
              />
              <Text style={{ color: '#fff', textAlign: 'center', paddingTop: hp('1%'), fontFamily: fontNameBold, fontSize: 18 }}> Comments</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navSectionStyle} onPress={() => this.props.navigation.navigate('Message')}>
              <Image source={require('./img/envelope.png')}
                style={{ marginTop: hp('1%') }}
              />
              <Text style={{ color: '#fff', textAlign: 'center', paddingTop: hp('1%'), fontFamily: fontNameBold, fontSize: 18 }}> Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navSectionStyle} onPress={() => this.props.navigation.navigate('MessageArc')}>
              <Image source={require('./img/file.png')}
                style={{ marginTop: hp('1%') }}
              />
              <Text style={{ color: '#fff', textAlign: 'center', paddingTop: hp('1%'), fontFamily: fontNameBold, fontSize: 18 }}> Archive Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navSectionStyle} onPress={() => this.props.navigation.navigate('Contactus')}>
              <Image source={require('./img/business-cards-database.png')}
                style={{ marginTop: hp('1%') }}
              />
              <Text style={{ color: '#fff', textAlign: 'center', paddingTop: hp('1%'), fontFamily: fontNameBold, fontSize: 18 }}> Contact Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navSectionStyle} onPress={() => this.props.navigation.navigate('Password')}>
              <Image source={require('./img/white-lock.png')}
                style={{ marginTop: hp('1%') }}
              />
              <Text style={{ color: '#fff', textAlign: 'center', paddingTop: hp('1%'), fontFamily: fontNameBold, fontSize: 18 }}> Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navSectionStyle} onPress={() => this.logout()}>
              <Image source={require('./img/logout.png')}
                style={{ marginTop: hp('1%') }}
              />
              <Text style={{ color: '#fff', textAlign: 'center', paddingTop: hp('1%'), fontFamily: fontNameBold, fontSize: 18 }}> Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};
export default SideMenu;
const styles = StyleSheet.create({
  container: {
    paddingTop: hp('5%'),
    flex: 1,
    backgroundColor: 'black'
  },
  navItemStyle: {
    padding: 10
  },
  navSectionStyle: {
    flexDirection: 'row', justifyContent: 'flex-start', marginLeft: wp('10%'), marginTop: hp('3%')
  },
  sectionHeadingStyle: {
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  footerContainer: {
    padding: 20,
    backgroundColor: 'lightgrey'
  }
});
