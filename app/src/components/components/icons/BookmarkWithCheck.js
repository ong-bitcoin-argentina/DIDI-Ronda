import React from "react";
import { View, StyleSheet } from "react-native";
import { Icon } from "native-base";
import colors from "../colors";

const BookmarkWithCheck = ({ iconStyle = {} }) => {
  // Props

  return (
    <View>
      <View style={[styles.iconContainer]}>
        <Icon
          type="MaterialIcons"
          name="check"
          style={{ ...styles.icon, ...iconStyle, ...styles.check }}
        />
      </View>

      <Icon
        type="MaterialCommunityIcons"
        name="bookmark-outline"
        style={{ ...styles.icon, ...iconStyle }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 25,
    width: 25,
    height: 25,
    backgroundColor: colors.green,
    position: "absolute",
    zIndex: 1,
    top: -3,
    left: 34,
  },
  check: {
    position: "absolute",
    color: "white",
    zIndex: 2,
    top: 1,
    left: 3,
    fontSize: 20,
  },
  icon: {
    fontSize: 50,
    color: colors.mainBlue,
  },
});

export default BookmarkWithCheck;
