import { Linking } from "react-native";
import dynamicLinks from "@react-native-firebase/dynamic-links";

export const openAdiLogin = async () => {
    const params = {
        dynamicLink : `https://aidi.page.link/XktS`,
        deppLink : `aidi://login`
    }
    await openApp(params);
}

export const openAidiCredentials = async () => {
    const params = {
        dynamicLink: "https://aidi.page.link/mKfG",
        deppLink: "aidi://credentials/ronda"
    }
    await openApp(params);
}

export const openApp = async ({ dynamicLink, deppLink }) => {
    const canOpenURL = await Linking.canOpenURL(deppLink);
    if (canOpenURL) Linking.openURL(deppLink);
    else Linking.openURL(dynamicLink);
}

export const deepLinkHandler = (myHandler) => {
    Linking.getInitialURL().then(myHandler);
    Linking.addEventListener("url",myHandler);
    return () => { Linking.removeEventListener("url", e => console.log("removeEventListener",e)); }
}

export const dynamicLinkHandler = (myHandler) => {
    dynamicLinks().getInitialLink().then(myHandler);
    const unsubscribe = dynamicLinks().onLink(myHandler);
    return () => { console.log("removing listeners"); unsubscribe() };
}

export const loginSuccess = (link) => {
    if (!link) return false;
    const url = link.url ? link.url : link;
    return url.match(/loginSuccess/);
}

export const loginDenied = (link) => {
    if (!link) return false;
    const url = link.url ? link.url : link;
    return url.match(/loginDenied/);
}

export const getToken = (link) => {
    if (!link) return false;
    const url = link.url ? link.url : link;
    const token = url.split('token=').pop();
    return token;
}