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
            // renders the message back out to the UI as HTML
            scope.getHtml = function(html) {
                return $sce.trustAsHtml(html); // $sce needs to be in the directive at the top
            };

            // Selected Roles Array
            scope.buildRolesString = function(rowIndex) { 
                var str = scope.table.records[rowIndex].Allow;;
                var strt = str.indexOf("/") + 1;
                var lngth = str.lastIndexOf("/");
                var rtrn = str.slice(strt,lngth);
                var parsedUserArray = rtrn;
                if (parsedUserArray.includes(",")) {
                    parsedUserArray = parsedUserArray.split(",");
                } else {
                    parsedUserArray = [parsedUserArray];
                }
                return parsedUserArray;
            }

            scope.activeRoles = {};

            scope.getActiveRoles = function() {
                tempArray = [];
                $.each( scope.table.records, function( index, value ){
                    a = scope.table.records[index].Allow;
                    a = scope.getUserRole(a);
                    tempArray.push(a);                    
                });
                return tempArray;
            }

            scope.getAllRoles = function () {
                tempArray = [];
                $.each( scope.roles, function( index, value ){
                    a = scope.roles[index].name;
                    tempArray.push(a);                    
                });
                return tempArray;
            }

            scope.returnAvailableRoles = function() {
                var activeRoles = scope.getActiveRoles();
                var allRoles = scope.getAllRoles();
                var availableArray = [];
                availableArray = allRoles.filter( ( el ) => !activeRoles.includes( el ) );
                return availableArray;
            }
            
            scope.tableInit = function() {
                scope.activeRoles = scope.returnAvailableRoles();
            }

            ////////////////////
            // AED functions
            ////////////////////
            
            
            scope.managementBaselineEdit = {};
            scope.currentEditIndex = undefined;
            scope.modeAdd = false;
            
            // Allow string build
            scope.buildAllowString = function (obj) {
                newString = obj.join();
                scope.managementBaselineEdit.Allow = scope.clientNumber + "/" + newString + "/";
                return scope.managementBaselineEdit.Allow;
            };

            // Create Users array from selected Roles
            scope.buildUsers = function () {
                var masterArray = scope.users;
                var selectedRole = scope.roles.selected;
                
                var tempArray = [];
                for (i=0; i<masterArray.length; i++) {
                    if (selectedRole == masterArray[i].role) {
                        tempArray.push(masterArray[i].user_id);
                    }
                }
                scope.users.selected = tempArray;
                scope.buildAllowString(tempArray);
            }

            // Populate selected Users from parse Allow string
            scope.parseUsers = function (string) {
                var str = string;
                var strt = str.indexOf("/") + 1;
                var lngth = str.indexOf(",");
                var rtrn = str.slice(strt,lngth);
                var selectedRole = rtrn;

                return selectedRole;
            }

            // Get role from scope.users
            scope.getUserRole = function (string) {
                var userId = scope.parseUsers(string);
                var userList = scope.users;
                for (i=0; i<userList.length;i++) {
                    if (userId == userList[i].user_id) {
                        return userList[i].role;
                    }
                }
            }

            // addNewRow
            scope.addNewRow = function() {
                // 'use strict';
                scope.modeAdd = true;
                scope.newMessage = {
                    id: 0,  //Not relevant
                    Allow: '',
                    Disallow: '//',
                    Delivery: '',
                    Position: 'notification',
                    BackgroundColor: '#333333',
                    TextColor: '#ffffff',
                    Message: '<h1>Headline</h1><h2>Subheadline</h2>',
                    Notes: '',
                    client: scope.clientNumber
                };
                scope.table.records.push(scope.newMessage);
                scope.currentEditIndex = scope.table.records.length - 1; //Jeff Added
                scope.editRow(scope.currentEditIndex);
            }
            // end addNewRow

            // editRow
            scope.editRow = function (rowIndex) {
                // 'use strict';

                scope.currentEditIndex = rowIndex;

                scope.modeMessage = function () {
                    if (scope.modeAdd) {
                        return "Add Message";
                    } else {
                        return "Edit Message";
                    }
                }
                scope.tableInit();
                // Colors
                myBgColor = scope.table.records[rowIndex].BackgroundColor;
                myTextColor = scope.table.records[rowIndex].TextColor;
                $("#backgroundcolor").spectrum("set", myBgColor);
                $("#textcolor").spectrum("set", myTextColor);
                $("#messageText_ifr").contents().find("#editorPreview").css('background-color', myBgColor);
                $("#messageText_ifr").contents().find("#editorPreview").css('color', myTextColor);
                // Message
                myMessage = scope.table.records[rowIndex].Message;
                tinyMCE.get('messageText').setContent(myMessage);

                scope.managementBaselineEdit = angular.copy(scope.table.records[rowIndex]);

            }
            // end editRow

            // deleteRow
            scope.deleteRow = function (idx) {
                scope.table.records.splice(idx,1);
                scope.save();
                scope.endEdit();               
            }
            // end deleteRow

            scope.saveEditMessage = function () {
                // 'use strict';
                // background color
                scope.table.records[scope.currentEditIndex] = scope.managementBaselineEdit;
                bgClr = $("#backgroundcolor").spectrum("get");
                bgClr = bgClr.toHexString();
                scope.table.records[scope.currentEditIndex].BackgroundColor = bgClr;
                
                // text color
                txtClr = $("#textcolor").spectrum("get");
                txtClr = txtClr.toHexString();
                scope.table.records[scope.currentEditIndex].TextColor = txtClr;
                
                // message
                scope.table.records[scope.currentEditIndex].Message = tinyMCE.get("messageText").getContent();
                
                scope.save(); //Jeff f
                scope.endEdit();
            }

            scope.cancelEditMessage = function () {
                // 'use strict';
                
                if (scope.modeAdd) {
                    scope.deleteRow(scope.table.records.length-1);
                }
                scope.endEdit();
            }

            scope.endEdit = function () {
                scope.roles.selected = {};
                scope.modeAdd = false;
                $("#backgroundcolor").spectrum("set", '#333333'); // tie this hex back to the default
                $("#textcolor").spectrum("set", '#ffffff'); // tie this hex back to the default
                $("#messageText_ifr").contents().find("#editorPreview").css('background-color', '#333333');
                $("#messageText_ifr").contents().find("#editorPreview").css('color', '#ffffff');
                tinyMCE.get('messageText').setContent('');
                scope.managementBaselineEdit = {};
                scope.currentEditIndex = undefined;
            }
            ////////////////////
            // end AED functions
            ////////////////////
            
            // Save Table
            scope.save = function () {

								//scope.currentEditIndex = rowIndex;
                //scope.managementBaselineEdit 
            	
                api.postJS({
                    lib: "editor",
                    cmd: "savedataviewclient",
                    dataview: "DBS:easycom",
                    allow: scope.allow,
                    disallow: scope.disallow,
                    records: scope.table.records
                }).then(function(json) {
                    if (json.saved) {
                        scope.$apply(function() {
                            if (json.saved) $log.log("saved");
                        });
                        //alert("Record Saved");
                    }
                });
            }
            // end Save Table

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
                ,restrictusers: 200
            }).then(function(json) {
                scope.$apply(function() {
                    scope.client = json.client;
                    scope.users = scope.client.userlist;
                    scope.roles = scope.client.roles;
                    scope.clientNumber = scope.client.number;
                });
            });


            if (false) {
                api.postJS({
                    lib: "editor",
                    cmd: "savedataviewclient",
                    dataview: "DBS:easycom",
                    allow: scope.allow,
                    disallow: scope.disallow,
                    records: scope.table.records
                }).then(function(json) {
                    if (json.saved) {
                    	   
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