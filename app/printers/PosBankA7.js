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
                //CheckResponce(current_buffer);
            }
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

        };

        this.closeSession = function (aFlags, aCallback) {//Закрытие смены

        };

        this.getCashierReport = function (aFlags, aCashier, aCallback) {

        };

        this.getSummaryReport = function (aFlags, aCallback){

        };

        this.refund = function(anOrder){

        };

        this.sell = function (anOrder) {
            var data = [];

            //data = data.concat([27, 69, 48, 27, 45, 48, 27, 33, 0, 29, 66, 48, 27, 97, 48, 27, 51, 60, 27, 71, 49]);
            //data = data.concat(Utils.stringToBytes("0 Сосисочка молочная"));
            ////data = data.concat([9, 10]);
            //data = data.concat([27,97,50]);
            //data = data.concat(Utils.stringToBytes("500"));
            //data = data.concat([9, 10]);
            //data = data.concat([27, 69, 48, 27, 45, 48, 27, 33, 185, 29, 66, 48, 27, 97, 48, 27, 51, 60]);
            //data = data.concat([10, 10, 10, 10, 10]);
            //data = data.concat([27, 109]);

            data = data.concat(getHeader());
            data = data.concat(createBody(anOrder));
            data = data.concat([10, 10, 10, 10, 10]);
            data = data.concat([27, 109])

            serial.send(Utils.convertArrayToBuffer(data));
        };

        function createBody(anOrder){
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
                data = data.concat(Utils.printLine("Общая скидка на чек", "left", 17));
                data = data.concat(Utils.printLine(anOrder.total_discount, "right", 16));
            }

            data = data.concat(Utils.printLine("=========================================="))
            //Итоговая сумма
            //data = data.concat(Utils.printLine("ИТОГ", "left", 176));
            //data = data.concat(Utils.printLine(sum, "right", 176));
            data = data.concat(Utils.printBundle("ИТОГ", (+sum).toFixed(2), 176));


            //Оплаченная сумма и сдача
            //data = data.concat(Utils.printLine("Наличными", "left", 17));
            //data = data.concat(Utils.printLine(anOrder.money, "right", 17));
            data = data.concat(Utils.printBundle("Наличными", (+anOrder.money).toFixed(2), 17));
            //data = data.concat(Utils.printLine("Сдача", "left", 16));
            //data = data.concat(Utils.printLine(sum - anOrder.money, "right", 16));
            data = data.concat(Utils.printBundle("Сдача", (+sum - +anOrder.money).toFixed(2), 16));
            return data;
        }

        function addItem(anItem) {
            var data = [];
            //data = data.concat(Utils.printLine(anItem.caption));
            //data = data.concat(Utils.printLine(anItem.cost + " x " + anItem.quantity + " " + anItem.measure + "  =" + (anItem.cost * anItem.quantity), "right"));
            data = Utils.printBundle(anItem.caption, (+anItem.cost).toFixed(2) + " x " + anItem.quantity + " " + anItem.measure + "  =" + (+anItem.cost * +anItem.quantity).toFixed(2));
            if (anItem.discount){
                data = data.concat(Utils.printBundle("Скидка " + anItem.discount + "% ",  "  -" + (+anItem.cost * +anItem.quantity * +anItem.discount / 100).toFixed(2)));
            }
            return data;
        }

        function getHeader(){
            var reqs = {
                firm : "ООО Рога и Копыта",
                INN : 321358481157186,
                cashier : "Петрова О.Н."
            };
            var data = [];
            data = data.concat(Utils.printLine(reqs.firm, "center", 16));
            data = data.concat([9, 10]);
            data = data.concat(Utils.printBundle(new Date().toLocaleDateString("ru", {year: 'numeric',month: 'numeric',day: 'numeric',hour: 'numeric',minute: 'numeric'}),"Кассир " + reqs.cashier));
            //data = data.concat(Utils.printLine("ИНН " + reqs.INN, "right"));
            //data = data.concat(Utils.printLine(new Date().toLocaleDateString("ru", {year: 'numeric',month: 'numeric',day: 'numeric',hour: 'numeric',minute: 'numeric'}), "left"));
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

    return PosBankA7;
});
