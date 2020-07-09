/* eslint-disable no-use-before-define */
import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import Swipeout from "react-native-swipeout";
import { Icon, Button, Spinner, Toast } from "native-base";
import * as roundsActions from "../../../actions/rounds";

import { amountFormat, dateFormatShort } from "../../../utils/utils";
import colors from "../../components/colors";
import { getFormattedDate } from "../../../utils/dates";

class RoundListItem extends Component {
  swipeButton = [
    {
      component: (
        <View style={styles.rightAction}>
          <Button
            danger
            style={styles.rightAcionButton}
            onPress={() => this.deleteRound()}
          >
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

  swipeButtonSpinner = [
    {
      component: (
        <View style={styles.rightAction}>
          <Spinner color="red" />
        </View>
      ),
    },
  ];

  componentDidUpdate(prevProps) {
    const prevLoading = prevProps.deleteRoundRequest.loading;
    const { deleteRoundRequest } = this.props;
    const { loading, error } = deleteRoundRequest;

    if (prevLoading === true && loading === false) {
      if (error === null) {
        // Success!
        Toast.show({
          text: "Eliminada con éxito",
          buttonText: "Okay",
        });
      } else {
        const errMsgs = {
          "Only can delete not started rounds":
            "No se puede eliminar una ronda ya comenzada!",
          "Preparing to start rounds can not be deleted":
            "No se puede eliminar una ronda que se esta procesando para comenzar",
          "Not confirmed rounds can not be deleted":
            "No se puede eliminar una ronda que se esta confirmando",
        };
        const resErr = error.error.response.data.error;
        const errMsg =
          errMsgs[resErr] || "Ocurrio un error. Intentalo denuevo mas tarde";
        // Error!
        Toast.show({
          text: errMsg,
          buttonText: "Okay",
        });
      }
    }
  }

  deleteRound = async () => {
    const {
      id,
      delete_round: deleteRound,
      isEditing,
      roundIndex,
      onDeleteStoredRound,
    } = this.props;
    if (!isEditing) return deleteRound(id);
    return onDeleteStoredRound(roundIndex);
  };

  render() {
    const {
      start,
      pending,
      name,
      participants,
      amount,
      startDate,
      admin,
      _id,
      endDate,
      recurrence,
      shifts,
      deleteRoundRequest,
      detail,
      isEditing,
      auth,
      roundIndex,
      isConfirmed,
    } = this.props;

    const isAdmin = isEditing || auth.id === admin;

    const paymentsQty = shifts.length;

    const customStartDate = dateFormatShort(startDate);
    const customEndDate = dateFormatShort(endDate);

    const currentShift = shifts && shifts.find(s => s.status === "current");

    const acceptedParticipantNumber = participants.filter(p => p.acepted)
      .length;

    const swipeOutOptions = () => {
      if (isAdmin) {
        if (deleteRoundRequest.loading) return this.swipeButtonSpinner;
        return this.swipeButton;
      }
      return [];
    };

    const onTouchablePress = () =>
      detail({
        _id,
        start,
        isEditing,
        isConfirmed,
        pending,
        name,
        admin,
        participants,
        paymentsQty,
        amount,
        customEndDate,
        customStartDate,
        recurrence,
        shifts,
        roundIndex,
        deleteRoundRequest,
      });

    let iconType = "exclamation";
    if (isEditing) iconType = "pencil";
    if (!isConfirmed) iconType = "clock-o";
    return (
      <View style={styles.rightActionContainer}>
        <Swipeout backgroundColor="transparent" right={swipeOutOptions()}>
          <TouchableOpacity style={styles.container} onPress={onTouchablePress}>
            <View
              style={[
                styles.roundStatus,
                {
                  backgroundColor: !start ? colors.yellowStatus : colors.green,
                },
              ]}
            />
            <View style={styles.roundData}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.icon}>
                  {!start && (
                    <View
                      style={{
                        backgroundColor: colors.yellowStatus,
                        height: 14,
                        width: 14,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 7,
                        position: "absolute",
                        top: -2,
                        right: -2,
                      }}
                    >
                      <Icon
                        type="FontAwesome"
                        name={iconType}
                        style={{ color: "black", fontSize: 10 }}
                      />
                    </View>
                  )}
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
                  {/* Section of data for pending rounds */}
                  {!start && (
                    <View style={{ flexDirection: "row" }}>
                      <View
                        style={{
                          justifyContent: "center",
                          marginRight: 5,
                        }}
                      >
                        <Icon
                          type="MaterialIcons"
                          name="person-outline"
                          style={{ color: "white", fontSize: 25 }}
                        />
                      </View>
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text style={styles.amount}>
                            {acceptedParticipantNumber} de {participants.length}
                          </Text>
                          <Text style={styles.confirmedText}>
                            {" "}
                            (confirmados)
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              ...styles.confirmedText,
                              fontStyle: "normal",
                            }}
                          >
                            Participantes
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.column}>
                <Text style={styles.mensuality}>${amountFormat(amount)}</Text>
              </View>
            </View>
          </TouchableOpacity>
          {start && (
            <TouchableOpacity
              onPress={onTouchablePress}
              style={{
                backgroundColor: "#598FDC",
                flex: 1,
                height: 60,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <View
                style={[
                  styles.roundStatus,
                  {
                    backgroundColor: colors.green,
                  },
                ]}
              />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <View style={styles.extraInfoLeftSpacing} />
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                    }}
                  >
                    <Icon
                      style={styles.extraInfoIcons}
                      name="bookmark-outline"
                      type="MaterialCommunityIcons"
                    />
                    <Text style={styles.extraInfoText}>Número</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignContent: "flex-end",
                      marginRight: "6%",
                    }}
                  >
                    <Text style={styles.extraInfoTextData}>
                      {currentShift ? currentShift.number : "-"}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                  }}
                >
                  <View style={styles.extraInfoLeftSpacing} />
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                    }}
                  >
                    <Icon
                      style={styles.extraInfoIcons}
                      name="calendar-check"
                      type="MaterialCommunityIcons"
                    />

                    <Text style={styles.extraInfoText}>Vencimiento</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: "6%",
                    }}
                  >
                    <Text style={styles.extraInfoTextData}>
                      {currentShift && currentShift.limitDate
                        ? getFormattedDate(currentShift.limitDate)
                        : "--/--/--"}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </Swipeout>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  column: {
    flexDirection: "column",
  },
  mensuality: {
    fontSize: 16,
    textAlign: "right",
    fontWeight: "bold",
    color: "white",
  },
  amount: {
    textAlign: "right",
    color: "white",
  },
  roundUsers: {
    color: "white",
  },
  roundName: {
    fontWeight: "bold",
    color: "white",
    fontSize: 14,
  },
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
  confirmedText: {
    fontSize: 12,
    color: "white",
    opacity: 0.6,
    fontStyle: "italic",
    fontWeight: "bold",
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
  roundInfo: {
    flexDirection: "column",
    height: 100,
    marginBottom: 8,
    backgroundColor: "white",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  roundInfoDates: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingLeft: 70,
    paddingRight: 20,
  },
  roundInfoDate: {
    flexDirection: "row",
    alignItems: "center",
    width: "35%",
  },
  date: { fontSize: 12, fontWeight: "bold" },
  dateSubtitle: { fontSize: 11, color: colors.secondary },
  smallIcon: { color: colors.mainBlue, fontSize: 22, marginRight: 10 },
  roundState: {
    flexDirection: "column",
    justifyContent: "center",
    paddingRight: 20,
  },
  state: {
    color: colors.lightBlue,
    fontStyle: "italic",
  },
  extraInfoText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: 10,
    alignSelf: "center",
  },
  extraInfoTextData: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
    alignSelf: "center",
  },
  extraInfoIcons: {
    color: "white",
    fontSize: 22,
  },
  extraInfoLeftSpacing: {
    width: 60,
  },
});

const mapDispatchToProps = dispatch => {
  return {
    delete_round: id => dispatch(roundsActions.deleteRound(id)),
  };
};

const mapStateToProps = state => {
  return {
    deleteRoundRequest: state.rounds.deleteRound,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoundListItem);
