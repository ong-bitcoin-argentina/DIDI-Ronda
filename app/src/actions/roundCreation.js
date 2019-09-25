import * as types from './types';
import * as UserService from '../services/api/user';
import {loadRounds} from './rounds';

export const creationNextStep = nextStep => {
  return dispatch => {
    dispatch({type: types.CREATION_NEXT_STEP, data: {step: nextStep}});
  };
};
export const setName = name => {
  return dispatch => {
    dispatch({type: types.CREATION_NAME, data: {name: name}});
  };
};
export const setAmount = amount => {
  return dispatch => {
    dispatch({type: types.CREATION_AMOUNT, data: {amount: amount}});
  };
};

export const setConfig = config => {
  return dispatch => {
    dispatch({type: types.CREATION_CONFIG, data: {config: config}});
  };
};

export const setDate = date => {
  return dispatch => {
    dispatch({type: types.CREATION_DATE, data: {date: date}});
  };
};

export const setConfirmationDate = date => {
  console.log('set confirmation date', date)
  return dispatch => {
    dispatch({type: types.CREATION_CONFIRMATION_DATE, data: {date: date}});
  };
};

export const setPaymentDate = date => {
  console.log('set payment date', date)
  return dispatch => {
    dispatch({type: types.CREATION_PAYMENT_DATE, data: {date: date}});
  };
};

export const createRound = () => {
  return async (dispatch, getState) => {
    dispatch(createRoundStart());

    const {
      amount,
      config,
      name,
      participants,
      date,
      confirmationDate,
      paymentDate,
    } = getState().roundCreation;

    const createRound = await UserService.createRound(
      amount,
      config,
      name,
      participants,
      date,
      confirmationDate,
      paymentDate,
    );

    if (!createRound.error) {
      // Success!
      dispatch(createRoundSucceeded(createRound.data));
      dispatch(clearStore());
      dispatch(loadRounds());
    } else {
      // Error!
      const errors =
        createRound.error.response && createRound.error.response.data;
      dispatch(createRoundFail(errors));
    }
  };
};

export const setParticipants = participants => {
  return dispatch => {
    dispatch({
      type: types.CREATION_PARTICIPANTS,
      data: {participants: participants},
    });
  };
};

const clearStore = () => ({
  type: types.CLEAR_STORE,
});

// Create round start
const createRoundStart = () => ({
  type: types.CREATEROUND_REQUEST_START,
});

// Create round success
const createRoundSucceeded = round => ({
  type: types.CREATEROUND_REQUEST_SUCCEEDED,
  payload: round,
});

// Create round error
const createRoundFail = error => ({
  type: types.CREATEROUND_REQUEST_FAILED,
  payload: {error},
});
