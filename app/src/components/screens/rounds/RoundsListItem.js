import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Icon, Button, Spinner, Toast} from 'native-base';
import Colors from '../../components/colors';
import UserService from '../../../services/api/user';
import {connect} from 'react-redux';
import * as roundsActions from '../../../actions/rounds';
import Swipeout from 'react-native-swipeout';
import logo from '../../../assets/img/logo.png';

class RoundListItem extends Component {
  componentDidUpdate(prevProps, prevState) {
    const prevLoading = prevProps.deleteRoundRequest.loading;
    const prevError = prevProps.deleteRoundRequest.error;

    const {loading, error} = this.props.deleteRoundRequest;

    if (prevLoading === true && loading === false) {
      if (error === null) {
        // Success!
        Toast.show({
          text: 'Eliminada con éxito',
          buttonText: 'Okay',
        });
      } else {

        const errMsg = 
          error.error.response.data.error === "Only can delete not started rounds" ?
          "No se puede eliminar una ronda ya comenzada!" :
          "Hubo un error, intente nuevamente";

        // Error!
        Toast.show({
          text: errMsg,
          buttonText: 'Okay',
        });
      }
    }
  }

  deleteRound = async () => {
    const {id} = this.props;
    this.props.delete_round(id);
  };

  swipeButton = [
    {
      component: (
        <View style={styles.rightAction}>
          <Button
            danger
            style={styles.rightAcionButton}
            onPress={this.deleteRound}>
            <Icon
              style={styles.rightAcionIcon}
              type="FontAwesome"
              name="trash-o"
            />
          </Button>
        </View>
      ),
    },
  ];

  swipeButtonSpinner = [
    {
      component: (
        <View style={styles.rightAction}>
          <Spinner color="red" />
        </View>
      ),
    },
  ];
  getCustomDate(date) {
    return (
      date.getDate() +
      '/' +
      (parseInt(date.getMonth()) + 1).toString() +
      '/' +
      date.getFullYear().toString()[2] +
      date.getFullYear().toString()[3]
    );
  }
  render() {
    const {
      id,
      start,
      pending,
      name,
      participants,
      nPayment,
      amount,
      startDate,
      admin,
      _id,
      endDate,
      recurrence,
      shifts,
      deleteRoundRequest,
    } = this.props;

    const paymentsQty = this.props.shifts.length;
    const usersQty = this.props.participants.length;
    let customStartDate = this.getCustomDate(new Date(startDate));
    let customEndDate = this.getCustomDate(new Date(endDate));
    let frequency = '';
    switch (recurrence) {
      case 'q':
        frequency = 'Quincenal';
        break;
      case 'm':
        frequency = 'Mensual';
        break;
      case 's':
        frequency = 'Semanal';
        break;
      default:
        frequency = 'No definido';
    }

    return (
      <View style={styles.rightActionContainer}>
        <Swipeout
          backgroundColor="transparent"
          right={
            deleteRoundRequest.loading
              ? this.swipeButtonSpinner
              : this.swipeButton
          }>
          <TouchableOpacity
            style={styles.container}
            onPress={() => {
              this.props.detail({
                _id,
                start,
                pending,
                name,
                admin,
                participants,
                paymentsQty,
                amount,
                customEndDate,
                customStartDate,
                recurrence,
                shifts,
                deleteRoundRequest,
              });
            }}>
            <View
              style={[
                styles.roundStatus,
                {
                  backgroundColor: !start ? Colors.yellowStatus : Colors.green,
                },
              ]}></View>
            <View style={styles.roundData}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.icon}>
                  <Icon
                    type="MaterialIcons"
                    name="filter-tilt-shift"
                    style={{color: Colors.mainBlue}}
                  />
                </View>
                <View style={styles.roundNameContainer}>
                  <Text numberOfLines={1} style={styles.roundName}>
                    {name}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      type="MaterialIcons"
                      name="bookmark-border"
                      style={{color: 'white', fontSize: 22}}
                    />
                    <Text style={styles.amount}> 0 de {paymentsQty}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.roundState}>
                <Text></Text>
                <Text style={styles.state}>
                  {pending ? customStartDate : '( Recolectando )'}
                </Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.mensuality}>${amount}</Text>
                <Text style={styles.mensuality}>
                  ${pending ? ' ---' : amount}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeout>

        <View style={styles.roundInfo}>
          <View style={styles.roundInfoDates}>
            <View style={styles.roundInfoDate}>
              <Icon
                type="MaterialCommunityIcons"
                name="calendar-range"
                style={styles.smallIcon}
              />
              <View>
                <Text style={styles.date}>{customStartDate}</Text>
                <Text style={styles.dateSubtitle}>Inicio</Text>
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
                <Text style={styles.date}>{customEndDate}</Text>
                <Text style={styles.dateSubtitle}>Fin</Text>
              </View>
            </View>
          </View>
          <View style={styles.roundInfoDates}>
            <View style={styles.roundInfoDate}>
              <Icon
                type="MaterialIcons"
                name="access-alarm"
                style={styles.smallIcon}
              />
              <View>
                <Text style={styles.date}>{frequency}</Text>
                <Text style={styles.dateSubtitle}>Frecuencia</Text>
              </View>
            </View>

            <View style={styles.roundInfoDate}>
              <Icon type="FontAwesome" name="money" style={styles.smallIcon} />
              <View>
                <Text style={styles.date}>
                  ${Math.floor(amount / shifts.length)}
                </Text>
                <Text style={styles.dateSubtitle}>Aporte</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    borderTopRightRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.mainBlue,
  },
  roundStatus: {
    height: '100%',
    width: 5,
  },
  roundData: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  icon: {
    backgroundColor: 'white',
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
    paddingLeft: 70,
    paddingRight: 20,
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
  
});

const mapDispatchToProps = dispatch => {
  return {
    delete_round: id => {
      dispatch(roundsActions.deleteRound(id));
    },
  };
};

const mapStateToProps = state => {
  return {
    deleteRoundRequest: state.rounds.deleteRound,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoundListItem);
