import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, FlatList} from 'react-native';
import {Text, Spinner} from 'native-base';
import colors from '../../components/colors';

import ListItem from './ListItem';

export default ParticipantsList = props => {
  const {participants, shifts} = props;

  const getFirstPayDay = participantId => {
    for (s of shifts) {
      if (s.participant.includes(participantId)) {
        return s.limitDate;
      }
    }
    return false;
  };

  const handleNavigation = participant => {
    props.navigation.navigate('UserProfile', {participant: participant});
  };

  return (
    <View>
      <View
        style={{
          marginVertical: 20,
          width: '100%',
          flexDirection: 'row',
          paddingHorizontal: 10,
        }}>
        <Text style={{fontSize: 11, fontWeight: '500', color: colors.mainBlue}}>
          Confirmacion de participacion
        </Text>
      </View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row-reverse',
          paddingHorizontal: 25,
        }}>
        <Text
          style={{color: colors.secondary, fontSize: 11, fontWeight: '500'}}>
          Estado
        </Text>
      </View>
      <FlatList
        data={participants}
        renderItem={({item}) => (
          <ListItem
            participant={item}
            payday={getFirstPayDay}
            handleNavigation={handleNavigation}
          />
        )}
        keyExtractor={item => item._id}
      />
    </View>
  );
};
