import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "native-base";
import GenericModal from "../../components/GenericModal";
import colors from "../../components/colors";
import RoundWithExclamation from "../../components/icons/RoundWithExclamation";

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
  },
  iconContainer: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  titleContainer: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  titleStyle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
  rowButtonContainer: {
    flex: 0.15,
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
  pickerIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  pickerIcon: {
    marginHorizontal: "10%",
    color: "#9B9B9B",
  },
  label: {
    fontSize: 12,
  },
  labelContainer: {
    flexDirection: "row",
  },
  pickerBorderView: {
    width: "85%",
    flexDirection: "row",
    borderBottomColor: colors.secondGray,
    borderBottomWidth: 2,
  },
});

const WarningEditingRoundModal = ({
  open,
  onContinue,
  roundName,
  onCancel,
  round,
}) => {
  const currentTitle = `Una ronda se encuentra en edicion\n si decides editar la ronda ${roundName} los datos de la otra se descartaran`;

  const onContinueWithRound = () => onContinue(round);

  return (
    <GenericModal open={open}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <RoundWithExclamation />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleStyle}>{currentTitle}</Text>
        </View>

        <Button
          onPress={onContinueWithRound}
          style={[styles.button, { marginTop: 25 }]}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </Button>
        <Button onPress={onCancel} style={[styles.button, { marginTop: 10 }]}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </Button>
      </View>
    </GenericModal>
  );
};

export default WarningEditingRoundModal;
