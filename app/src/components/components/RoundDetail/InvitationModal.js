import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text, Icon, Toast, Button, Spinner } from "native-base";
import { connect } from "react-redux";
import * as roundsActions from "../../../actions/rounds";

import { roundFrequencyArray, amountFormat } from "../../../utils/utils";
import colors from "../colors";

import GenericModal from "../GenericModal";
import Avatar from "../Avatar";
import IconInfo from "../IconInfo";
import { getPaymentDate, getFormattedDate } from "../../../utils/dates";
import { openRoundDetailRootModal } from "../../../actions/roundDetailRootModal";
import {
  ASSIGNMENT_MODES,
  ASSIGNMENT_MODES_NORMALIZED,
} from "../../../utils/constants";
import BaseDrawModal from "./BaseDrawModal";

const InvitationModal = props => {
  // Props
  const {
    navigation,
    round,
    auth,
    invitation,
    doAcceptInvitation,
    doRejectInvitation,
    doInvitationClean,
    openRootModal,
    participant,
  } = props;
  const [showDraw, setShowDraw] = useState(false);
  const [show, setshow] = useState(false);

  const toggleDrawModal = () => setShowDraw(!showDraw);

  const admin = round.participants.find(p => p.user.id === round.admin);

  const adminPicture = admin && admin.user.picture;
  const adminName = admin && admin.user.name;
  const adminPhone = admin && admin.user.phone;
  const title = `${adminName} te invita a participar de una ronda.`;
  const startDate = getFormattedDate(round.startDate);
  const userParticipant = round.participants.find(p => p.user._id === auth.id);
  const amount = amountFormat(round.amount);
  const participantNumber = round.shifts.filter(shift =>
    shift.participant.includes(userParticipant._id)
  )[0];
  const assignmentMode = participantNumber?.assignmentMode;
  const normalizedMode = ASSIGNMENT_MODES_NORMALIZED[assignmentMode];
  const isLottery = assignmentMode === ASSIGNMENT_MODES.lottery;
  const lotteryExtraText = isLottery ? " (Ver)" : null;

  const participantNumberPayDate = getFormattedDate(
    getPaymentDate(round.startDate, round.recurrence, participantNumber.number)
      .date
  );

  const invitationRequested = !(!invitation.loading && !invitation.round);

  const openPendingConfirmation = () => {
    openRootModal(
      "Tu pedido se está procesando. Te llegará una notificación cuando termine",
      "greenCheck"
    );
  };

  // Mount
  useEffect(() => {
    const { isConfirmingTransaction, hasConfirmedTransaction } = participant;

    const isPendingConfirmation =
      isConfirmingTransaction && !hasConfirmedTransaction;

    const mustShowInvitationModal =
      !hasConfirmedTransaction &&
      !isConfirmingTransaction &&
      !round.start &&
      !invitationRequested;

    if (mustShowInvitationModal) setshow(true);

    if (isPendingConfirmation) openPendingConfirmation();
  }, []);

  // Update invitation
  useEffect(() => {
    if (!invitation.loading) {
      const { error } = invitation;
      if (error && !invitation.round) {
        doInvitationClean();
        Toast.show({
          text: "Hubo un error al enviar la invitación. Intentalo nuevamente.",
          buttonText: "Okay",
        });
      }
    }
  }, [invitation]);

  // Methods
  const acceptInvitation = () => {
    doAcceptInvitation(userParticipant._id, round._id, false);
  };

  const rejectInvitation = () => {
    doRejectInvitation(userParticipant._id, round._id);
    navigation.navigate("List");
  };

  return (
    <GenericModal open={show} onClose={() => navigation.navigate("List")}>
      <ScrollView>
        <View style={styles.container}>
          {invitation.loading && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 6,
                marginVertical: 60,
              }}>
              <Spinner size={75} color={colors.mainBlue} />
            </View>
          )}
          {!invitationRequested && (
            <>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{title}</Text>
              </View>
              <View style={styles.avatarContainer}>
                <Avatar path={adminPicture} size={100} />
                <Text style={styles.textName}>{adminName}</Text>
                <Text style={styles.textPhone}>{adminPhone}</Text>
              </View>

              <View style={styles.detailContainer}>
                <View style={styles.iconContainer}>
                  <View style={styles.iconCircle}>
                    <Icon
                      type="MaterialIcons"
                      name="filter-tilt-shift"
                      style={{ color: "white" }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingLeft: 5,
                    }}>
                    <Text style={styles.detailNameText}>{round.name}</Text>
                  </View>
                  <View
                    style={{
                      justifyContent: "flex-end",
                      alignSelf: "flex-end",
                      marginRight: 10,
                    }}>
                    <View style={styles.dataRow}>
                      <Text
                        style={styles.detailAmountText}>{`$ ${amount}`}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                      }}>
                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "center",
                          alignSelf: "center",
                        }}>
                        (pozo)
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    ...styles.itemInfoRow,
                    marginTop: 15,
                  }}>
                  <View style={styles.rowCentered}>
                    <Icon
                      type="MaterialCommunityIcons"
                      name="cogs"
                      style={styles.detailBookmarkIcon}
                    />
                    <Text style={styles.dataDetailText}>Asignado por:</Text>
                  </View>

                  <Text style={styles.detailAmountText}>
                    {!isLottery || !round.participantsVisible ? (
                      normalizedMode
                    ) : (
                      <TouchableOpacity onPress={toggleDrawModal}>
                        <Text style={styles.lotteryModeButton}>
                          {`${normalizedMode}${lotteryExtraText}`}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </Text>
                </View>

                <View style={{ marginVertical: 20 }}>
                  <View style={styles.itemInfoRow}>
                    <View style={styles.rowCentered}>
                      <Icon
                        type="MaterialCommunityIcons"
                        name="cash-usd"
                        style={styles.detailBookmarkIcon}
                      />
                      <Text style={styles.dataDetailText}>
                        Fecha de Cobro{" "}
                        <Text
                          style={{ ...styles.dataDetailText, fontSize: 10 }}>
                          (primer número)
                        </Text>
                      </Text>
                    </View>
                    <Text style={styles.detailAmountText}>
                      {participantNumberPayDate}
                    </Text>
                  </View>
                </View>

                <View style={styles.datesAndPeriodContainer}>
                  <View>
                    <IconInfo
                      icon="calendar-range"
                      title={startDate}
                      subtitle="Inicio"
                      titleStyle={{ fontWeight: "bold" }}
                    />
                  </View>
                  <View>
                    <IconInfo
                      icon="alarm"
                      title={roundFrequencyArray[round.recurrence]}
                      subtitle="Período"
                      titleStyle={{ fontWeight: "bold" }}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.buttonsContainer}>
                <Button onPress={acceptInvitation} style={styles.button}>
                  <Text style={styles.buttonText} uppercase={false}>
                    Aceptar Invitación
                  </Text>
                </Button>

                <Button
                  onPress={rejectInvitation}
                  style={{
                    ...styles.button,
                    backgroundColor: colors.secondary,
                  }}>
                  <Text style={styles.buttonText} uppercase={false}>
                    Rechazar Invitación
                  </Text>
                </Button>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <BaseDrawModal
        winner={participantNumber.number - 1}
        round={round}
        number={participantNumber.number}
        visible={showDraw}
        onFinish={toggleDrawModal}
        showNumber={false}
      />
    </GenericModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.85,
    flexDirection: "column",
    borderRadius: 10,
    backgroundColor: "white",
    paddingTop: 20,
  },
  lotteryModeButton: {
    color: colors.mainBlue,
    textDecorationLine: "underline",
  },
  titleContainer: {
    flexDirection: "row",
    flex: 0.1,
    justifyContent: "center",
    borderRadius: 10,
    alignItems: "center",
  },
  titleText: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    paddingHorizontal: 14,
  },
  avatarContainer: {
    alignItems: "center",
    flex: 0.3,
    justifyContent: "center",
    borderTopLeftRadius: 10,
    borderTopEndRadius: 10,
  },
  textName: {
    fontSize: 16,
    color: colors.mainBlue,
    fontWeight: "bold",
  },
  textPhone: {
    fontSize: 12,
    color: colors.gray,
  },
  detailContainer: {
    marginTop: 5,
    paddingHorizontal: 5,
    paddingVertical: 15,
    backgroundColor: colors.backgroundGray,
    flex: 0.35,
  },
  iconContainer: {
    flexDirection: "row",
  },
  iconCircle: {
    backgroundColor: colors.mainBlue,
    borderRadius: 100,
    height: 38,
    width: 38,
    padding: 5,
  },

  detailNameText: {
    fontWeight: "bold",
    color: "#333",
    maxWidth: "90%",
  },
  dataDetailText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  detailAmountText: {
    textAlign: "right",
    color: colors.mainBlue,
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
  button: {
    backgroundColor: colors.mainBlue,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  buttonText: {
    fontWeight: "bold",
  },
  rowCentered: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailBookmarkIcon: {
    color: colors.mainBlue,
    fontSize: 22,
  },
  buttonsContainer: {
    flex: 0.25,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 30,
    paddingBottom: 14,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  datesAndPeriodContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 1,
    paddingTop: 15,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  itemInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginVertical: 5,
  },
});

const mapStateToProps = state => {
  return {
    invitation: state.participant.invitation,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    doAcceptInvitation: (idParticipant, roundId, acceptAndRequest) => {
      dispatch(
        roundsActions.acceptInvitation(idParticipant, roundId, acceptAndRequest)
      );
    },
    doRejectInvitation: (idParticipant, roundId) => {
      dispatch(roundsActions.rejectInvitation(idParticipant, roundId));
    },
    doInvitationClean: () => {
      dispatch(roundsActions.invitationClean());
    },
    openRootModal: (msg, icon) => {
      dispatch(openRoundDetailRootModal(msg, icon));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvitationModal);
