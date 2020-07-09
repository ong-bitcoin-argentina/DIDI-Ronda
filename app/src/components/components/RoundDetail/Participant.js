import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { connect } from "react-redux";

import { Spinner } from "native-base";
import colors from "../colors";

import RoundInfo from "./RoundInfo";
import InvitationModal from "./InvitationModal";
import RequestNumberModal from "./RequestNumberModal";

const Participant = props => {
  // Props
  const { round, auth, acceptAndRequest } = props;

  // Hooks
  const [accepted, setAccepted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState({ show: false });

  // Variables
  const userParticipant =
    round && round.participants.find(p => p.user._id === auth.id);

  const preSelectedNumbers = round.shifts.filter(s => {
    const { id: userId } = auth;

    const participant = round.participants.find(p => p.user._id === userId);

    return participant && s.participant.includes(participant._id);
  });
  // Mount
  useEffect(() => {
    // Check participant invitation
    setAccepted(userParticipant.acepted);
    setLoading(false);

    if (acceptAndRequest) openRequestNumbersModal();
  }, []);

  // Methods
  const openRequestNumbersModal = () => {
    setShow({ show: true });
  };

  return (
    <View style={styles.container}>
      <InvitationModal {...props} participant={userParticipant} />
      <RequestNumberModal
        {...props}
        preSelectedNumbers={preSelectedNumbers}
        show={show}
      />
      {loading ? (
        <Spinner />
      ) : (
        <ScrollView>
          <View style={styles.scrollContainer}>
            <RoundInfo
              round={round}
              auth={auth}
              requestNumber={openRequestNumbersModal}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});

const mapStateToProps = state => {
  return {
    acceptAndRequest: state.participant.acceptAndRequest,
  };
};

export default connect(
  mapStateToProps,
  null
)(Participant);
