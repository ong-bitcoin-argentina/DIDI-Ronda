import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { Button } from "native-base";
import { connect } from "react-redux";
import CreationTitle from "../../CreationTitle";
import ScreenContainer from "../../ScreenContainer";
import SelectedList from "../ParticipantSelection/SelectedList";
import colors from "../../../../components/colors";
import {
  saveCreationForLater,
  clearStore,
} from "../../../../../actions/roundCreation";

const screenIcon = {
  type: "MaterialIcons",
  name: "person-outline",
};

const ParticipantsAllSelected = props => {
  const {
    navigation,
    participants,
    pickTurnsManual,
    saveRoundForLater,
    clearData,
  } = props;

  const title = `Ya elegiste a todos los\nparticipantes de tu ronda`;

  const onPressGo = () => {
    if (!pickTurnsManual) return navigation.navigate("RuffleParticipants");
    return navigation.navigate("SelectParticipantNumbers");
  };

  const onPressSave = async () => {
    function cb() {
      navigation.navigate("List");
      clearData();
    }
    await saveRoundForLater(cb);
  };

  const buttonTextGo = pickTurnsManual
    ? "Asignar y Sortear"
    : "Comenzar el sorteo";
  return (
    <ScreenContainer navigation={navigation} step={4}>
      <CreationTitle
        title={title}
        iconName={screenIcon.name}
        iconType={screenIcon.type}
      />
      <SelectedList renderDetail={false} participants={participants} />
      <View style={styles.container}>
        <Button onPress={onPressGo} style={styles.button}>
          <Text style={styles.buttonText}>{buttonTextGo}</Text>
        </Button>
        <Button style={styles.button} onPress={onPressSave}>
          <Text style={styles.buttonText}>Guardar y seguir más tarde</Text>
        </Button>
      </View>
    </ScreenContainer>
  );
};
const mapStateToProps = ({ roundCreation }) => ({
  participants: roundCreation.participants,
  pickTurnsManual: roundCreation.pickTurnsManual,
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.backgroundGray,
    flex: 1,
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: colors.mainBlue,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default connect(
  mapStateToProps,
  { saveRoundForLater: saveCreationForLater, clearData: clearStore }
)(ParticipantsAllSelected);
