import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Icon } from "native-base";
import colors from "../colors";
import CheckWithCircle from "../icons/CheckWithCircle";

const BlueTile = props => {
  const {
    title,
    amount,
    number,
    paymentDate,
    collectedMoney,
    completedCollection,
  } = props;

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={styles.iconColumn}>
          <Icon
            style={styles.icon}
            type="MaterialIcons"
            name="filter-tilt-shift"
          />
        </View>
        <View style={styles.titleColumn}>
          <Text style={[styles.text, styles.titleText]}>{title}</Text>
        </View>

        <View
          style={{
            ...styles.infoColumn,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Icon style={styles.icon} type="MaterialIcons" name="attach-money" />
          <Text style={[styles.text, styles.amountText]}>{amount}</Text>
        </View>
      </View>
      {collectedMoney && (
        <View style={styles.rowContainer}>
          <View style={styles.iconColumn}>
            <Icon
              style={styles.iconFull}
              type="MaterialCommunityIcons"
              name="basket"
            />
          </View>
          <View style={styles.titleColumn}>
            <Text style={[styles.text, styles.descLightText]}>
              Dinero recolectado
            </Text>
          </View>
          <View
            style={{
              ...styles.infoColumn,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Icon
              style={{ ...styles.icon, fontSize: 20 }}
              type="MaterialIcons"
              name="attach-money"
            />
            <Text style={[styles.text, styles.amountText, { fontSize: 18 }]}>
              {collectedMoney}
            </Text>
            {completedCollection && (
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  marginLeft: 10,
                }}
              >
                <CheckWithCircle />
              </View>
            )}
          </View>
        </View>
      )}
      {number && !collectedMoney && (
        <View style={styles.rowContainer}>
          <View style={styles.iconColumn}>
            <Icon
              style={styles.lightIcon}
              type="MaterialCommunityIcons"
              name="bookmark-outline"
            />
          </View>
          <View style={styles.titleColumn}>
            <Text style={[styles.text, styles.descLightText]}>
              Número asignado
            </Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={[styles.text, styles.descLightText]}>{number}</Text>
          </View>
        </View>
      )}
      {paymentDate && !collectedMoney && (
        <View style={styles.rowContainer}>
          <View style={styles.iconColumn}>
            <Icon
              style={styles.lightIcon}
              type="MaterialCommunityIcons"
              name="calendar-range"
            />
          </View>
          <View style={styles.titleColumn}>
            <Text style={[styles.text, styles.descLightText]}>
              Fecha de Cobro
            </Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={[styles.text, styles.descLightText]}>
              {paymentDate}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBlue,
    borderRadius: 5,
    padding: 20,
    justifyContent: "space-between",
  },
  rowContainer: {
    flexDirection: "row",
    flex: 1,
    marginVertical: 2,
  },
  icon: {
    color: "white",
  },
  iconColumn: {
    flex: 0.15,
  },
  titleColumn: {
    flex: 0.5,
  },
  infoColumn: {
    flex: 0.4,
    alignItems: "flex-end",
  },
  lightIcon: {
    color: "white",
    opacity: 0.8,
    marginLeft: 15,
    fontSize: 20,
  },
  iconFull: {
    color: "white",
    marginLeft: 15,
    fontSize: 20,
  },
  text: {
    color: "white",
  },
  titleText: {
    fontSize: 17,
    marginLeft: 20,
    fontWeight: "bold",
    width: "60%",
  },
  amountText: {
    fontSize: 23,
    fontWeight: "bold",
  },
  descText: {
    fontSize: 12,
  },
  descLightText: {
    fontSize: 13,
    opacity: 0.8,
    marginLeft: 20,
    fontWeight: "bold",
  },
});

export default BlueTile;
