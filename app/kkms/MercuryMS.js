/**
 * Created by Work on 01.06.2015.
 */
define(function(require){
    var SerialConnection = require('../libs/SerialConnection');
    var AppAPI = require('AppAPI');
    var Utils = require('../libs/MercuryMS/MercuryMS_Utils');
    var errors = require('../libs/MercuryMS/MercuryMS_Errors');
    var Requisites = require('../libs/MercuryMS/MercuryMS_Requisites');

    function MercuryMS() {
        var password = "0000";

        var current_buffer = [];

        function rHandler(buf) {
            var bufView = new Uint8Array(buf);
            for (var i = 0; i < bufView.length; i++) {
                current_buffer[current_buffer.length] = bufView[i];
            }
            if (current_buffer[current_buffer.length - 1] == 3) {
                var indexFirst = 0;
                var index = 0;
                current_buffer.forEach(function (byte){
                    if (byte == 2){
                        indexFirst = index;
                    }
                    index++;
                });
                current_buffer.splice(0, indexFirst);
                CheckResponce(current_buffer);
            }
        }

        function CheckResponce(buf){
            var stx = buf[0];
            var code = buf[1];
            var etx = buf[buf.length - 1];

            if (stx == 2 && etx == 3){
                switch (code){
                    case 95 : //Ответ на отчет
                        CheckReportResponce(buf);
                        break;
                    case 83 : //Ответ на фискальную операцию
                        CheckSellResponce(buf);
                        break;
                    case 49 : //Ответ на регистрацию кассира
                        CheckRegCashierResponce(buf);
                        break;
                    default : //Ответ на что-то другое или ошибка.

                        break;
                }
            } else {

            }
        }

        function CheckBasicResponce(buf){
            if (buf.length >= 19) {
                var separator = buf[2];
                var statusKKM = Utils.bytesToHex(buf.slice(3, 7)); //4B
                var separator2 = buf[7];
                var result = Utils.bytesToHex(buf.slice(8, 12)); //4B
                var separator3 = buf[12];
                var statusPrinter = Utils.bytesToHex(buf.slice(13, 15)); //2B
                var separator4 = buf[15];

                if (separator == 0 && separator2 == 0 && separator3 == 0 && separator4 == 0){
                    var error = errors.getErrorDescription(result);
                    return {
                        statusKKM : statusKKM,
                        statusPrinter : statusPrinter,
                        result : result,
                        method : "sell",
                        description : error
                    }
                } else {
                    return false;
                }
            }
        }

        function CheckSellResponce(buf) {
            var responce = CheckBasicResponce(buf);
            if (responce){
                responce.method = "sell";
                AppAPI(responce,'go');
            } else {
                AppAPI({result : 9999, method : "sell", description : "Ошибка в ответе от устройства"},'go');
            }
        }

        function CheckRegCashierResponce(buf){
            var responce = CheckBasicResponce(buf);
            if (responce){
                responce.method = "openSession";
                AppAPI(responce,'go');
            } else {
                AppAPI({result : 9999, method : "openSession", description : "Ошибка в ответе от устройства"},'go');
            }
        }

        function CheckReportResponce(buf){
            var responce = CheckBasicResponce(buf);
            if (responce){
                responce.serialKKM = Utils.bytesToHex(buf.slice(16, 23));
                responce.reportNumber = Utils.bytesToHex(buf.slice(24, 29));
                responce.fiscalSum = Utils.bytesToHex(buf.slice(30, 45));
                responce.method = "report";
                AppAPI(responce,'go');
            } else {
                AppAPI({result : 9999, method : "report", description : "Ошибка в ответе от устройства"},'go');
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

         var onConnect = function(){
            AppAPI(true,'connectTo');
        };

        this.connect = function (aPath) {
            if (aPath) {
                this.connection.connect(aPath, onConnect);
            } else {
                this.connection.connect(this.options.devicePath);
            }
        };

        this.openSession = function (aParams) { //открытие смены
            var aNumber = aParams.number;
            var aFamily = aParams.family;
            var aCallback = aParams.callback;

            if (aNumber < 100 && aNumber > -1) {
                if (aFamily && aFamily.length > 0 && aFamily.length < 41) {
                    var data = [];
                    data.push(49);
                    data = data.concat(Utils.stringToBytes(password));
                    data.push(0);
                    data = data.concat(Utils.stringToBytes(aNumber.toString(), 2, "symbol"));
                    data.push(0);
                    data = data.concat(Utils.stringToBytes(aFamily, 40, "zero"));
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
                        result: "Номер кассира не может быть больше 99 и меньше 0"
                    });
                }
            }
        };

        this.closeSession = function (aFlags, aCallback) {//Закрытие смены
            var flags = aFlags ? aFlags : new Utils.generateReportFlags(0, 0, 1, 0, 0);
            getReport(48, flags, 0, aCallback);
        };

        this.getReportX = function (aFlags, aCashier, aCallback) {//сводный
            var flags = aFlags ? aFlags : new Utils.generateReportFlags();
            getReport(48, flags, aCashier, aCallback);
        };

        function getReport(aType, aFlags, aCashier, aCallback) {
            function checkType(aType) {
                return aType && (aType == 48 || aType == 49 || aType == 50 || aType == 51);
            }

            if (checkType(aType)) {
                if (aFlags) {
                    var data = [];
                    data.push(95);
                    data = data.concat(Utils.stringToBytes(password));
                    data.push(0);
                    data.push(aType);
                    data.push(0);
                    data = data.concat(Utils.stringToBytes(aFlags.getByte().toString(16).toUpperCase()));
                    data.push(0);
                    data = data.concat(Utils.stringToBytes(aCashier.toString(), 2, "symbol"));
                    data.push(0);
                    data = Utils.prepare(data);
                    Utils.print(data);
                    serial.send(Utils.convertArrayToBuffer(data));
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

        this.printData = function (aText, aCallback) {
            var data = [];
            data.push(54);
            data = data.concat(Utils.stringToBytes(password));
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

        function addItem(anItem, aLine) {
            var data = [];

            if (anItem.caption)
            {
                data = data.concat(Utils.stringToBytes("99", 2, "symbol")); //Тип реквизита 2B
                data.push(0);
                data = data.concat(Utils.stringToBytes(Utils.generateReqFlag("99", 0, 1), 4, "symbol")); //Флаги реквизита 4B
                data.push(0);
                data = data.concat(Utils.stringToBytes(0, 2, "symbol")); //Смещение по горизонтали от начала строки 2B
                data.push(0);
                data = data.concat(Utils.stringToBytes(aLine++, 3, "symbol")); //Смещение по вертикали 3B
                data.push(0);
                data = data.concat([0, 0, 0, 0, 0]);
                data = data.concat(Utils.stringToBytes(anItem.caption, 40, "zero")); //Сам реквизит 40B
                data.push(0);
            }

            data = data.concat(Utils.stringToBytes("11", 2, "symbol")); //Тип реквизита 2B
            data.push(0);
            data = data.concat(Utils.stringToBytes(Utils.generateReqFlag("11", 2, 1), 4, "symbol")); //Флаги реквизита 4B
            data.push(0);
            data = data.concat(Utils.stringToBytes(0, 2, "symbol")); //Смещение по горизонтали от начала строки 2B
            data.push(0);
            data = data.concat(Utils.stringToBytes(aLine++,3, "symbol")); //Смещение по вертикали 3B
            data.push(0);
            data = data.concat(Utils.stringToBytes(anItem.department, 2, "zero")); //Номер отдела, секции 2B
            data.push(0);
            data = data.concat(Utils.stringToBytes(anItem.code, 6, "zero")); //Код товара 6B
            data.push(0);
            data = data.concat(Utils.stringToBytes(anItem.discount ? anItem.discount : 0, 5, "zero")); //Процентная скидка, надбавка 5B
            data.push(0);
            data = data.concat(Utils.stringToBytes(anItem.quantity, 11, "zero")); //Количество 11B
            data.push(0);
            data = data.concat(Utils.stringToBytes(anItem.cost, 11, "zero")); //Цена услуги 11B
            data.push(0);
            data = data.concat(Utils.stringToBytes(anItem.measure, 5, "zero")); //Единица измерения 5B
            data.push(0);

            if (anItem.discount)
            {
                data = data.concat(Utils.stringToBytes("11", 2, "symbol")); //Тип реквизита 2B
                data.push(0);
                data = data.concat(Utils.stringToBytes(Utils.generateReqFlag("11", anItem.discount_type ? 1 : 0, 1, 0, 1), 4, "symbol")); //Флаги реквизита 4B
                data.push(0);
                data = data.concat(Utils.stringToBytes(0, 2, "symbol")); //Смещение по горизонтали от начала строки 2B
                data.push(0);
                data = data.concat(Utils.stringToBytes(aLine++, 3, "symbol")); //Смещение по вертикали 3B
                data.push(0);
                data = data.concat(Utils.stringToBytes(anItem.department, 2, "zero")); //Номер отдела, секции 2B
                data.push(0);
                data = data.concat(Utils.stringToBytes(anItem.code, 6, "zero")); //Код товара 6B
                data.push(0);
                data = data.concat(Utils.stringToBytes(anItem.discount, 5, "zero")); //Процентная скидка, надбавка 5B
                data.push(0);
                data = data.concat(Utils.stringToBytes(anItem.quantity, 11, "zero")); //Количество 11B
                data.push(0);
                data = data.concat(Utils.stringToBytes(anItem.cost, 11, "zero")); //Цена услуги 11B
                data.push(0);
                data = data.concat(Utils.stringToBytes(anItem.measure, 5, "zero")); //Единица измерения 5B
                data.push(0);
            }
            return [data, aLine];
        }

        function addReq(aReq, aLine, aValue, aFlag, aFont) {
            var flags, flag;

            if (aFlag){
                flag = aFlag;
            } else {
                flag = aReq.flag ? aReq.flag : 0;
            }

            if (aFont){
                flags = Utils.generateReqFlag(aReq.code, flag, 0, 0, 1, 0, aFont.Small, aFont.dWidth, aFont.dHeight);
            } else {
                flags = Utils.generateReqFlag(aReq.code, flag, 1);
            }



            var data = [];
            data = data.concat(Utils.stringToBytes(aReq.code, 2, "symbol")); //Тип реквизита 2B
            data.push(0);
            data = data.concat(Utils.stringToBytes(flags, 4, "symbol")); //Флаги реквизита 4B
            data.push(0);
            data = data.concat(Utils.stringToBytes(0, 2, "symbol")); //Смещение по горизонтали от начала строки 2B
            data.push(0);
            data = data.concat(Utils.stringToBytes(aLine, 3, "symbol")); //Смещение по вертикали 3B
            data.push(0);
            data = data.concat([0, 0, 0, 0, 0]);
            data = data.concat(Utils.stringToBytes(aValue ? aValue : 0, 40, "zero")); //Сам реквизит 40B
            data.push(0);
            return data;
        }

        function addFiscalHead(r, i, anOperationType) {
            switch(anOperationType){
                case "sell" : anOperationType = 0; r += 2; break;
                case "refund" : anOperationType = 1;  break;
            }

            var data = [];
            data.push(83); //0x53
            data = data.concat(Utils.stringToBytes(password, 4, "symbol")); //4B
            data.push(0);
            data = data.concat(Utils.stringToBytes(anOperationType)); //Тип операции
            data.push(0);
            data = data.concat(Utils.stringToBytes(Utils.intToString(Utils.generateDocumentFlags('close'), 2))); //Флаги документа 2B
            data.push(0);
            data = data.concat(Utils.stringToBytes(Utils.intToString(r + i, 3))); //Количество реквизитов 3B
            data.push(0);
            return data;
        }

        function calcOrderReqs(anOrder){
            var count = 0;
            if (anOrder.total_discount){
                count++;
            }
            for (var item of anOrder.items){
                if (item.caption){
                    count++;
                }
                if (item.discount){
                    count++
                }
                count++;
            }
            return count;
        }

        function fiscal(anOrder, aType){
            var data = [];
            var beginReqs = Requisites.getBeginReqs();
            var endReqs = Requisites.getEndReqs();
            var Reqs = Requisites.getReqs();
            var stroka = 0;

            data = data.concat(addFiscalHead(beginReqs.length + endReqs.length + 1, calcOrderReqs(anOrder), aType));

            //Заголовочная часть
            for (var Req of beginReqs) {
                data = data.concat(addReq(Req, stroka++));
            }

            //Пустая строка
            stroka++;

            //Обработка товаров
            for(var item of anOrder.items){
                var result = addItem(item, stroka);
                data = data.concat(result[0]);
                stroka = result[1];
            }

            //Скидка на весь чек
            if (anOrder.total_discount) {
                data = data.concat(addReq(Reqs.total_discount, stroka++, anOrder.total_discount, anOrder.total_discount_type ? 1 : 0));
            }

            //Итоговая сумма
            stroka++;
            data = data.concat(addReq(Reqs.total, stroka++, null, null, {Small : true, dWidth : false, dHeight : true}));


            //Оплаченная сумма и сдача
            if (aType == "sell"){
                data = data.concat(addReq(Reqs.money, stroka++, anOrder.money));
                data = data.concat(addReq(Reqs.cashback, stroka++));
            }

            //Футер чека
            for (var Req of endReqs) {
                data = data.concat(addReq(Req, stroka++));
            }


            data = Utils.prepare(data);
            Utils.print(data);
            serial.send(Utils.convertArrayToBuffer(data));
        }

        this.refund = function(anOrder){
            fiscal(anOrder, "refund");
        };

        this.sell = function (anOrder) {
            fiscal(anOrder, "sell");
        };
    }

    return MercuryMS;
});