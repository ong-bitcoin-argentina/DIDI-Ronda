import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "native-base";
import GenericModal from "../../../../components/GenericModal";
import RoundWithCheck from "../../../../components/icons/RoundWithCheck";
import colors from "../../../../components/colors";

const styles = StyleSheet.create({
  container: {
    flex: 0.6,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
  },
  iconContainer: {
    flex: 0.35,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  titleContainer: {
    flex: 0.15,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
  bodyContainer: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginTop: 15,
  },
  bodyText: {
    textAlign: "center",
    fontSize: 15,
    color: colors.gray,
  },
  rowButtonContainer: {
    flex: 0.1,
    justifyContent: "center",
    flexDirection: "row",
    alignContent: "center",
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: colors.mainBlue,
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

const ModalCreated = ({ open, roundName, onPressOK }) => {
  const titleText = `La Ronda "${roundName}" se está creando, esto demorará unos minutos.\nTodas las personas que participan serán notificadas cuando esté lista.`;
  const bodyText = `Hasta llegar a la fecha de inicio, la\nronda permanecera en la seccion "Por iniciar"`;

  return (
    <GenericModal open={open}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <RoundWithCheck />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleStyle}>{titleText}</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}>{bodyText}</Text>
        </View>
        <View style={styles.rowButtonContainer}>
          <Button onPress={onPressOK} style={styles.button}>
            <Text style={styles.buttonText}>OK</Text>
          </Button>
        </View>
      </View>
    </GenericModal>
  );
};

export default ModalCreated;
