require(['AppAPI', 'webview', 'DeviceHandler', 'apiEvents'], function(AppAPI, webview, devhandler, apiEvents) {
        webview.addEventListener('contentload', function() {
            setTimeout(function() {
                //AppAPI(JSON.stringify({login:"AdminZapadniy", pass:"AdminZapadniy"}), 'autologin');
                console.log("test ok!");
            }, 1000);
        });
    });
