/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
require(['webview', 'AppAPI'], function(webview, AppAPI) {
        webview.addEventListener('contentload', function() {
            setTimeout(function() {
                AppAPI('test', '123');
                console.log('Test ok!');
            }, 1000)
        });
    });


