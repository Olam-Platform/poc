
const Shipment = artifacts.require('./ShipmentContract.sol');

contract('Shipment Contract', function([owner]){

    let shipmentInstance;
    let startTime;

    beforeEach('setup new shipment contract for each test', async function(){
        startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
        shipmentInstance = await Shipment.new(startTime);
    })

    it("shipment has an owner", async function() {
        assert.equal(await shipmentInstance.owner(), owner);
    })


    it('start time of shipment should be equal to given start time in constructor', async function() {
        assert.equal(await shipmentInstance.startTime(), startTime);
    })

    it('initial shipment state should be InProcess', async function() {
        assert.equal(await shipmentInstance.state(), 1);
    })
});

