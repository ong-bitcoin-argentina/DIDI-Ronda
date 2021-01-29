// SERVICES
const user_services = require("../services/user");
const notification_service = require("../services/notification");
const postResBackground = require("../services/postRes");
const user_manager = require("../managers/user");
const { SC_FEATURES } = require("../utils/other");

const { generic } = require("../helpers/errorHandler");

const { parseValues, responseHandler } = require("../utils/other");

// RETURN TEST (async)
exports.test = async (req, res) => {
  const response = await new Promise((resolve, reject) =>
    setTimeout(() => resolve({ req: req }), 500)
  );

  res.status(200).jsonp(response);
};

// Get user by username
exports.byUsername = async (req, res) => {
  const user = await user_services.byUsername(req, res);
  res.status(200).jsonp(user);
};

// Get user by username
exports.byDID = async (req, res) => {
  const user = await user_services.byDID(req, res);
  res.status(200).jsonp(user);
};

// Update user by username
exports.updateByUsername = async (req, res) => {
  try {
    const user = await user_services.updateByUsername(req, res);
    res.status(200).jsonp(user);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, err.message);
  }
};

// Get user's notification by username
exports.getNotifications = async (req, res) => {
  try {
    const result = await notification_service.getNotifications(req);
    return responseHandler(res, result);
  } catch (err) {
    console.log(err);
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

// Mark user's notification as viewed with date
exports.markNotificationsAsViewed = async (req, res) => {
  try {
    const result = await notification_service.markNotificationsAsViewed(req);
    return responseHandler(res, result);
  } catch (err) {
    console.log(err);
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

// set user profile picture

exports.setProfileImage = async (req, res) => {
  const data = await parseValues(req);
  const user = await user_services.setProfileImage(data);
  res.status(200).jsonp(user);
};

// Get user rounds
exports.roundsOfUser = async (req, res) => {
  const rounds = await user_services.roundsOfUser(req, res);
  res.status(200).jsonp(rounds);
};

// Get user data
exports.userData = async (req, res) => {
  try {
    const userData = await user_services.userData(req, res);
    return userData && userData.error
      ? res.status(200).jsonp({ error: userData.error })
      : res.status(200).jsonp(userData);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

// Update user token
exports.updateToken = async (req, res) => {
  try {
    const updateToken = await user_services.updateToken(req, res);
    return updateToken && updateToken.error
      ? res.status(200).jsonp({ error: updateToken.error })
      : res.status(200).jsonp(updateToken);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

exports.forceSCEnable = async (req, res) => {
  try {
    const user = await user_manager.byUsername(req.body.username);
    if (SC_FEATURES && user && !user.sc) {
      const res = await postResBackground.enableSCToUser(user);
      return res.status(200).jsonp(res);
    }
    return res.status(200).jsonp(user);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};
