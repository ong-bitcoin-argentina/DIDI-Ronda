import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "./colors";

const WarningCardSkeleton = ({ rightSection, leftSection }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>{leftSection}</View>
      <View style={styles.rightSection}>{rightSection}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  leftSection: {
    flex: 0.3,
    flexDirection: "column",
    borderBottomLeftRadius: 5,
    borderTopStartRadius: 5,
    backgroundColor: colors.lightYellow,
    height: "100%",
  },
  rightSection: {
    flex: 0.9,
  },
});

export default WarningCardSkeleton;
