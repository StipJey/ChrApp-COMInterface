define('Mercury315', ['../libs/Connection', 'AppAPI'], function (Connection, appMsg) {
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
        appMsg(parseInt(a), 'setWeight');
    };
    this.get_weight = function(){
        var bytes = new Uint8Array(1);
        bytes[0] = 3;
        current_buffer = [];
        this.connection.send(bytes.buffer);
    };
    Connection.bind(this)();
    this.connection.recieveHandler = this.rHandler;
    
});