import * as types from "../actions/types";

const defaultState = {
  name: "",
  amount: 0,
  frequency: "m",
  turns: "0",
  participants: [],
  assignedNumbers: [],
  pickTurnsManual: false,
  participantsVisible: false,
  completedParticipantsSection: false,
  date: "",
  confirmationDate: "",
  paymentDate: "",
  request: {
    loading: false,
    error: null,
    createdRound: null,
  },
};

function creation(state = defaultState, action) {
  switch (action.type) {
    case types.CREATION_NEXT_STEP:
      return {
        ...state,
        step: action.data.step,
      };
    case types.CREATION_NAME:
      return {
        ...state,
        name: action.data.name,
      };
    case types.CREATION_AMOUNT:
      return {
        ...state,
        amount: action.data.amount,
      };
    case types.CREATION_FREQUENCY:
      return {
        ...state,
        frequency: action.data.frequency,
      };
    case types.CREATION_DATE:
      return {
        ...state,
        date: action.data.date,
      };
    case types.PICK_TURNS_MANUAL:
      return {
        ...state,
        pickTurnsManual: action.data.pickTurnsManual,
      };
    case types.PARTICIPANTS_VISIBLE:
      return {
        ...state,
        participantsVisible: action.data,
      };
    case types.NEW_NUMBER_ASSIGNED: {
      const { userData } = action.data;
      return {
        ...state,
        assignedNumbers: [...state.assignedNumbers, userData],
      };
    }
    case types.REMOVE_ASSIGNED_NUMBER: {
      const { number } = action.data;
      const newAssignedNumbers = state.assignedNumbers.filter(
        e => e.number !== number
      );
      return {
        ...state,
        assignedNumbers: newAssignedNumbers,
      };
    }
    case types.CREATION_TURNS:
      return {
        ...state,
        turns: action.data.turns,
      };
    case types.COMPLETED_PARTICIPANTS_SECTION:
      return {
        ...state,
        completedParticipantsSection: true,
      };
    case types.LOGOUT:
    case types.CLEAR_STORE:
      return defaultState;
    case types.CREATION_PARTICIPANTS:
      return {
        ...state,
        participants: action.data.participants,
      };
    case types.CREATEROUND_REQUEST_START:
      return {
        ...state,
        request: { loading: true },
      };
    case types.CREATEROUND_REQUEST_SUCCEEDED:
      return {
        ...state,
        request: { loading: false, error: null, createdRound: action.payload },
      };
    case types.CREATEROUND_REQUEST_FAILED:
      return {
        ...state,
        request: { loading: false, error: action.payload, createdRound: null },
      };
    case types.START_EDITING_ROUND:
      return {
        ...state,
        ...action.data.round,
      };
    case "SET_ROUND_FAILED_DATA":
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
}
export default creation;
