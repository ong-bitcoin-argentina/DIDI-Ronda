import * as types from "../actions/types";

const defaultState = {
  loading: false,
  error: null,
  succeded: null,
  verify: { error: null, succeded: null },
};

function phone(state = defaultState, action) {
  switch (action.type) {
    case types.PHONE_START_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.PHONE_END_LOADING:
      return {
        ...state,
        loading: false,
      };
    case types.PHONE_SUCCEDED:
      return {
        ...state,
        succeded: action.payload,
        loading: false,
      };

    case types.PHONE_VERIFY_SUCCEDED:
      return {
        ...state,
        verify: {
          ...state.verify,
          succeded: action.payload,
          loading: false,
        },
      };
    case types.PHONE_FAILED:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case types.PHONE_VERIFY_FAILED:
      return {
        ...state,
        verify: {
          ...state.verify,
          error: action.payload,
          loading: false,
        },
      };
    case types.PHONE_CLEAN:
      return {
        loading: false,
        error: null,
        succeded: null,
        verify: { error: null, succeded: null },
      };
    case types.LOGOUT:
      return defaultState;
    default:
      return state;
  }
}

export default phone;
