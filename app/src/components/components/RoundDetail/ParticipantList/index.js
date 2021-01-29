import React, { useEffect } from "react";
import Number from "./Number";

const ParticipantList = props => {
  // Props
  const {
    participants,
    shifts,
    amountPerShift,
    pays,
    currentShiftParticipants,
    currentNumber,
    navigateParticipant,
  } = props;

  // Mount
  useEffect(() => {}, []);

  // Variables
  const populatedParticipants = shifts.map(s => {
    const participant = participants.find(p => p._id === s.participant[0]);
    return {
      participant,
      id: participant._id,
      name: participant.user.name,
      userPay: pays.find(pay => pay.participant === participant._id),
      picture: participant.user.picture,
      active: currentShiftParticipants.includes(participant._id.toString()),
    };
  });

  const participantList = populatedParticipants.map((item, index) => (
    <Number
      key={`${index}-${item.id}`}
      name={item.name}
      picture={item.picture}
      active={item.active}
      amountPerShift={amountPerShift}
      shiftsQty={item.participant.shiftsQty}
      currentNumber={currentNumber}
      number={index + 1}
      userPay={item.userPay}
      onPress={() => {
        navigateParticipant(item);
      }}
    />
  ));

  // Render
  return <>{participantList}</>;
};

export default ParticipantList;
