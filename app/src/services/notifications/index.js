import firebase from "@react-native-firebase/app";
import "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-community/async-storage";
import * as UserService from "../api/user";
import { setAuth, getAuth } from "../../utils/utils";

const generateFirebaseAuth = async () => {
  const hasPermission = await firebase.messaging().hasPermission();

  if (hasPermission) {
    const token = await getFirebaseToken();

    refreshToken(token);

    // Set listener for token refresh
    firebase.messaging().onTokenRefresh(async newToken => {
      refreshToken(newToken, true);
    });

    return token;
  }
};

const refreshToken = async (newToken, refreshUser = false) => {
  if (refreshUser) {
    await UserService.updateToken(newToken);
  }
  const auth = await getAuth();
  if (auth !== null) setAuth({ ...auth, token: newToken });
};

const requestFirebasePermission = async () => {
  try {
    await firebase.messaging().requestPermission();
    const token = await generateFirebaseAuth();
    return token;
  } catch (error) {
    console.log("permission rejected");
  }
};

export const getFirebaseToken = async () => {
  let fcmToken = await AsyncStorage.getItem("fcmToken");
  if (!fcmToken) {
    fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      await AsyncStorage.setItem("fcmToken", fcmToken);
    }
  }
  return fcmToken;
};

export default requestFirebasePermission;
