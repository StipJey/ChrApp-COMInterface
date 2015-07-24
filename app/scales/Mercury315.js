define(function(require){
    var SerialConnection = require('../libs/SerialConnection');
    var AppAPI = require('AppAPI');

    function Mercury315(anAlias) {

        var alias = anAlias;
        this.options = {
            bitrate: 4800,
            parityBit: "even",
            stopBits: "one"
        };

        var current_buffer = [];

        function rHandler (buf) {
            var bufView = new Uint8Array(buf);
            for (var i = 0; i < bufView.length && current_buffer.length < 18; i++) {
                current_buffer[current_buffer.length] = bufView[i];
            }
            if (current_buffer.length == 18)
                sendWeight(current_buffer);
        }

        function sendWeight(bufView){
            var a = "";
            for (var i = 5; i >= 0; i--) {
                a += bufView[i];
            }
            var responce = {};
            responce.result = parseInt(a);
            responce.method = "getWeight";
            responce.alias = alias;
            AppAPI(responce,'go');
        }


        function send(aCommand, aParam){
            switch (aCommand){
                case 1: case 3:
                    var bytes = new Uint8Array(1);
                    bytes[0] = aCommand;
                    current_buffer = [];
                    Connection.send(bytes.buffer);
                    break;
                case 2:
                    var bytes = new Uint8Array(7);
                    bytes[0] = aCommand;
                    for (var i = 0; i < 6; i++){
                        bytes[i+1] = aParam[i] ? aParam[i] : 0;
                    }
                    current_buffer = [];
                    Connection.send(bytes.buffer);
                    break;
            }
            return true;
        }

        this.getWeight = function () {
            send(3);
        };

        this.resetTare = function(){
            if (send(1)){
                var responce = {};
                responce.result = 0;
                responce.method = "resetTare";
                responce.alias = alias;
                AppAPI(responce,'go');
            }
        };

        this.setCost = function(aCost){
            aCost = aCost.toString();
            aCost = aCost.replace(/[^0-9]/gim,'');

            var responce = {};
            responce.method = "setCost";
            responce.alias = alias;

            if (aCost.length > 6){
                responce.result = "Цена превышает допустимое значение";
                AppAPI(responce,'go');
            } else {
                var cost = [];
                for (var i = 0; i < 6; i++){
                    if (aCost[i]){
                        cost.unshift(aCost[i]);
                    } else
                        cost.push(0);
                }
                if (send(2, cost)){
                    responce.result = 0;
                    AppAPI(responce,'go');
                }
            }
        };

        this.connection = new SerialConnection(this.options);

        this.connection.recieveHandler = rHandler;

        var Connection = this.connection;

        var onConnect = function(){
            var responce = {
                alias : alias,
                result : true
            };
            AppAPI(responce,'connectTo');
        };

        this.connect = function (aPath) {
            if (aPath) {
                this.connection.connect(aPath, onConnect);
            } else {
                this.connection.connect(this.options.devicePath);
            }
        };

        this.openSession = function(){
            var bytes = new Uint8Array(1);
            bytes[0] = 2;
            current_buffer = [];
            this.connection.send(bytes.buffer);
        }
    }

    Mercury315.information = {
        type : "scales"
    };
    return Mercury315;
});


