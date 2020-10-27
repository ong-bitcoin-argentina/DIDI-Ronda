const { generic } = require("../helpers/errorHandler");

// SERVICES
const round_services = require("../services/round");
const credential_services = require("../services/credential");

exports.emitFinishedRoundParticipantsById = async (req, res) => {
  try {
    const round = await round_services.byId(req);
    const credentials = await credential_services.emitFinishedRoundParticipants(
      round
    );
    return round && round.error
      ? res.status(500).jsonp({ error: round.error })
      : res.status(200).jsonp({ credentials });
  } catch (err) {
    console.log(err);
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

exports.emitStartedRoundParticipantsById = async (req, res) => {
  try {
    const round = await round_services.byId(req);
    const credentials = await credential_services.emitStartedRoundParticipants(
      round
    );
    return round && round.error
      ? res.status(500).jsonp({ error: round.error })
      : res.status(200).jsonp({ credentials });
  } catch (err) {
    console.log(err);
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

exports.emitPendingCredentials = async (req, res) => {
  try {
    const result = await credential_services.emitPendingCredentials();
    return result && result.error
      ? res.status(500).jsonp({ error: result.error })
      : res.status(200).jsonp({ result });
  } catch (err) {
    console.log(err);
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};
