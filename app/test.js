var deviceAlias = "kkmka";
//QUnit.config.autostart = false;

QUnit.test( "Connect", function( assert ) {

    var done = assert.async();

    var event = {
        evtDest : "connectTo",
        data : {
            file : "../kkms/MercuryMS",
            alias : deviceAlias,
            port : "COM6"
        }
    };

    console.log("apimsg:" + JSON.stringify(event));

    setTimeout(function() {
        assert.ok( true, "Подключение" );
        done();
    }, 1000);

    window.addEventListener("connectTo", function(evt) {
        console.log(evt);
    });
});

QUnit.test( "Sell", function( assert ) {
    var done = assert.async();

    var order = {
        items: [{
            department: "2",
            code: "323",
            discount: "15",
            quantity: "3",
            cost: "16",
            measure: "КГ",
            caption: "Огурцы"
            ,
            discount_type: 1
        }],
        money : "1000"
        ,
        total_discount: "5",
        total_discount_type : 1
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

    window.addEventListener("go", function(evt) {
        console.log(evt);
        assert.notOk(evt.detail, "Продажа прошла" );
        done();
    });
});


QUnit.test( "Refund", function( assert ) {
    var done = assert.async();

    var order = {
        items: [{
            department: "2",
            code: "323",
            discount: "15",
            quantity: "3",
            cost: "16",
            measure: "КГ",
            caption: "Огурцы"
        }]
    };

    var event = {
        evtDest : "go",
        data : {
            alias : deviceAlias,
            method : "refund",
            params : order
        }
    };

    console.log("apimsg:" + JSON.stringify(event));

    window.addEventListener("go", function(evt) {
        console.log(evt);
        assert.notOk( evt.detail, "Возврат прошел" );
        done();
    });
});

