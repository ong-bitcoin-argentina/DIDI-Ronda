import {
  OPEN_ROUND_DETAIL_ROOT_MODAL,
  CLOSE_ROUND_DETAIL_ROOT_MODAL,
} from "./types";

export const openRoundDetailRootModal = (message, icon = "error") => dispatch =>
  dispatch({ type: OPEN_ROUND_DETAIL_ROOT_MODAL, message, icon });

export const closeRoundDetailRootModal = () => dispatch =>
  dispatch({ type: CLOSE_ROUND_DETAIL_ROOT_MODAL });
