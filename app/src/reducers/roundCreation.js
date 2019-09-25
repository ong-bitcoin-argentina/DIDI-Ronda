const defaultState = {
  name: '',
  amount: 0,
  config: {},
  participants: [],
  date: '',
  confirmationDate: '',
  paymentDate: '',
  request: {
    loading: false,
    error: null,
    createdRound: null,
  },
};

function creation(state = defaultState, action) {
  switch (action.type) {
    case 'CREATION_NEXT_STEP':
      return {
        ...state,
        step: action.data.step,
      };
    case 'CREATION_NAME':
      return {
        ...state,
        name: action.data.name,
      };
    case 'CREATION_AMOUNT':
      return {
        ...state,
        amount: action.data.amount,
      };
    case 'CREATION_CONFIG':
      return {
        ...state,
        config: action.data.config,
      };
    case 'CREATION_DATE':
      return {
        ...state,
        date: action.data.date,
      };
    case 'CREATION_CONFIRMATION_DATE':
      return {
        ...state,
        confirmationDate: action.data.date,
      };
    case 'CREATION_PAYMENT_DATE':
      return {
        ...state,
        paymentDate: action.data.date,
      };
    case 'CLEAR_STORE':
      return {
        ...state,
        name: '',
        amount: 0,
        config: {},
        participants: [],
        date: '',
        confirmationDate: '',
        paymentDate: '',
      };
    case 'CREATION_PARTICIPANTS':
      return {
        ...state,
        participants: action.data.participants,
      };
    case 'CREATEROUND_REQUEST_START':
      return {
        ...state,
        request: {loading: true},
      };
    case 'CREATEROUND_REQUEST_SUCCEEDED':
      return {
        ...state,
        request: {loading: false, error: null, createdRound: action.payload},
      };
    case 'CREATEROUND_REQUEST_FAILED':
      return {
        ...state,
        request: {loading: false, error: action.payload, createdRound: null},
      };

    default:
      return state;
  }
}
export default creation;
