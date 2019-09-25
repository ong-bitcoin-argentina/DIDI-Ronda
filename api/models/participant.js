const mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;

const participantSchema = new Schema({
    user:           { type: ObjectId, ref: 'User' },
    round:          { type: ObjectId, ref: 'Round' },
    admin:          { type: Boolean, required: true, default: false },
    guarantor:      { type: ObjectId, ref: 'Participant', default: null },
    date:           { type: Date, default: Date.now, required: true },
    acepted:        { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model('Participant', participantSchema);