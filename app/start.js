chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('start.html', {
    minWidth : 1024,
    minHeight: 768,
    //state: "fullscreen",
    id: "4RPOS"
  });
});
