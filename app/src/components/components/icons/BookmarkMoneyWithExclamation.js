import React from "react";
import { View, StyleSheet } from "react-native";
import { Icon } from "native-base";
import colors from "../colors";

const BookmarkMoneyWithExclamation = ({
  moneyStyle = {},
  bookmarkStyle = {},
  exclamationCircleStyle = {},
  exclamationStyle = {},
}) => {
  // Props

  return (
    <View>
      <View style={{ ...styles.iconContainer, ...exclamationCircleStyle }}>
        <Icon
          type="FontAwesome"
          name="exclamation"
          style={{ ...styles.icon, ...styles.exclamation, ...exclamationStyle }}
        />
      </View>

      <Icon
        type="MaterialCommunityIcons"
        name="bookmark-outline"
        style={{ ...styles.icon, ...bookmarkStyle }}
      />
      <Icon
        type="MaterialIcons"
        name="attach-money"
        style={{ ...styles.icon, ...styles.money, ...moneyStyle }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 15,
    width: 15,
    height: 15,
    backgroundColor: colors.yellowStatus,
    position: "absolute",
    zIndex: 1,
    top: -3,
    left: 20,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 8,
  },
  exclamation: {
    position: "absolute",
    color: "black",
    zIndex: 2,
    top: 2,
    left: 5,
    fontSize: 12,
  },
  money: {
    position: "absolute",
    color: colors.mainBlue,
    zIndex: 2,
    top: 7,
    left: 9,
    fontSize: 18,
  },
  icon: {
    fontSize: 35,
    color: colors.mainBlue,
  },
});

export default BookmarkMoneyWithExclamation;
