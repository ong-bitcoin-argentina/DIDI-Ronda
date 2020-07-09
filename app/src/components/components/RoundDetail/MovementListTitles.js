import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "native-base";

const MovementItem = () => {
  return (
    <View style={[styles.itemContainer]}>
      <View style={styles.numberContainer}>
        <Text style={styles.text}>Número</Text>
      </View>
      <View style={styles.dateTextContainer}>
        <View>
          <Text style={styles.text}>Fecha</Text>
        </View>
      </View>
      <View style={styles.paymentDataContainer}>
        <Text style={styles.text}>Aporte</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.bookmarkContainer}>
          <Text style={styles.text}>Estado</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 6,
  },
  numberContainer: {
    flex: 0.3,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dateTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 0.35,
  },
  paymentDataContainer: {
    flex: 0.35,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 13,
    opacity: 0.4,
    fontWeight: "bold",
  },
  infoContainer: {
    alignItems: "center",
    justifyContent: "center",

    flexDirection: "row",
    flex: 0.2,
  },
});

export default MovementItem;
