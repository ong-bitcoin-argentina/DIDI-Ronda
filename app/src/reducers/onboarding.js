const defaultState = {
    loading: false,
    registrationFinished: false,
    verified: null,
  };
  
  function onboarding(state = defaultState, action) {
    switch (action.type) {
      case 'REGISTER_LOADING':
        return {
          ...state,
          ...action.data,
          loading: true
        };
        
    case 'REGISTER_NOT_LOADING':
        return {
           ...state,
           ...action.data,
            loading: false,
        };

    case 'REGISTER_FINISH':
      return {
          loading: false,
          verified: null,
          registrationFinished: false,
      };
    default:
        return state;
    }
  }
  export default onboarding;
  