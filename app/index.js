/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// FOR react-native-swipeout LIBRARY
import {YellowBox} from 'react-native'

YellowBox.ignoreWarnings([
  'Warning: componentWillMount',
  'Warning: componentWillReceiveProps'
])
// ./FOR react-native-swipeout LIBRARY


AppRegistry.registerComponent(appName, () => App);