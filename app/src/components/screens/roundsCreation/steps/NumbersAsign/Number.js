import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {Icon} from 'native-base';
import Participants from './Participants';
import Avatar from '../../../../../assets/img/avatar.png';
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
  const [participants, setParticipants] = useState(
    props.selectedParticipants
      ? props.participants.filter(p => {
          return props.selectedParticipants.includes(p._id);
        })
      : [],
  );
  const date = props.detail
    ? new Date(props.shift.limitDate).getDate()
    : props.date.item.getDate();
  const month = props.detail
    ? months[new Date(props.shift.limitDate).getMonth()]
    : months[props.date.item.getMonth()] || '';

  return (
    <View style={[{flexDirection: 'column'}]}>
      <TouchableOpacity
        style={[
          styles.number,
          props.detail &&
            props.shift.status === 'current' &&
            styles.currentNumber,
          {zIndex: 10000 - props.index * 10},
          open && styles.numberShadow,
        ]}
        onPress={
          props.shift
            ? props.shift.status == 'current' ||
              props.shift.status == 'completed'
              ? props.detail
                ? e => {
                    props.callback(props.shift._id);
                  }
                : () => {
                    setOpen(!open);
                  }
              : () => {}
            : () => {
                setOpen(!open);
              }
        }>
        <View
          style={{flexDirection: 'column', width: 40, alignItems: 'center'}}>
          <View style={styles.bookmarkContainer}>
            <Text style={styles.numberValue}>{props.index + 1}</Text>
          </View>
          <Icon
            name={'bookmark'}
            style={[
              props.detail
                ? props.shift.status === 'current'
                  ? styles.bookmark
                  : styles.secondaryBookmark
                : styles.bookmark,
            ]}
          />
        </View>
        <View style={{width: 60, height: 40}}>
          <Image
            source={
              props.detail
                ? participants.length
                  ? {uri: participants[0].user.picture}
                  : Avatar
                : participants.length && participants[0].hasThumbnail
                ? {uri: participants[0].thumbnailPath}
                : Avatar
            }
            style={styles.thumbnail}
          />
          {participants.length > 1 && (
            <Image
              source={
                props.detail
                  ? participants.length
                    ? {uri: participants[1].user.picture}
                    : Avatar
                  : participants.length && participants[1].hasThumbnail
                  ? {uri: participants[1].thumbnailPath}
                  : Avatar
              }
              style={[styles.thumbnail, {marginLeft: 10}]}
            />
          )}
        </View>

        <View style={styles.participant}>
          <View style={styles.participantIdentification}>
            <Text style={styles.participantName}>
              {participants.length
                ? participants[0].givenName ||
                  participants[0].user.name +
                    (participants.length > 1
                      ? ` / ${participants[1].givenName ||
                          participants[1].user.name}`
                      : '')
                : props.detail ? '---' : 'Seleccionar'}
            </Text>
            <Text style={styles.participantNumber}>
              {props.detail ? props.shift.status == 'pending'
                ? '' 
                :  props.shift.status == 'current' ? 'En curso' : 'Completada' : 'Participante'}
            </Text>
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
        {props.detail === true &&
          (props.shift.status === 'completed' ? (
            <View
              style={{
                flexDirection: 'column',
                width: 60,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon
                type="MaterialIcons"
                name="check-circle"
                style={styles.check}></Icon>
            </View>
          ) : props.shift.status == 'current' ? (
            <View
              style={{
                flexDirection: 'row',
                width: 60,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text>
                <Icon
                  type="MaterialIcons"
                  name="attach-money"
                  style={{fontSize: 14, color: colors.mainBlue}}></Icon>
                {Math.ceil(
                  (props.amount) * props.shift.pays.length,
                )}
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'column',
                width: 60,
                alignItems: 'center',
                justifyContent: 'center',
              }}></View>
          ))}
      </TouchableOpacity>
      {!props.detail && (
        <Participants
          selectParticipants={p => {
            setOpen(false);
            setParticipants(p);
            props.selectParticipants(p);
          }}
          open={open}
          participants={props.participants}></Participants>
      )}
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
    width: '100%',
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
  secondaryBookmark: {
    zIndex: 10,
    color: colors.secondary,
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
    fontSize: 40,
    width: 40,
    padding: 0,
    margin: 0,
  },
  check: {
    color: colors.mainBlue,
    fontSize: 30,
    width: 30,
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
    position: 'absolute',
    borderColor: 'white',
    borderWidth: 1,
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  participantName: {
    fontWeight: 'bold',
    color: colors.gray,
    fontSize: 16,
  },
  participantNumber: {
    color: colors.secondary,
    fontSize: 14,
  },
  contactThumbnailContainer: {flexDirection: 'row', alignItems: 'center'},
  contactThumbnail: {
    height: 46,
    width: 46,
    borderRadius: 23,
    marginRight: 12,
  },
  currentNumber: {
    backgroundColor: colors.lightGray,
  },
});

export default Number;
