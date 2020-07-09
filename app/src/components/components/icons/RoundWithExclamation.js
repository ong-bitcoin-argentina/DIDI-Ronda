import React from "react";
import { View, StyleSheet } from "react-native";
import { Icon } from "native-base";
import colors from "../colors";

const RoundWithExclamation = ({ iconStyle = {} }) => {
  // Props

  return (
    <View>
      <View style={[styles.iconContainer]}>
        <Icon
          type="FontAwesome"
          name="exclamation"
          style={{ ...styles.icon, ...iconStyle, ...styles.warning }}
        />
      </View>

      <Icon
        type="MaterialIcons"
        name="filter-tilt-shift"
        style={{ ...styles.icon, ...iconStyle }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  warning: {
    position: "absolute",
    color: "black",
    zIndex: 2,
    top: 4,
    right: 10,
    fontSize: 16,
  },
  icon: {
    fontSize: 60,
    color: colors.mainBlue,
  },
  iconContainer: {
    borderRadius: 25,
    width: 25,
    height: 25,
    backgroundColor: colors.yellowStatus,
    position: "absolute",
    zIndex: 1,
    top: -3,
    left: 34,
  },
});

export default RoundWithExclamation;
