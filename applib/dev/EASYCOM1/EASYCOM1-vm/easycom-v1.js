angularApp.directive("ngEasycom", ['api', '$timeout', '$log', '$sce', function(api, $timeout, $log, $sce) {
    return {
        templateUrl: "../applib/dev/EASYCOM1/EASYCOM1-view/easycom.htm?" + Date.now(), //TODO: Remove for production?
        scope: {
            who: "@",
            allow: "@",
            disallow: "@"
        },
        require: '^ngLegacyContainer',
        link: function(scope, element, attrs, legacyContainer) {

            // Panel maximization
            scope.ismaximized = true;
            scope.maximize = function(up) {
                scope.ismaximized = up;
            }
            scope.maximized = function() {
                return scope.ismaximized;
            }
            // removes spaces and makes lowercase
            scope.roleNamesAsVars = function (myvar) {
                newName = myvar.split(' ').join('');
                newName = newName.toLowerCase();
                return newName;
            };

            // Role multi select

            // needs to be generated from client.roles
            // scope.rolesList = [];
            
            scope.users = {};
            scope.users.selected = {};

            // scope.user.rolesList = [];
           

            // scope.selectedUser = {};
            // scope.selectedUser.selected = [
            //     // {user_id:'AAarif'}
            // ];

            // scope.filterValues = function(role) {
            //     return (scope.user.rolesList.indexOf(role.name) !== -1);
            // };

            // scope.filterRoles = [];
            // scope.showUsers = function (userId) {
                
                // scope.user.rolesList.forEach(function() {
                    // $log.log(scope.user.rolesList);
                    // myVal = value['name'];
                    // scope.filterRoles.push(myVal);
                    // return scope.filterRoles;
                // });
                // $log.log(scope.filterRoles);

            // };  
            
            // scope.currentList = "";

            // Allow string
            scope.allowString = {};
            scope.scrubAllowString = function (userId) {
                scope.tempArray = [];
                scope.users.selected.forEach(function(value) {
                    myVal = value['user_id'];
                    scope.tempArray.push(myVal);
                    // $log.log(scope.tempArray);
                    return scope.tempArray;
                });
                newString = scope.tempArray.join();
                newString = userId + "/" + newString + "/";
                // $log.log(newString);
                return newString;
            };

            // $log.log(scope.client.userlist);

            /////////////////
            // AED functions
            /////////////////
            scope.table = {};
            // Add row
            scope.addNewRow = function () {
                // alert("add");
                // scope.table.records.push({scope.table.records.length-1,"","//","notification","#333333","#ffffff","","",me.client});
                $log.log("row added");
                // scope.save();
            }

            // Edit row
            scope.editThisRow = function (idx) {
                $log.log("edit row: " + idx);
                
            }

            // Delete row
            scope.deleteThisRow = function (index) {
                api.doJS({
                    lib: "editor",
                    cmd: "deletedataview",
                    dataview: scope.dataview,
                    allow: scope.allow,
                    disallow: scope.disallow,
                    table: scope.table,
                    record: scope.table.records[index]
                },"POST",true).then(function (json) {
                    if (json.saved) {
                        alert("debug: Record Deleted");
                        scope.$apply(function () {
                            scope.table.records.splice(index, 1);
                            // if (scope.footer_tablesum) updatetablesum();
                        });
                    }
                });
            }
            scope.save = function () {
                scope.showeditor = scope.showeditor; //So scope is visible in the debugger, for now.
                api.postJS({
                    lib: "editor",
                    cmd: "savedataview",
                    dataview: scope.dataview,
                    allow: scope.allow,
                    disallow: scope.disallow,
                    table: scope.table
                }).then(function (json) {
                    if (json.saved) {
                        alert("Table Saved");
                    }
                });
            }
            ////////////////////
            // end AED functions
            ////////////////////

            scope.getHtml = function(html) {
                return $sce.trustAsHtml(html);
            };

            // Testing utility function
            scope.returnIndex = function (idx) {
                scope.activeIndex = idx;
            }

            

            api.getJS({
                lib: "editor", //TODO: Which lib?
                cmd: "loaddataview",
                dataview: "DBS:easycom",
                allow: scope.allow,
                disallow: scope.disallow
            }).then(function(json) {
                scope.$apply(function() {
                    scope.showtable = json.allowed;
                    scope.table = json.table;
                });
            });

            api.getClient({
                who: scope.who,
                members: ["users", "roles"]
                ,restrictusers: 50 //Chris - This restricts the # of users returned to make debugging bearable, remove member for production.
            }).then(function(json) {
                scope.$apply(function() {
                    scope.client = json.client;
					// scope.rolesList = scope.client.roles;
					// scope.role.selected = scope.client.roles;
                    // scope.users = scope.client.userlist;
                    // scope.user.selected = scope.client.userlist;
                });
            });
            // scope.saveTable ($index) {}
            if (false) { //Save function, will need testing. Turn this into a Save All function
                // scope.table.records[scope.activeindewx]
                //if adding, scope.activeIndex - 1
            /* save function:
                scope.table.record[] = sdfsdf */
                api.postJS({
                    lib: "editor",
                    cmd: "savedataviewclient",
                    dataview: "DBS:easycom",
                    allow: scope.allow,
                    disallow: scope.disallow,
                    records: scope.table.records
                }).then(function(json) {
                    if (json.saved) {
                    	
/*
api.getJS({
                lib: "editor", //TODO: Which lib?
                cmd: "loaddataview",
                dataview: "DBS:easycom",
                allow: scope.allow,
                disallow: scope.disallow
            }).then(function(json) {
                scope.$apply(function() {
                    scope.showtable = json.allowed;
                    scope.table = json.table;
                });
            });
*/
                    	   
                        scope.$apply(function() {
                            if (json.saved) alert("saved");
                        });
                        //alert("Record Saved");
                    }
                });
            }
        }
    }
}]);