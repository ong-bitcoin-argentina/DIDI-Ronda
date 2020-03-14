//import liraries
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../../components/colors';
import {Icon} from 'native-base';
import Header from './Header';
import ExtraData from './ExtraData';
import SelectedList from '../roundsCreation/steps/SelectParticipants/SelectedList';
import DrawModal from './DrawModal';
// import Number from '../roundsCreation/steps/NumbersAsign/Number';
import Number from '../../components/Number';
import { roundStatusArray } from '../../../components/utils';


// class StartedRound extends Component {
const StartedRound = props => {

  const roundParams = {
    name: props.navigation.getParam('name', 'Ronda'),
    paymentsQty: props.navigation.getParam('paymentsQty', '2'),
    pending: props.navigation.getParam('pending', false),
    amount: props.navigation.getParam('amount', '200'),
    frequency: props.navigation.getParam('frequency', 'm'),
    participants: props.navigation.getParam('participants', []),
    startDate: props.navigation.getParam('customStartDate', '10/10/10'),
    endDate: props.navigation.getParam('customEndDate', '10/10/10'),
    _id: props.navigation.getParam('_id', null),
    admin: props.navigation.getParam('admin', null),
  };

  const [modalProps, setModalProps] = useState({round: null, item: null, number: null});

  const { _id } = roundParams;
  const {requestRounds} = props;

  const round = requestRounds.list.find(
    e => e._id === props.navigation.getParam('_id', null),
  );

  const roundData = {
      shifts: round.shifts,
  };

  const lastCompleted = round.shifts.reverse().find( e => e.status === 'completed');
  round.shifts.reverse();
  const currentShift = lastCompleted && round.shifts.find( e => e.number === lastCompleted.number+1);

  const currentShiftPaysAmount = currentShift && currentShift.pays && currentShift.pays.length * round.amount;

  const listItemPressHandler = item => {

    const newModalProps = {
      round: round,
      item: item,
      number: item.number
    }

    setModalProps( newModalProps )


    // No participant assigned and status is draw
    if( item.participant.length === 0 && item.status === "draw" ) {

      // Open draw modal
      return this.child._openPopUp();

    } 

    // Status is current or completed
    if( item.status === "current" || item.status === "completed" ){

      // Go to number detail
      return props.navigation.navigate('NumberDetail', {
        shift_id: item._id,
        _id,
      });

    }



  }

  const { name, amount, paymentsQty, startDate, shifts, endDate, recurrence: frequency, participants } = round;


  const currentShiftHeader = shifts.find(s => s.status === 'current' || s.status === 'draw')
  const currentPaymentHeader = currentShiftHeader ?  currentShiftHeader.number : '0'

  return (
    <View style={styles.container}>

      <DrawModal {...modalProps} onRef={ ref => (this.child = ref) } />

      <ScrollView contentContainerStyle={styles.scrollView}>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{name}</Text>
        </View>

        <Header
          amount={amount}
          currentPayment={currentPaymentHeader}
          paymentsQty={shifts.length}
          currentShiftPaysAmount={currentShiftPaysAmount ? currentShiftPaysAmount : 0}
          name={name} />

        <View>
          <ExtraData
            startDate={startDate}
            endDate={endDate}
            frequency={frequency}
            amount={amount}
            shifts={roundData.shifts.length} />

        </View>

        <View
          style={{
            width: Dimensions.get('window').width,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}>
          <Text style={styles.listTitle}>Número</Text>
          <Text style={[styles.listTitle, {textAlign: 'left', width: 140}]}>
            Cobra
          </Text>
          <Text style={styles.listTitle}>Estado</Text>
        </View>

        <View style={{flex: 1}}>
          <FlatList
            data={roundData.shifts}
            contentContainerStyle={{
              justifyContent: 'center',
              width: '100%',
            }}
            scrollEnabled={false}
            renderItem={ ({item}) => {

              const numberDate = new Date(item.limitDate)

              const numberParticipants = participants.filter( p => item.participant.includes( p._id ) );
              const numberTitle = numberParticipants.map( p => p.user.name ).join('/');
              const numberAvatar = numberParticipants.map( p => p.user.picture );
              const numberSubtitle = roundStatusArray[ item.status ];
              const numberCalendar = {
                day: numberDate.getUTCDate(),
                month: numberDate.getUTCMonth()+1,
              };
              const numberCurrent = currentShift && currentShift.number === item.number;
              const numberDraw = item.status === 'draw';
              const numberStatus = item.status;

              return (
                <Number
                  number={ item.number }
                  avatar={ numberAvatar }
                  title={ numberTitle }
                  subtitle={ numberSubtitle }
                  calendar={ numberCalendar }
                  callback={ () => { listItemPressHandler( item ) } }
                  status={ numberStatus }
                  current={ numberCurrent }
                  draw={ numberDraw }
                />
              );
            }}
            keyExtractor={item => item._id}
          />
        </View>
            
        <View style={ styles.participantsContainer} >
          <Text
            style={{ color: "#000", fontWeight: '600', paddingLeft: 20 }}>
            Participantes
          </Text>
          <SelectedList
            participants={participants}
            pressHandler={() => {}}
            detail
          />
        </View>

      </ScrollView>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
  },
  scrollView: {
    width: '100%',
    paddingBottom: 160,
    alignItems: 'center',
  },
  participantsContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    height: 100,
    marginBottom: 30,
  },
  headerContainer: {
    margin: 15,
  },
  titleContainer: {
    height: 100,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundGray,
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
  listTitle: {
    color: Colors.mainBlue,
    fontWeight: '500',
  },
  roundStatus: {
    height: '100%',
    width: 5,
  },
  roundData: {
    width: '95%',
    height: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    backgroundColor: Colors.mainBlue,
  },
  icon: {
    backgroundColor: Colors.mainBlue,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  roundNameContainer: {
    marginHorizontal: 10,
    width: '40%',
  },
  column: {
    flexDirection: 'column',
  },
  mensuality: {
    fontSize: 16,
    textAlign: 'right',
    fontWeight: 'bold',
    color: Colors.lightBlue,
  },
  amount: {
    textAlign: 'right',
    color: 'white',
  },
  roundUsers: {
    color: 'white',
  },
  roundName: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 14,
  },
  rightActionContainer: {
    marginHorizontal: 15,
    marginVertical: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  rightAction: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    overflow: 'hidden',
  },
  rightAcionButton: {
    flex: 1,
    borderRadius: 0,
    margin: 0,
    width: '100%',
  },
  rightAcionIcon: {
    color: 'white',
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
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  roundInfoDate: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '35%',
  },
  date: {fontSize: 12, fontWeight: '400'},
  dateSubtitle: {fontSize: 11, color: Colors.secondary},
  smallIcon: {color: Colors.mainBlue, fontSize: 22, marginRight: 10},
  roundState: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingRight: 20,
  },
  state: {
    color: Colors.lightBlue,
    fontStyle: 'italic',
  },
  roundInfo: {
    flexDirection: 'column',
    height: 100,
    marginBottom: 8,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  roundInfoDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: '5%',
  },
  roundInfoDate: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '35%',
  },
  date: {fontSize: 12, fontWeight: '400'},
  dateSubtitle: {fontSize: 11, color: Colors.secondary},
  smallIcon: {color: Colors.mainBlue, fontSize: 22, marginRight: 10},
  roundState: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingRight: 20,
  },
});

const mapStateToProps = state => {
  return {
    requestRounds: state.rounds.requestRounds,
  };
};

export default connect(
  mapStateToProps,
  null,
)(StartedRound);
