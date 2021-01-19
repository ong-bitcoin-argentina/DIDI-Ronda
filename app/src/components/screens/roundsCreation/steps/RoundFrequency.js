import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Picker, Icon } from "native-base";
import colors from "../../../components/colors";
import ScreenContainer from "../ScreenContainer";
import NextButton from "../../../components/NextButton";
import CreationTitle from "../CreationTitle";

const stepIcon = {
  type: "MaterialIcons",
  name: "access-alarm",
};

const RoundFrequency = props => {
  const { frequency: selectedFreq, navigation } = props;
  const frequencyValues = [
    {
      label: "Mensual",
      value: "m",
    },
    {
      label: "Quincenal",
      value: "q",
    },
    {
      label: "Semanal",
      value: "s",
    },
    {
      label: "Diaria",
      value: "d",
    },
  ];
  const [frequency, setFrequency] = useState(selectedFreq);

  const onValueChange = val => setFrequency(val);

  const navigateToNextStep = () => {
    props.setFrequency(frequency);
    return props.navigation.navigate("RoundTurns");
  };

  return (
    <ScreenContainer navigation={navigation} step={1}>
      <CreationTitle
        title={`¿Cada cuánto tiempo deberán\naportar el dinero?`}
        iconName={stepIcon.name}
        iconType={stepIcon.type}
      />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon type={stepIcon.type} name={stepIcon.name} style={styles.icon} />
          <View style={{ width: "100%" }}>
            <View
              style={{
                width: "65%",
                flexDirection: "row",
              }}>
              <Text style={{ fontSize: 13 }}>Período</Text>
            </View>
            <View
              style={{
                width: "65%",
                flexDirection: "row",
                borderBottomColor: colors.secondary,
                borderBottomWidth: 2,
              }}>
              <Picker
                style={{ marginRight: 0 }}
                textStyle={{ padding: 0 }}
                selectedValue={frequency}
                onValueChange={onValueChange}>
                {frequencyValues.map(f => (
                  <Picker.Item key={f.value} label={f.label} value={f.value} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
        <NextButton callback={navigateToNextStep} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.backgroundGray,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  icon: {
    marginHorizontal: "10%",
    color: "#9B9B9B",
  },
  label: {
    fontSize: 12,
  },
});

export default RoundFrequency;
