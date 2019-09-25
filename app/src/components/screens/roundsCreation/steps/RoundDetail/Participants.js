//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import SubMenuContainer from './SubMenuContainer';
import Number from './Number';
import colors from '../../../../components/colors';

// create a component
class Participants extends Component {
  calculateDates(date, frequency, numbers) {
    let dates = [];
    var nextDate = new Date(date.valueOf());

    const preParticipantsOnThisNumber = this.props.participants.filter(
      p => p.number.includes(1),
    );
    
    const auxNextDate = new Date(nextDate.valueOf());
    dates.push({
      date: auxNextDate,
      selectedParticipants: preParticipantsOnThisNumber,
    });

    for (let i = 1; i < numbers; i++) {
      if (frequency == 30) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else {
        nextDate.setDate(nextDate.getDate() + frequency);
      }
      const participantsOnThisNumber = this.props.participants.filter(
        p => p.number.includes(i + 1),
      );
      const auxNextDate = new Date(nextDate.valueOf());
      dates.push({
        date: auxNextDate,
        selectedParticipants: participantsOnThisNumber,
      });
    }
    return dates;
  }
  render() {
    let startDate = this.props.date;
    let frequency = 7;
    switch (this.props.frequency) {
      case 'm':
        frequency = 30;
        break;
      case 's':
        frequency = 7;
        break;
      case 'q':
        frequency = 15;
        break;
      default:
        frequency = 1;
    }
    const dates = this.calculateDates(
      startDate,
      frequency,
      this.props.participantsQty,
    );

    return (
      <SubMenuContainer title="Participantes">
        <View style={{flexDirection: 'row-reverse', paddingHorizontal: 20}}>
          <Text style={styles.rowTitles}>Editar</Text>

          <Text style={styles.rowTitles}>Fecha cobro</Text>
        </View>
        <View style={{width: '100%'}}>
          <FlatList
            data={dates}
            scrollEnabled={false}
            renderItem={data => {
              return (
                <Number
                  selectParticipants={participants =>
                    this.props.selectParticipants(participants, data.index + 1)
                  }
                  index={3}
                  date={data.item.date}
                  participants={this.props.participants}
                  selectedParticipants={
                    data.item.selectedParticipants
                  }></Number>
              );
            }}></FlatList>
        </View>
      </SubMenuContainer>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  rowTitles: {
    width: 40,
    paddingBottom: 10,
    color: colors.secondary,
    fontWeight: '500',
    fontSize: 11,
  },
});

//make this component available to the app
export default Participants;
