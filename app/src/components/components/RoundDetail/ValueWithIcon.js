import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "native-base";
import Colors from "../colors";

const ValueWithIcon = props => {
  const { middle, icon, iconType, value, subtitle } = props;
  return (
    <View style={[styles.roundInfoDate, middle && styles.dashedBorder]}>
      <Icon type={iconType} name={icon} style={styles.smallIcon} />
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{value}</Text>
        <Text style={styles.dateSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  date: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
  dateSubtitle: { fontSize: 11, color: Colors.secondary, textAlign: "center" },
  smallIcon: { color: Colors.mainBlue, fontSize: 22, marginVertical: 10 },
  roundInfoDate: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "35%",
  },
  dashedBorder: {
    borderWidth: 1,
    borderStyle: "dashed",
    paddingVertical: 10,
    borderRadius: 1,
    borderColor: Colors.secondary,
    margin: -2,
  },
});

export default ValueWithIcon;
