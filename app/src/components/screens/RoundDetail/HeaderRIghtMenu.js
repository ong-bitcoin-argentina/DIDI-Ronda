import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { Icon } from "native-base";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import colors from "../../components/colors";
import { editFromRoundDetail } from "../../../actions/roundCreation";
import store from "../../../store/store";

const styles = StyleSheet.create({
  optionText: {
    fontSize: 18,
    color: colors.gray,
    margin: 5,
  },
  menuView: {
    height: "100%",
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleStyle: {
    color: "white",
    width: "80%",
    textAlign: "left",
    fontSize: 18,
  },
  colorWhite: {
    color: "white",
  },
});

const HeaderRightMenu = navigation => {
  const currentRoundId = navigation.getParam("_id", null);
  const editRound = () => store.dispatch(editFromRoundDetail(currentRoundId));

  return (
    <Menu>
      <MenuTrigger>
        <View style={styles.menuView}>
          <Icon name="md-more" style={styles.colorWhite} />
        </View>
      </MenuTrigger>
      <MenuOptions optionsContainerStyle={{ margin: 5 }}>
        <MenuOption style={{ marginRight: 5 }} onSelect={editRound}>
          <Text style={styles.optionText}>Editar</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

export default HeaderRightMenu;
