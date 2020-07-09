import React from "react";
import { View, StyleSheet } from "react-native";
import { Icon } from "native-base";
import colors from "../colors";

const MoneyWithCheck = ({ iconStyle = {} }) => {
  // Props

  return (
    <View>
      <Icon
        type="MaterialIcons"
        name="check-circle"
        style={{ ...styles.icon, ...iconStyle, ...styles.check }}
      />

      <Icon
        type="MaterialCommunityIcons"
        name="cash-usd"
        style={{ ...styles.icon, ...iconStyle }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  check: {
    position: "absolute",
    color: colors.green,
    zIndex: 2,
    top: -4,
    left: 37,
    fontSize: 24,
  },
  icon: {
    fontSize: 50,
    color: colors.mainBlue,
  },
});

export default MoneyWithCheck;
