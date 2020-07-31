import React from 'react';
import {View} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';

class Home extends React.Component {
  static navigationOptions = {
    tabBarOptions: {
      showLabel: true,
    },
  };

  render() {
    return <View style={{flexDirection: 'column', flex: 1}} />;
  }
}

export default createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: () => ({
      title: `Mis Rondas`,
      headerStyle: {backgroundColor: '#417fd7'},
      headerTitleStyle: {
        color: 'white',
        width: '80%',
        textAlign: 'left',
        fontSize: 18,
      },
    }),
  },
});
