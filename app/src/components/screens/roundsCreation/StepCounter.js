import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "native-base";
import colors from "../../components/colors";

const StepCounter = ({ currentStep, totalSteps, navigation }) => {
  const stepItems = [
    {
      type: "MaterialIcons",
      name: "format-color-text",
    },
    {
      type: "MaterialIcons",
      name: "access-alarm",
    },
    {
      type: "MaterialIcons",
      name: "settings",
    },
    {
      type: "MaterialIcons",
      name: "person-outline",
    },
  ];

  const widthStep = `${90 / totalSteps}%`;

  const backgroundColorStep = stepNum =>
    stepNum < currentStep ? colors.mainBlue : colors.secondary;

  const onPressItem = step => {
    // We go back the needed screens to the step
    if (!navigation) return null;
    const targetStep = stepItems.findIndex(e => e.name === step.name) + 1;
    if (targetStep > currentStep) return null;
    const routesToPop = currentStep - targetStep;
    return navigation.pop(routesToPop);
  };

  return (
    <View style={styles.stepCounterContainer}>
      {stepItems.map((s, i) => (
        <TouchableOpacity
          // eslint-disable-next-line react/no-array-index-key
          onPress={() => onPressItem(s)}
          // The order doesn't change and we always have 7 elements
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          style={{
            ...styles.iconContainer,
            borderBottomColor: backgroundColorStep(i),
            width: widthStep,
          }}>
          <Icon
            name={s.name}
            style={{ color: backgroundColorStep(i), fontSize: 18 }}
            type={s.type}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  stepCounterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    backgroundColor: colors.backgroundGray,
  },
  stepCounter: {
    height: 3,
    flexDirection: "row",
  },
  stepCounterOn: {
    backgroundColor: colors.mainBlue,
  },
  stepCounterOff: {
    backgroundColor: colors.secondary,
  },
  iconContainer: {
    marginHorizontal: 2,
    borderBottomWidth: 5,
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StepCounter;
