import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Icon} from 'native-base';

import colors from '../colors';
import Avatar from '../Avatar';
import Bookmark from '../Bookmark';
import Calendar from '../Calendar';
import Draw from '../../../assets/img/draw.svg';
import StatusIcon from './StatusIcon';

const Number = props => {
  const {
    number,
    avatar,
    title,
    subtitle,
    calendar,
    edit,
    callback,
    status,
    draw,
    current,
  } = props;

  const bmColor = () => {
    if (current === null) {
      return colors.mainBlue;
    } else {
      if (current) {
        return colors.mainBlue;
      } else {
        return colors.iconDisabled;
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={callback}
      style={[
        styles.touchContainer,
        current && {
          backgroundColor: colors.lightGray,
          borderLeftColor: colors.mainBlue,
          borderLeftWidth: 4,
        },
      ]}>
      <View style={styles.container}>
        {number && <Bookmark number={number} bgColor={bmColor()} />}

        <View style={styles.avatarContainer}>
          {draw ? (
            <Draw width={40} height={40} />
          ) : avatar && avatar.length > 0 ? (
            avatar.map((avatar, idx) => (
              <View
                key={`avatar${idx}`}
                style={
                  idx > 0 && {
                    marginLeft: -30,
                    borderLeftWidth: 1,
                    borderColor: '#fff',
                    borderRadius: 100,
                  }
                }>
                <Avatar path={avatar} />
              </View>
            ))
          ) : (
            <Avatar />
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.titleText}>
            {title || Number.defaultProps.title}
          </Text>
          <Text style={styles.subtitleText}>
            {subtitle || Number.defaultProps.title}
          </Text>
        </View>

        {calendar && <Calendar day={calendar.day} month={calendar.month} />}

        {edit && (
          <View style={styles.editContainer}>
            <Icon style={styles.editIcon} type="MaterialIcons" name="edit" />
          </View>
        )}

        {status && (
          <View style={styles.statusContainer}>
            <StatusIcon status={status} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // TOUCH CONTAINER
  touchContainer: {
    paddingHorizontal: 15,
  },
  // CONTAINER
  container: {
    width: '100%',
    height: 70,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // AVATAR
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 7,
  },
  // TEXT
  textContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    paddingLeft: 10,
  },
  titleText: {
    fontSize: 14,
  },
  subtitleText: {
    fontSize: 12,
    color: colors.secondary,
  },
  // EDIT
  editContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  editIcon: {
    color: colors.secondary,
    fontSize: 28,
  },
  // STATUS
  statusContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    minWidth: 50,
  },
});

Number.defaultProps = {
  number: null,
  avatar: null,
  title: '- - - -',
  subtitle: '- - - -',
  calendar: null,
  edit: null,
  callback: null,
  status: null,
  draw: false,
  current: null,
};

export default Number;
