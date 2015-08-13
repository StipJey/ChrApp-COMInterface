define(function(require) {

    var proto = require('../libs/OPOS/OPOS_Prototype');

    function CustomKubeII(anAlias){
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

    CustomKubeII.information = {
        type : "printers"
    };

    return CustomKubeII;
});
