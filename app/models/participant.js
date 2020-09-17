const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Schema.Types.ObjectId;

const participantSchema = new Schema({
  user: { type: ObjectId, ref: "User" },
  isConfirmingTransaction: { type: Boolean, default: false },
  hasConfirmedTransaction: { type: Boolean, default: false },
  isBeingSwapped: { type: Boolean, default: false },
  round: { type: ObjectId, ref: "Round" },
  guarantor: { type: ObjectId, ref: "Participant", default: null },
  date: { type: Date, default: Date.now },
  acepted: { type: Boolean, default: null },
  isReceivingOrMakingPayment: { type: Boolean, default: false },
  shiftsQty: { type: Number, default: 1 },
});

module.exports = mongoose.model("Participant", participantSchema);
