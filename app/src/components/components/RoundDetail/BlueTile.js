import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Icon } from "native-base";
import colors from "../colors";
import CheckWithCircle from "../icons/CheckWithCircle";
import TileRow from "./TileRow";
import BaseDrawModal from "./BaseDrawModal";
import {
  ASSIGNMENT_MODES,
  ASSIGNMENT_MODES_NORMALIZED,
} from "../../../utils/constants";

const BlueTile = props => {
  const {
    title,
    amount,
    round,
    number,
    paymentDate,
    collectedMoney,
    completedCollection,
  } = props;

  const [showDraw, setShowDraw] = useState(false);

  const toggleDrawModal = () => setShowDraw(!showDraw);

  const myShift = round.shifts.find(item => item.number === number);
  const assignmentMode = myShift?.assignmentMode;
  const normalizedMode = ASSIGNMENT_MODES_NORMALIZED[assignmentMode];
  const isLottery = assignmentMode === ASSIGNMENT_MODES.lottery;
  const lotteryExtraText = isLottery ? " (Ver)" : null;

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
          }}>
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
            }}>
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
                }}>
                <CheckWithCircle />
              </View>
            )}
          </View>
        </View>
      )}
      {number && !collectedMoney && (
        <TileRow
          label="Número asignado"
          value={number}
          icon="bookmark-outline"
        />
      )}
      {!!normalizedMode && (
        <TileRow
          label="Asignado por"
          value={
            !isLottery && !round.participantsVisible ? (
              normalizedMode
            ) : (
              <TouchableOpacity onPress={toggleDrawModal}>
                <Text style={styles.lotteryModeButton}>
                  {`${normalizedMode}${lotteryExtraText}`}
                </Text>
              </TouchableOpacity>
            )
          }
          icon="cogs"
        />
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

      <BaseDrawModal
        winner={number - 1}
        round={round}
        number={number}
        visible={showDraw}
        onFinish={toggleDrawModal}
      />
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
  lotteryModeButton: {
    color: "white",
    textDecorationLine: "underline",
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
