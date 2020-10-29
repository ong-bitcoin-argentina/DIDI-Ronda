import * as types from "./types";
import * as UserService from "../services/api/user";
import { setAuth, logOut, getAuth } from "../utils/utils";
import NavigationService from "../services/navigation";

export const createUser = (username, password, name, token, nick) => {
  return async dispatch => {
    dispatch(createUserStart());

    const response = await UserService.register(
      username,
      password,
      name,
      token,
      nick,
    );

    if (response.error) {
      dispatch(createUserFailed(response.error));
    } else {
      dispatch(createUserSucceded());
    }
  };
};

const createUserStart = () => {
  return {
    type: types.REGISTER_LOADING,
  };
};

const createUserSucceded = () => {
  return {
    type: types.REGISTER_NOT_LOADING,
    data: {
      registrationFinished: true,
      verified: null,
    },
  };
};

const createUserFailed = error => {
  // TODO: Always return the same error!
  return {
    type: types.REGISTER_NOT_LOADING,
    data: {
      registrationFinished: false,
      errorMessage: "Ese email ya fue usado",
      error,
      verified: null,
    },
  };
};

export const goToLogin = () => async () => logOut();

export const verifyEmail = (username, password, name, token) => {
  return async dispatch => {
    dispatch({
      type: types.REGISTER_LOADING,
      data: { registrationFinished: true },
    });

    const response = await UserService.verifyEmail(
      username.trim(),
      password,
      name,
      token,
    );

    if (!response.error) {
      const { returnUser } = response.data;
      dispatch({
        type: types.REGISTER_NOT_LOADING,
        data: {
          registrationFinished: true,
        },
      });

      if (returnUser) {
        await setAuth(returnUser);
        dispatch({
          type: types.REGISTER_NOT_LOADING,
          data: {
            returnUser,
            verified: true,
          },
        });
        return dispatch(loginSucceded());
      }
      // TODO: Handle not verified
    }
    return dispatch({
      type: types.SET_REGISTER_ERROR,
      data: {
        errorMessage: "Ha ocurrido un error, verifique el codigo y el correo",
        loading: false,
        registrationFinished: true,
      },
    });
  };
};

export const finish = () => {
  return async dispatch => {
    dispatch({ type: types.REGISTER_FINISH, data: {} });
  };
};

const loadingNewPassword = { type: types.LOADING_NEW_PASSWORD, data: {} };

const finishLoadingNewPassword = response => {
  return {
    type: types.FINISH_LOADING_NEW_PASSWORD,
    data: { changed: response.data.changed },
  };
};

const loadingForgot = { type: types.LOADING_FORGOT, data: {} };

const finishLoadingForgot = response => {
  return {
    type: types.FINISH_LOADING_FORGOT,
    data: { valid: response.data.valid },
  };
};

export const forgot = username => async () => UserService.forgot(username);

export const forgotCode = (username, token) => {
  return async dispatch => {
    dispatch(loadingForgot);
    const response = await UserService.forgotCode(username, token);

    dispatch(finishLoadingForgot(response));
  };
};

export const sendPassword = (username, password, token) => {
  return async dispatch => {
    dispatch(loadingNewPassword);

    const response = await UserService.forgotNewPassword(
      username,
      password,
      token,
    );

    dispatch(finishLoadingNewPassword(response));
  };
};

export const cleanForgot = () => {
  return async dispatch => {
    dispatch({ type: types.CLEAN_FORGOT, data: {} });
  };
};

export const loginWithAidi = token => {
  return async dispatch => {
    dispatch(loginStart());
    const session = await UserService.loginWithAidi(token);

    if (!session.error) {
      try {
        await setAuth(session.data);
        dispatch(loginSucceded());
        NavigationService.navigate("LoadingAuth");
      } catch (error) {
        dispatch(loginFailed(error));
      }
    } else {
      dispatch(loginFailed(login.error));
    }
  };
};

export const login = (username, password) => {
  return async dispatch => {
    dispatch(loginStart());

    const trimedUsername = username.trim();

    const session = await UserService.login(trimedUsername, password);

    if (!session.error) {
      try {
        await setAuth(session.data);
        dispatch(loginSucceded());
        NavigationService.navigate("LoadingAuth");
      } catch (error) {
        dispatch(loginFailed(error));
      }
    } else {
      dispatch(loginFailed(login.error));
    }
  };
};

export const phone = (username, phoneNumber, country) => {
  return async dispatch => {
    dispatch(phoneStart());

    const response = await UserService.phone(username, phoneNumber, country);

    if (!response.error) {
      dispatch(phoneSucceded(response));
    } else {
      dispatch(phoneFailed(response.error.response.data.error));
    }

    dispatch(phoneEndLoading());
  };
};
export const phoneVerifiyCode = (username, phoneNumber, country, code) => {
  return async dispatch => {
    dispatch(phoneStart());

    const response = await UserService.phoneVerify(
      username,
      phoneNumber,
      country,
      code,
    );

    if (!response.error) {
      await setAuth(response.data.auth);
      dispatch(phoneVerifySucceded(response));
    } else {
      dispatch(phoneVerifyFailed(response.error));
    }

    dispatch(phoneEndLoading());
  };
};

export const cleanPhone = () => {
  return async dispatch => {
    dispatch(phoneClean());
  };
};

export const forceSCRegister = async dispatch => {
  const errorMessage = "Ocurrió un error al reintentar el registro.";
  dispatch({ type: types.START_FORCE_SC });
  try {
    const user = await getAuth();
    const response = await UserService.retryRegister(user.username);
    dispatch({ type: types.FINISH_FORCE_SC });
    if (response.error) {
      console.log(response.error);
      return { error: errorMessage };
    }
    // await setAuth(response);
    return response.data.items;
  } catch (error) {
    console.log(error);
    dispatch({ type: types.FINISH_FORCE_SC });
    return { error: errorMessage };
  }
};

// Phone
const phoneStart = () => ({
  type: types.PHONE_START_LOADING,
});

const phoneEndLoading = () => ({
  type: types.PHONE_END_LOADING,
});

const phoneSucceded = response => ({
  type: types.PHONE_SUCCEDED,
  payload: response,
});

const phoneFailed = error => ({
  type: types.PHONE_FAILED,
  payload: error,
});

const phoneVerifySucceded = response => ({
  type: types.PHONE_VERIFY_SUCCEDED,
  payload: response,
});

const phoneVerifyFailed = error => ({
  type: types.PHONE_VERIFY_FAILED,
  payload: error,
});

const phoneClean = () => ({
  type: types.PHONE_CLEAN,
});
// Login start
const loginStart = () => ({
  type: types.LOGIN_START,
});

// Login succeded
const loginSucceded = () => ({
  type: types.LOGIN_SUCCEEDED,
});

// Login failed
const loginFailed = error => ({
  type: types.LOGIN_FAILED,
  payload: { error },
});
