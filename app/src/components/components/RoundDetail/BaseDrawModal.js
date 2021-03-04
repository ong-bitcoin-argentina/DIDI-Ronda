import React from "react";
import RuffleRoulette from "../../screens/roundsCreation/RuffleRoulette";
import colors from "../colors";
import GenericModal from "../GenericModal";

const BaseDrawModal = ({
  round,
  number,
  winner,
  visible,
  showNumber = true,
  onFinish,
}) => {
  return (
    <GenericModal open={visible} backdropColor={colors.transparent}>
      <RuffleRoulette
        visible={visible}
        number={number}
        participants={round.participants}
        predefinedWinner={winner}
        showNumber={showNumber}
        autoplay
        onFinish={onFinish}
      />
    </GenericModal>
  );
};

export default BaseDrawModal;
