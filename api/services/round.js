const _                 = require('lodash');
const moment            = require('moment');
const config            = require('../helpers/config');
const { customError }   = require ('../helpers/errorHandler');

// MANAGERS
const round_manager         = require('../managers/round');
const user_manager          = require('../managers/user');
const participant_manager   = require('../managers/participant');

// NOTIFICATIONS
const { 
    inviteRound, 
    completedRound, 
    startedRound, 
    asignedShift, 
}   = require('../helpers/notifications/notifications');
const { roundInvite }       = require('../helpers/notifications/messages');
const SMS = require("../helpers/phones");


// PHONE FORMAT
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const PNF = require('google-libphonenumber').PhoneNumberFormat;


exports.byId = async (req, res) => {
    const { roundId } = req.params;
    const round = await round_manager.findById( roundId );
    if( round === null ) throw new customError("Round not exist");
    return round;
}

exports.create = async (req, res) => {

    const { name, amount, recurrence, startDate, limitDate, firstPaymentDate, username, shifts, participants } = req.body;

    // Check at least 1 participant
    if( participants.length === 0 ) throw new customError( `There must be at least 1 participant` );

    // Find admin by username
    const admin = await user_manager.byUsername( username );
    if( admin === null ) throw new customError( `User ${username} not found` );
    if( admin.error ) throw new customError( admin.error );

    // Get recurrenceValue 
    const recurrenceConfig  = config.recurrenceConfig;
    const recurrenceKey     = Object.keys( recurrenceConfig[ recurrence ] );
    const recurrenceValue   = Object.values( recurrenceConfig[ recurrence ] );

    let participantsNumber = [];


    // Create round (model without save)
    const round_model = await round_manager.createModel(
        name, 
        amount, 
        recurrence, 
        startDate,
        limitDate, 
        firstPaymentDate,
        admin
    );
    
    const adminParticipant =  await participant_manager.createModel(
        admin._id,
        round_model._id,
        true
    )

    // Create participants model array (check users)
    const participants_records = await Promise.all(
        participants.map( async e => {

            if(e.phone === admin.phone) {

                // Push admin as participant
                e.number && e.number.map( number => participantsNumber.push({ number: number, participant: adminParticipant._id }) )

                return adminParticipant
            }

            // Fetch user
            let user = await user_manager.byPhone( e.phone );

            if( user === null ){
                // Create user with "verified = false"
                user = await user_manager.saveUnverified( e.phone, e.name )
            }
            if( user.error ) throw new customError( user.error );

            const participant = await participant_manager.createModel(
                user._id,
                round_model._id
            )

            // Map participant numbers (array)
            e.number && e.number.map( number => participantsNumber.push({ number: number, participant: participant._id }) )

            return participant;

        })
    )

    // Assign number 1 to admin if not assigned yet
    if( participantsNumber.filter( e => e.number === 1 ).length === 0 ) 
        participantsNumber.push({ number: 1, participant: adminParticipant._id });
        
    // Save participants
    const participants_list = await participant_manager.saveMany( participants_records );
    if( participants_list === null ) throw new customError( `Error creating participants` );
    if( participants_list.error ) throw new customError( participants_list.error );

    // Assign to round
    round_model.participants = participants_list;

    // Create shifts
    const shifts_populated = Array.apply( null, Array(shifts) ).map( (n, idx) => {

        const number = idx+1;

        const findParticipant = participantsNumber.filter( e => e.number === number ).map( e => e.participant )

        const shiftLimitDate = moment( firstPaymentDate ).add({ [recurrenceKey]: recurrenceValue*(number-1) }).format('YYYY-MM-DD');

        return { number: number, participant: findParticipant, pays : [], limitDate: shiftLimitDate}
    })

    round_model.shifts = shifts_populated;


    // SAVE ROUND
    const round = await round_manager.save( round_model )
    if( round === null ) throw new customError( `Error creating round` );
    if( round.error ) throw new customError( round.error );

    // PUSH NOTIFICATION
        const foundRound = await round_manager.findById( round._id )

    inviteRound( foundRound );
    try {
        const foundRound = await round_manager.findById( round._id )
        const tokens = foundRound.participants
          .map(p => p.user.token)
          .filter(t => t);
        const data = {
            action: JSON.stringify( 
                {
                    routeName: "RoundDetail", 
                    params: {"_id": round._id }
                }
            )
        }
        const message = {
            notification: {
                title: "La ronda",
                body: roundInvite( round.name , admin.name ),
            },
            data: data ,
            tokens: tokens,
        };
        const phones = foundRound.participants.map(p => p.acepted === null ? p.user.phone : null).filter(e => e !== null);
        SMS.sendRoundInvitation(phones, round.name, admin.name);
        tokens.length > 0 && inviteRound( round );
    } catch( e ){
        console.error(e)
    }

    return round;

};


