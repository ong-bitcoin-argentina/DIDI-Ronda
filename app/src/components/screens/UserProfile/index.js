import React, {Component} from 'react';
import {StyleSheet, ScrollView, Image, Dimensions} from 'react-native';
import {Icon, View, Text, Tab, Tabs, TabHeading} from 'native-base';
import colors from '../../components/colors';
import Swap from './Swap';
import ContextualMenu from './contextualMenu';

const UserData = () => {
  return (
    <View style={styles.userData}>
      <View style={[styles.userDataInfo]}>
        <Icon
          type="MaterialIcons"
          name="filter-tilt-shift"
          style={styles.userDataInfoIcon}
        />
        <Text style={styles.userDataInfoValue}>4</Text>
        <Text style={styles.userDataInfoText}>Rondas que participó</Text>
      </View>
      <View
        style={[
          styles.userDataInfo,
          {borderWidth: 1, borderRadius: 1, margin: -5, paddingVertical: 12},
        ]}>
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

        <Text style={styles.userDataInfoValue}>2</Text>
        <Text style={styles.userDataInfoText}>Rondas completadas</Text>
      </View>
      <View style={[styles.userDataInfo]}>
        <Icon
          type="MaterialCommunityIcons"
          name="ticket"
          style={styles.userDataInfoIcon}
        />
        <Text style={styles.userDataInfoValue}>+70</Text>
        <Text style={styles.userDataInfoText}>Puntaje</Text>
      </View>
    </View>
  );
};

class UserProfile extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerRight: (
        <ContextualMenu
          navigation={navigation}
          participant={navigation.getParam('participant', null)}
        />
      ),
    };
  };

  render() {
    const participant = this.props.navigation.getParam('participant', null);

    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
              <Image
                source={{
                  uri: participant.user.picture,
                }}
                style={{
                  marginTop: 15,
                  width: 150,
                  height: 150,
                  borderRadius: 150 / 2,
                }}
              />
              <Text style={styles.profileName}>@{participant.user.name}</Text>
            </View>
            <UserData />
          </View>
          <View style={styles.profileContainer}>
            <Tabs tabBarUnderlineStyle={styles.tabHeaderBorder}>
              <Tab
                heading={
                  <TabHeading style={styles.tabHeader}>
                    <Text style={styles.tabHeaderText}>REEMPLAZAR</Text>
                  </TabHeading>
                }>
                <Swap {...this.props} participant={participant} />
              </Tab>
              <Tab
                heading={
                  <TabHeading style={styles.tabHeader}>
                    <Text style={styles.tabHeaderText}>MENSAJEAR</Text>
                  </TabHeading>
                }>
                {/* <Swap /> */}
                <Text>OKA</Text>
              </Tab>
            </Tabs>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
  },
  avatarContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.secondaryBackground,
    width: '100%',
  },
  profileContainer: {
    flex: 1,
  },
  profileName: {
    marginTop: 5,
    color: colors.secondary,
    fontWeight: 'bold',
  },
  separator: {
    borderStyle: 'dotted',
    borderWidth: 1,
    borderRadius: 1,
  },
  userData: {
    marginTop: 5,
    flex: 1,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 5,
    overflow: 'hidden',
  },
  userDataInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderStyle: 'dashed',
    borderColor: colors.secondary,
  },
  userDataInfoValue: {
    color: '#000',
    fontSize: 17,
    fontWeight: 'bold',
  },
  userDataInfoText: {
    color: colors.secondary,
    fontSize: 14,
    textAlign: 'center',
  },
  userDataInfoIcon: {
    color: colors.mainBlue,
    marginBottom: 5,
  },
  userDataIconCheck: {
    position: 'absolute',
    zIndex: 100,
    top: 8,
    right: 37,
    fontSize: 20,
  },
  tabHeader: {
    backgroundColor: colors.secondaryBackground,
  },
  tabHeaderText: {
    color: '#333',
    fontSize: 12,
  },
  tabHeaderBorder: {
    borderBottomWidth: 3,
    borderColor: colors.mainBlue,
    backgroundColor: colors.secondaryBackground,
  },
});

export default UserProfile;
