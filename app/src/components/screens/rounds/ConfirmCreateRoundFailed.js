import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "native-base";
import GenericModal from "../../components/GenericModal";
import colors from "../../components/colors";

const ConfirmCreateRoundFailed = props => {
  const { open, onCancel, onContinue } = props;
  return (
    <GenericModal open={open}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleStyle}>
            ¿Querés reintentar la creación de la ronda?
          </Text>
        </View>
        <Button onPress={onContinue} style={[styles.button, { marginTop: 25 }]}>
          <Text style={styles.buttonText}>Continuar</Text>
        </Button>
        <Button onPress={onCancel} style={[styles.button, { marginTop: 10 }]}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </Button>
      </View>
    </GenericModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
  },
  titleContainer: {
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

export default ConfirmCreateRoundFailed;
