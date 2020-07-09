import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Icon } from "native-base";
import colors from "./colors";
import { monthArray } from "../../utils/utils";

const Calendar = props => {
  const { day, month } = props;

  const textMonth = month && monthArray[month - 1].substr(0, 3);

  return (
    <View style={styles.calendarContainer}>
      <Text style={styles.calendarMonth}>{textMonth}</Text>
      <Icon
        style={styles.calendarIcon}
        name="calendar-blank"
        type="MaterialCommunityIcons"
      />
      <Text style={styles.calendarDay}>{day}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // CALENDAR
  calendarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  calendarIcon: {
    color: colors.mainBlue,
    fontSize: 40,
  },
  calendarMonth: {
    fontSize: 12,
    color: colors.mainBlue,
    fontWeight: "bold",
  },
  calendarDay: {
    fontSize: 12,
    position: "absolute",
    top: 32,
  },
});

export default Calendar;
