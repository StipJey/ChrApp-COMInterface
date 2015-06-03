/**
 * Created by Work on 01.06.2015.
 */
define(function(require){
    var SerialConnection = require('../libs/SerialConnection');
    var AppAPI = require('AppAPI');
    var Utils = require('../libs/MercuryMS/MercuryMS_Utils');
    var errors = require('../libs/MercuryMS/MercuryMS_Errors')
    var Requisites = require('../libs/MercuryMS/MercuryMS_MandatoryReq')
    function MercuryMS(){
        var stx = 2;
        var etx = 3;
        var passwordData = [48,48,48,48];
        var password = "0000";

        //Служебный код. Требует рефакторинга
        var current_buffer = [];
        function rHandler (buf) {
            var bufView = new Uint8Array(buf);
            for (var i = 0; i < bufView.length && current_buffer.length < 19; i++) {
                current_buffer[current_buffer.length] = bufView[i];
                console.log("!!!HANDLER!!!");
                console.log(i);
                console.log(current_buffer);
            }
            if (current_buffer.length == 19)
                console.log("HANDLER_OUT");
                console.log(current_buffer);
                CheckSellResponce(current_buffer);
        };

        function CheckSellResponce(buf){
            if (buf.length == 19) {
                console.log("CHECK RESPONCE");
                console.log(buf);
                var stx = buf[0];
                var code = buf[1];
                var separator = buf[2];
                var statusKKM = Utils.bytesToHex(buf.slice(3, 7)); //4B
                var separator2 = buf[7];
                var result = Utils.bytesToHex(buf.slice(8, 12)); //4B
                var separator3 = buf[12];
                var statusPrinter = Utils.bytesToHex(buf.slice(13, 15)); //2B
                var separator4 = buf[15];
                var BCC = Utils.bytesToHex(buf.slice(16, 18));
                var etx = buf[18];

                console.log("KKM status");
                console.log(statusKKM);
                console.log("result");
                console.log(result);
                var error = errors.getErrorDescription(result);
                console.log("Сообщение ККМ: " + error);
                console.log("Printer status");
                console.log(statusPrinter);
                if (separator == 0 && separator2 == 0 && separator3 == 0 && separator4 == 0)
                    console.log("Разделители на месте");
                console.log("Контрольная сумма");
                console.log(BCC);
                console.log(buf);
            }
        }

        this.options = {
            bufferSize: 4096,
            bitrate: 9600,
            dataBits: "eight",
            parityBit: "no",
            stopBits: "one"
        };
        this.connection = new SerialConnection(this.options);
        var serial = this.connection;
        serial.recieveHandler = rHandler;

        this.connect = function(aPath) {
            if (aPath){
                this.connection.connect(aPath);
            }else{
                this.connection.connect(this.options.devicePath);
            }
        };

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

        this.openSession = function (aParams) { //открытие смены
            var aNumber = aParams.number;
            var aFamily = aParams.family;
            var aCallback = aParams.callback;

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
                    serial.send(Utils.convertArrayToBuffer(data));
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

        this.getReportZ = function (aFlags, aCallback) {//Закрытие смены
            var flags = aFlags ? aFlags : new Utils.generateReportFlags(0,0,1,0,0);
            getReport(48, flags, 0, aCallback);
        };

        this.getReportX = function (aFlags, aCashier, aCallback) {//сводный
            var flags = aFlags ? aFlags : new Utils.generateReportFlags();
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
                    data = Utils.prepare(data);
                    Utils.print(data);
                    serial.send(Utils.convertArrayToBuffer(data), getReportResponse, aCallback);
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

        this.printData = function (aText, aCallback) {
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

        //Все что выше реализовано Андрюхой. Переписано мной. Частично работает. Надо тестить.

        this.sell = function(anItems){
                var data = [];
                var documentFlags = Utils.generateDocumentFlags();
                var Reqs = Requisites.getReqs('required', true);


                data.push(83); //0x53
                data = data.concat(Utils.completeData(passwordData, 4)); //4B
                data.push(0);
                data.push(30); //Продажа
                data.push(0);
                data = data.concat(Utils.completeData(documentFlags, 2)); //Флаги документа 2B
                data.push(0);
                data = data.concat(Utils.completeData(Reqs.length, 3)); //Количество реквизитов 3B
                data.push(0);
                for (var Req of Reqs)
                {
                    data = data.concat(Utils.completeData(Req.code, 2)); //Тип реквизита 2B
                    data.push(0);
                    data = data.concat(Utils.completeData(Utils.generateReqFlag(Req.code, 0, 1), 4)); //Флаги реквизита 4B
                    data.push(0);
                    data = data.concat(Utils.completeData(0, 2)); //Смещение по горизонтали от начала строки 2B
                    data.push(0);
                    data = data.concat(Utils.completeData(1, 3)); //Смещение по вертикали 3B
                    data.push(0);
                    data = data.concat(Utils.completeData(0, 40)); //Сам реквизит 40B
                    data.push(0);
                }
                for (var Req of anItems)
                {
                    data = data.concat(Utils.completeData(11, 2)); //Тип реквизита 2B
                    data.push(0);
                    data = data.concat(Utils.completeData(Utils.generateReqFlag(Req.paymentMethod), 4)); //Флаги реквизита 4B
                    data.push(0);
                    data = data.concat(Utils.completeData(Req.horizontalShift, 2)); //Смещение по горизонтали от начала строки 2B
                    data.push(0);
                    data = data.concat(Utils.completeData(Req.verticalShift, 3)); //Смещение по вертикали 3B
                    data.push(0);
                    data = data.concat(Utils.completeData(Req.section, 2)); //Номер отдела, секции 2B
                    data.push(0);
                    data = data.concat(Utils.completeData(Req.code, 6)); //Код товара 6B
                    data.push(0);
                    data = data.concat(Utils.completeData(Req.discont, 5)); //Процентная скидка, надбавка 5B
                    data.push(0);
                    data = data.concat(Utils.completeData(Req.quantity, 11)); //Количество 11B
                    data.push(0);
                    data = data.concat(Utils.completeData(Req.cost, 11)); //Цена услуги 11B
                    data.push(0);
                    data = data.concat(Utils.completeData(Utils.stringToBytes(Req.measure), 5)); //Единица измерения 5B
                    data.push(0);
                }

                data = Utils.prepare(data);
                Utils.print(data);
                serial.send(Utils.convertArrayToBuffer(data));

            };
        }

    return MercuryMS;
});