import React from "react";
import { StyleSheet } from "react-native";
import { Icon, Text, View } from "native-base";
import colors from "../../components/colors";

const styles = StyleSheet.create({
  row: {
    justifyContent: "center",
    backgroundColor: colors.backgroundGray,
    paddingVertical: 5,
    alignContent: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.gray,
    textAlign: "center",
  },
});

const CreationTitle = ({
  title,
  iconName,
  iconType,
  renderCustomTitle = false,
  customIcon,
  renderCustomIcon,
  titleViewStyle = {},
  titleTextStyle = {},
  iconSize = 45,
}) => {
  return (
    <>
      <View style={styles.row}>
        {!renderCustomIcon && (
          <Icon
            name={iconName}
            type={iconType}
            style={{ color: colors.mainBlue, fontSize: iconSize }}
          />
        )}
        {renderCustomIcon && customIcon()}
      </View>
      <View style={{ ...styles.row, paddingBottom: 30, ...titleViewStyle }}>
        {renderCustomTitle ? (
          title
        ) : (
          <Text style={{ ...styles.title, ...titleTextStyle }}>{title}</Text>
        )}
      </View>
    </>
  );
};

export default CreationTitle;
