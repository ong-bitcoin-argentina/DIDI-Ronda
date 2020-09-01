const Web3Client = require("web3");
const { WEB3_NODE_LOCATION } = process.env;

exports.web3Client = new Web3Client(
  Web3Client.givenProvider || WEB3_NODE_LOCATION
);
