// Test comment for dropbox
angularApp.directive("ngEasycom", ['api', '$timeout', '$log', '$sce', function (api, $timeout, $log, $sce) {
    return {
        templateUrl: "../applib/dev/EASYCOM1/EASYCOM1-view/easycom.htm?" + Date.now(), //TODO: Remove for production?
        scope: {
            who: "@",
            allow: "@",
            disallow: "@",
            standalone: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
            //Cheap protection for now.
            if ((legacyContainer.scope.TP1Role != "Admin") && (legacyContainer.scope.TP1Role != "CorpAdmin") && (legacyContainer.scope.TP1Username.toLowerCase() != "bcrane") && (legacyContainer.scope.TP1Username.toLowerCase() != "tebrooks") && (legacyContainer.scope.TP1Username.toLowerCase() != "mlanglois")) {
                window.location = "http://www.touchpointone.com";
            }

            // renders the message back out to the UI as HTML
            scope.getHtml = function (html) {
                return $sce.trustAsHtml(html); // $sce needs to be in the directive at the top
            };

            // Selected Roles Array
            scope.buildRolesString = function (rowIndex) {
                var str = scope.table.records[rowIndex].Allow; ;
                var strt = str.indexOf("/") + 1;
                var lngth = str.lastIndexOf("/");
                var rtrn = str.slice(strt, lngth);
                var parsedUserArray = rtrn;
                if (parsedUserArray.includes(",")) {
                    parsedUserArray = parsedUserArray.split(",");
                } else {
                    parsedUserArray = [parsedUserArray];
                }
                return parsedUserArray;
            }

            scope.activeRoles = {};

            scope.getActiveRoles = function () {
                tempArray = [];
                $.each(scope.table.records, function (index, value) {
                    a = scope.table.records[index].Allow;
                    a = scope.getUserRole(a);
                    tempArray.push(a);
                });
                return tempArray;
            }

            scope.getAllRoles = function () {
                tempArray = [];
                $.each(scope.selectedRoleList, function (index, value) {
                    a = scope.selectedRoleList[index].name;
                    tempArray.push(a);
                });
                return tempArray;
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
                var selectedRole = scope.selectedRoleList.selected;

                var tempArray = [];
                for (i = 0; i < masterArray.length; i++) {
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
                var rtrn = str.slice(strt, lngth);
                var selectedRole = rtrn;

                return selectedRole;
            }

            // Get role from scope.users
            scope.getUserRole = function (string) {
                var userId = scope.parseUsers(string);
                var userList = scope.users;
                for (i = 0; i < userList.length; i++) {
                    if (userId == userList[i].user_id) {
                        return userList[i].role;
                    }
                }
            }

            //Jeff's Edits: *************************

            scope.rolesSelected = function () {
                if (typeof scope.selectedRoleList != "undefined") {
                    if (typeof scope.selectedRoleList.selected != "undefined") {
                        return scope.selectedRoleList.selected.length;
                    }
                }
                return false;
            }

            scope.disableAddMessage = function () {
                if ((typeof scope.client != "undefined") && (typeof scope.table != "undefined")) {
                    if (typeof scope.table.records != "undefined") {
                        for (var c = 0; c < scope.selectedRoleList.length; c++) {
                            var found = false;
                            for (var i in scope.table.records) {
                                var a = scope.table.records[i].Allow;
                                if (typeof a != "undefined") {
                                    var alist = a.substring(a.lastIndexOf("/") + 1).split(",");
                                    for (var j in alist) {
                                        if (alist[j] == scope.selectedRoleList[c].name) {
                                            found = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (!found) return false
                        }
                    }
                }
                return true;
            }

            scope.displayRoles = function (idx) {
                var a = scope.table.records[idx].Allow;
                if (typeof a == "undefined") {
                    return "No Roles Selected";
                }
                else {
                    return a.substring(a.lastIndexOf("/") + 1);
                }
            }

            scope.selectableRoles = [{ role: "testrole"}];

            scope.setSelectableRoles = function (idx) {
                //You can select a role if it's NOT used in any table entry other than the current.
                scope.selectableRoles = [];
                scope.selectedRoleList.selected = [];
                var a = ""; //Allow string
                for (var c = 0; c < scope.selectedRoleList.length; c++) {
                    var selectable = true;
                    for (var i in scope.table.records) {
                        if (i != idx) { //If it's a role in the current record, it's always selectable.
                            a = scope.table.records[i].Allow;
                            if (typeof a != "undefined") {
                                var alist = a.substring(a.lastIndexOf("/") + 1).split(",");
                                for (var j in alist) {
                                    if (alist[j] == scope.selectedRoleList[c].name) {
                                        selectable = false;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (selectable) {
                        scope.selectableRoles.push({ role: scope.selectedRoleList[c].name });
                    }
                }
                if (idx >= 0) {
                    //Set selected roles (bound to scope.selectedRoleList.selected)
                    a = scope.table.records[idx].Allow;
                    if (typeof a != "undefined") {
                        var alist = a.substring(a.lastIndexOf("/") + 1).split(",");
                        for (var j in alist) {
                            if (alist[j] != "") {
                                scope.selectedRoleList.selected.push(alist[j]);
                            }
                        }
                    }
                }

            }
            //End of Jeff's Edits *******************

            scope.checkUserRoleList = function (str) {
                if (str === 'agame') {
                    scope.selectedRoleList = scope.altRoles;
                } else {
                    scope.selectedRoleList = scope.roles;
                }
                return scope.selectedRoleList;
            }

            scope.getUserRoleListLabel = function () {
                if (scope.roleModel === "agame") {
                    newLabel = "A-GAME";
                } else {
                    newLabel = "Acuity List";
                }
                return newLabel;
            }

            // addNewRow
            scope.addNewRow = function () {
                if (scope.disableAddMessage()) {
                    alert("All roles are being used.\nUnable to add a new message unless a role is available.");
                    $("#btnAddMessage").attr("href", "#listMessages");
                    scope.modeAdd = false;
                    return false;
                }
                $("#btnAddMessage").attr("href", "#formAddEdit");
                // 'use strict';
                scope.modeAdd = true;

                scope.newMessage = {
                    id: 0,  //Not relevant
                    Allow: '',
                    Disallow: '//',
                    Delivery: '',
                    Position: 'notification',
                    BackgroundColor: '#db0000',
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

                scope.setSelectableRoles(rowIndex); //Jeff Added								

                scope.modeMessage = function () {
                    if (scope.modeAdd) {
                        return "Add Message";
                    } else {
                        return "Edit Message";
                    }
                }
                // scope.tableInit();
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

            // Delete Confirm Modals Init
            $(document).ready(function () {
                $("#dialog-confirm, #delete-confirm").dialog({
                    autoOpen: false,
                    resizable: false,
                    draggable: false,
                    height: "auto",
                    width: 400,
                    modal: true,
                    closeOnEscape: false
                });
            });

            // Confirm User List Change
            scope.dialogConfirm = function () {
                $("#dialog-confirm").dialog("open");
                $("#dialog-confirm").dialog({ dialogClass: 'dialog-confirm-modal' });
                $("#dialog-confirm").dialog({
                    buttons: {
                        "Confirm": {
                            text: "Confirm",
                            "class": "btn-confirm",
                            click: function () {
                                scope.deleteAllMessages();
                                $(this).dialog("close");
                            }
                        },
                        Cancel: {
                            text: "Cancel",
                            "class": "btn-cancel",
                            click: function () {
                                $(this).dialog("close");
                            }
                        }
                    }
                });
            }
            // end Confirm User List Change

            // Confirm Message Delete
            scope.deleteConfirm = function (idx) {
                $("#delete-confirm").dialog("open");
                $("#delete-confirm").dialog({ dialogClass: 'delete-confirm-modal' });
                $("#delete-confirm").dialog({
                    buttons: {
                        "Confirm": {
                            text: "Confirm",
                            "class": "btn-confirm",
                            click: function () {
                                scope.deleteRow(idx);
                                $(this).dialog("close");
                            }
                        },
                        Cancel: {
                            text: "Cancel",
                            "class": "btn-cancel",
                            click: function () {
                                $(this).dialog("close");
                            }
                        }
                    }
                });
            }
            // end Confirm Message Delete
            scope.deleteAllMessages = function () {
                scope.table.records.splice(0, scope.table.records.length);
                scope.save();
                scope.endEdit();
            }

            // deleteRow
            scope.deleteRow = function (idx) {
                // if (confirm("Are you sure you want to delete this message?")) {
                scope.table.records.splice(idx, 1);
                scope.save();
                scope.endEdit();
                // }
            }
            // end deleteRow

            scope.saveEditMessage = function () {
                // 'use strict';
                // background color
                scope.table.records[scope.currentEditIndex] = scope.managementBaselineEdit;

                //Jeff's Edits: *************************
                //The buildAllowString function lists all users like this:
                //  43/user1,user2,user3/
                //Instead, we want to make it for all users in a role, so like:
                //  43//Management
                var rs = "";
                for (var r in scope.selectedRoleList.selected) {
                    if (rs != "") rs += ",";
                    rs += scope.selectedRoleList.selected[r];
                }
                scope.table.records[scope.currentEditIndex].Allow = scope.clientNumber + "//" + rs;
                //Safety - If no roles selected (shouldn't be allowed), then disallow all with "//";
                scope.table.records[scope.currentEditIndex].Disallow = (rs == "") ? "//" : "";
                // END of Jeff's Edits ******************

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
                    scope.deleteRow(scope.table.records.length - 1);
                }
                scope.endEdit();
            }

            scope.endEdit = function () {
                scope.selectedRoleList.selected = [];
                scope.modeAdd = false;
                $("#backgroundcolor").spectrum("set", '#333333'); // tie this hex back to the default
                $("#textcolor").spectrum("set", '#ffffff'); // tie this hex back to the default
                $("#messageText_ifr").contents().find("#editorPreview").css('background-color', '#333333');
                $("#messageText_ifr").contents().find("#editorPreview").css('color', '#ffffff');
                tinyMCE.get('messageText').setContent('');
                scope.managementBaselineEdit = {};
                scope.currentEditIndex = undefined;

                // IE11 hack
                $("#listMessages").modal();
            }
            ////////////////////
            // end AED functions
            ////////////////////

            // Saves the User List in client.easycom.rolemodel
            scope.saveUserList = function (str) {
                scope.checkUserRoleList(str);
                scope.roleModel = str;
                api.postJS({
                    lib: "fan",
                    cmd: "saveEasycomRolemodel",
                    rolemodel: str
                }).then(function (json) {
                    if (json.saved) {
                        scope.$apply(function () {
                            if (json.saved) $log.log("rolemodel saved");
                        });
                        //alert("Record Saved");
                    }
                });
            }

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
                }).then(function (json) {
                    if (json.saved) {
                        scope.$apply(function () {
                            if (json.saved) $log.log("table saved");
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
            }).then(function (json) {
                scope.$apply(function () {
                    scope.showtable = json.allowed;
                    scope.table = json.table;
                });
            });
            api.getClient({
                who: scope.who,
                members: ["users", "roles", "easycom"]
                , restrictusers: 200
            }).then(function (json) {
                scope.$apply(function () {
                    scope.client = json.client;
                    scope.users = scope.client.userlist;
                    scope.roles = scope.client.roles;
                    scope.clientNumber = scope.client.number;
                    scope.roleModel = scope.client.easycom.rolemodel;
                    scope.altRoles = scope.client.easycom.alternateroles;

                    if (scope.roleModel === 'agame') {
                        scope.selectedRoleList = scope.altRoles;
                    } else {
                        scope.selectedRoleList = scope.roles;
                    }
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
                }).then(function (json) {
                    if (json.saved) {

                        scope.$apply(function () {
                            if (json.saved) alert("saved");
                        });
                        //alert("Record Saved");
                    }
                });
            }

            if (scope.standalone == "Y") {
                $("#formAddEdit").css("max-width", "900px");
                $("#listMessages").css("max-width", "900px").modal("show");
                $(".close-modal").hide();
                $('#listMessages').on($.modal.OPEN, function (event, modal) {
                    $(".close-modal").hide();
                });

            }
        }
    }
} ]);