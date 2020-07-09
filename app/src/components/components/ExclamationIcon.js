import React from "react";
import { View, StyleSheet } from "react-native";
import { Icon } from "native-base";
import colors from "./colors";

const ExclamationIcon = props => {
  // Props
  const { size } = props;

  return (
    <View style={[styles.iconContainer, size && { width: size, height: size }]}>
      <Icon
        type="FontAwesome"
        name="exclamation"
        style={[styles.icon, size && { fontSize: size * 0.75 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 200,
    width: 22,
    height: 22,
    backgroundColor: colors.yellowStatus,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 16,
    color: "#333",
  },
});

export default ExclamationIcon;