exports.reSendInvite = async (req, res) => {
     // SEND NOTIFICATION TO PARTICIPANTS
     const { roundId }  = req.params;

    const findedRound = await round_manager.findById( roundId )
    if ( findedRound === null ) throw new customError( `That round does not exists` );

    const notifications = await inviteRound( findedRound );

    return notifications;

}

exports.delete = async (req, res) => {

    const { id }        = req.params;
    const { username }  = req.body;

    // Find round
    const round = await round_manager.findById( id )
    if( round === null ) throw new customError("Round not exist");

    // Check admin === username
    if( round.admin.username !== username ) throw new customError("Only admin can delete a round");

    // Check round not started
    if( round.start ) throw new customError("Only can delete not started rounds");

    // Delete round
    const deleteRound = await round_manager.delete( round._id )
    if( deleteRound.deletedCount !== 1 ) throw new customError("No rounds deleted");

    if( deleteRound.n === 1 && deleteRound.ok === 1 && deleteRound.deletedCount === 1 ){
        return {success: `${id} deleted!`}
    } else {
        throw new customError("No rounds deleted");
    }


};

exports.participantSwap = async (req, res) => {

    const { roundId, participantId } = req.params;
    const { newParticipant, username }  = req.body;

    // Find round
    const round = await round_manager.findById( roundId )
    if( round === null ) throw new customError("Round not exist");

    // Check username is round admin
    if( round.admin.username !== username ) throw new customError("Only admin can swap participants");

    // Check new user not exist in the round
    const newUserInRound = round.participants.filter( e => e.user.phone === newParticipant.phone )
    if( newUserInRound.length !== 0 ) throw new customError("User exist in round");

    // Find participant
    const participant = await participant_manager.findById( participantId )
    if( participant === null ) throw new customError("Participant not exist");

    // Check participant-round
    const participantRound  = participant.round.toString();
    if( participantRound !== roundId ) throw new customError("The participant not exist in this round");

    // Check if participant is round admin
    if( participant.user.username === round.admin.username ) throw new customError("Cant swap round admin");

    // Check newParticipant distinct participant userid
    if( newParticipant.phone ===  participant.user.phone ) throw new customError("Participant and new user are the same");

    // Fetch/create new user (newParticipant)
    let newUser = await user_manager.byPhone( newParticipant.phone );

    if( newUser === null ){
        // Check name is not null
        if( !newParticipant.name ) throw new customError("New users must have a name");
        // Create user with "verified = false"
        newUser = await user_manager.saveUnverified( newParticipant.phone, newParticipant.name )
    }

    // Change user in participant
    const updateParticipant = await participant_manager.updateParticipantUser( participant, newUser );

    return await round_manager.findById( roundId );

};

exports.participantRemove = async (req, res) => {

    const { roundId, participantId } = req.params;
    const { username }  = req.body;

    // Find round
    const round = await round_manager.findById( roundId )
    if( round === null ) throw new customError("Round not exist");

    // Check username is round admin
    if( round.admin.username !== username ) throw new customError("Only admin can remove participants");

    // Check round start = false
    if( round.start ) throw new customError("Cant remove participants from started round");

    // Find participant
    const participant = await participant_manager.findById( participantId )
    if( participant === null ) throw new customError("Participant not exist");

    // Check participant-round
    const participantRound  = participant.round.toString();
    if( participantRound !== roundId ) throw new customError("The participant not exist in this round");

    // Check if participant is round admin
    if( participant.user.username === round.admin.username ) throw new customError("Cant remove round admin");

    // Remove participant from round and delete it
    round.participants.pull({ _id: participant._id })
    participant.remove();

    const updatedRound = await round_manager.save( round );

    return updatedRound;

};

