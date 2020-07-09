const Resolver = require("@rnsdomains/rns-sdk-js");
const {
  RNS_NODE_LOCATION,
  RNS_RESOLVER_ADDRESS,
  RNS_ABI_FILE_PATH,
} = process.env;

let abi = null;

if (RNS_ABI_FILE_PATH && RNS_ABI_FILE_PATH !== "") {
  abi = require("../../" + RNS_ABI_FILE_PATH);
}

if (abi) {
  exports.resolver = new Resolver(RNS_NODE_LOCATION, RNS_RESOLVER_ADDRESS, abi);
} else {
  exports.resolver = new Resolver(RNS_NODE_LOCATION, RNS_RESOLVER_ADDRESS);
}
