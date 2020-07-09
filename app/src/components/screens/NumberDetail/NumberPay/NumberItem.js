import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Icon } from "native-base";
import colors from "../../../components/colors";
import Avatar from "../../roundsCreation/steps/ParticipantSelection/Avatar";
import AvatarWithReload from "../../../components/AvatarWithReload";
import Bookmark from "../../../components/Bookmark";
import { getPaymentDate } from "../../../../utils/dates";

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

const NumberItem = props => {
  const {
    participant,
    number,
    shouldRenderNumber = false,
    onPress,
    roundFrequency,
    roundStartDate,
    isCurrentParticipant,
  } = props;
  const { picture, name } = participant.user;
  const { date: paymentDate } = getPaymentDate(
    roundStartDate,
    roundFrequency,
    number
  );
  const payDate = String(paymentDate.getUTCDate());
  const payMonth = months[paymentDate.getUTCMonth()].substr(0, 3);

  const onPressItem = () =>
    onPress({ ...participant, user: { ...participant.user, number } });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.itemContainer} onPress={onPressItem}>
        {shouldRenderNumber && (
          <View>
            <Bookmark number={number} />
          </View>
        )}
        <View style={styles.avatarContainer}>
          {isCurrentParticipant ? (
            <AvatarWithReload path={picture} />
          ) : (
            <Avatar path={picture} />
          )}
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.nameTitle}>{name}</Text>
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
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 3,
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

export default NumberItem;
