//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Icon} from 'native-base';

import SubMenuContainer from './SubMenuContainer';
import Colors from '../colors';
import Arrow from '../../../assets/img/arrow-blue.svg';


const Period = props => {

    const { startDate, endDate } = props;

    const dateFormat = date => {
        const dateObject = new Date( date );
        return `${dateObject.getDate()}/${dateObject.getMonth()}/${dateObject.getFullYear()}`
    }

    const SCREEN_WIDTH = Dimensions.get('window').width;

    return (
      <SubMenuContainer title="Periodo">
        <View style={styles.roundInfoDates}>
          <View style={styles.roundInfoDate}>
            <Icon
              type="MaterialCommunityIcons"
              name="calendar-range"
              style={styles.smallIcon}
            />
            <View style={styles.dateContainer}>
              <Text style={styles.date}>{ dateFormat( startDate ) }</Text>
              <Text style={styles.dateSubtitle}>Fecha Inicio</Text>
            </View>
          </View>
          <Arrow width={120} height={12} color={Colors.mainBlue} style={{color: Colors.mainBlue, position: 'absolute', left: (SCREEN_WIDTH * 0.5 ) - 60}} />
          <View style={styles.roundInfoDate}>
            <Icon
              type="MaterialCommunityIcons"
              name="calendar-range"
              style={styles.smallIcon}
            />
            <View>
              <Text style={styles.date}>{ dateFormat( endDate ) }</Text>
              <Text style={styles.dateSubtitle}>Fecha Fin</Text>
            </View>
          </View>
        </View>
      </SubMenuContainer>
    );
}

// define your styles
const styles = StyleSheet.create({
  roundInfo: {
    flexDirection: 'column',
    height: 100,
    marginBottom: 8,
    backgroundColor: 'white',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  roundInfoDates: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  roundInfoDate: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '35%',
  },
  date: {fontSize: 14, fontWeight: 'bold', textAlign: 'center'},
  dateSubtitle: {fontSize: 11, color: Colors.secondary, textAlign: 'center'},
  smallIcon: {color: Colors.mainBlue, fontSize: 22},
  roundState: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingRight: 20,
  },
  state: {
    color: Colors.lightBlue,
    fontStyle: 'italic',
  },
  dateContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Period;
