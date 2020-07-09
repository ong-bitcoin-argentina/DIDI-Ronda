import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Icon } from "native-base";

import colors from "../colors";
import Avatar from "../Avatar";
import Bookmark from "../Bookmark";
import Calendar from "../Calendar";
import StatusIcon from "./StatusIcon";

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
      ]}
    >
      <View style={styles.container}>
        {number && <Bookmark number={number} bgColor={bmColor()} />}

        <View style={styles.avatarContainer}>
          {avatar && avatar.length > 0 ? (
            avatar.map((path, idx) => (
              <View
                key={`avatar${idx}`}
                style={
                  avatar.length > 1 && {
                    width: "100%",
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: idx % 2 === 0 ? "flex-start" : "flex-end",
                  }
                }
              >
                <View
                  style={{
                    alignSelf: idx % 2 === 0 ? "flex-end" : "flex-start",
                  }}
                >
                  <Avatar
                    path={path}
                    size={avatar.length > 1 ? 60 / avatar.length : null}
                  />
                </View>
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
    width: "100%",
    height: 70,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  // AVATAR
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    paddingLeft: 10,
    paddingRight: 7,
    width: 70,
  },
  // TEXT
  textContainer: {
    flexGrow: 1,
    flexDirection: "column",
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
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  editIcon: {
    color: colors.secondary,
    fontSize: 28,
  },
  // STATUS
  statusContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
    minWidth: 50,
  },
});

Number.defaultProps = {
  number: null,
  avatar: null,
  title: "- - - -",
  subtitle: "- - - -",
  calendar: null,
  edit: null,
  callback: null,
  status: null,
  current: null,
};

export default Number;
