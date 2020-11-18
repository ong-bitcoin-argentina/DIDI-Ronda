import { AppRegistry, YellowBox } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import messaging from "@react-native-firebase/messaging";
import {
  enabledNotifications,
  notificationListener,
  notificationOpen,
} from "./src/services/notifications/bgActions";
import PushNotification from "react-native-push-notification";
import store from "./src/store/store";
import roundaActions from "./src/actions/rounds";

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
  console.log("Message handled in the background!", remoteMessage);
  // notificationOpen(remoteMessage);
});

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
    console.log("TOKEN:", token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function(notification) {
    console.log("NOTIFICATION:", notification);

    if (notification.foreground && !notification.userInteraction) {
      const notificationData = {
        channelId: "ronda",
        title: notification.title,
        messege: notification.message,
        data: notification.data,
      };

      PushNotification.localNotification(notificationData);
    }

    if (
      notification.userInteraction &&
      notification.data &&
      notification.data.action
    ) {
      const { routeName, params } = notification.data.action;
      console.log(routeName, params);
      // store.dispatch(roundaActions.loadRounds());
    }
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function(notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  senderID: "323695863108",

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

AppRegistry.registerComponent(appName, () => App);
