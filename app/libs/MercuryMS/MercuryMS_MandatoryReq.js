define(function(requery){


    function MandatoryReq(){
        var Reqs = [];
        Reqs.push({
            code : "00",
            description : "Номер ККМ",
            required : true,
            from : "memory",
            caption : "KKM",
            order : 4
        });
        Reqs.push({
            code : "01",
            description : "Наименование учреждения. Строка 1",
            required : false,
            from : "memory",
            caption : "firma1",
            order : 0
        });
        Reqs.push({
            code : "02",
            description : "Наименование учреждения. Строка 2",
            required : false,
            from : "memory",
            caption : "firma2",
            order : 1
        });
        Reqs.push({
            code : "03",
            description : "Наименование учреждения. Строка 3",
            required : false,
            from : "memory",
            caption : "firma3",
            order : 2
        });
        Reqs.push({
            code : "04",
            description : "Наименование учреждения. Строка 4",
            required : false,
            from : "memory",
            caption : "firma4",
            order : 3
        });
        Reqs.push({
            code : "05",
            description : "Дата и время совершения операции",
            required : true,
            from : "memory",
            caption : "date",
            order : 17
        });
        Reqs.push({
            code : "06",
            description : "Номер кассира",
            required : true,
            from : "memory",
            caption : "cashier",
            order : 6
        });
        Reqs.push({
            code : "07",
            description : "Номер документа",
            required : true,
            from : "memory",
            caption : "document",
            order : 18
        });
        Reqs.push({
            code : "08",
            description : "Номер чека",
            required : true,
            from : "memory",
            caption : "check",
            order : 19
        });
        Reqs.push({
            code : "09",
            description : "Номер счета",
            required : false,
            from : "user",
            caption : "bill",
            order : 20
        });
        Reqs.push({
            code : "10",
            description : "ИНН",
            required : true,
            from : "memory",
            caption : "INN",
            order : 5
        });
        Reqs.push({
            code : "11",
            description : "Цена услуги",
            required : true,
            from : "user",
            caption : "cost",
            order : 7
        });
        Reqs.push({
            code : "12",
            description : "Итоговая сумма",
            required : true,
            from : "memory",
            caption : "total",
            order : 8
        });
        Reqs.push({
            code : "13",
            description : "Уплаченная сумма",
            required : true,
            from : "user",
            caption : "money",
            order : 9
        });
        Reqs.push({
            code : "14",
            description : "Сумма сдачи",
            required : true,
            from : "memory",
            caption : "cashback",
            order : 10
        });
        Reqs.push({
            code : "15",
            description : "Сумма налогов по налоговой ставке 0",
            required : false,
            from : "memory",
            caption : "taxes0",
            order : 11
        });
        Reqs.push({
            code : "16",
            description : "Сумма налогов по налоговой ставке 1",
            required : false,
            from : "memory",
            caption : "taxes1",
            order : 12
        });
        Reqs.push({
            code : "17",
            description : "Сумма налогов по налоговой ставке 2",
            required : false,
            from : "memory",
            caption : "taxes2",
            order : 13
        });
        Reqs.push({
            code : "18",
            description : "Сумма налогов по налоговой ставке 3",
            required : false,
            from : "memory",
            caption : "taxes3",
            order : 14
        });
        Reqs.push({
            code : "19",
            description : "Сумма налогов по налоговой ставке 4",
            required : false,
            from : "memory",
            caption : "taxes4",
            order : 15
        });
        Reqs.push({
            code : "21",
            description : "Общая скидка или надбавка на чек",
            required : false,
            from : "user",
            caption : "total_discount",
            order : 16
        });
        Reqs.push({
            code : "99",
            description : "Доп реквизит",
            required : false,
            from : "user",
            caption : "additional",
            order : 21
        });

        Reqs.sort(sortByOrder);

        this.getAllReqs = function(){
            return Reqs;
        };

        this.getRequiredReqs = function(){
            var result = [];
            for (req of Reqs){
                if (req.required)
                    result.push(req);
            }
            return result;
        };

        this.getReqs = function(property, value){
            if (property){
                var result = [];
                for (req of Reqs){
                    if (req[property] == value){
                        result.push(req);
                    }
                }
                return result;
            } else {
                return Reqs;
            }
        };

        this.getCodeByCaption = function(aCaption){

        }

        function sortByOrder(a, b){
            if(a.order < b.order)
                return -1;
            if(a.order > b.order)
                return 1;
            return 0;
        }
    }

    return new MandatoryReq();
})