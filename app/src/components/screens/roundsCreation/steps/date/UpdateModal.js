import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon, Button, Spinner } from "native-base";
import GenericModal from "../../../../components/GenericModal";
import colors from "../../../../components/colors";
import RoundWithCheck from "../../../../components/icons/RoundWithCheck";

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

const UpdateModal = ({ open, update, onOkPress }) => {
  const [success, setSuccess] = useState(false);
  const [loading, setloading] = useState(true);

  const performUpdate = async () => {
    const { error } = await update();
    setloading(false);
    if (!error) return setSuccess(true);
    return setSuccess(false);
  };

  useEffect(() => {
    performUpdate();
  }, []);

  const message = () => {
    if (loading) return "Actualizando datos...";
    if (!loading && success) return "La ronda ha sido editada con exito!";
    return "Ha ocurrido un error. Intententalo nuevamente mas tarde";
  };

  return (
    <GenericModal open={open}>
      <View style={styles.container}>
        {loading && <Spinner size={50} color={colors.mainBlue} />}
        {!loading && success && <RoundWithCheck />}
        {!loading && !success && (
          <Icon
            type="MaterialCommunityIcons"
            name="close-circle"
            style={styles.icon}
          />
        )}
        <Text style={styles.bodyText}>{message()}</Text>
        {!loading && (
          <Button style={styles.button} onPress={onOkPress}>
            <Text style={styles.buttonText}>Entendido</Text>
          </Button>
        )}
      </View>
    </GenericModal>
  );
};

export default UpdateModal;
