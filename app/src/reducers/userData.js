import * as types from "../actions/types";

const defaultState = {
  data: {
    loading: true,
    roundsCount: "",
    completedRoundsCount: "",
  },
};

function userData(state = defaultState, action) {
  switch (action.type) {
    case types.START_GET_USER_DATA:
      return {
        ...state,
        loading: true,
      };
    case types.GET_USER_DATA:
      return {
        ...state,
        data: action.payload.data,
        loading: false,
      };
    case types.LOGOUT:
      return defaultState;
    default:
      return state;
  }
}

export default userData;
