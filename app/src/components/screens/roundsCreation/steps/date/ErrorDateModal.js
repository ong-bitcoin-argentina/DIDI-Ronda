import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon, Button } from "native-base";
import GenericModal from "../../../../components/GenericModal";
import colors from "../../../../components/colors";

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "space-around",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  icon: {
    color: colors.mainBlue,
    fontSize: 60,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  button: {
    width: "80%",
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.mainBlue,
    justifyContent: "center",
  },
});

const ErrorDateModal = ({ open, onOkPress }) => {
  const message =
    "Tenés que seleccionar una fecha de inicio de ronda posterior al día de hoy.";

  return (
    <GenericModal open={open}>
      <View style={styles.container}>
        <Icon
          type="MaterialCommunityIcons"
          name="close-circle"
          style={styles.icon}
        />
        <Text style={styles.bodyText}>{message}</Text>

        <Button style={styles.button} onPress={onOkPress}>
          <Text style={styles.buttonText}>Entendido</Text>
        </Button>
      </View>
    </GenericModal>
  );
};

export default ErrorDateModal;
