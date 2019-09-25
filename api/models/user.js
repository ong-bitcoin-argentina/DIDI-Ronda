const mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
    name:       { type: String },
    email:      { type: String },
});

module.exports = mongoose.model('User', userSchema);