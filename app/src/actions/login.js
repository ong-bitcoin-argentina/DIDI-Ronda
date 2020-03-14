import * as types from './types';
import * as UserService from '../services/api/user';
import setToken from '../services/api/axios';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { setAuth } from '../components/utils';

export const login = ( username, password ) => {
  return async dispatch => {

    dispatch( loginStart() );

    let trimedUsername = username.trim()

    const login = await UserService.login(trimedUsername, password);


    if (!login.error) {

      try {
        await setAuth( login.data )
        dispatch( loginSucceded( login.data ) );
      } catch (error) {
        dispatch( loginFailed( error ) );
      }

    } else {
      dispatch( loginFailed( login.error ) );
    }

  };
};

// Login start
const loginStart = () => ({
  type: types.LOGIN_START,
})


// Login succeded
const loginSucceded = (data) => ({
  type: types.LOGIN_SUCCEEDED,
  payload: {data}
})


// Login failed
const loginFailed = error => ({
  type: types.LOGIN_FAILED,
  payload: {error}
})
