import React, { useState } from "react";
import { View, Text } from "react-native";
import NumberList from "./NumberList";
import NumberListHeader from "./NumberListHeader";
import ReasignModal from "./ReasignModal";

const defaultTarget = { user: { name: "", picture: "", number: "" } };

const ReasignNumber = ({
  participantName,
  participantPicture,
  participants,
  participantReasign,
  roundFrequency,
  roundStartDate,
  openRootModal,
  participantUserId,
  participantId,
  roundId,
  shifts,
}) => {
  const [showModal, setshowModal] = useState(false);
  const [loading, setloading] = useState(false);
  const [requestStatus, setrequestStatus] = useState(null);
  const [targetParticipant, setTargetParticipant] = useState(defaultTarget);

  const clearTargetParticipant = () => setTargetParticipant(defaultTarget);

  const onNumberPress = data => {
    if (participantUserId === data.user.id) {
      return openRootModal(
        "No se puede intercambiar números con si mismo",
        "warning"
      );
    }
    setshowModal(true);
    return setTargetParticipant(data);
  };

  const onCancel = () => {
    setshowModal(false);
    setrequestStatus(null);
    clearTargetParticipant();
  };

  const onAccept = async () => {
    setloading(true);
    const result = await participantReasign(
      participantId,
      targetParticipant._id,
      targetParticipant.user.number,
      roundId
    );
    setloading(false);
    setrequestStatus(result);
  };

  return (
    <View>
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text
          style={{
            textAlign: "center",
            marginVertical: 25,
            color: "black",
            width: "80%",
            fontWeight: "bold",
          }}
        >
          Elige el número que quieres reasignarle a {participantName}
        </Text>
        <View style={{ width: "100%" }}>
          <NumberListHeader />
          <NumberList
            roundFrequency={roundFrequency}
            roundStartDate={roundStartDate}
            currentParticipantId={participantId}
            numbers={participants}
            shifts={shifts}
            onNumberPress={onNumberPress}
          />
        </View>
        <ReasignModal
          open={showModal}
          loading={loading}
          requestStatus={requestStatus}
          participant={{ name: participantName, picture: participantPicture }}
          targetParticipant={targetParticipant.user}
          onCancelPress={onCancel}
          onAcceptPress={onAccept}
        />
      </View>
    </View>
  );
};

export default ReasignNumber;
