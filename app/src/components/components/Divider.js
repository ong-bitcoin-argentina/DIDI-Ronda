import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "./colors";

const Divider = props => <View style={styles.lineSeparator}></View>;

export default Divider;

const styles = StyleSheet.create({
  lineSeparator: {
    height: 1,
    width: "100%",
    backgroundColor: colors.secondary,
  },
});
