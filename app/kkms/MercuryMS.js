/**
 * Created by Work on 01.06.2015.
 */
define(function(require){
    var SerialConnection = require('../libs/SerialConnection');
    var AppAPI = require('AppAPI');
    var Utils = require('../libs/MercuryMS/MercuryMS_Utils');
    var errors = require('../libs/MercuryMS/MercuryMS_Errors')

    function MercuryMS(){
        var stx = 2;
        var etx = 3;
        var passwordData = [48,48,48,48];
        var password = "0000";
        
        this.options = {
            bufferSize: 4096,
            bitrate: 9600,
            dataBits: "eight",
            parityBit: "no",
            stopBits: "one"
        };
        var serial = new SerialConnection(this.options);


        this.getPassword = function () {
            return password;
        };

        this.setPassword = function (aValue) {
            if (aValue.length == 4) {
                password = aValue;
                passwordData = Utils.stringToBytes(password);
            //TO DO call KKM
            }
            throw "Пароль должен содержать 4 символа.";
        };

        this.openSession = function (aNumber, aFamily, aCallback) { //открытие смены
            if (aNumber < 100 && aNumber > -1) {
                if (aFamily && aFamily.length > 0 && aFamily.length < 41) {
                    var data = [];
                    data.push(49);
                    data = data.concat(passwordData);
                    data.push(0);
                    data = data.concat(Utils.completeData(Utils.stringToBytes(aNumber.toString()), 2));
                    data.push(0);
                    data = data.concat(Utils.completeData(Utils.stringToBytes(aFamily), 40));
                    data.push(0);
                    data = Utils.prepare(data);
                    Utils.print(data);
                    serial.send(data, registerCashierResponse, aCallback);
                } else {
                    if (aCallback) {
                        aCallback({
                            result: "Фамилия кассира должна быть не больше 40 символов и меньше 0"
                        });
                    }
                }
            } else {
                if (aCallback) {
                    aCallback({
                        result:"Номер кассира не может быть больше 99 и меньше 0"
                    });
                }
            }
        };

        function checkResponse(aData, aMessageType) {
            if (aData && aData.length > 0) {
                if (aData[0] == stx && aData[aData.length - 1] == etx) {
                    if (aData[1] == aMessageType) {
                        if (Utils.checkBCC(aData)) {
                            return "";
                        } else {
                            return "Неверная контрольная сумма в ответе.";
                        }
                    } else {
                        return "Неверный тип сообщения в ответе.";
                    }
                } else {
                    return "Неверный формат ответа.";
                }
            } else {
                return "Нет данных ответа."
            }
        }

        function registerCashierResponse(aData, aCallback) {
            var error = checkResponse(aData, 49)
            var result = {};
            if (!error) {
                var resultCode = Utils.getInt(aData, 7, 4);
                if (!resultCode) {
                    result.error = errors.getErrorDescription(resultCode);
                } else {
                    result.code = resultCode;
                    result.message = errors.getErrorDescription(resultCode);
                    result.kkmStatus = Utils.getInt(aData, 2, 4);
                    result.printerStatus = Utils.getInt(aData, 12, 2);
                }
            } else {
                result.error = error;
            }
            if (aCallback) {
                aCallback(result);
            }
        }

        self.getReportZ = function (aFlags, aCallback) {//Закрытие смены
            var flags = aFlags ? aFlags : new ReportFlags();
            getReport(48, flags, 0, aCallback);
        };

        self.getReportX = function (aFlags, aCashier, aCallback) {//сводный
            var flags = aFlags ? aFlags : new ReportFlags();
            getReport(48, flags, aCashier, aCallback);
        };

        function getReport(aType, aFlags, aCashier, aCallback) {
            function checkType(aType) {
                return aType && (aType == 48 || aType == 49 || aType == 50 || aType ==51);
            }

            if (checkType(aType)) {
                if (aFlags) {
                    var data = [];
                    data.push(95);
                    data = data.concat(passwordData);
                    data.push(0);
                    data.push(aType);
                    data.push(0);
                    data = data.concat(Utils.stringToBytes(aFlags.getByte().toString(16).toUpperCase()));
                    data.push(0);
                    data = data.concat(Utils.completeData(Utils.stringToBytes(aCashier.toString()), 2));
                    data.push(0);
                    data = prepare(data);
                    Utils.print(data);
                    serial.send(data, getReportResponse, aCallback);
                } else {
                    if (aCallback) {
                        aCallback({
                            result: "Не заданы параметры отчета."
                        });
                    }
                }
            } else {
                if (aCallback) {
                    aCallback({
                        result: "Неверный тип отчета " + aType
                    });
                }
            }
        }

        function getReportResponse(aData, aCallback) {
            var error = checkResponse(aData, 95)
            var result = {};
            if (!error) {
                var resultCode = Utils.getInt(aData, 7, 4);
                if (!resultCode) {
                    result.error = errors.getErrorDescription(resultCode);
                } else {
                    result.code = resultCode;
                    result.message = errors.getErrorDescription(resultCode);
                    result.kkmStatus = Utils.getInt(aData, 2, 4);
                    result.printerStatus = Utils.getInt(aData, 12, 2);
                    result.kkmSerialNum = Utils.getString(aData, 15, 7);
                    result.reportNum = Utils.getInt(aData, 23, 5);
                    result.sum = Utils.getFloat(aData, 29, 15);
                }
            } else {
                result.error = error;
            }
            if (aCallback) {
                aCallback(result);
            }
        }

        self.printData = function (aText, aCallback) {
            var data = [];
            data.push(54);
            data = data.concat(passwordData);
            data.push(0);
            data = Utils.prepare(data);
            Utils.print(data);
            serial.send(data, null, aCallback);
            var textBytes = Utils.stringToBytes(aText);
            for (var i = 0; i < textBytes.length; i++) {
                serial.send([textBytes[i]], null, aCallback);
                Utils.print([textBytes[i]]);
            }
            Utils.print([27, 27]);
            serial.send([27, 27], null, aCallback);
        };
    };

    return MercuryMS;
});