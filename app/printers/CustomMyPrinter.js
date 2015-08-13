define(function(require) {

    var proto = require('../libs/OPOS/OPOS_Prototype');

    function CustomMyPrinter(anAlias){
        proto.bind(this)();

        this.options = {
            bufferSize: 4096,
            bitrate: 9600,
            dataBits: "eight",
            parityBit: "no",
            stopBits: "one"
        };

        this.textAreaOptions = {
            first : 32,
            firstDouble : 16,
            second : 40,
            secondDouble : 18
        };
    }

    CustomMyPrinter.information = {
        type : "printers"
    };

    return CustomMyPrinter;
});
