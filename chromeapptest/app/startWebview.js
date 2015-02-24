var webview = document.getElementById('webview');
webview.style.display = 'inline-block';
webview.style.position = 'absolute';
webview.style.height = '100%';
webview.style.width = '100%';
webview.style.top = '50px';

var nextEvent = {
    DeviceType : null,
    Action : null
};
/*function setNextEvent(aDeviceType, anAction){
    nextEvent.DeviceType = aDeviceType;
    nextEvent.Action = anAction;
}

function getNextEvent(){
    var obj = {};
    obj.DeviceType = nextEvent.DeviceType;
    obj.Action = nextEvent.Action;
    nextEvent.DeviceType = null;
    nextEvent.Action = null;
    return obj;
}*/

webview.addEventListener('contentload', function() {
    //chrome.app.window.current().fullscreen();
    console.log('Guest page loaded');
    SendMsg("Ready?");
    webview.addEventListener('consolemessage', function(e) {
        var aMsg;
        console.log(e.message);
        if (/apimsg/.test(e.message)){
            console.log("Я тут");
            aMsg = JSON.parse(e.message.substr(7));
            webviewHandler(aMsg);
            console.log(aMsg);
        }
        
    });
});

function SendMsg(msg){
    webview.executeScript({code : 'window.dispatchEvent(new CustomEvent("FromPage", {detail: "' + msg + '"}))'});
}

var Module = {};

Module.scales = new Mercury315();

function Mercury315() {
    var SerialOptions = {
        bitrate : 4800,
        parityBit : "even",
        stopBits : "one"
      };
      
    this.connection = new SerialConnection(SerialOptions);
    this.connection.recieveHandler = this.set_weight;
    this.evtName = 'Mercury315';
    
    this.set_weight = function(buf){
        var bufView = new Uint8Array(buf);
        var a = "";
        for(var i = 5; i>=0; i--){
            a += bufView[i];
        }
        SendMsg(parseInt(a));
    };
    this.get_weight = function(){
        //setNextEvent("scales", "set_weight");
        var bytes = new Uint8Array(1);
        bytes[0] = 3;
        this.connection.send(bytes.buffer);
    };
}


function webviewHandler(aMsg){
    Module[aMsg.DeviceType][aMsg.Action](aMsg.Data);
}



//
//
//function CommonProcessor(aModules) {
//    this.evtName = 'cmn';
//    this.processAppMessage = function(aData) {
//
//        //нужно весы подключить
//        aModules.newModule(modName);
//    };
//}
//
//new (function ChromeHandler() {
//    var modules = {};
//    var ModulesFunc = getSettings();
//    ModulesFunc.CommonProcessor = CommonProcessor;
//    /*{
//        CommonProcessor :   CommonProcessor,
//        MercuryT100 :   MercuryT100
//    };*/
//    /*
//     * Весы, принтер чеков
//     */
//    
//    this.newModule = function(aModuleName) {
//        var newMod = new ModulesFunc[aModuleName](this);
//    }.bind(this);
//    
//    this.processMsg = function(aMsg) {
//        if (modules[aMsg.evtName]) {
//            modules[aMsg.evtName].processAppMessage(aMsg.evtData);
//        } else {
//            //Error handler
//        }
//    };
//    
//    this.newModule('CommonProcessor');
//    this.consoleListener = new ConsoleListener(this);
//})();
//
//function ConsoleListener(handler) {
//    function readConsoleMessage(aMSG) {
//        //check for tag and parse JSON
//    }
//    
//    this.getMessage = function(aMsgData) {
//        handler.processMsg(aMsgData);
//    };
//}