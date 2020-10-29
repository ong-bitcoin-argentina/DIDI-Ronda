import React from "react";
import { StyleSheet, Share, ScrollView } from "react-native";
import { connect } from "react-redux";
import { getAuth } from "../../../utils/utils";
import { openAidiCredentials, links } from "../../../utils/appRouter";
import { toRoundListPage } from "../../../utils/deepNavigation";
import colors from "../../components/colors";
import Card from "./Card";
import { cards, snippets } from "./helpers";
import { isActive, isFinished } from "../../../utils/roundsHelper";
import * as roundsActions from "../../../actions/rounds";
import * as notificationsActions from "../../../actions/notifications";
import Snippet from "./Snippet";
import WarningSCModal from "../../components/WarningSCModal";
import { notificationsCodes } from "../../../utils/constants";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      loading: true,
      showSCModal: false,
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
    const user = await this.updateUser();
    await this.getRoundData();
    this.handleSCWarning(user);
  }

  async getRoundData() {
    const { requestRounds, loadRounds } = this.props;
    if (requestRounds.list.length === 0) await loadRounds();
    this.setState({ loading: false });
  }

  async updateUser() {
    const user = await getAuth();
    this.setState({ user });
    this.props.navigation.setParams({
      title: `${user.name} ${user.lastname}`,
    });
    return user;
  }

  async updateSCModal() {
    await this.updateUser();
    this.setState({ showSCModal: false });
  }

  async handleSCWarning() {
    await this.props.getNotifications();
    const { user } = this.state;
    if (
      this.props.haveFailedRegisterNotification &&
      (!user._doc?.sc || !user.sc)
    ) {
      this.showSCWarning();
    }
  }

  showSCWarning = () => {
    this.setState({ showSCModal: true });
  };

  hideSCWarning = () => {
    this.setState({ showSCModal: false });
  };

  goToCredentials = () => openAidiCredentials();

  onShare = async () => {
    await Share.share({
      message: `¡Descargate la aplicación de ronda! Organizá y participá de rondas, juntas, vaquitas o pasanakus de forma fácil y segura. ${links.playstore}`,
    });
  };

  render() {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        style={{ backgroundColor: colors.lighterGray }}>
        {cards(this.props).map(round => (
          <Card
            round={round}
            onAction={page => this.props.navigateToRoundsPage(page)}
            loading={this.state.loading}
          />
        ))}
        <Snippet {...snippets[0]} onAction={this.onShare} />
        <Snippet {...snippets[1]} onAction={this.goToCredentials} />
        <WarningSCModal
          visible={this.state.showSCModal}
          onRequestClose={this.hideSCWarning}
          onConfirm={() => this.updateSCModal()}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.lighterGray,
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
    requestRounds: state.rounds.requestRounds,
    activeRounds: state.rounds.requestRounds.list.filter(isActive),
    finishedRounds: state.rounds.requestRounds.list.filter(isFinished),
    userData: state.userData.data,
    notifications: state.notifications,
    haveFailedRegisterNotification: state.notifications.list.some(
      item => item.code === notificationsCodes.errorSC,
    ),
  }),
  dispatch => ({
    navigateToRoundsPage: page => toRoundListPage(dispatch, page),
    loadRounds: () => dispatch(roundsActions.loadRounds()),
    getNotifications: () => notificationsActions.getNotifications(dispatch),
  }),
)(Home);
