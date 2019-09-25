//import liraries
import React, {Component} from 'react';
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
import Number from '../roundsCreation/steps/NumbersAsign/Number';
import Header from './Header';
import ExtraData from './ExtraData';
import SelectedList from '../roundsCreation/steps/SelectParticipants/SelectedList';

class StartedRound extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.navigation.getParam('name', 'Ronda'),
      paymentsQty: this.props.navigation.getParam('paymentsQty', '2'),
      pending: this.props.navigation.getParam('pending', false),
      amount: this.props.navigation.getParam('amount', '200'),
      frequency: this.props.navigation.getParam('frequency', 'm'),
      participants: this.props.navigation.getParam('participants', []),
      startDate: this.props.navigation.getParam('customStartDate', '10/10/10'),
      endDate: this.props.navigation.getParam('customEndDate', '10/10/10'),
      _id: this.props.navigation.getParam('_id', null),
      admin: this.props.navigation.getParam('admin', null),
    };
  }
  render() {
    const {_id} = this.state;
    const {requestRounds} = this.props;
    const round = requestRounds.list.find(
      e => e._id === this.props.navigation.getParam('_id', null),
    );

    const roundData = {
       shifts: round.shifts,
     };

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{this.state.name}</Text>
          </View>
          <Header
            amount={this.state.amount}
            paymentsQty={this.state.paymentsQty}
            name={this.state.name}></Header>
          <View>
            <ExtraData
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              frequency={this.state.frequency}
              amount={this.state.amount}
              shifts={roundData.shifts.length}></ExtraData>
          </View>

          <View>
            <View
              style={{
                width: Dimensions.get('window').width,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
              }}>
              <Text style={styles.listTitle}>Numero</Text>
              <Text style={[styles.listTitle, {textAlign: 'left', width: 140}]}>
                Cobra
              </Text>
              <Text style={styles.listTitle}>Estado</Text>
            </View>
            <FlatList
              data={roundData.shifts}
              contentContainerStyle={{
                justifyContent: 'center',
                width: Dimensions.get('window').width,
              }}
              scrollEnabled={false}
              renderItem={data => {
                return (
                  <Number
                    date={1}
                    selectParticipants={participants => {}}
                    callback={id => {
                      this.props.navigation.navigate('NumberDetail', {
                        shift_id: data.item._id,
                        _id,
                      });
                    }}
                    shift={data.item}
                    index={data.index}
                    shiftsQty={roundData.shifts.length}
                    amount={this.state.amount}
                    selectedParticipants={data.item.participant}
                    participants={this.state.participants}
                    detail={true}
                  />
                );
              }}
              keyExtractor={item => item._id}
            />
          </View>
        </ScrollView>
        <View
          style={{
            width: '100%',
            backgroundColor: Colors.backgroundGray,
            borderTopWidth: 1,
            borderTopColor: Colors.lightGray,
          }}>
          <Text
            style={{
              color: Colors.mainBlue,
              fontWeight: '600',
              paddingLeft: 20,
            }}>
            participantes
          </Text>
          <SelectedList
            participants={this.state.participants}
            pressHandler={() => {}}
            detail
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
