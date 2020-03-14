import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Icon} from 'native-base';
import colors from './colors';

const Bookmark = props => {
  const {number, outline, bgColor} = props;

  return (
    <View style={styles.bookmarkContainer}>
      <Icon
        type="MaterialCommunityIcons"
        name={outline ? 'bookmark-outline' : 'bookmark'}
        style={[
          styles.bookmarkIcon,
          {fontSize: outline ? 70 : 40, color: bgColor || colors.mainBlue},
        ]}
      />
      <Text
        style={[
          styles.bookmarkText,
          {color: outline ? colors.mainBlue : 'white'},
          {left: outline ? 32 : number >= 10 ? 10 : 16},
          {top: outline ? 14 : 7},
          {fontSize: outline ? 26 : 16},
        ]}>
        {number}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // BOOKMARK
  bookmarkContainer: {
    justifyContent: 'center',
  },
  bookmarkIcon: {
    zIndex: 10,
    padding: 0,
    margin: 0,
    color: colors.mainBlue,
  },
  bookmarkText: {
    position: 'absolute',
    zIndex: 100,
  },
});

Bookmark.defaultProps = {
  number: null,
  outline: false,
};

export default Bookmark;
