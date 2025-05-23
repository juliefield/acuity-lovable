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
            // renders the message back out to the UI as HTML
            scope.getHtml = function(html) {
                return $sce.trustAsHtml(html); // $sce needs to be in the directive at the top
            };
            // Testing utility function
            scope.returnIndex = function (idx) {
                scope.activeIndex = idx;
            }
            //Check to see if the given value has something set to it
            scope.hasNumValue = function (value) {
                "use strict";
                if (value != undefined && value != null) {
                    return true;
                }
                return false;
            }
            // Get the id of the last record based on highest number
            scope.returnLastId = function() {
                var records = scope.table.records;
                var recordLast = Math.max.apply(Math,records.map(function(o){return o.id;}))
                return recordLast;                
            }
            ////////////////////
            // AED functions
            ////////////////////
            
            
            scope.managementBaselineEdit = {};
            scope.currentEditIndex = undefined;
            scope.modeAdd = false;
            
            // Allow string build
            scope.buildAllowString = function () {
                scope.tempArray = [];
                scope.users.selected.forEach(function(value) {
                    myVal = value['user_id'];
                    scope.tempArray.push(myVal);
                    // $log.log(scope.tempArray);
                    return scope.tempArray;
                });
                newString = scope.tempArray.join();
                scope.managementBaselineEdit.Allow = scope.clientNumber + "/" + newString + "/";
                // $log.log(newString);
                return scope.managementBaselineEdit.Allow;

            };

            // Create Users array from selected Roles
            scope.buildUsers = function () {
                var masterArray = scope.users;
                var compareArray = scope.roles.selected;
                var tempArray = [];
                for (i=0; i<compareArray.length; i++) {
                    for (j=0; j<masterArray.length; j++) {
                        if (compareArray[i].name == masterArray[j].role) {
                            tempArray.push(masterArray[j]);
                        }
                    }
                }
                scope.users.selected = tempArray;
                scope.buildAllowString();
            }

            // Populate selected Users from parse Allow string
            scope.parseUsers = function () {
                var str = scope.managementBaselineEdit.Allow;
                var strt = str.indexOf("/") + 1;
                var lngth = str.lastIndexOf("/");
                var rtrn = str.slice(strt,lngth);
                var parsedUserArray = rtrn;
                if (parsedUserArray.includes(",")) {
                    parsedUserArray = parsedUserArray.split(",");
                } else {
                    parsedUserArray = [parsedUserArray];
                }                    
                
                var masterArray = scope.client.userlist;
                var compareArray = parsedUserArray;

                var tempArray = [];
                for (i = 0; i < compareArray.length; i++) {
                    for (j = 0; j < masterArray.length; j++) {
                        if (compareArray[i] == masterArray[j].user_id) {
                            tempArray.push(masterArray[j]);
                        }
                    }
                }
                scope.users.selected = tempArray; 
            }

            // Populate selected Roles from selected Users
            scope.popRoles = function() {
                var masterArray = scope.roles;
                var compareArray = scope.users.selected;

                var tempArray = [];
                for (i = 0; i < compareArray.length; i++) {
                    for (j = 0; j < masterArray.length; j++) {
                        if (compareArray[i].role == masterArray[j].name) {
                            tempArray.push(masterArray[j]);
                        }
                    }
                }
                scope.roles.selected = tempArray;
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

                if (scope.managementBaselineEdit.Allow != "") {                    
                    scope.parseUsers();
                    scope.popRoles();                   
                }
                // $log.log(scope.modeAdd);
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
                ,restrictusers: 50
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