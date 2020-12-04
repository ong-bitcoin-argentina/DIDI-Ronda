const moment = require("moment");
const config = require("../helpers/config");
const { customError } = require("../helpers/errorHandler");

// MANAGERS
const round_manager = require("../managers/round");
const user_manager = require("../managers/user");
const participant_manager = require("../managers/participant");
const walletUtil = require("../utils/wallet");
const crypto = require("../utils/crypto");

const credentials_service = require("../services/credential");

// NOTIFICATIONS
const {
  inviteRound,
  asignedShift
} = require("../helpers/notifications/notifications");

// PHONE FORMAT
const { normalizePhone } = require("../helpers/phones");

// Jobs
const { updateStartRoundJob } = require("../jobs/jobs");
const {
  getSimulatedFirstPaymentDate,
  getSimulatedPayment,
  getShiftLimitDate,
  getSimulatedStartDate,
  getSimulatedLimitDate
} = require("../utils/round");

exports.byId = async req => {
  const { roundId } = req.params;
  const round = await round_manager.findById(roundId);
  if (round === null) throw new customError("Round not exist");
  return round;
};

exports.create = async req => {
  const {
    name,
    amount,
    recurrence,
    startDate,
    limitDate,
    firstPaymentDate,
    username,
    shifts,
    participants
  } = req.body;
  console.log("creating round", name, username);
  // Check at least 1 participant
  if (participants.length === 0)
    throw new customError(`There must be at least 1 participant`);

  // Find admin by username
  const admin = await user_manager.byUsername(username);
  if (admin === null) throw new customError(`User ${username} not found`);
  if (admin.error) throw new customError(admin.error);

  // Get recurrenceValue
  const recurrenceConfig = config.recurrenceConfig;
  const recurrenceKey = Object.keys(recurrenceConfig[recurrence]);
  const recurrenceValue = Object.values(recurrenceConfig[recurrence]);

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

  // Control shiftsQty vs shifts (participants can take 1/2 shift)
  const allShiftsQty = participants
    .map(p => p.shiftsQty)
    .reduce((s, total) => s + total);
  if (allShiftsQty > shifts * 2) throw new customError("Shifts quantity error");

  // Get shifts quantity for admin
  const adminShiftsQty = participants.find(e => e.phone === admin.phone)
    .shiftsQty;

  const adminParticipant = await participant_manager.createModel(
    admin._id,
    adminShiftsQty,
    round_model._id,
    true
  );

  // We need this for the SC invocation
  const usersOfRound = [];

  usersOfRound.push(admin._id);

  const checkUniqueNumbers = [];

  // Create participants model array (check users)
  const participants_records = await Promise.all(
    participants.map(async participant => {
      // Check if number exist in round
      const normalizedPhone = normalizePhone(participant.phone);
      if (!checkUniqueNumbers.includes(normalizedPhone)) {
        checkUniqueNumbers.push(normalizedPhone);

        if (participant.phone === admin.phone) {
          // Push admin as participant
          participant.number &&
            participant.number.map(number =>
              participantsNumber.push({
                number,
                participant: adminParticipant._id
              })
            );

          // Add shifts requested
          adminParticipant["shiftsQty"] = participant.shiftsQty;

          return adminParticipant;
        }

        // Normalize phone numbers
        participant.phone = normalizedPhone;

        // Fetch user
        let user = await user_manager.byPhone(participant.phone);

        if (user === null) {
          // Create user with "verified = false"
          let encryptedAddress = null;
          let encryptedPK = null;

          const { address, privateKey } = await walletUtil.createWallet();
          if (!address || !privateKey)
            throw new customError("Error creating wallet");

          encryptedAddress = crypto.cipher(address);
          encryptedPK = crypto.cipher(privateKey);

          user = await user_manager.saveUnverified(
            participant.phone,
            participant.name,
            encryptedAddress,
            encryptedPK
          );
        }
        if (user.error) throw new customError(user.error);
        usersOfRound.push(user._id);

        const newParticipant = await participant_manager.createModel(
          user._id,
          participant.shiftsQty,
          round_model._id
        );

        // Map participant numbers (array)
        participant.number &&
          participant.number.map(number =>
            participantsNumber.push({
              number,
              participant: newParticipant._id
            })
          );

        return newParticipant;
      }
    })
  );

  // Assign number 1 to admin if not assigned yet
  if (participantsNumber.filter(e => e.number === 1).length === 0)
    participantsNumber.push({
      number: 1,
      participant: adminParticipant._id
    });

  // Save participants
  const participants_list = await participant_manager.saveMany(
    participants_records
  );
  if (participants_list === null)
    throw new customError(`Error creating participants`);
  if (participants_list.error) throw new customError(participants_list.error);

  // Assign to round
  round_model.participants = participants_list;
  participants_list.forEach(p => {
    if (!p.user)
      throw new customError({
        error: `Un participante es invalido ${JSON.stringify(p)}`
      });
  });
  // Create shifts
  const shifts_populated = Array.apply(null, Array(shifts)).map((n, idx) => {
    const number = idx + 1;

    const findParticipant = participantsNumber
      .filter(e => e.number === number)
      .map(e => e.participant);

    const shiftLimitDate = moment(firstPaymentDate)
      .add({
        [recurrenceKey]: recurrenceValue * (number - 1)
      })
      .format("YYYY-MM-DD");

    return {
      number: number,
      participant: findParticipant,
      pays: [],
      limitDate: shiftLimitDate
    };
  });

  round_model.shifts = shifts_populated;

  // SAVE ROUND
  const round = await round_manager.save(round_model);
  if (round === null) throw new customError(`Error creating round`);
  if (round.error) throw new customError(round.error);

  return { round, usersOfRound };
};

