import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text } from "native-base";
import colors from "../../../components/colors";
import ScreenContainer from "../ScreenContainer";
import CreationTitle from "../CreationTitle";

const stepIcon = {
  type: "MaterialIcons",
  name: "attach-money",
};

const Amount = props => {
  function setValue(value) {
    props.setAmount(value);
  }

  const amounts = ["1000", "2000", "5000"];

  const { navigation } = props;

  const formatNumber = num =>
    num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

  return (
    <ScreenContainer navigation={navigation} step={1}>
      <CreationTitle
        title={`¿Cuánto dinero deberá aportar\ncada participante?`}
        iconType={stepIcon.type}
        iconName={stepIcon.name}
      />
      <View style={styles.container}>
        {amounts.map(value => (
          <View style={styles.amountContainer} key={value}>
            <TouchableOpacity
              onPress={() => {
                setValue(value);
                props.navigation.navigate("RoundFrequency");
              }}
              style={styles.amountValueContainer}>
              <Text style={styles.amountValue}>${formatNumber(value)}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.amountContainer}>
          <TouchableOpacity
            style={[
              styles.amountValueContainer,
              { backgroundColor: colors.secondary },
            ]}
            onPress={() => {
              props.navigation.navigate("AmountValue");
            }}>
            <Text style={styles.amountValue}>Otro</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: "space-between",
    backgroundColor: colors.backgroundGray,
  },
  amountContainer: {
    justifyContent: "space-between",
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

export default Amount;
