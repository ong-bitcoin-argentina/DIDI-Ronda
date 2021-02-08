import React from "react";
import { Icon } from "native-base";
import { createStackNavigator } from "react-navigation-stack";
import { connect } from "react-redux";
import colors from "../../components/colors";
import * as actions from "../../../actions/roundCreation";
import RoundName from "./steps/RoundName";
import RoundFrequency from "./steps/RoundFrequency";
import ParticipantSelection from "./steps/ParticipantSelection";
import Finish from "./steps/FinishStep";
import RuffleOrSelection from "./steps/RuffleOrSelection";
import ParticipantsAllSelected from "./steps/ParticipantsAllSelected";
import RuffleParticipants from "./steps/RuffleParticipants";
import SelectParticipantNumbers from "./steps/SelectParticipantNumbers";
import CloseButton from "./CloseButton";

const mapStateToProps = state => {
  return {
    name: state.roundCreation.name,
    amount: state.roundCreation.amount,
    turns: state.roundCreation.turns,
    noParticipantEdit: state.roundCreation.noParticipantEdit,
    participantsQuantity: state.roundCreation.participants.length,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setName: name => {
      dispatch(actions.setName(name));
    },
    clearData: () => {
      dispatch(actions.clearStore());
    },
    setAmount: amount => {
      dispatch(actions.setAmount(amount));
    },
    setTurns: turns => {
      dispatch(actions.setTurns(turns));
    },
  };
};

const mapStateToPropsFrequency = ({ roundCreation }) => {
  return {
    frequency: roundCreation.frequency,
  };
};

const mapDispatchToPropsFrequency = dispatch => {
  return {
    setFrequency: frequency => {
      dispatch(actions.setFrequency(frequency));
    },
  };
};

const defaultNavigationOptions = {
  headerBackTitle: null,
  headerBackStyle: { color: "white" },
  title: `Nueva ronda`,
  headerTintColor: "white",
  headerRight: <CloseButton />,
  headerStyle: { backgroundColor: colors.mainBlue },
  headerTitleStyle: {
    color: "white",
    width: "80%",
    textAlign: "left",
    fontSize: 18,
  },
};

const RoundCreationStack = createStackNavigator({
  RoundName: {
    screen: connect(
      mapStateToProps,
      mapDispatchToProps
    )(RoundName),
    navigationOptions: navigation => ({
      ...defaultNavigationOptions,
      headerLeft: (
        <Icon
          type="Ionicons"
          name="md-arrow-back"
          style={{ marginLeft: 15, color: "white", fontSize: 25 }}
          onPress={() => {
            navigation.navigation.navigate("List");
          }}
        />
      ),
    }),
  },
  RoundFrequency: {
    screen: connect(
      mapStateToPropsFrequency,
      mapDispatchToPropsFrequency
    )(RoundFrequency),
    navigationOptions: defaultNavigationOptions,
  },
  ParticipantSelection: {
    screen: ParticipantSelection,
    navigationOptions: defaultNavigationOptions,
  },
  ParticipantsAllSelected: {
    screen: ParticipantsAllSelected,
    navigationOptions: defaultNavigationOptions,
  },
  RuffleOrSelection: {
    screen: RuffleOrSelection,
    navigationOptions: defaultNavigationOptions,
  },
  RuffleParticipants: {
    screen: RuffleParticipants,
    navigationOptions: defaultNavigationOptions,
  },
  SelectParticipantNumbers: {
    screen: SelectParticipantNumbers,
    navigationOptions: defaultNavigationOptions,
  },
  Finish: {
    screen: Finish,
    navigationOptions: {
      ...defaultNavigationOptions,
      title: "Finalizado",
      headerLeft: null,
      headerRight: null,
    },
  },
});

export default RoundCreationStack;
