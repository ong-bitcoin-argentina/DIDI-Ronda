const moment = require("moment");
const request = require("request-promise-native");
const { customError } = require("../helpers/errorHandler");
const participant_services = require("../services/participant");
const credentials_pending_manager = require("../managers/credentials_pending");
const { createCredentialJWT } = require("../helpers/jwt");
const { logError, logSuccess } = require("../helpers/utils");
const {
  getFinishedCredential,
  fields,
  getStartedCredential
} = require("../helpers/credential");
const { DIDI_SERVER } = process.env;

const createToken = async (credential, did, isFinished = false) => {
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

  const possibleExpiration =
    new Date(credential[fields.endDate]).getTime() / 1000;
  const exp = !isFinished && possibleExpiration;

  return await createCredentialJWT(data, did, exp);
};

const emit = async (
  { credential, participant, pendingJwt },
  isFinished = false
) => {
  const { did } = participant.user;
  if (!did) return;

  const jwt = pendingJwt || (await createToken(credential, did, isFinished));

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
    const roundId = credential[fields.id];
    await credentials_pending_manager.createOrGet(roundId, participant, jwt);
    return `El participante con el DID ${did} no se pudo emitir`;
  }

  await credentials_pending_manager.deleteByJwt(jwt);
  await participant_services.findAndUpdateJWTs(participant._id, jwt);
  return response.data;
};

const emmitRoundParticipants = async (round, isFinished = false) => {
  const endDate = moment(round.endDate);
  const isAfterNow = endDate.isAfter(moment());
  if (isFinished && (!endDate || isAfterNow))
    throw new customError("La ronda aún no finalizó");

  const filteredParticipants = round.participants.filter(
    participant => participant.user && participant.user.did
  );

  const getCredential = isFinished
    ? getFinishedCredential
    : getStartedCredential;
  const credentials = filteredParticipants.map(participant =>
    getCredential(participant, round)
  );

  const requests = credentials.map(data => emit(data, isFinished));
  return await Promise.all(requests);
};

const emitFinishedRoundParticipants = async round => {
  return emmitRoundParticipants(round, true);
};

const emitStartedRoundParticipants = async round => {
  return emmitRoundParticipants(round);
};

const emitPendingCredentials = async () => {
  const credentialsPending = await credentials_pending_manager.findAll();
  const count = credentialsPending.length;
  console.log(`${count} credenciales pendientes de emisión.`);
  if (!count) {
    return `No hay credenciales pendientes de emisión.`;
  }
  const requests = credentialsPending.map(item =>
    emit({
      pendingJwt: item.jwt,
      participant: item.participant,
      credential: item.round
    })
  );
  const makedRequests = await Promise.all(requests);
  const emitted = makedRequests.filter(item => item.hash).length;
  const noEmitted = makedRequests.filter(item => !item.hash).length;
  if (emitted)
    logSuccess(`${emitted} credenciales fueron emitidas correctamente.`);
  if (noEmitted) logError(`${noEmitted} credenciales fallaron en su emisión.`);

  return makedRequests;
};

module.exports = {
  emitPendingCredentials,
  emitFinishedRoundParticipants,
  emitStartedRoundParticipants
};
