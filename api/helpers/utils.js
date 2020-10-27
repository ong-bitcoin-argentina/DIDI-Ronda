const logError = content => {
  console.log("\x1b[31m%s\x1b[0m", content);
};

const logSuccess = content => {
  console.log("\x1b[32m%s\x1b[0m", content);
};

const getDidAddress = did => {
  const cleanDid = did.split(":");
  return cleanDid[cleanDid.length - 1];
};

module.exports = {
  logError,
  logSuccess,
  getDidAddress
};
