const defaultState = {
  auth: {token: ''},
};

function login(state = defaultState, action) {
  switch (action.type) {
    case 'LOGIN':
      console.log(action.data.auth)
      return {
        ...state,
        auth: action.data.auth
      };
    default:
      return state;
  }
}
export default login;
