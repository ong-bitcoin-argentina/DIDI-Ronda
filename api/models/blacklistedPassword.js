const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const blacklistedPasswordSchema = new Schema({
  password: { type: String,unique: true },
});

module.exports = mongoose.model(
  "BlacklistedPassword",
  blacklistedPasswordSchema
);
