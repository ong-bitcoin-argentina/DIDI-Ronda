import React from "react";
import { View, FlatList } from "react-native";
import { Text } from "native-base";

import ListItem from "./ListItem";
import ParticipantListTitles from "./ParticipantListTitles";

const ParticipantsList = props => {
  const { participants, shifts, navigation } = props;

  const getPayDay = index => {
    const shift = shifts[index];
    const { limitDate } = shift;
    return limitDate;
  };

  const handleNavigation = participant => {
    navigation.navigate("UserProfile", { participant });
  };

  const participantsToRender = participants.map((item, index) => (
    <ListItem
      key={index}
      participant={item}
      number={index + 1}
      shouldRenderNumber
      payday={getPayDay(index)}
      handleNavigation={handleNavigation}
    />
  ));

  return (
    <>
      <View
        style={{
          marginVertical: 10,
          marginHorizontal: 15,
          borderBottomColor: "#8a8a8a",
          flexDirection: "row",
          paddingBottom: 3,
          borderBottomWidth: 1,
        }}>
        <Text style={{ fontSize: 12, fontWeight: "bold" }}>
          Participantes Confirmados
        </Text>
      </View>
      <ParticipantListTitles />
      {participantsToRender}
    </>
  );
};

export default ParticipantsList;
