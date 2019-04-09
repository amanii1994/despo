import React,{Components} from 'react';
import {View, StatusBar,Platform} from 'react-native';
export default function(props){
    const height =(Platform.OS === 'ios') ? 33 : 0;
    const{backgroundColor}=props;
    return(
        <View style={{height,backgroundColor}}>
            <StatusBar { ...props}/>
        </View>
    );
}