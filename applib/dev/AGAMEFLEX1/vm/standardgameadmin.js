angularApp.directive("ngStandardGameAdmin", ['api', '$rootScope', function(api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/AGAMEFLEX1/view/standardGameAdmin.htm?' + Date.now(),
        scope: {
            assoc: "@",
            text: "@",
            details: "@",
            cid: "@",
            filters: "@",
            panel: "@",
            hidetopper: "@",
            toppertext: "@",
            includeheader: "@"
        },
        require: '^ngLegacyContainer',
        link: function(scope, element, attrs, legacyContainer) {
            scope.prefixInfo = a$.gup("prefix");            
            scope.baseGameUrl = window.location.protocol + "//" + window.location.hostname + "/3/ng/AgameFlex/userGameListing.aspx";
            
            scope.Initialize = function(callback) {  
            };

            scope.load = function() {
                scope.Initialize(function(){
                });

            };
            scope.load();
        }

    };
}]);