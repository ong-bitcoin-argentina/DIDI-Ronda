import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Item, Input, Toast, Form } from "native-base";
import colors from "../../../components/colors";
import ScreenContainer from "../ScreenContainer";
import NextButton from "../../../components/NextButton";
import CreationTitle from "../CreationTitle";

const stepIcon = {
  type: "MaterialCommunityIcons",
  name: "cash-usd",
};

const ManualValue = props => {
  const [value, setValue] = useState("");

  const validateInput = text => {
    if (text === "") return setValue("");
    const numberRegex = /^[0-9]*$/;
    const isValid = numberRegex.test(text);
    if (isValid) return setValue(text);
    return Toast.show({
      text: "Solo números aceptados",
      position: "top",
      type: "warning",
    });
  };

  const valueIsValid = value && value !== "0";

  return (
    <>
      <CreationTitle
        title={`¿Cuánto dinero deberá aportar\ncada participante?`}
        iconType={stepIcon.type}
        iconName={stepIcon.name}
      />
      <View style={{ backgroundColor: colors.backgroundGray, flex: 1 }}>
        <View style={styles.manualValueContainer}>
          <View style={styles.leftIcon}>
            <Icon name="logo-usd" style={{ fontSize: 14, color: "white" }} />
          </View>

          <Form>
            <Item style={styles.otherItem}>
              <Input
                placeholder="0"
                value={value}
                onChangeText={text => validateInput(text)}
                keyboardType="number-pad"
                style={styles.otherTextInput}
                text
              />
            </Item>
          </Form>
        </View>
        {valueIsValid ? (
          <NextButton callback={() => props.callback(value)} />
        ) : null}
      </View>
    </>
  );
};

const AmountValue = props => {
  function setValue(value) {
    props.setAmount(value);
  }

  return (
    <ScreenContainer title="¿Cuanto dinero van a juntar?" step={1}>
      <ManualValue
        callback={val => {
          setValue(val);
          props.navigation.navigate("RoundFrequency");
        }}
      />
    </ScreenContainer>
  );
};
const styles = StyleSheet.create({
  manualValueContainer: {
    backgroundColor: colors.backgroundGray,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    alignContent: "stretch",
    justifyContent: "space-around",
    backgroundColor: colors.backgroundGray,
    paddingHorizontal: 50,
  },
  amountContainer: {
    justifyContent: "space-around",
    width: "50%",
    alignItems: "center",
  },
  amountValueContainer: {
    height: 100,
    width: 100,
    borderRadius: 60,
    backgroundColor: colors.mainBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  amountValue: {
    color: "white",
    fontSize: 18,
  },
  iconContainer: { flexDirection: "row", alignItems: "center" },
  icon: {
    color: colors.mainBlue,
    fontSize: 30,
    position: "absolute",
    top: 40,
    left: 30,
  },
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
});

export default AmountValue;
