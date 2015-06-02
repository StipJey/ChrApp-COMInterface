define(function(){
    this.Devices = {
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
    return this.Devices;
});