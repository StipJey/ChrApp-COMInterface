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

webview.addEventListener('contentload', function() {
        console.log('Guest page loaded');
        webview.addEventListener('consolemessage', function(e) {
            var aMsg;
            console.log(e.message);
            if (/apimsg/.test(e.message)){
                aMsg = JSON.parse(e.message.substr(7));
                modules[aMsg.DeviceType][aMsg.Action](aMsg.Data);
                console.log(aMsg);
            }
        });
        try {
           /* if (!modules.scales.getOptions().devicePath){
                var dropDown = document.querySelector('#port_list');
                var devicePath = dropDown.options[dropDown.selectedIndex].value;
                chrome.storage.local.set({scale_port : devicePath});
                modules.scales.setSerialOptions({devicePath : devicePath});
            }
            modules.scales.connect();
            webview.style.top = '0px';*/
            document.getElementById('check_button').click();
            document.getElementById('connect_button').click();
        } catch(e) {
            console.log('Cannot initialize devices! Error: ' + e);
        }
    });

function appMsg(msg, evtName){
    if (evtName){
        webview.executeScript({code : 'window.dispatchEvent(new CustomEvent("' + evtName +'", {detail: "' + msg + '"}))'});
    } else
        webview.executeScript({code : 'window.dispatchEvent(new CustomEvent("FromPage", {detail: "' + msg + '"}))'});
}

function Connection() {
    this.connection = new SerialConnection(this.options.serialOptions);
    
    this.connect = function() {
        this.connection.connect(this.options.devicePath);
    };
    
    this.setSerialOptions = function(aOptions) {
        for (var j in aOptions)
            this.options[j] = aOptions[j];
    };
    
    this.getOptions = function() {
        return this.options;
    };
    
    this.getStoredOptions = function() {
        
    };
    
    this.saveCurrentOptions = function() {
        
    };
    
    this.getPortList = function(){
        this.connection.getDevices(function(ports) {
            for (var counter = 0; counter < 2; counter++ ){
                ports.push({path : "/dev/ttyS" + counter});
            }
            return ports;
        });
    };
    
    this.getPorts = function() {
        this.connection.getDevices(function(ports) {
            var dropDown = document.querySelector('#port_list');
            dropDown.innerHTML = "";
            ports.forEach(function (port) {
                var newOption = document.createElement("option");
                newOption.text = port.path;
                newOption.value = port.path;
                dropDown.appendChild(newOption);
            });
            for (var counter = 0; counter < 2; counter++ ){
                var newOption = document.createElement("option");
                newOption.text = "ASUS COM" + counter;
                newOption.value = "/dev/ttyS" + counter;
                dropDown.appendChild(newOption);
            }
        });
    };
}

var modules = {};

function Mercury315(aDevPath) {
    this.options = {
            serialOptions : {
                bitrate : 4800,
                parityBit : "even",
                stopBits : "one"
            }
        };
    
    var current_buffer = [];
    
    this.rHandler = function(buf){
        var bufView = new Uint8Array(buf);
        for (var i=0; i<bufView.length && current_buffer.length < 18; i++){
            current_buffer[current_buffer.length] = bufView[i];
        }
        if (current_buffer.length == 18)
            modules["scales"]["set_weight"](current_buffer);
    }
    this.set_weight = function(bufView){
        var a = "";
        for(var i = 5; i>=0; i--){
            a += bufView[i];
        }
        appMsg(parseInt(a));
    };
    this.get_weight = function(){
        var bytes = new Uint8Array(1);
        bytes[0] = 3;
        current_buffer = [];
        this.connection.send(bytes.buffer);
    };
    Connection.bind(this)();
    this.connection.recieveHandler = this.rHandler;
    
}

function CommonProcessor() {
    this.evtName = 'cmn';
    this.drivers = {
        scales  :   {
            display :   'Весы',
            drivers :   ['Mercury315']
        }
    };
    
    this.getDrivers = function() {
        appMsg(JSON.stringify(this.drivers));
    };
    
    this.addDevice = function(aDevType, aDevName) {
        try {
            var devDrv = null;
            switch (aDevName) {
                case 'Mercury315' : {
                    devDrv = new Mercury315();
                }
            }
            if (devDrv)
                modules[aDevType] = devDrv;
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    };
}

function Settings(){
    this.setSettings = function(aSettings){
        chrome.storage.local.set(aSettings);
    };
    this.getSettings = function(){
        chrome.storage.local.get(function(data){
            appMsg(JSON.stringify(data));
        })
    };
    this.getDevices = function(){
        var devices = {
            scales      :   {
                display : "Весы",
                values  : [{
                        name : "none"
                    }, {
                    name     :   "Mercury315",
                    settings :  {
                        port    :   {
                            display :   "Порт",
                            values  :   modules.scales.getPortList()
                        }
                    },
                    actions : [
                        {
                            display :   "Получить вес",
                            command :   "get_weight"
                        }
                    ]
                }]
            }
        }
        appMsg(JSON.stringify(devices), "setSetting");
    }
    
    Connection.bind(this)();
}

var cmn = new CommonProcessor();

chrome.app.runtime.onLaunched.addListener(function() {
    cmn.addDevice("main", "Settings");
})

document.querySelector('#check_button').addEventListener('click', function() {
    cmn.addDevice("scales", "Mercury315");
    chrome.storage.local.get(['scale_port'], function(data) {
        if (data.scale_port) {
            console.log("Port: ", data.scale_port);
            modules.scales.setSerialOptions({devicePath : data.scale_port});
        } else {
            modules.scales.getPorts();
            console.log("choose port");
        }    //modules.scales.getPorts();

    });
    //modules.scales.getPorts();
});

document.querySelector('#connect_button').addEventListener('click', function() {
    if (!modules.scales.getOptions().devicePath){
        var dropDown = document.querySelector('#port_list');
        var devicePath = dropDown.options[dropDown.selectedIndex].value;
        chrome.storage.local.set({scale_port : devicePath});
        modules.scales.setSerialOptions({devicePath : devicePath});
    }
    modules.scales.connect();
    webview.style.top = '0px';
    
});

document.querySelector('#reset_button').addEventListener('click', function() {
        chrome.storage.local.remove("scale_port");
});

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