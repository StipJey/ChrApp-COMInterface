    
function Settings() {
    
    this.setSettings = function(aSettings){
        chrome.storage.local.set(aSettings);
    };
    
    this.getSettings = function(){
        chrome.storage.local.get(function(data){
            appMsg(JSON.stringify(data));
        })
    };
}