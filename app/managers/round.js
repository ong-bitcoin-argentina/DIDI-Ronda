const Round = require("../models/round");

exports.findById = async id => {
  return await Round.findById(id)
    .populate({
      path: "admin",
      model: "User",
    })
    .populate({
      path: "participants",
      model: "Participant",
      populate: {
        path: "user",
        model: "User",
      },
    })
    .then(round => round)
    .catch(err => ({ error: err }));
};

exports.delete = async id => {
  return await Round.deleteOne({ _id: id })
    .then(response => response)
    .catch(err => ({ error: err }));
};

exports.save = async round => {
  return await round
    .save()
    .then(newRound => newRound)
    .catch(err => ({ error: err }));
};

exports.createModel = async (
  name,
  amount,
  recurrence,
  startDate,
  limitDate,
  firstPaymentDate,
  admin,
  participants = [],
  shifts = []
) => {
  return new Round({
    name: name,
    amount: amount,
    recurrence: recurrence,
    startDate: startDate,
    limitDate: limitDate,
    firstPaymentDate: firstPaymentDate,
    admin: admin,
    participants: participants,
    shifts: shifts,
  });
};
