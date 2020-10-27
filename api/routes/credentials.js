const express = require("express");
const router = express.Router();

// CONTROLLER
const credential_controller = require("../controllers/credential");

router.post(
  "/rounds/:roundId/emitFinished",
  credential_controller.emitFinishedRoundParticipantsById
);

router.post(
  "/rounds/:roundId/emitStarted",
  credential_controller.emitStartedRoundParticipantsById
);

router.post("/emitPending", credential_controller.emitPendingCredentials);

module.exports = router;
