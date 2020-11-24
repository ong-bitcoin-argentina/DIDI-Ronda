const user_manager = require("../managers/user");
const notifications_manager = require("../managers/notification");
const { customError } = require("../helpers/errorHandler");

exports.getNotifications = async req => {
  const { username } = req.body;
  const { page, limit } = req.query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const user = await user_manager.byUsername(username);
  if (!user) throw new customError("User don't exists");

  const list = await notifications_manager.byUserId(
    user._id,
    pageNumber,
    limitNumber
  );

  return {
    items: list,
    unreaded: list.filter(item => !item.viewedAt).length,
    count: await notifications_manager.countByUserId(user._id),
    page: pageNumber || 0,
    limit: limitNumber || undefined
  };
};

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
