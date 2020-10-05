const moment = require("moment");
const { recurrenceConfig } = require("../helpers/config");

const getKey = recurrence => Object.keys(recurrenceConfig[recurrence]);
const getValue = recurrence => Object.values(recurrenceConfig[recurrence]);

const getSimulatedStartDate = (recurrence, shifts) => {
  const firstPaymentDate = getSimulatedFirstPaymentDate(recurrence, shifts);

  return moment(firstPaymentDate)
    .subtract(1, "d")
    .utcOffset(0)
    .set("h", 0)
    .toDate();
};

const getSimulatedLimitDate = (recurrence, shifts) => {
  const firstPaymentDate = getSimulatedFirstPaymentDate(recurrence, shifts);

  return moment(firstPaymentDate)
    .add(1, "d")
    .utcOffset(0)
    .set("h", 0)
    .toDate();
};

const getSimulatedFirstPaymentDate = (recurrence, shifts) => {
  const key = getKey(recurrence);
  const value = getValue(recurrence);
  const result = value * shifts.length - 1;
  return moment()
    .subtract({ [key]: result })
    .format("YYYY-MM-DD");
};

const getSimulatedPayment = (participant, shift, approved = true) => {
  const date = moment(shift.limitDate)
    .subtract(1, "d")
    .toDate();
  return {
    participant,
    approved,
    date,
    guarantor: null
  };
};

const getShiftLimitDate = (round, number) => {
  const { recurrence, firstPaymentDate } = round;
  const key = getKey(recurrence);
  const value = getValue(recurrence);
  return moment(firstPaymentDate)
    .add({
      [key]: value * (number - 1)
    })
    .format("YYYY-MM-DD");
};

module.exports = {
  getSimulatedFirstPaymentDate,
  getSimulatedLimitDate,
  getSimulatedPayment,
  getShiftLimitDate,
  getSimulatedStartDate
};
