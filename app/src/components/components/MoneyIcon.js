import React from "react";
import { View, StyleSheet } from "react-native";
import { Icon } from "native-base";
import colors from "./colors";

const MoneyIcon = ({ size, iconStyle = {} }) => {
  // Props

  return (
    <View style={[styles.iconContainer, size && { width: size, height: size }]}>
      <Icon
        type="MaterialIcons"
        name="attach-money"
        style={{ ...styles.icon, ...iconStyle }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 200,
    width: 22,
    height: 22,
    backgroundColor: colors.green,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 16,
    color: "white",
  },
});

export default MoneyIcon;
