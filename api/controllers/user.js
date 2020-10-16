// SERVICES
const user_services = require("../services/user");

const { generic } = require("../helpers/errorHandler");

const otherUtils = require("../utils/other");
const { createNotification } = require("../helpers/notifications/config");
const { APP_TITLE } = require("../helpers/notifications/notifications");
const { roundListTest } = require("../helpers/notifications/messages");

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

// Update user by username
exports.updateByUsername = async (req, res) => {
  try {
    const user = await user_services.updateByUsername(req, res);
    res.status(200).jsonp(user);
  } catch (err) {
    return err.name === "customError"
      ? generic(res, err.message)
      : generic(res, "");
  }
};

// Get user's notification by username
exports.getNotifications = async (req, res) => {
  res.status(200).jsonp(await user_services.getNotifications(req));
};

// set user profile picture

exports.setProfileImage = async (req, res) => {
  const data = await otherUtils.parseValues(req);
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

exports.notify = async (req, res) => {
  try {
    const user = await user_services.findByUsername(req.params.username);
    const action = JSON.stringify({
      routeName: "Rondas"
    });
    const notification = await createNotification(
      [user.token],
      APP_TITLE,
      roundListTest(),
      { action }
    );
    console.log(notification);
    const result = { message: roundListTest(), username: user.username };
    res.status(200).jsonp(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
