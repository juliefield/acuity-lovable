// CONTROLLERS
angularApp.controller('legacyController', ['$scope', '$interval', '$http', 'legacy', 'hashtagnav', '$rootScope', 'api', function ($scope, $interval, $http, legacy, hashtagnav, $rootScope, api) {

    legacy.init($scope); //Sets TPO cookies, enforces authentication, calls legacy .ready if present (only for dashboard).

    //$scope.LOGGED_IN - is shared with the embedded login directive.
    //$scope.LOG_OUT - logs you out.

    window.onload = function (e) { //Fires once all directives are loaded.
        setTimeout(function () {
            if ($scope.LOGGED_IN()) {

                $scope.Heading = "Client/Department Add and Remove";

                
                api.getMe({ who: "ME", members: ["person"] }).then(function (json) {
                    $scope.$apply(function () {
                        $scope.me = json.me;
                    });
                });
                

                api.getJS({ lib: "agack", cmd: "getclientdept" }).then(function (json) {
                    $scope.$apply(function () {
                        $scope.json = json;
                    });
                });

                //Test Error: api.getJS({ lib: "utility", cmd: "throw" });

                /*$scope.json = {
                projects: [{
                id: 1,
                desc: "Early"
                },
                {
                id: 2,
                desc: "Late"
                }],
                clientdept: [{
                idproject: 1,
                desc: "4Change Energy"
                },
                {
                idproject: 2,
                desc: "Absolute Resolutions"
                }]
                }
                */

                $scope.filter = "";
                $scope.newclient = "";

                $scope.$watch("filter", function () {
                    $scope.lowerfilter = $scope.filter.toLowerCase();
                });

                $scope.filterchecked = function (string) {
                    string = string.toLowerCase();
                    if ($scope.lowerfilter.length == 0 || string.indexOf($scope.lowerfilter) >= 0) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }

                $scope.removeclient = function (index) {
                    if (confirm("Are you sure you want to delete " + $scope.json.clientdept[index].desc + "?")) {
                        deletedobj = $scope.json.clientdept[index];
                        $scope.json.clientdept.splice(index, 1);
                        api.getJS({ lib: "agack", cmd: "removeclientdept", deletedobj: deletedobj }).then(function (json) {
                            $scope.$apply(function () {
                                $scope.json = json;
                            });
                        });
                    }
                }

                $scope.addclient = function (newclient) {
                    if (newclient == "") {
                        return -1;
                    }
                    for (var i = 0; i < $scope.json.clientdept.length; i++) {
                        client = $scope.json.clientdept[i];
                        if (newclient == client.desc) {
                            alert(newclient + " already exists.");
                            return -1;
                        }
                    }
                    clientobj = {
                        idproject: $scope.selectedprojectid,
                        desc: newclient
                    }
                    if (confirm("Are you sure you want to add " + newclient + "?")) {
                        $scope.json.clientdept.push(clientobj);
                        api.getJS({ lib: "agack", cmd: "addclientdept", clientobj: clientobj }).then(function (json) {
                            $scope.$apply(function () {
                                $scope.json = json;
                            });
                        });
                    }
                }

            }
        }, 1000);
    };

} ]);

