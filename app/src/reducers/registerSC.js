import * as types from "../actions/types";

const defaultState = {
  loading: false,
};

function registerSC(state = defaultState, action) {
  switch (action.type) {
    case types.START_FORCE_SC:
      return {
        ...state,
        loading: true,
      };

    case types.FINISH_FORCE_SC:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
export default registerSC;
