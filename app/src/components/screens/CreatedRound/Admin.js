import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Spinner, Button } from "native-base";
import { connect } from "react-redux";
import colors from "../../components/colors";

import Period from "../roundsCreation/steps/RoundDetail/Period";
import ParticipantsList from "./ParticipantsList";

import * as roundsActions from "../../../actions/rounds";
import ConfirmModal from "../../components/ConfirmModal";

import { roundFrequencyArray, amountFormat } from "../../../utils/utils";
import BlueTile from "../../components/RoundDetail/BlueTile";
import CircleOfNumbers from "../../components/RoundDetail/CircleWithSections";
import CaptionInfo from "../../components/CaptionInfo";
import IconInfo from "../../components/IconInfo";
import { getFormattedDate } from "../../../utils/dates";
import ParticipantRejectionCard from "./ParticipantRejectionCard";

const Admin = props => {
  const [confirmAlert, setConfirmAlert] = useState(null);
  const { round, startRound, startRoundRequest } = props;
  const { loading } = startRound;
  const { isBeingStarted } = round;
  const roundTotalAmount = round.amount;

  const alertModal = (title, error = false) => {
    const message = {
      title,
      positive: () => setConfirmAlert(null),
      iconType: error ? "error" : null,
    };
    setConfirmAlert(message);
  };

  useEffect(() => {
    if (startRound.error) {
      alertModal(startRound.error.error, true);
    }
  }, [startRound]);

  // Check all participans = acepted=true
  const startable =
    round.participants.filter(e => e.acepted === true).length ===
    round.participants.length;

  const rejectedParticipants = round.participants.filter(
    e => e.acepted === false
  );

  const reSendInvite = id => {
    props.reSendInvites(id);
    alertModal("Las invitaciones se enviaron correctamente", false);
  };

  const buttonStartRound = () => {
    // Check if any accepted = false
    const notAccepted = round.participants.filter(p => p.acepted === false);
    if (notAccepted.length > 0) {
      alertModal(
        "No es posible comenzar la ronda ya que una de las invitaciones fue rechazada.\nReemplazá al participante que rechazó su invitación para continuar con la ronda.",
        true
      );
    } else {
      startRoundRequest(round.id);
    }
  };
  const startDate = getFormattedDate(round.startDate);
  const endDate = getFormattedDate(round.endDate);

  const participantMap = {};
  round.participants.forEach(p => {
    participantMap[p._id] = p;
  });

  const participantsToShow = round.shifts.map(
    s => participantMap[s.participant[0]]
  );

  const handleReplace = participant => {
    props.navigation.navigate("UserProfile", { participant });
  };

  return (
    <ScrollView style={styles.container}>
      {rejectedParticipants[0] ? (
        <ParticipantRejectionCard
          show
          replaceParticipant={handleReplace}
          participant={rejectedParticipants[0]}
          participantName={rejectedParticipants[0].user.name}
        />
      ) : null}
      <View
        style={{
          backgroundColor: colors.backgroundGray,
          height: 100,
          marginTop: 10,
          marginHorizontal: 10,
          marginBottom: 25,
        }}>
        <BlueTile title={round.name} amount={round.amount} round={round} />
      </View>

      <CaptionInfo
        titleContainerStyle={{ marginHorizontal: 10 }}
        title="Información">
        <View style={{ flexDirection: "row" }}>
          <View style={styles.shiftDetailContainer}>
            <CircleOfNumbers maxNumber={round.shifts.length} />
          </View>
          <View style={styles.infoContainer}>
            <View>
              <IconInfo
                icon="calendar-range"
                title={startDate}
                titleStyle={{ fontWeight: "bold" }}
                subtitle="Inicio"
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
      </CaptionInfo>

      <Period startDate={startDate} endDate={endDate} />
      <View style={{ flex: 1.5 }}>
        <ParticipantsList
          {...props}
          shifts={round.shifts}
          participants={participantsToShow}
        />
      </View>

      <View style={styles.buttonContainer}>
        {loading && <Spinner size={40} color={colors.mainBlue} />}
        {!loading && isBeingStarted && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Spinner size={40} color={colors.mainBlue} />
            <Text style={{ textAlign: "center", fontSize: 13 }}>
              Se esta procesando el inicio de la ronda, te llegara una
              notificacion cuando termine
            </Text>
          </View>
        )}
        {!loading && !isBeingStarted && (
          <>
            <Button
              onPress={() => buttonStartRound()}
              style={[styles.button, { backgroundColor: colors.mainBlue }]}>
              <Text style={styles.buttonTextEnabled}>Comenzar ronda</Text>
            </Button>
            {!startable && (
              <Button
                onPress={() => reSendInvite(round.id)}
                style={[styles.button, { backgroundColor: colors.mainBlue }]}>
                <Text style={styles.buttonTextEnabled}>
                  Reenviar invitaciones
                </Text>
              </Button>
            )}
          </>
        )}
      </View>

      {confirmAlert && <ConfirmModal {...confirmAlert} />}
    </ScrollView>
  );
};

const mapStateToProps = state => {
  return {
    startRound: state.rounds.startRound,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    startRoundRequest: id => {
      dispatch(roundsActions.startRound(id));
    },
    reSendInvites: id => {
      dispatch(roundsActions.reSendInvite(id));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flex: 0.2,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundGray,
  },
  title: {
    paddingHorizontal: 20,
    color: colors.gray,
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 30,
  },
  button: {
    justifyContent: "center",
    borderRadius: 8,
    marginVertical: 10,
    height: 45,
    backgroundColor: colors.mainBlue,
    elevation: 0,
  },
  infoContainer: {
    alignItems: "center",
    justifyContent: "center",

    flexDirection: "row",
    flex: 1,
  },
  shiftDetailContainer: {
    alignItems: "center",
    flex: 1,
  },
  buttonTextEnabled: {
    color: "#ffffff",
  },
  buttonTextDisabled: {
    color: "#D8D8D8",
  },
});
