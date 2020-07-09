import React from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import colors from "../../components/colors";
import StepCounter from "./StepCounter";

const ScreenContainer = props => {
  const { step, children, navigation } = props;
  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior="padding"
      enabled
    >
      <View style={styles.screenContainer}>
        <StepCounter
          navigation={navigation}
          totalSteps={7}
          currentStep={step + 1}
        />
        {children}
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  screenContainer: {
    flexDirection: "column",
    flex: 1,
  },
  titleContainer: {
    flex: 0.2,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundGray,
  },
  title: {
    paddingHorizontal: 20,
    color: colors.gray,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ScreenContainer;
