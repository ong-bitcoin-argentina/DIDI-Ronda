import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Item, Input, Icon, Label } from "native-base";
import colors from "../../../../components/colors";
import { hasValidPhonePrefix } from "../../../../../utils/utils";
import RoundPopUp from "../../../../components/RoundPopUp";

const PhantomModal = props => {
  // Props
  const { addPhantomInvite, phoneNumber, closeModal } = props;

  // Hooks
  const [phantomNumber, setPhantomNumber] = useState("");
  const [phantomName, setPhantomName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errorMsgInterval, setErrorMsgInterval] = useState(null);

  // Mount
  useEffect(() => {}, []);

  // Methods
  const formatPhoneNumber = phone => {
    return phone[0] === "+" || phone === "" ? phone : `+${phone}`;
  };

  const phantomModalPositive = () => {
    const authNumber = phoneNumber.replace(/ /g, "");
    if (authNumber && phantomNumber === authNumber)
      return showErrorMsg("No puedes invitarte a ti mismo.");

    const isValid =
      phantomName.length &&
      phantomNumber.length &&
      hasValidPhonePrefix(phantomNumber);

    if (isValid) {
      closeModal();
      return addPhantomInvite(phantomName, phantomNumber);
    }

    return showErrorMsg(
      "El invitado debe tener un nombre y un teléfono que respete el formato."
    );
  };

  const showErrorMsg = error => {
    if (errorMsgInterval) {
      clearTimeout(errorMsgInterval);
    }
    setErrorMsg(error);
    const newTimeout = setTimeout(() => {
      setErrorMsg("");
    }, 2500);
    setErrorMsgInterval(newTimeout);
  };

  // Render
  return (
    <RoundPopUp
      onRef={ref => (this.child = ref)}
      titleText="Identifica a tu invitado"
      positive={() => phantomModalPositive()}
      negative={() => {
        closeModal();
      }}
      positiveTitle="Agregar a la ronda"
      visible
      notCloseAfterPositive
      notCloseAfterNegative
    >
      <View style={styles.container}>
        <Text style={styles.text}>
          Los demas integrantes de la ronda no podran saber su nombre
        </Text>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            -Su nombre no sera publico para el resto de los participantes.{`\n`}
            -No recibirá recordatorios ni información sobre la ronda.{`\n`}
            -Su número de telefono debe incluir el prefijo del país con el + y
            después su número (Argentina +54){`\n`}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Icon type="Ionicons" name="md-person" style={styles.icon} />
          <Item
            style={{
              width: "65%",
              height: 75,
              borderColor: phantomName > 0 ? colors.mainBlue : colors.secondary,
            }}
            stackedLabel
          >
            <Label style={{ fontWeight: "bold", color: "black" }}>
              Nombre invitado sin App
            </Label>
            <Input
              value={phantomName}
              onChangeText={text => setPhantomName(text)}
              placeholder="Nombre"
              placeholderTextColor={colors.secondary}
            />
          </Item>
        </View>
        <View style={styles.iconContainer}>
          <Icon type="Feather" name="hash" style={styles.icon} />
          <Item
            style={{
              width: "65%",
              height: 75,
              borderColor:
                phantomNumber > 0 ? colors.mainBlue : colors.secondary,
            }}
            stackedLabel
          >
            <Label style={{ fontWeight: "bold", color: "black" }}>
              Número de telefono
            </Label>
            <Input
              keyboardType="numeric"
              value={phantomNumber}
              onChangeText={phone => setPhantomNumber(formatPhoneNumber(phone))}
              placeholder="Telefono"
              placeholderTextColor={colors.secondary}
            />
          </Item>
        </View>
        {!!errorMsg && (
          <View style={styles.errorMsg}>
            <Text style={styles.errorMsgText}>{errorMsg}</Text>
          </View>
        )}
      </View>
    </RoundPopUp>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  textContainer: {
    marginTop: 15,
    marginBottom: 10,
  },
  text: {
    textAlign: "left",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  icon: {
    marginHorizontal: "10%",
    color: "#9B9B9B",
  },
  errorMsg: {
    backgroundColor: "orange",
    margin: 5,
    borderRadius: 5,
    padding: 5,
  },
  errorMsgText: {
    color: "white",
  },
});

export default PhantomModal;
