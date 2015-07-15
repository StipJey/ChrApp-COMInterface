var deviceAlias = "kkmka";
//QUnit.config.autostart = false;

QUnit.test( "Подключение", function( assert ) {

    var done = assert.async();

    var event = {
        evtDest : "connectTo",
        data : {
            file : "../printers/PosBankA7",
            alias : deviceAlias,
            port : "COM7"
        }
    };

    console.log("apimsg:" + JSON.stringify(event));

    window.addEventListener("connectTo", function(evt) {
        console.log(evt);
        assert.ok(evt.detail, "Подключено" );
        done();
    });
});

//QUnit.test("Установка пароля", function( assert ) {
//    var done = assert.async();
//
//    var event = {
//        evtDest : "go",
//        data : {
//            alias : deviceAlias,
//            method : "setPassword",
//            params : "0000"
//        }
//    };
//
//    console.log("apimsg:" + JSON.stringify(event));
//
//    var listener = function(evt) {
//        console.log(evt);
//        assert.equal(evt.detail.result, event.data.params, "пароль установлен" );
//        done();
//        window.removeEventListener("go", listener);
//    }
//
//    window.addEventListener("go", listener);
//});
//
//QUnit.test("Запрос пароля из памяти", function( assert ) {
//    var done = assert.async();
//
//    var event = {
//        evtDest : "go",
//        data : {
//            alias : deviceAlias,
//            method : "getPassword",
//            params : null
//        }
//    };
//
//    console.log("apimsg:" + JSON.stringify(event));
//
//    var listener = function(evt) {
//        console.log(evt);
//        assert.ok(evt.detail.result, "Пароль получен" );
//        done();
//        window.removeEventListener("go", listener);
//    }
//
//    window.addEventListener("go", listener);
//});
//
//QUnit.test("Регистрация кассира", function( assert ) {
//    var done = assert.async();
//
//    var event = {
//        evtDest : "go",
//        data : {
//            alias : deviceAlias,
//            method : "openSession",
//            params : {
//                number : 1,
//                family : "Черкасов Евгений"
//            }
//        }
//    };
//
//    console.log("apimsg:" + JSON.stringify(event));
//
//    var listener = function(evt){
//        console.log(evt);
//        assert.notOk(evt.detail.result, "Кассир зарегистрирован" );
//        done();
//        window.removeEventListener("go", listener);
//    }
//
//    window.addEventListener("go", listener);
//});

//QUnit.test("Продажа обычная", function( assert ) {
//    var done = assert.async();
//
//    var order = {
//        items: [{
//            department: "2",
//            code: "323",
//            quantity: "3",
//            cost: "16",
//            measure: "КГ",
//            caption: "Огурцы"
//        }],
//        money : "1000"
//    };
//
//    var event = {
//        evtDest : "go",
//        data : {
//            alias : deviceAlias,
//            method : "sell",
//            params : order
//        }
//    };
//
//    console.log("apimsg:" + JSON.stringify(event));
//
//    var listener = function(evt){
//        console.log(evt);
//        assert.notOk(evt.detail.result, "Продажа прошла" );
//        done();
//        window.removeEventListener("go", listener);
//    }
//
//    window.addEventListener("go", listener);
//});

QUnit.test("Продажа со скидкой к каждому товару", function( assert ) {
    var done = assert.async();

    var order = {
        items: [{
            department: "2",
            code: "323",
            discount: "15",
            quantity: "3",
            cost: "16",
            measure: "КГ",
            caption: "Огурцы",
            discount_type: 0
        },{
            department: "2",
            code: "612",
            discount: "40",
            quantity: "2",
            cost: "200",
            measure: "штук",
            caption: "Вино Al Donello",
            discount_type: 0
        }],
        money : "5000"
    };

    var event = {
        evtDest : "go",
        data : {
            alias : deviceAlias,
            method : "sell",
            params : order
        }
    };

    console.log("apimsg:" + JSON.stringify(event));

    var listener = function(evt){
        console.log(evt);
        assert.notOk(evt.detail.result, "Продажа прошла" );
        done();
        window.removeEventListener("go", listener);
    }

    window.addEventListener("go", listener);
});
//
//QUnit.test("Продажа (за бонусы)", function( assert ) {
//    var done = assert.async();
//
//    var order = {
//        items: [{
//            department: "2",
//            code: "62",
//            quantity: "2",
//            cost: "20",
//            measure: "штук",
//            caption: "Чай барбарисовый"
//        }],
//        money : "0",
//        total_discount: "40",
//        total_discount_type : 1
//    };
//
//    var event = {
//        evtDest : "go",
//        data : {
//            alias : deviceAlias,
//            method : "sell",
//            params : order
//        }
//    };
//
//    console.log("apimsg:" + JSON.stringify(event));
//
//    var listener = function(evt){
//        console.log(evt);
//        assert.notOk(evt.detail.result, "Продажа прошла" );
//        done();
//        window.removeEventListener("go", listener);
//    }
//
//    window.addEventListener("go", listener);
//});
//
//
//QUnit.test("Возврат товара", function( assert ) {
//    var done = assert.async();
//
//    var order = {
//        items: [{
//            department: "2",
//            code: "323",
//            discount: "15",
//            quantity: "3",
//            cost: "16",
//            measure: "КГ",
//            caption: "Огурцы"
//        }]
//    };
//
//    var event = {
//        evtDest : "go",
//        data : {
//            alias : deviceAlias,
//            method : "refund",
//            params : order
//        }
//    };
//
//    console.log("apimsg:" + JSON.stringify(event));
//
//    var listener = function(evt) {
//        console.log(evt);
//        assert.notOk(evt.detail.result, "Возврат прошел" );
//        done();
//        window.removeEventListener("go", listener);
//    }
//
//    window.addEventListener("go", listener);
//});
//
//QUnit.test("Отчет X", function(assert){
//    var done = assert.async();
//
//    var event = {
//        evtDest : "go",
//        data : {
//            alias : deviceAlias,
//            method : "getCashierReport",
//            params : null
//        }
//    };
//
//    console.log("apimsg:" + JSON.stringify(event));
//
//    var listener = function(evt) {
//
//        console.log(evt);
//        assert.notOk(evt.detail.result, "Отчет Х" );
//        done();
//        window.removeEventListener("go", listener);
//    }
//
//    window.addEventListener("go", listener);
//});
//
//QUnit.test("Отчет X", function(assert){
//    var done = assert.async();
//
//    var event = {
//        evtDest : "go",
//        data : {
//            alias : deviceAlias,
//            method : "getSummaryReport",
//            params : null
//        }
//    };
//
//    console.log("apimsg:" + JSON.stringify(event));
//
//    var listener = function(evt) {
//        console.log(evt);
//        assert.notOk(evt.detail.result, "Отчет Х" );
//        done();
//        window.removeEventListener("go", listener);
//    }
//
//    window.addEventListener("go", listener);
//});
//
//QUnit.test("Закрытие смены", function( assert ) {
//    var done = assert.async();
//
//    var event = {
//        evtDest : "go",
//        data : {
//            alias : deviceAlias,
//            method : "closeSession",
//            params : null
//        }
//    };
//
//    console.log("apimsg:" + JSON.stringify(event));
//
//    var listener = function(evt) {
//        console.log(evt);
//        assert.notOk(evt.detail.result, "Смена закрыта" );
//        done();
//        window.removeEventListener("go", listener);
//    }
//
//    window.addEventListener("go", listener);
//});

