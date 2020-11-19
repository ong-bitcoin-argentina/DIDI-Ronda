import React from "react";
import { StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import NotificationsList from "./NotificationsList";
import { getAuth } from "../../../utils/utils";
import colors from "../../components/colors";
import { connect } from "react-redux";
import * as notificationsActions from "../../../actions/notifications";
import { markAsViewed } from "../../../services/api/notification";

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  static navigationOptions = {
    tabBarOptions: {
      showLabel: true,
    },
  };

  async componentDidMount(props) {
    const user = await getAuth();
    this.setState({ user });
    await this.getNotifications();
    this.props.navigation.addListener("didFocus", this.getNotifications);
  }

  getNotifications = async () => {
    await this.props.getNotifications();
  };

  onMarkAsViewd = async () => {
    await markAsViewed();
    await this.getNotifications();
  };

  render() {
    const { bigLoading } = this.props;
    return (
      <SafeAreaView>
        {bigLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.mainBlue}
            style={{ marginTop: 80 }}
          />
        ) : (
          <>
            {this.props.loading && (
              <ActivityIndicator
                size="small"
                color={colors.mainBlue}
                style={styles.loader}
              />
            )}
            <NotificationsList onMarkAsViewd={this.onMarkAsViewd} />
          </>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    marginBottom: 10,
    padding: 5,
    justifyContent: "space-between",
    alignContent: "center",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#24CDD2",
    borderRadius: 8,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    marginVertical: 18,
  },
});

const NotificationsScreen = connect(
  state => ({
    loading: state.notifications.loading,
    bigLoading: !state.notifications.list.length && state.notifications.loading,
  }),
  dispatch => ({
    getNotifications: () => notificationsActions.getNotifications(dispatch),
  })
)(Notifications);

export default createStackNavigator({
  Notifications: {
    screen: NotificationsScreen,
    navigationOptions: () => ({
      title: `Notificaciones`,
      headerStyle: { backgroundColor: "#417fd7" },
      headerTitleStyle: {
        color: "white",
        width: "80%",
        textAlign: "left",
        fontSize: 18,
      },
    }),
  },
});
