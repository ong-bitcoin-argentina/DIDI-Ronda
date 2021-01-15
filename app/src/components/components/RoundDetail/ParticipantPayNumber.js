/* eslint-disable camelcase */
import React, { useState, useEffect } from "react";
import { View, StyleSheet, PermissionsAndroid, Platform } from "react-native";
import { connect } from "react-redux";
import { Icon, Spinner, Text } from "native-base";
import QRCodeScanner from "react-native-qrcode-scanner";
import * as roundsActions from "../../../actions/rounds";

import CallToAction from "./CallToAction";
import RoundPopUp from "../RoundPopUp";
import colors from "../colors";
import { amountFormat } from "../../../utils/utils";
import MoneyWithCheck from "../icons/MoneyWithCheck";

import NoPresentialModal from "./NoPresentialModal";

const ParticipantPayNumber = props => {
  // Props
  const {
    participantId,
    roundId,
    number,
    amount,
    roundName,
    loading,
    pay_round,
    pay_round_clean,
    payRound,
    participantPayRound,
    alertModal,
    adminName,
    reqAdminAcceptPayment,
  } = props;

  // Hooks
  const [popUp, setPopUp] = useState(false);
  const [confirmPopUp, setConfirmPopUp] = useState(false);
  const [qrPopUp, setQrPopUp] = useState(false);
  const [openNoPresential, setopenNoPresential] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  // payRound listener
  useEffect(() => {
    if (!loading && payRound.round && payRound.error === null) {
      setConfirmPopUp(true);
      pay_round_clean();
    }

    if (!loading && payRound.round === null && payRound.error) {
      alertModal(
        "Hubo un error al procesar el pago de la ronda. Intentalo nuevamente.",
        true
      );
      pay_round_clean();
    }
  }, [payRound]);

  const openNoPresentialPayment = () => {
    setQrPopUp(false);
    setopenNoPresential(true);
  };

  const closeNoPresentialPayment = () => {
    setQrPopUp(true);
    setopenNoPresential(false);
  };

  const requestAddPaymentadmin = async () => {
    setisLoading(true);
    await reqAdminAcceptPayment(roundId, participantId);
    setisLoading(false);
    setopenNoPresential(false);
  };

  //   Variables
  const popUpParams = {
    title: `$${amountFormat(amount)}`,
    content: `¿Confirmás el aporte de $${amountFormat(
      amount
    )} al ${number} de la ronda ${roundName}?`,
  };

  const confirmPopUpParams = {
    title: `Tu aporte número ${number} de la ronda ${roundName} fue confirmado por "${adminName}"`,
    content: `¡Muchas Gracias!`,
  };

  const qrPopUpParams = {
    title: `Para confirmar tu aporte, escaneá el código QR que te muestra ${adminName} (admin)\nTambién podés optar por confirmar tu aporte de forma no presencial haciendo click en el botón que figura más abajo.`,
  };

  // Methods
  const checkPermissions = async () => {
    if (Platform.OS === "ios") {
      // IOS
    } else {
      // ANDROID
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Cámara",
            message:
              "Queremos usar tu cámara para escanear el código, pero necesitamos permisos.",
            buttonNegative: "Cancelar",
            buttonPositive: "OK",
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setQrPopUp(true);
        } else {
          alertModal("Debe aceptar los permisos para continuar", true);
          setQrPopUp(false);
        }
      } catch (err) {
        setQrPopUp(false);
      }
    }
  };

  const payNumber = () => {
    pay_round(roundId, number, participantId);
    setPopUp(false);
  };

  const qrModal = () => {
    checkPermissions();
  };

  const qrSuccess = e => {
    setQrPopUp(false);
    validateQr(e.data);
  };

  const validateQr = qrScanned => {
    const qrCodeValue = `${roundId}-${participantId}-${number}`;

    if (qrScanned === qrCodeValue) {
      setPopUp(true);
    } else {
      alertModal("El QR escaneado no es válido. Intente nuevamente.", true);
    }
  };

  // Render
  return (
    <View>
      {popUp && (
        <RoundPopUp
          visible
          titleText={popUpParams.title}
          positive={() => payNumber()}
          negative={() => {
            setPopUp(false);
          }}
          positiveTitle="Confirmo"
          negativeTitle="Rechazo"
          icon={
            <Icon
              type="MaterialCommunityIcons"
              name="cash-usd"
              style={styles.icon}
            />
          }>
          <Text style={styles.contentText}>{popUpParams.content}</Text>
        </RoundPopUp>
      )}

      {confirmPopUp && (
        <RoundPopUp
          visible
          titleText={confirmPopUpParams.title}
          positive={() => setConfirmPopUp(false)}
          positiveTitle="Ok"
          icon={<MoneyWithCheck />}>
          <Text style={styles.contentText}>{confirmPopUpParams.content}</Text>
        </RoundPopUp>
      )}

      {qrPopUp && (
        <RoundPopUp
          visible
          titleText={qrPopUpParams.title}
          negative={() => setQrPopUp(false)}
          negativeTitle="Cancelar"
          positiveTitle="Aporte no presencial"
          positive={openNoPresentialPayment}
          titleTextStyle={{ fontSize: 15, marginVertical: 5 }}>
          <View style={styles.cameraContainer}>
            <QRCodeScanner
              containerStyle={{ paddingBottom: 10, height: 100, width: 100 }}
              topViewStyle={{ height: 0, flex: 0 }}
              bottomViewStyle={{ height: 0, flex: 0 }}
              onRead={qrSuccess}
              cameraStyle={styles.cameraStyle}
            />
          </View>
        </RoundPopUp>
      )}
      <NoPresentialModal
        adminName={adminName}
        open={openNoPresential}
        isLoading={isLoading}
        isRequestingPayment={false}
        onAccept={requestAddPaymentadmin}
        onCancel={closeNoPresentialPayment}
      />
      {loading ? (
        <Spinner />
      ) : (
        !participantPayRound && (
          <CallToAction title="Hacer Aporte" pressHandler={() => qrModal()} />
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
  contentText: {
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    paddingHorizontal: 15,
  },
  cameraContainer: {
    flexDirection: "row",
    overflow: "hidden",
    width: "100%",
    height: 300,
    marginBottom: 25,
    paddingHorizontal: 50,
  },
  extraInfoText: {
    fontSize: 14,
    color: colors.gray,

    fontWeight: "bold",
    textAlign: "center",
  },
  extraInfoContainer: {
    marginVertical: 5,
    justifyContent: "center",
    flex: 1,
  },
  cameraStyle: {
    width: "100%",
  },
});

const mapStateToProps = state => {
  return {
    loading: state.rounds.numberDetails.loading,
    payRound: state.rounds.payRound,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    pay_round: (roundId, number, participantId) => {
      dispatch(roundsActions.payRound(roundId, number, participantId));
    },
    pay_round_clean: () => {
      dispatch(roundsActions.payRoundClean());
    },
    reqAdminAcceptPayment: (roundId, participantId) =>
      dispatch(
        roundsActions.requestAdminToAcceptPayment(roundId, participantId)
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantPayNumber);
