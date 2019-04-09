import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native';
class Logout extends Component {
  constructor(props) {
      super(props);
   }

  componentWillMount() {
      AsyncStorage.clear();
      this.props.navigation.navigate('Login');
  }
  componentDidMount() {
    AsyncStorage.clear();
    this.props.navigation.navigate('Login');
  }
  show(){
    this.props.navigation.navigate('Login');
  }
  render() {
    return this.show;
  }
}
export default Logout;

