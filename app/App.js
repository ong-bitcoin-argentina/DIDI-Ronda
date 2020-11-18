import React, { useEffect } from "react";
import { Provider } from "react-redux";
import firebase from "@react-native-firebase/app";
import { Root } from "native-base";
import { MenuProvider } from "react-native-popup-menu";
import store from "./src/store/store";
import Nav from "./src/components/components/navigation/Nav";
import checkPermission from "./src/services/notifications";

import NavigationService from "./src/services/navigation";
import messaging from "@react-native-firebase/messaging";

import PushNotification from "react-native-push-notification";

import moment from "moment";
import "moment/locale/es";
moment.locale("es");

const App = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });

    PushNotification.localNotification({
      title: "Ronda",
      message:
        'La ronda Test se ha procesado! Ya podés entrar desde la sección rondas "Por Iniciar"',
      channelId: "ronda",
      foreground: true,
      userInteraction: false,
      data: {
        action: {
          routeName: "RoundDetail",
          params: { _id: "5fb5411b85f379a7feaef701" },
        },
      },
    });
    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <MenuProvider>
        <Root>
          <Nav
            ref={nav => {
              NavigationService.setTopLevelNavigator(nav);
            }}
          />
        </Root>
      </MenuProvider>
    </Provider>
  );
};

export default App;
