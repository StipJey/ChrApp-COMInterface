define(function(){
const serial = chrome.serial;
var bufferSize = 0;
var bufferLine;

var SerialConnection = function(aOptions) {
  this.options = aOptions;
  this.connectionId = -1;
  this.lineBuffer = "";
  this.boundOnReceive = this.onReceive.bind(this);
  this.boundOnReceiveError = this.onReceiveError.bind(this);
  this.onConnect = new chrome.Event();
  this.onReadLine = new chrome.Event();
  this.onError = new chrome.Event();
};

SerialConnection.prototype.onConnectComplete = function(connectionInfo) {
  if (!connectionInfo) {
    console.log("Connection failed.");
    return;
  }
  this.connectionId = connectionInfo.connectionId;
  serial.onReceive.addListener(this.boundOnReceive);
  serial.onReceiveError.addListener(this.boundOnReceiveError);
  this.onConnect.dispatch();
};

SerialConnection.prototype.onReceive = function(receiveInfo) {
  if (receiveInfo.connectionId !== this.connectionId) {
    return;
  }
  //console.log(receiveInfo);
  this.recieveHandler(receiveInfo.data);
};

SerialConnection.prototype.onReceiveError = function(errorInfo) {
  if (errorInfo.connectionId === this.connectionId) {
    this.onError.dispatch(errorInfo.error);
  }
};

SerialConnection.prototype.getDevices = function(callback) {
  serial.getDevices(callback);
};

SerialConnection.prototype.connect = function(path) {
  serial.connect(path ? path : this.options.path, this.options, this.onConnectComplete.bind(this));
};

SerialConnection.prototype.send = function(bytes) {
  if (this.connectionId < 0) {
    throw 'Invalid connection';
  }
  
  serial.send(this.connectionId, bytes, function (aInfo) {
    if (!aInfo.error && aData.length == aInfo.bytesSent) {
      //Success
    } else {
      //We can try resend data.
    }
  });
};

SerialConnection.prototype.disconnect = function() {
  if (this.connectionId < 0) {
    throw 'Invalid connection';
  }
};

return SerialConnection;
});