import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { View, StyleSheet } from "react-native";
import { Text, Icon, Spinner } from "native-base";
import * as roundsActions from "../../../actions/rounds";

import {
  amountFormat,
  compareDates,
  roundFrequencyArray,
} from "../../../utils/utils";

import colors from "../colors";

import CaptionInfo from "../CaptionInfo";
import IconInfo from "../IconInfo";
import ParticipantHList from "./ParticipantHList";

import ParticipantList from "./ParticipantList";

import AdminPayNumber from "./AdminPayNumber";
import ParticipantPayNumber from "./ParticipantPayNumber";
import PayRound from "./PayRound";

import ConfirmModal from "../ConfirmModal";
import BlueTile from "./BlueTile";
import CircleWithSections from "./CircleWithSections";
import ParticipantGetNumberPayment from "./ParticipantChargesNumber";
import {
  getPaymentDate,
  getFormattedDate,
  isTheDateToday,
  getDiffOfDaysToToday,
} from "../../../utils/dates";
import BookmarkMoneyWithExclamation from "../icons/BookmarkMoneyWithExclamation";
import WarningPayExpirationCard from "./WarningPayExpirationCard";
import MyMovements from "./MyMovements";

const RoundInfo = props => {
  const { round, auth, chargeNumberClean, chargeNumber } = props;

  const [confirmAlert, setConfirmAlert] = useState(null);

  const currentShift =
    round.shifts.find(
      shift => shift.status === "current" || shift.status === "draw"
    ) || round.shifts[round.shifts.length - 1];
  const amountPerShift = round.amount / round.shifts.length;
  const roundTotalAmount = round.amount;

  const currentNumber = currentShift.number;
  const currentShiftLimitPaymentDate = currentShift
    ? getFormattedDate(currentShift.limitDate)
    : "";
  const totalShifts = round.shifts.length;
  const userParticipant = round.participants.find(p => p.user._id === auth.id);
  const roundAdminParticipant = round.participants.find(
    p => p.user._id === round.admin
  );

  // We return true for payed numbers or when a round did not start yet
  const participantPayRound = round.start
    ? currentShift.pays.find(pay => pay.participant === userParticipant._id)
    : true;
  const isCurrentNumberPayed = participantPayRound;
  const userAdmin = round.admin === auth.id;
  const adminName = round.participants.find(p => p.user._id === round.admin)
    .user.name;
  const participantsPays = currentShift.pays.map(s => {
    const currentP = round.participants.find(p => p._id === s.participant);
    return (currentP.shiftsQty || 1) * amountPerShift;
  });

  const moneyPays = participantsPays.length
    ? participantsPays.reduce((pay, total) => pay + total)
    : 0;

  // We check differently, we check numbers against pays (since participants can have many numbers);
  // We check that every participant id performed the payment
  // And that those payment quantities equal to the quantity of participants in the round.
  const participantPaid = {};
  round.shifts.forEach(s => {
    participantPaid[s.participant[0]] = false;
  });
  currentShift.pays.forEach(p => {
    participantPaid[p.participant] = true;
  });
  const confirmedPaymentsQuantity = Object.values(participantPaid).filter(
    p => p === true
  ).length;
  const allPaysCompleted =
    round.participants.length === confirmedPaymentsQuantity;

  const participantsOfNumber = round.participants.filter(p =>
    currentShift.participant.includes(p._id)
  );
  // Participant info
  const participantNumbers = round.shifts.filter(shift =>
    shift.participant.includes(userParticipant._id)
  );

  const participantTotalPay = amountPerShift * participantNumbers.length;

  const enabledForPayRound =
    round.start &&
    allPaysCompleted &&
    currentShift.status === "current" &&
    !currentShift.isPayedToParticipant;

  const { number: myNumber } = round.shifts.find(
    s => s.participant[0] === userParticipant._id
  );
  const myNumberPaymentDate = getFormattedDate(
    getPaymentDate(round.startDate, round.recurrence, myNumber).date
  );

  const roundStartDate = getFormattedDate(round.startDate);
  const roundInfoCalendarTitle = round.start ? "Vencimiento" : "Inicio";
  const roundInfoCalendarDate = round.start
    ? currentShiftLimitPaymentDate
    : roundStartDate;

  const circleCurrentNumber = round.start ? currentShift.number : totalShifts;

  const shouldShowExpirationWarning = () => {
    const frequency = round.recurrence;
    const expirationPaymentDate = new Date(
      getPaymentDate(round.startDate, round.recurrence, currentNumber).date
    );
    if (frequency === "d") return isTheDateToday(expirationPaymentDate);
    if (frequency === "s")
      return getDiffOfDaysToToday(expirationPaymentDate) <= 2;
    if (frequency === "q")
      return getDiffOfDaysToToday(expirationPaymentDate) <= 5;
    return getDiffOfDaysToToday(expirationPaymentDate) <= 10;
  };

  const { isReceivingOrMakingPayment } = userParticipant;
  const showPaymentExpirationCard = shouldShowExpirationWarning();

  const navigateParticipant = participant => {
    const params = {
      participant,
      shifts: round.shifts,
      roundId: round._id,
      number: currentNumber,
      initialTab: 0,
    };
    props.navigation.navigate("NumberPay", params);
  };

  const shiftCompleted = currentShift.status === "completed";

  const shiftAvailableForPay = () => {
    const number = currentShift;
    if (!round.start) return false;
    const isNumberFromParticipant = participantNumbers.find(
      n => n.number === number.number
    );
    if (!isNumberFromParticipant) return false;
    const limitDate = new Date(number.limitDate);
    const today = new Date();
    const { isPayedToParticipant } = number;
    return (
      !isPayedToParticipant &&
      round.start &&
      number.status === "current" &&
      allPaysCompleted &&
      compareDates(limitDate, today) <= 10
    );
  };

  const isShiftAvailableToPay = shiftAvailableForPay();

  // Methods

  const alertModal = (title, error = false) => {
    const message = {
      title,
      positive: () => setConfirmAlert(null),
      iconType: error ? "error" : null,
    };
    setConfirmAlert(message);
  };

  useEffect(() => {
    if (!chargeNumber.loading && chargeNumber.error) {
      alertModal("Hubo un error. Intentalo nuevamente.", true);
      chargeNumberClean();
    }
  }, [chargeNumber]);

  return (
    <View style={styles.container}>
      <WarningPayExpirationCard
        show={showPaymentExpirationCard}
        expirationDate={currentShiftLimitPaymentDate}
        number={currentNumber}
        roundName={round.name}
      />
      <BlueTile
        title={round.name}
        amount={amountFormat(round.amount)}
        number={myNumber}
        completedCollection={allPaysCompleted}
        collectedMoney={userAdmin ? amountFormat(moneyPays) : false}
        paymentDate={myNumberPaymentDate}
      />

      {isReceivingOrMakingPayment && (
        <>
          <View style={styles.paymentSectionOuterContainer}>
            <View style={styles.paymentSectionInnerContainer}>
              <View style={{ justifyContent: "center" }}>
                <Spinner size={40} color={colors.mainBlue} />
                <Text style={{ fontSize: 13, textAlign: "center" }}>
                  Hay un pago en proceso. Te llegará una notificación cuando se
                  complete.
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
      {/* Payment Promp if round is active and user didn't Pay */}
      {/* We also use this in shiftAvailableForPay which is when the participant can have the round money */}
      {/* TODO: Extract this component */}
      {(!isCurrentNumberPayed || isShiftAvailableToPay) &&
        !shiftCompleted &&
        !isReceivingOrMakingPayment && (
          <View style={styles.paymentSectionOuterContainer}>
            <View style={styles.paymentSectionInnerContainer}>
              <View>
                <BookmarkMoneyWithExclamation />
              </View>
              <View style={{ marginLeft: 5 }}>
                <View style={styles.row}>
                  <Text style={styles.myNumberBoldText}>
                    Número # {currentNumber}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.expirationLightText}>
                    {isShiftAvailableToPay ? "Cobrar" : "Vence"}{" "}
                    {currentShiftLimitPaymentDate}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  marginLeft: 30,
                  flexDirection: "row",
                }}>
                <Text
                  style={{
                    ...styles.participantPaymentRedText,
                    color: isShiftAvailableToPay ? "green" : "red",
                  }}>
                  {isShiftAvailableToPay ? "+" : "-"}
                </Text>
                <Icon
                  style={{
                    ...styles.participantPaymentRedTextIcon,
                    color: isShiftAvailableToPay ? "green" : "red",
                  }}
                  name="attach-money"
                  type="MaterialIcons"
                />
                <Text
                  style={{
                    ...styles.participantPaymentRedText,
                    color: isShiftAvailableToPay ? "green" : "red",
                  }}>
                  {isShiftAvailableToPay
                    ? amountFormat(roundTotalAmount)
                    : amountFormat(participantTotalPay)}
                </Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              {!shiftCompleted && isShiftAvailableToPay && (
                <ParticipantGetNumberPayment
                  participantId={userParticipant._id}
                  roundId={round._id}
                  adminName={adminName}
                  number={currentNumber}
                  amount={amountPerShift}
                  roundName={round.name}
                  alertModal={alertModal}
                />
              )}
              {userAdmin ? (
                <AdminPayNumber
                  participantId={userParticipant._id}
                  roundId={round._id}
                  number={currentNumber}
                  amount={participantTotalPay}
                  roundName={round.name}
                  participantPayRound={participantPayRound}
                />
              ) : (
                <ParticipantPayNumber
                  participantId={userParticipant._id}
                  roundId={round._id}
                  adminName={adminName}
                  number={currentNumber}
                  amount={participantTotalPay}
                  roundName={round.name}
                  participantPayRound={participantPayRound}
                  alertModal={alertModal}
                />
              )}
            </View>
          </View>
        )}

      <View style={{ height: 50 }} />
      <CaptionInfo title="Información">
        <View style={{ flexDirection: "row" }}>
          <View style={styles.shiftDetailContainer}>
            <CircleWithSections
              currentNumber={circleCurrentNumber}
              maxNumber={totalShifts}
              showDetailOfNumbers
            />
          </View>
          <View style={styles.infoContainer}>
            <View>
              <IconInfo
                icon="calendar-range"
                title={roundInfoCalendarDate}
                titleStyle={{ fontWeight: "bold" }}
                subtitle={roundInfoCalendarTitle}
              />
              <IconInfo
                icon="cash-usd"
                titleStyle={{ fontWeight: "bold" }}
                title={`$ ${amountFormat(roundTotalAmount)}`}
                subtitle="Pozo"
              />
              <IconInfo
                icon="alarm"
                titleStyle={{ fontWeight: "bold" }}
                title={roundFrequencyArray[round.recurrence]}
                subtitle="Período"
              />
            </View>
          </View>
        </View>

        {userAdmin &&
          (enabledForPayRound && (
            <View style={styles.buttonContainer}>
              <PayRound
                number={currentNumber}
                currentShiftParticipants={participantsOfNumber}
                navigateParticipant={navigateParticipant}
              />
            </View>
          ))}
      </CaptionInfo>

      {!userAdmin && (
        <MyMovements
          frequency={round.recurrence}
          paymentAmount={participantTotalPay}
          id={userParticipant._id}
          roundStartDate={round.startDate}
          shifts={round.shifts}
        />
      )}

      {/* We show the admin to the Non-Admin participants */}
      {!userAdmin && (
        <CaptionInfo title="Administrador">
          <View style={styles.participantsContainer}>
            <ParticipantHList participants={[roundAdminParticipant]} detail />
          </View>
        </CaptionInfo>
      )}

      {userAdmin && (
        <CaptionInfo
          title={`Estado #${currentNumber}`}
          subTitle={`${currentNumber} de ${totalShifts}`}>
          <View>
            <ParticipantList
              participants={round.participants}
              pays={currentShift.pays}
              shifts={round.shifts}
              currentShiftParticipants={currentShift.participant}
              amountPerShift={amountPerShift}
              currentNumber={currentNumber}
              navigateParticipant={navigateParticipant}
            />
          </View>
        </CaptionInfo>
      )}

      {userAdmin && (
        <View style={styles.bottomInfoContainer}>
          <IconInfo icon="cash-usd" title={"Dinero\nRecolectado"} />
          <View>
            <Text>{`$ ${amountFormat(moneyPays)}`}</Text>
          </View>
        </View>
      )}

      {userAdmin &&
        (enabledForPayRound && (
          <View style={styles.buttonContainer}>
            <PayRound
              number={currentNumber}
              currentShiftParticipants={participantsOfNumber}
              navigateParticipant={navigateParticipant}
            />
          </View>
        ))}

      {confirmAlert && <ConfirmModal {...confirmAlert} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  infoContainer: {
    flex: 1,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  participantPaymentRedText: {
    fontSize: 20,
    color: colors.red,
    fontWeight: "bold",
  },
  participantPaymentRedTextIcon: {
    fontSize: 24,
    color: colors.red,
    fontWeight: "bold",
    marginTop: 2,
  },
  paymentSectionOuterContainer: {
    padding: 10,
    marginTop: 10,
    alignItems: "center",
  },
  paymentSectionInnerContainer: {
    flexDirection: "row",
    marginVertical: 10,
    width: "80%",
  },
  expirationLightText: {
    fontSize: 13,
    opacity: 0.4,
    fontStyle: "italic",
  },
  myNumberBoldText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  shiftDetailContainer: {
    alignItems: "center",
    flex: 1,
  },
  participantsContainer: {
    flex: 1,
  },
  exclamationIcon: {
    borderRadius: 50,
    width: 35,
    aspectRatio: 1,
    backgroundColor: colors.yellowStatus,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    margin: 15,
    flex: 1,
    alignItems: "center",
  },
  bottomInfoContainer: {
    borderTopWidth: 1,
    borderColor: colors.mainBlue,
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const mapStateToProps = state => {
  return {
    chargeNumber: state.participant.chargeNumber,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    chargeNumberClean: () => {
      dispatch(roundsActions.chargeNumberClean());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoundInfo);
