import * as types from "./types";
import * as UserService from "../services/api/user";
import * as AdminService from "../services/api/admin";
import * as ParticipantService from "../services/api/participant";
import {
  getAllRoundsFromStorage,
  deleteRoundFromStorage,
} from "../services/asyncStorage";
import { openRoundDetailRootModal } from "./roundDetailRootModal";
import { ROUND_START, REMEMBER_PAYMENT } from "../utils/notificationIntents";
import { getAuth } from "../utils/utils";
import { getMonthName } from "../utils/dates";

export const loadRounds = () => {
  return async dispatch => {
    dispatch(loadRoundsStart());

    const loadedRounds = await UserService.getRoundsList();

    if (!loadedRounds.error) {
      dispatch(loadRoundsSucceeded(loadedRounds.data));
    } else {
      dispatch(loadRoundsFail(loadedRounds.error));
    }
  };
};

export const deleteRound = id => {
  return async dispatch => {
    dispatch(deleteRoundStart());

    const deletedRound = await AdminService.deleteRound(id);

    if (!deletedRound.error) {
      dispatch(deleteRoundSucceeded());
      dispatch(removeRound(id));
    } else {
      dispatch(deleteRoundFail(deletedRound.error));
    }
  };
};

export const startRound = id => {
  return async dispatch => {
    dispatch(startRoundStart(id));

    const startedRound = await AdminService.startRound(id);

    if (!startedRound.error) {
      dispatch(startRoundSucceded(startedRound.data));
      dispatch(loadRounds());
      const roundModalMessage = `La ronda "${startedRound.data.name}" se está procesando. Cuando comience, todos los participantes recibirán una notificación.`;
      dispatch(openRoundDetailRootModal(roundModalMessage, "roundCheck"));
    } else {
      let message = "Hubo un error. Intente nuevamente mas tarde";
      if (startedRound.error && startedRound.error.response) {
        const { data } = startedRound.error.response;
        const { error } = data;
        if (error.includes("must accept"))
          message =
            "Un participante ha rechazado la invitacion.\nDebes reemplazarlo para comenzar la Ronda";
      }
      dispatch(loadRounds());
      dispatch(startRoundFailed(message));
    }
  };
};

export const reSendInvite = id => async () => AdminService.reSendInvite(id);

export const swapParticipant = (idParticipant, newUser, roundId) => {
  return async dispatch => {
    dispatch(swapParticipantStart());

    const swapedParticipant = await AdminService.swapParticipant(
      idParticipant,
      newUser,
      roundId
    );

    if (!swapedParticipant.error) {
      dispatch(swapParticipantSucceded(swapedParticipant.data));
      dispatch(loadRounds());
    } else {
      dispatch(swapParticipantFailed(swapedParticipant.error));
    }
  };
};

export const reasignNumber = (
  participantId,
  targetParticipantId,
  number,
  roundId
) => async dispatch => {
  const reasigned = await AdminService.reasignParticipant(
    participantId,
    targetParticipantId,
    number,
    roundId
  );

  if (!reasigned.error) {
    dispatch(loadRounds());
    return true;
  }
  return false;
};

export const removeParticipant = (idParticipant, roundId) => {
  return async dispatch => {
    dispatch(removeParticipantStart());

    const removedParticipant = await AdminService.removeParticipant(
      idParticipant,
      roundId
    );

    if (!removedParticipant.error) {
      dispatch(removeParticipantSucceded(removedParticipant.data));
      dispatch(loadRounds());
    } else {
      dispatch(removeParticipantFailed(removedParticipant.error));
    }
  };
};

export const assignParticipant = (idParticipant, roundId, shiftNumber) => {
  return async dispatch => {
    dispatch(assignParticipantStart());

    const assignedParticipant = await AdminService.assignParticipantToNumber(
      idParticipant,
      roundId,
      shiftNumber
    );

    if (!assignedParticipant.error) {
      dispatch(assignParticipantSucceded(assignedParticipant.data));
    } else {
      dispatch(assignParticipantFailed(assignedParticipant.error));
    }
  };
};

export const payRound = (
  roundId,
  number,
  participantId,
  useAdminEndpoint = false
) => {
  return async dispatch => {
    dispatch(startRoundLoad());

    const payedRound = await ParticipantService.payRound(
      roundId,
      number,
      participantId,
      useAdminEndpoint
    );

    if (!payedRound.error) {
      dispatch(payRoundData(payedRound.data));
    } else {
      dispatch(payRoundFailed(payedRound.error));
    }

    dispatch(loadRounds());
  };
};

export const acceptInvitation = (
  idParticipant,
  roundId,
  acceptAndRequest = false
) => {
  return async dispatch => {
    dispatch(invitationStart());

    const acceptedInvitation = await ParticipantService.acceptInvitation(
      idParticipant,
      roundId
    );

    if (!acceptedInvitation.error) {
      if (acceptAndRequest) {
        dispatch(acceptAndRequestSet());
      }

      dispatch(invitationSucceded(acceptedInvitation.data));
      dispatch(loadRounds());
    } else {
      dispatch(invitationFailed(acceptedInvitation.error));
    }
  };
};

