import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text, Icon, Button, Spinner } from "native-base";
import GenericModal from "../../../components/GenericModal";
import colors from "../../../components/colors";
import SwapArrow from "../../../../assets/img/swap-arrow.svg";

import Avatar from "../../roundsCreation/steps/ParticipantSelection/Avatar";

const SCREEN_WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    flex: 0.7,
    backgroundColor: "white",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  swapContainer: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    flex: 0.3,
  },
  leftColumn: {
    alignItems: "center",
    flex: 1,
  },
  rightColumn: {
    alignItems: "center",
    flex: 1,
  },
  middleColumn: {
    justifyContent: "center",
    alignContent: "center",
  },
  button: {
    backgroundColor: colors.mainBlue,
    borderRadius: 5,
    justifyContent: "center",
    marginVertical: 5,
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    flex: 0.3,
    width: "100%",
  },
  text: {
    textAlign: "center",
    fontStyle: "italic",
  },
  textName: {
    maxWidth: "70%",
    fontSize: 12,
    textAlign: "center",
  },
});

const ReasignModal = ({
  participant,
  targetParticipant,
  open,
  onAcceptPress,
  onCancelPress,
  loading,
  requestStatus,
}) => {
  const upperText = `Estas seguro que queres reasignar a ${participant.name} el #${targetParticipant.number}?`;

  const icon = () => {
    // Success case
    if (requestStatus)
      return (
        <Icon
          type="MaterialCommunityIcons"
          name="check-circle"
          style={{ color: colors.green, fontSize: 60 }}
        />
      );
    // Failure Case
    if (requestStatus === false)
      return (
        <Icon
          type="MaterialCommunityIcons"
          name="close-circle"
          style={styles.icon}
        />
      );

    // No request done
    return (
      <Icon
        type="MaterialCommunityIcons"
        name="alert"
        style={{ color: colors.mainBlue, fontSize: 60 }}
      />
    );
  };

  const content = () => {
    if (loading) return <Spinner color={colors.mainBlue} size={75} />;

    return (
      <>
        <View style={{ flexDirection: "row", flex: 0.2 }}>{icon()}</View>
        {requestStatus === null && (
          <>
            <View style={{ flexDirection: "row", flex: 0.2 }}>
              <Text style={{ textAlign: "center", width: "80%" }}>
                {upperText}
              </Text>
            </View>

            <View style={styles.swapContainer}>
              <View style={styles.leftColumn}>
                <Avatar path={participant.picture} />
                <Text style={styles.textName}>{participant.name}</Text>
              </View>
              <View style={styles.middleColumn}>
                <SwapArrow height="100%" width={SCREEN_WIDTH / 5} />
              </View>
              <View style={styles.rightColumn}>
                <Avatar path={targetParticipant.picture} />
                <Text style={styles.textName}>{targetParticipant.name}</Text>
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              <Button style={styles.button} onPress={onAcceptPress}>
                <Text>Reasignar</Text>
              </Button>
              <Button
                style={{ ...styles.button, backgroundColor: colors.lightGray }}
                onPress={onCancelPress}
              >
                <Text style={{ color: "black" }}>Cancelar</Text>
              </Button>
            </View>
          </>
        )}
        {requestStatus === false && (
          <>
            <View style={styles.swapContainer}>
              <Text>El pedido ha fallado, vuelva a intentarlo mas tarde</Text>
            </View>

            <View style={styles.buttonsContainer}>
              <Button style={styles.button} onPress={onCancelPress}>
                <Text>OK</Text>
              </Button>
            </View>
          </>
        )}

        {requestStatus && (
          <>
            <View style={styles.swapContainer}>
              <Text>Número reasignado con exito!</Text>
            </View>

            <View style={styles.buttonsContainer}>
              <Button style={styles.button} onPress={onCancelPress}>
                <Text>OK</Text>
              </Button>
            </View>
          </>
        )}
      </>
    );
  };

  return (
    <GenericModal open={open}>
      <View style={styles.container}>{content()}</View>
    </GenericModal>
  );
};

export default ReasignModal;
