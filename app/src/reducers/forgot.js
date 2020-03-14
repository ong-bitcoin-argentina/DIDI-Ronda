const defaultState = {
    username: '', 
    token: '',
    loading: false ,
    valid: null,
    changed: null
  };
  
function forgot(state = defaultState, action) {
    switch (action.type) {
        case 'LOADING_FORGOT':
            return {
                ...state,
                loading: true,
                valid: null,
                changed: null,
            };

        case 'FINISH_LOADING_FORGOT':
            return {
                ...state,
                loading: false,
                valid: action.data.valid    
            };

        case 'FINISH_LOADING_NEW_PASSWORD':
            return {
                ...state,
                loading: false,
                valid: null,
                changed: action.data.changed    
            };


        case 'LOADING_NEW_PASSWORD':
            return {
                ...state,
                loading: false,
                changed: null 
            };

        case 'CLEAN_FORGOT':
            return {
                ...state,
                loading: false,
                valid: null  
            };
        
        case 'FORGOT_ERROR':
            return {
                ...state,
                error: action.data
            };

        case 'FORGOT_CODE_STATUS':
            return {
                ...state,
                error: action.data
            };


        default:
        return state;
    }
}
  export default forgot;