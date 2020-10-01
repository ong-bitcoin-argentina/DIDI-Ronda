const express = require("express");
const router = express.Router();

// CONTROLLER
const credential_controller = require("../controllers/credential");

router.post(
  "/rounds/:roundId/emmit",
  credential_controller.emmitRoundParticipantsById
);

module.exports = router;
