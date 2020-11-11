import React from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { Icon } from "native-base";
import colors from "../../../components/colors";
import { logOut } from "../../../../utils/utils";

const Option = ({ icon, label, style, onPress }) => (
  <TouchableHighlight
    style={[styles.row, style]}
    onPress={onPress}
    underlayColor={colors.lighterGray}>
    <>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon type="MaterialIcons" name={icon} style={styles.leftIcon} />
        <Text style={styles.text}>{label}</Text>
      </View>
      <Icon
        type="MaterialIcons"
        name="chevron-right"
        style={styles.rightIcon}
      />
    </>
  </TouchableHighlight>
);

const Settings = ({ navigation }) => {
  const goToAboutAidi = () => {
    navigation.push("AboutAidi");
  };
  const goToAboutRonda = () => {
    navigation.push("AboutRonda");
  };
  return (
    <View style={styles.container}>
      <Option icon="info" label="Acerca de ai·di" onPress={goToAboutAidi} />
      <Option
        icon="filter-tilt-shift"
        label="Acerca de ronda"
        onPress={goToAboutRonda}
      />
      <Option
        icon="exit-to-app"
        label="Cerrar Sesión"
        onPress={logOut}
        style={styles.lastButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 30,
  },
  leftIcon: {
    color: colors.gray,
    marginRight: 14,
  },
  rightIcon: {
    color: colors.darkestGray,
  },
  lastButton: {
    paddingTop: 30,
    borderTopColor: "black",
    borderTopWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    backgroundColor: colors.whiteTransparent,
    paddingVertical: 18,
    padding: 8,
  },
  text: {
    fontSize: 18,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Settings;
