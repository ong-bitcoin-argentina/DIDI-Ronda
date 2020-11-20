import React from "react";
import { Provider } from "react-redux";
import { Root } from "native-base";
import { MenuProvider } from "react-native-popup-menu";
import store from "./src/store/store";
import Nav from "./src/components/components/navigation/Nav";
import NavigationService from "./src/services/navigation";

import messaging from "@react-native-firebase/messaging";

import { initializePushNotification } from "./src/services/notifications/pushNotifications";

import moment from "moment";
import "moment/locale/es";
moment.locale("es");

const App = () => {
  initializePushNotification(navigator, store);

  messaging().setBackgroundMessageHandler(async notification => {
    console.log("Message handled in the background!", notification);
  });

  return (
    <Provider store={store}>
      <MenuProvider>
        <Root>
          <Nav
            ref={nav => {
              navigator = nav;
              NavigationService.setTopLevelNavigator(nav);
            }}
          />
        </Root>
      </MenuProvider>
    </Provider>
  );
};

export default App;
