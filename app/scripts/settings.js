define(['AppAPI'], function (AppAPI) {

    document.addEventListener('setSettings', function(aSettings){
        chrome.storage.local.set(aSettings);
    });
    
    document.addEventListener('getSettings', function(key){
        chrome.storage.local.get(key, function(data){
            AppAPI(JSON.stringify(data), 'getSettings');
        })
    });
    
    this.getSettings = function(key, callback){
        chrome.storage.local.get(key, function(data){
            callback(data);
        })
    };
    
    return this;
});