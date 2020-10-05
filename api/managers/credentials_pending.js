const CredentialsPending = require("../models/credentialsPending");

exports.create = async (round, participant) => {
  return await CredentialsPending.create({ round, participant });
};

exports.deleteByParticipant = async participant => {
  return await CredentialsPending.deleteOne({ participant });
};
