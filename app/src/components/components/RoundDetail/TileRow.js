import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Icon } from "native-base";

const TileRow = ({ label, value, icon }) => {
  return (
    <View style={styles.rowContainer}>
      <View style={styles.iconColumn}>
        <Icon
          style={styles.lightIcon}
          type="MaterialCommunityIcons"
          name={icon}
        />
      </View>
      <View style={styles.titleColumn}>
        <Text style={[styles.text, styles.descLightText]}>{label}</Text>
      </View>
      <View style={styles.infoColumn}>
        <Text style={[styles.text, styles.descLightText]}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    flex: 1,
    marginVertical: 6,
  },
  iconColumn: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center",
  },
  titleColumn: {
    flex: 0.5,
    justifyContent: "center",
  },
  infoColumn: {
    flex: 0.4,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  lightIcon: {
    color: "white",
    opacity: 0.8,
    marginLeft: 15,
    fontSize: 20,
  },
  text: {
    color: "white",
  },
  descLightText: {
    fontSize: 13,
    opacity: 0.8,
    marginLeft: 20,
    fontWeight: "bold",
  },
});

export default TileRow;
