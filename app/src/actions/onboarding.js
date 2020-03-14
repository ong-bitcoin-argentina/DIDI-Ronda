import * as types from './types';
import * as UserService from '../services/api/user';


export const createUser = (username, password, name, token) => {
  return async dispatch => {

    dispatch({type: types.REGISTER_LOADING, data: {}});

    const response = await UserService.register(username, password, name, token);

    dispatch({type: types.REGISTER_NOT_LOADING, data: { registrationFinished: true, verified: null }});
  };
};


export const verifyEmail = (username, password, name, token) => {
    return async dispatch => {
  
      dispatch({type: types.REGISTER_LOADING, data: { registrationFinished: false }});
  
      const response = await UserService.verifyEmail(username, password, name, token);

      dispatch({type: types.REGISTER_NOT_LOADING, data: { registrationFinished: true , verified: response.data.verified.verified}});
    };
  };
  

  export const finish = () => {
    return async dispatch => {
      dispatch({type: types.REGISTER_FINISH, data: {}})
    }
  }