import React from 'react';
import {View, StyleSheet} from 'react-native';
import colors from '../../components/colors';

export default StepCounter = props => {
  let Steps = [];
  for (let i = 0; i < props.totalSteps; i++) {
    if (i < props.curentStep) {
      Steps.push(
        <View key={i} style={[styles.stepCounter, styles.stepCounterOn]} />
      );
    } else {
      Steps.push(
        <View key={i} style={[styles.stepCounter, styles.stepCounterOff]} />
      );
    }
  }
  return <View style={styles.stepCounterContainer}>{Steps}</View>;
};
const styles = StyleSheet.create({
  stepCounterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    backgroundColor: colors.backgroundGray,
  },
  stepCounter: {
    height: 3,
    width: '16%',
  },
  stepCounterOn: {
    backgroundColor: colors.mainBlue,
  },
  stepCounterOff: {
    backgroundColor: colors.secondary,
  },
});
