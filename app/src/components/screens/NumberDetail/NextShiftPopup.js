import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Spinner, Icon } from "native-base";
import colors from "../../components/colors";
import * as roundsActions from "../../../actions/rounds";
import RoundPopUp from "../../components/RoundPopUp";
import { connect } from "react-redux";

const NextShiftPopup = props => {
  const { roundId, number, roundName } = props;

  const drawNextNumber = (roundId, number) => {
    // Close round and mark next shift as draw
    props.close_round(roundId, number, true);
  };

  const closeRound = (roundId, number) => {
    // Close Round
    props.close_round(roundId, number);
  };

  return (
    <RoundPopUp
      onRef={props.onRef}
      titleText={roundName}
      icon={
        <Icon
          type="MaterialIcons"
          name="filter-tilt-shift"
          style={styles.popupIcon}
        />
      }
      positive={() => drawNextNumber(roundId, number)}
      positiveTitle="Sortear"
      negative={() => closeRound(roundId, number)}
      negativeTitle="Asignar Participante"
    >
      <View style={{ width: "100%" }}>
        <Text style={styles.textChilds}>{`El siguiente número #${number +
          1} no tiene participante asignado.`}</Text>
        <Text style={styles.textChilds}>Qué quieres hacer?</Text>
      </View>
    </RoundPopUp>
  );
};

const styles = StyleSheet.create({
  popupIcon: {
    color: colors.mainBlue,
    fontSize: 42,
  },
  textChilds: {
    textAlign: "center",
    fontSize: 17,
    width: "100%",
  },
});

const mapStateToProps = state => {
  return {
    numberDetails: state.rounds.numberDetails,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close_round: (roundId, number, nextDraw = false) => {
      dispatch(roundsActions.closeRound(roundId, number, nextDraw));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NextShiftPopup);
