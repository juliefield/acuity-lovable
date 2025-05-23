// CONTROLLERS
angularApp.controller('legacyController', ['$scope', '$interval', '$http', 'legacy', 'hashtagnav', '$rootScope', '$element', function ($scope, $interval, $http, legacy, hashtagnav, $rootScope, ele) {

    $scope.cidreload = $(ele).attr("cidreload");
    legacy.init($scope); //Sets TPO cookies, enforces authentication, calls legacy .ready if present (only for dashboard).

    //hashtagnav.init(); //Uses <.. class="nv" nv="hashtag1/sub1;default:hashtag">  to show/hide divs.

} ]);

// legacyController-specific DIRECTIVES

angularApp.directive("ngFilterSet", function () {
    return {
        templateUrl: "/applib/html/directives/filterset.htm",
        link: function ($scope, element, attrs) {
            // Trigger when number of children changes, including by directives like ng-repeat
            var watch = $scope.$watch(function () {
                return element.children().length;
            }, function () {
                // Wait for templates to render
                $scope.$evalAsync(function () {
                    // Finally, directives are evaluated
                    $scope.readyFilterSet = true; //LEGACY
                });
            });
        }
    }
});

// TESTS (Leave these in, there's markup in the app that requires these).

angularApp.controller('helloworldController', ['$scope', function ($scope) {
    $scope.name = 'Jeff Gack';
} ]);


angularApp.controller('headerController', ['$scope', function ($scope) {

    //$scope.name = 'Chat test';


} ]);


angularApp.controller('subtestController', ['$scope', function ($scope) {

    $scope.name = 'My Subname';


} ]);