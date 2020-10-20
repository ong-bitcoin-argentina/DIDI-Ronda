import React from "react";
import Modal from "react-native-modal";
import { View, Text, Image, StyleSheet } from "react-native";
import { Button } from "native-base";
import PlaystoreLogo from "../../assets/img/playstore.svg";
import colors from "./colors";

const LinkModal = ({ visible, onRequestClose, onConfirm }) => {
  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onRequestClose}
      backdropColor="rgba(0,0,0,0.5)">
      <View style={styles.container}>
        <Text style={[styles.text, { fontSize: 18 }]}>
          Para continuar, necesitás instalar una aplicación:
        </Text>
        <Image
          style={styles.image}
          source={require("../../assets/img/aidi.png")}
        />
        <Text style={[styles.text, { fontSize: 16 }]}>
          Estás siendo redireccionado a...
        </Text>
        <PlaystoreLogo />
        <View style={styles.buttonsContainer}>
          <Button
            onPress={onRequestClose}
            style={[styles.button, styles.cancelButton]}>
            <Text style={[styles.buttonText, { color: colors.mainBlue }]}>
              CANCELAR
            </Text>
          </Button>
          <Button onPress={onConfirm} style={styles.button}>
            <Text style={styles.buttonText}>CONTINUAR</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 160,
    height: 60,
    marginTop: 8,
    marginBottom: 24,
  },
  text: {
    textAlign: "center",
    fontWeight: "bold",
  },
  container: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 40,
    paddingHorizontal: 30,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
  },
  button: {
    flex: 1,
    marginTop: 30,
    backgroundColor: colors.mainBlue,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.mainBlue,
    marginRight: 12,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
  },
});

export default LinkModal;
