const express = require("express");
const router = express.Router();
const {
  validation,
  name,
  amount,
  recurrence,
  startDate,
  limitDate,
  firstPaymentDate,
  username,
  newToken
} = require("../helpers/validators");

// CONTROLLERS
const user_controller = require("../controllers/user");
const round_controller = require("../controllers/round");

// CREATE ROUTES ON ROUTER

// User information
router.get("/", [username], validation, user_controller.byUsername);

// User notifications
router.post(
  "/notifications",
  [username],
  validation,
  user_controller.getNotifications
);

// Mark notifications as viewed
router.patch(
  "/notifications/markAsViewed",
  [username],
  validation,
  user_controller.markNotificationsAsViewed
);

// Update user information
router.post(
  "/update",
  [username],
  validation,
  user_controller.updateByUsername
);

// force de sc features registration
router.post(
  "/force-sc-enable",
  [username],
  validation,
  user_controller.forceSCEnable
);

router.post("/setProfileImage", user_controller.setProfileImage);

// List of rounds for user
router.get("/round", [username], validation, user_controller.roundsOfUser);

router.post("/userData", [username], validation, user_controller.userData);

// Create new round and become admin
router.post(
  "/round",
  [name, amount, recurrence, startDate, limitDate, firstPaymentDate],
  validation,
  round_controller.create
);

// Update firebase token
router.post(
  "/token/update",
  [username, newToken],
  validation,
  user_controller.updateToken
);

// Accept round invitation
router.post("/round/accept", round_controller.test);

module.exports = router;
