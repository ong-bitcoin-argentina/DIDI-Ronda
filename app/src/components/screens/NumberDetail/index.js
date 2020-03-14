import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Colors from '../../components/colors';
import Header from './Header';
import ExtraData from './ExtraData';
import {Button, Icon, Spinner} from 'native-base';

import * as roundsActions from '../../../actions/rounds';


import ParticipantsList from './ParticipantList';
import RoundPopUp from '../../components/RoundPopUp';
import Avatar from '../roundsCreation/steps/SelectParticipants/Avatar';

import NextShiftPopup from './NextShiftPopup';

class NumberDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      popup: false,
      NextShiftPopupProps: null,
    };
  }

  _renderPopUp( adminPaid, amount, roundName, roundId, adminId, participants, number ) {

    const {requestRounds} = this.props;

    const round = requestRounds.list.find(
      e => e._id === this.props.navigation.getParam('_id', null),
    );

    const participantsText = participants.map( p => p.user.name ).join(" y ");

    const titleText = adminPaid ? 
    `¿ Confirmas que le pagarás la ronda a ${participantsText}?` :
    `¿Estás seguro que querés aportar $${ Math.floor(amount / round.shifts.length) } a ${roundName}?`;

    const positiveFunction = () => {

      if( !adminPaid ){

        this.props.pay_round( roundId, number, adminId )

      } else {

        const shift = round.shifts.find(
          e => e._id === this.props.navigation.getParam('shift_id', null),
        );
        const nextShift = round.shifts.find(
          e => e.number === shift.number+1,
        );

        if( nextShift ){

          if( nextShift.status === "pending" ){

            // Set state for modal
            this.setState({
              NextShiftPopupProps: {
                roundId: roundId,
                number: number,
                roundName: roundName,
              }
            })

            // Open modal
            return this.child2._openPopUp();

          } else {
            // Close round
            this.props.close_round(roundId, number)
            // this.props.closeRound({
            //   roundId: roundId,
            //   number: number,
            // })
          }

        }

        
      }

    }

    return (
      <RoundPopUp
        onRef={ ref => (this.child = ref) }
        value={ adminPaid && `$${amount}` }
        titleText={ titleText }
        icon={
          <Icon
            type="MaterialIcons"
            name={ adminPaid ? 'filter-tilt-shift' : 'warning' }
            style={ {color: Colors.mainBlue, fontSize: 60} }
          />
        }
        positive={ positiveFunction }
        negative={ ()=>{} } >
        <View  style={ styles.popUpChild }>
          { adminPaid && <Avatar /> }
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
      amount: round.amount,
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

    
    const ctaButtonFunction = () => {

      if( shift.status !== "completed" ){    

        this.child._openPopUp();

        const newState = {
          roundName: roundData.name,
          amount: Math.ceil(
            roundData.amount / roundData.paymentsQty,
          ),
          adminPaid: adminPaid,
          popup: true,
          roundId: roundData.roundId,
          number: shift.number,
        }

        if( adminPaid ){
          this.setState( newState )
        } else {
          this.setState( {...newState, adminId: adminId} )
        }

      }

    }

    const ctaButtonText = () => {
      if( shift.status === "completed" ) {
        return 'Esta ronda ya está paga'
      } else {
        return adminPaid ? 'Pagar la ronda' : 'Hacer mi aporte'
      }
    }

    const ctaButton = (
      this.props.loading ?
      <Spinner /> : 
      ( 
        <Button
          onPress={ ctaButtonFunction }
          style={ [styles.ctaButton, { backgroundColor: (shift.status === 'completed' ? Colors.secondary : Colors.mainBlue) }] }>
          <Text style={ styles.ctaButtonText }>{ ctaButtonText() }</Text>
        </Button>
      )
    )

    return (
      <React.Fragment>

        <NextShiftPopup {...this.state.NextShiftPopupProps} onRef={ ref => (this.child2 = ref) } />

        <ScrollView
          contentContainerStyle={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>

          {
            this._renderPopUp(
              adminPaid,
              roundData.amount,
              roundData.name,
              roundData.roundId.toString(),
              adminId,
              roundData.participants.filter(p => shift.participant.includes(p._id)),
              shift.number,
            )
          }

          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              { roundData.name }
            </Text>
          </View>

          <View style={ styles.header }>

            <Header
              recolected={
                (roundData.amount / roundData.shifts.length) * roundData.pays.length
              }
              amount={ roundData.amount }
              paymentsQty={ roundData.paymentsQty }
              shiftNumber={ shift.number }
              name={ roundData.name } 
            />

            <ExtraData
              startDate={ roundData.startDate }
              endDate={ roundData.endDate }
              frequency={ roundData.frequency }
              amount={ Math.ceil(roundData.amount) }
              userPaid={ adminPaid }
              shifts={ roundData.shifts.length } 
            />

            { ctaButton }

          </View>

          <ParticipantsList
            participants={ roundData.participants }
            amount={ Math.ceil(roundData.amount / roundData.paymentsQty) }
            pays={ roundData.pays }

            goToPay={
              p => {
                this.props.navigation.navigate('NumberPay',
                          { participant: p, shifts: roundData.shifts, roundId: roundData.roundId, number: shift.number }
                   )}
            }
          />

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
                  name="attach-money" 
                />

                <Text
                  style={{fontWeight: 'bold', color: Colors.gray, width: '50%'}}>
                  Dinero Recoletado
                </Text>

              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>

                <Icon
                  style={{color: Colors.mainBlue, fontSize: 24}}
                  type="MaterialIcons"
                  name="attach-money"
                />

                <Text style={{fontSize: 24, fontWeight: '400'}}>
                  {
                    Math.ceil( (roundData.amount / roundData.paymentsQty) * roundData.pays.length )
                  }
                </Text>

              </View>

            </View>

            { ctaButton }

          </View>
          
        </ScrollView>

      </React.Fragment>
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
  popUpChild: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButton: {
    width: '85%',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  ctaButtonText: {
    color: 'white', 
    fontSize: 16, 
    fontWeight: '600'
  }
});

const mapStateToProps = state => {
  return {
    requestRounds: state.rounds.requestRounds,
    loading: state.rounds.numberDetails.loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    pay_round: ( roundId, number, participantId ) => {
      dispatch(roundsActions.payRound( roundId, number, participantId ));
    },
    close_round: ( roundId, number, nextDraw=false ) => {
      dispatch(roundsActions.closeRound(roundId, number, nextDraw));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NumberDetail);
