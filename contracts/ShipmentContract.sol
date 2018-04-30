pragma solidity 0.4.19;

contract ShipmentContract {
    //state enum
    enum ShipmentState { NotCreated, InProcess, Stopped, Dead }

    //structs definition
    struct Measurment {
        uint[]  timeStamps;
        string 	gatewayId;
        uint 	sensorId;
        int 	temperature;
        uint	relativeHumidity;
    }

    struct Location {
        uint    createdTime;
        uint  	receivedTime;
        string 	gatewayId;
        string  longitude;
        string  latitude;
    }

    struct Alert {
        uint    createdTime;
        uint    receivedTime;
        uint    sensorId;
        string  alertText;
    }

    //contract variables
    address         public owner;
    uint            public startTime;
    ShipmentState   public state;
    Measurment      public lastMeasurement;
    Location        public lastLocation;
    Alert           public lastAlert;

    //events
    event MeasurementUpdate(uint createdTime, uint receivedTime, string gatewayId, uint sensorId, int temperature, uint relativeHumidity);
    event LocationUpdate(uint createdTime, uint receivedTime, string gatewayId, string longitude, string latitude);
    event StateChange(uint createdTime, ShipmentState state);
    event AlertSet(uint createdTime, uint receivedTime, uint sensorId, string alertText);

    //modifiers
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    //constructor
    function ShipmentContract(uint shipmentStartTime) public {
        owner = msg.sender;
        state = ShipmentState.InProcess;
        startTime = shipmentStartTime;
        lastMeasurement.timeStamps = new uint[](2);
        StateChange(shipmentStartTime, state);
    }

    //functions
    function addMeasurement(uint createdTime, uint receivedTime, string gatewayId, uint sensorId, int temperature, uint relativeHumidity) public onlyOwner {
        lastMeasurement.timeStamps[0] = createdTime;
        lastMeasurement.timeStamps[1] = receivedTime;
        lastMeasurement.gatewayId = gatewayId;
        lastMeasurement.sensorId = sensorId;
        lastMeasurement.temperature = temperature;
        lastMeasurement.relativeHumidity = relativeHumidity;

        MeasurementUpdate(createdTime, receivedTime, gatewayId, sensorId, temperature, relativeHumidity);
    }

    function addLocation(uint createdTime, uint receivedTime, string gatewayId, string longitude, string latitude) public onlyOwner {
        lastLocation.createdTime = createdTime;
        lastLocation.receivedTime = receivedTime;
        lastLocation.gatewayId = gatewayId;
        lastLocation.longitude = longitude;
        lastLocation.latitude = latitude;

        LocationUpdate(createdTime, receivedTime, gatewayId, longitude, latitude);
    }

    function addAlert (uint createdTime, uint receivedTime, uint sensorId, string alertText) public {
        lastAlert.createdTime = createdTime;
        lastAlert.receivedTime = receivedTime;
        lastAlert.sensorId = sensorId;
        lastAlert.alertText = alertText;

        AlertSet(createdTime, receivedTime, sensorId, alertText);
    }

    function stopShipment(uint createdTime) public onlyOwner {
        state = ShipmentState.Stopped;

        StateChange(createdTime, state);
    }

    function resumeShipment(uint createdTime) public onlyOwner {
        state = ShipmentState.InProcess;

        StateChange(createdTime, state);
    }

    function getState() public view onlyOwner returns (ShipmentState) {
        return (state);
    }

    function getLastMeasurement() public view onlyOwner returns (uint, string, uint, int, uint) {
        return (lastMeasurement.timeStamps[0], lastMeasurement.gatewayId, lastMeasurement.sensorId, lastMeasurement.temperature, lastMeasurement.relativeHumidity);
    }

    function getLastMeasurementReceivedTime() public view returns (uint) {
        return lastMeasurement.timeStamps[1];
    }

    function getLastLocation() public view onlyOwner returns (uint, uint, string, string, string) {
        return (lastLocation.createdTime, lastLocation.receivedTime, lastLocation.gatewayId, lastLocation.longitude, lastLocation.latitude);
    }

    function getLastAlert() public view onlyOwner returns (uint, uint, uint, string) {
        return(lastAlert.createdTime, lastAlert.receivedTime, lastAlert.sensorId, lastAlert.alertText);
    }

    function addMeasurements(uint[] createdTime, uint[] receivedTime, string gatewayId, uint[] sensorIds, int[] temperature, uint[] relativeHumidity) public onlyOwner {
        uint length = createdTime.length;
        uint i;

        for(i = 0; i < length ; i++) {
            addMeasurement(createdTime[i], receivedTime[i], gatewayId, sensorIds[i], temperature[i], relativeHumidity[i]);
        }
    }
}