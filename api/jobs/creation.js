const moment = require("moment");
const Agenda = require("agenda");
const types = require("./types");
const config = require("../helpers/config");

const { MONGO_SERVER, MONGO_DATABASE } = process.env;
const mongoConnectionString = `${MONGO_SERVER}/${MONGO_DATABASE}`;

const agenda = new Agenda({
  db: { address: mongoConnectionString },
  processEvery: "1 minutes"
});

exports.agenda = agenda;

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
