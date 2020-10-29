import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Button, Icon } from "native-base";
import colors from "./colors";
import { connect } from "react-redux";
import { setAuth, getAuth } from "../../utils/utils";
import { retryRegister } from "../../services/api/user";

const WarningSCModal = ({ visible, onRequestClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const user = await getAuth();
      const result = await retryRegister(user.username);
      await setAuth(result);
      onConfirm();
    } catch (error) {
      console.log({ error });
    }
    setLoading(false);
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onRequestClose}
      backdropColor="rgba(0,0,0,0.5)">
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Icon type="MaterialIcons" name="warning" style={styles.icon} />
          <Text style={styles.title}>¡Ups! Ocurrió un error</Text>
          <Text style={styles.description}>
            Ha ocurrido un error al registrar y validar tu usuario en ronda.
          </Text>
          <Text style={styles.description}>Por favor, volvé a intentarlo.</Text>
          <View style={styles.buttonsContainer}>
            <Button
              onPress={onRequestClose}
              style={[styles.button, styles.cancelButton]}>
              <Text style={[styles.buttonText, { color: colors.mainBlue }]}>
                Cerrar
              </Text>
            </Button>
            <Button onPress={handleConfirm} style={styles.button}>
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Reintentar</Text>
              )}
            </Button>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 16,
  },
  description: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 12,
  },
  container: {
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
    alignItems: "center",
  },
  scrollContainer: {
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
  },
  icon: {
    color: colors.yellow,
    fontSize: 66,
    marginBottom: 18,
  },
  button: {
    flex: 1,
    marginTop: 30,
    backgroundColor: colors.mainBlue,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 54,
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.mainBlue,
    marginRight: 12,
  },
  buttonText: {
    color: colors.white,
    fontSize: 17,
  },
});

export default connect(
  state => ({}),
  dispatch => ({}),
)(WarningSCModal);
