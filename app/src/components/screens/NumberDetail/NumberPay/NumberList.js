import React from "react";
import { FlatList } from "react-native";
import NumberItem from "./NumberItem";

const NumberList = ({
  numbers,
  shifts,
  onNumberPress,
  roundStartDate,
  roundFrequency,
  currentParticipantId,
}) => {
  // We have to sort properly throught the participants and shifts
  // Order is not guaranteed because of reasignment of numbers
  const properNumbers = shifts.map(s =>
    numbers.find(p => p._id === s.participant[0])
  );

  const renderItem = ({ item, index }) => (
    <NumberItem
      participant={item}
      number={index + 1}
      isCurrentParticipant={currentParticipantId === item._id}
      roundFrequency={roundFrequency}
      roundStartDate={roundStartDate}
      payDay={item.limitDate}
      onPress={onNumberPress}
      shouldRenderNumber
    />
  );

  return (
    <FlatList
      data={properNumbers}
      renderItem={renderItem}
      keyExtractor={(item, i) => `${i}-${item._id}`}
    />
  );
};

export default NumberList;
