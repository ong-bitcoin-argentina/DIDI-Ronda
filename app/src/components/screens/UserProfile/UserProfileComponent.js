import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { View, Text } from "native-base";
import colors from "../../components/colors";
import UserData from "./UserData";
import Avatar from "../../components/Avatar";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const avatarSize = SCREEN_HEIGHT / 8;

const UserProfile = props => {
  const { participant, children } = props;

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View
          style={{
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: 15,
          }}
        >
          <Avatar path={participant.user.picture} size={avatarSize} />
          <Text style={styles.profileName}>@{participant.user.name}</Text>
        </View>
        <UserData
          SCREEN_HEIGHT={SCREEN_HEIGHT}
          username={participant.user.username}
        />
      </View>
      <View style={styles.profileContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundGray,
  },
  avatarContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.secondaryBackground,
    width: "100%",
  },
  profileContainer: {
    flex: 1,
  },
  profileName: {
    marginTop: 5,
    color: colors.secondary,
    fontWeight: "bold",
  },
  separator: {
    borderStyle: "dotted",
    borderWidth: 1,
    borderRadius: 1,
  },
  userData: {
    marginTop: 5,
    flex: 1,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 5,
    overflow: "hidden",
  },
  userDataInfo: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    borderStyle: "dashed",
    borderColor: colors.secondary,
  },
  userDataInfoValue: {
    color: "#000",
    fontSize: 17,
    fontWeight: "bold",
  },
  userDataInfoText: {
    color: colors.secondary,
    fontSize: 14,
    textAlign: "center",
  },
  userDataInfoIcon: {
    color: colors.mainBlue,
    marginBottom: 5,
  },
});

export default UserProfile;
