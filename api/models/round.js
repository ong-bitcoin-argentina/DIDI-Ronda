const moment = require('moment');
const mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;

const roundSchema = new Schema({
    name:           { type: String, required: true },
    amount:         { type: Number, required: true },
    recurrence:     { type: String, required: true, enum: ['s', 'q', 'm'] },
    startDate:      { type: Date, required: true },
    limitDate:      { type: Date, required: true },
    participants: [
        { type: ObjectId, ref: 'Participant' }
    ],
    shifts: [{
        number:         { type: Number, required: true },
        participant:    { type: ObjectId, ref: 'Participant' },
        pays: [{
            participant:    { type: ObjectId, ref: 'Participant', required: true },
            date:           { type: Date, default: Date.now, required: true },
            guarantor:      { type: Number, default: null },
        }]
    }]
});

roundSchema.virtual('endDate').get( () => {
    const recurrenceValue = {
        's': {days:7},
        'q': {days:15},
        'm': {months:1},
    }

    return moment( startDate ).add( recurrenceValue[ this.recurrence ] )
});

module.exports = mongoose.model('Round', roundSchema);