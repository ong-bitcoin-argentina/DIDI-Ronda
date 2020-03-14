const RondasRegistry = artifacts.require("RondasRegistry");

module.exports = function(deployer) {
  deployer.deploy(RondasRegistry);
};
