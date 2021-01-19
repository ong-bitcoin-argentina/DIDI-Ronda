import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";
import { Input, Icon, Toast } from "native-base";
import { Text } from "native-base";
import colors from "../../../components/colors";
import ScreenContainer from "../ScreenContainer";
import NextButton from "../../../components/NextButton";
import CreationTitle from "../CreationTitle";

const widthScreen = Dimensions.get("screen").width;

const screenIcon = {
  type: "MaterialIcons",
  name: "format-color-text",
};

const stepIcon = {
  type: "MaterialIcons",
  name: "attach-money",
};

const amounts = ["1000", "2000", "5000"];

const formatNumber = num =>
  num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

const RoundName = props => {
  const { name, setAmount } = props;
  const { navigation } = props;
  const [value, setValue] = useState(name);
  const [customAmount, setCustomAmount] = useState();
  const [showCustomAmount, setShowCustomAmount] = useState(false);

  const validateInput = text => {
    if (text === "") return setCustomAmount("");
    const numberRegex = /^[0-9]*$/;
    const isValid = numberRegex.test(text);
    if (isValid) return setCustomAmount(text);
    return Toast.show({
      text: "Solo números aceptados",
      position: "top",
      type: "warning",
    });
  };

  const valueIsValid = customAmount && customAmount !== "0";

  return (
    <ScreenContainer navigation={navigation} step={0}>
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "center",
          paddingBottom: 10,
          backgroundColor: colors.backgroundGray,
        }}>
        <Icon
          name={screenIcon.name}
          type={screenIcon.type}
          style={{ color: colors.mainBlue, fontSize: 45 }}
        />
        <Text
          style={{
            marginLeft: 25,
            fontWeight: "bold",
            fontSize: 18,
          }}>{`¿Cómo se va\na llamar la ronda?`}</Text>
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
            style={{
              borderBottomColor: colors.secondary,
              borderBottomWidth: 2,
              maxWidth: widthScreen * 0.6,
            }}
            value={value}
            onChangeText={text => setValue(text)}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "center",
          paddingBottom: 10,
          backgroundColor: colors.backgroundGray,
        }}>
        <Icon
          name={stepIcon.name}
          type={stepIcon.type}
          style={{ color: colors.mainBlue, fontSize: 45 }}
        />
        <Text
          style={{
            marginLeft: 25,
            fontWeight: "bold",
            fontSize: 18,
          }}>{`¿Cuánto dinero deberá\naportar cada participante?`}</Text>
      </View>
      <View style={{ ...styles.container, flex: 1 }}>
        <View style={styles.amountFullContainer}>
          {amounts.map(amount => {
            const isDisabled = value.trim() === "";
            return (
              <View style={styles.amountContainer} key={amount}>
                <TouchableOpacity
                  onPress={
                    !isDisabled
                      ? () => {
                          setAmount(amount);
                          props.navigation.navigate("RoundFrequency");
                        }
                      : null
                  }
                  disabled={isDisabled}
                  style={{
                    ...styles.amountValueContainer,
                    backgroundColor: isDisabled
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
                backgroundColor:
                  value.trim() === "" ? colors.darkishGray : colors.secondary,
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
              onChangeText={text => validateInput(text)}
              keyboardType="number-pad"
              style={{
                borderBottomColor: colors.secondary,
                borderBottomWidth: 2,
                maxWidth: widthScreen * 0.6,
                paddingTop: 20,
              }}
              text
            />
          </View>
        )}
        {!!showCustomAmount && !!valueIsValid && (
          <NextButton
            callback={() => {
              setAmount(customAmount);
              props.navigation.navigate("RoundFrequency");
            }}
          />
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
    marginTop: 25,
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
});

export default RoundName;
