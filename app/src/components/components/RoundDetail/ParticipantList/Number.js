import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "native-base";
import Avatar from "../../Avatar";
import colors from "../../colors";
import ExclamationIcon from "../../ExclamationIcon";
import MoneyIcon from "../../MoneyIcon";
import Bookmark from "../../Bookmark";
import { dateFormat, amountFormat } from "../../../../utils/utils";

const Component = props => {
  // Props
  const {
    onPress,
    picture,
    name,
    amountPerShift,
    shiftsQty,
    userPay,
    active,
    number,
  } = props;

  // Mount
  useEffect(() => {}, []);

  // Render
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.itemContainer,
        borderWidth: active ? 2 : 0,
        borderColor: colors.mainBlue,
      }}
    >
      <View style={styles.participantContainer}>
        <View style={styles.bookmarkContainer}>
          <Bookmark
            bookmarkStyle={{
              color: active ? colors.mainBlue : colors.darkishGray,
            }}
            bold
            size={0.6}
            number={number}
            color="#333"
          />
        </View>

        <View style={styles.avatarContainer}>
          <Avatar path={picture} />
        </View>
        <View style={styles.participantData}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.date}>{userPay && dateFormat(userPay.date)}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.iconStatusContainer}>
          {userPay ? <MoneyIcon /> : <ExclamationIcon />}
          <Text style={styles.statusText}>
            {userPay
              ? `$ ${amountFormat(amountPerShift * shiftsQty)}`
              : "Pendiente"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    backgroundColor: "white",
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: colors.mainBlue,
  },
  participantContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  hashContainer: {
    position: "absolute",
    right: -5,
    top: -5,
    width: 18,
    height: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainBlue,
  },
  hashText: {
    color: "white",
    fontSize: 12,
  },
  participantData: {
    marginLeft: 10,
  },
  name: {
    fontWeight: "bold",
  },
  date: {
    color: colors.secondary,
    fontSize: 12,
  },
  infoContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  iconStatusContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
  },
  bookmarkContainer: {
    marginRight: 25,
  },
  iconContainer: {
    marginBottom: 8,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  pendentIcon: {
    color: "white",
    fontSize: 18,
  },
  notPendentIcon: {
    color: "black",
    fontSize: 18,
  },
  statusText: {
    fontSize: 11,
    marginTop: 5,
  },
});

export default Component;
