import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Keyboard} from 'react-native';
import {Item, Input, Icon, Label, Toast} from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import colors from '../../../../components/colors';
const DatePicker = props => {
 const [isDateTimePickerVisible, setDatePicker] = useState(false);
 const [date, setDate] = useState(props.initialValue);
 const [visibleDate, setVisibleDate] = useState(props.initialValue);
 const validateInput = date => {
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
 const showDateTimePicker = () => {
   Keyboard.dismiss();
   setDatePicker(true);
 };
 const hideDateTimePicker = () => {
   setDatePicker(false);
 };
 const handleDatePicked = date => {
   let dateVal = validateInput(date);
   if (dateVal) {
     let validDate =
       dateVal.getFullYear() +
       '/' +
       (parseInt(dateVal.getMonth()) + 1).toString() +
       '/' +
        dateVal.getDate()
       let visibleDate =
       dateVal.getDate() +
       '/' +
       (parseInt(dateVal.getMonth()) + 1).toString() +
       '/' +
       dateVal.getFullYear()
     setDate(validDate);
     setVisibleDate(visibleDate);
     props.setDate(validDate);
   }
   hideDateTimePicker();
 };
 return (
   <View style={styles.container}>
     <TouchableOpacity
       style={styles.iconContainer}
       onPress={ () => showDateTimePicker() } >
       <View style={{marginHorizontal: '10%', backgroundColor: props.icon == 'attach-money' ? colors.secondary : colors.backgroundGray, width: 26, flexDirection: 'row', justifyContent: 'center',alignItems: "center", height: 26, borderRadius: 13}}>
         <Icon
           name={props.icon}
           type={props.type}
           style={
             props.icon == 'attach-money'
               ? { color: 'white', fontSize: 26}
               : styles.icon
           }></Icon>
       </View>
       <Item style={{width: '80%', height: 75,}} stackedLabel>
         <Label>{props.title}</Label>
         <Input
           onFocus={ () => showDateTimePicker() }
           value={visibleDate ? visibleDate : 'DD / MM / AAAA'}
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
 icon: { color: colors.secondary, fontSize: 26},
});
export default DatePicker;