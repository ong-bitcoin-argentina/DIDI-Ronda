const express = require("express");
const router = express.Router();
const { validation, objectId } = require("../helpers/validators");

// CONTROLLER
const credential_controller = require("../controllers/credential");

// Emit credentials for a finished round
router.post(
  "/rounds/:roundId/emitFinished",
  [objectId("roundId")],
  validation,
  credential_controller.emitFinishedRoundParticipantsById
);

// Emit credentials for a started round
router.post(
  "/rounds/:roundId/emitStarted",
  [objectId("roundId")],
  validation,
  credential_controller.emitStartedRoundParticipantsById
);

// Emit pending credentials
router.post("/emitPending", credential_controller.emitPendingCredentials);

module.exports = router;
