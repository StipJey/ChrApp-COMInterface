var deviceAlias = "scale";
//QUnit.config.autostart = false;

QUnit.test( "Подключение", function( assert ) {

    var done = assert.async();

    var event = {
        evtDest : "connectTo",
        data : {
            file : "../scales/Mercury315",
            alias : deviceAlias,
            port : "COM5"
        }
    };

    console.log("apimsg:" + JSON.stringify(event));

    window.addEventListener("connectTo", function(evt) {
        console.log(evt);
        assert.ok(evt.detail, "Подключено" );
        done();
    });
});

QUnit.test("Сброс тары", function(assert){
    var done = assert.async();

    var event = {
        evtDest : "go",
        data : {
            alias : deviceAlias,
            method : "resetTare",
            params : {}
        }
    };

    console.log("apimsg:" + JSON.stringify(event));

    var listener = function(evt){
        console.log(evt);
        assert.notOk(evt.detail.result, "Тара сброшена" );
        done();
        window.removeEventListener("go", listener);
    };

    window.addEventListener("go", listener);
});

QUnit.test("Установка цены", function(assert){
    var done = assert.async();

    var event = {
        evtDest : "go",
        data : {
            alias : deviceAlias,
            method : "setCost",
            params : "-)84.56"
        }
    };

    console.log("apimsg:" + JSON.stringify(event));

    var listener = function(evt){
        console.log(evt);
        assert.notOk(evt.detail.result, "Цена установлена" );
        done();
        window.removeEventListener("go", listener);
    };

    window.addEventListener("go", listener);
});

QUnit.test("Получаем вес", function(assert){
    var done = assert.async();

    var event = {
        evtDest : "go",
        data : {
            alias : deviceAlias,
            method : "getWeight",
            params : {}
        }
    };

    console.log("apimsg:" + JSON.stringify(event));

    var listener = function(evt){
        console.log(evt);
        assert.notOk(evt.detail.result, "Вес получен" );
        done();
        window.removeEventListener("go", listener);
    };

    window.addEventListener("go", listener);
});