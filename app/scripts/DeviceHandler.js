define(function(require){
    var AppAPI = require('AppAPI');
    //var driversList = require('DriversList');
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
        this.devices = {};
        this.add = function(aDevice, anAlias){
            this.devices[anAlias] = new aDevice(anAlias);
        }
    }


    return DeviceHandler;

});