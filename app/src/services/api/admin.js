import apiCall from "./helper";

export const deleteRound = async id => {
  try {
    return await apiCall("delete", `/admin/round/${id}`);
  } catch (error) {
    return { error };
  }
};

export const startRound = async id => {
  try {
    return await apiCall("post", `/admin/round/${id}/start`);
  } catch (error) {
    return { error };
  }
};

export const reSendInvite = async id => {
  try {
    return await apiCall("post", `admin/round/${id}/resendInvitations`);
  } catch (error) {
    return { error };
  }
};

export const swapParticipant = async (idParticipant, newUser, roundId) => {
  try {
    return await apiCall(
      "post",
      `/admin/round/${roundId}/participant/${idParticipant}/swap`,
      {
        newParticipant: {
          phone: newUser.phone,
          name: newUser.name,
        },
      }
    );
  } catch (error) {
    return { error };
  }
};

export const reasignParticipant = async (
  participantId,
  targetParticipantId,
  number,
  roundId
) => {
  try {
    return await apiCall(
      "put",
      `/admin/round/${roundId}/participant/${participantId}/${number}/${targetParticipantId}/reasign`,
      {
        participantId,
        targetParticipantId,
        number,
        roundId,
      }
    );
  } catch (error) {
    return { error };
  }
};

export const removeParticipant = async (idParticipant, roundId) => {
  try {
    return await apiCall(
      "post",
      `/admin/round/${roundId}/participant/${idParticipant}/remove`
    );
  } catch (error) {
    return { error };
  }
};

export const assignParticipantToNumber = async (
  idParticipant,
  roundId,
  shiftNumber
) => {
  try {
    return await apiCall(
      "post",
      `/admin/round/${roundId}/number/${shiftNumber}/assign`,
      {
        participantId: idParticipant,
      }
    );
  } catch (error) {
    return { error };
  }
};
