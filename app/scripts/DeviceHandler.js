define(['settings', 'AppAPI'], function(settings, AppAPI){
    
    function scaleCallback(aData) {
        require(aData, function(scale){
            if (scale){
                document.addEventListener('getWeight', scale.get_weight);
            } else {
                document.addEventListener('getWeight', function(){
                    AppAPI("Весы не подключены");
                });
            }
        })
    };
    
    settings.getSettings('scale', scaleCallback);

});