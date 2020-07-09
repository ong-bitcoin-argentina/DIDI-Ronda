import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Icon, Spinner } from "native-base";
import { connect } from "react-redux";
import colors from "../../../components/colors";
import * as roundsActions from "../../../../actions/rounds";
import RoundPopUp from "../../../components/RoundPopUp";
import Avatar from "../../../components/Avatar";
import { amountFormat } from "../../../../utils/utils";
import CallToAction from "../../../components/RoundDetail/CallToAction";

import DrawModal from "../../../components/RoundDetail/DrawModal";

const ConfirmRoundPayment = props => {
  const {
    loading,
    number,
    round,
    participant,
    closeRound,
    nextShiftParticipants,
  } = props;

  const [drawPopUp, setDrawPopUp] = useState(false);
  const [confirmPopUp, setConfirmPopUp] = useState(false);
  const [drawModal, setDrawModal] = useState(false);

  const roundId = round._id;
  const isAdmin =
    participant && participant.user && participant.user._id === round.admin;
  const adminStr = isAdmin ? "( Adm )" : "";

  const payConfirmCheck = () => {
    // Last shift or assigned
    if (!nextShiftParticipants || nextShiftParticipants.length > 0) {
      closeRound(roundId, number, []);
    } else {
      setConfirmPopUp(false);
      setDrawPopUp(true);
    }
  };

  const payRound = draw => {
    if (draw) {
      setDrawModal(true);
    } else {
      closeRound(roundId, number, []);
    }
  };

  return (
    <React.Fragment>
      {confirmPopUp && (
        <RoundPopUp
          onRef={ref => (this.modal = ref)}
          visible
          titleText={`$ ${amountFormat(round.amount)}`}
          icon={
            <Icon
              type="MaterialIcons"
              name="filter-tilt-shift"
              style={styles.popupIcon}
            />
          }
          positive={() => payConfirmCheck()}
          positiveTitle="Confirmo"
          negative={() => {
            setConfirmPopUp(false);
          }}
          negativeTitle="Cancelar"
        >
          <View style={styles.childContainer}>
            <Text
              style={styles.textChilds}
            >{`¿Confirmás que le pagarás la Ronda a ${participant.user.name} ${adminStr}?`}</Text>
            <View style={styles.avatarContainer}>
              <Avatar path={participant.user.picture} size={60} />
            </View>
          </View>
        </RoundPopUp>
      )}

      {drawPopUp && (
        <RoundPopUp
          onRef={ref => (this.modal2 = ref)}
          visible
          titleText={round.name}
          icon={
            <Icon
              type="MaterialIcons"
              name="filter-tilt-shift"
              style={styles.popupIcon}
            />
          }
          positive={() => payRound(true)}
          positiveTitle="Sortear"
          negative={() => payRound(false)}
          negativeTitle="Asignar participante"
        >
          <View style={styles.childContainer}>
            <Text style={styles.textChilds}>
              {`El siguiente número #${number +
                1} no tiene participante asignado.`}
              {"\n"}
              ¿Qué quieres hacer?
            </Text>
          </View>
        </RoundPopUp>
      )}

      {drawModal && <DrawModal round={round} number={number} />}

      {loading ? (
        <Spinner />
      ) : (
        <CallToAction
          title="Pagar Ronda"
          pressHandler={() => setConfirmPopUp(true)}
        />
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  popupIcon: {
    color: colors.mainBlue,
    fontSize: 42,
  },
  childContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingHorizontal: 15,
  },
  textChilds: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  avatarContainer: {
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
});

const mapStateToProps = state => {
  return {
    numberDetails: state.rounds.numberDetails,
    loading: state.rounds.numberDetails.loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeRound: (roundId, number, nextDraw) => {
      dispatch(roundsActions.closeRound(roundId, number, nextDraw));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmRoundPayment);
