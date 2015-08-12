define(function(require) {
    var SerialConnection = require('../libs/SerialConnection');
    var AppAPI = require('AppAPI');
    var Utils = require('../libs/OPOS/OPOS_Utils');
    var proto = require('../libs/OPOS/OPOS_Prototype');

    function OPOSDriver(anAlias){
        proto.bind(this)();

        this.options = {
            bufferSize: 4096,
            bitrate: 115200,
            dataBits: "eight",
            parityBit: "no",
            stopBits: "one"
        };

        this.textAreaOptions = {
            first : 42,
            firstDouble : 21,
            second : 54,
            secondDouble : 26
        };
    }

    OPOSDriver.information = {
        type : "printers"
    };

    return OPOSDriver;
});
