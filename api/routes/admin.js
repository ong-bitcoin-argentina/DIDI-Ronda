const express = require("express");
const router = express.Router();
const {
  validation,
  objectId,
  username,
  phone,
  number,
  nextParticipants,
} = require("../helpers/validators");
const routesMiddleware = require("../middleware/routesMiddleware");

// CONTROLLER
const round_controller = require("../controllers/round");

// CREATE ROUTES ON ROUTER

// Participant pay confirm
router.post("/round/:id/:user/payConfirm", round_controller.test);

// Round pay confirm
router.post("/round/:id/payConfirm", round_controller.test);

// Assign number to participant
router.post("/round/:id/numberAssign", round_controller.test);

// Show pending number requests
router.get("/round/:id/numberRequests", round_controller.test);

// Number draw between participants
router.post("/round/:id/numberDraw", round_controller.test);

// Invite participant to round
router.post("/round/:id/invite", round_controller.test);

// Send notification to guarantor
router.post("/round/:id/guarantorNotification", round_controller.test);

// Participant swap
router.post(
  "/round/:roundId/participant/:participantId/swap",
  [
    objectId("roundId"),
    objectId("participantId"),
    phone("newParticipant.phone"),
  ],
  validation,
  round_controller.participantSwap
);

// Participant number reasign
router.put(
  "/round/:roundId/participant/:participantId/:number/:targetParticipantId/reasign",
  [],
  validation,
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
router.delete("/round/:id", [username], validation, round_controller.delete);

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

// Complete a shift
router.post(
  "/round/:roundId/number/:number/complete",
  [objectId("roundId"), username, number, nextParticipants],
  validation,
  routesMiddleware.admin,
  round_controller.completeShift
);

module.exports = router;
