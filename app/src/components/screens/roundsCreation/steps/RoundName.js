import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Input, Icon, Toast } from "native-base";
import { Text } from "native-base";
import colors from "../../../components/colors";
import ScreenContainer from "../ScreenContainer";
import NextButton from "../../../components/NextButton";
import GenericErroModal from "./GenericErrorModal";

const widthScreen = Dimensions.get("screen").width;

const screenIcon = {
  type: "MaterialIcons",
  name: "format-color-text",
};

const stepIcon = {
  type: "MaterialIcons",
  name: "attach-money",
};

const turnsIcon = {
  type: "MaterialIcons",
  name: "bookmark-border",
};

const amounts = ["1000", "2000", "5000"];

const formatNumber = num =>
  num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

const RoundName = props => {
  const {
    name,
    setAmount,
    noParticipantEdit,
    setTurns,
    turns,
    participantsQuantity,
  } = props;

  const initialTurns =
    !Number.isNaN(parseInt(turns, 10)) && turns !== "0" ? turns : "";

  const { navigation } = props;
  const [value, setValue] = useState(name);
  const [customAmount, setCustomAmount] = useState();
  const [showCustomAmount, setShowCustomAmount] = useState(false);
  const [turnsValue, setTurnsValue] = useState(initialTurns);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleErrorModal = () => setShowErrorModal(!showErrorModal);

  const openErrorModal = message => {
    setErrorMessage(message);
    toggleErrorModal();
  };

  const validateInput = (text, setFunction) => {
    if (text === "") return setFunction("");
    const numberRegex = /^[0-9]*$/;
    const isValid = numberRegex.test(text);
    if (isValid) return setFunction(text);
    return Toast.show({
      text: "Solo números aceptados",
      position: "top",
      type: "warning",
    });
  };

  const onNextPress = () => {
    const finalTurns = parseInt(turnsValue, 10);
    if (finalTurns < participantsQuantity)
      return openErrorModal(
        `Existen mas participantes seleccionados que números disponibles para asignar\n(${participantsQuantity} Participantes Seleccionados)`
      );
    if (finalTurns === 1)
      return openErrorModal(`La ronda debe tener 2 números o más`);

    setAmount(customAmount);
    setTurns(turnsValue);
    return props.navigation.navigate("RoundFrequency");
  };

  const valueIsValid =
    customAmount &&
    customAmount !== "0" &&
    (noParticipantEdit ||
      (turnsValue && turnsValue !== "" && turnsValue !== "0"));

  const isBubbleDisabled =
    value.trim() === "" || turnsValue === "" || turnsValue === "0";

  return (
    <ScreenContainer navigation={navigation} step={0}>
      <ScrollView style={{ flex: 1, backgroundColor: colors.backgroundGray }}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{`¿Cómo se va a llamar la ronda?`}</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Icon
              type="MaterialIcons"
              name="filter-tilt-shift"
              style={styles.icon}
            />

            <Input
              placeholder="Escribí el nombre acá"
              style={styles.input}
              value={value}
              onChangeText={text => setValue(text)}
            />
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {noParticipantEdit
              ? "No se puede editar la\ncantidad de números"
              : "¿Cuántos números tendrá la ronda?"}
          </Text>
        </View>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Icon
              type={turnsIcon.type}
              name={turnsIcon.name}
              style={styles.icon}
            />

            <Input
              style={styles.input}
              disabled={noParticipantEdit}
              keyboardType="number-pad"
              value={turnsValue}
              placeholder="Ingresá la cantidad acá"
              onChangeText={text => validateInput(text, setTurnsValue)}
            />
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text
            style={
              styles.title
            }>{`¿Cuánto dinero deberá aportar cada participante?`}</Text>
        </View>
        <View style={{ ...styles.container }}>
          <View style={styles.amountFullContainer}>
            {amounts.map(amount => {
              return (
                <View style={styles.amountContainer} key={amount}>
                  <TouchableOpacity
                    onPress={!isBubbleDisabled ? onNextPress : null}
                    disabled={isBubbleDisabled}
                    style={{
                      ...styles.amountValueContainer,
                      backgroundColor: isBubbleDisabled
                        ? colors.lightBlue
                        : colors.mainBlue,
                    }}>
                    <Text style={styles.amountValue}>
                      ${formatNumber(amount)}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}

            <View style={styles.amountContainer}>
              <TouchableOpacity
                style={{
                  ...styles.amountValueContainer,
                  backgroundColor: isBubbleDisabled
                    ? colors.darkishGray
                    : colors.secondary,
                }}
                onPress={() => {
                  setShowCustomAmount(true);
                }}
                disabled={!value}>
                <Text style={styles.amountValue}>Otro</Text>
              </TouchableOpacity>
            </View>
          </View>
          {!!showCustomAmount && (
            <View style={styles.iconContainer}>
              <Icon
                name={stepIcon.name}
                type={stepIcon.type}
                style={styles.icon}
              />
              <Input
                placeholder="0"
                value={customAmount}
                onChangeText={text => validateInput(text, setCustomAmount)}
                keyboardType="number-pad"
                style={styles.input}
                text
              />
            </View>
          )}
          <GenericErroModal
            open={showErrorModal}
            message={errorMessage}
            onOkPress={toggleErrorModal}
          />
        </View>
      </ScrollView>
      <View style={styles.nextButtonContainer}>
        {!!showCustomAmount && !!valueIsValid && (
          <NextButton callback={onNextPress} />
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundGray,
    paddingBottom: 20,
  },
  amountFullContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    alignContent: "stretch",
    justifyContent: "space-between",
    backgroundColor: colors.backgroundGray,
    marginTop: 15,
    marginHorizontal: 10,
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
  amountContainer: {
    justifyContent: "space-between",
    width: "25%",
    alignItems: "center",
  },
  amountValueContainer: {
    height: 75,
    width: 75,
    borderRadius: 38,
    backgroundColor: colors.mainBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  amountValue: {
    color: "white",
    fontSize: 18,
  },
  iconContainer: { flexDirection: "row", alignItems: "center" },
  otherTextInput: {
    fontSize: 26,
    width: "100%",
    textAlign: "center",
    marginTop: 30,
    padding: 1,
  },
  otherItem: {
    paddingHorizontal: 50,
    minWidth: "60%",
    paddingLeft: 30,
  },
  otherLabel: {
    marginLeft: -30,
    marginBottom: 30,
  },
  leftIcon: {
    backgroundColor: "gray",
    borderRadius: 10,
    width: 20,
    height: 20,
    marginRight: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.backgroundGray,
  },
  input: {
    borderBottomColor: colors.secondary,
    borderBottomWidth: 2,
    maxWidth: widthScreen * 0.6,
    marginTop: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  nextButtonContainer: {
    position: "absolute",
    width: "100%",
    height: 50,
    bottom: 0,
  },
});

export default RoundName;
