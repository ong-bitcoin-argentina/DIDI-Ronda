import React from "react";
import { View, StyleSheet } from "react-native";
import { Icon } from "native-base";
import colors from "../colors";

const PeopleWithExclamation = ({ iconStyle = {} }) => {
  // Props

  return (
    <View>
      <View style={[styles.iconContainer]}>
        <Icon
          type="FontAwesome"
          name="exclamation"
          style={{ ...styles.icon, ...iconStyle, ...styles.exclamation }}
        />
      </View>

      <Icon
        type="MaterialIcons"
        name="people"
        style={{ ...styles.icon, ...iconStyle }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  exclamation: {
    position: "absolute",
    color: "black",
    zIndex: 2,
    top: 1,
    left: 8,
    fontSize: 24,
  },
  icon: {
    fontSize: 50,
    color: colors.mainBlue,
  },
});

export default PeopleWithExclamation;
