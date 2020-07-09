import React from "react";
import Admin from "./Admin";
import Participant from "./Participant";

const StartedRound = props => {
  const { round, auth } = props;

  const userIsAdmin = round.admin === auth.id;

  return userIsAdmin ? (
    <Admin admin={userIsAdmin} {...props} />
  ) : (
    <Participant admin={userIsAdmin} {...props} />
  );
};

export default StartedRound;
