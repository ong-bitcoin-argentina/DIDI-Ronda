import React from 'react';
import {StyleSheet} from 'react-native';
import {Icon, Text} from 'native-base';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Colors from '../colors';
import Tutorial from '../../screens/tutorial/Tutorial';
import Home from './MainNavigation';
import RoundsList from '../../screens/rounds';
import Auth from '../../screens/onboarding';
import LoadingAuth from '../../screens/onboarding/LoadingAuth';
import UserProfile from '../../screens/Settings/userProfile';
import Register from '../../screens/onboarding/Register';

const Main = createBottomTabNavigator(
  {
    Inicio: {screen: Home},
    Rondas: {
      screen: RoundsList,
    },
    Notificaciones: {screen: Home},
    Ajustes: {screen: UserProfile},
  },
  {
    initialRouteName: 'Rondas',
    defaultNavigationOptions: ({navigation}) => ({
      tabBarLabel: ({focused}) => {
        const {routeName} = navigation.state;
        let label;
        switch (routeName) {
          case 'Inicio':
            label = focused ? <Text style={styles.tabText}>Inicio</Text> : null;
            break;
          case 'Rondas':
            label = focused ? (
              <Text style={styles.tabText}>Mis Rondas</Text>
            ) : null;
            break;
          case 'Notificaciones':
            label = focused ? (
              <Text style={styles.tabText}>Notificaciones</Text>
            ) : null;
            break;
          case 'Ajustes':
            label = focused ? (
              <Text style={styles.tabText}>Ajustes</Text>
            ) : null;
            break;
          default:
            label = null;
        }
        return label;
      },
      tabBarIcon: ({tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;
        let iconFamily = null;
        switch (routeName) {
          case 'Inicio':
            iconName = `md-home`;
            break;
          case 'Rondas':
            iconName = 'filter-tilt-shift';
            iconFamily = 'MaterialIcons';
            break;
          case 'Notificaciones':
            iconName = `perm-contact-calendar`;
            iconFamily = 'MaterialIcons';
            break;
          case 'Ajustes':
            iconName = `md-settings`;
            break;
          default:
            break;
        }
        return (
          <Icon
            name={iconName}
            type={iconFamily}
            size={20}
            style={{color: tintColor, marginTop: 5}}
          />
        );
      },
    }),

    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: Colors.inactiveBlue,

      style: {
        backgroundColor: Colors.mainBlue,
      },
    },
  },
);

const MainContainer = createSwitchNavigator(
  {
    Auth: {
      screen: Auth,
    },
    LoadingAuth: {
      screen: LoadingAuth,
    },
    Tuto: {
      screen: Tutorial,
    },
    Main: {
      screen: Main,
    },
  },
  {
    initialRouteName: 'LoadingAuth',
    headerMode: 'none',
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
  },
);

const styles = StyleSheet.create({
  tabText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 11,
  },
});

export default createAppContainer(MainContainer);
