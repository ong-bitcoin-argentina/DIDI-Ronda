import { combineReducers } from "redux";
import roundCreation from "./roundCreation";
import rounds from "./rounds";
import notifications from "./notifications";
import login from "./login";
import registerSC from "./registerSC";
import onboarding from "./onboarding";
import forgot from "./forgot";
import participant from "./participant";
import phone from "./phone";
import userData from "./userData";
import roundDetailRootModal from "./roundDetailRootModal";
import routeOptions from "./routeOptions";

export default combineReducers({
  rounds,
  roundCreation,
  login,
  registerSC,
  phone,
  onboarding,
  forgot,
  participant,
  userData,
  roundDetailRootModal,
  routeOptions,
  notifications,
});
