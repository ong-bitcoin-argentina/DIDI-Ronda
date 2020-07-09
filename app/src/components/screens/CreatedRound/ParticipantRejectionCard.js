import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Button, Icon } from "native-base";

import { getFormattedDate } from "../../../utils/dates";
import colors from "../../components/colors";

import WarningCardSkeleton from "../../components/WarningCardSkeleton";
import AvatarWithWarning from "../../components/AvatarWithWarning";

const ParticipantRejectionCard = ({
  participantName,
  picturePath,
  replaceParticipant,
  participant,
  show = false,
}) => {
  const [shouldShow, setshouldShow] = useState(show);

  const onClosePress = () => setshouldShow(false);

  const handleOnReplacePress = () => replaceParticipant(participant);

  const expirationBodyText = `${participantName} rechazó tu invitación a la Ronda.`;

  const leftSection = (
    <View style={styles.iconContainer}>
      <AvatarWithWarning path={picturePath} />
    </View>
  );

  const rightSection = (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 0.7 }}>
          <View style={styles.todayTopDateContainer}>
            <Text style={styles.todayDateText}>
              {getFormattedDate(new Date())}
            </Text>
          </View>
          <View style={styles.bodyContainer}>
            <Text style={styles.expirationBodyText}>{expirationBodyText}</Text>
          </View>
          <View
            style={{
              flex: 0.1,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={{ height: 30, justifyContent: "center" }}
              onPress={handleOnReplacePress}
            >
              <Text style={styles.replaceText}>
                Reemplazar a {participantName} &gt;
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 0.3 }}>
          <View style={styles.closeButtonContainer}>
            <Button transparent onPress={onClosePress}>
              <Icon
                type="FontAwesome"
                name="close"
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: colors.mainBlue,
                }}
              />
            </Button>
          </View>
        </View>
      </View>
    </View>
  );

  if (shouldShow)
    return (
      <View style={styles.container}>
        <WarningCardSkeleton
          rightSection={rightSection}
          leftSection={leftSection}
        />
      </View>
    );
  return null;
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  bookmarkStyle: {
    color: "white",
    fontSize: 50,
  },
  expiresText: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: "bold",
    opacity: 0.5,
  },
  expirationBodyText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 8,
    textTransform: "none",
  },
  replaceText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 8,
    color: colors.mainBlue,
  },
  todayDateText: {
    fontSize: 12,
    color: colors.gray,
    opacity: 0.3,
    marginLeft: 8,
  },
  expirationDateText: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.mainBlue,
  },
  todayTopDateContainer: {
    flex: 0.3,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  closeButtonContainer: {
    flex: 0.3,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  expirationDateContainer: {
    flex: 0.7,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginRight: 15,
    marginBottom: 15,
    flexDirection: "column",
  },
  bodyContainer: {
    flex: 0.5,
    flexDirection: "row",
  },
  moneyStyle: {
    color: "white",
    fontSize: 25,
    top: 10,
    left: 14,
  },
  exclamationCircleStyle: {
    height: 20,
    width: 20,
    borderRadius: 20,
    left: 30,
    bottom: 10,
  },
  exclamationStyle: {
    fontSize: 15,
    top: 3,
    left: 7,
    right: 1,
  },
});

export default ParticipantRejectionCard;
