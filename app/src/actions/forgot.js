import * as types from './types';
import * as UserService from '../services/api/user';
import setToken from '../services/api/axios';

const loadingNewPassword = {type: types.LOADING_NEW_PASSWORD, data: {}}

const finishLoadingNewPassword = (response) => {
  return {type: types.FINISH_LOADING_NEW_PASSWORD, data: {changed: response.data.changed}}
}

const loadingForgot = {type: types.LOADING_FORGOT, data: {}}

const finishLoadingForgot = (response) => {
  return {type: types.FINISH_LOADING_FORGOT, data: {valid: response.data.valid}}
}

export const forgot = (username) => {    
    return async dispatch => {

      let response = await UserService.forgot(username);

    };
  };

export const forgotCode = (username, token) => {    
  return async dispatch => {

    dispatch(loadingForgot);
    let response = await UserService.forgotCode(username, token);

    dispatch(finishLoadingForgot( response ));

  };
};

export const sendPassword = (username, password, token) => {
  return async dispatch =>{ 

    dispatch( loadingNewPassword );

    let response = await UserService.forgotNewPassword(username, password, token);

    dispatch(finishLoadingNewPassword( response ));

  }
}

export const cleanForgot = () => {
  return async dispatch => {

    dispatch({type: types.CLEAN_FORGOT, data: {}});

  }
}
