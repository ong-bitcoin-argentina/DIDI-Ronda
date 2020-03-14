import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import ScreenContainer from '../ScreenContainer';
import NextButton from '../../../components/NextButton';
import {Item, Input, Icon, Label, Toast} from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import colors from '../../../components/colors';

class RoundDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
    };
  }
  validateInput = date => {
    let date1 = new Date(date).toISOString();
    let date2 = new Date().toISOString();

    let validate = date1 > date2;

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
    this.setState({isDateTimePickerVisible: true});
  };

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };

  handleDatePicked = date => {
    let dateVal = this.validateInput(date);
    if (dateVal) {
      this.props.setDate(
          dateVal.getDate() +
          '/' +
          (parseInt(dateVal.getMonth()) + 1).toString() +
          '/' +
          dateVal.getFullYear() 
      );
    }
    this.hideDateTimePicker();
  };

  nextStep = () => {
    this.props.navigation.navigate('NumbersAsign');
  };

  render() {
    return (
      <ScreenContainer title="¿Cuando comenzara la ronda?" step={4}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={this.showDateTimePicker}>
            <Icon name={'md-calendar'} style={styles.icon}></Icon>
            <Item style={{width: '80%'}} stackedLabel>
              <Label>Fecha final</Label>
              <Input
                onFocus={this.showDateTimePicker}
                value={
                  this.props.date != '' ? this.props.date : 'DD / MM / AAAA'
                }
                placeholder="DD / MM / AAAA"
                style={{color: colors.secondary}}
              />
            </Item>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
          />
        </View>
        {this.props.date != '' && <NextButton callback={this.nextStep} />}
      </ScreenContainer>
    );
  }
}
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
  icon: {marginHorizontal: '10%'},
});

export default RoundDate;
