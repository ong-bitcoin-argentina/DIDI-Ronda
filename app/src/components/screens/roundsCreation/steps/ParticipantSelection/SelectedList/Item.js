import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "native-base";
import Avatar from "../Avatar";
import colors from "../../../../../components/colors";

const Item = props => {
  const { item, pressHandler, detail, renderDetail, avatarSize = 40 } = props;

  const onPress = () => {
    if (pressHandler) return pressHandler(item);
    return undefined;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
        <Avatar
          size={avatarSize}
          path={detail ? item.user.picture : item.thumbnailPath}
        />
        {renderDetail && !detail && !item.admin && (
          <Icon style={styles.closeIcon} name="close" type="MaterialIcons" />
        )}
        <Text style={styles.shiftDesc}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginRight: 20,
  },
  itemContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  closeIcon: {
    position: "absolute",
    color: "white",
    backgroundColor: "#673AB7",
    fontSize: 10,
    borderRadius: 10,
    right: 0,
    top: 10,
    padding: 1,
  },
  shiftButton: {
    alignItems: "center",
    width: "100%",
  },
  shiftContainer: {
    width: 25,
    height: 25,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainBlue,
    padding: 2,
  },
  shiftText: {
    color: "white",
    fontWeight: "bold",
  },
  shiftDesc: {
    fontSize: 10,
    marginTop: 3,
  },
});

export default Item;
