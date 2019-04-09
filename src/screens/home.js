import React, { Component } from 'react';
import OneSignal from 'react-native-onesignal';
import { View, StyleSheet, Image, Text, ScrollView, Platform, Alert, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Statusbar from './status';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { Header } from 'react-native-elements';
import moment from 'moment';
import Constants from './constants';
const apiUrl = Constants.API_URL;
const imgUrl = Constants.IMAGE_URL;
const fontName = (Platform.OS === 'ios') ? 'Bahnschrift' : 'bahnschrift';
const fontNameBold = (Platform.OS === 'ios') ? 'Bahnschrift_Bold' : 'bahnschrift_bold';
export default class Home extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            phone: '',
            city: '',
            state: '',
            img: '',
            dataRes: {},
            dataMsg: '',

        }
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            AsyncStorage.getItem("userdata").then((info) => {
                if (info) {
                    let dt = JSON.parse(info);
                    console.log(dt);
                    var that = this;
                    Object.keys(dt).forEach(function (key) {
                        if (dt[key] == null) {
                            that.setState({
                                [key]: ''
                            })
                        } else {
                            that.setState({
                                [key]: dt[key]
                            })
                        }
                    });
                    if (that.state.img) {
                        that.setState({ img: imgUrl + that.state.img })
                    }
                }
            }).done();
        }
        loc(this);
    }
    renderItems() {
        let table = []
        if (this.state.status == 'success') {
            // Outer loop to create parent
            for (let i = 0; i < this.state.dataRes.length; i++) {
                //Create the parent and add the children
                let val = this.state.dataRes[i];
                let key = i;
                var str = moment(val.created).format('h:mm:ss a');

                table.push(<TouchableOpacity key={key} style={styles.container1} onPress={() => this.props.navigation.navigate('ViewCase', { itemId: val.id })}>
                    <View style={styles.boxstyle}>
                        <View style={{ width: wp('62%'), alignItems: 'flex-start' }}><Text style={{ marginLeft: 8, color: 'white', fontSize: wp('4.5%'), fontFamily: fontNameBold }}>{val.name}</Text></View>
                        <View style={{ width: wp('22%'), alignItems: 'flex-end' }}><Text style={{ color: 'white', fontSize: wp('4.5%'), color: '#1aff8c', textAlign: 'right', fontFamily: fontName }}>{val.status} case</Text></View>
                    </View>

                    <View style={styles.boxstyle}>
                        <View style={styles.boxAstyle}><Text style={{ color: '#fff', fontSize: wp('3.5%'), marginLeft: 8, fontFamily: fontName }}>{val.description}</Text></View>
                        <View style={styles.boxBstyle}><Text style={styles.textleft}>RefNo. {val.ref_num}</Text><Text style={styles.textleft}>{str}</Text></View>
                    </View>
                </TouchableOpacity>)
            }
        } else {
            table.push(<Text key={'errMsg'} style={{ fontFamily: fontName, color: '#000', textAlign: 'center', fontSize: wp('4.5%') }}>{this.state.dataMsg}</Text>)
        }
        return table;
    }
    componentWillMount() {
        rol(this);
        OneSignal.init('2f649632-1675-4d50-bb82-806e8041e543');
        OneSignal.addEventListener('received', this.onReceived.bind(this));
        OneSignal.addEventListener('opened', this.onOpened.bind(this));
        OneSignal.addEventListener('ids', this.onIds.bind(this));
        OneSignal.configure();
        OneSignal.enableVibrate(true);
        OneSignal.enableSound(true);
        OneSignal.inFocusDisplaying(2);
    }
    onReceived(notification) {
        console.log("Notification received: ", notification);
    }
    onOpened(openResult) {
        this.props.navigation.navigate('Message');
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
    }

    onIds(device) {
        console.log('Device info: ', device);
        AsyncStorage.getItem("user_id").then((info) => {
            if (info) {
                fetch(apiUrl + 'object=user&action=savePlayerID', {
                    method: 'POST',
                    headers: new Headers({
                        'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
                    }),
                    body: 'user_id=' + info + '&player_id=' + device.userId
                })
                    .then((response) =>
                        response.json())
                    .then((responseJson) => {
                        //  console.log(responseJson)
                    }).catch((error) => {
                        console.error(error);
                        if (error == 'TypeError: Network request failed') {
                            Alert.alert('Something went wrong', 'Kindly check if the device is connected to stable cellular data plan or WiFi.');
                        }
                    });
            }
        }).done();
    }
    componentWillUnmount() {
        this._isMounted = false;
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
    }
    render() {
        AsyncStorage.getItem("user_id").then((info) => {
            if (info) {
                this.state = {
                    user_id: info
                }
                fetch(apiUrl + 'object=reportcase&action=fetchHomeCases&user_id=' + this.state.user_id)
                    .then((response) =>
                        response.json())
                    .then((responseJson) => {
                        //  console.log(responseJson)
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
        return (<View style={{ backgroundColor: '#8c8c8c', width: '100%', height: '100%' }}>
            <Statusbar backgroundColor="#282828" barStyle="light-content" />
            <View>
                <Header backgroundColor='#282828' outerContainerStyles={{ borderBottomWidth: 0  }}
                    leftComponent={{ icon: 'menu', color: '#fff', size: wp('8%'), onPress: () => this.props.navigation.openDrawer() }}
                    centerComponent={{ text: 'Home', style: { color: '#fff', fontSize: wp('7%'), fontFamily: fontName } }}
                    rightComponent={{ icon: 'add', color: '#fff', size: wp('8%'), onPress: () => this.props.navigation.navigate('AddReport') }}
                /></View>
            <ScrollView>
                <Image source={require('./img/Truck.png')}
                    width='100'
                    height='100'
                    style={{ alignSelf: 'center' }} /> 
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row' }}> 
                            {this.state.img === '' ? <Image source={require('./img/no-user-white.png')} style={{ margin: 8, width: 80, height: 80, borderRadius: 40 }} /> : <Image source={{ uri: this.state.img }} style={{ margin: 8, width: 80, height: 80, borderRadius: 40 }} />}
                        <View style={{ flexDirection: 'column' }}><Text style={{color: '#fff',fontFamily: fontName,fontSize: wp('5.8'),marginTop: 8,marginBottom: 5}}>{this.state.name}</Text>
                            <View style={styles.boxBstyle}>
                                <View style={styles.boxpicA}><Image source={require('./img/mailWhite.png')} style={{ marginRight: 4 }}/><Text style={styles.textstyle}>{this.state.email}</Text></View>
                                <View style={styles.boxpicA}><Image source={require('./img/phone1.png')} style={{ marginRight: 4 }}/><Text style={styles.textstyle}>{this.state.mobile}</Text></View>
                            </View>
                            <View style={styles.boxstyle}>
                                <View style={styles.boxpicB}><Image source={require('./img/building.png')} style={{ marginRight: 4 }} /><Text style={styles.textstyle}>{this.state.city}</Text></View>
                                <View style={styles.boxpicB}><Image source={require('./img/state1.png')} style={{ marginRight: 4 }} /><Text style={styles.textstyle}>{this.state.state}</Text></View> 
                            </View> 
                        </View> 
                    </View> 
                </View><Text style={{ fontSize: wp('6%'), color: 'black', marginStart: 15, marginBottom: 4, fontFamily: fontName }}>Case List</Text>{this.renderItems()}
            </ScrollView>
        </View>
        );
    }
}
const styles = StyleSheet.create({
    textstyle: {
        ...Platform.select({
            ios: {
                color: '#fff',
                fontSize: wp('3.5%'),
                fontFamily: fontName,
            },
            android: {
                color: '#fff',
                fontSize: wp('3.5%'),
                fontFamily: fontName
            }
        }),
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
        // marginLeft:wp('2'),
        marginRight: wp('2%'),
        paddingBottom: hp(1)
    },
    boxpicA: {
        width: wp('45%'),
        flexDirection: 'row',
        marginBottom: 2
    },
    boxpicB: {
        width: wp('30%'),
        flexDirection: 'row',
    },

    boxAstyle: {
        width: wp('62%'),
    },

    boxBstyle: {
        width: wp('30%'),
        flexDirection: 'column',
        // alignItems:'flex-end', 
        // paddingRight:wp('2%')
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
        marginBottom: 5
    },
});