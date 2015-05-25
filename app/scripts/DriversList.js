define(function(){
    this.Devices = {
        scale : {
            type : "scale", 
            type_rus : "Весы",
            drivers : {
                mercury315 : {
                    name :"Mercury 315",
                    file :"Mercury315" 
                }
            }
        },
        display : {
            type : "display", 
            type_rus : "Дисплей",
            drivers : {
                
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