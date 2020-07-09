const express = require("express");
const router = express.Router();
const {
  validation,
  username,
  password,
  displayName,
  userId,
} = require("../helpers/validators");

// CONTROLLER
const guest_controller = require("../controllers/guest");

// CREATE ROUTES ON ROUTER

// App login
router.post("/login", [username, password], validation, guest_controller.login);

// App register
router.post(
  "/register",
  [displayName, username, password],
  validation,
  guest_controller.register
);

router.post(
  "/transaction",
  [username],
  validation,
  guest_controller.transaction
);

router.post(
  "/getContent",
  [userId],
  validation,
  guest_controller.getContentFromSubdomain
);

router.post("/is_owner", [username], validation, guest_controller.isOwner);

// Account verification
router.post("/verify", [username], validation, guest_controller.verifyAccount);

// App forgot password
router.post("/forgot", guest_controller.forgot);

router.post("/forgot/code", guest_controller.forgotCode);

router.post("/forgot/password", guest_controller.forgotNewPassword);

// App phone register
router.post("/phone", guest_controller.phone);

router.post("/phone/code", guest_controller.phoneCode);

module.exports = router;
