

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

    it('adding location and requesting last location, should be equal', async function() {
        let createdTime = Date.now();
        let receivedtime = createdTime + 100;
        let gatewayId = "g1";
        let longtitude =  "32.104086";
        let latitude = "34.891380";

        shipmentInstance.addLocation(createdTime, receivedtime, gatewayId, longtitude, latitude);
        var arr = await shipmentInstance.getLastLocation();
        assert.equal(createdTime, arr[0]);
        assert.equal(receivedtime, arr[1]);
        assert.equal(gatewayId, arr[2]);
        assert.equal(longtitude, arr[3]);
        assert.equal(latitude, arr[4]);
    })


    it('adding measurement and requesting last measurement, should be equal', async function() {
        var createdTime = Date.now();
        var receivedtime = createdTime + 100;
        var gatewayId = "g1";
        var sensorId = 111;
        var temp =  "4";
        var humidity = "25";

        await shipmentInstance.addMeasurement(createdTime, receivedtime, gatewayId, sensorId, temp, humidity);
        var arr = await shipmentInstance.getLastMeasurement.call();
        assert.equal(createdTime, arr[0]);
        assert.equal(gatewayId, arr[1]);
        assert.equal(sensorId, arr[2]);
        assert.equal(temp, arr[3]);
        assert.equal(humidity, arr[4]);
    })

        it('adding alert and requesting last alert, should be equal', async function() {
            var createdTime = Date.now();
            var receivedtime = createdTime + 100;
            var sensorId = 111;
            var alert =  "temp is above threshold";

            await shipmentInstance.addAlert(createdTime, receivedtime, sensorId, alert);
            var arr = await shipmentInstance.getLastAlert();
            assert.equal(createdTime, arr[0]);
            assert.equal(receivedtime, arr[1]);
            assert.equal(sensorId, arr[2]);
            assert.equal(alert, arr[3]);
        });

        it('adding 2 measurements and requesting last measurement, should be equal to second measurement', async function() {
            var createdTime = [Date.now(), Date.now() + 1000];
            var receivedtime = [createdTime[0] + 100, createdTime[1] + 100];
            var gatewayId = "g1";
            var sensorId = [111, 112];
            var temp =  ["4", "5"];
            var humidity = ["25", "26"];

            await shipmentInstance.addMeasurements(createdTime, receivedtime, gatewayId, sensorId, temp, humidity);
            var arr = await shipmentInstance.getLastMeasurement.call();
            assert.equal(createdTime[1], arr[0]);
            assert.equal(gatewayId, arr[1]);
            assert.equal(sensorId[1], arr[2]);
            assert.equal(temp[1], arr[3]);
            assert.equal(humidity[1], arr[4]);
        })

        it('stopping and then resuming a shipment, shipment state should change', async function() {
            var currentState;
            await shipmentInstance.stopShipment(Date.now());
            currentState = await shipmentInstance.getState();
            assert.equal(currentState,2);

            await shipmentInstance.resumeShipment(Date.now());
            currentState = await shipmentInstance.getState();
            assert.equal(currentState,1);
        })

});

