import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Item, Input, Icon, Label, Toast } from "native-base";
import DateTimePicker from "react-native-modal-datetime-picker";
import colors from "../../../../components/colors";

const DatePicker = props => {
  const { initialValue, icon, type, title, startDate } = props;
  const [isDateTimePickerVisible, setDatePicker] = useState(false);
  const [visibleDate, setVisibleDate] = useState(initialValue);

  const validateInput = inputDate => {
    const newDate = new Date(inputDate).toISOString();
    const now = new Date().toISOString();
    const validate = newDate > now;
    if (validate) {
      return inputDate;
    }
    Toast.show({
      text: "Debe ser una fecha posterior al dia de hoy.",
      position: "top",
      type: "warning",
    });
    return false;
  };

  const showDateTimePicker = () => setDatePicker(true);

  const hideDateTimePicker = () => setDatePicker(false);

  const handleDatePicked = date => {
    const dateVal = validateInput(date);
    if (dateVal) {
      const validDate = `${dateVal.getFullYear()}/${(
        parseInt(dateVal.getMonth(), 10) + 1
      ).toString()}/${dateVal.getDate()}`;
      const visibleDateValue = `${dateVal.getDate()}/${(
        parseInt(dateVal.getMonth(), 10) + 1
      ).toString()}/${dateVal.getFullYear()}`;

      setVisibleDate(visibleDateValue);
      props.setDate(validDate);
    }
    hideDateTimePicker();
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => showDateTimePicker()}
      >
        <View
          style={{
            marginHorizontal: "10%",
            backgroundColor:
              icon === "attach-money"
                ? colors.secondary
                : colors.backgroundGray,
            width: 26,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: 26,
            borderRadius: 13,
          }}
        >
          <Icon
            name={icon}
            type={type}
            style={
              icon === "attach-money"
                ? { color: "white", fontSize: 26 }
                : styles.icon
            }
          />
        </View>
        <TouchableWithoutFeedback onPress={showDateTimePicker}>
          <View pointerEvents="none">
            <Item style={{ width: "80%", height: 75 }} stackedLabel>
              <Label style={styles.label}>{title}</Label>
              <Input
                value={visibleDate || "DD / MM / AAAA"}
                placeholder={visibleDate || "DD / MM / AAAA"}
                style={{ color: colors.secondary }}
              />
            </Item>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
      <DateTimePicker
        date={startDate ? new Date(startDate) : new Date()}
        isVisible={isDateTimePickerVisible}
        onConfirm={handleDatePicked}
        onCancel={hideDateTimePicker}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundGray,
    flex: 1,
  },
  placeholderText: {
    color: colors.lightGray,
  },
  text: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    color: "black",
  },
  iconContainer: { flexDirection: "row", alignItems: "center" },
  icon: { color: colors.secondary, fontSize: 26 },
  label: { fontSize: 12 },
});
export default DatePicker;
