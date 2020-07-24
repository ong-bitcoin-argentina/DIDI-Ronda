import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Icon } from "native-base";
import { connect } from "react-redux";
import colors from "../../../components/colors";
import * as roundsActions from "../../../../actions/rounds";
import RoundPopUp from "../../../components/RoundPopUp";
import Avatar from "../../../components/Avatar";

const AcceptPaymentPopUp = props => {
  const { roundName, participant, _pay: pay, onRef } = props;

  return (
    <RoundPopUp
      onRef={onRef}
      titleText={roundName}
      icon={<Icon type="FontAwesome" name="money" style={styles.popupIcon} />}
      positive={() => pay()}
      positiveTitle="Confirmar"
      negative={() => {}}
      negativeTitle="Rechazar"
    >
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Text
          style={styles.textChilds}
        >{`¿Confirmás el pago que te realiza ${participant.user.name}?`}</Text>
        <View
          style={{
            width: "100%",
            marginVertical: 20,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Avatar path={participant.user.picture} />
        </View>
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
    width: "80%",
    fontWeight: "bold",
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
    pay_round: (roundId, number, participantId) => {
      dispatch(roundsActions.payRound(roundId, number, participantId, true));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AcceptPaymentPopUp);
