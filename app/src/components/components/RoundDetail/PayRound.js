import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Spinner, Text } from "native-base";
import CallToAction from "./CallToAction";
import RoundPopUp from "../RoundPopUp";
import colors from "../colors";
import Bookmark from "../Bookmark";

const PayRound = props => {
  // Props
  const {
    number,
    loading,
    currentShiftParticipants,
    navigateParticipant,
  } = props;

  // Hooks
  const [popUp, setPopUp] = useState(false);

  // Mount
  useEffect(() => {}, []);

  // Variables
  const title = `Todos los participantes ya hicieron su aporte al número ${number} de la Ronda.`;

  // Get only first participant (For now)
  const participantNavigate = currentShiftParticipants[0];

  // Methods
  const goToParticipant = () => {
    setPopUp(false);
    // Navigate to participant detail (format first)
    if (participantNavigate) {
      const formatParticipant = {
        participant: participantNavigate,
        id: participantNavigate._id,
        picture: participantNavigate.user.picture,
        name: participantNavigate.user.name,
      };
      navigateParticipant(formatParticipant, 1);
    } else {
      Alert.alert("La ronda no tiene un participante asignado.");
    }
  };

  // Render
  return (
    <View>
      {popUp && (
        <RoundPopUp
          onRef={ref => (this.modal = ref)}
          visible
          titleText={title}
          positive={() => goToParticipant()}
          negative={() => {
            setPopUp(false);
          }}
          positiveTitle="Pagar Ronda"
          negativeTitle="Cerrar"
          icon={
            <Bookmark
              check
              bold
              bgColor={colors.green}
              outline
              number={number}
            />
          }
        >
          <Text style={styles.text}>¡Ya podés pagar a el número {number}!</Text>
        </RoundPopUp>
      )}
      {loading ? (
        <Spinner />
      ) : (
        <CallToAction title="Pagar Ronda" pressHandler={() => setPopUp(true)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    color: colors.gray,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default PayRound;
