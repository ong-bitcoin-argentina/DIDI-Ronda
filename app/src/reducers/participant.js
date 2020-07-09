import * as types from "../actions/types";

const defaultState = {
  invitation: {
    loading: false,
    error: null,
    round: null,
  },
  requestNumbers: {
    loading: false,
    error: null,
    round: null,
  },
  chargeNumber: {
    loading: false,
    error: null,
    round: null,
  },
  acceptAndRequest: false,
};

function rounds(state = defaultState, action) {
  switch (action.type) {
    case types.INVITATION_START:
      return {
        ...state,
        invitation: {
          ...state.invitation,
          loading: true,
          error: null,
          round: null,
        },
      };
    case types.INVITATION_SUCCEEDED:
      return {
        ...state,
        invitation: {
          ...state.invitation,
          loading: false,
          error: null,
          round: action.payload,
        },
      };
    case types.INVITATION_FAILED:
      return {
        ...state,
        invitation: {
          ...state.invitation,
          loading: false,
          error: action.payload,
          round: null,
        },
      };
    case types.INVITATION_CLEAN:
      return {
        ...state,
        invitation: {
          ...state.invitation,
          loading: false,
          error: null,
          round: null,
        },
      };
    case types.REQUEST_NUMBERS_START:
      return {
        ...state,
        requestNumbers: {
          ...state.requestNumbers,
          loading: true,
          error: null,
          round: null,
        },
      };
    case types.REQUEST_NUMBERS_SUCCEEDED:
      return {
        ...state,
        requestNumbers: {
          ...state.requestNumbers,
          loading: false,
          error: null,
          round: action.payload,
        },
      };
    case types.REQUEST_NUMBERS_FAILED:
      return {
        ...state,
        requestNumbers: {
          ...state.requestNumbers,
          loading: false,
          error: action.payload,
          round: null,
        },
      };
    case types.REQUEST_NUMBERS_CLEAN:
      return {
        ...state,
        requestNumbers: {
          ...state.requestNumbers,
          loading: false,
          error: null,
          round: null,
        },
      };
    case types.CHARGE_NUMBER_START:
      return {
        ...state,
        chargeNumber: {
          ...state.chargeNumber,
          loading: true,
          error: null,
          round: null,
        },
      };
    case types.CHARGE_NUMBER_SUCCEEDED:
      return {
        ...state,
        chargeNumber: {
          ...state.chargeNumber,
          loading: false,
          error: null,
          round: action.payload,
        },
      };
    case types.CHARGE_NUMBER_FAILED:
      return {
        ...state,
        chargeNumber: {
          ...state.chargeNumber,
          loading: false,
          error: action.payload,
          round: null,
        },
      };
    case types.CHARGE_NUMBER_CLEAN:
      return {
        ...state,
        chargeNumber: {
          ...state.chargeNumber,
          loading: false,
          error: null,
          round: null,
        },
      };
    case types.ACCEPT_AND_REQUEST:
      return {
        ...state,
        acceptAndRequest: true,
      };
    case types.ACCEPT_AND_REQUEST_CLEAN:
      return {
        ...state,
        acceptAndRequest: false,
      };
    case types.LOGOUT:
      return defaultState;
    default:
      return state;
  }
}
export default rounds;
