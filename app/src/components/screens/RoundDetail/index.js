import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Text, Spinner, Icon } from "native-base";
import { connect } from "react-redux";
import CreatedRound from "../CreatedRound";
import StartedRound from "../StartedRound";
import { getAuth } from "../../../utils/utils";
import DetailRootModal from "./DetailRootModal";
import { getRoundData, invitationClean } from "../../../actions/rounds";
import colors from "../../components/colors";

const RoundDetail = props => {
  const [auth, setAuth] = useState(null);
  const [isLoaded, setisLoaded] = useState(false);
  const {
    requestRounds,
    navigation,
    refreshRoundData,
    clearInvitation,
  } = props;
  const roundId = navigation.getParam("_id", null);
  const reduxRoundObject =
    requestRounds.list && requestRounds.list.find(e => e._id === roundId);

  useEffect(() => {
    const checkAdmin = async () => {
      const newAuth = await getAuth();
      setAuth(newAuth);
      clearInvitation();
      await refreshRoundData(roundId);
      setisLoaded(true);
    };
    checkAdmin();
  }, []);

  if (!reduxRoundObject.isConfirmed)
    return (
      <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
        <View style={{ flex: 0.1, justifyContent: "center" }}>
          <Icon
            type="MaterialCommunityIcons"
            name="alert"
            style={{ color: colors.yellow, fontSize: 60, margin: 25 }}
          />
        </View>
        <View style={{ flex: 0.1 }}>
          <Text
            style={{
              justifyContent: "center",
              textAlign: "center",
              maxWidth: "80%",
              fontWeight: "bold",
            }}>
            La ronda se esta confirmando, debes esperar a que se termine el
            proceso para poder ver sus datos
          </Text>
        </View>
        <DetailRootModal />
      </View>
    );

  const renderRound = () => {
    if (!reduxRoundObject) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Ronda no encontrada</Text>
        </View>
      );
    }

    const roundComponent = reduxRoundObject.start ? (
      <StartedRound {...props} round={reduxRoundObject} auth={auth} />
    ) : (
      <CreatedRound {...props} round={reduxRoundObject} auth={auth} />
    );
    return (
      <>
        <DetailRootModal />
        {roundComponent}
      </>
    );
  };

  return requestRounds.loading || auth === null || !isLoaded ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Spinner color={colors.mainBlue} size={75} />
      <Text>Cargando información</Text>
    </View>
  ) : (
    renderRound()
  );
};

const mapStateToProps = state => {
  return {
    requestRounds: state.rounds.requestRounds,
  };
};

export default connect(
  mapStateToProps,
  { refreshRoundData: getRoundData, clearInvitation: invitationClean }
)(RoundDetail);
