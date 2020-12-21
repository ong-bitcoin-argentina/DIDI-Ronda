import firebase from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import { NavigationActions } from "react-navigation";
import { getAuth } from "../../utils/utils";
import store from "../../store/store";
import * as roundsActions from "../../actions/rounds";

// TODO:
// Enable/Disable notifications from config file
export const enabledNotifications = true;

// WITH OPEN APP
export const notificationListener = () => {
  const listener = messaging().onNotificationOpenedApp(notification => {
    console.log("notification", notification);
    const newNotification = new firebase.notifications.Notification({
      data: notification.data,
      sound: "default",
      show_in_foreground: true,
      title: notification.title,
      body: notification.body,
    });

    if (Platform.OS === "android") {
      newNotification.android
        .setPriority(firebase.notifications.Android.Priority.Max)
        .android.setAutoCancel(true)
        .android.setChannelId("ronda")
        .android.setVibrate(1000);
    }
    const { data } = notification;
    if (data && data.reloadRounds) store.dispatch(roundsActions.loadRounds());

    messaging().displayNotification(newNotification);
  });
  return messaging();
};

// BACKGROUND
export const notificationOpen = async (navigator, notificationData) => {
  console.log("notificationData", notificationData);
  let finalData = notificationData;
  if (!finalData) {
    const openNotificationData = await messaging().getInitialNotification();
    if (openNotificationData) {
      const { notification } = openNotificationData;
      const { data } = notification;
      finalData = data;
    }
  }

  // Check auth
  const auth = await getAuth();

  if (auth) {
    if (finalData && finalData.action) {
      const actionObject = JSON.parse(finalData.action);
      const { routeName, params, intent } = actionObject;

      // Reload rounds before navigate
      await store.dispatch(roundsActions.loadRounds());

      // Perform side effects on intent presence
      if (intent) await store.dispatch(roundsActions.intentManager(finalData));
      navigate(navigator, routeName, params);
    }
  }
};

// NAVIGATE
const navigate = (navigator, routeName, params) => {
  navigator.dispatch(NavigationActions.navigate({ routeName, params }));
};
