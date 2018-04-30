var ShipmentContract = artifacts.require("ShipmentContract");

module.exports = function(deployer) {

  let startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
  deployer.deploy(ShipmentContract, startTime);
};
