import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "native-base";
import GenericModal from "../../../../components/GenericModal";
import BookmarkWithExclamation from "../../../../components/icons/BookmarkWithExclamation";
import colors from "../../../../components/colors";
import BookmarkWithCheck from "../../../../components/icons/BookmarkWithCheck";

const styles = StyleSheet.create({
  container: {
    flex: 0.7,
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
    width: "90%",
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

const PreRuffleModal = ({
  onSaveRoundForLater,
  open,
  onContinue,
  onCancel,
  allNumbersSelected = false,
}) => {
  const iconToRender = allNumbersSelected ? (
    <BookmarkWithCheck />
  ) : (
    <BookmarkWithExclamation />
  );

  const titleNotAllSelected =
    "A continuación, se sorteararan\nlos números que quedaron libres";
  const titleAllSelected = "Todos los números se asignaron con éxito";
  const title = allNumbersSelected ? titleAllSelected : titleNotAllSelected;

  const doTheRuffle = "Hacer el sorteo";
  const ruffleNotNeeded = "Continuar";
  const continueButtonText = allNumbersSelected ? ruffleNotNeeded : doTheRuffle;

  return (
    <GenericModal open={open}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>{iconToRender}</View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleStyle}>{title}</Text>
        </View>

        <Button onPress={onContinue} style={styles.button}>
          <Text style={styles.buttonText}>{continueButtonText}</Text>
        </Button>

        <Button
          onPress={onSaveRoundForLater}
          style={[styles.button, { marginTop: 25 }]}
        >
          <Text style={styles.buttonText}>Guardar y seguir más tarde</Text>
        </Button>
        <Button onPress={onCancel} style={[styles.button, { marginTop: 10 }]}>
          <Text style={styles.buttonText}>Cambiar los números elegidos</Text>
        </Button>
      </View>
    </GenericModal>
  );
};

export default PreRuffleModal;
