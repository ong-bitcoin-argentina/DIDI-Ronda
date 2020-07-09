import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "native-base";
import Avatar from "../../../../components/Avatar";

import Bookmark from "../../../../components/Bookmark";
import colors from "../../../../components/colors";
import Calendar from "../../../../components/Calendar";
import { getPaymentDate } from "../../../../../utils/dates";

const ParticipantNumberItem = props => {
  const { picture, name, number, frequency, date } = props;

  const { month, day } = getPaymentDate(date, frequency, number);

  return (
    <TouchableOpacity style={[styles.itemContainer]}>
      <View style={{ flex: 0.2 }}>
        <Bookmark bold size={0.6} number={number} color="#333" />
      </View>
      <View style={styles.participantContainer}>
        <Avatar path={picture} />
      </View>
      <View style={styles.participantData}>
        <Text style={styles.name}>{name}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.bookmarkContainer}>
          <Calendar month={month + 1} day={day} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    backgroundColor: "white",
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: colors.mainBlue,
  },
  participantContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 0.2,
  },
  participantData: {
    flex: 0.4,
  },
  name: {
    fontWeight: "bold",
  },
  infoContainer: {
    alignItems: "center",
    flexDirection: "row",
    flex: 0.2,
  },
});

export default ParticipantNumberItem;
