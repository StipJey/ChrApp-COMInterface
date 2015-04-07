/**
 * 
 * @author Alexey
 * @module
 */
define('AppAPI', ['webview'], function (webview) {
    var self = this, model = this.model;
    
    webview.addEventListener('consolemessage', function(e) {
        var aMsg;
        console.log(e.message);
        if (/apimsg/.test(e.message)){
            aMsg = JSON.parse(e.message.substr(7));
            modules[aMsg.DeviceType][aMsg.Action](aMsg.Data);
            console.log(aMsg);
        }
    });
    
    return function(msg, evtName){
        if (evtName){
            webview.executeScript({code : 'window.dispatchEvent(new CustomEvent("' + evtName +'", {detail: "' + msg + '"}))'});
        } else
            webview.executeScript({code : 'window.dispatchEvent(new CustomEvent("FromPage", {detail: "' + msg + '"}))'});
    }
});
