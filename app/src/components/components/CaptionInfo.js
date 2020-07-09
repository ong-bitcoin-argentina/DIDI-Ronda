import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "./colors";

const CaptionInfo = props => {
  const { title, subTitle, children, titleContainerStyle = {} } = props;

  return (
    <View style={styles.container}>
      <View style={{ ...styles.titleContainer, ...titleContainerStyle }}>
        <Text style={styles.textTitle}>{title}</Text>
        {subTitle && <Text style={styles.textSubTitle}>{subTitle}</Text>}
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    borderBottomWidth: 1,
    borderColor: "#8a8a8a",
    paddingVertical: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  textTitle: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
  textSubTitle: {
    color: colors.mainBlue,
    fontSize: 16,
    textAlign: "right",
  },
});

export default CaptionInfo;
