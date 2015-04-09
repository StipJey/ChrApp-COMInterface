require(['AppAPI', 'webview', 'DeviceHandler'], function(AppAPI, webview, devhandler) {
        webview.addEventListener('contentload', function() {
            setTimeout(function() {
                //AppAPI(JSON.stringify({login:"AdminZapadniy", pass:"AdminZapadniy"}), 'autologin');
                console.log("test ok!");
            }, 1000);
        });
    });
