import { AppRegistry, YellowBox } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import messaging from '@react-native-firebase/messaging';
import {
  enabledNotifications,
  notificationListener,
  notificationOpen,
} from './src/services/notifications/bgActions';

global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
global.FormData = global.originalFormData || global.FormData;

// Workaround to inspect network requests
if (window.FETCH_SUPPORT) {
  window.FETCH_SUPPORT.blob = false;
} else {
  global.Blob = global.originalBlob || global.Blob;
  global.FileReader = global.originalFileReader || global.FileReader;
}

YellowBox.ignoreWarnings([
  "Warning: componentWillMount",
  "Warning: componentWillReceiveProps",
]);
// ./FOR react-native-swipeout LIBRARY

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  notificationOpen(remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