exports.update = async req => {
  const { name, amount, recurrence, startDate, id } = req.body;

  const round = await round_manager.findById(id);

  round.name = name;
  round.amount = amount;
  round.startDate = startDate;

  // Get recurrenceValue
  const recurrenceConfig = config.recurrenceConfig;
  const recurrenceKey = Object.keys(recurrenceConfig[recurrence]);
  const recurrenceValue = Object.values(recurrenceConfig[recurrence]);

  const firstPaymentDate = moment(startDate).add({
    [recurrenceKey]: recurrenceValue * 1
  });

  round.shifts.forEach((s, i) => {
    const number = i + 1;
    const shiftLimitDate = moment(firstPaymentDate)
      .add({
        [recurrenceKey]: recurrenceValue * (number - 1)
      })
      .format("YYYY-MM-DD");
    round.shifts[i].limitDate = shiftLimitDate;
  });

  await round.save();
  // SCHEDULE START JOB
  try {
    await updateStartRoundJob(moment(round.startDate), round._id);
  } catch (error) {
    console.log("=====================");
    console.log("ERROR updateStartRoundJob:", error.message);
    console.log("=====================");
  }

  return round;
};

exports.reSendInvite = async req => {
  // SEND NOTIFICATION TO PARTICIPANTS
  const { roundId } = req.params;

  const findedRound = await round_manager.findById(roundId);
  if (findedRound === null) throw new customError(`That round does not exists`);

  const notifications = await inviteRound(findedRound);

  return notifications;
};

exports.delete = async req => {
  const { roundId } = req.params;

  // Find round
  const round = await round_manager.findById(roundId);
  if (round === null) throw new customError("Round not exist");

  // Check round not started
  if (round.start) throw new customError("Only can delete not started rounds");

  // Check round not being processed for start or in progress for starting
  if (round.isBeingStarted)
    throw new customError("Preparing to start rounds can not be deleted");

  if (!round.isConfirmed)
    throw new customError("Not confirmed rounds can not be deleted");
  // Delete round
  const deleteRound = await round_manager.delete(round._id);
  if (deleteRound.deletedCount !== 1)
    throw new customError("No rounds deleted");

  if (
    deleteRound.n === 1 &&
    deleteRound.ok === 1 &&
    deleteRound.deletedCount === 1
  ) {
    return { success: `${roundId} deleted!` };
  } else {
    throw new customError("No rounds deleted");
  }
};

