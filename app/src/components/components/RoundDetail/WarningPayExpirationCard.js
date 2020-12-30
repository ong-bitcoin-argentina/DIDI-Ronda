import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Icon } from "native-base";
import colors from "../colors";
import { getFormattedDate } from "../../../utils/dates";
import WarningCardSkeleton from "../WarningCardSkeleton";
import BookmarkMoneyWithExclamation from "../icons/BookmarkMoneyWithExclamation";

const WarningPayExpirationCard = ({
  roundName,
  number,
  expirationDate,
  show = false,
}) => {
  const [shouldShow, setshouldShow] = useState(show);

  const onClosePress = () => setshouldShow(false);

  const expirationBodyText = `Pronto vence tu aporte al número ${number} de la ronda ${roundName}`;

  const leftSection = (
    <View style={styles.iconContainer}>
      <BookmarkMoneyWithExclamation
        bookmarkStyle={styles.bookmarkStyle}
        moneyStyle={styles.moneyStyle}
        exclamationCircleStyle={styles.exclamationCircleStyle}
        exclamationStyle={styles.exclamationStyle}
      />
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
          <View style={styles.expirationDateContainer}>
            <Text style={styles.expiresText}>Vence</Text>
            <Text style={styles.expirationDateText}>{expirationDate}</Text>
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
    marginBottom: 15,
    width: "100%",
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
    flex: 0.2,
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
    flex: 0.7,
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

export default WarningPayExpirationCard;
