//import liraries
import React, {Component, useState} from 'react';
import {connect} from 'react-redux';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import * as actions from '../../../../../actions/roundCreation';

import colors from '../../../../components/colors';
import ScreenContainer from '../../ScreenContainer';
import NextButton from '../../../../components/NextButton';
import Number from './Number';

class NumbersAsign extends Component {
  nextStep() {
    this.props.navigation.navigate('RoundDetail');
  }
  selectParticipants(participants, number) {
    const {participants: participantList} = {...this.props};

    for (p of participantList) {
      if (p.number.includes(number)) {
        let index = participantList.indexOf(p);
        participantList.splice(index, 1);

        let numIndex = p.number.indexOf(number);
        p.number.splice(numIndex, 1);

        participantList.push(p);
      }
    }

    for (p of participants) {
      let index = participantList.indexOf(p);
      participantList.splice(index, 1);

      p.number.push(number);

      participantList.push(p);
    }
    
    this.props.setParticipants(participantList);
  }

  calculateDates(date, frequency, numbers) {
    let dates = [];

    var nextDate = new Date(date.valueOf());
    let auxPreNextDate = new Date(nextDate.valueOf());

    dates.push(auxPreNextDate);
    for (let i = 0; i < numbers - 1; i++) {
      if (frequency == 30) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else {
        nextDate.setDate(nextDate.getDate() + frequency);
      }
      let auxNextDate = new Date(nextDate.valueOf());
      dates.push(auxNextDate);
    }
    return dates;
  }
  render() {
    let startDate = this.props.paymentDate;
    let frequency = 7;
    switch (this.props.frequency) {
      case 'm':
        frequency = 30;
        break;
      case 's':
        frequency = 7;
        break;
      case 'q':
        frequency = 15;
        break;
      default:
        frequency = 1;
    }

    const dates = this.calculateDates(
      startDate,
      frequency,
      this.props.participantsQty,
    );

    return (
      <ScreenContainer title={'Configura el orden de los numeros'} step={5}>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              paddingHorizontal: 10,
            }}>
            <Text style={styles.title}>Número</Text>
            <Text style={styles.title}>Participante</Text>
            <View style={{width: 50}}>
              <Text style={styles.title}>Fecha Cobro</Text>
            </View>
          </View>
          <FlatList
            renderItem={i => {
              return (
                <Number
                  date={i}
                  selectParticipants={participants =>
                    this.selectParticipants(participants, i.index + 1)
                  }
                  index={i.index}
                  participants={this.props.participants}
                  detail={false}></Number>
              );
            }}
            data={dates}
            style={styles.numbersContainer}></FlatList>
        </View>
        <NextButton callback={() => this.nextStep()}></NextButton>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
  },
  numbersContainer: {
    width: '100%',
    flex: 1,
  },
  number: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    paddingHorizontal: 20,
    backgroundColor: colors.backgroundGray,
  },
  participant: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  participantIdentification: {
    flex: 1,
    flexDirection: 'column',
  },
  numberFlag: {
    color: colors.mainBlue,
    marginRight: 15,
    fontSize: 40,
  },
  thumbnail: {
    height: 40,
    width: 40,
    marginRight: 15,
  },
  participantName: {
    fontWeight: 'bold',
    color: colors.gray,
    fontSize: 22,
  },
  participantNumber: {
    color: colors.secondary,
    fontSize: 18,
  },
  contactThumbnailContainer: {flexDirection: 'row', alignItems: 'center'},
  contactThumbnail: {
    height: 46,
    width: 46,
    borderRadius: 23,
    marginRight: 12,
  },
  title: {
    color: colors.mainBlue,
    fontWeight: '500',
  },
});

const mapStateToProps = state => {
  return {
    participants: state.roundCreation.participants,
    participantsQty: state.roundCreation.config.participantsQty,
    paymentDate: state.roundCreation.paymentDate,
    frequency: state.roundCreation.config.frequency,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setParticipants: participants => {
      dispatch(actions.setParticipants(participants));
    },
    createRound: () => {
      dispatch(actions.createRound());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NumbersAsign);
