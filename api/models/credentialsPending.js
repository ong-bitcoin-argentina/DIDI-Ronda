const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const credentialsPendingSchema = new Schema({
  round: { type: ObjectId, ref: "Round", required: true },
  participant: {
    type: ObjectId,
    ref: "Participant",
    required: true,
    unique: true
  },
  createdOn: { type: Date, default: new Date() }
});

module.exports = mongoose.model("CredentialsPending", credentialsPendingSchema);
