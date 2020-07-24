const round_manager = require("../managers/round");
const { generic } = require("../helpers/errorHandler");
const JWT = require("../helpers/jwt");

exports.participant = async (req, res, next) => {
  const { roundId } = req.params;

  // Check if user is round participant
  const round = await round_manager.findById(roundId);
  const usernameFromToken = JWT.getUsernameFromToken(req);
  if (round === null) return generic(res, "Round not exist");
  const participant = round.participants.find(
    e => e.user.username === usernameFromToken
  );
  if (!participant) return generic(res, "Only participants can access");
  // Override username that we get from the token
  req.body.username = usernameFromToken;
  // This property is used to distinguish between the id from params and the user who performed the request
  req.middlewareData = {};
  req.middlewareData.participantId = participant.id;
  return next();
};

exports.admin = async (req, res, next) => {
  const { roundId } = req.params;

  // Check if user is round participant
  const round = await round_manager.findById(roundId);
 const usernameFromToken = JWT.getUsernameFromToken(req);
  if (round === null) return generic(res, "Round not exist");
  if (round.admin.username !== usernameFromToken)
    return generic(res, "Only admin can access");
  req.middlewareData = {};
  if(req.body && Object.keys(req.body)) {
    req.middlewareData.participantId = req.body.participantId;
  }
  return next();
};
