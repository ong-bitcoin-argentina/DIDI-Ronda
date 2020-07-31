import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Icon, Button} from 'native-base';
import {createStackNavigator} from 'react-navigation-stack';
import {createSwitchNavigator} from 'react-navigation';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Colors from '../../components/colors';
import RoundCreation from '../roundsCreation/RoundCreation';
import RoundsList from './RoundsList';
import RoundDetail from '../RoundDetail';
import NumberDetail from '../NumberDetail';
import NumberPay from '../NumberDetail/NumberPay';
import UserProfile from '../UserProfile';
import {logOut} from '../../../utils/utils';
import HeaderRightMenu from '../RoundDetail/HeaderRIghtMenu';

const styles = StyleSheet.create({
  optionText: {
    fontSize: 18,
    color: Colors.gray,
  },
  menuView: {
    height: '100%',
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleStyle: {
    color: 'white',
    width: '80%',
    textAlign: 'left',
    fontSize: 18,
  },
  colorWhite: {
    color: 'white',
  },
});

const logoutFunction = async () => {
  logOut();
};

const menuOptions = () => (
  <Menu>
    <MenuTrigger>
      <View style={styles.menuView}>
        <Icon name="md-more" style={styles.colorWhite} />
      </View>
    </MenuTrigger>
    <MenuOptions>
      <MenuOption onSelect={logoutFunction}>
        <Text style={styles.optionText}>Cerrar Sesión</Text>
      </MenuOption>
    </MenuOptions>
  </Menu>
);

const renderBackButton = goBack => (
  <Button transparent onPress={() => goBack()}>
    <Icon style={styles.colorWhite} name="arrow-back" />
  </Button>
);

const List = createStackNavigator({
  List: {
    screen: RoundsList,
    navigationOptions: () => ({
      headerBackTitle: null,
      headerBackStyle: styles.colorWhite,
      title: `Ronda`,
      headerStyle: {backgroundColor: '#417fd7', elevation: 0},
      headerTitleStyle: styles.headerTitleStyle,
      headerRight: menuOptions(),
    }),
  },
  NumberDetail: {
    screen: NumberDetail,
    navigationOptions: () => ({
      headerBackTitle: null,
      headerBackStyle: styles.colorWhite,

      title: `Número`,
      headerTintColor: 'white',
      headerStyle: {backgroundColor: '#417fd7'},
      headerTitleStyle: styles.headerTitleStyle,
      headerRight: menuOptions(),
    }),
  },
  NumberPay: {
    screen: NumberPay,
    navigationOptions: () => ({
      headerBackTitle: null,
      headerBackStyle: styles.colorWhite,
      title: `Pagar`,
      headerTintColor: 'white',
      headerStyle: {backgroundColor: '#417fd7'},
      headerTitleStyle: styles.headerTitleStyle,
      headerRight: menuOptions(),
    }),
  },
  RoundDetail: {
    screen: RoundDetail,
    navigationOptions: ({navigation}) => ({
      headerBackTitle: null,
      headerBackStyle: styles.colorWhite,
      headerTintColor: 'white',
      title: `Mis Rondas`,
      headerStyle: {backgroundColor: '#417fd7'},
      headerTitleStyle: styles.headerTitleStyle,
      headerLeft: renderBackButton(navigation.goBack),
      headerRight: HeaderRightMenu(navigation),
    }),
  },
  UserProfile: {
    screen: UserProfile,
    navigationOptions: ({navigation}) => ({
      title: `Participante`,
      headerStyle: {backgroundColor: '#417fd7'},
      headerTitleStyle: styles.headerTitleStyle,
      headerLeft: renderBackButton(navigation.goBack),
    }),
  },
});

export default createSwitchNavigator(
  {
    List: {
      screen: List,
    },
    Create: {
      screen: RoundCreation,
    },
    headerMode: 'none',
  },
  {
    backBehavior: 'initialRoute',
    initialRouteName: 'List',
  },
);
