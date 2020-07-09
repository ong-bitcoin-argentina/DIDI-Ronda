import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import Item from "./Item";

const ParticipantHList = props => {
  const { participants, pressHandler, detail } = props;

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={participants}
        keyExtractor={data => `selected-${data.recordID || data._id}`}
        renderItem={({ item, index }) => (
          <Item
            item={item}
            index={index}
            pressHandler={() => pressHandler && pressHandler(item)}
            detail={detail}
          />
        )}
        horizontal
        extraData={participants.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: "100%",
  },
});

export default ParticipantHList;
