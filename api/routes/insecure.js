const express = require("express");
const router = express.Router();
const { validation } = require("../helpers/validators");

// CONTROLLER
const round_controller = require("../controllers/round");

// CREATE ROUTES ON ROUTER

// get round by id (this helps to get virtual fields)
router.get("/round/:roundId", [], validation, round_controller.byId);

// finish round with simulated fields
router.post(
  "/round/:roundId/finish",
  [],
  validation,
  round_controller.simulateFinish
);

module.exports = router;
