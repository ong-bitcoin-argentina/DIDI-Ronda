const round_manager = require("../managers/round");
const credential_services = require("../services/credential");
const { completedRound } = require("../helpers/notifications/notifications");
const { customError } = require("../helpers/errorHandler");

const handleRoundNumberChange = async roundId => {
  console.log(`Job for round id ${roundId} change number started`);
  // Get round
  const round = await round_manager.findById(roundId);
  let sendCompletedNotification = false;
  // Round must be started
  if (!round) console.error(`Round with id ${roundId} not found!`);
  if (round && round.start) {
    // Which shift are we in?
    const currentShiftIndex = round.shifts.findIndex(
      s => s.status === "current"
    );
    console.log(JSON.stringify(round.shifts));
    console.log(`Current shift index is ${currentShiftIndex}`);
    if (currentShiftIndex != -1) {
      // Mark it as completed
      round.shifts[currentShiftIndex].status = "completed";
      const currentNumber = round.shifts[currentShiftIndex].number;
      const nextShiftIndex = round.shifts.findIndex(
        s => s.number === currentNumber + 1
      );
      // Are we in range?
      console.log(
        `Job for round id ${roundId} changed the status of shift to completed`
      );
      if (nextShiftIndex != -1) {
        // If we are in range, mark the next one as current

        round.shifts[nextShiftIndex].status = "current";

        console.log(
          `Job for round id ${roundId} changed the status of the next shift to current`
        );
      } else {
        sendCompletedNotification = true;
      }
    }
    // Save changes to round
    try {
      const updatedRound = await round_manager.save(round);
      console.log(`Job for round ${roundId} ran successfuly`);
      if (sendCompletedNotification)
        console.log(`Job for round ${roundId} will send ending notifications`);
      if (updatedRound === null)
        throw new customError("Error changing round number");
    } catch (error) {
      console.error(`Job for round ${roundId} had a failure when saving`);
      console.error(error);
    }

    try {
      await credential_services.emmitFinishedRoundParticipants(round);
    } catch (error) {
      console.error(
        `Job for round ${roundId} had a failure when try to emmit credentials`
      );
    }

    if (sendCompletedNotification) {
      // TODO: encolar participantes o emitir ronda
      await completedRound(round);
    }
  }

  return true;
};

module.exports = {
  handleRoundNumberChange
};
