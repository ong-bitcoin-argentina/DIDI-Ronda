import * as types from '../actions/types';

const defaultState = {
  invitation: {
    loading: false,
    error: null,
    round: null,
  },
  requesTNumbers: {
    loading: false,
    error: null,
    round: null,
  },
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
          requesTNumbers: {
            ...state.requesTNumbers,
            loading: true,
            error: null,
            round: null,
          },
        };
      case types.REQUEST_NUMBERS_SUCCEEDED:
        return {
          ...state,
          requesTNumbers: {
            ...state.requesTNumbers,
            loading: false,
            error: null,
            round: action.payload,
          },
        };
      case types.REQUEST_NUMBERS_FAILED:
        return {
          ...state,
          requesTNumbers: {
            ...state.requesTNumbers,
            loading: false,
            error: action.payload,
            round: null,
          },
        };
      case types.REQUEST_NUMBERS_CLEAN:
        return {
          ...state,
          requesTNumbers: {
            ...state.requesTNumbers,
            loading: false,
            error: null,
            round: null,
          },
        };
    default:
      return state;
  }
}
export default rounds;











