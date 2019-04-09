/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Alert, AsyncStorage, Dimensions, TouchableOpacity } from 'react-native';
import { createStackNavigator, StackNavigator, DrawerNavigator } from 'react-navigation';
import LoginScreen from './src/screens/login';
import SignupScreen from './src/screens/signup';
import ForgetScreen from './src/screens/forget';
import Home from './src/screens/home';
import MessageArc from './src/screens/messageArc';
import CaseList from './src/screens/caselist';
import Contactus from './src/screens/contactus';
import Sidemenu from './src/screens/sidemenu';
import ViewCase from './src/screens/viewcase';
import AddReport from './src/screens/addreport';
import CommentAll from './src/screens/commentall';
import Profile from './src/screens/profile';
import Password from './src/screens/password';
import CommentOne from './src/screens/commentone';
import CommentOneArc from './src/screens/commentonearc';
import EditReport from './src/screens/editreport';
import IOSIcon from "react-native-vector-icons/Ionicons";
import { Button } from 'react-native-elements';
import { DrawerActions } from 'react-navigation-drawer';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const CustomNavigate = ({ initialRouteName }) => {
  const CustomTabNavigator = createStackNavigator({
    Home: {
      screen: Sidemenu,
    },
    Login: {
      screen: LoginScreen,
    },
    Signup: {
      screen: SignupScreen,
    },
    Forget: {
      screen: ForgetScreen,
    },
    AddReport : {
      screen: AddReport
    },
    CommentAll : {
      screen: CommentAll
    },
    CommentOne : {
      screen: CommentOne
    },
    CommentOneArc : {
      screen: CommentOneArc
    },
    ViewCase : {
      screen: ViewCase
    },
    EditReport : {
      screen: EditReport
    },
    CaseList: {
      screen: CaseList
    },
    Profile:{
      screen: Profile
    },
    Password: {
      screen: Password
    },
    MessageArc: {
      screen: MessageArc
    }
  }, {
      initialRouteName,
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
      }
    });
  CustomTabNavigator.navigationOptions = {
    header: null
  }
  return <CustomTabNavigator />
}

export default class App extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    }
   
  }
  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
    AsyncStorage.getItem("username").then((value) => {
      if (value) {
        this.setState({ isLoggedIn: true });
      }
    }).done();
  }
  }
  componentWillMount() {
    this._isMounted = false;
  }


  render() {
    return (
      <CustomNavigate initialRouteName={this.state.isLoggedIn ? 'Home' : 'Login'} />
    );
  }
}

