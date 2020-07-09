import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "native-base";

import {
  getPaymentDate,
  getFormattedDate,
  getHoursAndMinutes,
} from "../../../utils/dates";
import Bookmark from "../Bookmark";
import Calendar from "../Calendar";
import colors from "../colors";
import MoneySignWithCircle from "../icons/MoneySignWithCircle";

const MovementItem = ({
  number,
  frequency,
  date,
  roundStartDate,
  paymentAmount = 0,
}) => {
  const { month, day } = getPaymentDate(roundStartDate, frequency, number);

  return (
    <TouchableOpacity style={[styles.itemContainer]}>
      <View style={styles.numberContainer}>
        <View>
          <Bookmark bold size={0.6} number={number} color="#333" />
        </View>
        <View>
          <Calendar month={month + 1} day={day} />
        </View>
      </View>
      <View style={styles.dateTextContainer}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.dateText}>{getFormattedDate(date)}</Text>
          <Text style={styles.timeText}>{getHoursAndMinutes(date)} hs</Text>
        </View>
      </View>
      <View style={styles.paymentDataContainer}>
        <Text style={{ color: colors.mainBlue, opacity: 1 }}>- $</Text>
        <Text style={styles.amountPayed}> {paymentAmount}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View>
          <MoneySignWithCircle />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    height: 80,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 5,
    borderColor: colors.mainBlue,
  },
  numberContainer: {
    flex: 0.3,
    flexDirection: "row",
    alignItems: "center",
  },
  dateTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 0.35,
  },
  paymentDataContainer: {
    flex: 0.35,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  timeText: {
    fontSize: 13,
    opacity: 0.4,
  },
  dateText: {
    fontWeight: "bold",
    fontSize: 13,
  },
  amountPayed: {
    fontWeight: "bold",
    opacity: 0.6,
  },
  infoContainer: {
    justifyContent: "center",
    flexDirection: "row",
    flex: 0.2,
  },
});

export default MovementItem;
