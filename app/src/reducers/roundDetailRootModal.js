import {
  OPEN_ROUND_DETAIL_ROOT_MODAL,
  CLOSE_ROUND_DETAIL_ROOT_MODAL,
} from "../actions/types";

const defaultState = {
  open: false,
  message: "",
  icon: "nothing",
};

const roundDetailRootModal = (state = defaultState, action) => {
  switch (action.type) {
    case OPEN_ROUND_DETAIL_ROOT_MODAL: {
      const { icon, message } = action;
      return {
        message,
        icon,
        open: true,
      };
    }
    case CLOSE_ROUND_DETAIL_ROOT_MODAL: {
      return {
        message: "",
        open: false,
        icon: "nothing",
      };
    }
    default:
      return state;
  }
};
export default roundDetailRootModal;
