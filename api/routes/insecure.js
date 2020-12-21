const express = require("express");
const router = express.Router();
const { validation, username } = require("../helpers/validators");

// CONTROLLER
const round_controller = require("../controllers/round");
const user_controller = require("../controllers/user");

// CREATE ROUTES ON ROUTER

// get round by id (this helps to get virtual fields)
router.get("/round/:roundId", [], validation, round_controller.byId);

router.get("/rounds", [username], validation, user_controller.roundsOfUser);

// finish round with simulated fields
router.post(
  "/round/:roundId/finish",
  [],
  validation,
  round_controller.simulateFinish
);

router.get(
  "/user/did/:did",
  [],
  validation,
  user_controller.byDID
)

module.exports = router;
