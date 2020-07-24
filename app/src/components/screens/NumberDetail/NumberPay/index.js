import React, { useEffect } from "react";
import { connect } from "react-redux";
import { View, StyleSheet } from "react-native";
import {
  Text,
  Tab,
  Button,
  Tabs,
  TabHeading,
  Toast,
  Spinner,
  Container,
  Content,
} from "native-base";
import QRCode from "react-native-qrcode-svg";
import UserData from "../../UserProfile/UserProfileComponent";
import colors from "../../../components/colors";
import PaymentsList from "./PaymentsList";

import * as roundsActions from "../../../../actions/rounds";
import AcceptPayment from "./AcceptPayment";
import Swap from "../../UserProfile/Swap";
import ReasignNumber from "./ReasingNumber";
import ConfirmRoundPayment from "./ConfirmRoundPayment";

import { openRoundDetailRootModal } from "../../../../actions/roundDetailRootModal";

const NumberPay = props => {
  // Props
  const {
    requestRounds,
    navigation,
    loading,
    openRootModal,
    reasignNumberRequest,
  } = props;

  const roundId = navigation.getParam("roundId", null);

  useEffect(() => {
    const { refreshRoundData } = props;
    refreshRoundData(roundId);
  }, []);

  // Check if requestRounds list exist (prevent crash)
  if (requestRounds.list.length === 0) {
    return navigation.navigate("Main");
  }

  // Variables
  const round = requestRounds.list.find(e => e._id === roundId);

  const currentShiftInState = round.shifts.find(s => s.status === "current");
  const number =
    (currentShiftInState && currentShiftInState.number) ||
    navigation.getParam("number", null) ||
    round.shifts.length;
  const participant = navigation.getParam("participant", null);

  const getParticipantData = id => {
    return round.participants.find(e => e._id === id);
  };

  const fullParticipant = participant
    ? getParticipantData(participant.id)
    : null;

  fullParticipant.id = fullParticipant._id;
  const usersThatPaidShiftMap = {};
  const initialTab = navigation.getParam("initialTab", 0);
  const shift = round.shifts.find(s => s.number === number);
  shift.pays.forEach(p => {
    usersThatPaidShiftMap[p.participant] = p.participant;
  });
  const allParticipantsPaid = round.participants.length === Object.keys(usersThatPaidShiftMap).length;
  const participantPaid =
    shift.pays.filter(p => {
      return p.participant === fullParticipant.id;
    }).length > 0;
  const qrCode = `${round._id}-${fullParticipant.id}-${number}`;
  const allShiftsCompleted =
    round.shifts.filter(s => s.status === "completed").length ===
    round.shifts.length;
  const amountPerShift = round.amount / round.shifts.length;
  const participantAmount = amountPerShift * (fullParticipant.shiftsQty || 1);

  // For Pay round to current number
  const currentShift = round.shifts.find(s => s.number === number);
  const shiftCompleted = currentShift.status === "completed";
  const nextShift = round.shifts.find(s => s.number === number + 1);
  const nextShiftParticipants = nextShift && nextShift.participant;
  const enabledForPayRound =
    currentShift.participant.includes(fullParticipant.id) &&
    currentShift.status === "current";

  // Methods
  const pay = async () => {
    const participantId = fullParticipant.id;

    if (participantId) {
      props.pay_round(round._id, number, participantId);
    } else {
      Toast.show({
        text: "Hubo un problema con el pago intenta mas tarde",
        position: "top",
        type: "warning",
      });
    }
  };

  const openPayNumberPopUp = () => {
    this.popup.openPopUp();
  };

  const { isReceivingOrMakingPayment } = fullParticipant;

  return (
    <Container>
      <UserData participant={fullParticipant}>
        <Tabs
          tabBarUnderlineStyle={styles.tabHeaderBorder}
          initialPage={initialTab}
        >
          <Tab
            heading={
              <TabHeading style={styles.tabHeader}>
                <Text style={styles.tabHeaderText}>APORTES</Text>
              </TabHeading>
            }
          >
            <Content>
              <View style={styles.paysContainer}>
                <View style={styles.actionContainer}>
                  <PaymentsList
                    participant={fullParticipant}
                    amount={participantAmount}
                    round={round}
                    currentShift={shift}
                    shifts={round.shifts}
                  />
                  <View style={styles.qrContainer}>
                    <QRCode value={qrCode} size={150} />
                    {!shiftCompleted &&
                      !loading &&
                      !isReceivingOrMakingPayment && (
                        <Button
                          onPress={openPayNumberPopUp}
                          disabled={participantPaid}
                          style={{
                            ...styles.payButton,
                            backgroundColor: participantPaid
                              ? colors.inactiveBlue
                              : colors.mainBlue,
                          }}
                          uppercase={false}
                        >
                          <Text uppercase={false} style={styles.textButton}>
                            {participantPaid
                              ? "Aporte ya hecho"
                              : "Aceptar Pago"}
                          </Text>
                        </Button>
                      )}

                    {loading && (
                      <Spinner
                        style={{ margin: 10 }}
                        size={40}
                        color={colors.mainBlue}
                      />
                    )}

                    {!loading &&
                      enabledForPayRound &&
                      !isReceivingOrMakingPayment && (
                        <ConfirmRoundPayment
                          loading={loading}
                          allParticipantsPayedNumber={allParticipantsPaid}
                          participant={fullParticipant}
                          round={round}
                          nextShiftParticipants={nextShiftParticipants}
                          number={number}
                        />
                      )}

                    {isReceivingOrMakingPayment && (
                      <View>
                        <Spinner size={40} color={colors.mainBlue} />
                        <Text>Un pago se esta procesando</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </Content>
          </Tab>
          {!allShiftsCompleted && (
            <Tab
              heading={
                <TabHeading style={styles.emptyHeader}>
                  <Text style={styles.tabHeaderText}>ASIGNAR #</Text>
                </TabHeading>
              }
            >
              <Content>
                <ReasignNumber
                  participantName={fullParticipant.user.name}
                  participantPicture={fullParticipant.user.image}
                  participantReasign={reasignNumberRequest}
                  openRootModal={openRootModal}
                  roundId={round._id}
                  shifts={round.shifts}
                  participantUserId={fullParticipant.user.id}
                  participantId={fullParticipant._id}
                  participants={round.participants}
                  roundFrequency={round.recurrence}
                  roundStartDate={round.startDate}
                />
              </Content>
            </Tab>
          )}
          {!allShiftsCompleted && (
            <Tab
              style={{ height: 100 }}
              heading={
                <TabHeading style={styles.emptyHeader}>
                  <Text style={styles.tabHeaderText}>REEMPLAZAR</Text>
                </TabHeading>
              }
            >
              <Content>
                <View style={{ marginVertical: 15, flex: 1 }}>
                  <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                    Elige el participante que reemplazará a{" "}
                    {fullParticipant.user.name}
                  </Text>
                </View>
                <Swap {...props} participant={fullParticipant} />
              </Content>
            </Tab>
          )}
        </Tabs>
        <AcceptPayment
          participant={fullParticipant}
          _pay={pay}
          onRef={ref => {
            this.popup = ref;
          }}
        />
      </UserData>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
  tabHeader: {
    backgroundColor: colors.secondaryBackground,
  },
  emptyHeader: {
    backgroundColor: colors.secondaryBackground,
  },
  tabHeaderText: {
    color: "#333",
    fontSize: 12,
  },
  tabHeaderBorder: {
    borderBottomWidth: 3,
    borderColor: colors.mainBlue,
    backgroundColor: colors.secondaryBackground,
  },
  paysContainer: {
    backgroundColor: colors.backgroundGray,
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    padding: 15,
  },
  actionContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  payButton: {
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 20,
    height: 50,
    backgroundColor: colors.mainBlue,
    width: "100%",
  },
  textButton: {
    textAlign: "center",
    flex: 1,
  },
  qrContainer: {
    marginVertical: 40,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  buttonContainer: {
    marginVertical: 20,
  },
});

const mapStateToProps = state => {
  return {
    requestRounds: state.rounds.requestRounds,
    loading: state.rounds.numberDetails.loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    pay_round: (roundId, number, participantId) => {
      dispatch(roundsActions.payRound(roundId, number, participantId, true));
    },
    openRootModal: (message, icon) =>
      dispatch(openRoundDetailRootModal(message, icon)),
    refreshRoundData: id => dispatch(roundsActions.getRoundData(id)),
    reasignNumberRequest: (
      participantId,
      targetParticipantId,
      number,
      roundId
    ) =>
      dispatch(
        roundsActions.reasignNumber(
          participantId,
          targetParticipantId,
          number,
          roundId
        )
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NumberPay);
