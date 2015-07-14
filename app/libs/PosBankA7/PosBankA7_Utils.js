/**
 * Created by Work on 01.06.2015.
 */
define(function (require) {
    var ASCII = require('./ExtendedASCIITable');


    function Utils() {
        var self = this;

        function stringToBytes(aValue) {
            if (aValue != 'undefined') {
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
            if (aValue != 'undefined') {
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

        self.print = function (aValue, anAlign, aFont) {
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
            data = data.concat([9, 10]);
            return data;
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
        }

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


