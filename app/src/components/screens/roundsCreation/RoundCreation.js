import React from 'react';
import {View, TouchableHighlight} from 'react-native';
import {Icon} from 'native-base';
import {createStackNavigator} from 'react-navigation';
import colors from '../../components/colors';
import {connect} from 'react-redux';
import * as actions from '../../../actions/roundCreation';
import RoundName from './steps/RoundName';
import Amount from './steps/Amount';
import RoundConfig from './steps/RoundConfig';
import SelectParticipants from './steps/SelectParticipants';
import RoundDate from './date';
import Finish from './steps/Finish';
import NumbersAsign from './steps/NumbersAsign';
import RoundDetail from './steps/RoundDetail';

const mapStateToProps = state => {
  return {
    name: state.roundCreation.name,
  };
};

const mapDispatchToPropsAmount = dispatch => {
  return {
    setAmount: amount => {
      dispatch(actions.setAmount(amount));
    },
  };
};

const mapStateToPropsAmount = state => {
  return {
    amount: state.roundCreation.amount,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setName: name => {
      dispatch(actions.setName(name));
    },
  };
};

const mapStateToPropsConfig = state => {
  return {
    config: state.roundCreation.config,
    amount: state.roundCreation.amount,
  };
};

const mapDispatchToPropsConfig = dispatch => {
  return {
    setConfig: config => {
      dispatch(actions.setConfig(config));
    },
  };
};

const mapStateToPropsParticipants = state => {
  return {
    participants: state.roundCreation.participants,
    participantsQty: state.roundCreation.config.participantsQty,
  };
};

const mapDispatchToPropsParticipants = dispatch => {
  return {
    setParticipants: participants => {
      dispatch(actions.setParticipants(participants));
    },
  };
};
const Left = ({onPress}) => (
  <TouchableHighlight onPress={onPress}>
    <Icon
      name="ios-arrow-back"
      style={{color: 'white', padding: 10, fontSize: 32, paddingTop: 5}}
    />
  </TouchableHighlight>
);
export default createStackNavigator({
  
  RoundName: {
    screen: connect(
      mapStateToProps,
      mapDispatchToProps,
    )(RoundName),
    navigationOptions: navigation => ({
      headerLeft: (
        <Left
          onPress={() => {
            navigation.navigation.navigate('List');
          }}
        />
      ),
      headerBackTitle: null,
      headerBackStyle: {color: 'white'},
      title: `Nueva Ronda`,
      headerTintColor: 'white',
      headerStyle: {backgroundColor: colors.mainBlue},
      headerTitleStyle: {
        color: 'white',
        width: '80%',
        textAlign: 'left',
        fontSize: 18,
      },
      headerRight: (
        <View style={{paddingRight: 20}}>
          <Icon name="md-more" style={{color: 'white'}} />
        </View>
      ),
    }),
  },
  RoundDetail: {
    screen: RoundDetail,
    navigationOptions: () => ({
      headerBackTitle: null,
      headerBackStyle: {color: 'white'},
      title: `Nueva Ronda`,
      headerTintColor: 'white',
      headerStyle: {backgroundColor: colors.mainBlue},
      headerTitleStyle: {
        color: 'white',
        width: '80%',
        textAlign: 'left',
        fontSize: 18,
      },
      headerRight: (
        <View style={{paddingRight: 20}}>
          <Icon name="md-more" style={{color: 'white'}} />
        </View>
      ),
    }),
  },
  Amount: {
    screen: connect(
      mapStateToPropsAmount,
      mapDispatchToPropsAmount,
    )(Amount),
    navigationOptions: () => ({
      headerBackTitle: null,
      headerBackStyle: {color: 'white'},
      title: `Nueva Ronda`,
      headerTintColor: 'white',
      headerStyle: {backgroundColor: colors.mainBlue},
      headerTitleStyle: {
        color: 'white',
        width: '80%',
        textAlign: 'left',
        fontSize: 18,
      },
      headerRight: (
        <View style={{paddingRight: 20}}>
          <Icon name="md-more" style={{color: 'white'}} />
        </View>
      ),
    }),
  },
  RoundConfig: {
    screen: connect(
      mapStateToPropsConfig,
      mapDispatchToPropsConfig,
    )(RoundConfig),
    navigationOptions: () => ({
      headerBackTitle: null,
      headerBackStyle: {color: 'white'},
      title: `Nueva Ronda`,
      headerTintColor: 'white',
      headerStyle: {backgroundColor: colors.mainBlue},
      headerTitleStyle: {
        color: 'white',
        width: '80%',
        textAlign: 'left',
        fontSize: 18,
      },
      headerRight: (
        <View style={{paddingRight: 20}}>
          <Icon name="md-more" style={{color: 'white'}} />
        </View>
      ),
    }),
  },
  SelectParticipants: {
    screen: connect(
      mapStateToPropsParticipants,
      mapDispatchToPropsParticipants,
    )(SelectParticipants),
    navigationOptions: () => ({
      headerBackTitle: null,
      headerBackStyle: {color: 'white'},
      title: `Nueva Ronda`,
      headerTintColor: 'white',
      headerStyle: {backgroundColor: colors.mainBlue},
      headerTitleStyle: {
        color: 'white',
        width: '80%',
        textAlign: 'left',
        fontSize: 18,
      },
      headerRight: (
        <View style={{paddingRight: 20}}>
          <Icon name="md-more" style={{color: 'white'}} />
        </View>
      ),
    }),
  },
  NumbersAsign: {
    screen: NumbersAsign,
    navigationOptions: () => ({
      headerBackTitle: null,
      headerBackStyle: {color: 'white'},
      title: `Nueva Ronda`,
      headerTintColor: 'white',
      headerStyle: {backgroundColor: colors.mainBlue},
      headerTitleStyle: {
        color: 'white',
        width: '80%',
        textAlign: 'left',
        fontSize: 18,
      },
      headerRight: (
        <View style={{paddingRight: 20}}>
          <Icon name="md-more" style={{color: 'white'}} />
        </View>
      ),
    }),
  },
  RoundDate: {
    screen: RoundDate,
    navigationOptions: () => ({
      headerBackTitle: null,
      headerBackStyle: {color: 'white'},
      title: `Nueva Ronda`,
      headerTintColor: 'white',
      headerStyle: {backgroundColor: colors.mainBlue},
      headerTitleStyle: {
        color: 'white',
        width: '80%',
        textAlign: 'left',
        fontSize: 18,
      },
      headerRight: (
        <View style={{paddingRight: 20}}>
          <Icon name="md-more" style={{color: 'white'}} />
        </View>
      ),
    }),
  },
  Finish: {
    screen: Finish,
    navigationOptions: () => ({
      headerBackTitle: null,
      headerBackStyle: {color: 'white'},
      title: `Finish`,
      headerTintColor: 'white',
      headerStyle: {backgroundColor: colors.mainBlue},
      headerTitleStyle: {
        color: 'white',
        width: '80%',
        textAlign: 'left',
        fontSize: 18,
      },
      headerRight: (
        <View style={{paddingRight: 20}}>
          <Icon name="md-more" style={{color: 'white'}} />
        </View>
      ),
    }),
  },
});
