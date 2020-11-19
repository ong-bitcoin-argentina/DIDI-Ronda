const Notification = require("../models/notification");

exports.byUserId = async (userId, page = 0, limit = 50) => {
  return await Notification.find({ userId })
    .skip(page * limit)
    .limit(limit)
    .sort({ date: -1 });
};

exports.viewAllByUserId = async userId => {
  const query = { userId, viewedAt: { $exists: false } };
  const action = { $set: { viewedAt: new Date() } };
  return await Notification.updateMany(query, action);
};

exports.countByUserId = async userId => {
  return await Notification.count({ userId });
};
