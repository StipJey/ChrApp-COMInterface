require(['AppAPI', 'webview', 'DeviceHandler', 'apiEvents'], function(AppAPI, webview, devhandler, apiEvents) {
        webview.addEventListener('contentload', function() {
            setTimeout(function() {
                //AppAPI(JSON.stringify({login:"pzapadmilk", pass:"barista"}), 'autologin');
                console.log("load ok!");
            }, 1000);
        });
    });
