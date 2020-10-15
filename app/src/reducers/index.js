import { combineReducers } from 'redux';
import roundCreation from './roundCreation';
import rounds from './rounds';
import login from './login';
import onboarding from './onboarding';
import forgot from './forgot';
import participant from './participant';
import phone from './phone';
import userData from './userData';
import roundDetailRootModal from './roundDetailRootModal';
import routeOptions from './routeOptions';

export default combineReducers({
  rounds,
  roundCreation,
  login,
  phone,
  onboarding,
  forgot,
  participant,
  userData,
  roundDetailRootModal,
  routeOptions,
});
