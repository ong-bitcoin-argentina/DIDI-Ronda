import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Text, Spinner, Icon, Button } from "native-base";
import colors from "../../../../components/colors";
import { createRound } from "../../../../../actions/roundCreation";
import ModalCreated from "./modalCreated";

const Finish = props => {
  const [openModal, setopenModal] = useState(true);
  const { createNewRound, loading, error, createdRound, navigation } = props;

  useEffect(() => {
    createNewRound();
  }, []);

  const onPressOk = () => {
    setopenModal(false);
    navigation.navigate("List");
  };

  const goToRoundName = () => {
    navigation.navigate("RoundName");
  };

  if (loading || !createdRound)
    return <Spinner color={colors.mainBlue} style={styles.spinner} />;

  if (error)
    return (
      <View style={styles.container}>
        <View>
          <Icon
            name="close-circle-outline"
            type="MaterialCommunityIcons"
            style={styles.errorIcon}
          />
          <Text style={styles.errorText}>
            Hubo un error. Intentalo nuevamente.
          </Text>
          <Button onPress={goToRoundName} style={styles.errorButton}>
            <Text style={styles.errorButtonText}>Volver a intentar</Text>
          </Button>
        </View>
      </View>
    );

  return (
    <ModalCreated
      open={openModal}
      onPressOK={onPressOk}
      roundName={createdRound.name}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundGray,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    flex: 1,
  },

  errorIcon: {
    fontSize: 100,
    color: "red",
    textAlign: "center",
  },
  errorText: {
    fontSize: 20,
    textAlign: "center",
  },
  errorButton: {
    marginTop: 20,
  },
  errorButtonText: {
    textAlign: "center",
    flex: 1,
  },
});

const mapStateToProps = state => {
  return {
    loading: state.roundCreation.request.loading,
    error: state.roundCreation.request.error,
    createdRound: state.roundCreation.request.createdRound,
  };
};

export default connect(
  mapStateToProps,
  { createNewRound: createRound }
)(Finish);
