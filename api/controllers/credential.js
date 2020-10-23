const { generic } = require("../helpers/errorHandler");

// SERVICES
const round_services = require("../services/round");
const credential_services = require("../services/credential");

exports.emmitFinishedRoundParticipantsById = async (req, res) => {
  try {
    const round = await round_services.byId(req);
    const credentials = await credential_services.emmitFinishedRoundParticipants(
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

exports.emmitStartedRoundParticipantsById = async (req, res) => {
  try {
    const round = await round_services.byId(req);
    const credentials = await credential_services.emmitStartedRoundParticipants(
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
