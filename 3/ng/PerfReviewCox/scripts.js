var angularApp = angular.module('angularApp', ['ngRoute']);

// configure our routes
angularApp.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'pages/list.html',
            controller  : 'listController'
        })

        // route for the about page
        .when('/list', {
            templateUrl : 'pages/list.html',
            controller  : 'listController'
        })

        // route for the contact page
        .when('/member', {
            templateUrl : 'pages/member.html',
            controller  : 'memberController'
        })
});

// CONTROLLERS
angularApp.controller('listController', ['$scope', '$http', 'api', '$log', '$filter', function ($scope, $http, api, $log, $filter) {
    $scope.title = "Performance Review List";
    window.onload = function (e) {
        $scope.Heading = "Cox Performance Review";
        /* WRITE THE APPLICATION HERE */
        api.getMe({
            who: "Me"
        })
            .then(function (json) {
                if (true) {
                    $scope.$evalAsync(function () {
                        $log.log(`json: ${JSON.stringify(json)}`);
                    });
                }
            });
    }
}]);

angularApp.controller('memberController', ['$scope', '$http', 'api', '$log', '$filter', function ($scope, $http, api, $log, $filter) {
    $scope.title = "Performance Review Member";
}]);