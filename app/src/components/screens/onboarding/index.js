import React, {Component, useState, useEffect} from 'react';

import { createStackNavigator } from 'react-navigation';
import Register from './Register'
import LoadingAuth from './LoadingAuth'
import Login from './Login'
import Forgot from './Forgot'
import Code from './Forgot/code';
import NewPassword from './Forgot/NewPassword';

export default createStackNavigator({
  Register: {
    screen: Register
  },
  Login: {
    screen: Login
  },
  Forgot: {
    screen: Forgot
  },
  ForgotCode: {
    screen: Code
  },
  NewPassword: {
    screen: NewPassword
  }
},  {
  headerMode: 'none',
  initialRouteName: 'Login',
  defaultNavigationOptions: {
    gesturesEnabled: false,
  },
})