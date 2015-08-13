define(function(require) {

    var proto = require('../libs/OPOS/OPOS_Prototype');

    function PosBankA7(anAlias){
        proto.bind(this)();

        this.options = {
            bufferSize: 4096,
            bitrate: 9600,
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

    PosBankA7.information = {
        type : "printers"
    };

    return PosBankA7;
});
