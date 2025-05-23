angularApp.directive("ngEvalForm", ['api', '$rootScope', function(api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/EVALFORM1/view/evalform.htm?' + Date.now(),
        scope: {
            assoc: "@",
            text: "@",
            details: "@",
            cid: "@",
            filters: "@",
            panel: "@",
            hidetopper: "@",
            toppertext: "@"
        },
        require: '^ngLegacyContainer',
        link: function(scope, element, attrs, legacyContainer) {
    
            scope.Initialize = function() {
    
            };
    
    
            scope.load = function() {
                scope.Initialize();
                
            };
            scope.load();
        }
    };
    }]);