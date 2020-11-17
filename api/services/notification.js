const user_manager = require("../managers/user");
const notifications_manager = require("../managers/notification");
const { customError } = require("../helpers/errorHandler");

exports.markNotificationsAsViewed = async req => {
  const { username } = req.body;
  const user = await user_manager.byUsername(username);
  if (!user) throw new customError("User doesn't exist");

  const response = await notifications_manager.viewAllByUserId(user._id);
  return {
    toUpdate: response.n,
    updated: response.nModified
  };
};
