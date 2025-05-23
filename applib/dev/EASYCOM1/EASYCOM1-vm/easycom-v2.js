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
            
            // Allow string build
            scope.buildAllowString = function (userId) {
                scope.tempArray = [];
                scope.users.selected.forEach(function(value) {
                    myVal = value['user_id'];
                    scope.tempArray.push(myVal);
                    // $log.log(scope.tempArray);
                    return scope.tempArray;
                });
                newString = scope.tempArray.join();
                scope.managementBaselineEdit.Allow = userId + "/" + newString + "/";
                // $log.log(newString);
                return scope.managementBaselineEdit.Allow;

            };

            // addNewRow
            scope.addNewRow = function(clientNumber) {
                // 'use strict';

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
                    client: clientNumber
                };
                scope.table.records.push(scope.newMessage);
					      scope.currentEditIndex = scope.table.records.length - 1; //Jeff Added
                scope.editRow(scope.currentEditIndex);

            }
            // end addNewRow

            // editRow
            scope.editRow = function (rowIndex) {
                scope.endEdit();
                // 'use strict';
                scope.currentEditIndex = rowIndex;
                
                // Colors
                myBgColor = scope.table.records[rowIndex].BackgroundColor;
                myTextColor = scope.table.records[rowIndex].TextColor;
                $("#backgroundcolor").spectrum("set", myBgColor);
                $("#textcolor").spectrum("set", myTextColor);
                
                // Message
                myMessage = scope.table.records[rowIndex].Message;
                tinyMCE.get('messageText').setContent(myMessage);

                scope.managementBaselineEdit = angular.copy(scope.table.records[rowIndex]);
                
                // used to show and hide Allow string inputs based on mode
                // scope.modeEdit = false;
                // scope.modeAdd = false;
                if (scope.managementBaselineEdit.Allow != "") {
                    // scope.modeEdit = true;
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
            }
            // end editRow

            // deleteRow
            scope.deleteRow = function (idx) {
                scope.table.records.splice(idx,1);
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
                
                scope.save(); //Jeff added
                scope.endEdit();
            }

            scope.cancelEditMessage = function () {
                // 'use strict';
                scope.endEdit();
            }

            scope.endEdit = function () {
                scope.users.selected = {};
                $("#backgroundcolor").spectrum("set", '#333333'); // tie this hex back to the default
                $("#textcolor").spectrum("set", '#ffffff'); // tie this hex back to the default
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
                    // scope.users.selected = scope.client.userlist;
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