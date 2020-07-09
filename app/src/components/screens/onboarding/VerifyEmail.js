import React, { useState } from "react";
import { connect } from "react-redux";
import VerifyAccount from "./VerifyAccount";
import * as actions from "../../../actions/auth";

const VeirfyEmail = props => {
  const [token, setToken] = useState("");

  const { verified, navigation, errorMessage } = props;

  const email = navigation.getParam("email", null);

  if (verified) navigation.navigate("LoadingAuth");

  let title = `Te enviamos un codigo a ${email}`;

  if (errorMessage) {
    title = errorMessage;
  }

  return (
    <VerifyAccount
      sendToken={() => props.validateEmail(email, token)}
      back={() => props.goToLogin()}
      title={title}
      token={token}
      setToken={setToken}
    />
  );
};

const mapStateToProps = ({ onboarding }) => {
  return {
    errorMessage: onboarding.errorMessage,
    verified: onboarding.verified,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    goToLogin: () => {
      dispatch(actions.goToLogin());
    },
    validateEmail: (username, token) => {
      dispatch(actions.verifyEmail(username, token));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VeirfyEmail);
