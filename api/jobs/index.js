require("dotenv").config();
const { rememberNotifications } = require("../helpers/config");
const CronJob = require("cron").CronJob;
const { agenda } = require("./creation");
const round_manager = require("../managers/round");
const credentials_service = require("../services/credential");
const types = require("./types");

const { roundNotStarted } = require("../helpers/notifications/notifications");
const {
  createNotification,
  INTENTS
} = require("../helpers/notifications/config");
const {
  shiftAboutToEnd,
  lastDayBeforeExpiration
} = require("../helpers/notifications/messages");

const { customError } = require("../helpers/errorHandler");

const { handleRoundNumberChange, walletRefill } = require("./utils");
const { startRound } = require("../services/postRes");

const {
  REFILL_SECONDS,
  REFILL_MINUTES,
  REFILL_HOURS,
  REFILL_DAY_OF_MONTH,
  REFILL_MONTH,
  REFILL_DAY_OF_WEEL
} = process.env;

// Define jobs
agenda.define(types.NOTIFICATIONS_PAYS_REMEMBER, async job => {
  const { roundId, number, isLastDay } = job.attrs.data;

  // Refresh round data
  const updatedRound = await round_manager.findById(roundId);

  if (updatedRound) {
    // Get days left
    const objectSubstract = rememberNotifications[updatedRound.recurrence];
    const daysLeft = objectSubstract.days;

    // Get shift
    const shift = updatedRound.shifts.find(
      shift => shift.number.toString() === number.toString()
    );

    // Get not paid participants
    const notPaidParticipants = updatedRound.participants.filter(
      participant => !shift.pays.includes(participant._id)
    );

    // Uuser tokens of not paid participants
    const notPaidTokens = notPaidParticipants
      .map(p => p.user.token)
      .filter(t => t);

    if (notPaidTokens.length) {
      // Get admin name
      const adminName = updatedRound.admin.name;

      // Get end date
      const endDate = shift.limitDate;
      const notificationData = {
        action: JSON.stringify({
          routeName: "RoundDetail",
          params: { _id: updatedRound._id },
          intent: INTENTS.REMEMBER_PAYMENT,
          roundName: updatedRound.name,
          shiftNumber: shift.number.toString(),
          limitDate: shift.limitDate
        })
      };

      const message = isLastDay
        ? lastDayBeforeExpiration(updatedRound.name, shift.number)
        : shiftAboutToEnd(daysLeft, number, adminName, endDate);

      console.log("Send scheduled pay remember notifcation", { isLastDay });
      const notificationResult = await createNotification(
        notPaidTokens,
        "ronda",
        message,
        notificationData
      );

      return notificationResult;
    }
  }
});

agenda.define(types.ROUND_START_DATE, async job => {
  const { roundId } = job.attrs.data;

  // Get round
  const round = await round_manager.findById(roundId);

  // Only if round exist and not started yet
  if (round && round.start === false) {
    // Check that no participants rejected (acepted = false)
    const rejectedParticipants = round.participants.filter(
      e => e.acepted === false
    );
    if (rejectedParticipants.length) return roundNotStarted(round);

    try {
      const updatedRound = await startRound({ round });
      if (!updatedRound) {
        throw new customError("Error starting round in schedule");
      }
    } catch (error) {
      logError("Error starting round in schedule");
      console.log(error);
    }

    return;
  }
});

agenda.define(types.ROUND_NUMBER_CHANGE, async job => {
  const { roundId } = job.attrs.data;
  return await handleRoundNumberChange(roundId);
});

// Start method
exports.agendaStart = () => {
  console.log("Starting agenda...");
  agenda.start();
};

exports.permanentJob = () => {
  const frequency = [
    REFILL_SECONDS,
    REFILL_MINUTES,
    REFILL_HOURS,
    REFILL_DAY_OF_MONTH,
    REFILL_MONTH,
    REFILL_DAY_OF_WEEL
  ].join(" ");
  new CronJob(
    frequency,
    async () => {
      walletRefill();
      credentials_service.emitPendingCredentials();
    },
    //Execute once when api started
    null,
    true,
    "America/Argentina/Buenos_Aires",
    null,
    true
  );
};
