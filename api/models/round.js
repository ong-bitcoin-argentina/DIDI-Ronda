const config = require("../helpers/config");
const moment = require("moment");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const recurrenceKeys = Object.keys(config.recurrenceConfig);

const roundSchema = new Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    recurrence: { type: String, required: true, enum: recurrenceKeys },
    startDate: { type: Date, required: true },
    limitDate: { type: Date, required: true },
    firstPaymentDate: { type: Date, required: true },
    admin: { type: ObjectId, ref: "User" },
    start: { type: Boolean, default: false },
    participants: [{ type: ObjectId, ref: "Participant" }],
    isConfirmed: { type: Boolean, default: false },
    isBeingStarted: { type: Boolean, default: false },
    shifts: {
      type: [
        {
          number: { type: Number, required: true },
          participant: [{ type: ObjectId, ref: "Participant" }],
          pays: [
            {
              participant: {
                type: ObjectId,
                ref: "Participant",
                required: true,
              },
              date: { type: Date, default: Date.now, required: true },
              guarantor: { type: Number, default: null },
              approved: { type: Boolean, default: false },
            },
          ],
          limitDate: { type: Date, required: true },
          isPayedToParticipant: { type: Boolean, default: false },
          isBeingPayed: { type: Boolean, default: false },
          status: {
            type: String,
            required: true,
            enum: config.shiftStatus,
            default: "pending",
          },
          requests: [{ type: ObjectId, ref: "Participant" }],
        },
      ],
      validate: [validateShifts, "Must be greater than 1"],
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

function validateShifts(val) {
  return val.length > 1;
}

roundSchema.virtual("endDate").get(function() {
  const recurrenceConfig = config.recurrenceConfig;

  const { firstPaymentDate, recurrence, shifts } = this;

  const key = Object.keys(recurrenceConfig[recurrence]);
  const value = Object.values(recurrenceConfig[recurrence]);
  const valueResult = value * shifts.length - 1;

  return moment(firstPaymentDate)
    .add({ [key]: valueResult })
    .format("YYYY-MM-DD");
});

roundSchema.virtual("totalAmount").get(function() {
  const { amount, shifts } = this;
  return amount * shifts.length;
});

roundSchema.virtual("completed").get(function() {
  const { shifts } = this;
  return !shifts.some(s => s.status !== "completed");
});

module.exports = mongoose.model("Round", roundSchema);
