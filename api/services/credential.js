const moment = require("moment");
const request = require("request-promise-native");
const { customError } = require("../helpers/errorHandler");
const participant_services = require("../services/participant");
const credentials_pending_manager = require("../managers/credentials_pending");
const { createCredentialJWT } = require("../helpers/jwt");
const { logError } = require("../helpers/utils");
const {
  getFinishedCredential,
  fields,
  getStartedCredential
} = require("../helpers/credential");
const { DIDI_SERVER } = process.env;

const createToken = async (credential, did) => {
  const data = {
    Ronda: {
      preview: {
        type: 2,
        fields: [
          fields.roundName,
          fields.recurrence,
          fields.shifts,
          fields.endDate
        ]
      },
      category: "finance",
      data: credential
    }
  };

  return await createCredentialJWT(data, did);
};

const emmit = async ({ credential, participant }) => {
  const { did } = participant.user;
  if (!did) return;

  const jwt = await createToken(credential, did);

  const response = await request({
    url: `${DIDI_SERVER}/issuer/issueCertificate`,
    method: "POST",
    json: true,
    body: {
      did,
      jwt,
      sendPush: true
    }
  });

  if (response.status !== "success") {
    logError(response.message);
    await credentials_pending_manager.create(
      credential[fields.id],
      participant
    );
    return `El participante con el DID ${did} no se pudo emitir`;
  }

  await credentials_pending_manager.deleteByParticipant(participant._id);
  await participant_services.findAndUpdateJWTs(participant._id, jwt);
  return response.data;
};

const emmitRoundParticipants = async (round, isFinished = false) => {
  const endDate = moment(round.endDate);
  const isAfterNow = endDate.isAfter(moment());
  if (isFinished && (!endDate || isAfterNow))
    throw new customError("La ronda aún no finalizó");

  const filteredParticipants = round.participants.filter(
    participant =>
      participant.user &&
      participant.user.did &&
      participant.credentialJWTs.length < 2
  );

  const getCredential = isFinished
    ? getFinishedCredential
    : getStartedCredential;
  const credentials = filteredParticipants.map(participant =>
    getCredential(participant, round)
  );

  const requests = credentials.map(emmit);
  return await Promise.all(requests);
};

const emmitFinishedRoundParticipants = async round => {
  return emmitRoundParticipants(round, true);
};

const emmitStartedRoundParticipants = async round => {
  return emmitRoundParticipants(round);
};

module.exports = {
  emmitFinishedRoundParticipants,
  emmitStartedRoundParticipants
};
