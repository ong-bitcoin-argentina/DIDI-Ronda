import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Button} from 'native-base';
import ScreenContainer from '../../ScreenContainer';
import NextButton from '../../../../components/NextButton';

import colors from '../../../../components/colors';
import * as actions from '../../../../../actions/roundCreation';
import Period from './Period';
import ExtraData from './ExtraData';
import Participants from './Participants';
import SubMenuContainer from './SubMenuContainer';

class RoundDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  calculateEndDate(date, frequency, numbers) {
    let auxFrequency = frequency;
    switch (frequency) {
      case 'm':
        auxFrequency = 30;
        break;
      case 's':
        auxFrequency = 7;
        break;
      case 'q':
        auxFrequency = 15;
        break;
      default:
        auxFrequency = 1;
    }
    var nextDate = new Date(date.valueOf());
    for (let i = 0; i < numbers; i++) {
      if (auxFrequency == 30) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else {
        nextDate.setDate(nextDate.getDate() + auxFrequency);
      }
    }
    return (
      nextDate.getDate() +
      '/' +
      nextDate.getMonth() +
      '/' +
      nextDate.getFullYear() 
    );
  }
  selectParticipants(participants, number) {
    const {participants: participantList} = {...this.props.data};

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
  nextStep() {
    this.props.createRound();
    this.props.navigation.navigate('Finish');
  }
  render() {
    return (
      <ScreenContainer title={null} step={6} nostep>
        <ScrollView contentContainerStyle={{}}>
          <SubMenuContainer>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Detalle de la ronda</Text>
            </View>
          </SubMenuContainer>

          <Period
            startDate={this.props.data.date}
            endDate={this.calculateEndDate(
              this.props.data.date,
              this.props.data.config.frequency,
              this.props.data.config.participantsQty,
            )}></Period>
          <ExtraData
            roundAmount={this.props.data.config.amount}
            value={this.props.data.config.numVal}
            frequency={this.props.data.config.frequency}></ExtraData>
          <Participants
            participants={this.props.data.participants}
            date={this.props.data.paymentDate}
            frequency={this.props.data.config.frequency}
            participantsQty={this.props.data.config.participantsQty}
            selectParticipants={(p, i) =>
              this.selectParticipants(p, i)
            }></Participants>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: colors.backgroundGray,
            }}>
            <Button
              onPress={() => this.nextStep()}
              style={{
                justifyContent: 'center',
                backgroundColor: colors.mainBlue,
                borderRadius: 8,
                width: '80%',
                marginBottom: 20,
              }}>
              <Text style={{color: 'white', fontWeight: '500'}}>
                Enviar invitacion
              </Text>
            </Button>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state.roundCreation,
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

const styles = StyleSheet.create({
  titleContainer: {
    flex: 0.2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundGray,
  },
  title: {
    paddingHorizontal: 20,
    color: colors.gray,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoundDetail);
