import {
  REGISTER_FINISH,
  REGISTER_LOADING,
  REGISTER_NOT_LOADING,
  SET_REGISTER_ERROR,
  LOGOUT,
} from "../actions/types";

const defaultState = {
  loading: false,
  registrationFinished: false,
  verified: null,
  errorMessage: "",
};

function onboarding(state = defaultState, action) {
  switch (action.type) {
    case REGISTER_LOADING:
      return {
        ...state,
        ...action.data,
        errorMessage: "",

        loading: true,
      };

    case REGISTER_NOT_LOADING:
      return {
        ...state,
        ...action.data,
        loading: false,
      };

    case REGISTER_FINISH:
      return {
        ...state,
        loading: false,
        verified: null,
        errorMessage: "",

        registrationFinished: false,
      };
    case SET_REGISTER_ERROR:
      return {
        ...state,
        ...action.data,
      };
    case LOGOUT:
      return defaultState;
    default:
      return state;
  }
}
export default onboarding;
