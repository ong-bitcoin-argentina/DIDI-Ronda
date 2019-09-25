import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Colors from '../../components/colors';
import Header from './Header';
import ExtraData from './ExtraData';
import {Button, Icon, Spinner} from 'native-base';
import * as actions from '../../../actions/rounds';

import ParticipantsList from './ParticipantList';
import RoundPopUp from '../../components/RoundPopUp';
import Avatar from '../roundsCreation/steps/SelectParticipants/Avatar';

class NumberDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {popup: false};
  }

  _renderPopUp(adminPaid, amount, roundName, roundId, adminId, number) {
    return (
      <RoundPopUp
        onRef={ref => (this.child = ref)}
        value={!adminPaid ? '' : '$' + amount}
        titleText={
          adminPaid
            ? '¿ Confirmas que le pagaras la ronda a Juani ?'
            : '¿Estas seguro que queres aportar $' +
              amount +
              ' a ' +
              roundName + '?'
        }
        icon={
          <Icon
            type="MaterialIcons"
            name={!adminPaid ? 'warning' : 'filter-tilt-shift'}
            style={{color: Colors.mainBlue, fontSize: 60}}
          />
        }
        positive={() => {
          !adminPaid
            ? this.props.payRound({
                roundId: roundId,
                admin: adminId,
                number: number,
              })
            : this.props.closeRound(roundId, number);
        }}
        negative={() => {}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justyfyContent: 'center',
            alignItems: 'center',
          }}>
          {adminPaid && <Avatar></Avatar>}
        </View>
      </RoundPopUp>
    );
  }
  render() {
    const {requestRounds} = this.props;
    const round = requestRounds.list.find(
      e => e._id === this.props.navigation.getParam('_id', null),
    );

    const shift = round.shifts.find(
      e => e._id === this.props.navigation.getParam('shift_id', null),
    );
    const startDate = new Date(round.startDate);
    const customStartDate = `${startDate.getDate()}/${startDate.getMonth()}/${startDate.getFullYear()}`;
    const endDate = new Date(round.endDate);
    const customEndDate = `${endDate.getDate()}/${endDate.getMonth()}/${endDate.getFullYear()}`;

    const roundData = {
      participants: round.participants,
      pays: shift.pays,
      name: round.name,
      amount: round.totalAmount,
      paymentsQty: round.shifts.length,
      pending: shift.status,
      frequency:
        round.recurrence == 'm'
          ? 'Mensual'
          : round.recurrence == 's'
          ? 'Semanal'
          : 'Quincenal',
      shifts: round.shifts,
      startDate: customStartDate,
      endDate: customEndDate,
      admin: round.admin,
      roundId: round._id,
    };

    const adminId = roundData.participants.find(
      participant => participant.user._id == roundData.admin,
    )._id;

    const adminPaid =
      roundData.pays.filter(pay => pay.participant == adminId).length > 0;

    return (
      <ScrollView
        contentContainerStyle={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {this._renderPopUp(
          adminPaid,
          roundData.amount,
          roundData.name,
          roundData.roundId,
          adminId,
          shift.number,
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{roundData.name}</Text>
        </View>
        <View style={styles.header}>
          <Header
            amount={roundData.amount}
            paymentsQty={roundData.paymentsQty}
            name={roundData.name}></Header>
          <ExtraData
            startDate={roundData.startDate}
            endDate={roundData.endDate}
            frequency={roundData.frequency}
            amount={Math.ceil(roundData.amount)}
            shifts={roundData.shifts.length}></ExtraData>
          {this.props.loading ? (
            <Spinner />
          ) : (
            <Button
              onPress={
                shift.status == 'completed'
                  ? () => {}
                  : !adminPaid
                  ? () => {
                      this.child._openPopUp();
                      this.setState({
                        roundName: roundData.name,
                        amount: Math.ceil(
                          roundData.amount / roundData.paymentsQty,
                        ),
                        adminPaid: adminPaid,
                        popup: true,
                        roundId: roundData.roundId,
                        adminId: adminId,
                        number: shift.number,
                      });
                    }
                  : () => {
                      this.child._openPopUp();
                      this.setState({
                        roundName: roundData.name,
                        amount: Math.ceil(
                          roundData.amount / roundData.paymentsQty,
                        ),
                        adminPaid: adminPaid,
                        popup: true,
                        roundId: roundData.roundId,
                        number: shift.number,
                      });
                    }
              }
              style={{
                width: '85%',
                justifyContent: 'center',
                backgroundColor:
                  shift.status == 'completed'
                    ? Colors.secondary
                    : Colors.mainBlue,
                borderRadius: 8,
                marginBottom: 20,
              }}>
              <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
                {shift.status == 'completed'
                  ? 'Esta ronda ya esta paga'
                  : adminPaid
                  ? 'Pagar la ronda'
                  : 'Hacer mi aporte'}
              </Text>
            </Button>
          )}
        </View>
        <ParticipantsList
          participants={roundData.participants}
          amount={Math.ceil(roundData.amount / roundData.paymentsQty)}
          pays={roundData.pays}></ParticipantsList>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.backgroundGray,
          }}>
          <View
            style={{
              borderTopColor: Colors.mainBlue,
              borderTopWidth: 2,
              width: '95%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 30,
              }}>
              <Icon
                style={{color: Colors.mainBlue, fontSize: 24}}
                type="MaterialIcons"
                name="attach-money"></Icon>
              <Text
                style={{fontWeight: '600', color: Colors.gray, width: '50%'}}>
                Dinero Recoletado
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                style={{color: Colors.mainBlue, fontSize: 24}}
                type="MaterialIcons"
                name="attach-money"></Icon>
              <Text style={{fontSize: 24, fontWeight: '400'}}>
                {Math.ceil(
                  (roundData.amount / roundData.paymentsQty) *
                    roundData.pays.length,
                )}
              </Text>
              <Icon
                style={{color: Colors.mainBlue, fontSize: 24}}
                type="MaterialIcons"
                name="check-circle"></Icon>
            </View>
          </View>
          {this.props.loading ? (
            <Spinner />
          ) : (
            <Button
              onPress={
                shift.status == 'completed'
                  ? () => {}
                  : !adminPaid
                  ? () => {
                      this.child._openPopUp();
                      this.setState({
                        roundName: roundData.name,
                        amount: Math.ceil(
                          roundData.amount / roundData.paymentsQty,
                        ),
                        adminPaid: adminPaid,
                        popup: true,
                        roundId: roundData.roundId,
                        adminId: adminId,
                        number: shift.number,
                      });
                    }
                  : () => {
                      this.child._openPopUp();

                      this.setState({
                        roundName: roundData.name,
                        amount: Math.ceil(
                          roundData.amount / roundData.paymentsQty,
                        ),
                        adminPaid: adminPaid,
                        popup: true,
                        roundId: roundData.roundId,
                        number: shift.number,
                      });
                    }
              }
              style={{
                width: '85%',
                justifyContent: 'center',
                backgroundColor:
                  shift.status == 'completed'
                    ? Colors.secondary
                    : Colors.mainBlue,
                borderRadius: 8,
                marginBottom: 20,
              }}>
              <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
                {shift.status == 'completed'
                  ? 'Esta ronda ya esta paga'
                  : adminPaid
                  ? 'Pagar la ronda'
                  : 'Hacer mi aporte'}
              </Text>
            </Button>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
  },
  scrollView: {
    width: '100%',
    paddingBottom: 50,

    flexGrow: 1,
    alignItems: 'center',
  },
  headerContainer: {
    margin: 15,
  },
  titleContainer: {
    height: 100,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: '100%',
  },
  dataRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    paddingHorizontal: 20,
    color: Colors.gray,
    fontSize: 18,
    fontWeight: 'bold',
  },
  centerBookmark: {
    position: 'absolute',
  },
  header: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

const mapStateToProps = state => {
  return {
    requestRounds: state.rounds.requestRounds,
    loading: state.rounds.numberDetails.loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    payRound: data => {
      dispatch(actions.payRound(data.roundId, data.number, data.admin));
    },
    closeRound: (roundId, number) => {
      dispatch(actions.closeRound(roundId, number));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NumberDetail);
