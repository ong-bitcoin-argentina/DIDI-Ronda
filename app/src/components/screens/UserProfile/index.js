import React, { Component } from "react";
import { StyleSheet } from "react-native";
import {
  View,
  Text,
  Tab,
  Tabs,
  TabHeading,
  Content,
  Container,
} from "native-base";
import colors from "../../components/colors";
import Swap from "./Swap";
import ContextualMenu from "./contextualMenu";
import Avatar from "../../components/Avatar";

/**
 * User Profile in Pending to Start Rounds
 */
class UserProfile extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <ContextualMenu
          navigation={navigation}
          participant={navigation.getParam("participant", null)}
        />
      ),
    };
  };

  render() {
    const { navigation } = this.props;
    const participant = navigation.getParam("participant", null);

    return (
      <Container>
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <View
              style={{
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                marginBottom: 15,
                marginTop: 10,
              }}>
              <Avatar path={participant.user.picture} size={100} />
              <Text style={styles.profileName}>@{participant.user.name}</Text>
            </View>
          </View>

          <Tabs tabBarUnderlineStyle={styles.tabHeaderBorder} locked>
            <Tab
              heading={
                <TabHeading style={styles.tabHeader}>
                  <Text style={styles.tabHeaderText}>REEMPLAZAR</Text>
                </TabHeading>
              }>
              <Content>
                <Swap {...this.props} participant={participant} />
              </Content>
            </Tab>
          </Tabs>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundGray,
  },
  avatarContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.secondaryBackground,
    width: "100%",
  },

  profileName: {
    marginTop: 5,
    color: colors.secondary,
    fontWeight: "bold",
  },
  tabHeader: {
    backgroundColor: colors.secondaryBackground,
  },
  tabHeaderText: {
    color: "#333",
    fontSize: 12,
  },
  tabHeaderBorder: {
    borderBottomWidth: 3,
    borderColor: colors.mainBlue,
    backgroundColor: colors.secondaryBackground,
  },
});

export default UserProfile;
