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


                api.getJS({ lib: "agack", cmd: "getuserfilters" }).then(function (json) {
                    for (var u in json.users) {
                        json.users[u].filters = [];
                    }

                    for (var uf in json.userfilters) {
                        for (var u in json.users) {
                            if (json.userfilters[uf].user_id == json.users[u].user_id) {
                                json.users[u].filters.push({ id: json.userfilters[uf].filter_id, name: json.filters[json.userfilters[uf].filter_id - 1].filter_name });
                            }
                        }
                    }


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
                $scope.selectedrole = "";
                $scope.selecteduser = null;
                $scope.selectedattr = null;

                $scope.$watch("filter", function () {
                    $scope.lowerfilter = $scope.filter.toLowerCase();
                });

                $scope.filterchecked = function (string) {
                    if ($scope.lowerfilter == "") {
                        return true;
                    }
                    string = string.toLowerCase();
                    if ($scope.lowerfilter.length == 0 || string.indexOf($scope.lowerfilter) >= 0) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }

                $scope.selectuser = function (user) {
                    $scope.selecteduser = user;
                }

                $scope.showselecteduser = function () {
                    if ($scope.selecteduser == null) {
                        return;
                    }
                    return ($scope.selecteduser.firstnm + " " + $scope.selecteduser.lastnm + " (" + $scope.selecteduser.user_id + ")");
                }

                $scope.hasfilter = function (user, filter) {
                    for (var userfilter in user.filters) {
                        if (userfilter.id == filter.filter_id) {
                            return true;
                        }
                    }
                    return false;
                }

                $scope.convertfilterid = function (id) {
                    for (var filter in $scope.json.filters) {
                        console.log(filter.filter_name);
                        if (id == filter.filter_id) {
                            return filter.filter_name;
                        }
                    }
                }

                $scope.addattribute = function () {
                    if ($scope.selectedattr.filter_id == null) {
                        return;
                    }
                    if (!($scope.json.users[$scope.json.users.indexOf($scope.selecteduser)].filters.map(function (e) { return e.name; }).indexOf($scope.selectedattr.filter_name) >= 0)) {
                        $scope.json.users[$scope.json.users.indexOf($scope.selecteduser)].filters.push({ id: $scope.selectedattr.filter_id, name: $scope.selectedattr.filter_name });
                        api.getJS({ lib: "agack", cmd: "addattr", deletedobj: deletedobj }).then(function (json) {

                        });
                    }
                    $scope.selectedattr = { filter_name: null, filter_id: null };
                }

                $scope.deleteattribute = function (attribute) {
                    for (var i = 0; i < $scope.selecteduser.filters.length; i++) {
                        userattr = $scope.selecteduser.filters[i];
                        if (userattr.name == attribute.name) {
                            $scope.selecteduser.filters.splice(i, 1);
                            api.getJS({ lib: "agack", cmd: "removeattr", deletedobj: deletedobj }).then(function (json) {

                            });
                        }
                    }
                }

                $scope.checkattribute = function (attribute) {
                    if (attribute.filter_id == null) {
                        return false;
                    }
                    for (var i = 0; i < $scope.selecteduser.filters.length; i++) {
                        userattr = $scope.selecteduser.filters[i];
                        if (userattr.name == attribute.filter_name) {
                            return false;
                        }
                    }
                    return true;
                }

            }
        }, 1000);
    };

} ]);

