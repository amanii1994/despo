import React, { Component } from 'react';
import { TouchableHighlight, StyleSheet, Text, View, ScrollView, ImageBackground, Image, TextInput, StatusBar, Platform,Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp, heightPercentageToDP as hp,
  listenOrientationChange as loc, removeOrientationListener as rol
} from 'react-native-responsive-screen';
import {DrawerNavigator } from 'react-navigation';
import Home from './home';
import CaseList from './caselist';
import Contactus from './contactus';
import Login from './login';
import Password from './password';
import Logout from './logout';
import CommentAll from './commentall';
import CommentOne from './commentone';
import Message from './message';
import SideMenu from './stacknav';
import Profile from './profile';
import MessageArc from './messageArc';
import CommentOneArc from './commentonearc';

type Props = {};

const drawernav = DrawerNavigator({
  Home: {
    screen: Home,
  },
  CaseList: {
    screen: CaseList,
  },
  Profile: {
    screen: Profile,
  },
  Contactus: {
    screen: Contactus,
  },
  CommentAll: {
    screen: CommentAll,
  },
  Message: {
    screen: Message,
  },
  Password: {
    screen: Password,
  },
  CommentOne: {
    screen : CommentOne
  },
  CommentOneArc: {
    screen : CommentOneArc
  },
  MessageArc: {
    screen : MessageArc
  },
  Logout: {
    screen: Logout     // Empty screen, useless in this specific case
   },
}, {
    contentComponent: SideMenu,
    drawerWidth: Dimensions.get('window').width - 120,
  });

export default drawernav;


