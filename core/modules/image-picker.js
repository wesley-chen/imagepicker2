(function() {

    var imagePickerModule = angular.module('ImagePicker', [ 'ui.bootstrap', 'ngStorage', 'ImageGrid' ]);

    // services
    imagePickerModule.service('ImageService', function() {

        var imageList = [];

        var addImage = function(img) {
            imageList.push(img);
        };

        var addImages = function(images) {
            Array.prototype.push.apply(imageList, images);
        };

        var getImages = function() {
            return imageList;
        };
        
        var containers = [];
        var getContainers = function() {
            return containers;
        };
        
        var clear = function() {
            imageList.splice(0, imageList.length);
            containers.splice(0, containers.length);
        };
        
        var settings = {
                "showCaption" : true,
                "widthMode" : "Small",
                "webRoot": ""    
        }
        var getSettings = function() {
            return settings;
        };
        
        return {
            addImage : addImage,
            addImages : addImages,
            clear : clear,
            getImages : getImages,
            getContainers : getContainers,
            getSettings : getSettings
        };

    });

    // controllers
    imagePickerModule.controller('ImagePickerCtrl', [ '$scope', '$log', '$localStorage', 'ImageService', ImagePickerCtrl ]);

    function ImagePickerCtrl($scope, $log, $localStorage, $imageSvc) {

        console.log("Init ImagePickerCtrl");
        
        $scope.$on('ImageUpdated', function() {
            console.log("Before ImageUpdated, count=%d", $scope.images.length);
            refresh($scope);
            console.log("After ImageUpdated, count=%d", $scope.images.length);
        });
        
        
        angular.element(document).on("keypress", function(e) {
            var containers = $scope.containers;
            for ( var i in containers) {
                if (e.keyCode == 32) {// space
                    $scope.moveNext();
                }
            }
        });

        $scope.toggleFilterKeyword = function(filter, keyword) {
            console.log("toggleFilterKeyword");
            filter.onClickFunc(keyword);
            $scope.doFilter();
        };

        $scope.doFilter = function() {

            console.log("doFilter, filter count=%d", $scope.filters.length);
            console.log("doFilter, image count=%d", $scope.images.length);
            
            angular.forEach($scope.images, function(img) {
                var matched = true;
                var filters = $scope.filters;
                for ( var i in filters) {
                    if (filters[i].matchFunc(img) == false) {
                        console.log("matched");
                        matched = false;
                        break
                    }
                }
                img.visible = matched;
            });
        };

        // Init
        init($scope, $imageSvc);
        
        console.log("Init ImagePickerCtrl done!");
    }

    function init($scope, $imageSvc) {

        $scope.settings = $imageSvc.getSettings();
        $scope.containers = $imageSvc.getContainers();
        $scope.images = $imageSvc.getImages();
        
        $scope.filters = [];
        $scope.filters.push(createDomainFilter($scope.images));
        $scope.filters.push(createTypeFilter($scope.images));
        $scope.doFilter();
    }
    
    function refresh($scope) {
        
        $scope.filters = [];
        $scope.filters.push(createDomainFilter($scope.images));
        $scope.filters.push(createTypeFilter($scope.images));
        $scope.doFilter();
    }

})();