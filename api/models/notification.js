const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const notificationSchema = new Schema({
  code: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  body: { type: String, required: true },
  userId: { type: ObjectId, ref: "User", required: true },
  viewedAt: { type: Date },
  action: {
    type: {
      routeName: { type: String },
      params: { type: Object }
    }
  }
});

module.exports = mongoose.model("Notification", notificationSchema);
