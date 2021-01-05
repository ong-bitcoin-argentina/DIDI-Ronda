import React from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import { Text, Spinner, Tab, Tabs, TabHeading, Icon } from "native-base";
import { connect } from "react-redux";

import FloatingActionButton from "../../components/FloatingActionButton";
import RoundListItem from "./RoundsListItem";
import * as roundsActions from "../../../actions/rounds";
import * as notificationsActions from "../../../actions/notifications";
import colors from "../../components/colors";
import { getAuth } from "../../../utils/utils";
import WarningEditingRoundModal from "./WarningEditingRoundModal";
import { setEditRoundData, clearStore } from "../../../actions/roundCreation";
import { setRouteOptions } from "../../../actions/routeOptions";
import WarningSCModal from "../../components/WarningSCModal";
import { notificationsCodes } from "../../../utils/constants";
import ConfirmModal from "../../components/ConfirmModal";

const widthScreen = Dimensions.get("screen").width;

class RoundsList extends React.Component {
  state = {
    auth: null,
    openWarningEditModal: false,
    roundEditData: {},
    loading: true,
    showSCModal: false,
    confirmAlert: null,
  };

  async componentDidMount() {
    // Load rounds if = 0
    const { requestRounds, loadRounds, getAllStoredRounds } = this.props;
    if (requestRounds.list.length === 0) await loadRounds();
    await getAllStoredRounds();
    await this.updateAuth();
    this.handleSCWarning();
    this.setState({ loading: false });
  }

  onDeleteStoredRound = async roundIndex => {
    const { removeStoredRound } = this.props;
    await removeStoredRound(roundIndex);
  };

  updateAuth = async () => {
    const auth = await getAuth();

    this.setState({ auth });
  };

  showSCWarning = () => {
    this.setState({ showSCModal: true });
  };

  handleSCWarning = async () => {
    await this.props.getNotifications();
    const { auth } = this.state;
    if (
      this.props.haveFailedRegisterNotification &&
      (!auth._doc?.sc && !auth.sc)
    ) {
      this.showSCWarning();
    }
  };

  hideSCWarning = () => {
    this.setState({ showSCModal: false });
  };

  async updateSCModal() {
    await this.updateAuth();

    this.setState({ showSCModal: false });
  }

  showWarningModalResult = result => {
    const message = {
      title: result.error
        ? "Error al registrarte! Por favor, volvé a intertarlo"
        : "Reintento enviado con éxito! En unos minutos, recibirás una notificación confirmando tu registro",
      positive: () => this.setState({ confirmAlert: null }),
      iconType: this.state.auth === null ? "error" : null,
    };

    this.setState({ confirmAlert: message });
  };

  filterRounds = (roundsData, currentStatus) => {
    return roundsData.filter(r => {
      // Active tab
      if (currentStatus === "active")
        return (
          r.start &&
          r.shifts.find(s => ["pending", "current"].includes(s.status))
        );

      // To be active tab
      if (currentStatus === "starting") return !r.start;

      // Completed tab
      if (currentStatus === "completed")
        return !r.shifts.find(s => ["pending", "current"].includes(s.status));
      return false;
    });
  };

  manageStoredRoundPress = roundIndex => {
    const { nameFromCreation, storedRounds } = this.props;
    const roundEditData = storedRounds.find(r => r.roundIndex === roundIndex);

    if (nameFromCreation) {
      return this.setState({ openWarningEditModal: true, roundEditData });
    }

    return this.onContinueEditing(roundEditData);
  };

  onContinueEditing = roundData => {
    const { editRound, navigation } = this.props;
    editRound(roundData);
    this.clearModalData(() => navigation.navigate("ParticipantsAllSelected"));
  };

  clearModalData = (callback = () => {}) =>
    this.setState({ openWarningEditModal: false, roundEditData: {} }, callback);

  onCancelEditing = () => this.clearModalData();

  roundItemPress = params => {
    const { navigation } = this.props;
    if (params.isEditing) return this.manageStoredRoundPress(params.roundIndex);
    return navigation.navigate("RoundDetail", params);
  };

  static navigationOptions = {
    tabBarOptions: {
      showLabel: true,
    },
  };

  renderContent = (rounds, status) => {
    const { auth } = this.state;

    let roundsToRender = rounds;
    if (status === "starting") {
      const { storedRounds } = this.props;
      roundsToRender = [...storedRounds, ...roundsToRender];
    }

    roundsToRender = this.filterRounds(roundsToRender, status);
    // Nothing is available?
    if (roundsToRender.length === 0 && !this.state.loading) {
      return this.renderNoRoundsSection(status);
    }

    if (this.state.loading) return <Spinner />;
    // We have to append the list of rounds to Edit first.
    return (
      <FlatList
        data={roundsToRender}
        renderItem={({ item }) => (
          <RoundListItem
            detail={this.roundItemPress}
            onDeleteStoredRound={this.onDeleteStoredRound}
            {...item}
            auth={auth}
            pending
          />
        )}
        contentContainerStyle={styles.flatListContent}
      />
    );
  };

