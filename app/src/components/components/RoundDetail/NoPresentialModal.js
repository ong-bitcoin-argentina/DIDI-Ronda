import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Spinner } from "native-base";

import colors from "../colors";
import GenericModal from "../GenericModal";

const styles = StyleSheet.create({
  container: {
    flex: 0.4,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  bodyText: {
    fontSize: 16,
    textAlign: "center",
    width: "80%",
    fontWeight: "bold",
    color: "black",
  },
  button: {
    width: "80%",
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.mainBlue,
    justifyContent: "center",
  },
  buttonsContainer: {
    flex: 0.25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

const NoPresentialModal = ({
  open,
  onAccept,
  onCancel,
  isLoading,
  adminName,
  isRequestingPayment = true,
}) => {
  const shouldAskPayment = isRequestingPayment
    ? "el cobro de tu número"
    : "que acepte el aporte al número";
  const text = `¿Querés pedirle a ${adminName} ${shouldAskPayment} de Ronda?`;
  const acceptText = "Aceptar";
  const cancelText = "Cancelar";

  return (
    <GenericModal open={open}>
      <View style={styles.container}>
        {isLoading ? (
          <Spinner size={75} color={colors.mainBlue} />
        ) : (
          <>
            <View
              style={{
                flex: 0.3,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.bodyText}>{text}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <Button style={styles.button} onPress={onAccept}>
                <Text style={styles.buttonText}>{acceptText}</Text>
              </Button>
            </View>

            <View style={styles.buttonsContainer}>
              <Button
                style={{ ...styles.button, backgroundColor: "white" }}
                onPress={onCancel}
              >
                <Text style={{ ...styles.buttonText, color: colors.secondary }}>
                  {cancelText}
                </Text>
              </Button>
            </View>
          </>
        )}
      </View>
    </GenericModal>
  );
};

export default NoPresentialModal;
