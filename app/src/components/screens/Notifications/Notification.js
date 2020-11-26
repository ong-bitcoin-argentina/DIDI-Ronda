import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text, Icon } from "native-base";
import colors from "../../components/colors";
import moment from "moment";
import { getIcon, getColor } from "./config";
import store from "../../../store/store";
import { redirectUserToContext } from "../../../services/notifications/pushNotifications";

const NotificationDetail = ({ notification }) => {
  const { code, body, date, viewedAt, action } = notification;

  const ago = moment(date).fromNow(true);

  const onPressNotification = () => {
    if (action) {
      redirectUserToContext(action.routeName, action.params, null, store);
    }
  };

  return (
    <TouchableOpacity
      onPress={onPressNotification}
      style={{
        ...styles.container,
        backgroundColor: viewedAt ? colors.lightGray : colors.white,
      }}>
      <View style={styles.imageContainer}>
        <Icon
          type="MaterialIcons"
          name={getIcon(code)}
          style={[styles.icon, { backgroundColor: getColor(code) }]}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.body}>
          <Text stlye={styles.body}>{body}</Text>
        </View>
        <View stlye={{ flexDirection: "row" }}>
          <Text style={styles.time}> {ago}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 6,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 7,
    marginVertical: 7,
  },
  icon: {
    color: colors.white,
    borderRadius: 30,
    padding: 6,
    fontSize: 22,
  },
  imageContainer: {
    width: 70,
    flexDirection: "row",
    justifyContent: "center",
  },
  contentContainer: {
    width: "100%",
    flexShrink: 1,
    paddingRight: 4,
  },
  title: {
    fontWeight: "bold",
    color: colors.gray,
  },
  body: {
    color: colors.gray,
  },
  time: {
    fontWeight: "bold",
    color: colors.darkishGray,
    flexShrink: 1,
  },
});

export default NotificationDetail;
