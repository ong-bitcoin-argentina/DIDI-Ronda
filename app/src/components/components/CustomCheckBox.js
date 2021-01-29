import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { Icon } from "native-base";
import colors from "./colors";

const CustomCheckBox = ({
  iconChecked = "visibility",
  iconUnchecked = "visibility-off",
  labelChecked = "Participantes visibles",
  labelUnchecked = "Participantes no visibles",
  value = false,
  onValueChange,
}) => {
  const icon = value ? iconChecked : iconUnchecked;
  const label = value ? labelChecked : labelUnchecked;
  const statusColor = value ? colors.mainBlue : colors.darkestGray;

  return (
    <TouchableOpacity
      style={{ ...styles.checkboxContainer, borderColor: statusColor }}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.4}>
      <Icon
        type="MaterialIcons"
        name={icon}
        style={{ ...styles.icon, color: statusColor }}
      />
      <Text
        style={{
          ...styles.label,
          color: statusColor,
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 6,
  },
  icon: {
    alignSelf: "center",
    fontSize: 24,
  },
  label: {
    margin: 8,
    fontSize: 17,
  },
});

export default CustomCheckBox;
