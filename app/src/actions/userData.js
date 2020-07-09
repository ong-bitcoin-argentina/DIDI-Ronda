import * as types from "./types";
import * as UserService from "../services/api/user";

export const getData = () => {
  return async dispatch => {
    dispatch(startGetUserData());
    const response = await UserService.getUserData();
    if (response) dispatch(getUserData(response));
  };
};

const getUserData = response => {
  return { type: types.GET_USER_DATA, payload: { data: response.data } };
};

const startGetUserData = () => {
  return { type: types.START_GET_USER_DATA };
};
