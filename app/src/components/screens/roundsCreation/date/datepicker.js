import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Item, Input, Icon, Label, Toast} from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import colors from '../../../components/colors';

const DatePicker = props => {
  const [isDateTimePickerVisible, setDatePicker] = useState(false);
  const [date, setDate] = useState(false);

  validateInput = date => {
    let newDate = new Date(date).toISOString();
    let now = new Date().toISOString();

    let validate = newDate > now;

    if (validate) {
      return date;
    } else {
      Toast.show({
        text: 'Debe ser una fecha posterior al dia de hoy.',
        position: 'top',
        type: 'warning',
      });
      return false;
    }
  };
  showDateTimePicker = () => {
    setDatePicker(true);
  };

  hideDateTimePicker = () => {
    setDatePicker(false);
  };

  handleDatePicked = date => {
    let dateVal = this.validateInput(date);
    if (dateVal) {
      let validDate =
        dateVal.getFullYear() +
        '/' +
        (parseInt(dateVal.getMonth()) + 1).toString() +
        '/' +
        dateVal.getDate();
      setDate(validDate);
      console.log(props.title, validDate)
      props.setDate(validDate);
    }
    this.hideDateTimePicker();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={this.showDateTimePicker}>
        <Icon name={props.icon} style={styles.icon}></Icon>
        <Item style={{width: '80%'}} stackedLabel>
          <Label>{props.title}</Label>
          <Input
            onFocus={this.showDateTimePicker}
            value={date ? date : 'DD / MM / AAAA'}
            placeholder="DD / MM / AAAA"
            style={{color: colors.secondary}}
          />
        </Item>
      </TouchableOpacity>
      <DateTimePicker
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
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    color: 'black',
  },

  iconContainer: {flexDirection: 'row', alignItems: 'center'},
  icon: {marginHorizontal: '10%', color: colors.secondary},
});
export default DatePicker;
