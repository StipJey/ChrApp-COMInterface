define(function() {
    var container = document.getElementById('body');
    var webviewElement = document.createElement('webview');
    webviewElement.id = 'webview';
    //webviewElement.src = 'http://localhost:8080/erpCafe/application-start.html';
    webviewElement.src = 'http://localhost:63342/app/test.html';
    container.appendChild(webviewElement);
    webviewElement.setAttribute('style', 'position: absolute; top: 10px; bottom: 0px; left: 0px; right: 0px; width: 100%;  height: 100%; ');
    return webviewElement;
});