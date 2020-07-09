import React from "react";
import { Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";

import { endOfMonth, startOfMonth, parseISO } from "date-fns";

import colors from "./colors";

const SCREEN_WIDTH = Dimensions.get("window").width;

/**
 * Renders a month calendar, receives a date and a onDayPress function
 * NOTE: The parent component must set the LocaleConfig, since the calendar will not do it
 */
const MonthCalendar = ({ date, onDayPress, selectedDate }) => {
  const fnsDate = parseISO(date, "DD-mm-yyyy");
  const startDate = startOfMonth(fnsDate);
  const endDate = endOfMonth(fnsDate);

  return (
    <Calendar
      current={fnsDate}
      minDate={startDate}
      maxDate={endDate}
      mark
      onDayPress={day => onDayPress(day)}
      monthFormat="MMMM yyyy"
      hideArrows
      hideExtraDays
      disableMonthChange
      markedDates={{
        [selectedDate]: {
          selected: true,
          selectedColor: colors.mainBlue,
        },
      }}
      firstDay={1}
      disableArrowLeft
      disableArrowRight
      theme={{
        "stylesheet.calendar.main": {
          container: {
            width: SCREEN_WIDTH - SCREEN_WIDTH / 4,
            borderRadius: 10,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.37,
            shadowRadius: 7.49,

            elevation: 12,
          },
          monthView: {
            borderRadius: 10,
            backgroundColor: "white",
          },
          week: {
            marginTop: 5,
            marginBottom: 5,
            flexDirection: "row",
            justifyContent: "space-around",
          },
        },

        "stylesheet.calendar.header": {
          header: {
            backgroundColor: colors.mainBlue,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
          monthText: {
            fontSize: 20,
            fontWeight: "bold",
            color: "white",
            margin: 10,
          },
        },
        "stylesheet.day.basic": {
          todayText: {
            color: "black",
            fontWeight: "bold",
          },
          today: {
            borderRadius: 16,
            backgroundColor: colors.secondGray,
          },
        },
      }}
    />
  );
};

export default MonthCalendar;
