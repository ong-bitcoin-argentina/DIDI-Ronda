import { Linking } from "react-native";
import dynamicLinks from "@react-native-firebase/dynamic-links";

export const links = {
  login: {
    deepLink: "aidi://login",
    dynamicLink: "https://nextdidi.page.link/TG78",
  },
  credentials: {
    deepLink: `aidi://credentials/ronda`,
    dynamicLink: "https://nextdidi.page.link/XktS",
  },
  playstore: "https://play.google.com/apps/internaltest/4699395559909911910",
  urlPlaystore: "https://play.google.com/store/apps/details?id=com.aidi",
};

export const openAdiLogin = async () => {
  await openApp(links.login);
};

export const openAidiCredentials = async () => {
  await openApp(links.credentials);
};

export const openPlayStoreToUpdateAidi = async () => {
  Linking.openURL(links.urlPlaystore);
};

export const openApp = async ({ dynamicLink, deepLink }) => {
  const canOpenURL = await Linking.canOpenURL(deepLink);
  if (canOpenURL) Linking.openURL(deepLink);
  else Linking.openURL(dynamicLink);
};

export const deepLinkHandler = myHandler => {
  Linking.getInitialURL().then(myHandler);
  Linking.addEventListener("url", myHandler);
  return () => {
    Linking.removeEventListener("url", myHandler);
  };
};

export const dynamicLinkHandler = myHandler => {
  dynamicLinks()
    .getInitialLink()
    .then(myHandler);
  const unsubscribe = dynamicLinks().onLink(myHandler);
  return () => {
    console.log("removing listeners");
    unsubscribe();
  };
};

export const loginSuccess = link => {
  if (!link) return false;
  const url = link.url ? link.url : link;
  return url.match(/loginSuccess/);
};

export const loginDenied = link => {
  if (!link) return false;
  const url = link.url ? link.url : link;
  return url.match(/loginDenied/);
};

export const getToken = link => {
  if (!link) return false;
  const url = link.url ? link.url : link;
  const token = url.split("token=").pop();
  return token;
};
