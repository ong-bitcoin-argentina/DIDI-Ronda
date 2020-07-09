import React from "react";
import Admin from "./Admin";
import Participant from "./Participant";

const RoundDetail = props => {
  const { admin } = props;

  return admin ? <Admin {...props} /> : <Participant {...props} />;
};

export default RoundDetail;