export const rejectInvitation = (idParticipant, roundId) => {
  return async dispatch => {
    dispatch(invitationStart());

    const rejectedInvitation = await ParticipantService.rejectInvitation(
      idParticipant,
      roundId
    );

    if (!rejectedInvitation.error) {
      dispatch(invitationSucceded(rejectedInvitation.data));
      dispatch(loadRounds());
    } else {
      dispatch(invitationFailed(rejectedInvitation.error));
      dispatch(loadRounds());
    }
  };
};

export const requestNumbers = (idParticipant, roundId, numbers) => {
  return async dispatch => {
    dispatch(requestNumbersStart());

    const requestedNumbers = await ParticipantService.requestNumbers(
      idParticipant,
      roundId,
      numbers
    );

    if (!requestedNumbers.error) {
      dispatch(acceptAndRequestClean());
      dispatch(requestNumbersSucceded(requestedNumbers.data));
      dispatch(loadRounds());
    } else {
      dispatch(requestNumbersFailed(requestedNumbers.error));
    }
  };
};

export const chargeNumber = (roundId, participantId, number) => {
  return async dispatch => {
    dispatch(chargeNumberStart());

    const chargedNumber = await ParticipantService.chargeNumber(
      roundId,
      participantId,
      number
    );

    if (!chargedNumber.error) {
      dispatch(chargeNumberSucceded(chargedNumber.data));
      dispatch(loadRounds());
    } else {
      dispatch(chargeNumberFailed(chargedNumber.error));
    }
  };
};

export const payNumberToParticipant = (roundId, participantId, number) => {
  return async dispatch => {
    dispatch(startRoundLoad());

    const chargedNumber = await ParticipantService.adminPaysNumberToUser(
      roundId,
      participantId,
      number
    );

    if (!chargedNumber.error) {
      await dispatch(await loadRounds());
      dispatch({ type: types.STOP_ROUND_DETAIL_LOADING });
      return true;
    }
    dispatch({ type: types.STOP_ROUND_DETAIL_LOADING });
    dispatch(openRoundDetailRootModal("Error al pagar el numero"));
    return false;
  };
};

export const getRoundData = roundId => async dispatch => {
  const res = await ParticipantService.getRoundData(roundId);

  if (!res.error) {
    const { data } = res;
    const round = { ...data, admin: data.admin.id };
    if (data.id)
      return dispatch({ type: types.GET_ROUND_DATA, payload: { round } });
  }
  return null;
};

export const requestPayment = (roundId, participantId) => async () => {
  const res = await ParticipantService.requestPayment(roundId, participantId);

  if (!res.error) {
    const { data } = res;
    if (data) return true;
  }
  return null;
};

export const requestAdminToAcceptPayment = (
  roundId,
  participantId
) => async () => {
  const res = await ParticipantService.requestAdminAcceptPayment(
    roundId,
    participantId
  );

  if (!res.error) {
    const { data } = res;
    if (data) return true;
  }
  return null;
};

export const getAllStoredRounds = () => async dispatch => {
  const rounds = await getAllRoundsFromStorage();
  return dispatch({ type: types.SET_STORED_ROUNDS, data: { rounds } });
};

export const removeStoredRound = roundIndex => async dispatch => {
  const removed = await deleteRoundFromStorage(roundIndex);
  if (removed) dispatch(getAllStoredRounds());
};

export const intentManager = data => async dispatch => {
  const actionData = JSON.parse(data.action);
  const { intent } = actionData;
  if (intent === ROUND_START) {
    const { admin, roundName } = actionData;
    const auth = await getAuth();
    if (admin === auth.id) {
      const roundModalMessage = `La ronda "${roundName}" se está procesando. Cuando comience, todos los participantes recibirán una notificación.`;
      return dispatch(
        openRoundDetailRootModal(roundModalMessage, "roundCheck")
      );
    }
  }
  if (intent === REMEMBER_PAYMENT) {
    const { roundName, shiftNumber, limitDate } = actionData;
    const dateObj = new Date(limitDate);
    const dateText = `${dateObj.getUTCDate()} de ${getMonthName(
      dateObj.getUTCMonth()
    )}`;
    const roundModalMessage = `Acuerdate que tienes hasta el ${dateText} Para pagar el #${shiftNumber} de la Ronda "${roundName}"`;
    return dispatch(
      openRoundDetailRootModal(roundModalMessage, "roundExclamation")
    );
  }
  return null;
};

// Accept and request set
export const acceptAndRequestSet = () => ({
  type: types.ACCEPT_AND_REQUEST,
});

