import * as types from "./types";
import * as UserService from "../services/api/user";
import { getAuth } from "../utils/utils";

export const getNotifications = async dispatch => {
  dispatch({ type: types.START_GET_NOTIFICATIONS });
  try {
    const user = await getAuth();
    const response = await UserService.getNotifications(user.username);
    if (response.error) {
      console.log(response.error);
      return { error: "Ocurrió un error al obtener las notificaciones." };
    }
    dispatch({
      type: types.SET_NOTIFICATIONS,
      payload: response.data.items,
    });
    return response.data.items;
  } catch (error) {
    console.log(error);
    return { error: "Ocurrió un error al obtener las notificaciones." };
  }
};
