import React from "react";
import { View, StyleSheet } from "react-native";
import Colors from "../../../../components/colors";
import SubMenuContainer from "./SubMenuContainer";
import ValueWithIcon from "../../../../components/RoundDetail/ValueWithIcon";
import { amountFormat, roundFrequencyArray } from "../../../../../utils/utils";

const ExtraData = props => {
  const { frequency: letterFrequency, value, roundAmount } = props;

  let frequency = "";
  frequency = roundFrequencyArray[letterFrequency];

  return (
    <SubMenuContainer title="Otros Datos">
      <View style={styles.container}>
        <ValueWithIcon
          value={`$${amountFormat(roundAmount)}`}
          subtitle="Monto ronda"
          icon="attach-money"
          iconType="MaterialIcons"
        />
        <ValueWithIcon
          value={`$${amountFormat(value)}`}
          subtitle="Valor Pago"
          icon="cash-usd"
          middle
          iconType="MaterialCommunityIcons"
        />
        <ValueWithIcon
          value={frequency}
          subtitle="Frecuencia"
          icon="alarm"
          iconType="MaterialIcons"
        />
      </View>
    </SubMenuContainer>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: "15%",
    overflow: "hidden",
  },
  roundInfo: {
    flexDirection: "column",
    height: 100,
    marginBottom: 8,
    backgroundColor: "white",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  roundInfoDates: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  roundInfoDate: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "35%",
  },

  roundState: {
    flexDirection: "column",
    justifyContent: "center",

    paddingRight: 20,
  },
  state: {
    color: Colors.lightBlue,
    fontStyle: "italic",
  },
  dateContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ExtraData;
