const defaultState = {
  name: "",
  amount: 0,
  frequency: "m",
  turns: "0",
  participants: [],
  assignedNumbers: [],
  pickTurnsManual: false,
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
    case "CREATION_NEXT_STEP":
      return {
        ...state,
        step: action.data.step,
      };
    case "CREATION_NAME":
      return {
        ...state,
        name: action.data.name,
      };
    case "CREATION_AMOUNT":
      return {
        ...state,
        amount: action.data.amount,
      };
    case "CREATION_FREQUENCY":
      return {
        ...state,
        frequency: action.data.frequency,
      };
    case "CREATION_DATE":
      return {
        ...state,
        date: action.data.date,
      };
    case "PICK_TURNS_MANUAL":
      return {
        ...state,
        pickTurnsManual: action.data.pickTurnsManual,
      };
    case "NEW_NUMBER_ASSIGNED": {
      const { userData } = action.data;
      return {
        ...state,
        assignedNumbers: [...state.assignedNumbers, userData],
      };
    }
    case "REMOVE_ASSIGNED_NUMBER": {
      const { number } = action.data;
      const newAssignedNumbers = state.assignedNumbers.filter(
        e => e.number !== number
      );
      return {
        ...state,
        assignedNumbers: newAssignedNumbers,
      };
    }
    case "CREATION_TURNS":
      return {
        ...state,
        turns: action.data.turns,
      };
    case "COMPLETED_PARTICIPANTS_SECTION":
      return {
        ...state,
        completedParticipantsSection: true,
      };
    case "LOGOUT":
    case "CLEAR_STORE":
      return defaultState;
    case "CREATION_PARTICIPANTS":
      return {
        ...state,
        participants: action.data.participants,
      };
    case "CREATEROUND_REQUEST_START":
      return {
        ...state,
        request: { loading: true },
      };
    case "CREATEROUND_REQUEST_SUCCEEDED":
      return {
        ...state,
        request: { loading: false, error: null, createdRound: action.payload },
      };
    case "CREATEROUND_REQUEST_FAILED":
      return {
        ...state,
        request: { loading: false, error: action.payload, createdRound: null },
      };
    case "START_EDITING_ROUND":
      return {
        ...state,
        ...action.data.round,
      };
    default:
      return state;
  }
}
export default creation;
