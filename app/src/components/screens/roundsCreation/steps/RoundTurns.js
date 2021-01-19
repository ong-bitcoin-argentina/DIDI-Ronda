import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon } from "native-base";

import colors from "../../../components/colors";
import ScreenContainer from "../ScreenContainer";
import NextButton from "../../../components/NextButton";
import CreationTitle from "../CreationTitle";
import GenericErroModal from "./GenericErrorModal";

const screenIcon = {
  type: "MaterialIcons",
  name: "bookmark-border",
};

const RoundTurns = props => {
  const { turns, navigation, noParticipantEdit, participantsQuantity } = props;
  const initialTurns =
    !Number.isNaN(parseInt(turns, 10)) && turns !== "0" ? turns : "";
  const [value, setValue] = useState(initialTurns);
  const [showErrorModal, setshowErrorModal] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");

  const shouldShowNext =
    noParticipantEdit || (value && value !== "" && value !== "0");

  const toggleErrorModal = () => setshowErrorModal(!showErrorModal);

  const openErrorModal = message => {
    seterrorMessage(message);
    toggleErrorModal();
  };

  const onChangeText = text => {
    if (text === "") return setValue("");
    const numberRegex = /^[0-9]*$/;
    const isValid = numberRegex.test(text);
    if (isValid) return setValue(text);
    return openErrorModal("Solo se pueden introducir números");
  };

  const onNextPress = () => {
    const finalTurns = parseInt(value, 10);
    if (finalTurns < participantsQuantity)
      return openErrorModal(
        `Existen mas participantes seleccionados que números disponibles para asignar\n(${participantsQuantity} Participantes Seleccionados)`
      );
    if (finalTurns === 1)
      return openErrorModal(`La ronda debe tener 2 números o más`);

    props.setTurns(value);
    return navigation.navigate("RoundDate");
  };

  const fontSizeInput = !value ? 16 : 25;

  return (
    <ScreenContainer navigation={navigation} step={2}>
      <CreationTitle
        title={
          noParticipantEdit
            ? "No se puede editar la\ncantidad de números"
            : "¿Cuántos números tendrá la\nronda?"
        }
        iconName={screenIcon.name}
        iconType={screenIcon.type}
      />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon
            type={screenIcon.type}
            name={screenIcon.name}
            style={styles.icon}
          />
          <Input
            style={{
              borderBottomColor: colors.secondary,
              borderBottomWidth: 2,
              textAlign: "center",
              fontSize: fontSizeInput,
              color: colors.mainBlue,
            }}
            disabled={noParticipantEdit}
            defaultValue={value}
            keyboardType="decimal-pad"
            value={value}
            placeholder="Ingresá la cantidad acá"
            onChangeText={onChangeText}
          />
        </View>
        <GenericErroModal
          open={showErrorModal}
          message={errorMessage}
          onOkPress={toggleErrorModal}
        />
        {!!shouldShowNext && <NextButton callback={onNextPress} />}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  icon: {
    marginHorizontal: "10%",
    color: "#9B9B9B",
  },
  label: {
    fontSize: 12,
  },
});

export default RoundTurns;
