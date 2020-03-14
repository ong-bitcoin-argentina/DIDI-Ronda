import api_call from './helper';


export const acceptInvitation = async ( idParticipant, roundId ) => {

  try {
    return await api_call(
      'post',
      `/participant/round/${roundId}/participant/${idParticipant}/accept`,
    );
  } catch (error) {
    return {error};
  }

}

export const rejectInvitation = async ( idParticipant, roundId ) => {

  try {
    return await api_call(
      'post',
      `/participant/round/${roundId}/participant/${idParticipant}/reject`,
    );
  } catch (error) {
    return {error};
  }

}

export const requestNumbers = async ( idParticipant, roundId, numbers ) => {

  try {
    return await api_call(
      'post',
      `/participant/round/${roundId}/participant/${idParticipant}/requestNumbers`,
      {
        numbers: numbers
      }
    );
  } catch (error) {
    return {error};
  }

}