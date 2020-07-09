import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import WheelOfFortune from "react-native-wheel-of-fortune";
import { connect } from "react-redux";
import * as roundsActions from "../../../actions/rounds";
import RoundPopUp from "../RoundPopUp";
import CircleArrows from "../../../assets/img/circle-arrows.svg";

import Number from "../Number";
import Bookmark from "../Bookmark";

const DrawModal = props => {
  // Props
  const { round, number, assignParticipant, closeRound } = props;

  // Hooks
  const [wheelWinner, setWheelWinner] = useState(null);
  const [disableRoulette, setDisableRoulette] = useState(false);

  //   Variables
  const candidates = round.participants.filter(p => {
    const shiftsAssigned = round.shifts.filter(s =>
      s.participant.includes(p._id)
    );

    const shiftsRequested = round.shifts.filter(s =>
      s.requests.includes(p._id)
    );

    return shiftsAssigned.length + shiftsRequested.length < p.shiftsQty;
  });

  const rewards =
    round &&
    candidates.map(p => ({
      uri: p.user.picture,
      index: p._id,
    }));

  const winner = round && Math.floor(Math.random() * candidates.length) + 1;
  const shift = round && round.shifts.find(s => s.number === number);

  const shiftDay = shift && new Date(shift.limitDate);

  const winnerParticipant =
    wheelWinner !== null &&
    round &&
    candidates.find(p => p._id === wheelWinner);

  const numberPay = {
    month: shiftDay && shiftDay.getUTCMonth() + 1,
    day: shiftDay && shiftDay.getUTCDate(),
  };

  const popUpTitle = winnerParticipant
    ? `Felicitaciones a ${winnerParticipant.user.name}, que se ha llevado la #${number}`
    : "Vas a sortear al participante de este número de ronda.";

  // Mount
  useEffect(() => {
    if (candidates.length === 1) {
      const value = candidates[0]._id;
      setWheelWinner(value);
      closeRound(round._id, number, [value], false);
    }
  }, []);

  // Methods
  const winnerCallback = value => {
    setWheelWinner(value);
    // Call api -> complete round with next participant
    closeRound(round._id, number, [value], false);
    setDisableRoulette(false);
  };

  const acceptPopUp = () => {
    setWheelWinner(null);

    if (assignParticipant.error !== null) {
      const errorMsg = assignParticipant.error.error.response.data.error;
      Alert.alert(`Hubo un error. ${errorMsg}`);
    }
  };
  const positiveAction = () => {
    if (wheelWinner) {
      props.load_rounds();
    } else {
      this.child2._onPress();
      setDisableRoulette(true);
    }
  };

  return (
    <RoundPopUp
      onRef={ref => (this.child = ref)}
      visible
      titleText={popUpTitle}
      icon={<Bookmark outline number={number} />}
      positive={() => positiveAction()}
      positiveTitle={winnerParticipant ? "Ok" : "Girar Ruleta"}
      disablePositive={disableRoulette}
      notCloseAfterPositive={!winnerParticipant}
    >
      <View style={{ flexDirection: "column", width: "100%" }}>
        {candidates.length > 1 && (
          <View style={{ height: 300 }}>
            <WheelOfFortune
              onRef={ref => (this.child2 = ref)}
              rewards={rewards}
              knobSize={20}
              knoobSource={require("../../../assets/img/navigation.png")}
              borderWidth={0}
              borderColor="#fff"
              playButton={() => (
                <CircleArrows
                  width={120}
                  height={120}
                  style={styles.playButton}
                />
              )}
              colors={["#73A4D0", "#4C7CBE"]}
              winner={winner}
              innerRadius={70}
              duration={5000}
              size={300}
              backgroundColor="#fff"
              getWinner={value => winnerCallback(value.index)}
            />
          </View>
        )}

        <View>
          <Number
            number={number}
            calendar={numberPay}
            title={winnerParticipant && winnerParticipant.user.name}
            subtitle={winnerParticipant && "Asignado Sorteo"}
            avatar={winnerParticipant && [winnerParticipant.user.picture]}
          />
        </View>
      </View>
    </RoundPopUp>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftColumn: {
    alignItems: "center",
  },
  rightColumn: {
    alignItems: "center",
  },
  middleColumn: {
    paddingHorizontal: 15,
  },
  textName: {},
  playButton: {
    top: 20,
    zIndex: 10,
  },
});

const mapStateToProps = state => {
  return {
    assignParticipant: state.rounds.assignParticipant,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeRound: (roundId, number, nextParticipants, loadRoundAfter) => {
      dispatch(
        roundsActions.closeRound(
          roundId,
          number,
          nextParticipants,
          loadRoundAfter
        )
      );
    },
    load_rounds: () => {
      dispatch(roundsActions.loadRounds());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawModal);
