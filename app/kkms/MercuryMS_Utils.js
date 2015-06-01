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

        var extendedASCIITable = [];
        function createExtendedASCIITable() {
            var table = extendedASCIITable;
            //Русские заглавные
            table[1040] = 128;
            table[1041] = 129;
            table[1042] = 130;
            table[1043] = 131;
            table[1044] = 132;
            table[1045] = 133;
            table[1046] = 134;
            table[1047] = 135;
            table[1048] = 136;
            table[1049] = 137;
            table[1050] = 138;
            table[1051] = 139;
            table[1052] = 140;
            table[1053] = 141;
            table[1054] = 142;
            table[1055] = 143;
            table[1056] = 144;
            table[1057] = 145;
            table[1058] = 146;
            table[1059] = 147;
            table[1060] = 148;
            table[1061] = 149;
            table[1062] = 150;
            table[1063] = 151;
            table[1064] = 152;
            table[1065] = 153;
            table[1066] = 154;
            table[1067] = 155;
            table[1068] = 156;
            table[1069] = 157;
            table[1070] = 158;
            table[1071] = 159;
            //Русские строчные
            table[1072] = 160;
            table[1073] = 161;
            table[1074] = 162;
            table[1075] = 163;
            table[1076] = 164;
            table[1077] = 165;
            table[1078] = 166;
            table[1079] = 167;
            table[1080] = 168;
            table[1081] = 169;
            table[1082] = 170;
            table[1083] = 171;
            table[1084] = 172;
            table[1085] = 173;
            table[1086] = 174;
            table[1087] = 175;
            table[1088] = 224;
            table[1089] = 225;
            table[1090] = 226;
            table[1091] = 227;
            table[1092] = 228;
            table[1093] = 229;
            table[1094] = 230;
            table[1095] = 231;
            table[1096] = 232;
            table[1097] = 233;
            table[1098] = 234;
            table[1099] = 235;
            table[1100] = 236;
            table[1101] = 237;
            table[1102] = 238;
            table[1103] = 239;
        }

        createExtendedASCIITable();

        function getExtendASCIICodeFromUTF(aUTF8Code) {
            return extendedASCIITable[aUTF8Code];
        }

        self.completeData = function(aData, aNeedLength) {
            var len = aNeedLength - aData.length;
            if (aData && len > 0) {
                for (var i = 0; i < len; i++) {
                    aData.push(0);
                }
            }
            return aData;
        };

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

        self.checkBCC = function (aData) {
            if (aData && aData.length > 0) {
                var sBCC = "";
                sBCC += aData[aData.length - 3] + aData[aData.length - 2];
                var bcc = parseInt(sBCC, 16);
                var calcedBCC = self.calcedBCC(aData, 1, aData.length - 3);
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

        self.prepare(aData){
            var bcc = utils.calcBCC(aData);
            bcc = bcc.toString(16).toUpperCase();
            aData.unshift(stx);
            aData = aData.concat(utils.stringToBytes(bcc));
            aData.push(etx);
            return aData;
        }

        self.print(aData) {
            var mes = "";
            console.log("Request");
            aData.forEach(function(elem) {
                mes += elem.toString(16).toUpperCase() + " ";
            });
            console.log(mes);
        }
    }

});



