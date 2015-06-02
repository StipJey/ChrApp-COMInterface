define(function(requery){


    function MandatoryReq(){
        var Reqs = [];
        Reqs.push({
            code : "00",
            description : "Номер ККМ",
            required : true,
            from : "memory"
        });
        Reqs.push({
            code : "01",
            description : "Наименование учреждения. Строка 1",
            required : false,
            from : "memory"
        });
        Reqs.push({
            code : "02",
            description : "Наименование учреждения. Строка 2",
            required : false,
            from : "memory"
        });
        Reqs.push({
            code : "03",
            description : "Наименование учреждения. Строка 3",
            required : false,
            from : "memory"
        });
        Reqs.push({
            code : "04",
            description : "Наименование учреждения. Строка 4",
            required : false,
            from : "memory"
        });
        Reqs.push({
            code : "05",
            description : "Дата и время совершения операции",
            required : true,
            from : "memory"
        });
        Reqs.push({
            code : "06",
            description : "Номер кассира",
            required : true,
            from : "memory"
        });
        Reqs.push({
            code : "07",
            description : "Номер документа",
            required : true,
            from : "memory"
        });
        Reqs.push({
            code : "08",
            description : "Номер чека",
            required : true,
            from : "memory"
        });
        Reqs.push({
            code : "09",
            description : "Номер счета",
            required : false,
            from : "user"
        });
        Reqs.push({
            code : "10",
            description : "ИНН",
            required : true,
            from : "memory"
        });
        Reqs.push({
            code : "11",
            description : "Цена услуги",
            required : true,
            from : "user"
        });
        Reqs.push({
            code : "12",
            description : "Итоговая сумма",
            required : true,
            from : "memory"
        });
        Reqs.push({
            code : "13",
            description : "Уплаченная сумма",
            required : true,
            from : "user"
        });
        Reqs.push({
            code : "14",
            description : "Сумма сдачи",
            required : true,
            from : "memory"
        });
        Reqs.push({
            code : "15",
            description : "Сумма налогов по налоговой ставке 0",
            required : false,
            from : "memory"
        });
        Reqs.push({
            code : "16",
            description : "Сумма налогов по налоговой ставке 1",
            required : false,
            from : "memory"
        });
        Reqs.push({
            code : "17",
            description : "Сумма налогов по налоговой ставке 2",
            required : false,
            from : "memory"
        });
        Reqs.push({
            code : "18",
            description : "Сумма налогов по налоговой ставке 3",
            required : false,
            from : "memory"
        });
        Reqs.push({
            code : "19",
            description : "Сумма налогов по налоговой ставке 4",
            required : false,
            from : "memory"
        });
        Reqs.push({
            code : "21",
            description : "Общая скидка или надбавка на чек",
            required : false,
            from : "user"
        });
        Reqs.push({
            code : "99",
            description : "Доп реквизит",
            required : false,
            from : "user"
        });

        this.getAllReqs = function(){
            return Reqs;
        }
        this.getRequiredReqs = function(){
            var result = [];
            for (req of Reqs){
                if (req.required)
                    result.push(req);
            }
            return result;
        }
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
        }
    }

    return new MandatoryReq();
})