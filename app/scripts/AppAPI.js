define(['webview'], function (webview) {
    var self = this, model = this.model;
    
    webview.addEventListener('consolemessage', function(e) {
        var aMsg;
        console.log(e.message);
        if (/apimsg/.test(e.message)){
            aMsg = JSON.parse(e.message.substr(7));
            var evt = new CustomEvent(aMsg.evtDest, {detail : aMsg.data});
            document.dispatchEvent(evt);
        }
    });

    function dispatchWebviewEvent(msg, evtName){
        if (typeof (msg) != 'string'){
            msg = JSON.stringify(msg);
        }
        if (evtName){
            console.log(msg);
            webview.executeScript({code : 'window.dispatchEvent(new CustomEvent("' + evtName +'", {detail: ' + msg + '}))'});
        } else {
            console.log(msg);
            webview.executeScript({code: 'window.dispatchEvent(new CustomEvent("Error", {detail: "' + msg + '"}))'});
        }
    }
    
    return dispatchWebviewEvent;
});
