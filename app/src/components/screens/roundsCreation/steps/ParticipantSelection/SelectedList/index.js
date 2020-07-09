import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import Item from "./Item";
import colors from "../../../../../components/colors";

const SelectedList = props => {
  const {
    participants,
    pressHandler,
    detail,
    renderDetail = true,
    adminPress = true,
    avatarSize = 40,
  } = props;

  return (
    <View
      style={[
        styles.listContainer,
        detail && { backgroundColor: colors.backgroundGray },
      ]}
    >
      <FlatList
        data={participants}
        keyExtractor={(data, i) => `selected-${data.phone}-${i}`}
        renderItem={({ item, index }) => (
          <Item
            avatarSize={avatarSize}
            item={item}
            index={index}
            pressHandler={() =>
              adminPress && pressHandler && pressHandler(item)
            }
            renderDetail={renderDetail}
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
    backgroundColor: colors.lightGray,
    width: "100%",
    paddingHorizontal: 20,
  },
});

export default SelectedList;
