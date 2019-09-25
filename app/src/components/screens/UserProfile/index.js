import React, {Component} from 'react';
import {StyleSheet, ScrollView, Image, Dimensions} from 'react-native';
import {
  Icon,
  View,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Header,
  Tab, 
  Tabs,
  TabHeading
} from 'native-base';
import {createStackNavigator} from 'react-navigation';
import colors from '../../components/colors';

import Swap from './Swap';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SCREEN_HEIGHT = Dimensions.get('window').height;

const AvatarSize = SCREEN_HEIGHT > 600 ? SCREEN_WIDTH / 2.5 : SCREEN_WIDTH / 3;

const UserData = () => {
  return (
    <View style={styles.userData}>
      <View style={styles.userDataInfo}>
        <Icon type="MaterialIcons" name="filter-tilt-shift" style={styles.userDataInfoIcon} />
        <Text style={styles.userDataInfoValue}>4</Text>
      </View>
      <View style={styles.userDataInfo}>
        <Icon name="md-timer" style={styles.userDataInfoIcon} />
        <Text style={styles.userDataInfoValue}>2</Text>
      </View>
      <View style={styles.userDataInfo}>
        <Icon name="play" style={styles.userDataInfoIcon} />
        <Text style={styles.userDataInfoValue}>4</Text>
      </View>
    </View>
  );
};
class UserProfile extends Component {


  render() {

    const participant = this.props.navigation.getParam('participant', null)

    return (
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <View style={{alignItems: 'center', flexDirection: 'column'}}>
            <Image
              source={{
                uri:
                  participant.user.picture
              }}
              style={{
                width: AvatarSize,
                height: AvatarSize,
                borderRadius: AvatarSize / 2,
              }}
            />
            <Text style={styles.profileName}>@{ participant.user.name }</Text>
          </View>
          <UserData></UserData>
        </View>
        <View style={styles.profileContainer}>

          <Tabs tabBarUnderlineStyle={ styles.tabHeaderBorder }>
            <Tab heading={
              <TabHeading style={ styles.tabHeader }>
                <Text style={ styles.tabHeaderText }>REMPLAZAR</Text>
              </TabHeading>
            }>
              <Swap {...this.props} participant={ participant } />
            </Tab>
            <Tab heading={
              <TabHeading style={ styles.tabHeader }>
                <Text style={ styles.tabHeaderText }>MENSAJEAR</Text>
              </TabHeading>
            }>
              {/* <Swap /> */}
              <Text>OKA</Text>
            </Tab>
          </Tabs>
          
        </View>
      </View>
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
    flex: 1,
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
    flex: 0.5,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  userDataInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  userDataInfoValue: {
    color: colors.secondary,
    fontSize: 22,
  },
  userDataInfoIcon: {
    color: colors.mainBlue,
  },
  tabHeader: {
    backgroundColor: colors.secondaryBackground,
  },
  tabHeaderText: {
    color: '#333',
    fontSize: 12
  },
  tabHeaderBorder: {
    borderBottomWidth: 3, 
    borderColor: colors.mainBlue,
    backgroundColor: colors.secondaryBackground,
  }
});

export default UserProfile;