/* eslint-disable camelcase */
import React, { useState, useEffect } from "react";
import { View, StyleSheet, PermissionsAndroid, Platform } from "react-native";
import { connect } from "react-redux";
import { Spinner } from "native-base";
import QRCodeScanner from "react-native-qrcode-scanner";
import * as roundsActions from "../../../actions/rounds";

import NoPresentialModal from "./NoPresentialModal";
import CallToAction from "./CallToAction";
import RoundPopUp from "../RoundPopUp";
import colors from "../colors";

const ParticipantChargesNumber = props => {
  // Props
  const {
    participantId,
    roundId,
    number,
    loading,
    charge_number,
    charge_number_clean,
    chargeNumber,
    alertModal,
    adminName,
    requestPaymentToAdmin,
  } = props;

  // Hooks
  const [qrPopUp, setQrPopUp] = useState(false);
  const [openNoPresential, setopenNoPresential] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  // chargeNumber listener
  useEffect(() => {
    if (!loading && chargeNumber.round === null && chargeNumber.error) {
      alertModal("Hubo un error. Intentalo nuevamente.", true);
      charge_number_clean();
    }
  }, [chargeNumber]);

  //   Variables
  const qrPopUpParams = {
    title: `Para cobrar tu número, pedile a ${adminName} que muestre su código QR para escanearlo y confirmar tu cobro.\nTambién podés optar por confirmar tu cobro de forma no presencial haciendo click en el botón que figura más abajo.`,
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

  const chargesNumberConfirm = () => {
    charge_number(roundId, participantId, number);
    setQrPopUp(false);
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
      chargesNumberConfirm();
    } else {
      alertModal("El QR escaneado no es válido. Intente nuevamente.", true);
    }
  };

  const openNoPresentialPayment = () => {
    setQrPopUp(false);
    setopenNoPresential(true);
  };

  const closeNoPresentialPayment = () => {
    setQrPopUp(true);
    setopenNoPresential(false);
  };

  const requestPaymentAdmin = async () => {
    setisLoading(true);
    await requestPaymentToAdmin(roundId, participantId);
    setisLoading(false);
    setopenNoPresential(false);
  };

  // Render
  return (
    <View>
      {qrPopUp && (
        <RoundPopUp
          onRef={ref => (this.modal3 = ref)}
          visible
          titleText={qrPopUpParams.title}
          titleTextStyle={{ fontSize: 15, marginVertical: 10 }}
          positiveTitle="Cobro no presencial"
          positive={openNoPresentialPayment}
          negative={() => setQrPopUp(false)}
          negativeTitle="Cancelar"
        >
          <View style={styles.cameraContainer}>
            <QRCodeScanner
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
        onAccept={requestPaymentAdmin}
        onCancel={closeNoPresentialPayment}
      />
      {loading ? (
        <Spinner />
      ) : (
        <CallToAction title="Cobrar" pressHandler={() => qrModal()} />
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
    height: 250,
    paddingHorizontal: 50,
    overflow: "hidden",
    width: "100%",
    marginBottom: 25,
  },
  cameraStyle: {
    width: "100%",
  },
});

const mapStateToProps = state => {
  return {
    loading: state.rounds.requestRounds.loading,
    chargeNumber: state.participant.chargeNumber,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    charge_number: (roundId, participantId, number) => {
      dispatch(roundsActions.chargeNumber(roundId, participantId, number));
    },
    charge_number_clean: () => {
      dispatch(roundsActions.chargeNumberClean());
    },
    requestPaymentToAdmin: (roundId, participantId) =>
      dispatch(roundsActions.requestPayment(roundId, participantId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantChargesNumber);
