import React, { useState } from "react";

import { StyleSheet, View, Modal } from "react-native";
import { Icon, Fab, Text, Button } from "native-base";
import { getInset } from "react-native-safe-area-view";
import Colors from "./colors";

const bottomOffset = getInset("bottom");
const bottomTabNavigationHeight = 49;

const FloatingActionButton = props => {
  const [active, setActive] = useState(false);
  const FloatingActionButtonContent = () => (
    <Fab
      active={active}
      direction="up"
      style={{ backgroundColor: active ? Colors.secondary : Colors.yellow }}
      position="bottomRight"
      onPress={() => setActive(!active)}
    >
      <Icon name={active ? "close" : "add"} />

      {active && (
        <View style={styles.subFabView}>
          <Button
            style={[
              { backgroundColor: Colors.mainBlue },
              styles.FabButton,
              { visible: active },
            ]}
            onPress={() => {
              props.clearData();
              props.nav("Create");
              setActive(false);
            }}
          >
            <Icon type="MaterialIcons" name="filter-tilt-shift" />
            <Text uppercase={false} style={[styles.textTitle]}>
              Armar ronda
            </Text>
          </Button>
        </View>
      )}
    </Fab>
  );
  return active ? (
    <Modal animationType="fade" transparent visible={active}>
      <View
        onClick={() => setActive(false)}
        style={{
          flex: 1,
          backgroundColor: Colors.overlayTransparent,
          marginBottom: bottomOffset + bottomTabNavigationHeight,
        }}
      >
        <FloatingActionButtonContent />
      </View>
    </Modal>
  ) : (
    <FloatingActionButtonContent />
  );
};

const styles = StyleSheet.create({
  FabButton: {
    height: 56,
    width: 56,
    borderRadius: 28,
  },
  subFabVieW: {
    flexDirection: "row",
  },
  textTitle: {
    position: "absolute",
    color: "white",
    right: 50,
    fontWeight: "bold",
  },
});

export default FloatingActionButton;