exports.participantSwap = async req => {
  const { roundId, participantId } = req.params;
  const { newParticipant, username } = req.body;

  // Find round
  const round = await round_manager.findById(roundId);
  if (round === null) throw new customError("Round not exist");

  // Check username is round admin
  if (round.admin.username !== username)
    throw new customError("Only admin can swap participants");

  newParticipant.phone = normalizePhone(newParticipant.phone);
  // Check new user not exist in the round
  const newUserInRound = round.participants.filter(
    e => e.user.phone === newParticipant.phone
  );
  if (newUserInRound.length !== 0) throw new customError("User exist in round");

  // Find participant
  const participant = await participant_manager.findById(participantId);
  if (participant === null) throw new customError("Participant not exist");

  // Check participant-round
  const participantRound = participant.round.toString();
  if (participantRound !== roundId)
    throw new customError("The participant not exist in this round");

  // Check if participant is round admin
  if (participant.user.username === round.admin.username)
    throw new customError("Cant swap round admin");

  // Check newParticipant distinct participant userid
  if (newParticipant.phone === participant.user.phone)
    throw new customError("Participant and new user are the same");

  // Fetch/create new user (newParticipant)
  let newUser = await user_manager.byPhone(newParticipant.phone);

  if (newUser === null) {
    const { address, privateKey } = await walletUtil.createWallet();
    if (!address || !privateKey) throw new customError("Error creating wallet");

    const encryptedAddress = crypto.cipher(address);
    const encryptedPK = crypto.cipher(privateKey);

    // Check name is not null
    if (!newParticipant.name)
      throw new customError("New users must have a name");
    // Create user with "verified = false"
    newUser = await user_manager.saveUnverified(
      newParticipant.phone,
      newParticipant.name,
      encryptedAddress,
      encryptedPK
    );
  }

  participant.isBeingSwapped = true;
  await participant.save();
  const roundUpdated = await round_manager.findById(roundId);
  return { round: roundUpdated, participant, newUser };
};

exports.participantReasignNumber = async req => {
  const { participantId, targetParticipantId, number, roundId } = req.body;

  // Find round
  const round = await round_manager.findById(roundId);
  if (round === null) throw new customError("Round not exist");

  // Find target participant
  const targetParticipant = await participant_manager.findById(
    targetParticipantId
  );
  if (targetParticipant === null)
    throw new customError("Target Participant not exist");

  //
  const participantToChange = await participant_manager.findById(participantId);
  if (participantToChange === null)
    throw new customError("Participant not exist");

  // The participant that we want their shift to be swapped
  // We need this first, so we know which one to change
  const participantShiftIndex = round.shifts.findIndex(
    s => s.participant[0].toString() === participantId
  );

  // The target whose shfit will be used for the reasignment
  const targetShiftIndex = round.shifts.findIndex(s => s.number === number);

  // Reasigning.
  const newTargetParticipant = [participantId];
  const newParticipant = [targetParticipantId];
  // We create a new array and reasign to make the isModified() true
  round.shifts[targetShiftIndex].participant = newTargetParticipant;
  round.shifts[participantShiftIndex].participant = newParticipant;

  // Save changes, it should reasign properly
  await round.save();

  return round_manager.findById(roundId);
};

exports.participantRemove = async req => {
  const { roundId, participantId } = req.params;

  // Find round
  const round = await round_manager.findById(roundId);
  if (round === null) throw new customError("Round not exist");

  // Check round start = false
  if (round.start)
    throw new customError("Cant remove participants from started round");

  // Find participant
  const participant = await participant_manager.findById(participantId);
  if (participant === null) throw new customError("Participant not exist");

  // Check participant-round
  const participantRound = participant.round.toString();
  if (participantRound !== roundId)
    throw new customError("The participant not exist in this round");

  // Check if participant is round admin
  if (participant.user.username === round.admin.username)
    throw new customError("Cant remove round admin");

  // Remove participant from round and delete it
  round.participants.pull({ _id: participant._id });
  participant.remove();

  const updatedRound = await round_manager.save(round);

  return updatedRound;
};

