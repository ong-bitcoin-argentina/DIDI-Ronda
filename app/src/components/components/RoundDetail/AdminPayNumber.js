import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Icon, Spinner } from "native-base";
import * as roundsActions from "../../../actions/rounds";
import CallToAction from "./CallToAction";
import RoundPopUp from "../RoundPopUp";
import colors from "../colors";
import { amountFormat } from "../../../utils/utils";

const AdminPayNumber = props => {
  // Props
  const {
    participantId,
    roundId,
    number,
    amount,
    roundName,
    loading,
    pay_round: payRoundFn,
    participantPayRound,
  } = props;

  // Hooks
  const [popUp, setPopUp] = useState(false);

  // Mount
  useEffect(() => {}, []);

  //   Variables
  const title = `¿Confirmás el aporte de $${amountFormat(
    amount
  )} a la Ronda ${roundName}?`;

  // Methods
  const payNumber = () => {
    payRoundFn(roundId, number, participantId);
    setPopUp(false);
  };

  // Render
  return (
    <View>
      {popUp && (
        <RoundPopUp
          onRef={ref => (this.modal = ref)}
          visible
          titleText={title}
          positive={() => payNumber()}
          negative={() => {
            setPopUp(false);
          }}
          positiveTitle="Aportar"
          negativeTitle="Cancelar"
          icon={
            <Icon
              type="MaterialCommunityIcons"
              name="alert"
              style={styles.icon}
            />
          }
        />
      )}
      {loading ? (
        <Spinner />
      ) : (
        !participantPayRound && (
          <CallToAction
            title="Hacer aporte"
            pressHandler={() => setPopUp(true)}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    color: colors.mainBlue,
    fontSize: 72,
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
      dispatch(roundsActions.payRound(roundId, number, participantId));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminPayNumber);
