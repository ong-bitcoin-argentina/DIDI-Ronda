const BlacklistedPassword = require("../models/blacklistedPassword");

exports.insertPasswords = async passwords => {
  const docs = passwords.map(p => new BlacklistedPassword({ password: p }));
  const result = await BlacklistedPassword.insertMany(docs);
  if (!result)
    console.error("ERROR: No blacklisted passwords could be inserted");
};

exports.checkIfPasswordExists = async password => {
  try {
    const result = await BlacklistedPassword.findOne({ password });
    if (result) return true;
    return false;
  } catch (error) {
    return false;
  }
};
