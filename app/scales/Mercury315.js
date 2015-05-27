define(function(require){
    var Connection = require('../libs/SerialConnection');
    var AppAPI = require('AppAPI');

    function Mercury315() {


        this.options = {
            //serialOptions: {
            //    bitrate: 4800,
            //    parityBit: "even"
            //    //stopBits: "one"
            //}
        };

        var current_buffer = [];

        this.rHandler = function (buf) {
            var bufView = new Uint8Array(buf);
            for (var i = 0; i < bufView.length && current_buffer.length < 18; i++) {
                current_buffer[current_buffer.length] = bufView[i];
            }
            if (current_buffer.length == 18)
                sendWeight(current_buffer);
        };

        function sendWeight(bufView){
            var a = "";
            for (var i = 5; i >= 0; i--) {
                a += bufView[i];
            }
            AppAPI(parseInt(a), 'setWeight');
        }

        this.get_weight = function () {
            var bytes = new Uint8Array(1);
            bytes[0] = 3;
            current_buffer = [];
            this.connection.send(bytes.buffer);
        };

        this.connection = new Connection(this.options);

        this.connection.recieveHandler = this.rHandler;

        this.connect = function(aPath) {
            if (aPath){
                this.connection.connect(aPath);
            }else{
                this.connection.connect(this.options.devicePath);
            }
        };

        this.getPortList = function(){
            this.connection.getDevices(function(ports) {
                for (var counter = 0; counter < 2; counter++ ){
                    ports.push({path : "/dev/ttyS" + counter});
                }
                return ports;
            });
        };

        this.setSerialOptions = function(aOptions) {
            for (var j in aOptions)
                this.options[j] = aOptions[j];
        };
    }


    return Mercury315;
});


