/**
 * Created by Work on 01.06.2015.
 */
define(function (require) {
    var ASCII = require('./ExtendedASCIITable');


    function Utils() {
        var self = this;

        function stringToBytes(aValue) {
            if (typeof aValue != 'undefined') {
                var value = aValue.toString();
                var len = value.length;
                var data = [];
                for (var i = 0; i < len; i++) {
                    var code = value.charCodeAt(i);
                    if (code >= 0 && code <= 255) {
                        data.push(code);
                    } else if (ASCII.getExtendASCIICodeFromUTF(code)) {
                        data.push(ASCII.getExtendASCIICodeFromUTF(code));
                    } else {
                        data.push(63); //?
                        console.error("Недопустимый символ '" + value.charAt(i) + "'");
                    }
                }
                return data;
            } else return 0;
        }

        self.stringToBytes = function(aValue) {
            return stringToBytes(aValue);
        };

        self.printLine = function (aValue, anAlign, aFont) {
            var data = [];
            data = data.concat([27, 69, 48, 27, 45, 48, 27, 33, aFont ? aFont : 0, 29, 66, 48, 27, 97, 48, 27, 51, 60, 27, 71, 49]);
            switch (anAlign) {
                case "left":
                    data = data.concat([27, 97, 48]);
                    break;
                case "center":
                    data = data.concat([27, 97, 49]);
                    break;
                case "right":
                    data = data.concat([27, 97, 50]);
                    break;
                default :
                    data = data.concat([27, 97, 48]);
            }
            data = data.concat(stringToBytes(aValue));
            data = data.concat([10]);
            return data;
        };

        self.printBundle = function(aOptions, aFirstValue, aSecondValue, aFont){
            aFirstValue = aFirstValue.toString();
            aSecondValue = aSecondValue.toString();
            if (!aFont) aFont = 0;
            var data = [];
            var newLine = 0;
            var spaces = 0;
            switch (aFont){
                case 0: case 16: case 128: case 144:
                    if (aFirstValue.length + aSecondValue.length > aOptions.first){
                        newLine = 1; break;
                    }
                    spaces = aOptions.first - (aFirstValue.length + aSecondValue.length);
                    break;
                case 32: case 48: case 160: case 176:
                    if (aFirstValue.length + aSecondValue.length > aOptions.firstDouble){
                        newLine = 1; break;
                    }
                    spaces = aOptions.firstDouble - (aFirstValue.length + aSecondValue.length);
                    break;
                case 1: case 17:
                    if (aFirstValue.length + aSecondValue.length > aOptions.second){
                        newLine = 1; break;
                    }
                    spaces = aOptions.second - (aFirstValue.length + aSecondValue.length);
                    break;
                case 33: case 49:
                    if (aFirstValue.length + aSecondValue.length > aOptions.secondDouble){
                        newLine = 1; break;
                    }
                    spaces = aOptions.secondDouble - (aFirstValue.length + aSecondValue.length);
                    break;
                default :
                    newLine = 0;
                    spaces = 0;
            }

            data = data.concat([27, 69, 48, 27, 45, 48, 27, 33, aFont ? aFont : 0, 29, 66, 48, 27, 97, 48, 27, 51, 60, 27, 71, 49]);

            if (newLine){
                data = data.concat(self.printLine(aFirstValue, "left", aFont));
                data = data.concat(self.printLine(aSecondValue, "right", aFont));
            } else {
                data = data.concat(stringToBytes(aFirstValue));
                for (var counter = 0; counter < spaces; counter++){
                    data.push(32);
                }
                data = data.concat(stringToBytes(aSecondValue));
                data.push(10);
            }

            return data;
        };

        self.printHR = function(aOptions){
            var line = "";
            for (var i = 0; i < aOptions.first; i++){
                line += "=";
            }
            return self.printLine(line);
        };

        self.convertArrayToBuffer = function (aData) {
            if (aData) {
                if (Array.isArray(aData)) {
                    var result = new ArrayBuffer(aData.length);
                    var buffer = new Uint8Array(result);
                    for (var i = 0, len = aData.length; i < len; i++) {
                        buffer[i] = aData[i];
                    }
                    return result;
                }
            }
        };

        self.bytesToHex = function (aData) {
            if (Array.isArray(aData)) {
                var code = "";
                for (var liter of aData) {
                    code += String.fromCharCode(liter);
                }
                return parseInt(code, 16);
            } else
                return false;
        }

        self.intToString = function(aNumber, aNeedLength) {
            if (aNumber != null && aNeedLength) {
                var value = aNumber.toString();
                while (value.length < aNeedLength){
                    value = "0" + value;
                }
                return value;
            }
            return null;
        };
    }

    return new Utils();
});


