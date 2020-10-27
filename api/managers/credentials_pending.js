const CredentialsPending = require("../models/credentialsPending");

exports.createOrGet = async (round, participant, jwt) => {
  let credential = await CredentialsPending.findOne({ jwt });
  if (!credential) {
    credential = await CredentialsPending.create({ participant, round, jwt });
  }
  return credential;
};

exports.findAll = async () => {
  return await CredentialsPending.find().populate({
    path: "participant",
    populate: {
      path: "user"
    }
  });
};

exports.deleteByJwt = async jwt => {
  return await CredentialsPending.deleteOne({ jwt });
};
