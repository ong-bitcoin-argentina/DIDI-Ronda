import React, { useState, useEffect } from "react";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { Icon, Text } from "native-base";
import { StyleSheet } from "react-native";
import { connect } from "react-redux";
import * as roundsActions from "../../../actions/rounds";

import colors from "../../components/colors";
import RoundPopUp from "../../components/RoundPopUp";

const ContextualMenu = props => {
  const [popUp, setPopUp] = useState(null);

  const {
    participant,
    acceptInvitationReq,
    invitation,
    cleanInvitation,
  } = props;

  // Hooks
  const [acceptPending, setAcceptPending] = useState([]);

  const alertModal = (
    title,
    error,
    positive = null,
    negative = null,
    icon = null
  ) => {
    const message = {
      titleText: title,
      positive: () => {
        if (positive) positive();
        setPopUp(null);
      },
      negative: negative
        ? () => {
            negative();
            setPopUp(null);
          }
        : null,
      icon,
    };
    setPopUp(message);
  };

  useEffect(() => {
    setAcceptPending(participant.acepted === null);
  }, []);

  useEffect(() => {
    if (!invitation.loading && invitation.round && invitation.error === null) {
      const icon = (
        <Icon type="MaterialIcons" name="check-circle" style={styles.icon} />
      );
      alertModal(
        `Participante aceptado con exito`,
        false,
        () => {
          setAcceptPending(false);
          cleanInvitation();
        },
        null,
        icon
      );
    }

    if (!invitation.loading && invitation.error !== null) {
      const icon = (
        <Icon type="MaterialIcons" name="warning" style={styles.icon} />
      );
      alertModal(
        `Hubo un error. Intentalo nuevamente.`,
        false,
        () => {
          cleanInvitation();
        },
        null,
        icon
      );
    }
  }, [invitation]);

  const acceptInvitation = () => {
    acceptInvitationReq(participant._id, participant.round);
  };

  if (acceptPending)
    return (
      <Menu>
        {popUp && <RoundPopUp {...popUp} visible />}
        <MenuTrigger
          style={{
            width: 50,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="md-more" style={{ color: "white" }} />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={() => acceptInvitation()}>
            <Text style={{ fontSize: 16, color: colors.gray }}>
              Aceptar invitacion
            </Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  return null;
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 60,
    color: colors.mainBlue,
  },
});

const mapStateToProps = state => {
  return {
    invitation: state.participant.invitation,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    acceptInvitationReq: (idParticipant, roundId) => {
      dispatch(roundsActions.acceptInvitation(idParticipant, roundId));
    },
    cleanInvitation: () => {
      dispatch(roundsActions.invitationClean());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContextualMenu);
