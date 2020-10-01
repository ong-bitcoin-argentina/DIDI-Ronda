import React, { useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, Linking } from "react-native";
import { Icon, View, Text, Spinner } from "native-base";
import colors from "../../components/colors";
import * as userDataActions from "../../../actions/userData";
import { openAidiCredentials } from "../../../utils/appRouter";

const UserData = props => {
  useEffect(() => {
    updateUserData();
  }, []);

  const updateUserData = () => {
    const { getData } = props;
    getData();
  };

  const { userData, loading } = props;

  const { roundsCount, completedRoundsCount } = userData || {
    roundsCount: "-",
    completedRoundsCount: "-",
  };

  const goToAidiCredentials = async () => {
    await openAidiCredentials();
  }

  return (
    <View style={styles.userData}>
      <View style={[styles.userDataInfo]}>
        <Icon
          type="MaterialIcons"
          name="filter-tilt-shift"
          style={styles.userDataInfoIcon}
        />
        <Text style={styles.userDataInfoText}>Todas mis Rondas</Text>
        {loading ? (
          <Spinner size={15} style={styles.spinner} />
        ) : (
          <Text style={styles.userDataInfoValue}>{roundsCount}</Text>
        )}
      </View>
      <View style={[styles.userDataInfo]}>
        <Icon
          type="MaterialIcons"
          name="filter-tilt-shift"
          style={styles.userDataInfoIcon}
        />
        <Icon
          type="Ionicons"
          name="md-checkmark-circle"
          size={5}
          style={[styles.userDataInfoIcon, styles.userDataIconCheck]}
        />
        <Text style={styles.userDataInfoText}>Mis Rondas Terminadas</Text>
        {loading ? (
          <Spinner size={15} style={styles.spinner} />
        ) : (
          <Text style={styles.userDataInfoValue}>{completedRoundsCount}</Text>
        )}
      </View>
      <View style={[styles.userDataInfo]}>
        <Icon
          onPress={goToAidiCredentials}
          type="MaterialCommunityIcons"
          name="certificate"
          style={styles.userDataInfoIcon}
        />
        <Text onPress={goToAidiCredentials} style={styles.userDataInfoText}>Certificados de Rondas</Text>
        {loading ? (
          <Spinner size={15} style={styles.spinner} />
        ) : (
          <Text onPress={goToAidiCredentials} style={styles.userDataInfoValue}>{completedRoundsCount}</Text>
        )}
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundGray,
  },
  userData: {
    marginTop: 40,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  userDataInfo: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    borderStyle: "dashed",
    borderColor: colors.secondary,
  },
  userDataInfoValue: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "bold",
  },
  userDataInfoText: {
    color: colors.secondary,
    fontSize: 13,
    textAlign: "center",
    color: colors.white
  },
  userDataInfoIcon: {
    color: colors.white,
    marginBottom: 5,
    marginTop:10
  },
  userDataIconCheck: {
    position: "absolute",
    zIndex: 100,
    backfaceVisibility: "hidden",
    bottom: 55,
    right: 66,
    fontSize: 20,
  },
  spinner: {
    flex: 1,
    padding: 5,
  },
});

const mapStateToProps = state => {
  return {
    userData: state.userData.data,
    loading: state.userData.loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getData: () => {
      dispatch(userDataActions.getData());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserData);
