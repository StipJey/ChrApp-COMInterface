const serial = chrome.serial;

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
  console.log(receiveInfo.data);
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
  serial.connect(path ? path : this.options.path, this.options, this.onConnectComplete.bind(this))
};

SerialConnection.prototype.send = function(bytes) {
  if (this.connectionId < 0) {
    throw 'Invalid connection';
  }
  
  serial.send(this.connectionId, bytes, function() {});
};

SerialConnection.prototype.disconnect = function() {
  if (this.connectionId < 0) {
    throw 'Invalid connection';
  }
};

//function SerialCon
//var connection = new SerialConnection(SerialOptions);
//
//connection.onConnect.addListener(function() {
//  console.log('connected...');
//  document.querySelector('#connect_box').style.display = 'none';
//  connection.send('"Ready"\n');
//});
//
//connection.onReadLine.addListener(function(line) {
//  console.log('read line: ' + line);
//});

// Populate the list of available devices
//connection.getDevices(function(ports) {
//  // get drop-down port selector
//  var dropDown = document.querySelector('#port_list');
//  // clear existing options
//  dropDown.innerHTML = "";
//  // add new options
//  ports.forEach(function (port) {
//    var displayName = port["displayName"] + "("+port.path+")";
//    if (!displayName) displayName = port.path;
//    
//    var newOption = document.createElement("option");
//    newOption.text = displayName;
//    newOption.value = port.path;
//    dropDown.appendChild(newOption);
//  });
//});

// Handle the 'Connect' button
//document.querySelector('#connect_button').addEventListener('click', function() {
//  // get the device to connect to
//  var dropDown = document.querySelector('#port_list');
//  var devicePath = dropDown.options[dropDown.selectedIndex].value;
//  // connect
//  console.log("Connecting to "+devicePath);
//  connection.connect(devicePath);
//});
