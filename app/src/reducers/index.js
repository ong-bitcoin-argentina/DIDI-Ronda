import {combineReducers} from 'redux';
import roundCreation from './roundCreation';
import rounds from './rounds';
import login from './login';

export default combineReducers({
  rounds,
  roundCreation,
  login,
});
