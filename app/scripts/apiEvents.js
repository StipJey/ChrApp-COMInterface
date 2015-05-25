define(function(require){
    var AppAPI = require('AppAPI');
    document.addEventListener('isChromeApp', function(){
        AppAPI(true, 'isChromeApp');
    });
    
    document.addEventListener('getDevices', function(){
        var obj = {}; 
        var Connection = require('../libs/SerialConnection');
        var connection = new Connection();
        
        obj.devices = require('DriversList');
        connection.getDevices(function(ports) {
            obj.ports = ports;
        });
        AppAPI(obj, 'getDevices');
    });
    
    document.addEventListener('connectTo', function(aData){
        var deviceData = aData.detail;
        var device = require(deviceData.file);
        device.connect(deviceData.port);
    });
    
    return this;
});