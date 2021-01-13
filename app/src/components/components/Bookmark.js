import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Icon } from "native-base";
import colors from "./colors";

const Bookmark = props => {
  const {
    number,
    outline,
    bgColor,
    size,
    color,
    bold,
    check,
    bookmarkStyle = {},
  } = props;

  const sizeProp = size || 1;

  const iconFontSize = sizeProp * 70;
  const textLeft = number >= 10 ? sizeProp * 20 : sizeProp * 28;
  const textTop = sizeProp * 14;
  const textFontSize = sizeProp * 26;
  const outlineTextColor = color || colors.mainBlue;

  return (
    <View style={styles.bookmarkContainer}>
      {check && (
        <Icon
          style={styles.checkIcon}
          type="MaterialCommunityIcons"
          name="check-circle"
        />
      )}
      <Icon
        type="MaterialCommunityIcons"
        name={outline ? "bookmark-outline" : "bookmark"}
        style={[
          styles.bookmarkIcon,
          {
            fontSize: outline ? iconFontSize : 40,
            color: bgColor || colors.mainBlue,
            ...bookmarkStyle,
          },
        ]}
      />
      <Text
        style={[
          styles.bookmarkText,
          { color: outline ? outlineTextColor : "white" },
          {
            left: outline ? textLeft : number >= 10 ? 10 : 16,
          },
          { top: outline ? textTop : 7 },
          { fontSize: outline ? textFontSize : 16 },
          bold && { fontWeight: "bold" },
        ]}>
        {number}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // BOOKMARK
  bookmarkContainer: {
    justifyContent: "center",
    backgroundColor: colors.whiteSemiTransparent,
  },
  bookmarkIcon: {
    zIndex: 10,
    padding: 0,
    margin: 0,
    color: colors.mainBlue,
  },
  bookmarkText: {
    position: "absolute",
    zIndex: 100,
    fontWeight: "bold",
  },
  checkIcon: {
    color: colors.mainBlue,
    fontSize: 20,
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 100,
    backgroundColor: "white",
    borderRadius: 50,
  },
});

Bookmark.defaultProps = {
  number: null,
  outline: false,
};

export default Bookmark;
