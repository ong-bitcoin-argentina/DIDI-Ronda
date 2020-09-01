const WEB3JS = require("../managers/web3-client");
const crypto = require("./crypto");

exports.createWallet = async () => {
  const wallet = await WEB3JS.web3Client.eth.accounts.create();
  if (!wallet) throw new Error("Error when creating your wallet, try later");

  return wallet;
};

exports.getUnencryptedAddress = async enryptedAddress => {
  const address = await crypto.decipher(enryptedAddress).toString();
  return address;
};
