import React from "react";
import { StyleSheet, Share, ScrollView } from "react-native";
import { connect } from "react-redux";
import { getAuth } from "../../../utils/utils";
import { openAidiCredentials, links } from "../../../utils/appRouter";
import { toRoundListPage } from "../../../utils/deepNavigation";
import colors from "../../components/colors";
import AsyncStorage from "@react-native-community/async-storage";
import Card from "./Card";
import { cards, snippets } from "./helpers";
import { isActive, isFinished } from "../../../utils/roundsHelper";
import Snippet from "./Snippet";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: params.title ?? "Inicio",
      // Similarly for the rest
      tabBarOptions: {
        showLabel: true,
      },
    };
  };

  async componentDidMount() {
    const user = await getAuth();
    this.setState({ user: user });
    this.props.navigation.setParams({
      title: `${user.name} ${user.lastname}`,
    });
    const fcmToken = await AsyncStorage.getItem("fcmToken");
    console.log({ fcmToken });
  }

  goToCredentials = () => openAidiCredentials();

  onShare = async () => {
    await Share.share({
      message: `¡Descargate la aplicación de ronda! Organizá y participá de rondas, juntas, vaquitas o pasanakus de forma fácil y segura. ${links.playstore}`,
    });
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {cards(this.props).map(round => (
          <Card round={round} />
        ))}
        <Snippet {...snippets[0]} onAction={this.onShare} />
        <Snippet {...snippets[1]} onAction={this.goToCredentials} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    padding: 10,
    backgroundColor: colors.lighterGray,
    height: "100%",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#24CDD2",
    borderRadius: 8,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    marginBottom: 10,
  },
});

export default connect(
  state => ({
    activeRounds: state.rounds.requestRounds.list.filter(isActive),
    finishedRounds: state.rounds.requestRounds.list.filter(isFinished),
    userData: state.userData.data,
  }),
  dispatch => ({
    navigateToRoundsPage: page => toRoundListPage(dispatch, page),
  }),
)(Home);
