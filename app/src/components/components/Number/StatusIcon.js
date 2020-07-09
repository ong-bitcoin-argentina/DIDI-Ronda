import React from "react";
import { View, StyleSheet } from "react-native";
import { Icon } from "native-base";

import colors from "../colors";

const StatusIcon = props => {
  const { status } = props;

  return (
    <React.Fragment>
      {status === "draw" && (
        <View
          style={[
            styles.circleContainer,
            { backgroundColor: colors.yellowStatus },
          ]}
        >
          <Icon type="MaterialIcons" name="replay" style={styles.icon} />
        </View>
      )}

      {status === "completed" && (
        <Icon
          type="MaterialIcons"
          name="check-circle"
          style={[styles.icon, { color: colors.mainBlue }]}
        />
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  // ICONS
  icon: {
    color: "#4A4A4A",
    fontSize: 20,
  },
  // CIRCLE CONTAINER
  circleContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 100,
    padding: 0,
  },
});

export default StatusIcon;
