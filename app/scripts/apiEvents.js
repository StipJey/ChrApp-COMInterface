define(function(require){
    var AppAPI = require('AppAPI');
    var DeviceHandler = require('DeviceHandler');
    var deviceHandler = new DeviceHandler();

    document.addEventListener('isChromeApp', function(){
        AppAPI(true, 'isChromeApp');
    });

    document.addEventListener('getDevices', function(){
        var devices = require('DriversList');
        AppAPI(devices, 'getDevices');
    });

    document.addEventListener('getPorts', function(){
        var Connection = require('../libs/SerialConnection');
        var connection = new Connection();
        connection.getDevices(function(ports) {
            AppAPI(ports, 'getDevices');
        });
    });

    document.addEventListener('connectTo', function(event){
        var deviceData = event.detail;
        require([deviceData.file], function(dev){
            deviceHandler.add(dev, deviceData.alias);
            deviceHandler.devices[deviceData.alias].connect(deviceData.port);
        })

    });

    document.addEventListener('isConnected', function(event){
        var deviceData = event.detail;
        AppAPI(deviceHandler.devices[deviceData.alias]['connection']['connectionId'], 'isConnect');
    });

    document.addEventListener('getFunctions', function(event){
        var deviceData = event.detail;
        var output = [];
        for (var func in deviceHandler.devices[deviceData.alias]){
            output.push(func);
        }
        AppAPI(output, 'getFunctions');
    });

    document.addEventListener('go', function(event){
        var deviceData = event.detail;
        deviceHandler.devices[deviceData.alias][deviceData.method](deviceData.params);
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