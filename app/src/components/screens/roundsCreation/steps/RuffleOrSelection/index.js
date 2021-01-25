import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
import { Button } from "native-base";

import colors from "../../../../components/colors";
import ScreenContainer from "../../ScreenContainer";
import CreationTitle from "../../CreationTitle";
import { setPickTurnsManual } from "../../../../../actions/roundCreation";

const screenIcon = {
  type: "MaterialIcons",
  name: "settings",
};

const RuffleOrSelection = props => {
  const title = `¿Cómo vas a definir los números \nde cada participante?`;
  const optionOne = "Sortear Todos";
  const optionTwo = "Elegir algunos y sortear resto";

  const { setPickTurnsManual: setPick, navigation } = props;

  const onPressOne = () => {
    setPick(false);
    return navigation.navigate("ParticipantSelection");
  };

  const onPressTwo = () => {
    setPick(true);
    return navigation.navigate("ParticipantSelection");
  };

  return (
    <ScreenContainer navigation={navigation} step={2}>
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
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
    alignItems: "center",
  },
  button: {
    width: "80%",
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
});

const mapDispatchToProps = { setPickTurnsManual };

export default connect(
  null,
  mapDispatchToProps
)(RuffleOrSelection);
