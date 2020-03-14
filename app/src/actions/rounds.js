import * as types from './types';
import * as UserService from '../services/api/user';
import * as AdminService from '../services/api/admin';
import * as ParticipantService from '../services/api/participant';

import { getAuth } from '../components/utils';

export const loadRounds = () => {
  return async dispatch => {

    dispatch( loadRoundsStart() );

    const loadRounds = await UserService.getRoundsList();

    if (!loadRounds.error) {
      dispatch( loadRoundsSucceeded( loadRounds.data ) );
    } else {
      dispatch( loadRoundsFail( loadRounds.error) );
    }

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

export const removeParticipant = ( idParticipant, roundId ) => {
  return async dispatch => {

    dispatch( removeParticipantStart() );

    const removeParticipant = await AdminService.removeParticipant( idParticipant, roundId );

    if (!removeParticipant.error) {
      dispatch( removeParticipantSucceded( removeParticipant.data ) );
      dispatch( loadRounds() );
    } else {
      dispatch( removeParticipantFailed(removeParticipant.error) );
    }

  };
};

export const assignParticipant = ( idParticipant, roundId, shiftNumber ) => {
  return async dispatch => {

    dispatch( assignParticipantStart() );

    const assignParticipant = await AdminService.assignParticipantToNumber( idParticipant, roundId, shiftNumber );

    if (!assignParticipant.error) {
      dispatch( assignParticipantSucceded( assignParticipant.data ) );
    } else {
      dispatch( assignParticipantFailed(assignParticipant.error) );
    }

  };
};

export const payRound = (roundId, number, participantId) => {
  return async dispatch => {

    dispatch( startRoundLoad() );    
    
    const payRound = await AdminService.payRound(roundId, number, participantId);

    if (!payRound.error) {
      dispatch( payRoundData( payRound.data ) );
    } else {
      dispatch( payRoundFailed( payRound.error ) );
    }

    dispatch( loadRounds() );

  };
};

export const closeRound = (roundId, number, nextDraw) => {
  return async dispatch => {

    dispatch( startRoundLoad() );

    const closeRound = await AdminService.closeRound(roundId, number, nextDraw);

    if (!closeRound.error) {
      dispatch( closeRoundData( closeRound.data ) );
    } else {
      dispatch( closeRoundFailed( closeRound.error ) );
    }

    dispatch( loadRounds() );
  };
};


export const acceptInvitation = ( idParticipant, roundId ) => {
  return async dispatch => {

    dispatch( invitationStart() );

    const acceptInvitation = await ParticipantService.acceptInvitation( idParticipant, roundId );

    if (!acceptInvitation.error) {
      dispatch( invitationSucceded( acceptInvitation.data ) );
      dispatch( loadRounds() );
    } else {
      dispatch( invitationFailed(acceptInvitation.error) );
    }

  };
};

export const rejectInvitation = ( idParticipant, roundId ) => {
  return async dispatch => {

    dispatch( invitationStart() );

    const rejectInvitation = await ParticipantService.rejectInvitation( idParticipant, roundId );

    if (!rejectInvitation.error) {
      dispatch( invitationSucceded( rejectInvitation.data ) );
      dispatch( loadRounds() );
    } else {
      dispatch( invitationFailed(rejectInvitation.error) );
    }

  };
};

export const requestNumbers = ( idParticipant, roundId, numbers ) => {
  return async dispatch => {

    dispatch( requestNumbersStart() );

    const requestNumbers = await ParticipantService.requestNumbers( idParticipant, roundId, numbers );

    if (!requestNumbers.error) {
      dispatch( requestNumbersSucceded( requestNumbers.data ) );
      dispatch( loadRounds() );
    } else {
      dispatch( requestNumbersFailed(requestNumbers.error) );
    }

  };
};


// Request numbers clean
export const requestNumbersClean = () => ({
  type: types.REQUEST_NUMBERS_CLEAN,
})

// Request numbers start
const requestNumbersStart = () => ({
  type: types.REQUEST_NUMBERS_START,
})

// Request numbers succeded
const requestNumbersSucceded = (data) => ({
  type: types.REQUEST_NUMBERS_SUCCEEDED,
  payload: {data}
})

// Request numbers failed
const requestNumbersFailed = error => ({
  type: types.REQUEST_NUMBERS_FAILED,
  payload: {error}
})


// Invitation clean
export const invitationClean = () => ({
  type: types.INVITATION_CLEAN,
})

// Accept invitation start
const invitationStart = () => ({
  type: types.INVITATION_START,
})

// Accept invitation succeded
const invitationSucceded = (data) => ({
  type: types.INVITATION_SUCCEEDED,
  payload: {data}
})

// Accept invitation failed
const invitationFailed = error => ({
  type: types.INVITATION_FAILED,
  payload: {error}
})


// Swap participant clean
export const swapClean = () => ({
  type: types.SWAP_CLEAN,
})

// Remove participant clean
export const removeClean = () => ({
  type: types.REMOVE_CLEAN,
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

// Remove participant start
const removeParticipantStart = () => ({
  type: types.REMOVE_PARTICIPANT_START,
})

// Remove participant succeded
const removeParticipantSucceded = (data) => ({
  type: types.REMOVE_PARTICIPANT_SUCCEEDED,
  payload: {data}
})

// Remove participant failed
const removeParticipantFailed = error => ({
  type: types.REMOVE_PARTICIPANT_FAILED,
  payload: {error}
})

// Assign participant start
const assignParticipantStart = () => ({
  type: types.ASSIGN_PARTICIPANT_START,
})

// Assign participant succeded
const assignParticipantSucceded = (data) => ({
  type: types.ASSIGN_PARTICIPANT_SUCCEEDED,
  payload: {data}
})

// Assign participant failed
const assignParticipantFailed = error => ({
  type: types.ASSIGN_PARTICIPANT_FAILED,
  payload: {error}
})


// Load rounds start
const loadRoundsStart = () => ({
  type: types.LOAD_ROUNDS_START,
});

// Load rouns succeded
const loadRoundsSucceeded = (data) => ({
  type: types.LOAD_ROUNDS_SUCCEEDED,
  payload: data,
})

// Load rouns failed
const loadRoundsFail = (error) => ({
  type: types.LOAD_ROUNDS_FAILED,
  payload: {error},
})


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


// Load round start
const startRoundLoad = () => ({
  type: types.START_ROUND_LOAD,
});



// Pay round (data)
const payRoundData = data => ({
  type: types.PAY_ROUND, 
  data: {res: data}
});

// Pay round (failed)
const payRoundFailed = error => ({
  type: types.PAY_ROUND_FAILED, 
  payload: error,
});


// Close round (data)
const closeRoundData = data => ({
  type: types.CLOSE_ROUND, 
  data: {res: data}
});

// Close round (failed)
const closeRoundFailed = error => ({
  type: types.CLOSE_ROUND_FAILED, 
  payload: error,
});
