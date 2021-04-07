import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Button } from "native-base";
import Avatar from "../../../../components/Avatar";

import Bookmark from "../../../../components/Bookmark";
import colors from "../../../../components/colors";
import Calendar from "../../../../components/Calendar";
import { getPaymentDate } from "../../../../../utils/dates";
import SelectedList from "../ParticipantSelection/SelectedList";

const ParticipantNumberItem = props => {
  const [openList, setopenList] = useState(false);
  const {
    picture,
    name,
    number,
    frequency,
    date,
    remainingParticipants,
    onPressParticipant,
    onPressRemoveParticipantNumber,
    scrollableRef,
    maxNumber,
  } = props;

  const { month, day } = getPaymentDate(date, frequency, number);

  const onPressReplace = () => onPressRemoveParticipantNumber(number);

  const handleOpacityPress = () => {
    if (!openList && scrollableRef && scrollableRef.current) {
      setopenList(!openList);
      const scrollIndex = number >= 1 ? number - 1 : 0;
      if (number !== maxNumber)
        scrollableRef.current.scrollToIndex({
          index: scrollIndex,
          viewPosition: 0,
        });
      if (number === maxNumber)
        setTimeout(
          () =>
            scrollableRef.current.scrollToIndex({
              index: scrollIndex,
              viewPosition: 0,
              viewOffset: -30,
            }),
          200
        );
    } else {
      setopenList(!openList);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleOpacityPress}
        style={[styles.itemContainer]}>
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
      {openList && !name && (
        <SelectedList
          renderDetail={false}
          participants={remainingParticipants}
          pressHandler={item => {
            onPressParticipant(number, item);
          }}
        />
      )}
      {openList && name && (
        <View style={styles.buttonContainer}>
          <Button style={styles.button} onPress={onPressReplace}>
            <Text style={styles.buttonText}>Reemplazar</Text>
          </Button>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    backgroundColor: "white",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    borderRadius: 8,
    paddingHorizontal: 5,
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
  button: {
    width: "80%",
    height: 50,
    backgroundColor: colors.mainBlue,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ParticipantNumberItem;
