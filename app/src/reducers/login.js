const defaultState = {
  user: null,
  loading: false,
  error: null
};

function login(state = defaultState, action) {
  switch (action.type) {
    case 'LOGIN_SUCCEEDED':
      return {
        ...state,
        user: action.payload
      };

    case 'LOGIN_FAILED':
      return {
        ...state,
        error: action.payload,
        loading: false
      }

    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
    }


    default:
      return state;
  }
}
export default login;
