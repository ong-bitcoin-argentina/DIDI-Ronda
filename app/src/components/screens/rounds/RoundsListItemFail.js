import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Swipeout from "react-native-swipeout";
import { Icon, Button, Spinner, Toast } from "native-base";
import colors from "../../components/colors";
import { amountFormat } from "../../../utils/utils";
import { deleteRoundFailByIndex } from "../../../services/asyncStorage/index";

const RoundsListItemFail = props => {
  const swipeButton = [
    {
      component: (
        <View style={styles.rightAction}>
          <Button
            danger
            style={styles.rightAcionButton}
            onPress={proccessDeleteFailRound}>
            <Icon
              style={styles.rightAcionIcon}
              type="FontAwesome"
              name="trash-o"
            />
          </Button>
        </View>
      ),
    },
  ];

  const swipeButtonSpinner = [
    {
      component: (
        <View style={styles.rightAction}>
          <Spinner color={colors.red} />
        </View>
      ),
    },
  ];

  const { amount, assignedNumbers, name } = props.round;
  const [loading, setLoading] = useState(false);

  const swipeOutOptions = () => {
    if (loading) return this.swipeButtonSpinner;
    return swipeButton;
  };

  const proccessDeleteFailRound = async () => {
    setLoading(true);
    await deleteRoundFailByIndex(props.round.indexRound);
    setLoading(false);
    props.handleOnDelete();
    Toast.show({
      text: "Eliminada con éxito",
      buttonText: "Okay",
    });
  };

  return (
    <View style={styles.rightActionContainer}>
      <Swipeout backgroundColor="transparent" right={swipeOutOptions()}>
        <TouchableOpacity
          style={styles.container}
          onPress={() => props.onClick(props.round)}>
          <View style={styles.roundStatus} />
          <View style={styles.roundData}>
            <View style={styles.rowCenterContainer}>
              <View style={styles.icon}>
                <View style={styles.iconContainer}>
                  <Icon
                    type="FontAwesome"
                    name="retweet"
                    style={styles.redoIcon}
                  />
                </View>
                <Icon
                  type="MaterialIcons"
                  name="filter-tilt-shift"
                  style={{ color: colors.mainBlue }}
                />
              </View>
              <View style={styles.roundNameContainer}>
                <Text numberOfLines={1} style={styles.roundName}>
                  {name}
                </Text>
                <View style={styles.rowCenterContainer}>
                  <View style={styles.personIconContainer}>
                    <Icon
                      type="MaterialIcons"
                      name="person-outline"
                      style={styles.personIcon}
                    />
                  </View>
                  <View>
                    <View style={styles.rowCenterContainer}>
                      <Text
                        style={{
                          ...styles.confirmedText,
                          fontStyle: "normal",
                        }}>
                        {`${assignedNumbers.length} Participantes`}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <Text style={styles.mensuality}>${amountFormat(amount)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeout>
    </View>
  );
};

const styles = StyleSheet.create({
  rightActionContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  container: {
    height: 70,
    borderTopRightRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.mainBlue,
  },
  roundStatus: {
    height: "100%",
    width: 5,
    backgroundColor: colors.red,
  },
  roundData: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  icon: {
    backgroundColor: "white",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
  roundNameContainer: {
    marginHorizontal: 10,
    width: "60%",
  },
  roundName: {
    fontWeight: "bold",
    color: "white",
    fontSize: 14,
  },
  amount: {
    textAlign: "right",
    color: "white",
  },
  confirmedText: {
    fontSize: 12,
    color: "white",
    opacity: 0.6,
    fontStyle: "italic",
    fontWeight: "bold",
  },
  mensuality: {
    fontSize: 16,
    textAlign: "right",
    fontWeight: "bold",
    color: "white",
  },
  rightAction: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    overflow: "hidden",
  },
  rightAcionButton: {
    flex: 1,
    borderRadius: 0,
    margin: 0,
    width: "100%",
  },
  rightAcionIcon: {
    color: "white",
  },
  iconContainer: {
    backgroundColor: colors.red,
    height: 14,
    width: 14,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    position: "absolute",
    top: -2,
    right: -2,
  },
  rowCenterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  personIconContainer: {
    justifyContent: "center",
    marginRight: 5,
  },
  personIcon: {
    color: colors.white,
    fontSize: 25,
  },
  redoIcon: {
    color: colors.white,
    fontSize: 10,
  },
});

export default RoundsListItemFail;
