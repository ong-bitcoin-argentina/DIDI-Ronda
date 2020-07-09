import React from "react";
import { StyleSheet } from "react-native";
import { Button, Text } from "native-base";
import colors from "../colors";

const CallToAction = props => {
  const { title, pressHandler, disabled } = props;

  return (
    <Button
      onPress={() => pressHandler && pressHandler()}
      style={styles.button}
      disabled={disabled}
    >
      <Text uppercase={false} style={styles.text}>
        {title}
      </Text>
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.mainBlue,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  text: {
    color: "white",
    textAlign: "center",
    flex: 1,
  },
});

export default CallToAction;
