import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Icon } from "native-base";
import colors from "../../components/colors";
import Avatar from "../roundsCreation/steps/ParticipantSelection/Avatar";
import Bookmark from "../../components/Bookmark";

const months = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SETIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE",
];

const getIconStatus = accepted => {
  switch (accepted) {
    case true:
      return (
        <Icon
          style={[styles.statusIcon, { color: colors.mainBlue }]}
          name="check-circle"
          type="MaterialCommunityIcons"
        />
      );

    case false:
      return (
        <Icon
          style={[styles.statusIcon, { color: colors.statusPurple }]}
          name="close-circle"
          type="MaterialCommunityIcons"
        />
      );

    default:
      return (
        <Icon
          style={[styles.statusIcon, { color: colors.yellowStatus }]}
          name="alert-circle"
          type="MaterialCommunityIcons"
        />
      );
  }
};

const getStateString = accepted => {
  switch (accepted) {
    case true:
      return "Aceptado";
    case false:
      return "Rechazado";
    default:
      return "Pendiente";
  }
};

const ListItem = props => {
  const {
    participant,
    number,
    shouldRenderNumber = false,
    handleNavigation,
    payday,
  } = props;
  const { picture, name } = participant.user;

  let payDate = "";
  let payMonth = "---";
  if (payday) {
    const paydate = payday.split("T")[0];

    const newpayday = new Date(paydate);

    const offset = newpayday.getTimezoneOffset();

    newpayday.setMinutes(offset);

    payDate = newpayday
      .getDate()
      .toString()
      .substr(0, 3);
    payMonth = months[newpayday.getMonth()].substr(0, 3);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleNavigation(participant)}
      >
        {shouldRenderNumber && (
          <View>
            <Bookmark number={number} />
          </View>
        )}
        <View style={styles.avatarContainer}>
          <Avatar path={picture} />
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.nameTitle}>{name}</Text>
          <Text style={styles.statusTitle}>
            {getStateString(participant.acepted)}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={styles.calendarContainer}>
            <Text style={styles.calendarMonth}>{payMonth}</Text>
            <Icon
              style={styles.calendarIcon}
              name="calendar-blank"
              type="MaterialCommunityIcons"
            />
            <Text style={styles.calendarDay}>{payDate}</Text>
          </View>
          {getIconStatus(participant.acepted)}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginLeft: 10,
  },
  nameContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  statusContainer: {
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
  nameTitle: {},
  statusTitle: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: "100",
  },
  statusIcon: {
    fontSize: 25,
    marginLeft: 20,
  },
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
    top: 33,
  },
});

export default ListItem;
