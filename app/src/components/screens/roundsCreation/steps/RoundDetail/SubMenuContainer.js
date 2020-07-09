import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../../../components/colors";

const SubMenuContainer = ({ title, children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    backgroundColor: Colors.backgroundGray,
    paddingVertical: 5,
  },
  title: {
    color: Colors.mainBlue,
    fontSize: 12,
    fontWeight: "500",
    margin: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
});

export default SubMenuContainer;
