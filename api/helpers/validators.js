const { check, validationResult } = require("express-validator");
const config = require("./config");

const recurrenceKeys = Object.keys(config.recurrenceConfig);
/* CHECKERS */

// General
exports.id = check("id").matches("^[0-9a-fA-F]{24}$");
exports.objectId = value =>
  check(value, `${value} must be a valid ID`).matches("^[0-9a-fA-F]{24}$");
exports.boolean = value => check(value, `${value} must be boolean`).isBoolean();

// User
exports.username = check("username")
  .trim()
  .isEmail();
exports.password = check("password").isLength({ min: 5 });
exports.phone = value => check(value).isLength({ min: 5, max: 20 });
exports.displayName = check("name").isLength({ min: 2 });
exports.newToken = check("newToken").isLength({ min: 1 });
exports.token = check("newToken").isLength({ min: 1 });
exports.userId = check("userId").isLength({ min: 1 });

// Round
exports.name = check("name").isLength({ min: 1 });
exports.amount = check("amount").isInt({ min: 1 });
exports.number = check("number").isInt({ min: 1 });
exports.numbers = check("numbers").isArray({ min: 1 });
exports.recurrence = check("recurrence").isIn(recurrenceKeys);
exports.limitDate = check(
  "limitDate",
  "Valid date (YYYY/MM/DD) greater than now"
)
  .toDate()
  .isAfter();
exports.startDate = check(
  "startDate",
  "Valid date (YYYY/MM/DD) greater than now"
)
  .toDate()
  .isAfter();

exports.firstPaymentDate = check(
  "firstPaymentDate",
  "Valid date (YYYY/MM/DD) greater than now"
)
  .toDate()
  .isAfter();

exports.shiftStatus = check("shiftStatus").isIn(config.shiftStatus);
exports.nextParticipants = check("nextParticipants").isArray();

/* Validation */
exports.validation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};
