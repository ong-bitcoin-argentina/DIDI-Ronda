import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon, Button } from "native-base";
import { connect } from "react-redux";
import { closeRoundDetailRootModal } from "../../../actions/roundDetailRootModal";
import GenericModal from "../../components/GenericModal";
import colors from "../../components/colors";
import RoundWithCheck from "../../components/icons/RoundWithCheck";
import RoundWithExclamation from "../../components/icons/RoundWithExclamation";

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
});

const icons = {
  nothing: null,
  error: (
    <Icon
      type="MaterialCommunityIcons"
      name="close-circle"
      style={styles.icon}
    />
  ),
  greenCheck: (
    <Icon
      type="MaterialCommunityIcons"
      name="check-circle"
      style={{ ...styles.icon, color: colors.green }}
    />
  ),
  warning: (
    <Icon type="MaterialCommunityIcons" name="alert" style={styles.icon} />
  ),
  roundCheck: <RoundWithCheck />,
  roundExclamation: <RoundWithExclamation />,
};

const DetailRootModal = ({ open, message, closeModal, icon = "error" }) => {
  return (
    <GenericModal open={open}>
      <View style={styles.container}>
        {icons[icon]}
        <Text style={styles.bodyText}>{message}</Text>
        <Button style={styles.button} onPress={closeModal}>
          <Text style={styles.buttonText}>Entendido</Text>
        </Button>
      </View>
    </GenericModal>
  );
};

const mapStateToProps = ({ roundDetailRootModal }) => ({
  open: roundDetailRootModal.open,
  message: roundDetailRootModal.message,
  icon: roundDetailRootModal.icon,
});

export default connect(
  mapStateToProps,
  { closeModal: closeRoundDetailRootModal }
)(DetailRootModal);
