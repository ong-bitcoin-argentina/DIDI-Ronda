import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
import { Button } from "native-base";

import colors from "../../../../components/colors";
import ScreenContainer from "../../ScreenContainer";
import CreationTitle from "../../CreationTitle";
import {
  setPickTurnsManual,
  setParticipantsVisible,
} from "../../../../../actions/roundCreation";
import CustomCheckBox from "../../../../components/CustomCheckBox";

const screenIcon = {
  type: "MaterialIcons",
  name: "settings",
};

const RuffleOrSelection = props => {
  const title = `¿Cómo vas a definir los números \nde cada participante?`;
  const optionOne = "Sortear Todos";
  const optionTwo = "Elegir algunos y sortear resto";

  const [seeParticipants, setSeeParticipants] = useState(false);

  const { setPickTurnsManual: setPick, navigation } = props;

  useEffect(() => {
    props.setParticipantsVisible(seeParticipants);
  }, [seeParticipants]);

  const onPressOne = () => {
    setPick(false);
    return navigation.navigate("ParticipantSelection");
  };

  const onPressTwo = () => {
    setPick(true);
    return navigation.navigate("ParticipantSelection");
  };

  const renderVisibilityDescription = () => {
    if (seeParticipants)
      return "Los participantes serán visibles para todos los integrantes de esta ronda.";
    else
      return "Los participantes NO serán visibles para los integrantes de esta ronda.";
  };

  return (
    <ScreenContainer navigation={navigation} step={5}>
      <CreationTitle
        title={title}
        iconName={screenIcon.name}
        iconType={screenIcon.type}
      />
      <View style={styles.container}>
        <Button style={styles.button} onPress={onPressOne}>
          <Text style={styles.buttonText}>{optionOne}</Text>
        </Button>
        <View style={{ height: 25 }} />
        <Button style={styles.button} onPress={onPressTwo}>
          <Text style={styles.buttonText}>{optionTwo}</Text>
        </Button>
        <View style={styles.visibilityContainer}>
          <CustomCheckBox
            onValueChange={setSeeParticipants}
            value={seeParticipants}
          />
          <Text style={styles.privacyDescription}>
            {renderVisibilityDescription()}
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
    alignItems: "center",
    paddingHorizontal: 36,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: colors.mainBlue,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  visibilityContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  privacyDescription: {
    fontSize: 12,
    textAlign: "center",
  },
});

const mapDispatchToProps = { setPickTurnsManual, setParticipantsVisible };

export default connect(
  null,
  mapDispatchToProps
)(RuffleOrSelection);
