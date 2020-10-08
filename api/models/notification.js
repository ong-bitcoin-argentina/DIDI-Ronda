const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const notificationSchema = new Schema({
  code: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  body: { type: String, required: true },
  userId: { type: ObjectId, ref: "User" },
});

module.exports = mongoose.model("Notification", notificationSchema);