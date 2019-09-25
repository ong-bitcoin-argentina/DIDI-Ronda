import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import ScreenContainer from '../ScreenContainer';
import NextButton from '../../../components/NextButton';

import colors from '../../../components/colors';
import * as actions from '../../../../actions/roundCreation';

import DatePicker from './datepicker';
import {Toast} from 'native-base';

class RoundDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
    };
  }

  nextStep = () => {
    this.props.navigation.navigate('NumbersAsign');
  };

  inputsValidation() {
    let {date, confirmationDate, paymentDate} = this.props;

    let dateISO = new Date(date).toISOString();
    let confirmationDateISO = new Date(confirmationDate).toISOString();
    let paymentDateISO = new Date(paymentDate).toISOString();

    let text = false;

    if (dateISO <= confirmationDateISO) {
      text =
        'La fecha de inicio debe ser posterior a la confirmacion de los participantes.';
    }
    if (paymentDateISO <= dateISO) {
      text = 'La fecha de pago debe ser posterior al inicio de la ronda.';
    }
    if (text) {
      Toast.show({
        text: text,
        position: 'top',
        type: 'warning',
      });
      return false;
    }
    return true;
  }
  datesReady() {
    if (
      this.props.date != '' &&
      this.props.confirmationDate != '' &&
      this.props.paymentDate != ''
    ) {
      return true;
    }
    return false;
  }
  render() {
    return (
      <ScreenContainer title="¿Cuando comenzara la ronda?" step={4}>
        <View
          style={{
            flex: 0.5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.backgroundGray,
          }}>
          <DatePicker
            setDate={d => {
              this.props.setDate(d);
            }}
            title={'Fecha inicial'}
            icon={'md-calendar'}
          />
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: colors.secondGray,
          }}>
          <Text style={{backgroundColor: colors.backgroundGray, padding: 20}}>
            Otros datos de la ronda
          </Text>
          <DatePicker
            setDate={d => {
              this.props.setConfirmationDate(d);
            }}
            title={'Confirmacion de participacion'}
            icon={'people'}
          />
          <DatePicker
            setDate={d => {
              this.props.setPaymentDate(d);
            }}
            title={'Primer pago de ronda'}
            icon={'logo-usd'}
          />
        </View>
        {this.datesReady() && (
          <NextButton
            callback={() => {
              this.inputsValidation() && this.nextStep();
            }}
          />
        )}
      </ScreenContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    date: state.roundCreation.date,
    confirmationDate: state.roundCreation.confirmationDate,
    paymentDate: state.roundCreation.paymentDate,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setDate: date => {
      dispatch(actions.setDate(date));
    },
    setConfirmationDate: date => {
      dispatch(actions.setConfirmationDate(date));
    },
    setPaymentDate: date => {
      dispatch(actions.setPaymentDate(date));
    },
    clearStore: () => {
      dispatch(actions.clearStore());
    },
    createRound: () => {
      dispatch(actions.createRound());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoundDate);
