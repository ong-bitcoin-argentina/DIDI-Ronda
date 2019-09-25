/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {Provider} from 'react-redux';
import store from './src//store/store';
import Nav from './src/components/components/navigation/Nav';
import { Root } from "native-base";

import {MenuProvider} from 'react-native-popup-menu';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MenuProvider>
          <Root>
            <Nav />
          </Root>
        </MenuProvider>
      </Provider>
    );
  }
}

export default App;