exports.participantPayNumber = async req => {
  const { roundId, number } = req.params;
  const { participantId } = req.middlewareData;

  // Find round
  const round = await round_manager.findById(roundId);
  if (round === null) throw new customError("Round not exist");

  // Find participant
  const participant = await participant_manager.findById(participantId);
  if (participant === null) throw new customError("Participant not exist");

  // Check number exist in round shift
  if (number > round.shifts.length)
    throw new customError("Number not exist in this round");

  // Check shift status is current
  const shift = round.shifts.find(e => e.number.toString() === number);
  if (!shift || shift.status !== "current")
    throw new customError("Shift must be current");

  // Check if participant has already pay
  const userPayShift = shift.pays.find(
    e => e.participant.toString() === participantId
  );
  if (userPayShift)
    throw new customError("The participant has already pay for this shift");

  // We mark the participant as making a payment, to prevent double payments, and paying with uncofirmed TX's
  participant.isReceivingOrMakingPayment = true;
  await participant.save();

  return { participant, round, number };
};

exports.start = async req => {
  const { roundId } = req.params;

  // Find round
  const round = await round_manager.findById(roundId);
  if (round === null) throw new customError("Round not exist");

  // Check that no participants rejected (acepted = false)
  const rejectedParticipants = round.participants.filter(
    e => e.acepted === false
  );
  if (rejectedParticipants.length)
    throw new customError("All participants must accept the invitation");
  round.isBeingStarted = true;
  await round.save();

  return { round };
};

exports.assignShiftNumber = async req => {
  const { roundId, number } = req.params;
  const { participantId } = req.body;

  // Find round
  const round = await round_manager.findById(roundId);
  if (round === null) throw new customError("Round not exist");

  // Find participant
  const participant = await participant_manager.findById(participantId);
  if (participant === null) throw new customError("Participant not exist");

  // Check number exist in round shift
  if (number > round.shifts.length)
    throw new customError("Number not exist in this round");

  // Check shift status is pending
  const shift = round.shifts.find(e => e.number.toString() === number);
  if (!shift || shift.status === "current" || shift.status === "completed")
    throw new customError("Shift cant be current or completed");

  // Check participant not exist in shift
  const participantExist = shift.participant.find(
    e => e.toString() === participantId
  );
  if (participantExist)
    throw new customError("Participant exist in this shift!");

  // Push participant on shift
  round.shifts
    .find(e => e.number.toString() === number)
    .participant.push(participant);

  // Update shift status
  round.shifts.find(e => e.number.toString() === number).status = "current";

  // Save changes to round
  const updatedRound = await round_manager.save(round);
  if (updatedRound === null) throw new customError("Error saving round");

  // Send notifications
  asignedShift(updatedRound, participant.name);

  return updatedRound;
};

exports.simulateFinish = async id => {
  const round = await round_manager.findById(id);

  const { recurrence, shifts, participants } = round;

  round.start = true;
  round.startDate = getSimulatedStartDate(recurrence, shifts);
  round.limitDate = getSimulatedLimitDate(recurrence, shifts);
  round.firstPaymentDate = getSimulatedFirstPaymentDate(recurrence, shifts);

  // simulate all participants accept round
  round.participants.forEach(participant => {
    participant.acepted = true;
  });
  // simulate shifts payments
  round.shifts.forEach(shift => {
    shift.limitDate = getShiftLimitDate(round, shift.number);
    shift.status = "completed";
    participants.forEach(participant => {
      shift.pays.push(getSimulatedPayment(participant._id, shift));
    });
  });

  round.completed = true;
  return await round_manager.save(round);
};
