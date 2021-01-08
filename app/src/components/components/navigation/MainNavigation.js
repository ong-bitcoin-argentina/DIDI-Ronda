import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "../../screens/Home";
import LogoCleaned from "../../../assets/img/logo-clean-white";
import { View, Text, StyleSheet } from "react-native";
import colors from "../colors";

export default createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerStyle: {
          backgroundColor: colors.mainBlue,
          height: 76,
        },
        headerTitle: (
          <View style={styles.titleContainer}>
            <LogoCleaned />
            <Text style={styles.title}>{params.title}</Text>
          </View>
        ),
      };
    },
  },
});

const styles = StyleSheet.create({
  titleContainer: {
    paddingLeft: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    width: "80%",
    textAlign: "left",
    fontSize: 18,
    marginLeft: 15,
  },
});
