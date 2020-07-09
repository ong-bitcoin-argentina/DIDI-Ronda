const defaultState = {
  succeded: false,
  loading: false,
  error: null,
};

function login(state = defaultState, action) {
  switch (action.type) {
    case "LOGIN_SUCCEEDED":
      return {
        ...state,
        loading: false,
        succeded: true,
      };

    case "LOGIN_FAILED":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case "LOGIN_START":
      return {
        ...state,
        succeded: false,
        loading: true,
        error: null,
      };
    case "LOGOUT":
      return defaultState;

    default:
      return state;
  }
}
export default login;
