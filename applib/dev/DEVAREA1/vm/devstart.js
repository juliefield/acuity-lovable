angularApp.directive("ngDevAreaStart", ['api', '$rootScope', function(api, $rootScope) {
return {
    templateUrl: a$.debugPrefix() + '/applib/dev/DEVAREA1/view/devstart.htm?' + Date.now(),
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
            
            $(".project-link-start").on("click", function(){
                $.cookie("entityMod","project");
            });
            $(".group-link-start").on("click", function(){
                $.cookie("entityMod","group");
            });
            $(".location-link-start").on("click", function(){
                $.cookie("entityMod","location");
            });
            $(".team-link-start").on("click", function(){
                $.cookie("entityMod","team");
            });
            $(".user-link-start").on("click", function(){
                $.cookie("entityMod","user");
            });

        };
        scope.load();
    }
};
}]);