const express = require("express");
const router = express.Router();

// CONTROLLER
const credential_controller = require("../controllers/credential");

router.post(
  "/rounds/:roundId/emmitFinished",
  credential_controller.emmitFinishedRoundParticipantsById
);

router.post(
  "/rounds/:roundId/emmitStarted",
  credential_controller.emmitStartedRoundParticipantsById
);

module.exports = router;
