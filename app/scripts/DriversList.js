define(function(){



    function DriversList (){
        var files = {
            "Mercury MS" : "../kkms/MercuryMS",
            "Mercury-315" : "../scales/Mercury315"
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

    var Device = {
        scales      :   {
            display : "Весы",
            values  : [{
                name : "none"
            }, {
                name     :   "Mercury-315",
                file     :   "../scales/Mercury315",
                settings :  {
                    port    :   {
                        display :   "Порт",
                        values  :   {}
                    },
                    alias : {
                        display : "Псевдоним",
                        values : ["MercuryScale1","MercuryScale2","MercuryScale3","MercuryScale4"]
                    }
                },
                actions : [
                    {
                        display :   "Тест",
                        command :   "test"
                    }
                ]
            }, {
                name     :   "SuperScale",
                settings :  {
                    port    :   {
                        display :   "Порт",
                        values  :   {}
                    },
                    alias : {
                        display : "Псевдоним",
                        values : ["SuperScale1","SuperScale2","SuperScale3","SuperScale4"]
                    },
                    weight  :   {
                        display : "Диапазон веса",
                        values  : ["--", "0-20", "20-50", "50-150"]}
                }
            }]
        },
        printers    :   {
            display : "Чековый принтер",
            values  : [{
                name : "none"
            }, {
                name     :   "Mercury MS",
                file     :   "../kkms/MercuryMS",
                settings :  {
                    port    :   {
                        display :   "Порт",
                        values  :   {}
                    },
                    alias : {
                        display : "Псевдоним",
                        values : ["MercuryMS1","MercuryMS2","MercuryMS3","MercuryMS4"]
                    }
                }
            }
            ]
        }
    };



    var Devices = {
        scale : {
            type : "scale", 
            type_rus : "Весы",
            drivers : {
                mercury315 : {
                    name :"Mercury 315",
                    file :"../scales/Mercury315"
                }
            }
        },
        display : {
            type : "display", 
            type_rus : "Дисплей",
            drivers : {
                
            }
        },
        kkm : {
            type : "kkm",
            type_rus : "Контрольно-кассовая машина",
            drivers :{
                mercuryMS : {
                    name : "Mercury MS",
                    file : "../kkms/MercuryMS"
                }
            }
        },
        printer: {
            type : "printer", 
            type_rus : "Принтер",
            drivers :{
                
            }
        }
    };
    return DriversList;
});