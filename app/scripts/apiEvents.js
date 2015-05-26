define(function(require){
    var AppAPI = require('AppAPI');
    var DeviceHandler = require('DeviceHandler');
    var deviceHandler = new DeviceHandler();

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

    document.addEventListener('connectTo', function(event){
        var deviceData = event.detail;
        require([deviceData.file], function(dev){
            deviceHandler.add(dev, deviceData.alias);
            deviceHandler.devices[deviceData.alias].connect(deviceData.port);
        })

    });

    document.addEventListener('setSettings', function(event){
        chrome.storage.local.set(event.detail);
    });

    document.addEventListener('getSettings', function(event){
        if (event.keys){
            chrome.storage.local.get(event.keys, function(data){
                AppAPI(JSON.stringify(data), 'getSettings');
            });
        } else {
            chrome.storage.local.get(function(data){
                AppAPI(JSON.stringify(data), 'getSettings');
            });
        }
    });


    return this;
});