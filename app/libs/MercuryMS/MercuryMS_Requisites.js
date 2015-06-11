define(function(require){

    function MercuryMS_Requisites(){
        var ReqBefore = [];
        var ReqAfter = [];
        var ReqOptional = [];
        var ReqUseInCode = [];

        var Reqs = {
            //***
            //Заголовочные реквизиты, печатаются в начале чека
            //***
            firma1: {
                code: "01",
                description: "Наименование учреждения. Строка 1",
                required: false,
                from: "memory",
                caption: "firma1",
                order: 0
            },
            firma2: {
                code: "02",
                description: "Наименование учреждения. Строка 2",
                required: false,
                from: "memory",
                caption: "firma2",
                order: 1
            },
            firma3: {
                code: "03",
                description: "Наименование учреждения. Строка 3",
                required: false,
                from: "memory",
                caption: "firma3",
                order: 2
            },
            firma4: {
                code: "04",
                description: "Наименование учреждения. Строка 4",
                required: false,
                from: "memory",
                caption: "firma4",
                order: 3
            },

            KKM: {
                code: "00",
                description: "Номер ККМ",
                required: true,
                from: "memory",
                caption: "KKM",
                order: 4
            },

            INN: {
                code: "10",
                description: "ИНН",
                required: true,
                from: "memory",
                caption: "INN",
                order: 5
            },

            cashier: {
                code: "06",
                description: "Номер кассира",
                required: true,
                from: "memory",
                caption: "cashier",
                order: 6,
                flag : 1 //Выводить только фамилию
            },

            //***
            // Печатаются на чеке после вывода списка товаров.
            //***
            date: {
                code: "05",
                description: "Дата и время совершения операции",
                required: true,
                from: "memory",
                caption: "date",
                order: 17
            },
            document: {
                code: "07",
                description: "Номер документа",
                required: true,
                from: "memory",
                caption: "document",
                order: 18
            },
            check: {
                code: "08",
                description: "Номер чека",
                required: true,
                from: "memory",
                caption: "check",
                order: 19
            },


            //***
            //Не нашли применения, но возможно нужны
            //***
            bill: {
                code: "09",
                description: "Номер счета",
                required: false,
                from: "user",
                caption: "bill",
                order: 20
            },
            taxes0: {
                code: "15",
                description: "Сумма налогов по налоговой ставке 0",
                required: false,
                from: "memory",
                caption: "taxes0",
                order: 11
            },
            taxes1: {
                code: "16",
                description: "Сумма налогов по налоговой ставке 1",
                required: false,
                from: "memory",
                caption: "taxes1",
                order: 12
            },
            taxes2: {
                code: "17",
                description: "Сумма налогов по налоговой ставке 2",
                required: false,
                from: "memory",
                caption: "taxes2",
                order: 13
            },
            taxes3: {
                code: "18",
                description: "Сумма налогов по налоговой ставке 3",
                required: false,
                from: "memory",
                caption: "taxes3",
                order: 14
            },
            taxes4: {
                code: "19",
                description: "Сумма налогов по налоговой ставке 4",
                required: false,
                from: "memory",
                caption: "taxes4",
                order: 15
            },

            //***
            //Эти реквизиты захардкожены в обработке заказа. Здесь лежат для общего представления.
            //***

            cost: {
                code: "11",
                description: "Цена услуги",
                required: true,
                from: "user",
                caption: "cost",
                order: 7
            },
            total: {
                code: "12",
                description: "Итоговая сумма",
                required: true,
                from: "memory",
                caption: "total",
                order: 8
            },
            money: {
                code: "13",
                description: "Уплаченная сумма",
                required: true,
                from: "user",
                caption: "money",
                order: 9
            },
            cashback: {
                code: "14",
                description: "Сумма сдачи",
                required: true,
                from: "memory",
                caption: "cashback",
                order: 10
            },
            total_discount: {
                code: "21",
                description: "Общая скидка или надбавка на чек",
                required: false,
                from: "user",
                caption: "total_discount",
                order: 16
            },
            additional: {
                code: "99",
                description: "Доп реквизит",
                required: false,
                from: "user",
                caption: "additional",
                order: 21
            }
        }


        // * * *
        //Здесь можно настроить что будет выводиться до и что после печати товаров на чеке.
        // * * *
        //ReqBefore.push(Reqs.firma1);
        //ReqBefore.push(Reqs.firma2);
        //ReqBefore.push(Reqs.firma3);
        //ReqBefore.push(Reqs.firma4);
        ReqBefore.push(Reqs.KKM);
        ReqBefore.push(Reqs.INN);
        ReqBefore.push(Reqs.cashier);

        ReqAfter.push(Reqs.date);
        ReqAfter.push(Reqs.document);
        ReqAfter.push(Reqs.check);
        // * * *
        // Интерфейс
        // * * *
        this.getBeginReqs = function(){
            return ReqBefore;
        }

        this.getEndReqs = function(){
            return ReqAfter;
        }

        this.getReqs = function(){
            return Reqs;
        }
    }

    return new MercuryMS_Requisites();
});