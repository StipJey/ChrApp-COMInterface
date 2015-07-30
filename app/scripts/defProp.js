var cd = new function() {
    var b = 100;
    this.c = 50;
    Object.defineProperty(this, "b", {
        get: function() {
            return b+10;
        },
        set:function(newVal) {
            b = newVal;
        }
    });
}


cd.b = 245;
alert(cd.b);