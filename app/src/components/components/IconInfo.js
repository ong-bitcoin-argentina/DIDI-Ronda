import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Icon } from "native-base";
import colors from "./colors";

const IconInfo = props => {
  const { icon, title, subtitle, subtitleStyle = {}, titleStyle = {} } = props;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon style={styles.icon} type="MaterialCommunityIcons" name={icon} />
      </View>

      <View style={styles.textContainer}>
        <Text style={{ ...styles.textTitle, ...titleStyle }}>{title}</Text>
        {subtitle && (
          <Text style={{ ...styles.textSubTitle, ...subtitleStyle }}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "center",
  },
  iconContainer: {},
  textContainer: {
    paddingLeft: 10,
    minWidth: 80,
  },
  textTitle: {
    color: "#000",
    fontSize: 13,
    fontWeight: "normal",
  },
  textSubTitle: {
    color: "#8a8a8a",
    fontSize: 12,
  },
  icon: {
    color: colors.mainBlue,
  },
});

export default IconInfo;
