import React from "react";
import { View, StyleSheet } from "react-native";
import { Icon } from "native-base";
import colors from "../colors";

const RoundWithCheck = ({ iconStyle = {} }) => {
  // Props

  return (
    <View>
      <Icon
        type="MaterialIcons"
        name="check-circle"
        style={{ ...styles.icon, ...iconStyle, ...styles.check }}
      />

      <Icon
        type="MaterialIcons"
        name="filter-tilt-shift"
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
    top: 4,
    right: 2,
    fontSize: 16,
  },
  icon: {
    fontSize: 60,
    color: colors.mainBlue,
  },
});

export default RoundWithCheck;
