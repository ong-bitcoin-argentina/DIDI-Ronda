import React, { useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, Linking } from "react-native";
import { Icon, View, Text, Spinner } from "native-base";
import colors from "../../components/colors";
import * as userDataActions from "../../../actions/userData";

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

  const goToAidiCredentials = () => {
    console.log("goToAidiCredentials");
    const url = "https://aidi.page.link/mKfG"
    Linking.openURL(url);
  }

  return (
    <View style={styles.userData}>
      <View style={[styles.userDataInfo]}>
        <Icon
          type="MaterialIcons"
          name="filter-tilt-shift"
          style={styles.userDataInfoIcon}
        />
        {loading ? (
          <Spinner size={15} style={styles.spinner} />
        ) : (
          <Text style={styles.userDataInfoValue}>{roundsCount}</Text>
        )}
        <Text style={styles.userDataInfoText}>Rondas que participó</Text>
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
        {loading ? (
          <Spinner size={15} style={styles.spinner} />
        ) : (
          <Text style={styles.userDataInfoValue}>{completedRoundsCount}</Text>
        )}
        <Text style={styles.userDataInfoText}>Rondas completadas</Text>
      </View>
      <View style={[styles.userDataInfo]}>
        <Icon
          onPress={goToAidiCredentials}
          type="MaterialIcons"
          name="filter-tilt-shift"
          style={styles.userDataInfoIcon}
        />
        {loading ? (
          <Spinner size={15} style={styles.spinner} />
        ) : (
          <Text onPress={goToAidiCredentials} style={styles.userDataInfoValue}>{completedRoundsCount}</Text>
        )}
        <Text onPress={goToAidiCredentials} style={styles.userDataInfoText}>Certificados de Rondas</Text>
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
    marginBottom: 20,
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
    color: "#000",
    fontSize: 15,
    fontWeight: "bold",
  },
  userDataInfoText: {
    color: colors.secondary,
    fontSize: 13,
    textAlign: "center",
  },
  userDataInfoIcon: {
    color: colors.mainBlue,
    marginBottom: 5,
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
