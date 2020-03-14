const {generic}     = require('../helpers/errorHandler');

// SERVICES
const participant_services = require('../services/participant');
const round_services = require('../services/round');


// Get user by username
exports.byId = async (req, res) => {

    try {
        const participant = await participant_services.byId( req, res );
        return participant && participant.error ?
            res.status(200).jsonp( {'error': participant.error} ) :
            res.status(200).jsonp( participant );
    } catch( err ) {
        return err.name === 'customError' ?
            generic( res, err.message ) :
            generic( res, "" );
    }

};

// Accept round invitation
exports.acceptRound = async (req, res) => {

    try {
        const participant = await participant_services.acceptRound( req, res );
        return participant && participant.error ?
            res.status(200).jsonp( {'error': participant.error} ) :
            res.status(200).jsonp( participant );
    } catch( err ) {
        return err.name === 'customError' ?
            generic( res, err.message ) :
            generic( res, "" );
    }

};

// Reject round invitation
exports.rejectRound = async (req, res) => {

    try {
        const participant = await participant_services.rejectRound( req, res );
        return participant && participant.error ?
            res.status(200).jsonp( {'error': participant.error} ) :
            res.status(200).jsonp( participant );
    } catch( err ) {
        return err.name === 'customError' ?
            generic( res, err.message ) :
            generic( res, "" );
    }

};

// Request round numbers
exports.requestNumbers = async (req, res) => {

    try {
        const round = await participant_services.requestNumbers( req, res );
        return round && round.error ?
            res.status(200).jsonp( {'error': round.error} ) :
            res.status(200).jsonp( round );
    } catch( err ) {
        return err.name === 'customError' ?
            generic( res, err.message ) :
            generic( res, "" );
    }

};


/*
    Participant pay round number
    POST
    /participant/round/:roundId/number/:number/pay
*/
exports.payNumber = async (req, res) => {

    try {
        const participantPayNumber = await round_services.participantPayNumber( req, res);
        return participantPayNumber && participantPayNumber.error ?
            res.status(200).jsonp( {'error': participantPayNumber.error} ) :
            res.status(200).jsonp( participantPayNumber );
    } catch( err ) {
        return err.name === 'customError' ?
            generic( res, err.message ) :
            generic( res, "" );
    }

}

/*
    Participant charge round number
    POST
    /participant/round/:roundId/number/:number/charge
*/
exports.chargeNumber = async (req, res) => {

    try {
        const participantChargeNumber = await participant_services.participantChargeNumber( req, res);
        return participantChargeNumber && participantChargeNumber.error ?
            res.status(200).jsonp( {'error': participantChargeNumber.error} ) :
            res.status(200).jsonp( participantChargeNumber );
    } catch( err ) {
        return err.name === 'customError' ?
            generic( res, err.message ) :
            generic( res, "" );
    }

}
