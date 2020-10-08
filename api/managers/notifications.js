const Notification = require("../models/notification");

exports.byUserId = async (userId, page = 0, limit = 50) => {
  return await Notification.find({ userId }).skip(page * limit).limit(limit).sort({ date: -1 });
};

exports.countByUserId = async (userId) => {
  return await Notification.find({ userId }).count();
};
