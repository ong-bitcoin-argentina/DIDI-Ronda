// MANAGERS
const user_manager = require('../managers/user');
const round_manager = require('../managers/round');
const participant_manager = require('../managers/participant');

const { customError } = require('../helpers/errorHandler');


exports.byUsername = async (req, res) => {

    const { username } = req.body;
    const user = await user_manager.byUsername(username);
    return user;

};

exports.roundsOfUser = async (req, res) => {

    const { username } = req.body;

    // Find user id
    const user = await user_manager.byUsername(username);

    // Find Rounds of participant 
    const participant = await participant_manager.participantsOfUser(user)

    // Filter participants (acepted !== false)
    const filteredParticipants = participant.filter(p => p.acepted !== false)

    // Get rounds
    const rounds = filteredParticipants.map(p => p.round).filter(e => e !== null)

    return rounds;

};

exports.userData = async (req, res) => {

    const { requestedUser: username } = req.body;


    // Find user id
    const user = await user_manager.byUsername(username);


    if (user === null) throw new customError("User do not exists");


    // Find Rounds of participant 
    const participantsOfUser = await participant_manager.participantsOfUser(user)
    const filteredParticipants = participantsOfUser.filter(p => p.acepted === true && p.round !== null)


    const rounds = await Promise.all( filteredParticipants.map( async p => {
        // Get round id
        const participantRoundId = p.round;

        if (participantRoundId) {

            // Get Round by provided Id
            const participantRound = await round_manager.findById(participantRoundId);

            if (participantRound !== null && participantRound !== undefined) return participantRound;
        }

    }));

    // Starting Count for rounds and completed rounds
    const roundsCount = rounds.length;

    //check if round's last shift status is 'completed' and add 1 to count
    let completedRoundsCount = rounds.filter( round => round.shifts[ round.shifts.length - 1 ].status === "completed" ).length


    return { roundsCount, completedRoundsCount }



}


exports.updateToken = async (req, res) => {

    const { username, newToken } = req.body;

    // Find user id
    const user = await user_manager.byUsername(username);
    if (user === null) throw new customError("User do not exists");

    // If token is new, change it
    if( user.token !== newToken ){
        user.token = newToken;
        const newUSer = await user_manager.save(user);
        return newUSer.token;
    } else {
        return user.token;
    }

}
