import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createSwitchNavigator } from "react-navigation";
import RoundCreation from "../roundsCreation/RoundCreation";
import RoundsList from "./RoundsList";
import RoundDetail from "../RoundDetail";
import NumberDetail from "../NumberDetail";
import NumberPay from "../NumberDetail/NumberPay";
import UserProfile from "../UserProfile";
import HeaderRightMenu from "../RoundDetail/HeaderRIghtMenu";
import { SessionDropdown, BackButton } from "../../components/Header";
import { StyleSheet } from "react-native";
import colors from "../../components/colors";

const styles = StyleSheet.create({
  headerTitleStyle: {
    color: "white",
    width: "80%",
    textAlign: "left",
    fontSize: 18,
  },
  colorWhite: {
    color: colors.white,
  },
});

const List = createStackNavigator({
  List: {
    screen: RoundsList,
    navigationOptions: ({ navigation }) => ({
      headerBackTitle: null,
      headerBackStyle: styles.colorWhite,
      title: `Ronda`,
      headerStyle: { backgroundColor: "#417fd7", elevation: 0 },
      headerTitleStyle: styles.headerTitleStyle,
    }),
  },
  NumberDetail: {
    screen: NumberDetail,
    navigationOptions: () => ({
      headerBackTitle: null,
      headerBackStyle: styles.colorWhite,
      title: `Número`,
      headerTintColor: "white",
      headerStyle: { backgroundColor: "#417fd7" },
      headerTitleStyle: styles.headerTitleStyle,
      headerRight: <SessionDropdown />,
    }),
  },
  NumberPay: {
    screen: NumberPay,
    navigationOptions: () => ({
      headerBackTitle: null,
      headerBackStyle: styles.colorWhite,
      title: `Pagar`,
      headerTintColor: "white",
      headerStyle: { backgroundColor: "#417fd7" },
      headerTitleStyle: styles.headerTitleStyle,
      headerRight: <SessionDropdown />,
    }),
  },
  RoundDetail: {
    screen: RoundDetail,
    navigationOptions: ({ navigation }) => ({
      headerBackTitle: null,
      headerBackStyle: styles.colorWhite,
      headerTintColor: "white",
      title: `Mis Rondas`,
      headerStyle: { backgroundColor: "#417fd7" },
      headerTitleStyle: styles.headerTitleStyle,
      headerLeft: <BackButton navigation={navigation} />,
      headerRight: HeaderRightMenu(navigation),
    }),
  },
  UserProfile: {
    screen: UserProfile,
    navigationOptions: ({ navigation }) => ({
      title: `Participante`,
      headerStyle: { backgroundColor: "#417fd7" },
      headerTitleStyle: styles.headerTitleStyle,
      headerLeft: <BackButton navigation={navigation} />,
    }),
  },
});

export default createSwitchNavigator(
  {
    List: {
      screen: List,
    },
    Create: {
      screen: RoundCreation,
    },
    headerMode: "none",
  },
  {
    backBehavior: "initialRoute",
    initialRouteName: "List",
  },
);
