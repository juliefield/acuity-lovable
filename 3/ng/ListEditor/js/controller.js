// CONTROLLERS
angularApp.controller('legacyController', ['$scope', '$interval', '$http', 'legacy', 'hashtagnav', '$rootScope', 'api', function ($scope, $interval, $http, legacy, hashtagnav, $rootScope, api) {

    legacy.init($scope); //Sets TPO cookies, enforces authentication, calls legacy .ready if present (only for dashboard).

    //$scope.LOGGED_IN - is shared with the embedded login directive.
    //$scope.LOG_OUT - logs you out.

    window.onload = function (e) { //Fires once all directives are loaded.
        setTimeout(function () {
            if ($scope.LOGGED_IN()) {

                $scope.Heading = "General List Editor";


                api.getMe({ who: "ME", members: ["person"] }).then(function (json) {
                    $scope.$apply(function () {
                        $scope.me = json.me;
                    });
                });


                $scope.columnlist = [];
                $scope.json = {};
                $scope.json.table = {};

                api.getJS({ lib: "agack", cmd: "getDASFileTypes" }).then(function (json) {
                    $scope.$apply(function () {
                        $scope.json.filetypes = json.filetypes;
                    });
                });

                $scope.getData = function () {
                    api.getJS({ lib: "editor", cmd: "loaddataview", dataview: "DAS:" + $scope.selectedfiletype.filetype }).then(function (json) {
                        $scope.resetValue();
                        $scope.json.table = json.table;
                        for (index in $scope.json.table.columns) {
                            column = $scope.json.table.columns[index];
                            if (column.display == "Y") {
                                if (column.systemfield != "") {
                                    $scope.columnlist.push(column.name);
                                    column.displayname = column.systemfield;
                                }
                                else {
                                    $scope.columnlist.push(column.name);
                                    column.displayname = column.name;
                                }
                            }
                        }
                        $scope.$apply();
                    });
                }




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
                
                $scope.json = {
                table: {
                columns: [
                { name: "id", systemfield: "identity", display: "N", editable: "N" },
                { name: "Index", dscid: 2638, systemfield: "userid", display: "Y", editable: "N" },
                { name: "LETTER_NUMBER", dscid: 2636, systemfield: "", display: "Y", editable: "Y" }
                ],
                records: [
                { id: "2", Index: "ORPHAN", LETTER_NUMBER: "ML544", GHP_NGHP: "NGHP", LETTER_TYPE: "Cannot Identify Beneficiary" },
                { id: "3", Index: "ORPHAN", LETTER_NUMBER: "ML519", GHP_NGHP: "NGHP", LETTER_TYPE: "Invalid Letter of Authority" }
                ]
                }

                }
                */

                $scope.filter = "";
                $scope.selectedfiletype = "";
                $scope.selectedrecord = "";
                $scope.selectedproperty = "";
                $scope.selectedvalue = "";
                $scope.newvalue = "";

                $scope.styleSelected = function (record, property) {
                    if (record == $scope.selectedrecord && property == $scope.selectedproperty) {
                        return {
                            "border-color": "#1a73e8",
                            "border-width": "2px"
                        };
                    }
                    else {
                        return {
                            "border-width": "1px"
                        };
                    }
                }

                $scope.findProperties = function (record) {
                    return Object.keys(record);
                }

                $scope.selectValue = function (record, property) {
                    $scope.selectedrecord = record;
                    $scope.selectedproperty = property;
                    $scope.selectedvalue = record[property];
                    $scope.newvalue = $scope.selectedvalue;
                }

                $scope.changeValue = function () {
                    if ($scope.newvalue == "") {
                        alert("Please enter a new value.");
                        return;
                    }
                    if ($scope.newvalue == $scope.selectedvalue) {
                        return;
                    }
                    for (index in $scope.json.table.records) {
                        record = $scope.json.table.records[index];
                        if (record == $scope.selectedrecord) {
                            for (index2 in $scope.findProperties(record)) {
                                property = $scope.findProperties(record)[index2];
                                if (property == $scope.selectedproperty) {
                                    $scope.json.table.records[index][property] = $scope.newvalue;
                                    $scope.selectedvalue = $scope.newvalue;
                                    $scope.resetValue();
                                }
                            }
                        }
                    }
                }

                $scope.dynamicValue = function (record, property) {
                    if (record == $scope.selectedrecord && property == $scope.selectedproperty) {
                        return $scope.newvalue;
                    }
                    else {
                        return record[property];
                    }
                }

                $scope.resetValue = function () {
                    $scope.newvalue = $scope.selectedvalue;
                    $scope.selectedvalue = "";
                    $scope.selectedrecord = "";
                    $scope.selectedproperty = "";
                }

                $scope.checkKeyPressed = function ($event) {
                    var keyCode = $event.which || $event.keyCode;
                    if (keyCode === 13) {
                        $scope.changeValue();
                    }
                    if (keyCode === 27) {
                        $scope.resetValue();
                    }
                }

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

