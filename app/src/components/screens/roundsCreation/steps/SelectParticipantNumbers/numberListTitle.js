import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "native-base";
import colors from "../../../../components/colors";

const NumberListTitle = () => {
  return (
    <View style={[styles.itemContainer]}>
      <View style={{ flex: 0.2 }}>
        <Text style={styles.text}>Número</Text>
      </View>
      <View style={styles.participantContainer}>
        <Text style={styles.text}>Participante</Text>
      </View>
      <View style={styles.participantData}>
        <Text style={styles.text}>{`Fecha\ncobro`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
    marginHorizontal: 10,
  },
  participantContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 0.2,
  },
  participantData: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flex: 0.3,
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.mainBlue,
  },
  infoContainer: {},
});

export default NumberListTitle;
