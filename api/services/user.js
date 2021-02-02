// MANAGERS
const aidi_service = require("./aidi");
const user_manager = require("../managers/user");
const notifications_manager = require("../managers/notification");
const round_manager = require("../managers/round");
const participant_manager = require("../managers/participant");
const { STORAGE_HOST, STORAGE_PORT } = process.env;
const blockchain = require("./blockchain");
const crypto = require("../utils/crypto");
const User = require("../models/user");
const request = require("request-promise-native");
const fs = require("fs");
const { customError } = require("../helpers/errorHandler");

exports.byUsername = async req => {
  const { username } = req.body;
  const user = await user_manager.byUsername(username);
  return user;
};

exports.byDID = async req => {
  const { did } = req.params;
  const user = await user_manager.byDID(did);
  if (!user) throw new customError("That user does not exist");
  return await user_manager.toDTO(user);
};

exports.updateByUsername = async req => {
  const { username } = req.body;
  const user = await user_manager.byUsername(username);
  if (!user) throw new customError("That user does not exist");
  if (!user.did) throw new customError("That user does not have a did");
  const profileFromAidi = await aidi_service.getProfile(user.did);
  const updatedUser = await user_manager.updateProfile(user, profileFromAidi);
  const userDTO = await user_manager.toFullDTO(updatedUser);
  return {
    ...userDTO,
    jwtToken: profileFromAidi.jwtToken
  };
};

exports.roundsOfUser = async req => {
  const { username } = req.body;

  // Find user id
  const user = await user_manager.byUsername(username);

  // Find Rounds of participant
  const participant = await participant_manager.participantsOfUser(user);

  // Filter participants (acepted !== false)
  const filteredParticipants = participant.filter(p => p.acepted !== false);

  // Get rounds
  const rounds = filteredParticipants.map(p => p.round).filter(e => e !== null);

  return rounds;
};

//SET PROFILE IMAGE
exports.setProfileImage = async data => {
  const { userId, image } = data;
  const user = await User.findById(userId);
  if (user === null) throw new customError("That user does not exists");
  try {
    const hash = await request({
      url: "http://" + STORAGE_HOST + ":" + STORAGE_PORT + "/bzz:/",
      method: "POST",
      headers: {
        "content-type": "image/png"
      },
      encoding: null,
      body: fs.createReadStream(image.path)
    });
    user.pictureHash = hash.toString();
    user.save();
    const walletAddress = crypto.decipher(user.walletAddress);
    const walletPk = crypto.decipher(user.walletPk);
    const savedToDomain = await blockchain.setContentToSubdomain(
      user.nick,
      hash,
      walletAddress,
      walletPk
    );
    return user.picture;
  } catch (err) {
    throw new customError(err);
  }
};

exports.userData = async req => {
  const { username } = req.body;

  // Find user id
  const user = await user_manager.byUsername(username);

  if (user === null) throw new customError("User do not exists");

  // Find Rounds of participant
  const participantsOfUser = await participant_manager.participantsOfUser(user);
  const filteredParticipants = participantsOfUser.filter(
    p => p.acepted === true && p.round !== null
  );

  const rounds = await Promise.all(
    filteredParticipants.map(async p => {
      // Get round id
      const participantRoundId = p.round;

      if (participantRoundId) {
        // Get Round by provided Id
        const participantRound = await round_manager.findById(
          participantRoundId
        );

        if (participantRound !== null && participantRound !== undefined)
          return participantRound;
      }
    })
  );

  // Starting Count for rounds and completed rounds
  const roundsCount = rounds.length;

  // Find completed rounds
  let completedRoundsCount = rounds.filter(round => round.completed).length;

  return { roundsCount, completedRoundsCount };
};

exports.updateToken = async req => {
  const { username, newToken } = req.body;

  // Find user id
  const user = await user_manager.byUsername(username);
  if (user === null) throw new customError("User do not exists");

  // TODO: search newToken and clean if exists to avoid send wrong notifications to multiple accounts logged on same device

  // If token is new, change it
  if (user.token !== newToken) {
    user.token = newToken;
    const newUSer = await user_manager.save(user);
    return newUSer.token;
  } else {
    return user.token;
  }
};
