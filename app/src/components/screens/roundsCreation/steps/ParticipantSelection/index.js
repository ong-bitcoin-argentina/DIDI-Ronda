import React, { useState } from "react";
import { connect } from "react-redux";
import { Toast } from "native-base";
import CreationTitle from "../../CreationTitle";
import ScreenContainer from "../../ScreenContainer";
import ParticipantList from "./ParticipantList";
import {
  setParticipants,
  setNewAssignedNumber,
  setCompletedParticipantSection,
} from "../../../../../actions/roundCreation";
import SelectAdminNumberRuffle from "../SelectAdminNumberRuffle";

const screenIcon = {
  type: "MaterialIcons",
  name: "person-outline",
};

const ParticipantSelection = props => {
  const [renderPickNumberModal, setrenderPickNumberModal] = useState(false);
  const {
    participants,
    setParticipants: sp,
    turns,
    date,
    completedSelection,
    setCompletedSelection,
    pickTurnsManual,
  } = props;
  const { navigation, assignNumber } = props;
  const participantsQty = parseInt(turns, 10);
  const missingParticipantQty = participantsQty - participants.length;
  const handleNext = () => {
    if (pickTurnsManual) return goToCompletedSelection();
    if (!completedSelection) return setrenderPickNumberModal(true);
    return handleCancelPicking();
  };

  const goToCompletedSelection = () =>
    navigation.navigate("ParticipantsAllSelected");

  const handleCancelPicking = () => {
    setrenderPickNumberModal(false);
    setCompletedSelection();
    goToCompletedSelection();
  };

  const onSuccessPicking = number => {
    if (!number)
      return Toast.show({
        text: "Debes seleccionar un número",
        position: "top",
        type: "warning",
      });
    const admin = participants[0];
    assignNumber(number, {
      ...admin,
      number: parseInt(number, 10),
      date: new Date(date),
    });
    return handleCancelPicking();
  };

  const title = missingParticipantQty
    ? `Falta elegir\n${missingParticipantQty}`
    : "Todos los participantes seleccionados!";

  return (
    <ScreenContainer navigation={navigation} step={5}>
      <CreationTitle
        title={title}
        titleViewStyle={{ paddingBottom: 10 }}
        iconName={screenIcon.name}
        iconType={screenIcon.type}
      />
      <ParticipantList
        participantsQty={participantsQty}
        handleNext={handleNext}
        navigation={navigation}
        shouldRenderNext={!missingParticipantQty}
        participants={participants}
        setParticipants={sp}
      />
      <SelectAdminNumberRuffle
        navigation={navigation}
        turns={turns}
        onSuccessPicking={onSuccessPicking}
        onCancel={handleCancelPicking}
        open={renderPickNumberModal}
      />
    </ScreenContainer>
  );
};

const mapStateToProps = ({ roundCreation }) => ({
  participants: roundCreation.participants,
  turns: roundCreation.turns,
  date: roundCreation.date,
  pickTurnsManual: roundCreation.pickTurnsManual,
  completedSelection: roundCreation.completedParticipantsSection,
});

export default connect(
  mapStateToProps,
  {
    setParticipants,
    assignNumber: setNewAssignedNumber,
    setCompletedSelection: setCompletedParticipantSection,
  }
)(ParticipantSelection);