exports.participantPayNumber = async (req, res) => {

    const { roundId, number } = req.params;
    const { participantId } = req.body;

    // Find round
    const round = await round_manager.findById( roundId )
    if( round === null ) throw new customError("Round not exist");

    // Find participant
    const participant = await participant_manager.findById( participantId )
    if( participant === null ) throw new customError("Participant not exist");

    // Check number exist in round shift
    if( number > round.shifts.length ) throw new customError("Number not exist in this round");

    // Check shift status is current
    const shift = round.shifts.find( e => e.number.toString() === number )
    if( !shift || shift.status !== 'current' ) throw new customError("Shift must be current");

    // Check limitDate
    if( moment().diff(shift.limitDate, 'days') > 0 ) throw new customError("Shift limitDate has passed");

    // Check if participant has already pay
    const userPayShift = shift.pays.find( e => e.participant.toString() === participantId )
    if( userPayShift ) throw new customError("The participant has already pay for this shift");

    // Create pay object (Approved if user is admin)
    const payObject = {
        participant: participant,
        approved: participant.user._id.toString() === round.admin._id.toString()
    }

    // Push payment on round
    round.shifts.find( e => e.number.toString() === number ).pays.push( payObject )

    // Save changes to round
    const updatedRound = await round_manager.save( round );
    if( updatedRound === null ) throw new customError("Error saving payment");

    return updatedRound;

}

exports.start = async (req, res) => {

    const { roundId } = req.params;

    // Find round
    const round = await round_manager.findById( roundId )
    if( round === null ) throw new customError("Round not exist");

    // Check all participant acepted=true
    const aceptedParticipants = round.participants.filter( e => e.acepted === true )
    if( aceptedParticipants.length !== round.participants.length ) throw new customError("All participants must accept the invitation");

    // Set start=true
    round.start = true;
    // First shift as current
    round.shifts[0].status = "current";

    // Save changes to round
    const updatedRound = await round_manager.save( round );
    if( updatedRound === null ) throw new customError("Error starting round");

    // Send notifications to participants
    startedRound( round );

    return updatedRound;

}

exports.assignShiftNumber = async (req, res) => {

    const { roundId, number } = req.params;
    const { participantId } = req.body;

    // Find round
    const round = await round_manager.findById( roundId )
    if( round === null ) throw new customError("Round not exist");

    // Find participant
    const participant = await participant_manager.findById( participantId )
    if( participant === null ) throw new customError("Participant not exist");

    // Check number exist in round shift
    if( number > round.shifts.length ) throw new customError("Number not exist in this round");

    // Check shift status is pending
    const shift = round.shifts.find( e => e.number.toString() === number )
    if( !shift || shift.status === 'current' || shift.status === 'completed' ) throw new customError("Shift cant be current or completed");

    // Check participant not exist in shift
    const participantExist = shift.participant.find( e => e.toString() === participantId )
    if( participantExist ) throw new customError("Participant exist in this shift!");

    // Check limitDate
    if( moment().diff(shift.limitDate, 'days') > 0 ) throw new customError("Shift limitDate has passed");

    // Push participant on shift
    round.shifts.find( e => e.number.toString() === number ).participant.push( participant )

    // Update shift status
    round.shifts.find( e => e.number.toString() === number ).status = "current";

    // Save changes to round
    const updatedRound = await round_manager.save( round );
    if( updatedRound === null ) throw new customError("Error saving round");

    // Send notifications
    asignedShift( updatedRound, participant.name );

    return updatedRound;
}

exports.completeShift = async (req, res) => {

    const { roundId, number } = req.params;
    const { nextDraw } = req.body;

    // Find round
    const round = await round_manager.findById( roundId )
    if( round === null ) throw new customError("Round not exist");

    // Check number exist in round shift
    if( number > round.shifts.length ) throw new customError("Number not exist in this round");

    // Check shift status is current
    const shift = round.shifts.find( e => e.number === parseInt(number) )
    if( !shift || shift.status !== 'current' ) throw new customError("Shift must be 'current' for mark as ompleted");

    // Mark shift as completed
    round.shifts.find( e => e.number === parseInt(number) ).status = 'completed';

    // Set next shift status depend on nextDraw value
    const nextStatus = nextDraw ? 'draw' : 'current';
    const nextShift = round.shifts.find( e => e.number === parseInt(number)+1 );
    if( nextShift ){
        round.shifts.find( e => e.number === parseInt(number)+1 ).status = nextStatus;
    } else {
        // Round completed
        completedRound( round );
    }

    // Save changes to round
    const updatedRound = await round_manager.save( round );
    if( updatedRound === null ) throw new customError("Error saving payment");

    return updatedRound;

}