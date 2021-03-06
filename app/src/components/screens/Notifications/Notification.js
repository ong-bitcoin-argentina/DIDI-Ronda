import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { View, Text, Icon } from "native-base";
import colors from "../../components/colors";
import moment from "moment";
import { getIcon, getColor } from "./config";
import store from "../../../store/store";
import { redirectUserToContext } from "../../../services/notifications/pushNotifications";
import { connect } from "react-redux";
import * as roundsActions from "../../../actions/rounds";

const NotificationDetail = props => {
  const { notification, requestRounds, loadRounds } = props;
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { code, body, date, viewedAt, action } = notification;

  const ago = moment(date).fromNow(true);

  const checkIfGoToExistingRonda = () => {
    if (action.routeName === "RoundDetail") {
      for (let i = 0; i < requestRounds.list.length; i++) {
        const round = requestRounds.list[i];
        if (round._id === action.params._id) {
          return true;
        }
      }

      return false;
    }

    return true;
  };

  const onPressNotification = async () => {
    setIsRedirecting(true);
    if (requestRounds.list.length === 0) await loadRounds();
    if (checkIfGoToExistingRonda()) {
      await redirectUserToContext(action, store);
    }
    setIsRedirecting(false);
  };

  return (
    <TouchableOpacity
      onPress={onPressNotification}
      disabled={!action}
      style={{
        ...styles.container,
        backgroundColor: viewedAt ? colors.secondGray : colors.white,
      }}>
      {isRedirecting && (
        <ActivityIndicator
          size="large"
          color={colors.mainBlue}
          style={styles.loading}
        />
      )}

      <View style={styles.imageContainer}>
        <Icon
          type="MaterialIcons"
          name={getIcon(code)}
          style={[styles.icon, { backgroundColor: getColor(code) }]}
        />
      </View>
      <View style={styles.contentContainer}>
        <View>
          <Text
            style={{
              ...styles.body,
              fontWeight: viewedAt ? null : "bold",
              color: viewedAt ? colors.darkestGray : colors.black,
            }}>
            {body}
          </Text>
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
    shadowColor: colors.lightGray,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 6,
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
    color: colors.darkestGray,
    flexShrink: 1,
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    zIndex: 10,
  },
});

const mapStateToPropsList = state => ({
  requestRounds: state.rounds.requestRounds,
});

const mapDispatchToPropsList = dispatch => ({
  loadRounds: () => dispatch(roundsActions.loadRounds()),
});

export default connect(
  mapStateToPropsList,
  mapDispatchToPropsList
)(NotificationDetail);
