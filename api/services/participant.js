const { customError }   = require ('../helpers/errorHandler');
const moment            = require('moment');

// MANAGERS
const participant_manager   = require('../managers/participant');
const round_manager         = require('../managers/round');


exports.byId = async (req, res) => {

    const { roundId, participantId } = req.params;

    const participant = await participant_manager.findById( participantId );
    if( participant === null ) throw new customError("Participant not exist");

    // Check participant - roundId
    if( participant.round.toString() !== roundId ) throw new customError("Participant and round not match");

    return participant;
}


exports.acceptRound = async (req, res) => {

    const { roundId, participantId } = req.params;

    // Find participant
    const participant = await participant_manager.findById( participantId );
    if( participant === null ) throw new customError("Participant not exist");

    // Check participant - roundId
    if( participant.round.toString() !== roundId ) throw new customError("Participant and round not match");

    // Set accepted = true
    participant.acepted = true;

    // Update participant
    const updatedParticipant = await participant_manager.save( participant );

    // Return updated
    return updatedParticipant;
}

exports.rejectRound = async (req, res) => {

    const { roundId, participantId } = req.params;

    // Find participant
    const participant = await participant_manager.findById( participantId );
    if( participant === null ) throw new customError("Participant not exist");

    // Check participant - roundId
    if( participant.round.toString() !== roundId ) throw new customError("Participant and round not match");

    // Set accepted = true
    participant.acepted = false;

    // Update participant
    const updatedParticipant = await participant_manager.save( participant );

    // Return updated
    return updatedParticipant;
}

exports.requestNumbers = async (req, res) => {

    const { roundId, participantId } = req.params;
    const { numbers } = req.body;

    // Find participant
    const participant = await participant_manager.findById( participantId );
    if( participant === null ) throw new customError("Participant not exist");

    // Check participant - roundId
    if( participant.round.toString() !== roundId ) throw new customError("Participant and round not match");

    // Find round
    const round = await round_manager.findById( roundId )
    if( round === null ) throw new customError("Round not exist");

    // Check numbers exist in round
    const requestedShift = round.shifts.filter( shift => numbers.includes( shift.number )  )
    if( requestedShift.length !== numbers.length ) throw new customError("Numbers not exist");

    // Check numbers status
    const availableShifts = requestedShift.filter( shift => (shift.status !== "completed" && shift.status !== "current" ) )
    if( availableShifts.length !== numbers.length ) throw new customError("Numbers are completed or current");

    // Push requested numbers to shift (FOR LATER)
    // numbers.forEach( number => {
    //     // Only push if not exist
    //     const exist = round.shifts.find( shift => shift.number === number ).requests.includes( participantId );
    //     if( !exist )
    //         round.shifts.find( shift => shift.number === number ).requests.push( participant );
    // });

    // FOR TESTING PURPOSE
    // Push participant
    numbers.forEach( number => {
        // Only push if not exist
        const exist = round.shifts.find( shift => shift.number === number ).participant.includes( participantId );
        if( !exist )
            round.shifts.find( shift => shift.number === number ).participant.push( participant );
    });
    // ./FOR TESTING PURPOSE


    // Update round
    const updatedRound = await round_manager.save( round );

    // Return updated round
    return updatedRound;
}

exports.participantChargeNumber = async (req, res) => {

    const { roundId, number } = req.params;
    const { participantId } = req.body;

    // Find round
    const round = await round_manager.findById( roundId )
    if( round === null ) throw new customError("Round not exist");

    // Check number exist in round shift
    if( number > round.shifts.length ) throw new customError("Number not exist in this round");

    // Check shift status is current
    const shift = round.shifts.find( e => e.number === parseInt(number) )
    if( !shift || shift.status !== 'current' ) throw new customError("Shift must be 'current' for mark as completed");

    // Check shift date >= now
    if( moment( shift.limitDate ).isSameOrAfter( moment() ) ) throw new customError("Shift limitDate error");

    // Mark shift as completed
    round.shifts.find( e => e.number === parseInt(number) ).status = 'completed';

    // Set next shift status depend on nextDraw value
    const nextStatus = 'current';
    const nextShift = round.shifts.find( e => e.number === parseInt(number)+1 );
    if( nextShift ) round.shifts.find( e => e.number === parseInt(number)+1 ).status = nextStatus;

    // TODO: participant notifications

    // Save changes to round
    const updatedRound = await round_manager.save( round );
    if( updatedRound === null ) throw new customError("Error saving payment");

    return updatedRound;

}