import * as types from './types';
import * as UserService from '../services/api/user';
import * as AdminService from '../services/api/admin';

export const loadRounds = () => {
  return async dispatch => {
    dispatch(requestRounsdStart());

    let roundsList = await UserService.getRoundsList();
    dispatch({type: types.LOAD_ROUNDS, data: {roundsList: roundsList.data}});
  };
};

export const deleteRound = id => {
  return async dispatch => {
    dispatch(deleteRoundStart());

    const deleteRound = await AdminService.deleteRound(id);

    if (!deleteRound.error) {
      dispatch(deleteRoundSucceeded());
      dispatch(removeRound(id));
    } else {
      dispatch(deleteRoundFail(deleteRound.error));
    }
  };
};

export const startRound = id => {
  return async dispatch => {
    dispatch(startRoundStart(id));

    const startRound = await AdminService.startRound(id);

    if (!startRound.error) {
      dispatch(startRoundSucceded(startRound.data));
      dispatch(loadRounds());
    } else {
      dispatch(startRoundFailed(startRound.error));
    }
  };
};

export const swapParticipant = ( idParticipant, newUser, roundId ) => {
  return async dispatch => {

    dispatch( swapParticipantStart() );

    const swapParticipant = await AdminService.swapParticipant( idParticipant, newUser, roundId );

    if (!swapParticipant.error) {
      dispatch( swapParticipantSucceded( swapParticipant.data ) );
      dispatch( loadRounds() );
    } else {
      dispatch( swapParticipantFailed(swapParticipant.error) );
    }

  };
};

export const payRound = (roundId, number, participant) => {
  return async dispatch => {
    dispatch({type: types.START_ROUND_LOAD});
    const res = await AdminService.payRound(roundId, number, participant);
    console.log('RESULT PAY ROUND', res);
    dispatch({type: types.PAY_ROUND, data: {res: res.data}});
    dispatch(loadRounds());
    dispatch({type: types.END_ROUND_LOAD});
  };
};

export const closeRound = (roundId, number) => {
  return async dispatch => {
    dispatch({type: types.START_ROUND_LOAD});
    const res = await AdminService.closeRound(roundId, number);
    dispatch({type: types.CLOSE_ROUND, data: {res: res.data}});
    dispatch(loadRounds());
    dispatch({type: types.END_ROUND_LOAD});
  };
};

// Swap participant clean
export const swapClean = () => ({
  type: types.SWAP_CLEAN,
})


// Swap participant start
const swapParticipantStart = () => ({
  type: types.SWAP_PARTICIPANT_START,
})

// Swap participant succeded
const swapParticipantSucceded = (data) => ({
  type: types.SWAP_PARTICIPANT_SUCCEEDED,
  payload: {data}
})

// Swap participant failed
const swapParticipantFailed = error => ({
  type: types.SWAP_PARTICIPANT_FAILED,
  payload: {error}
})


// Request rounds
const requestRounsdStart = () => ({
  type: types.ROUNDS_REQUEST_START,
});

// Delete round
const deleteRoundStart = () => ({
  type: types.DELETEROUND_REQUEST_START,
});

// Start round start
const startRoundStart = id => ({
  type: types.START_ROUND_START,
});

// Start round succeded
const startRoundSucceded = data => ({
  type: types.START_ROUND_SUCCEEDED,
  payload: {data},
});

// Start round failed
const startRoundFailed = error => ({
  type: types.START_ROUND_FAILED,
  payload: {error},
});

// Remove round
const removeRound = id => ({
  type: types.REMOVE_ROUND,
  payload: {id},
});

const deleteRoundSucceeded = () => ({
  type: types.DELETEROUND_REQUEST_SUCCEEDED,
});

const deleteRoundFail = error => ({
  type: types.DELETEROUND_REQUEST_FAILED,
  payload: {error},
});
