//Using innerhtml in a directive is complex (using transclude).
//I need a quick solution, so just putting a few cases into templates.
//The broadcast machinery should behave similarly.
angularApp.directive("ngChimeTrainingClass", ['api', '$rootScope', function (api,$rootScope) {
    return {
    	  template: '<div class="chime-training-class-wrapper">Chime Training Class Entry Form Here</div>',
        scope: {
        	assoc: "@",
            text1: "@",
            params1: "@",
            text2: "@",
            params2: "@"
        },
        link: function (scope, element, attrs, legacyContainer) {
            /*
        	scope.num = 1;
        	
        	scope.isactive = function(num) {
        		if (scope.num == num) {
        			return "active";
        		}
        		else {
        			return "";
        		}
        	}

        	scope.setactive = function (num) {
        		//alert("debug: broadcast params" + num + ": " + scope["params" + num]);
        		scope.num = num;
               $rootScope.$broadcast('paramsOverride', {
                	assoc: scope.assoc,
                	params: scope["params" + num]
                });

            }        
            */
        }
    }
} ]);

