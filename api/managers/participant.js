const 	mongoose 	= require('mongoose'),
        Participant = require('../models/participant'),
		ObjectId	= mongoose.Types.ObjectId;


exports.createModel = async ( user, round, acepted, guarantor, date ) => {

    return new Participant ({
        user: user,
        round: round,
        acepted: acepted,
        guarantor: guarantor,
        date: date
    })

}

exports.save = async participant => {

    return await participant
    .save()
    .then( newParticipant => newParticipant )
    .catch( err => ({ error: err }) )


}

exports.saveMany = async participants => {

    return await Participant
    .insertMany( participants )
    .then( participants => participants )
    .catch( err => ({ error: err }) )


}

exports.participantsOfUser = async ( user ) => {

    const participants = await Participant
        .find({user: user})
        .populate({
            path: 'round',
            model: 'Round',
            populate: {
                path: 'participants',
                model: 'Participant',
                 populate: {
                    path: 'user',
                    model: 'User'
                 }
            },
        })


    return participants;

}

exports.findById = async id => {

    return await Participant
    .findById( id )
    .populate({
        path: 'admin',
        model: 'User',
    })
    .populate({
        path: 'user',
        model: 'User',
    })
    .then( participant => participant )
    .catch( err => ({ error: err }) )

}

exports.updateParticipantUser = async ( participant, newUser ) => {

    return await participant.updateOne({
        acepted: null,
        user: newUser
    })
    .then( updatedParticipant => updatedParticipant )
    .catch( err => ({ error: err }) )

}