define(function(){
    function DriversList (){
        var files = {
            "Mercury MS" : "../kkms/MercuryMS",
            "Mercury-315" : "../scales/Mercury315",
            "PosBank A7" : "../printers/PosBankA7",
            "CustomKubeII" : "../printers/CustomKubeII",
            "BigIITouch" : "../displays/BigIITouch",
            "Custom My-Printer" : "../printers/CustomMyPrinter"
        };

        this.getDevices = function(aCallback){
            var output = {
                scales      : {
                    display: "Весы",
                    values: [{
                        name: "none"
                    }]
                },
                printers    : {
                    display: "Чековый принтер",
                    values: [{
                        name: "none"
                    }]
                },
                displays    : {
                    display: "Дисплей покупателя",
                    values: [{
                        name: "none"
                    }]
                }
            };
            var count = 0;
            var length = 0;
            for (var name in files){
                length++;
            }
            for (var name in files){
                (function(deviceName, file){
                    require([file], function(dev){
                        var deviceType = dev.information.type;
                        output[deviceType].values.push({
                            name : deviceName,
                            settings : {
                                port : {
                                    display : "Порт",
                                    values : {}
                                },
                                alias : {
                                    display : "Псевдоним",
                                    values : (function (name) {
                                        name = name.replace(/\s+/g, '');
                                        var arr = [];
                                        for (var i = 1; i<10; i++) {
                                            arr.push(name + i);
                                        }
                                        return arr;
                                    })(deviceName)
                                },
                                bufferSize: {
                                    display : "Размер буфера",
                                    values : ["default", 4096]
                                },
                                bitrate: {
                                    display : "Битрейт",
                                    values : ["default", 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200]
                                },
                                dataBits: {
                                    display : "Биты данных",
                                    values : ["default", "seven", "eight"]
                                },
                                parityBit: {
                                    display : "Парность",
                                    values : ["default", "no", "odd", "even"]
                                },
                                stopBits: {
                                    display : "Стоп-биты",
                                    values : ["default", "one", "two"]
                                }
                            }
                        });
                        count++;
                        if (count == length){
                            aCallback(output);
                        }
                    });
                })(name, files[name])
            }
        };

        this.getFile = function(aName){
            for (var i in files){
                if (i == aName){
                    return files[i];
                }
            }
        };

    };

 
    return DriversList;
});