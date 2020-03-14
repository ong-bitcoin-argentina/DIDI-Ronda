import api_call from './helper';

export const deleteRound = async id => {
  try {
    return await api_call('delete', `/admin/round/${id}`);
  } catch (error) {
    return {error};
  }
};

export const startRound = async id => {
  try {
    return await api_call('post', `/admin/round/${id}/start`);
  } catch (error) {
    return {error};
  }
};

export const closeRound = async (roundId, number, nextDraw) => {
  try {
    return await api_call(
      'post',
      `/admin/round/${roundId}/number/${number}/complete`,
      {
        nextDraw: nextDraw,
      },
    );
  } catch (error) {
    return {error};
  }
};

export const payRound = async (roundId, number, participant) => {
  try {
    return await api_call(
      'post',
      `/admin/round/${roundId}/number/${number}/pay`,
      {
        participantId: participant,
      },
    );
  } catch (error) {
    return {error};
  }
};

export const swapParticipant = async ( idParticipant, newUser, roundId ) => {

  try {
    return await api_call(
      'post',
      `/admin/round/${roundId}/participant/${idParticipant}/swap`,
      {
        newParticipant: {
          phone: newUser.phone,
          name: newUser.name
        }
      },
    );
  } catch (error) {
    return {error};
  }

}

export const removeParticipant = async ( idParticipant, roundId ) => {

  try {
    return await api_call(
      'post',
      `/admin/round/${roundId}/participant/${idParticipant}/remove`,
    );
  } catch (error) {
    return {error};
  }

}



export const assignParticipantToNumber = async ( idParticipant, roundId, shiftNumber ) => {

  try {
    return await api_call(
      'post',
      `/admin/round/${roundId}/number/${shiftNumber}/assign`,
      {
        participantId: idParticipant
      },
    );
  } catch (error) {
    return {error};
  }

}