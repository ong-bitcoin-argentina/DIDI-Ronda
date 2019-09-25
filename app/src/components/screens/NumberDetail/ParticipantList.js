import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, ScrollView} from 'react-native';
import SubMenuContainer from '../roundsCreation/steps/RoundDetail/SubMenuContainer';
import {Icon} from 'native-base';
import Avatar from '../roundsCreation/steps/SelectParticipants/Avatar';
import colors from '../../components/colors';

const Number = props => {
  const pendent = props.pendiente;
  const date = pendent ? new Date(props.date) : '';
  return (
    <View style={styles.participantState}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Avatar path={props.picture}></Avatar>
        <View style={{marginHorizontal: 15}}>
          <Text style={styles.name}>{props.name}</Text>
        <Text style={styles.date}>{pendent && `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}</Text>
        </View>
      </View>

      <View
        style={{
          justifyConter: 'space-between',
          alignItems: 'center',
          width: 80,
        }}>
        <View
          style={{
            marginBottom: 8,
            borderRadius: 10,
            width: 20,
            height: 20,
            backgroundColor: pendent ? 'green' : 'yellow',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            type={pendent ? 'MaterialIcons' : 'FontAwesome'}
            name={pendent ? 'attach-money' : 'exclamation'}
            style={{color: pendent ? 'white' : 'black', fontSize: 18}}></Icon>
        </View>
        <Text>{pendent ? `$ ${props.amount}` : 'pendiente'}</Text>
      </View>
    </View>
  );
};

class ParticipantsList extends Component {
  render() {
    const paidParticipants = this.props.pays.map(p => {
      return p.participant;
    });

    const populatedParticipants = this.props.participants.map(p => {
      return {
        name: p.user.name,
        pendent: paidParticipants.includes(p._id),
        picture: p.user.picture,
        date: paidParticipants.includes(p._id) ? this.props.pays.filter(pay => pay.participant == p._id )[0].date : 'nope'
      };
    });
    return (
      <SubMenuContainer title={'Estado'}>
        <FlatList
          data={populatedParticipants}
          contentContainerStyle={styles.FlatList}
          scrollEnabled={false}
          renderItem={data => {
            return (
              <Number
                name={data.item.name}
                picture={data.item.picture}
                amount={this.props.amount}
                pendiente={data.item.pendent}
                date={data.item.date}></Number>
            );
          }}></FlatList>
      </SubMenuContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  FlatList: {
    paddingHorizontal: '6%',
  },
  participantState: {
    width: '100%',
    backgroundColor: 'white',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  name: {
    fontWeight: '600',
  },
  date: {
    color: colors.secondary,
    fontSize: 12,
  },
});

export default ParticipantsList;
