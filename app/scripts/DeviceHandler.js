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
            this.devices[anAlias].connect(aPort);
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