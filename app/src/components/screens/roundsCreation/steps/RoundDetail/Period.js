//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'native-base';
import Colors from '../../../../components/colors';
import SubMenuContainer from './SubMenuContainer';

// create a component
class Period extends Component {
  render() {
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
              <Text style={styles.date}>{this.props.startDate}</Text>
              <Text style={styles.dateSubtitle}>Fecha Inicio</Text>
            </View>
          </View>
          <Icon
            type="MaterialCommunityIcons"
            name="arrow-right"
            style={{color: Colors.secondary}}></Icon>
          <View style={styles.roundInfoDate}>
            <Icon
              type="MaterialCommunityIcons"
              name="calendar-range"
              style={styles.smallIcon}
            />
            <View>
              <Text style={styles.date}>{this.props.endDate}</Text>
              <Text style={styles.dateSubtitle}>Fecha Fin</Text>
            </View>
          </View>
        </View>
      </SubMenuContainer>
    );
  }
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundInfoDate: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '35%',
  },
  date: {fontSize: 14, fontWeight: '600', textAlign: 'center'},
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

//make this component available to the app
export default Period;
