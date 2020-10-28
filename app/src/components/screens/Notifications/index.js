import React from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import * as UserService from "../../../services/api/user";
import moment from "moment";
import NotificationsList from "./NotificationsList";
import { getAuth } from "../../../utils/utils";
import colors from "../../components/colors";

const aWeekAgo = moment().subtract(7, "days");

const isRecent = date => {
  const myDate = moment(date);
  return myDate.isAfter(aWeekAgo);
};

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recent: [],
      old: [],
      loading: true,
      bigLoading: true,
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
    this.setState({ user }, this.getNotifications);
    this.props.navigation.addListener("didFocus", this.getNotifications);
  }

  getNotifications = async () => {
    const { user, old, recent } = this.state;
    if (user) {
      const { username } = user;
      try {
        this.setState({ loading: true });
        if (!old.length && !recent.length) this.setState({ bigLoading: true });
        const response = await UserService.getNotifications(username);
        const { items } = response.data;
        this.setState({
          recent: items.filter(item => isRecent(item.date)),
          old: items.filter(item => !isRecent(item.date)),
          loading: false,
          bigLoading: false,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  renderContent = () => {
    return (
      <>
        {this.state.loading && (
          <ActivityIndicator
            size="small"
            color={colors.mainBlue}
            style={styles.loader}
          />
        )}
        <NotificationsList data={this.state} />
      </>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.bigLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.mainBlue}
            style={{ marginTop: 80 }}
          />
        ) : (
          this.renderContent()
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 20,
  },
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

export default createStackNavigator({
  Notifications: {
    screen: Notifications,
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
