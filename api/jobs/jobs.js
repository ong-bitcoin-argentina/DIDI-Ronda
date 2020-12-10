require("dotenv").config();
const { rememberNotifications } = require("../helpers/config");
const moment = require("moment");
const Agenda = require("agenda");
const CronJob = require("cron").CronJob;
const round_manager = require("../managers/round");
const credentials_service = require("../services/credential");
const config = require("../helpers/config");
const types = require("./types");

const {
  roundNotStarted,
  roundStartAdminProcessing
} = require("../helpers/notifications/notifications");
const {
  createNotification,
  INTENTS
} = require("../helpers/notifications/config");
const { shiftAboutToEnd } = require("../helpers/notifications/messages");

const { customError } = require("../helpers/errorHandler");

const { handleRoundNumberChange, walletRefill } = require("./utils");
const { startRound } = require("../services/postRes");

const {
  MONGO_SERVER,
  MONGO_DATABASE,
  REFILL_SECONDS,
  REFILL_MINUTES,
  REFILL_HOURS,
  REFILL_DAY_OF_MONTH,
  REFILL_MONTH,
  REFILL_DAY_OF_WEEL
} = process.env;
const mongoConnectionString = `${MONGO_SERVER}/${MONGO_DATABASE}`;

const agenda = new Agenda({
  db: { address: mongoConnectionString },
  processEvery: "1 minutes"
});

// Define jobs
agenda.define(types.NOTIFICATIONS_PAYS_REMEMBER, async job => {
  const { roundId, number } = job.attrs.data;

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

    console.log(`Send scheduled notification payment remember`);

    const notificationResult = await createNotification(
      notPaidTokens,
      "La ronda",
      shiftAboutToEnd(daysLeft, number, adminName, endDate),
      notificationData
    );

    return notificationResult;
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

// Create job
exports.createPayRememberJob = (taskDate, roundId, number) => {
  const scheduleDate = config.scheduleNotificationsTime(
    taskDate.year(),
    taskDate.month(),
    taskDate.date()
  );
  console.log(`Creating task for ${scheduleDate}...`);
  const notificationData = { roundId, number };
  agenda.schedule(
    scheduleDate,
    types.NOTIFICATIONS_PAYS_REMEMBER,
    notificationData
  );
};

exports.createNumberChangeRoundJob = round => {
  const dates = round.shifts.map(s => s.limitDate);
  const { id } = round;
  const data = { roundId: id };
  dates.forEach((d, i) => {
    const offSet = moment().utcOffset();
    const date = moment
      .utc(d)
      .add("minutes", offSet)
      .toDate();
    console.log("Creating schedule for number ", i + 1);
    console.log("Date will be ", date);
    agenda.schedule(date, types.ROUND_NUMBER_CHANGE, data);
  });
};

exports.createStartRoundJob = (taskDate, roundId) => {
  const scheduleDate = config.scheduleJobsTime(
    taskDate.year(),
    taskDate.month(),
    taskDate.date()
  );
  console.log(`Creating task for ${scheduleDate}...`);
  const data = { roundId };
  agenda.schedule(scheduleDate, types.ROUND_START_DATE, data);
};

exports.updateStartRoundJob = async (taskDate, roundId) => {
  const scheduleDate = config.scheduleJobsTime(
    taskDate.year(),
    taskDate.month(),
    taskDate.date()
  );
  console.log(`Removing task for ${scheduleDate}...`);
  const data = { roundId };
  const jobs = await agenda.jobs({ data });
  await jobs[0].remove();
  this.createStartRoundJob(taskDate, roundId);
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
