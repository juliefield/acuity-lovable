// CONTROLLERS
angularApp.controller('legacyController', ['$scope', '$interval', '$http', 'legacy', 'hashtagnav', '$rootScope', 'api', function ($scope, $interval, $http, legacy, hashtagnav, $rootScope, api) {

   legacy.init($scope); //Sets TPO cookies, enforces authentication, calls legacy .ready if present (only for dashboard).

   //$scope.LOGGED_IN - is shared with the embedded login directive.
   //$scope.LOG_OUT - logs you out.

   window.onload = function (e) { //Fires once all directives are loaded.
       if ($scope.LOGGED_IN) {

           $scope.Heading = "My Team View";

           /* WRITE THE APPLICATION HERE */
           // For User Profile, it's all within the directive ng-user-profile.
           /*
           api.getMe({ who: "ME", members: ["person"] }).then(function (json) {
               $scope.$apply(function () {
                   $scope.me = json.me;
               });
           });
           */

           //Test Error: api.getJS({ lib: "utility", cmd: "throw" });           
       }
   };

} ]);

