//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'native-base';
import Colors from '../../../../components/colors';

const ValueWithIcon = props => {
  return (
    <View style={styles.roundInfoDate}>
      <Icon type={props.iconType} name={props.icon} style={styles.smallIcon} />
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{props.value}</Text>
        <Text style={styles.dateSubtitle}>{props.subtitle}</Text>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  date: {fontSize: 14, fontWeight: '600', textAlign: 'center'},
  dateSubtitle: {fontSize: 11, color: Colors.secondary, textAlign: 'center'},
  smallIcon: {color: Colors.mainBlue, fontSize: 22, marginVertical: 10},
  roundInfoDate: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '35%',
  },
});

//make this component available to the app
export default ValueWithIcon;
