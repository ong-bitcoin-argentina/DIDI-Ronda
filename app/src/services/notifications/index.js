import { Platform } from "react-native";
import firebase from "react-native-firebase";
import AsyncStorage from "@react-native-community/async-storage";
import * as UserService from "../api/user";
import { setAuth, getAuth } from "../../utils/utils";

const checkPermission = async () => {
  // Android channel
  if (Platform.OS === "android") {
    const channel = new firebase.notifications.Android.Channel(
      "ronda",
      "Ronda",
      firebase.notifications.Android.Importance.Max
    ).setDescription("La Ronda app");
    await firebase.notifications().android.createChannel(channel);
  }

  const hasPermission = await firebase.messaging().hasPermission();

  if (hasPermission) {
    const token = await getToken();

    // Refresh token if is null
    refreshToken(token);

    // Set listener for token refresh
    // TODO: Error handler
    firebase.messaging().onTokenRefresh(async newToken => {
      refreshToken(newToken);
    });

    return token;
  }
  return requestPermission();
};

const refreshToken = async newToken => {
  await UserService.updateToken(newToken);
  const auth = await getAuth();
  if (auth !== null) setAuth({ ...auth, token: newToken });
};

const requestPermission = async () => {
  try {
    await firebase.messaging().requestPermission();
    await checkPermission();
  } catch (error) {
    console.log("permission rejected");
  }
};

export const getToken = async () => {
  let fcmToken = await AsyncStorage.getItem("fcmToken");
  if (!fcmToken) {
    fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      await AsyncStorage.setItem("fcmToken", fcmToken);
    }
  }
  return fcmToken;
};

export default checkPermission;
