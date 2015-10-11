console.log("Init popup");

var app = angular.module('ImageApp', [ 'ngRoute', 'ui.bootstrap', 'ImageGrid', 'ImagePicker' ]);

app.config([ '$routeProvider', function($routeProvider) {
    $routeProvider.when('/image-picker', {
        templateUrl : '../core/modules/image-picker.html',
        controller : 'ImagePickerCtrl'
    }).otherwise({
        redirectTo : '/image-picker'
    });
} ]);

app.config(['$compileProvider',
            function ($compileProvider) {
                $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|chrome-extension):/);
            }]);

app.controller('HomeCtrl', [ '$scope', '$rootScope', '$log', 'ImageService', HomeCtrl ]);

function HomeCtrl($scope, $rootScope, $log, imgSvc) {

    console.log("Init HomeController");

    // Init
    imgSvc.clear();

    // Init ImagePicker
    var containers = imgSvc.getContainers();
    containers.push(new Container("Deleted", 56, ""));
    containers.push(new Container("Good", 57, ""));
    
    var settings = imgSvc.getSettings();
    settings.webRoot = chrome.extension.getURL("core");
    console.log("Web Root path: %s", settings.webRoot);

    // Setup listener
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        console.log("Received images: %d from %O", message.images.length, sender.tab);
        imgSvc.addImages(message.images);
        $rootScope.$broadcast('ImageUpdated')
    });
    
    console.log('injecting...');
    chrome.tabs.getCurrent(function(tab) {

        chrome.tabs.executeScript(tab.openerTabId, {
            file : 'core/js/model.js',
            allFrames : true
        });

        chrome.tabs.executeScript(tab.openerTabId, {
            file : 'google-chrome/send_images.js',
            allFrames : true
        });

        console.log("injected send_images.js");
    });
}
