import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "native-base";
import colors from "../../components/colors";

const ParticipantListTitles = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.textBlue}>Número</Text>
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.textBlue}>Participante</Text>
      </View>
      <View style={styles.statusContainer}>
        <View style={styles.calendarContainer}>
          <Text style={styles.textBlue}>{`Fecha\nCobro`}</Text>
        </View>
      </View>
      <View>
        <Text style={styles.textBlue}>OK</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginLeft: 10,
  },
  nameContainer: {
    flex: 1,
    paddingLeft: 50,
    marginRight: 30,
  },
  statusContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  textBlue: {
    fontSize: 13,
    color: colors.mainBlue,
    fontWeight: "bold",
  },
  calendarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ParticipantListTitles;
