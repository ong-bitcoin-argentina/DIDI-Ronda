const { customError } = require("../helpers/errorHandler");

// MANAGERS
const participant_manager = require("../managers/participant");
const round_manager = require("../managers/round");

// NOTIFICATIONS
const {
  requestedShiftNotification,
  participantRequestPaymentNoti,
  numberPayedToUser
} = require("../helpers/notifications/notifications");

exports.byId = async req => {
  const { roundId, participantId } = req.params;
  const participant = await participant_manager.findById(participantId);
  if (participant === null) throw new customError("Participant not exist");

  // Check participant - roundId
  if (participant.round.toString() !== roundId)
    throw new customError("Participant and round not match");

  return participant;
};

exports.acceptRound = async req => {
  const { roundId, participantId } = req.params;
  const { username } = req.body;

  // Find participant
  const participant = await participant_manager.findById(participantId);
  if (participant === null) throw new customError("Participant not exist");

  const round = await round_manager.findById(roundId);
  if (round === null) throw new customError("That round does not exists");

  // Check participant - roundId
  if (participant.round.toString() !== roundId)
    throw new customError("Participant and round not match");

  participant.isConfirmingTransaction = true;
  await participant.save();

  // Return updated
  return { round, participant, accepted: true, username };
};

exports.rejectRound = async req => {
  const { roundId } = req.params;
  const { username } = req.body;
  const { participantId } = req.middlewareData;

  if (typeof username !== "string" || username === "" || !username)
    throw new customError("Username is invalid");

  // Find participant
  const participant = await participant_manager.findById(participantId);
  if (participant === null) throw new customError("Participant not exist");

  // Find round
  const round = await round_manager.findById(roundId);
  if (round === null) throw new customError("That round does not exists");

  if (round.start) throw new customError("Round has already started");

  // Check participant - roundId
  if (participant.round.toString() !== roundId)
    throw new customError("Participant and round not match");

  return { round, participant, accepted: false, username };
};

exports.requestPayment = async (req, isRequestingPayment = true) => {
  const { roundId } = req.params;
  const { username } = req.body;
  const { participantId } = req.middlewareData;

  if (typeof username !== "string" || username === "" || !username)
    throw new customError("Username is invalid");

  // Find participant
  const participant = await participant_manager.findById(participantId);
  if (participant === null) throw new customError("Participant not exist");

  // Find round
  const round = await round_manager.findById(roundId);
  if (round === null) throw new customError("That round does not exists");
  await participantRequestPaymentNoti(round, participant, isRequestingPayment);

  return true;
};

exports.requestNumbers = async req => {
  const { roundId } = req.params;
  const { numbers } = req.body;
  const { participantId } = req.middlewareData;

  // Find participant
  const participant = await participant_manager.findById(participantId);
  if (participant === null) throw new customError("Participant not exist");

  // Check participant - roundId
  if (participant.round.toString() !== roundId)
    throw new customError("Participant and round not match");

  // Find round
  const round = await round_manager.findById(roundId);
  if (round === null) throw new customError("Round not exist");

  // Check numbers exist in round
  const requestedShift = round.shifts.filter(shift =>
    numbers.includes(shift.number)
  );
  if (requestedShift.length !== numbers.length)
    throw new customError("Numbers not exist");

  // Remove participant from every shift
  for (let i = 0; i < round.shifts.length; i++) {
    // Get shifts where participant is assigned
    if (round.shifts[i].participant.includes(participantId)) {
      // Get participant record index into shift participants
      const participantIndex = round.shifts[i].participant.indexOf(
        participantId
      );
      // Remove participant from shift
      round.shifts[i].participant.splice(participantIndex, 1);
    }
  }

  // Push requested numbers to shift (FOR LATER)

  // FOR TESTING PURPOSE
  // Push participant
  numbers.forEach(number => {
    // Only push if not exist
    const exist = round.shifts
      .find(shift => shift.number === number)
      .participant.includes(participantId);
    if (!exist)
      round.shifts
        .find(shift => shift.number === number)
        .participant.push(participant);
  });
  // ./FOR TESTING PURPOSE

  // Update round
  const updatedRound = await round_manager.save(round);

  // Admin notification
  requestedShiftNotification(updatedRound, participant.user.name, numbers);

  // Return updated round
  return updatedRound;
};

// Pay to participant
exports.participantChargeNumber = async (req, participantId = null) => {
  const { roundId, number } = req.params;
  // Only the admin passes participantId, everyone else uses the one from the middleware
  const finalParticipantId = participantId || req.middlewareData.participantId;
  // Find round
  const round = await round_manager.findById(roundId);
  if (round === null) throw new customError("Round not exist");

  // Check number exist in round shift
  if (number > round.shifts.length)
    throw new customError("Number not exist in this round");

  // Check shift status is current
  const shift = round.shifts.find(e => e.number === parseInt(number));
  if (!shift || shift.status !== "current")
    throw new customError("Shift must be 'current' for mark as completed");

  if (!shift.participant.includes(finalParticipantId))
    // Check shift includes participantId
    throw new customError("Participant is not on the shift");

  // Check if shift is payed
  if (shift.isPayedToParticipant) throw new customError("Shift already payed");

  // Change payed status
  const shiftIndex = round.shifts.findIndex(e => e.number === parseInt(number));
  round.shifts[shiftIndex].isPayedToParticipant = true;
  await round.save();
  await numberPayedToUser(round, number, finalParticipantId);

  // Save changes to round
  const updatedRound = await round_manager.save(round);
  if (updatedRound === null) throw new customError("Error saving payment");

  return updatedRound;
};

exports.findAndUpdateJWTs = async (id, jwt) => {
  return await participant_manager.findByIdAndUpdateJWTs(id, jwt);
};

exports.adminParticipantChargeNumber = async req =>
  this.participantChargeNumber(req, req.body.participantId);
