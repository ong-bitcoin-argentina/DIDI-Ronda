import React, { useEffect } from 'react';
import {Provider} from 'react-redux';
import firebase from '@react-native-firebase/app';
import {Root} from 'native-base';
import {MenuProvider} from 'react-native-popup-menu';
import store from './src/store/store';
import Nav from './src/components/components/navigation/Nav';
import checkPermission from './src/services/notifications';

import NavigationService from './src/services/navigation';
import messaging from '@react-native-firebase/messaging';

const App = () => {

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <MenuProvider>
        <Root>
          <Nav
            ref={nav => {
              this.navigator = nav;
              NavigationService.setTopLevelNavigator(nav);
            }}
          />
        </Root>
      </MenuProvider>
    </Provider>
  );
}

export default App;
