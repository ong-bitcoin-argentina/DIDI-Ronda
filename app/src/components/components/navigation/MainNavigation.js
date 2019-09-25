/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {View} from 'react-native';
import {Icon, Text} from 'native-base';
import FloatingActionButton from '../FloatingActionButton';
import {createStackNavigator} from 'react-navigation';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  static navigationOptions = {
    tabBarOptions: {
      showLabel: true,
    },
  };
  render() {
    return (
      <View style={{flexDirection: 'column', flex: 1}}>
        <Text>TEXTO</Text>
        {/* <FloatingActionButton /> */}
      </View>
    );
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
      headerRight: (
        <View style={{paddingRight: 20}}>
          <Icon name="md-more" style={{color: 'white'}} />
        </View>
      ),
    }),
  },
});
