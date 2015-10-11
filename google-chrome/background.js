console.log("ImagePicker started.");

// Called when the user clicks on the browser action icon.
chrome.browserAction.onClicked.addListener(function(tab) {

    // Open ImagePicker UI
    var imagepicker_url = chrome.extension.getURL("google-chrome/popup.html");

    chrome.tabs.create({
        "url" : imagepicker_url,
        "openerTabId" : tab.id
    });
});
