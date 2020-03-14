import {combineReducers} from 'redux';
import roundCreation from './roundCreation';
import rounds from './rounds';
import login from './login';
import onboarding from './onboarding';
import forgot from './forgot'
import participant from './participant'

export default combineReducers({
  rounds,
  roundCreation,
  login,
  onboarding,
  forgot,
  participant,
});
