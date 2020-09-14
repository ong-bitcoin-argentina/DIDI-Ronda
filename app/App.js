import React from 'react';
import {Provider} from 'react-redux';
import firebase from '@react-native-firebase/app';
import {Root} from 'native-base';
import {MenuProvider} from 'react-native-popup-menu';
import store from './src/store/store';
import Nav from './src/components/components/navigation/Nav';
import checkPermission from './src/services/notifications';
import {
  enabledNotifications,
  notificationListener,
  notificationOpen,
} from './src/services/notifications/bgActions';
import NavigationService from './src/services/navigation';

class App extends React.Component {
  async componentDidMount() {
    try {
      await checkPermission();

      // if (enabledNotifications) {
      //   // NOTIFICATIONS LISTENERS
      //   this.onNotificationListener = notificationListener(this.navigator);
      //   this.notificationOpenListener = firebase
      //     .messaging()
      //     .onNotificationOpened(({notification: {data}}) =>
      //       notificationOpen(this.navigator, data),
      //     );
      //   await notificationOpen(this.navigator);
      // }
      // We do not care about errors here
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }

  componentWillUnmount() {
    // Remove listeners to prevent double listeners
    // this.onNotificationListener();
    // this.notificationOpenListener();
  }

  render() {
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
}

export default App;
