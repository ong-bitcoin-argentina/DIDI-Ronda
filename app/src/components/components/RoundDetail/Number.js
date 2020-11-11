import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { Icon } from "native-base";
// import Participants from "./ParticipantSelection";
import Avatar from "../../../assets/img/avatar.png";
import avatarWithoutAssignment from "../../../assets/img/withoutAssignment.jpg";
import Bookmark from "../Bookmark";

import colors from "../colors";

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

const Number = props => {
  // Props
  const {
    selectedParticipants,
    participants: listOfParticipants,
    index,
    shift,
    detail,
    date,
  } = props;

  const [open, setOpen] = useState(false);
  const [selectedParticiPantsState, setselectedParticiPantsState] = useState(
    selectedParticipants
  );
  const numberDate = date.getDate();
  const month = months[date.getMonth()] || "";

  const noPicture =
    selectedParticipants.length && !selectedParticipants[0].thumbnailPath;
  const noPicture2 =
    selectedParticipants.length > 1 && !selectedParticipants[1].thumbnailPath;

  return (
    <View style={[{ flexDirection: "column" }]}>
      <TouchableOpacity
        style={[
          styles.number,
          { zIndex: 10000 - index * 10 },

          open && styles.numberShadow,
        ]}
        onPress={() => setOpen(!open)}>
        <Bookmark number={index} />
        <Image
          source={
            selectedParticipants.length && selectedParticipants[0].thumbnailPath
              ? { uri: selectedParticipants[0].thumbnailPath }
              : selectedParticipants.length
              ? Avatar
              : avatarWithoutAssignment
          }
          style={[
            styles.thumbnail,
            noPicture && { borderWidth: 2, borderColor: colors.mainBlue },
          ]}
        />
        {selectedParticipants.length > 1 && (
          <Image
            source={
              selectedParticipants.length &&
              selectedParticipants[1].thumbnailPath
                ? { uri: selectedParticipants[1].thumbnailPath }
                : selectedParticipants.length
                ? Avatar
                : avatarWithoutAssignment
            }
            style={[
              styles.thumbnail,
              noPicture2 && { borderWidth: 2, borderColor: colors.mainBlue },
            ]}
          />
        )}
        <View style={styles.participant}>
          <View style={styles.participantIdentification}>
            <View style={{ flexDirection: "column", justifyContent: "center" }}>
              <Text style={styles.participantName}>
                {selectedParticipants.length
                  ? selectedParticipants[0].name
                  : "Sin Asignar"}
              </Text>

              {selectedParticipants.length > 1 && (
                <Text style={styles.participantName}>
                  {selectedParticipants[1].name}
                </Text>
              )}
            </View>
            {!selectedParticipants.length && (
              <Text style={styles.participantNumber}>
                {detail
                  ? shift.status == "pending"
                    ? ""
                    : shift.status == "current"
                    ? "En curso"
                    : "Completada"
                  : "Participante"}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.viewContainer}>
          <Text style={styles.month}>
            {month.substring(0, 3).toUpperCase()}
          </Text>
          <Icon type="FontAwesome5" name="calendar" style={styles.calendar} />
          <View style={styles.dateContainer}>
            <Text style={{ textAlign: "center" }}>{numberDate}</Text>
          </View>
        </View>
        <View style={styles.viewContainer}>
          <Text style={styles.month} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const ColumsCenter = { flexDirection: "column", alignItems: "center" };

const styles = StyleSheet.create({
  number: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 80,
    paddingHorizontal: 20,
    backgroundColor: colors.backgroundGray,
  },
  numberShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.35,

    elevation: 19,
  },
  numberValue: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  bookmark: {
    zIndex: 10,
    color: colors.mainBlue,
    fontSize: 40,
    width: 40,
    padding: 0,
    margin: 0,
  },
  bookmarkContainer: {
    zIndex: 20,
    paddingRight: 20,
    position: "absolute",
    width: "100%",
    height: "100%",
    ...ColumsCenter,
  },
  month: {
    textAlign: "center",
    paddingRight: 5,
    color: colors.mainBlue,
    fontWeight: "bold",
  },
  calendar: {
    color: colors.mainBlue,
    fontSize: 35,
    width: 35,
    padding: 0,
    margin: 0,
  },
  dateContainer: {
    paddingRight: 5,
    position: "absolute",
    width: "100%",
    height: "100%",
    ...ColumsCenter,
    justifyContent: "center",
  },
  participant: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  participantIdentification: {
    flex: 1,
    flexDirection: "column",
  },
  numberFlag: {
    color: colors.mainBlue,
    marginRight: 15,
    fontSize: 40,
  },
  thumbnail: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  participantName: {
    fontWeight: "500",
    color: colors.gray,
    fontSize: 14,
  },
  participantNumber: {
    color: colors.secondary,
    fontSize: 16,
  },
  contactThumbnailContainer: { flexDirection: "row", alignItems: "center" },
  contactThumbnail: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 12,
  },

  viewContainer: {
    ...ColumsCenter,
    width: 40,
  },
});

export default Number;
