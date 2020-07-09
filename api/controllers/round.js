const { generic } = require("../helpers/errorHandler");
const backgroundPostRes = require("../services/postRes");

// RETURN TEST (async)
exports.test = async (req, res) => {
  const response = await new Promise(resolve =>
    setTimeout(() => resolve({ hello: "world" }), 500)
  );

  res.status(200).jsonp(response);
};

// SERVICES
const round_services = require("../services/round");

/*
    Fetch round by id
    GET
    /round/:id
*/
exports.byId = async (req, res) => {
  try {
    const round = await round_services.byId(req, res);
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
    Create new round
    POST
    /user/round/
*/
exports.create = async (req, res) => {
  try {
    const create = await round_services.create(req, res);
    create && create.error
      ? res.status(200).jsonp({ error: create.error })
      : res.status(200).jsonp(create.round);
    backgroundPostRes.createdRound(create);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

exports.update = async (req, res) => {
  try {
    const update = await round_services.update(req, res);
    return update && update.error
      ? res.status(200).jsonp({ error: update.error })
      : res.status(200).jsonp(update);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

exports.reSendInvite = async (req, res) => {
  try {
    const invitations = await round_services.reSendInvite(req, res);
    return invitations && invitations.error
      ? res.status(200).jsonp({ error: invitations.error })
      : res.status(200).jsonp(invitations);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

/*
    Delete a round from admin
    DELETE
    /admin/round/:id/
*/
exports.delete = async (req, res) => {
  try {
    const deleteRound = await round_services.delete(req, res);
    return deleteRound && deleteRound.error
      ? res.status(200).jsonp({ error: deleteRound.error })
      : res.status(200).jsonp(deleteRound);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

/*
    Swap participan with other user
    participantSwap
    /admin/round/:roundId/participant/:participantId/swap
*/
exports.participantSwap = async (req, res) => {
  try {
    const data = await round_services.participantSwap(req, res);
    data && data.error
      ? res.status(200).jsonp({ error: data.error })
      : res.status(200).jsonp(data.round);
    backgroundPostRes.swapParticipant(data);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

/*
    Reasign participant number with the target number
    participantSwap
    /admin/round/:roundId/participant/:participantId/:number/:targetParticipantId/reasign
*/
exports.participantReasignNumber = async (req, res) => {
  try {
    const reasign = await round_services.participantReasignNumber(req);
    return reasign && reasign.error
      ? res.status(200).jsonp({ error: reasign.error })
      : res.status(200).jsonp(reasign);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

/*
    Remove participan from not started round
    participantSwap
    /admin/round/:roundId/participant/:participantId/remove
*/
exports.participantRemove = async (req, res) => {
  try {
    const participantRemove = await round_services.participantRemove(req, res);
    return participantRemove && participantRemove.error
      ? res.status(200).jsonp({ error: participantRemove.error })
      : res.status(200).jsonp(participantRemove);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

/*
    Admin start round
    POST
    /admin/round/:roundId/start
*/
exports.startRound = async (req, res) => {
  try {
    const data = await round_services.start(req, res);
    data && data.error
      ? res.status(200).jsonp({ error: data.error })
      : res.status(200).jsonp(data.round);
    backgroundPostRes.startRound(data);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

/*
    Admin assign shift to participant
    POST
    /admin/round/:roundId/number/:number/assign
*/
exports.assignShiftNumber = async (req, res) => {
  try {
    const assignShiftNumber = await round_services.assignShiftNumber(req, res);
    return assignShiftNumber && assignShiftNumber.error
      ? res.status(200).jsonp({ error: assignShiftNumber.error })
      : res.status(200).jsonp(assignShiftNumber);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

/*
    Admin complete round shift
    POST
    /round/:roundId/number/:number/complete
*/
exports.completeShift = async (req, res) => {
  try {
    const completeShift = await round_services.completeShift(req, res);
    return completeShift && completeShift.error
      ? res.status(200).jsonp({ error: completeShift.error })
      : res.status(200).jsonp(completeShift);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};