  renderNoRoundsSection = status => {
    const bodyText = "Para crear una ronda, hace click en\nel ";
    const boldBodyText = "círculo amarillo";
    const statuses = {
      active: "Aún no tenés rondas\nactivas",
      starting: "Aún no tenés rondas\nen curso",
      completed: "Aún no tenés rondas\nfinalizadas",
    };

    return (
      <View style={styles.noRoundsSectionContainer}>
        <View style={styles.warningIconContainer}>
          <Icon
            type="MaterialCommunityIcons"
            name="alert"
            style={styles.warningIcon}
          />
        </View>
        <View style={styles.warningTitleContainer}>
          <Text style={styles.warningTitle}>{statuses[status]}</Text>
        </View>
        <View style={styles.warningTextContainer}>
          <Text style={{ textAlign: "center" }}>
            {bodyText}
            <Text style={styles.warningBoldText}>{boldBodyText}</Text>
          </Text>
        </View>
      </View>
    );
  };

  renderTabs = () => {
    const { requestRounds } = this.props;
    const roundsList =
      requestRounds.list &&
      requestRounds.list.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    const tabsObj = [
      { title: "ACTIVAS", contentType: "active", key: 0 },
      { title: "POR INICIAR", contentType: "starting", key: 1 },
      { title: "TERMINADAS", contentType: "completed", key: 2 },
    ];
    return tabsObj.map(t => (
      <Tab
        key={t.key}
        heading={
          <TabHeading style={styles.roundsTabs}>
            <Text style={styles.tabTitle}>{t.title}</Text>
          </TabHeading>
        }>
        {this.renderContent(roundsList, t.contentType)}
      </Tab>
    ));
  };

  handleChangeTab = async event => {
    this.props.saveRouteOptions({ roundsList: { page: event.i } });
    this.setState({ loading: true });
    await this.props.loadRounds(event);
    this.setState({ loading: false });
  };

  render() {
    const { navigation, clearData, activePage } = this.props;
    const { roundEditData, openWarningEditModal, showSCModal } = this.state;

    return (
      <View style={styles.container}>
        <Tabs
          onChangeTab={this.handleChangeTab}
          initialPage={activePage}
          page={activePage}
          locked>
          {this.renderTabs()}
        </Tabs>

        <FloatingActionButton
          clearData={clearData}
          nav={val => navigation.navigate(val)}
        />

        <WarningEditingRoundModal
          open={openWarningEditModal}
          roundName={roundEditData.name}
          round={roundEditData}
          onCancel={this.onCancelEditing}
          onContinue={this.onContinueEditing}
        />

        <WarningSCModal
          visible={showSCModal}
          onRequestClose={this.hideSCWarning}
          onConfirm={() => this.updateSCModal()}
          onFinish={result => this.showWarningModalResult(result)}
        />
        {this.state.confirmAlert && (
          <ConfirmModal {...this.state.confirmAlert} />
        )}
      </View>
    );
  }
}
const mapStateToPropsList = state => {
  return {
    requestRounds: state.rounds.requestRounds,
    storedRounds: state.rounds.storedRounds,
    nameFromCreation: state.roundCreation.name,
    activePage: state.routeOptions?.roundsList?.page,
    haveFailedRegisterNotification: state.notifications.list.some(
      item => item.code === notificationsCodes.errorSC
    ),
  };
};

const mapDispatchToPropsList = dispatch => ({
  loadRounds: () => dispatch(roundsActions.loadRounds()),
  getAllStoredRounds: () => dispatch(roundsActions.getAllStoredRounds()),
  clearData: () => dispatch(clearStore()),
  removeStoredRound: roundIndex =>
    dispatch(roundsActions.removeStoredRound(roundIndex)),
  editRound: round => dispatch(setEditRoundData(round)),
  saveRouteOptions: options => dispatch(setRouteOptions(options)),
  getNotifications: () => notificationsActions.getNotifications(dispatch),
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  titleContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: colors.mainBlue,
    fontSize: 18,
    fontWeight: "bold",
  },
  flatListContent: {
    marginTop: 40,
    paddingBottom: 100,
  },
  roundsTabs: {
    backgroundColor: colors.mainBlue,
  },
  tabTitle: {
    fontSize: widthScreen < 360 ? 14 : 16,
  },
  warningIconContainer: {
    flexDirection: "row",
  },
  warningTitleContainer: {
    flexDirection: "row",
    marginVertical: 15,
  },
  warningTextContainer: {
    flexDirection: "row",
  },
  warningTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "bold",
    color: colors.mainBlue,
    textAlign: "center",
  },
  warningIcon: {
    color: colors.yellow,
    fontSize: 60,
  },
  warningBoldText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  noRoundsSectionContainer: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default connect(
  mapStateToPropsList,
  mapDispatchToPropsList
)(RoundsList);
