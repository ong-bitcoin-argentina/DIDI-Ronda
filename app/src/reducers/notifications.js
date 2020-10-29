import moment from "moment";
import * as types from "../actions/types";

const defaultState = {
  loading: false,
  list: [],
  old: [],
  recent: [],
};

const aWeekAgo = moment().subtract(7, "days");

const isRecent = date => {
  const myDate = moment(date);
  return myDate.isAfter(aWeekAgo);
};

function notifications(state = defaultState, action) {
  switch (action.type) {
    case types.START_GET_NOTIFICATIONS:
      return {
        ...state,
        loading: true,
      };
    case types.SET_NOTIFICATIONS:
      const list = action.payload;
      return {
        list,
        old: list.filter(item => !isRecent(item.date)) || [],
        recent: list.filter(item => isRecent(item.date)) || [],
        loading: false,
      };
    default:
      return state;
  }
}

export default notifications;
