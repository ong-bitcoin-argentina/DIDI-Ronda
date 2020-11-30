import * as types from "./types";
import * as UserService from "../services/api/user";
import { loadRounds, removeStoredRound } from "./rounds";
import { saveRoundToStorage } from "../services/asyncStorage";
import { openRoundDetailRootModal } from "./roundDetailRootModal";
import NavigationService from "../services/navigation/index";
import { getAuth } from "../utils/utils";

export const creationNextStep = nextStep => {
  return dispatch => {
    dispatch({ type: types.CREATION_NEXT_STEP, data: { step: nextStep } });
  };
};
export const setName = name => {
  return dispatch => {
    dispatch({ type: types.CREATION_NAME, data: { name } });
  };
};
export const setAmount = amount => {
  return dispatch => {
    dispatch({ type: types.CREATION_AMOUNT, data: { amount } });
  };
};

export const setFrequency = frequency => {
  return dispatch => {
    dispatch({ type: types.CREATION_FREQUENCY, data: { frequency } });
  };
};

export const setTurns = turns => dispatch =>
  dispatch({ type: types.CREATION_TURNS, data: { turns } });

export const setDate = date => {
  return dispatch => {
    dispatch({ type: types.CREATION_DATE, data: { date } });
  };
};

export const setConfirmationDate = date => {
  return dispatch => {
    dispatch({ type: types.CREATION_CONFIRMATION_DATE, data: { date } });
  };
};

export const setPaymentDate = date => {
  return dispatch => {
    dispatch({ type: types.CREATION_PAYMENT_DATE, data: { date } });
  };
};

export const setPickTurnsManual = pickTurnsManual => dispatch =>
  dispatch({ type: types.PICK_TURNS_MANUAL, data: { pickTurnsManual } });

export const setNewAssignedNumber = (number, data) => dispatch =>
  dispatch({
    type: types.NEW_NUMBER_ASSIGNED,
    data: { userData: data, number },
  });

export const removeAssignedNumber = number => dispatch =>
  dispatch({
    type: types.REMOVE_ASSIGNED_NUMBER,
    data: { number },
  });

export const setCompletedParticipantSection = () => dispatch =>
  dispatch({ type: types.COMPLETED_PARTICIPANTS_SECTION });

export const saveCreationForLater = cb => async (dispatch, getState) => {
  const { roundCreation } = getState();
  const dataToSave = { ...roundCreation, isEditing: true };
  await saveRoundToStorage(dataToSave);
  if (cb) return cb();
  return null;
};

export const setEditRoundData = round => async dispatch => {
  dispatch({
    type: types.START_EDITING_ROUND,
    data: { round },
  });
};

export const editFromRoundDetail = id => async (dispatch, getState) => {
  const {
    rounds: { requestRounds },
  } = getState();
  const round = requestRounds.list.find(r => r._id === id);
  const auth = await getAuth();

  if (round.admin !== auth.id)
    return dispatch(openRoundDetailRootModal("Opcion inhabilitada"));
  if (!round.isConfirmed)
    return dispatch(
      openRoundDetailRootModal(
        "No se pueden editar Rondas que se estan confirmando"
      )
    );
  if (round.start)
    return dispatch(
      openRoundDetailRootModal("No se pueden editar Rondas ya iniciadas")
    );
  const turns = String(round.shifts.length);
  const date = round.startDate.split("T")[0];
  const frequency = round.recurrence;
  dispatch(
    setEditRoundData({
      ...round,
      turns,
      date,
      frequency,
      noParticipantEdit: true,
    })
  );
  return NavigationService.navigate("Create");
};

export const deleteFromRoundDetail = id => async (dispatch, getState) => {
  const {
    rounds: { requestRounds },
  } = getState();
  const round = requestRounds.list.find(r => r._id === id);
  const auth = await getAuth();
  if (round.admin !== auth.id)
    return dispatch(openRoundDetailRootModal("Opcion inhabilitada"));
  if (round.start)
    return dispatch(
      openRoundDetailRootModal("No se pueden eliminar Rondas ya iniciadas")
    );
  return null;
};

export const editRoundRequest = () => async (dispatch, getState) => {
  const { roundCreation } = getState();
  const { name, amount, frequency, date, id, shifts } = roundCreation;
  const numbersQuantity = shifts.length;
  const updateBody = {
    name,
    id,
    amount: parseInt(amount, 10) * numbersQuantity,
    recurrence: frequency,
    startDate: new Date(date).toISOString(),
  };
  const { error } = await UserService.updateRound(updateBody);
  if (error) return { error };
  dispatch(loadRounds());
  return { error: false };
};

export const checkIfAlreadyCreatingRound = () => (dispatch, getState) => {
  const { name } = getState().roundCreation;
  if (name) return true;
  return false;
};

export const createRound = () => {
  return async (dispatch, getState) => {
    dispatch(createRoundStart());

    const {
      amount,
      name,
      frequency,
      assignedNumbers,
      date,
      turns,
      roundIndex,
    } = getState().roundCreation;
    const numbersQuantity = assignedNumbers.length;
    const createdRound = await UserService.createRound(
      amount * numbersQuantity,
      frequency,
      name,
      assignedNumbers,
      date,
      turns
    );

    if (!createdRound.error) {
      // Success!
      if (roundIndex) {
        dispatch(removeStoredRound(roundIndex));
      }
      dispatch(clearStore());
      dispatch(createRoundSucceeded(createdRound.data));
      dispatch(loadRounds());
    } else {
      // Error!
      const errors =
        createdRound.error.response && createdRound.error.response.data;
      dispatch(createRoundFail(errors));
    }
  };
};

export const setParticipants = participants => {
  return dispatch => {
    dispatch({
      type: types.CREATION_PARTICIPANTS,
      data: { participants },
    });
  };
};

export const clearStore = () => ({
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
  payload: { error },
});
