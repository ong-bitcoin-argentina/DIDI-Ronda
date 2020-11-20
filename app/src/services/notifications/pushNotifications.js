import PushNotification from "react-native-push-notification";
import { NavigationActions } from "react-navigation";
import * as roundaActions from "../../actions/rounds";

export const initializePushNotification = (navigator, store) => {
  PushNotification.configure({
    onNotification: function(notification) {
      if (!notification.userInteraction) {
        const notificationObject = {
          title: notification.title,
          message: notification.message,
          channelId: "ronda",
          foreground: true,
          userInteraction: false,
          data: notification.data,
          smallIcon: "@drawable/ic_notification",
        };

        PushNotification.localNotification(notificationObject);
      }

      if (
        notification.userInteraction &&
        (notification.data.action || notification.action)
      ) {
        // Messeges recived in background doesn't have data info
        const action = notification.data.action
          ? notification.data.action
          : notification.action;
        const { routeName, params } = JSON.parse(action);
        store.dispatch(roundaActions.loadRounds());
        navigator.dispatch(NavigationActions.navigate({ routeName, params }));
      }
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function(err) {
      console.error(err.message, err);
    },

    popInitialNotification: false,
    senderID: "323695863108",
    requestPermissions: true,
  });
};
