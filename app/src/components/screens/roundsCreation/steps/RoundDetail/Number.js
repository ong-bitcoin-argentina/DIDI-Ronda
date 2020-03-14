import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {Icon} from 'native-base';
import Participants from './SelectParticipants';
import Avatar from '../../../../../assets/img/avatar.jpg';
import colors from '../../../../components/colors';
import {setParticipants} from '../../../../../actions/roundCreation';

var months = [
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SETIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE',
];

const Number = props => {
  const [open, setOpen] = useState(false);
  const [participants, setParticipants] = useState(props.selectedParticipants);
  const date = props.date.getDate();
  const month = months[props.date.getMonth()] || '';
  
  return (
    <View style={[{flexDirection: 'column'}]}>
      <TouchableOpacity
        style={[
          styles.number,
          {zIndex: 10000 - props.index * 10},

          open && styles.numberShadow,
        ]}
        onPress={() => setOpen(!open)}>
        <Image
          source={
            participants.length && participants[0].hasThumbnail
              ? {uri: participants[0].thumbnailPath}
              : Avatar
          }
          style={styles.thumbnail}
        />
        {participants.length > 1 && (
          <Image
            source={
              participants.length && participants[1].hasThumbnail
                ? {uri: participants[1].thumbnailPath}
                : Avatar
            }
            style={styles.thumbnail}
          />
        )}
        <View style={styles.participant}>
          <View style={styles.participantIdentification}>
          <View style={{flexDirection: 'column', justiContent: 'center'}}>

            <Text style={styles.participantName}>{participants.length
                ? participants[0].givenName || participants[0].user.name : '---'}</Text>

            {participants.length > 1 &&
            <Text style={styles.participantName}> 
            { participants[1].givenName || participants[1].user.name }
            </Text>}

            </View>
            {!participants.length &&
              <Text style={styles.participantNumber}>
                {props.detail
                  ? props.shift.status == 'pending'
                    ? ''
                    : props.shift.status == 'current'
                    ? 'En curso'
                    : 'Completada'
                  : 'Participante'}
              </Text>
}
          </View>
        </View>
        <View
          style={{flexDirection: 'column', width: 40, alignItems: 'center'}}>
          <Text style={styles.month}>
            {month.substring(0, 3).toUpperCase()}
          </Text>
          <Icon
            type="FontAwesome5"
            name="calendar"
            style={styles.calendar}></Icon>
          <View style={styles.dateContainer}>
            <Text style={{textAlign: 'center'}}>{date}</Text>
          </View>
        </View>
        <View
          style={{flexDirection: 'column', width: 40, alignItems: 'center'}}>
          <Text style={styles.month}></Text>
          <Icon
            type="MaterialIcons"
            name="edit"
            style={{color: colors.secondary, fontSize: 28}}></Icon>
        </View>
      </TouchableOpacity>
      <Participants
        selectParticipants={p => {
          setOpen(false);
          setParticipants(p);
          props.selectParticipants(p);
        }}
        open={open}
        participants={props.participants}
        selectedParticipants={props.selectedParticipants}></Participants>
    </View>
  );
};

const styles = StyleSheet.create({
  number: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    paddingHorizontal: 20,
    backgroundColor: colors.backgroundGray,
  },
  numberShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.35,

    elevation: 19,
  },
  numberValue: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  bookmark: {
    zIndex: 10,
    color: colors.mainBlue,
    fontSize: 40,
    width: 40,
    padding: 0,
    margin: 0,
  },
  bookmarkContainer: {
    zIndex: 20,
    paddingRight: 20,
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  month: {
    textAlign: 'center',
    paddingRight: 5,
    color: colors.mainBlue,
    fontWeight: 'bold',
  },
  calendar: {
    color: colors.mainBlue,
    fontSize: 35,
    width: 35,
    padding: 0,
    margin: 0,
  },
  dateContainer: {
    paddingRight: 5,
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  participant: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  participantIdentification: {
    flex: 1,
    flexDirection: 'column',
  },
  numberFlag: {
    color: colors.mainBlue,
    marginRight: 15,
    fontSize: 40,
  },
  thumbnail: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  participantName: {
    fontWeight: '500',
    color: colors.gray,
    fontSize: 14,
  },
  participantNumber: {
    color: colors.secondary,
    fontSize: 16,
  },
  contactThumbnailContainer: {flexDirection: 'row', alignItems: 'center'},
  contactThumbnail: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 12,
  },
});

export default Number;
