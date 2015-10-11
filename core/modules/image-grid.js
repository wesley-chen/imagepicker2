(function() {
	
	var imageGridModule = angular.module('ImageGrid', []);
	imageGridModule.directive('imageGrid', function($location, $anchorScroll) {  
	    return {  
	        restrict: 'A', 
	        scope: {  
	        	images: '=gridData',
	        	settings: '=gridSetting',
	        },
	        controller: function($scope, $element){
	        	
	        	$scope.currentIdx = -1;
	        	$scope.currentImage = null;
	        	
	        	angular.element(document).on("keypress", function(e){
	        		if(e.keyCode == 32) {// space 
	        			$scope.moveNext();
	        		}
	        	});
	        	
	        	$scope.moveNext = function() {
	        		var images = $scope.images;
	        		if(!images){
	        			return;
	        		}
	        			        		
	        		var startIdx = $scope.currentIdx;
	        		if(startIdx >= images.length-1){
	        			startIdx = -1;
	        		}
	        		
	        		for (var i = startIdx + 1; i < images.length; i++) {
						if(images[i].visible){
							$scope.moveTo(images[i], i, true);
							$scope.$apply();
							break;
						}
					}
	        	}
	        	
	        	$scope.moveTo = function(img, index, scroll) {
					$scope.currentIdx = index;
					$scope.currentImage = img;
					if(scroll && (index != -1)){
						$('html, body').animate({scrollTop: $("#imgbox-" + index).offset().top -  30}, 200);  
					}
	        	}
	        	
	        	$scope.changeWidth = function(widthMode) {
	        		//console.log('ok3' + $scope.settings.widthMode);
	        		var defaultWidth = 136;
	        		var width = defaultWidth;
	        		if (widthMode == "Small") {
	        			width = defaultWidth;
	        			var height = ($scope.settings.showCaption? width+20 : width);
	        			$scope.boxStyle = {"width": width+"px", "height": height+"px"};
	        		} else if (widthMode == "Middle") {
	        			width = defaultWidth * 2;
	        			var height = ($scope.settings.showCaption? width+20 : width);
	        			$scope.boxStyle =  {"width": width+"px", "height": height+"px"};
	        		} else if (widthMode == "FitWidth") {
	        			width = window.innerWidth - 20; //remove paddings
	        			$scope.boxStyle = {"width":  width+"px", "height": "100%"};
	        		} else if (widthMode == "100%") {
	        			$scope.boxStyle = {"width": "100%", "height": "100%"};
	        		}
	        		
	        		width = width - 10; //remove paddings
	        		angular.forEach($scope.images, function(img) {
	        			var imageRate = width / Math.max(img.width, img.height, 1);
	        			if (widthMode == "100%" || imageRate > 1) {
	        				imageRate = 1;
	        			}
	        			
	        			//sometimes, image is not load completed, width or height may is 0
	        			var imgWidth = Math.max(imageRate * img.width, 1);
	        			var imgHeight = Math.max(imageRate * img.height, 1);
	        			
	        			img.imgStyle= {"width": imgWidth+"px", "height": imgHeight+"px"};
	        		});
	        		
	        	};
        	
	        	$scope.$on('ImageUpdated', function() {
	        	    console.log("ImageUpdated, changeWidth" + $scope.settings.widthMode);
	        	    $scope.changeWidth($scope.settings.widthMode);
        	    });
	        	  
	        	
	        	$scope.$watch("images", function () {
	            	$scope.changeWidth($scope.settings.widthMode);
	        	});
	        	
	        	$scope.$watch("settings", function () {
	            	$scope.changeWidth($scope.settings.widthMode);
	        	});
	        },
	        
	        
	        templateUrl: '../core/modules/image-grid.html'
	    }
	});

})();