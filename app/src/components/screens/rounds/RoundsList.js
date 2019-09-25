import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Text, Spinner} from 'native-base';
import Colors from '../../components/colors';
import FloatingActionButton from '../../components/FloatingActionButton';
import RoundListItem from './RoundsListItem';
import moment from 'moment';
import colors from '../../components/colors';

import {connect} from 'react-redux';
import * as actions from '../../../actions/login';
import * as roundsActions from '../../../actions/rounds';

class RoundsList extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    tabBarOptions: {
      showLabel: true,
    },
  };
  calculateCurrentShift(shifts) {
    console.log(moment(shifts[0].limitDate));
  }

  componentDidMount() {
    // Load rounds if = 0
    const {requestRounds} = this.props;
    if (requestRounds.list.length === 0) this.props.loadRounds();
  }

  render() {
    const {requestRounds} = this.props;
    const roundsList =
      requestRounds.list &&
      requestRounds.list.sort(function(a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Mis rondas</Text>
        </View>
        {requestRounds.loading ? (
          <Spinner />
        ) : roundsList.length > 0 ? (
          <FlatList
            data={roundsList}
            renderItem={({item}) => (
              <RoundListItem
                detail={(params) => {
                  this.props.navigation.navigate('RoundDetail', params);
                }}
                {...item}
                pending
              />
            )}
            contentContainerStyle={styles.flatListContent}
          />
        ) : (
          <Text style={{fontSize: 22, color: colors.secondary}}>
            Aun no tenes rondas activas.
          </Text>
        )}
        <FloatingActionButton
          nav={val => {
            this.props.navigation.navigate(val);
          }}
        />
      </View>
    );
  }
}
const mapStateToPropsList = state => {
  return {
    requestRounds: state.rounds.requestRounds,
  };
};

const mapDispatchToPropsList = dispatch => {
  return {
    loadRounds: () => {
      dispatch(roundsActions.loadRounds());
    },
    login: () => {
      dispatch(actions.login());
    },
  };
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  titleContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: Colors.mainBlue,
    fontSize: 18,
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingBottom: 100,
  },
});


export default connect(mapStateToPropsList, mapDispatchToPropsList)(RoundsList)