const express = require("express");
const router = express.Router();
const {
  validation,
  username,
  objectId,
  numbers,
  number,
} = require("../helpers/validators");
const routesMiddleware = require("../middleware/routesMiddleware");

// CONTROLLERS
const round_controller = require("../controllers/round");
const participant_controller = require("../controllers/participant");

// CREATE ROUTES ON ROUTER

// Request round information
router.get(
  "/round/:roundId",
  [objectId("roundId"), username],
  validation,
  routesMiddleware.participant,
  round_controller.byId
);

// Request participant information
router.get(
  "/round/:roundId/participant/:participantId",
  [objectId("roundId"), objectId("participantId"), username],
  validation,
  routesMiddleware.participant,
  participant_controller.byId
);

// Request free numbers
router.post(
  "/round/:roundId/participant/:participantId/requestNumbers",
  [objectId("roundId"), objectId("participantId"), numbers, username],
  validation,
  routesMiddleware.participant,
  participant_controller.requestNumbers
);

// Accept invitation
router.post(
  "/round/:roundId/participant/:participantId/accept",
  [objectId("roundId"), objectId("participantId"), username],
  validation,
  routesMiddleware.participant,
  participant_controller.acceptRound
);

// Reject invitation
router.post(
  "/round/:roundId/participant/:participantId/reject",
  [objectId("roundId"), objectId("participantId"), username],
  validation,
  routesMiddleware.participant,
  participant_controller.rejectRound
);

// Pay participant round number
router.post(
  "/round/:roundId/number/:number/pay",
  [objectId("roundId"), objectId("participantId"), username, number],
  validation,
  routesMiddleware.participant,
  participant_controller.payNumber
);

// Charge participant round number , so participant get its number payed
router.post(
  "/round/:roundId/number/:number/charge",
  [objectId("roundId"), objectId("participantId"), username, number],
  validation,
  routesMiddleware.participant,
  participant_controller.chargeNumber
);

// The current number asks to be payed to the admin
router.post(
  "/round/:roundId/participant/:participantId/requestPayment",
  [objectId("roundId"), objectId("participantId"), username],
  validation,
  routesMiddleware.participant,
  participant_controller.requestPayment
);

router.post(
  "/round/:roundId/participant/:participantId/requestAdminAcceptPayment",
  [objectId("roundId"), objectId("participantId"), username],
  validation,
  routesMiddleware.participant,
  participant_controller.requestAdminToAcceptPayment
);

module.exports = router;
