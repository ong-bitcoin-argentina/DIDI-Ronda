import * as types from './types';
import * as UserService from '../services/api/user';
import setToken from '../services/api/axios';

export const login = () => {
  return async dispatch => {
    let response = await UserService.login();
    setToken(response.data.auth.token);
    dispatch({type: types.LOGIN, data: {auth: response.data.auth}});
  };
};
