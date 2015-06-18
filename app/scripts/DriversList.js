define(function(){
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
                    weigth  :   {
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
    return Device;
});