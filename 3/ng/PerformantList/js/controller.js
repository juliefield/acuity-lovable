// CONTROLLERS
angularApp.controller('legacyController', ['$scope', '$interval', '$http', 'legacy', 'hashtagnav', '$rootScope', 'api', function ($scope, $interval, $http, legacy, hashtagnav, $rootScope, api) {

    legacy.init($scope); //Sets TPO cookies, enforces authentication, calls legacy .ready if present (only for dashboard).

    //$scope.LOGGED_IN - is shared with the embedded login directive.
    //$scope.LOG_OUT - logs you out.

    window.onload = function (e) { //Fires once all directives are loaded.
        setTimeout(function () {
            if ($scope.LOGGED_IN()) {

                $scope.Heading = "Performant List Editor";


                api.getMe({ who: "ME", members: ["person"] }).then(function (json) {
                    $scope.$apply(function () {
                        $scope.me = json.me;
                    });
                });


                api.getJS({ lib: "agack", cmd: "getperformantletters" }).then(function (json) {
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
                    $scope.lowerfilter = $scope.filter.toString().toLowerCase();
                });

                $scope.filterchecked = function (string) {
                    string = string.toString().toLowerCase();
                    if ($scope.lowerfilter.length == 0 || string.indexOf($scope.lowerfilter) >= 0) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }

                $scope.removeletter = function (index) {
                    if (confirm("Are you sure you want to delete " + $scope.json.letters[index].letterid + "?")) {
                        deletedobj = {
                            idlist: $scope.json.letters[index].idlist,
                            letterid: $scope.json.letters[index].letterid
                        } 
                        $scope.json.letters.splice(index, 1);
                        api.getJS({ lib: "agack", cmd: "removeperformantletter", deletedobj: deletedobj }).then(function (json) {

                        });
                    }
                }

                $scope.addletter = function () {
                    var newletterid = $scope.newletterid;
                    var newlettername = $scope.newlettername;
                    if (newletterid == "" || newlettername == "" || $scope.selectedlistid == "") {
                        return -1;
                    }
                    for (var i = 0; i < $scope.json.letters.length; i++) {
                        letter = $scope.json.letters[i];
                        if (newletterid == letter.letterid) {
                            alert(newletterid + " already exists.");
                            return -1;
                        }
                    }
                    letterobj = {
                        idlist: $scope.selectedlistid,
                        letterid: newletterid,
                        lettername: newlettername
                    }
                    if (confirm("Are you sure you want to add " + newlettername + "?")) {
                        $scope.json.letters.push(letterobj);
                        api.getJS({ lib: "agack", cmd: "addperformantletter", letterobj: letterobj }).then(function (json) {

                        });
                    }
                }

            }
        }, 1000);
    };

} ]);

