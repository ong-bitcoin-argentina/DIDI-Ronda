const mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;

const participantSchema = new Schema({
    user:           { type: ObjectId, ref: 'User' },
    round:          { type: ObjectId, ref: 'Round' },
    guarantor:      { type: ObjectId, ref: 'Participant', default: null },
    date:           { type: Date, default: Date.now },
    acepted:        { type: Boolean, default: null },
});

module.exports = mongoose.model('Participant', participantSchema);