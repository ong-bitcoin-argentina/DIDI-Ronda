import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {getInset} from 'react-native-safe-area-view';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
const bottomOffset = getInset('bottom');

import {View, Text} from 'native-base';
const DotStepCounter = props => {
  const dots = props.items.map((card, i) => {
    if (i < props.items.length - 1) {
      return (
        <View key={i} style={{marginHorizontal: 2}}>
          <Icon
            name={props.count == i ? `circle` : `circle-o`}
            size={14}
            color="#fff"></Icon>
        </View>
      );
    }
  });
  return <View style={styles.container}>{dots}</View>;
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingBottom: bottomOffset == 0 ? '5%' : bottomOffset,
  },
});
export default DotStepCounter;
