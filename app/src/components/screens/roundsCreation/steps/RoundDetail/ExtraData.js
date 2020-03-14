//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'native-base';
import Colors from '../../../../components/colors';
import SubMenuContainer from './SubMenuContainer';
import ValueWithIcon from './ValueWithIcon';

class ExtraData extends Component {
  render() {
    let frequency = '';
    switch (this.props.frequency) {
      case 'm':
        frequency = 'Mensual';
        break;
      case 'q':
        frequency = 'Quincenal';
        break;
      case 's':
        frequency = 'Semanal';
        break;
    }
    return (
      <SubMenuContainer title="Otros Datos">
        <View style={styles.container}>
          <ValueWithIcon
            value={'$' + this.props.roundAmount}
            subtitle={'Monto Ronda'}
            icon={'attach-money'}
            iconType={'MaterialIcons'}
          />
          <ValueWithIcon
            value={'$' + Math.floor(parseFloat(this.props.value))}
            subtitle={'Valor Pago'}
            icon={'cash-usd'}
            middle={true}
            iconType={'MaterialCommunityIcons'}
          />
          <ValueWithIcon
            value={frequency}
            subtitle={'Frecuencia'}
            icon={'alarm'}
            iconType={'MaterialIcons'}
          />
        </View>
      </SubMenuContainer>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: '15%',
    overflow: 'hidden',
  },
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
    paddingVertical: 10,
  },
  roundInfoDate: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '35%',
  },

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
export default ExtraData;
