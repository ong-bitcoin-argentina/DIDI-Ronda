import * as types from "../actions/types";

const defaultState = {
  requestRounds: {
    loading: false,
    list: [],
    error: null,
  },
  storedRounds: [],
  deleteRound: {
    loading: false,
    error: null,
  },
  startRound: {
    loading: false,
    error: null,
    round: null,
  },
  swapParticipant: {
    loading: false,
    error: null,
    round: null,
  },
  removeParticipant: {
    loading: false,
    error: null,
    round: null,
  },
  numberDetails: {
    loading: false,
  },
  assignParticipant: {
    loading: false,
    error: null,
    round: null,
  },
  payRound: {
    error: null,
    round: null,
  },
};

function rounds(state = defaultState, action) {
  switch (action.type) {
    case types.LOAD_ROUNDS_START:
      return {
        ...state,
        requestRounds: { ...state.requestRounds, loading: true },
      };
    case types.LOAD_ROUNDS_SUCCEEDED:
      return {
        ...state,
        requestRounds: {
          ...state.requestRounds,
          loading: false,
          list: action.payload,
          error: null,
        },
        startRound: { ...state.startRound, loading: false },
        numberDetails: { ...state.numberDetails, loading: false },
      };
    case types.LOAD_ROUNDS_FAILED:
      return {
        ...state,
        requestRounds: {
          ...state.requestRounds,
          loading: false,
          error: action.payload,
        },
      };
    case types.GET_ROUND_DATA: {
      const { round } = action.payload;
      const newRounds = state.requestRounds.list.map(r => {
        if (r.id === round.id) return round;
        return r;
      });
      return {
        ...state,
        requestRounds: { ...state.requestRounds, list: newRounds },
      };
    }
    case types.DELETEROUND_REQUEST_START:
      return {
        ...state,
        deleteRound: { ...state.deleteRound, loading: true },
      };
    case types.DELETEROUND_REQUEST_SUCCEEDED:
      return {
        ...state,
        deleteRound: { loading: false, error: null },
      };
    case types.DELETEROUND_REQUEST_FAILED:
      return {
        ...state,
        deleteRound: { loading: false, error: action.payload },
      };
    case types.REMOVE_ROUND: {
      const { id } = action.payload;
      const newList = state.requestRounds.list.filter(e => e._id !== id);
      return {
        ...state,
        requestRounds: { loading: false, list: newList },
      };
    }
    case types.START_ROUND_START:
      return {
        ...state,
        startRound: { ...state.startRound, loading: true, round: null },
      };
    case types.START_ROUND_LOAD:
      return {
        ...state,
        numberDetails: {
          ...state.numberDetails,
          loading: true,
        },
      };
    case types.STOP_ROUND_DETAIL_LOADING:
      return {
        ...state,
        numberDetails: {
          ...state.numberDetails,
          loading: false,
        },
      };
    case types.START_ROUND_SUCCEEDED:
      return {
        ...state,
        startRound: { ...state.startRound, error: null, round: action.payload },
      };
    case types.START_ROUND_FAILED:
      return {
        ...state,
        startRound: {
          ...state.startRound,
          loading: false,
          error: action.payload,
          round: null,
        },
      };
    case types.SWAP_PARTICIPANT_START:
      return {
        ...state,
        swapParticipant: {
          ...state.swapParticipant,
          loading: true,
          error: null,
          round: null,
        },
      };
    case types.SWAP_PARTICIPANT_SUCCEEDED:
      return {
        ...state,
        swapParticipant: {
          ...state.swapParticipant,
          loading: false,
          error: null,
          round: action.payload,
        },
      };
    case types.SWAP_PARTICIPANT_FAILED:
      return {
        ...state,
        swapParticipant: {
          ...state.swapParticipant,
          loading: false,
          error: action.payload,
          round: null,
        },
      };
    case types.SWAP_CLEAN:
      return {
        ...state,
        swapParticipant: {
          ...state.swapParticipant,
          loading: false,
          error: null,
          round: null,
        },
        startRound: {
          ...state.startRound,
          loading: false,
          error: action.payload,
          round: null,
        },
      };
    case types.REMOVE_PARTICIPANT_START:
      return {
        ...state,
        removeParticipant: {
          ...state.removeParticipant,
          loading: true,
          error: null,
          round: null,
        },
      };
    case types.REMOVE_PARTICIPANT_SUCCEEDED:
      return {
        ...state,
        removeParticipant: {
          ...state.removeParticipant,
          loading: false,
          error: null,
          round: action.payload,
        },
      };
    case types.REMOVE_PARTICIPANT_FAILED:
      return {
        ...state,
        removeParticipant: {
          ...state.removeParticipant,
          loading: false,
          error: action.payload,
          round: null,
        },
      };
    case types.REMOVE_CLEAN:
      return {
        ...state,
        removeParticipant: {
          ...state.removeParticipant,
          loading: false,
          error: null,
          round: null,
        },
        startRound: {
          ...state.startRound,
          loading: false,
          error: action.payload,
          round: null,
        },
      };
    case types.ASSIGN_PARTICIPANT_START:
      return {
        ...state,
        assignParticipant: {
          ...state.assignParticipant,
          loading: true,
          error: null,
          round: null,
        },
      };
    case types.ASSIGN_PARTICIPANT_SUCCEEDED:
      return {
        ...state,
        assignParticipant: {
          ...state.assignParticipant,
          loading: false,
          error: null,
          round: action.payload,
        },
      };
    case types.ASSIGN_PARTICIPANT_FAILED:
      return {
        ...state,
        assignParticipant: {
          ...state.assignParticipant,
          loading: false,
          error: action.payload,
          round: null,
        },
      };
    case types.LOGOUT:
      return defaultState;
    case types.PAY_ROUND:
      return {
        ...state,
        payRound: {
          ...state.payRound,
          error: null,
          round: action.payload,
        },
      };
    case types.PAY_ROUND_FAILED:
      return {
        ...state,
        payRound: {
          ...state.payRound,
          error: action.payload,
          round: null,
        },
      };
    case types.PAY_ROUND_CLEAN:
      return {
        ...state,
        payRound: {
          ...state.payRound,
          error: null,
          round: null,
        },
      };
    case types.SET_STORED_ROUNDS: {
      return {
        ...state,
        storedRounds: action.data.rounds,
      };
    }
    case types.REMOVE_STORED_ROUND: {
      const { roundIndex } = action.data;
      const newStoredRounds = state.storedRounds.filter(
        r => r.roundIndex !== roundIndex
      );
      return {
        ...state,
        storedRounds: newStoredRounds,
      };
    }
    default:
      return state;
  }
}
export default rounds;
