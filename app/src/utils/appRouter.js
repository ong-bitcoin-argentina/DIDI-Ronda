import { Linking } from "react-native";
import dynamicLinks from "@react-native-firebase/dynamic-links";

export const links = {
  login: {
    deepLink: "aidi://login",
    dynamicLink: "https://aidi.page.link/XktS",
  },
  credentials: {
    deepLink: `aidi://credentials/ronda`,
    dynamicLink: "https://aidi.page.link/mKfG",
  },
};

export const openAdiLogin = async () => {
  await openApp(links.login);
};

export const openAidiCredentials = async () => {
  await openApp(links.credentials);
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
    Linking.removeEventListener("url", e =>
      console.log("removeEventListener", e),
    );
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
