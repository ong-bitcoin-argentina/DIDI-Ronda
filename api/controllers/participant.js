const { generic } = require("../helpers/errorHandler");
const backgroundPostRes = require("../services/postRes");

// SERVICES
const participant_services = require("../services/participant");
const round_services = require("../services/round");

// Get user by username
exports.byId = async (req, res) => {
  try {
    const participant = await participant_services.byId(req, res);
    return participant && participant.error
      ? res.status(200).jsonp({ error: participant.error })
      : res.status(200).jsonp(participant);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

// Accept round invitation
exports.acceptRound = async (req, res) => {
  try {
    const data = await participant_services.acceptRound(req, res);
    data && data.error
      ? res.status(200).jsonp({ error: data.error })
      : res.status(200).jsonp(data.participant);
    backgroundPostRes.acceptOrRejecInvitation(data);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

// Reject round invitation
exports.rejectRound = async (req, res) => {
  try {
    const data = await participant_services.rejectRound(req, res);
    data && data.error
      ? res.status(200).jsonp({ error: data.error })
      : res.status(200).jsonp(data);

    backgroundPostRes.acceptOrRejecInvitation(data);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

// Request round numbers
exports.requestNumbers = async (req, res) => {
  try {
    const round = await participant_services.requestNumbers(req, res);
    return round && round.error
      ? res.status(200).jsonp({ error: round.error })
      : res.status(200).jsonp(round);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

/*
    Participant pay round number
    POST
    /participant/round/:roundId/number/:number/pay
*/
exports.payNumber = async (req, res) => {
  try {
    const data = await round_services.participantPayNumber(req, res);
    data && data.error
      ? res.status(200).jsonp({ error: data.error })
      : res.status(200).jsonp(data);
    backgroundPostRes.payNumber(data);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

/*
    Participant charge round number
    POST
    /participant/round/:roundId/number/:number/charge
*/
exports.chargeNumber = async (req, res) => {
  try {
    const participantChargeNumber = await participant_services.participantChargeNumber(
      req,
      res
    );
    return participantChargeNumber && participantChargeNumber.error
      ? res.status(200).jsonp({ error: participantChargeNumber.error })
      : res.status(200).jsonp(participantChargeNumber);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

/*
    ADMIN performs the Participant pay round number
    POST
    /participant/round/:roundId/number/:number/charge
*/
exports.adminPayNumber = async (req, res) => {
  try {
    const data = await round_services.participantPayNumber(req, res);
    data && data.error
      ? res.status(200).jsonp({ error: data.error })
      : res.status(200).jsonp(data);
    backgroundPostRes.payNumber(data);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

/*
    Participant requests admin to be payed
    POST
  "/round/:roundId/participant/:participantId/requestPayment",
*/
exports.requestPayment = async (req, res) => {
  try {
    const result = await participant_services.requestPayment(req);
    return result && result.error
      ? res.status(200).jsonp({ error: result.error })
      : res.status(200).jsonp(result);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};
