define('Connection', ['../libs/SerialConnection'], function (SerialConnection) {
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

    return this;
    
    //this.getPorts = function() {
    //    this.connection.getDevices(function(ports) {
    //        var dropDown = document.querySelector('#port_list');
    //        dropDown.innerHTML = "";
    //        ports.forEach(function (port) {
    //            var newOption = document.createElement("option");
    //            newOption.text = port.path;
    //            newOption.value = port.path;
    //            dropDown.appendChild(newOption);
    //        });
    //        for (var counter = 0; counter < 2; counter++ ){
    //            var newOption = document.createElement("option");
    //            newOption.text = "ASUS COM" + counter;
    //            newOption.value = "/dev/ttyS" + counter;
    //            dropDown.appendChild(newOption);
    //        }
    //    });
    //};
});