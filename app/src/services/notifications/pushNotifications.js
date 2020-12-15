import PushNotification from "react-native-push-notification";
import { NavigationActions } from "react-navigation";
import * as roundsActions from "../../actions/rounds";

let navigator = null;

export const setNavigator = nav => {
  navigator = nav;
};

export const initializePushNotification = store => {
  PushNotification.configure({
    onNotification: async function(notification) {
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

        const actionObject = JSON.parse(action);
        redirectUserToContext(actionObject, store);
      }
    },

    popInitialNotification: true,
    senderID: "323695863108",
    requestPermissions: true,
  });
};

export const redirectUserToContext = async (action, store) => {
  const { routeName, params, intent } = action;

  await store.dispatch(roundsActions.loadRounds());
  if (intent) await store.dispatch(roundsActions.intentManager({ action }));
  navigator.dispatch(NavigationActions.navigate({ routeName, params }));
};

export const resetNotificationCount = () => {
  PushNotification.setApplicationIconBadgeNumber(0);
};
