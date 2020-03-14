const moment    = require('moment');
// NOTIFICATIONS
const { createNotification }            = require('./config');
const { 
    roundInvite, 
    roundCompleted,
    roundStarted, 
    shiftAsigned, 
}   = require('./messages');


exports.inviteRound = async round => {

    // Filter accepted === null
    const participants = round.participants.filter( p => p.acepted === null );
    // Only participants with token
    const tokens = participants.map( p => p.user.token ).filter( t => t );

    // Create data for redirect
    const data = {
        action: JSON.stringify( 
            { routeName: "RoundDetail",  params: {"_id": round._id } }
        )
    }
    
    const notifications = await createNotification( 
        tokens,
        "La ronda", 
        roundInvite( round.name , round.admin.name ),
        data,
    )

    return notifications;

}

exports.completedRound = async round => {

    // Get tokens
    const tokens = round.participants.map( p => p.user.token ).filter( t => t );

    const endDate = moment().format('DD/MM/YYYY');

    // Send notifications
    const notifications = await createNotification( 
        tokens,
        "La ronda", 
        roundCompleted( round.name , endDate ),
    )

    return notifications;

};

exports.startedRound = async round => {

    // Remove admin
    const participants = round.participants.filter( p => p.user !== round.admin )

    // Get tokens
    const tokens = participants.map( p => p.user.token ).filter( t => t );

    // Send notifications
    const notifications = await createNotification( 
        tokens,
        "La ronda", 
        roundStarted( round.name ),
    )

    return notifications;

};

exports.asignedShift = async (round, participantName) => {

    // Remove admin
    const participants = round.participants.filter( p => p.user !== round.admin )

    // Get tokens
    const tokens = participants.map( p => p.user.token ).filter( t => t );

    // Send notifications
    const notifications = await createNotification( 
        tokens,
        "La ronda", 
        shiftAsigned( participantName ),
    )

    return notifications;

};