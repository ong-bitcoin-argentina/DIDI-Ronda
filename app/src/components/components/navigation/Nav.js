import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {Icon, Text} from 'native-base';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';
import Colors from '../colors.js';
import Tutorial from '../../screens/tutorial/Tutorial.js';
import Home from './MainNavigation';
import RoundsList from '../../screens/rounds';
import logo from '../../../assets/img/logo.png';
import RoundCreation from '../../screens/roundsCreation/RoundCreation.js';

const Main = createBottomTabNavigator(
  {
    Inicio: {screen: Home},
    Rondas: {
      screen: RoundsList,
    },
    Notificaciones: {screen: Home},
    Ajustes: {screen: Home},
  },
  {
    initialRouteName: 'Rondas',
    defaultNavigationOptions: ({navigation}) => ({
      tabBarLabel: ({focused}) => {
        const {routeName} = navigation.state;
        let label;
        switch (routeName) {
          case 'Inicio':
            return (label = focused ? (
              <Text style={styles.tabText}>Inicio</Text>
            ) : null);
          case 'Rondas':
            return (label = focused ? (
              <Text style={styles.tabText}>Mis Rondas</Text>
            ) : null);
          case 'Notificaciones':
            return (label = focused ? (
              <Text style={styles.tabText}>Notificaciones</Text>
            ) : null);
          case 'Ajustes':
            return (label = focused ? (
              <Text style={styles.tabText}>Austes</Text>
            ) : null);
        }
        return label;
      },
      tabBarIcon: ({f, tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === 'Inicio') {
          iconName = `md-home`;
        } else if (routeName === 'Rondas') {
          return (
            <Icon
              size={20}
              style={{color: tintColor, marginTop: 5}}
              type="MaterialIcons"
              name="filter-tilt-shift"
            />
          );
        } else if (routeName === 'Notificaciones') {
          iconName = `md-contact`;
        } else if (routeName === 'Ajustes') {
          iconName = `md-settings`;
        }
        return (
          <Icon
            name={iconName}
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
    Tuto: {
      screen: Tutorial,
    },
    Main: {
      screen: Main,
    },
  },
  {
    initialRouteName: 'Tuto',
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
