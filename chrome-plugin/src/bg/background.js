var logUrl = 'http://localhost:9000/logs'


chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("User performed- "+ request.userAction);
  chrome.tabs.query({
      'active': true,
      'currentWindow': true
      }, function(tabs) {
        var url = tabs[0].url;
        var data = {
          action: request.userAction,
          target: url
      }
      axios.post(logUrl, data);
   });
    return true;
});