// Accept and request clean
export const acceptAndRequestClean = () => ({
  type: types.ACCEPT_AND_REQUEST_CLEAN,
});

// Request numbers clean
export const requestNumbersClean = () => ({
  type: types.REQUEST_NUMBERS_CLEAN,
});

// Request numbers start
const requestNumbersStart = () => ({
  type: types.REQUEST_NUMBERS_START,
});

// Request numbers succeded
const requestNumbersSucceded = data => ({
  type: types.REQUEST_NUMBERS_SUCCEEDED,
  payload: { data },
});

// Request numbers failed
const requestNumbersFailed = error => ({
  type: types.REQUEST_NUMBERS_FAILED,
  payload: { error },
});

// Invitation clean
export const invitationClean = () => ({
  type: types.INVITATION_CLEAN,
});

// Accept invitation start
const invitationStart = () => ({
  type: types.INVITATION_START,
});

// Accept invitation succeded
const invitationSucceded = data => ({
  type: types.INVITATION_SUCCEEDED,
  payload: { data },
});

// Accept invitation failed
const invitationFailed = error => ({
  type: types.INVITATION_FAILED,
  payload: { error },
});

// Swap participant clean
export const swapClean = () => ({
  type: types.SWAP_CLEAN,
});

// Remove participant clean
export const removeClean = () => ({
  type: types.REMOVE_CLEAN,
});

// Swap participant start
const swapParticipantStart = () => ({
  type: types.SWAP_PARTICIPANT_START,
});

// Swap participant succeded
const swapParticipantSucceded = data => ({
  type: types.SWAP_PARTICIPANT_SUCCEEDED,
  payload: { data },
});

// Swap participant failed
const swapParticipantFailed = error => ({
  type: types.SWAP_PARTICIPANT_FAILED,
  payload: { error },
});

// Remove participant start
const removeParticipantStart = () => ({
  type: types.REMOVE_PARTICIPANT_START,
});

// Remove participant succeded
const removeParticipantSucceded = data => ({
  type: types.REMOVE_PARTICIPANT_SUCCEEDED,
  payload: { data },
});

// Remove participant failed
const removeParticipantFailed = error => ({
  type: types.REMOVE_PARTICIPANT_FAILED,
  payload: { error },
});

// Assign participant start
const assignParticipantStart = () => ({
  type: types.ASSIGN_PARTICIPANT_START,
});

// Assign participant succeded
const assignParticipantSucceded = data => ({
  type: types.ASSIGN_PARTICIPANT_SUCCEEDED,
  payload: { data },
});

// Assign participant failed
const assignParticipantFailed = error => ({
  type: types.ASSIGN_PARTICIPANT_FAILED,
  payload: { error },
});

// Load rounds start
const loadRoundsStart = () => ({
  type: types.LOAD_ROUNDS_START,
});

// Load rouns succeded
const loadRoundsSucceeded = data => ({
  type: types.LOAD_ROUNDS_SUCCEEDED,
  payload: data,
});

// Load rouns failed
const loadRoundsFail = error => ({
  type: types.LOAD_ROUNDS_FAILED,
  payload: { error },
});

// Delete round
const deleteRoundStart = () => ({
  type: types.DELETEROUND_REQUEST_START,
});

// Start round start
const startRoundStart = () => ({
  type: types.START_ROUND_START,
});

// Start round succeded
const startRoundSucceded = data => ({
  type: types.START_ROUND_SUCCEEDED,
  payload: { data },
});

// Start round failed
const startRoundFailed = error => ({
  type: types.START_ROUND_FAILED,
  payload: { error },
});

// Remove round
const removeRound = id => ({
  type: types.REMOVE_ROUND,
  payload: { id },
});

const deleteRoundSucceeded = () => ({
  type: types.DELETEROUND_REQUEST_SUCCEEDED,
});

const deleteRoundFail = error => ({
  type: types.DELETEROUND_REQUEST_FAILED,
  payload: { error },
});

// Load round start
const startRoundLoad = () => ({
  type: types.START_ROUND_LOAD,
});

// Pay round clean
export const payRoundClean = () => ({
  type: types.PAY_ROUND_CLEAN,
});

// Pay round (data)
const payRoundData = data => ({
  type: types.PAY_ROUND,
  payload: { data },
});

// Pay round (failed)
const payRoundFailed = error => ({
  type: types.PAY_ROUND_FAILED,
  payload: error,
});

//  Charge number start
const chargeNumberStart = () => ({
  type: types.CHARGE_NUMBER_START,
});
// Charge number succeded
const chargeNumberSucceded = data => ({
  type: types.CHARGE_NUMBER_SUCCEEDED,
  payload: { data },
});

// Charge number failed
const chargeNumberFailed = error => ({
  type: types.CHARGE_NUMBER_FAILED,
  payload: { error },
});

// Charge number failed
export const chargeNumberClean = () => ({
  type: types.CHARGE_NUMBER_CLEAN,
});
