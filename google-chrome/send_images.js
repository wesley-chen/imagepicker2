console.log("Collecting images...");

var imageElements = [].slice.apply(document.getElementsByTagName('img'));

// Convert to ImageInfo model
var images = [];
var guid = (new Date()).getTime();
for (var i = 0; i < imageElements.length; i++) {
    var imgElement = imageElements[i];
    var offsetTop = 0;
    // var top = imgElement.getBoundingClientRect().top + document.documentElement.scrollTop;

    var image = new ImageInfo(guid++, imgElement, offsetTop);
    images.push(image);
}

if (images.length > 0) {
    console.log("Sending (%d) images...", images.length);
    chrome.runtime.sendMessage({
        "images" : images,
        "title" : document.title
    });
}