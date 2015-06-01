/**
 * Created by Work on 01.06.2015.
 */
define(function(require){

    function Utils() {
        var self = this;

        self.stringToBytes = function (aValue) {
            var value = aValue.toString();
            var len = value.length;
            var data = [];
            for (var i = 0; i < len; i++) {
                var code = value.charCodeAt(i);
                if (code >= 0 && code <= 255) {
                    data.push(code);
                } else if (getExtendASCIICodeFromUTF(code)) {
                    data.push(getExtendASCIICodeFromUTF(code));
                } else {
                    data.push(63); //?
                    console.error("Недопустимый символ '" + value.charAt(i) + "'");
                }
            }
            return data;
        };

        self.completeData = function(aData, aNeedLength) {
            var len = aNeedLength - aData.length;
            if (aData && len > 0) {
                for (var i = 0; i < len; i++) {
                    aData.push(0);
                }
            }
            return aData;
        };

        self.checkBCC = function (aData) {
            if (aData && aData.length > 0) {
                var sBCC = "";
                sBCC += aData[aData.length - 3] + aData[aData.length - 2];
                var bcc = parseInt(sBCC, 16);
                var calcedBCC = self.calcBCC(aData, 1, aData.length - 3);
                return bcc == calcedBCC;
            }
            return false;
        };

        self.calcBCC = function(aData, offset, length) {
            if (Array.isArray(aData)) {
                var bcc = 0;
                offset = offset ? offset : 0;
                length = length ? length : aData.length;
                for (var i = offset; i < length; i++) {
                    bcc = (bcc + aData[i]) & 0xFF;
                }
                return bcc;
            }
            return null;
        };

        self.getString = function (aData, aOffset, aLength) {
            var result = "";
            if (aData && aData.length >= (aOffset + aLength)) {
                for (var i = 0; i < aLength; i++) {
                    result += String.fromCharCode(aData[aOffset + i]);
                }
            }
            return result;
        };

        self.getInt = function (aData, aOffset, aLength) {
            return parseInt(self.getString(aData, aOffset, aLength));
        };

        self.getFloat = function (aData, aOffset, aLength) {
            return parseFloat(self.getString(aData, aOffset, aLength));
        };

        self.prepare = function(aData){
            var stx = 2;
            var etx = 3;
            var bcc = self.calcBCC(aData);
            bcc = bcc.toString(16).toUpperCase();
            aData.unshift(stx);
            aData = aData.concat(self.stringToBytes(bcc));
            aData.push(etx);
            return aData;
        };

        self.print = function(aData) {
            var mes = "";
            console.log("Request");
            aData.forEach(function(elem) {
                mes += elem.toString(16).toUpperCase() + " ";
            });
            console.log(mes);
        }

    }

    return new Utils();
});



//    self.convertIntToString = function(aNumber, aNeedLength) {
//        if (aNumber != null && aNeedLength) {
//            var value = aNumber.toString();
//            var len = aNeedLength - value.length;
//            if (len > 0) {
//                var complete = "";
//                for (var i=0; i < len; i++) {
//                    complete += "0";
//                }
//                value = complete + value;
//            }
//            return value;
//        }
//        return null;
//    };