import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Icon, Spinner } from "native-base";
import { connect } from "react-redux";
import colors from "../../../components/colors";
import RoundPopUp from "../../../components/RoundPopUp";
import Avatar from "../../../components/Avatar";
import { amountFormat } from "../../../../utils/utils";
import CallToAction from "../../../components/RoundDetail/CallToAction";
import { payNumberToParticipant } from "../../../../actions/rounds";

const ConfirmRoundPayment = props => {
  const {
    loading,
    round,
    participant,
    number,
    payToParticipant,
    allParticipantsPayedNumber = false,
  } = props;

  const [confirmPopUp, setConfirmPopUp] = useState(false);

  const isAdmin =
    participant && participant.user && participant.user._id === round.admin;
  const adminStr = isAdmin ? "( Adm )" : "";

  const payConfirmCheck = async () => {
    await payToParticipant(round.id, participant.id, number);
    setConfirmPopUp(false);
  };

  const payWithoutWarning = `¿Confirmás que le pagarás la Ronda a ${participant.user.name} ${adminStr}?`;
  const payWarning = `Algunos aportes no han sido registrados, si no se registran antes del pago, no se podran registrar despues\n¿Confirmás que le pagarás la Ronda a ${participant.user.name} ${adminStr} de todas maneras? `;

  const iconName = allParticipantsPayedNumber ? "filter-tilt-shift" : "warning";
  const bodyText = allParticipantsPayedNumber ? payWithoutWarning : payWarning;
  const iconColor = allParticipantsPayedNumber
    ? colors.mainBlue
    : colors.yellow;
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
              name={iconName}
              style={{ ...styles.popupIcon, color: iconColor }}
            />
          }
          positive={() => payConfirmCheck()}
          positiveTitle="Confirmo"
          negative={() => {
            setConfirmPopUp(false);
          }}
          negativeTitle="Cancelar">
          <View style={styles.childContainer}>
            <Text style={styles.textChilds}>{bodyText}</Text>
            <View style={styles.avatarContainer}>
              <Avatar path={participant.user.picture} size={60} />
            </View>
          </View>
        </RoundPopUp>
      )}

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

export default connect(
  mapStateToProps,
  { payToParticipant: payNumberToParticipant }
)(ConfirmRoundPayment);
