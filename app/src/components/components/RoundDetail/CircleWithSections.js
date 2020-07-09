import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import colors from "../colors";

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
  totalNumbers: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 25,
    color: "black",
  },
  subtitleOfNumbers: {
    textAlign: "center",
    fontSize: 12,
    color: "black",
  },
});

const CircleOfNumbers = ({
  currentNumber = 100,
  maxNumber = 100,
  showDetailOfNumbers = false,
}) => {
  const valuePerNumber = 100 / maxNumber;
  const maxFill = valuePerNumber * currentNumber;

  const renderInnerText = () => {
    if (!showDetailOfNumbers)
      return (
        <View>
          <Text style={styles.title}>Números</Text>
          <Text style={styles.totalNumbers}>{maxNumber}</Text>
        </View>
      );
    return (
      <View>
        <Text style={styles.title}>Números</Text>
        <Text style={{ ...styles.totalNumbers, color: colors.mainBlue }}>
          {currentNumber}
        </Text>
        <Text style={styles.subtitleOfNumbers}>en Ronda</Text>
      </View>
    );
  };
  return (
    <AnimatedCircularProgress
      size={125}
      width={15}
      rotation={0}
      fill={maxFill}
      backgroundColor={colors.darkishGray}
      tintColor={colors.mainBlue}
    >
      {() => renderInnerText()}
    </AnimatedCircularProgress>
  );
};

export default CircleOfNumbers;
