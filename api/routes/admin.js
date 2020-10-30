const express = require("express");
const router = express.Router();
const {
  validation,
  objectId,
  username,
  phone,
  name,
  number,
  amount,
  recurrence,
  startDate,
  id,
} = require("../helpers/validators");
const routesMiddleware = require("../middleware/routesMiddleware");

// CONTROLLER
const round_controller = require("../controllers/round");
const participant_controller = require("../controllers/participant");

// Participant swap
router.post(
  "/round/:roundId/participant/:participantId/swap",
  [
    objectId("roundId"),
    objectId("participantId"),
    phone("newParticipant.phone"),
  ],
  validation,
  routesMiddleware.admin,
  round_controller.participantSwap
);

// Update an existing round
router.put(
  "/round/:roundId",
  [name, amount, recurrence, startDate, id],
  validation,
  routesMiddleware.admin,
  round_controller.update
);

// Participant number reasign
router.put(
  "/round/:roundId/participant/:participantId/:number/:targetParticipantId/reasign",
  [],
  validation,
  routesMiddleware.admin,
  round_controller.participantReasignNumber
);

// Participant remove from not started round
router.post(
  "/round/:roundId/participant/:participantId/remove",
  [objectId("roundId"), objectId("participantId")],
  validation,
  routesMiddleware.admin,
  round_controller.participantRemove
);

// re send invites ( ignored invites only )
router.post(
  "/round/:roundId/resendInvitations",
  [objectId("roundId")],
  validation,
  routesMiddleware.admin,
  round_controller.reSendInvite
);

// Delete round
router.delete(
  "/round/:roundId",
  [username],
  validation,
  routesMiddleware.admin,
  round_controller.delete
);

// Start round
router.post(
  "/round/:roundId/start",
  [objectId("roundId"), username],
  validation,
  routesMiddleware.admin,
  round_controller.startRound
);

// Assign shift number to participant
router.post(
  "/round/:roundId/number/:number/assign",
  [objectId("roundId"), objectId("participantId"), username, number],
  validation,
  routesMiddleware.admin,
  round_controller.assignShiftNumber
);

// Accept an user payment
router.post(
  "/round/:roundId/number/:number/pay",
  [objectId("roundId"), objectId("participantId"), username, number],
  validation,
  routesMiddleware.admin,
  participant_controller.adminPayNumber
);

// Pay number to participant
router.post(
  "/round/:roundId/number/:number/payNumberToParticipant",
  [objectId("roundId"), objectId("participantId"), username, number],
  validation,
  routesMiddleware.admin,
  round_controller.payNumberToParticipant
);

module.exports = router;
