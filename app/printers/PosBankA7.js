define(function(require) {
    var SerialConnection = require('../libs/SerialConnection');
    var AppAPI = require('AppAPI');
    var Utils = require('../libs/PosBankA7/PosBankA7_Utils');

    function PosBankA7(anAlias){

        var alias = anAlias;
        var current_buffer = [];
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

        //Обработчики ответов
        function rHandler(buf) {
            var bufView = new Uint8Array(buf);
            for (var i = 0; i < bufView.length; i++) {
                current_buffer[current_buffer.length] = bufView[i]
                console.log(bufView);
            }
            CheckSellResponce(current_buffer);
        }

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

        this.disconnect = function (aCallback) {
            if (aCallback){
                this.connection.disconnect(aCallback);
            } else {
                this.connection.disconnect(function(){
                    console.log("Disconnected");
                });
            }
        };

        this.openSession = function (aParams) { //открытие смены
            chrome.storage.local.get("requisites", function(result){
                result.requisites.cashier = aParams.family;
                chrome.storage.local.set(result, function(){
                    var data = [];
                    data = data.concat(Utils.printLine("Смена открыта: " + aParams.family, "left", 16));
                    data = data.concat([10, 10, 10, 10, 10]);
                    data = data.concat([27, 109])
                    serial.send(Utils.convertArrayToBuffer(data));
                });
            });


            var responce = {};
            responce.result = false;
            responce.method = "openSession";
            responce.alias = alias;
            AppAPI(responce,'go');
        };

        this.closeSession = function (aFlags, aCallback) {//Закрытие смены
            var responce = {};
            responce.result = false;
            responce.method = "closeSession";
            responce.alias = alias;
            AppAPI(responce,'go');
        };

        this.getCashierReport = function (aFlags, aCashier, aCallback) {
            var responce = {};
            var data = [];
            responce.result = false;
            responce.method = "getCashierReport";
            responce.alias = alias;
            AppAPI(responce,'go');

            data = data.concat(Utils.printLine("Принтер не поддерживает печать отчетов", "left", 16));
            data = data.concat([10, 10, 10, 10, 10]);
            data = data.concat([27, 109])
            serial.send(Utils.convertArrayToBuffer(data));
        };

        this.getSummaryReport = function (aFlags, aCallback){
            var responce = {};
            var data = [];
            responce.result = false;
            responce.method = "getSummaryReport";
            responce.alias = alias;
            AppAPI(responce,'go');

            data = data.concat(Utils.printLine("Принтер не поддерживает печать отчетов", "left", 16));
            data = data.concat([10, 10, 10, 10, 10]);
            data = data.concat([27, 109])
            serial.send(Utils.convertArrayToBuffer(data));
        };

        this.refund = function(anOrder){
            var data = [];
            var reqs = {};
            chrome.storage.local.get("requisites", function(result){
                reqs.firm = result.requisites.firm ? result.requisites.firm : "Не задано";
                reqs.INN = result.requisites.INN ? result.requisites.INN : "Не задано";
                reqs.cashier = result.requisites.cashier ? result.requisites.cashier : "Не задано";

                data = data.concat(getHeader(reqs));
                data = data.concat(createBodyRefund(anOrder));
                data = data.concat([10, 10, 10, 10, 10]);
                data = data.concat([27, 109]);
                data = data.concat([16,4,1]);
                serial.send(Utils.convertArrayToBuffer(data));
            });
        };

        this.sell = function (anOrder) {
            var data = [];
            var reqs = {};
            chrome.storage.local.get("requisites", function(result){
                reqs.firm = result.requisites.firm ? result.requisites.firm : "Не задано";
                reqs.INN = result.requisites.INN ? result.requisites.INN : "Не задано";
                reqs.cashier = result.requisites.cashier ? result.requisites.cashier : "Не задано";

                data = data.concat(getHeader(reqs));
                data = data.concat(createBodySell(anOrder));
                data = data.concat([10, 10, 10, 10, 10]);
                data = data.concat([27, 109]);
                data = data.concat([16,4,1]);
                serial.send(Utils.convertArrayToBuffer(data));
            });
        };

        //Временное решение
        this.setRequisites = function(aReqs){
            var Reqs = {};
            Reqs.requisites = aReqs;
            chrome.storage.local.set(Reqs, function(){
                var responce = {};
                responce.result = false;
                responce.method = "setRequisites";
                responce.alias = alias;
                AppAPI(responce,'go');
            });
        };

        function CheckSellResponce(buf) {
            var responce = {};
            responce.method = "sell";
            responce.alias = alias;
            AppAPI(responce,'go');
        }

        function createBodySell(anOrder){
            var sum = 0;
            var data = [];
            data = data.concat(Utils.printLine("ПРОДАЖА", "center", 16));


            //Обработка товаров
            for(var item of anOrder.items){
                data = data.concat(addItem(item));
                sum += item.cost * item.quantity;
                if (item.discount) {
                    sum -= item.cost * item.quantity * item.discount / 100;
                }
            }

            //Скидка на весь чек
            if (anOrder.total_discount) {
                data = data.concat(Utils.printBundle("Общая скидка на чек", (-anOrder.total_discount).toFixed(2)));
                sum -= +anOrder.total_discount;
            }

            data = data.concat(Utils.printLine("=========================================="))

            //Итоговая сумма
            data = data.concat(Utils.printBundle("ИТОГ", (+sum).toFixed(2), 176));


            //Оплаченная сумма и сдача
            data = data.concat(Utils.printBundle("Наличными", (+anOrder.money).toFixed(2), 17));
            data = data.concat(Utils.printBundle("Сдача", (+sum - +anOrder.money).toFixed(2), 16));
            return data;
        }

        function createBodyRefund(anOrder){
            var sum = 0;
            var data = [];
            data = data.concat(Utils.printLine("ВОЗВРАТ", "center", 16));


            //Обработка товаров
            for(var item of anOrder.items){
                data = data.concat(addItem(item));
                sum += item.cost * item.quantity;
                if (item.discount) {
                    sum -= item.cost * item.quantity * item.discount / 100;
                }
            }

            //Скидка на весь чек
            if (anOrder.total_discount) {
                data = data.concat(Utils.printBundle("Общая скидка на чек", (-anOrder.total_discount).toFixed(2)));
                sum -= +anOrder.total_discount;
            }

            data = data.concat(Utils.printLine("=========================================="))

            //Итоговая сумма
            data = data.concat(Utils.printBundle("ВОЗВРАТ", (+sum).toFixed(2), 176));

            return data;
        }

        function addItem(anItem) {
            var data;
            data = Utils.printBundle(anItem.caption, (+anItem.cost).toFixed(2) + " x " + anItem.quantity + " " + anItem.measure + "  =" + (+anItem.cost * +anItem.quantity).toFixed(2));
            if (anItem.discount){
                data = data.concat(Utils.printBundle("Скидка " + anItem.discount + "% ",  "  -" + (+anItem.cost * +anItem.quantity * +anItem.discount / 100).toFixed(2)));
            }
            return data;
        }

        function getHeader(reqs){
            //var reqs = {
            //    firm : "ООО Рога и Копыта",
            //    INN : 321358481157186,
            //    cashier : "Петрова О.Н."
            //};

            var data = [];
            data = data.concat(Utils.printLine(reqs.firm, "center", 16));
            data = data.concat([9, 10]);
            data = data.concat(Utils.printBundle(new Date().toLocaleDateString("ru", {year: 'numeric',month: 'numeric',day: 'numeric',hour: 'numeric',minute: 'numeric'}),"Кассир " + reqs.cashier));
            data = data.concat(Utils.printLine("ИНН " + reqs.INN, "right"));

            //data = data.concat([27, 77, 50, 27, 69, 48, 27, 45, 50, 27, 33, 16, 29, 66, 48, 27, 97, 48, 27, 51, 60, 27, 71, 48]);
            //data = data.concat(Utils.printBundle("АбвгдАбвгдАбвгдАбвгд", "Абвгд", 1));
            //data = data.concat(Utils.stringToBytes("БукафффкиБукафффкиБукафффкиБукафффки"));
            //data = data.concat([9, 9, 9, 9]);
            //data = data.concat([27,97,50]);
            //data = data.concat(Utils.stringToBytes("500"));
            //data = data.concat([9, 10]);

            return data;
        }


    }

    PosBankA7.information = {
        type : "printers"
    };

    return PosBankA7;
});
