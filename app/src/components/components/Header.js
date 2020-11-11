import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Icon, Button } from "native-base";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import colors from "./colors";
import { logOut } from "../../utils/utils";

const Dropdown = ({ children }) => (
  <Menu>
    <MenuTrigger>
      <View style={styles.menuView}>
        <Icon name="md-more" style={styles.colorWhite} />
      </View>
    </MenuTrigger>
    <MenuOptions optionsContainerStyle={{ marginTop: 10 }}>
      {children}
    </MenuOptions>
  </Menu>
);

const Option = ({ label, icon, onSelect }) => (
  <MenuOption onSelect={onSelect} style={styles.option}>
    <Icon name={icon} type="MaterialIcons" style={styles.optionIcon} />
    <Text style={styles.optionText}>{label}</Text>
  </MenuOption>
);

export const BackButton = ({ navigation }) => {
  return (
    <Button transparent onPress={() => navigation.goBack()}>
      <Icon style={styles.colorWhite} name="arrow-back" />
    </Button>
  );
};

export const SessionDropdown = () => {
  return (
    <Dropdown>
      <Option icon="exit-to-app" label="Cerrar Sesión" onSelect={logOut} />
    </Dropdown>
  );
};

export const ConfigIcon = props => {
  const goToSettings = () => {
    props.navigation.push("Settings");
  };

  return (
    <Icon
      style={{ ...styles.colorWhite, marginRight: 20 }}
      name="settings"
      onPress={goToSettings}
    />
  );
};

const styles = StyleSheet.create({
  optionText: {
    fontSize: 18,
    color: colors.gray,
  },
  menuView: {
    height: "100%",
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  colorWhite: {
    color: "white",
  },
  option: {
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
  },
  optionIcon: {
    color: colors.darkestGray,
    marginRight: 8,
  },
});
