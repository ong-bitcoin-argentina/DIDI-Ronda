import React, {Fragment} from 'react';
import {Provider} from 'react-redux';
import store from './src//store/store';
import Nav from './src/components/components/navigation/Nav';
import {Root} from 'native-base';
import checkPermission, {getToken} from './src/services/notifications';
import {MenuProvider} from 'react-native-popup-menu';
import { enabledNotifications, notificationListener, notificationOpen } from './src/services/notifications/bgActions';

class App extends React.Component {
  async componentDidMount() {

    try {
      await checkPermission();

      if( enabledNotifications ){
        // NOTIFICATIONS LISTENERS
        notificationListener( this.navigator );
        await notificationOpen( this.navigator );
      }

    } catch (error) {
    }

  }

  render() {
    return (
      <Provider store={store}>
        <MenuProvider>
          <Root>
            <Nav ref={nav => { this.navigator = nav }} />
          </Root>
        </MenuProvider>
      </Provider>
    );
  }
}

export default App;
