import * as types from '../actions/types';

const defaultState = {
  roundsList: {
    page: 1,
  },
};

function routeOptions(state = defaultState, action) {
  switch (action.type) {
    case types.SET_ROUTE_OPTIONS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export default routeOptions;
