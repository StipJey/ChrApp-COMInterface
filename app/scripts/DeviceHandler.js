define(function(require){
    var AppAPI = require('AppAPI');
    var driversList = new (require('DriversList'))();
    //var driversReq = {};
    //for (type of driversList){
    //    driversReq[type.type] = {};
    //    for (driver of type.drivers){
    //        driversReq[type.type][driver.file] = require(driver.file);
    //    }
    //}
    function scaleCallback(aData) {
        require(aData, function(scale){
            if (scale){
                document.addEventListener('getWeight', scale.get_weight);
            } else {
                document.addEventListener('getWeight', function(){
                    AppAPI("Весы не подключены");
                });
            }
        })
    };

    function DeviceHandler(){
        var self = this;
        this.devices = {};

        this.add = function(aDevice, anAlias){
            if (typeof aDevice !== "undefined"){
                this.devices[anAlias] = new aDevice(anAlias);
            }
        };

        this.connect = function(anAlias, aPort){
            if (this.devices[anAlias] && this.devices[anAlias].connect){
                this.devices[anAlias].connect(aPort);
            } else {
                console.log("Ошибка драйвера " + anAlias);
            }
        };

        this.setOptions = function(aSettings){
            var anAlias = aSettings.alias;
            if (this.devices[anAlias] && this.devices[anAlias].options){
                if (aSettings.bitrate && aSettings.bitrate != "default") this.devices[anAlias].options.bitrate = +aSettings.bitrate;
                if (aSettings.bufferSize && aSettings.bufferSize != "default") this.devices[anAlias].options.bufferSize = +aSettings.bufferSize;
                if (aSettings.dataBits && aSettings.dataBits != "default") this.devices[anAlias].options.dataBits = aSettings.dataBits;
                if (aSettings.parityBit && aSettings.parityBit != "default") this.devices[anAlias].options.parityBit = aSettings.parityBit;
                if (aSettings.stopBits && aSettings.stopBits != "default") this.devices[anAlias].options.stopBits = aSettings.stopBits;
            } else {
                console.log("Ошибка драйвера " + anAlias);
            }
        };

        this.connectToSavedDevices = function(){
            chrome.storage.local.get('devices', function(result){
                var devices = result.devices;
                for (var devIn in devices) {
                    (function(device) {
                        if (devices[device]) {
                            devices[device].file = driversList.getFile(devices[device].name);
                            require([devices[device].file], function (dev) {
                                self.add(dev, devices[device].settings.alias);
                                self.setOptions(devices[device].settings);
                                self.connect(devices[device].settings.alias, devices[device].settings.port);
                                console.log(devices[device].settings.alias);
                            });
                        }
                    })(devIn);
                }
            });
        }
    }


    return DeviceHandler;

});