const round_manager         = require('../managers/round');
const {generic}     = require('../helpers/errorHandler');


exports.participant = async (req, res, next) => {

    const { username } = req.body;
    const { roundId } = req.params;

    // Check if user is round participant
    const round = await round_manager.findById( roundId );

    if( round === null ) return generic( res,  "Round not exist" )
    const exist = round.participants.filter( e => e.user.username === username )
    if( exist.length === 0 ) return generic(res, "Only participants can access")

    return next();
}

exports.admin = async (req, res, next) => {

    const { username } = req.body;
    const { roundId } = req.params;

    // Check if user is round participant
    const round = await round_manager.findById( roundId );

    if( round === null ) return generic( res,  "Round not exist" )
    if( round.admin.username !== username ) return generic(res, "Only admin can access")

    return next();

}