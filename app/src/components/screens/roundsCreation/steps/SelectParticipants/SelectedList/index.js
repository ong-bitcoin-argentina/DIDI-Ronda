import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Item from './Item';
import colors from '../../../../../components/colors';

const SelectedList = props => {
  const {participants, pressHandler, detail} = props;

  return (
    <View
      style={[
        styles.listContainer,
        detail && {backgroundColor: colors.backgroundGray},
      ]}>
        
      <FlatList
        data={participants}
        keyExtractor={data => `selected-${data.recordID || data._id}`}
        renderItem={({item, index}) => (
          <Item
            item={item}
            index={index}
            pressHandler={() => pressHandler(item)}
            detail={detail}
          />
        )}
        horizontal={true}
        extraData={participants.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: colors.lightGray,
    width: '100%',
    paddingHorizontal: 20,
  },
});

export default SelectedList;
