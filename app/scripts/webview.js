define('webview', function() {
    container = document.getElementById('body');
    var webviewElement = document.createElement('webview');
    webviewElement.id = 'webview';
    webviewElement.src = 'http://localhost:8080/erpCafe/application-start.html';
    container.appendChild(webviewElement);
    //webviewElement.setAttribute('style', 'position: absolute; top: 150px; bottom: 0px; left: 0px; right: 0px');
    return webviewElement;
});