angularApp.directive("ngUserManager", ['api', '$rootScope', function (api, $rootScope) {

    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/userManager.htm?' + Date.now(),
        scope: {
            assoc: "@",
            text: "@",
            details: "@",
            cid: "@",
            filters: "@",
            panel: "@",
            hidetopper: "@",
            toppertext: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
            HideAll();
            let terminateUsersAvailableToRoles = [
                "CorpAdmin",
                "Admin",
                "Management",            ]
            /*Button Events START*/
            $("#btnAddNewUser", element).off("click").on("click", function () {
                ClearEditorForm(function () {
                    LoadEditorForm(null, function () {
                        ShowEditorForm();
                    })
                });
            });
            $("#btnSave", element).off("click").on("click", function () {
                ValidateUserForm(function () {
                    SaveEditorForm(function () {
                        ClearEditorForm();
                        HideEditorForm();
                        ko.postbox.publish("userAdminReload", true);
                    });
                });
            });
            $(".btn-close", element).off("click").on("click", function () {
                ClearEditorForm(function () {
                    HideEditorForm();
                    HideChangePasswordForm();
                    HideChangeUserTeamPanel();
                    ko.postbox.publish("userAdminReload", false);
                });
            });
            $("#userManager_refresh", element).off("click").on("click", function () {
                WriteUserLoadingMessage("Applying filter(s)...");
                window.setTimeout(function () {
                    HandleUserListLoad(false, function () {
                        HideUserLoadingMessage();
                    });
                }, 500);
            });
            $("#userManager_clearFilter", element).off("click").on("click", function () {
                WriteUserLoadingMessage("Clearing filters and reloading list...");
                window.setTimeout(function () {
                    ClearFilters(function () {
                        HandleUserListLoad(false, function () {
                            HideUserLoadingMessage();
                        });
                    });
                }, 500);
            });
            $("#userManagerFormTab_Team", element).off("click").on("click", function () {
                ShowTeamTabContainer();
                MarkActiveEditorTab(this.id);
            });
            $("#userManagerFormTab_EmpId", element).off("click").on("click", function () {
                ShowEmployeeIdContainer();
                MarkActiveEditorTab(this.id);
            });
            $("#userManagerFormTab_Assisting", element).off("click").on("click", function () {
                ShowAssistingTabContainer();
                MarkActiveEditorTab(this.id);
            });
            $("#userManagerFormTab_UserStats", element).off("click").on("click", function () {
                ShowUserStatsTabContainer();
                MarkActiveEditorTab(this.id);
            });
            $("#userManagerFormTab_UserBudget", element).off("click").on("click", function () {
                ShowUserBudgetTabContainer();
                MarkActiveEditorTab(this.id);
            });
            $("#userManagerFormTab_Attributes", element).off("click").on("click", function () {
                ShowAttributesTabContainer();
                MarkActiveEditorTab(this.id);
            });
            $("#userManagerFormTab_Location", element).off("click").on("click", function () {
                ShowUserLocationTabContainer();
                MarkActiveEditorTab(this.id);
            });
            $("#userManagerFormTab_Group", element).off("click").on("click", function () {
                ShowUserGroupTabContainer();
                MarkActiveEditorTab(this.id);
            });
            $("#btnGenerateDefaultEmpIds", element).off("click").on("click", function () {
                GenerateDefaultEmployeeIds(function () {
                    ShowEmployeeIdContainer();
                });
            });
            $("#btnAddNewEmployeeId", element).off("click").on("click", function () {
                ValidateAddNewEmployeeId(function () {
                    let employeeIdObject = CollectNewEmployeeIdFromForm();
                    AddNewEmployeeId(employeeIdObject, function () {
                        ClearNewEmployeeIdForm();
                        ShowEmployeeIdContainer();
                    });
                });
            });
            $("#userId", element).off("blur").on("blur", function () {
                CheckUserIdAvailable();
            });
            $("#btnResetPassword", element).off("click").on("click", function () {
                console.log("Handle change of password here.");
                LoadPasswordChangeForm(null, function () {
                    ShowChangePasswordForm();
                });
            });
            $("#btnSetPassword", element).off("click").on("click", function () {
                SavePasswordChangeForm(function () {
                    ClearPasswordChangeForm();
                    HideChangePasswordForm();
                });
            });
            $("#btnCancelPassword", element).off("click").on("click", function () {
                ClearPasswordChangeForm();
                HideChangePasswordForm();
            });
            $("#btnAddAssistTeamItem", element).off("click").on("click", function () {
                ValidateAddUserAssistanceToTeam(function () {
                    AddUserToTeamForAssistance(function () {
                        ClearAssistForm();
                        userAssistItemsTeam.length = 0;
                        let userId = $("#userId", element).val();
                        LoadUserAssistTeamItems(userId, function () {
                            RenderUserAssistItems();
                        });
                    });
                });
            });
            $("#btnAddAssistGroupItem", element).off("click").on("click", function () {
                ValidateAddUserAssistanceToGroup(function () {
                    AddUserToGroupForAssistance(function () {
                        ClearAssistForm();
                        userAssistItemsGroup.length = 0;
                        let userId = $("#userId", element).val();
                        LoadUserAssistGroups(userId, function () {
                            RenderUserAssistItems();
                        });
                    });
                });
            });
            $("#btnSaveUserAssignment", element).off("click").on("click", function () {
                ValidateChangeUserTeamForm(function () {
                    SaveChangeUserTeamForm(function (userId) {
                        ClearChangeUserTeamForm();
                        HideChangeUserTeamPanel();
                        LoadEditorForm(userId, function () {
                            ShowEditorForm();
                            $("#userManagerFormTab_Team", element).click();
                        });
                    });
                });
            });
            $("#btnAddUserGroupItem", element).off("click").on("click", function () {
                //ValidateUserGroupAssignments(function () {
                SaveUserGroupAssignments(function (userId) {
                    ClearUserAssignmentsForm();
                    currentUserGroups.length = 0;
                    LoadUserGroupAssignments(userId, function () {
                        RenderCurrentUserTeamGroup(userId);
                        RenderUserGroupAssignments();
                    });
                });
                //});
            });
            $("#btnCancelTeamAssignment", element).off("click").on("click", function () {
                ClearChangeUserTeamForm();
                HideChangeUserTeamPanel();
            });
            $("#userManagerForm_ChangeUserTeam", element).off("click").on("click", function () {
                LoadChangeUserTeamForm(null, function () {
                    ShowChangeUserTeamPanel();
                });
            });
            $("#btnTerminateUserSave", element).off("click").on("click", function(){
                SaveUserTermination(function(){
                    ClearTerminationForm();
                    HideUserTerminationForm();
                    HandleUserListLoad(true);
                });
            });
            $("#btnCancelTermination", element).off("click").on("click", function(){
                ClearTerminationForm();
                HideUserTerminationForm();
            });
            /*Button Events END*/
            //TODO: Add this to some sort of enum file?
            const BUDGET_DOLLAR_SPENT = 1;
            const BUDGET_DOLLAR_ALLOCATED = 3;
            const BUDGET_CREDITS_SPENT = 2;
            const BUDGET_CREDITS_ALLOCATED = 4;

            var defaultAvatarUrl = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";
            var possibleUsers = [];
            var possibleRoles = [];
            var statusOptions = [];
            var availableTeams = [];
            var availableGroups = [];
            var availableLocations = [];
            var possibleEmployeeTypes = [];
            var possibleEmployeeTypeIds = [];
            var maxUsersToShow = 1000;
            var canAddUsers = false;
            var userAssistItemsTeam = [];
            var userAssistItemsGroup = [];
            var currentUserBudgetLedger = [];
            var currentUserProfileStats = [];
            var currentUserGroups = [];
            var currentUserLocations = [];
            var currentUserSupervisorGroups = [];

            scope.Initialize = function () {
                HideAll();
                $("#userAvatar", element).prop("src", defaultAvatarUrl);
                HandleBottomButtons();
                SetDatePickerFields();
                LoadUserRoleOptions();
                LoadStatusOptions();
                LoadTeamOptions();
                LoadGroupOptions();
                LoadLocationOptions();
                LoadEmployeeTypeOptions();
                LoadEmployeeIdTypeOptions();
                LoadLists("all");
                $("#userManager_userStatus", element).val("1");
            };
            function SetDatePickerFields() {
                $(".user-manager-editor-hire-date", element).datepicker();
                $(".user-change-team-start-date", element).datepicker();
                $(".user-terminate-date", element).datepicker();
            }
            function LoadUserRoleOptions() {
                //TODO: Pull from database?
                possibleRoles.length = 0;

                possibleRoles.push({ RoleId: 1, RoleCode: "Admin", RoleDesc: "System Admin", Status: "A", HasBudgetAvailable: true });
                possibleRoles.push({ RoleId: 2, RoleCode: "CorpAdmin", RoleDesc: "Senior Management", Status: "A", HasBudgetAvailable: true });
                possibleRoles.push({ RoleId: 3, RoleCode: "MGMT", RoleDesc: "Management", Status: "A", HasBudgetAvailable: true });
                possibleRoles.push({ RoleId: 4, RoleCode: "GL", RoleDesc: "Group Leader", Status: "A", HasBudgetAvailable: true });
                possibleRoles.push({ RoleId: 4, RoleCode: "TL", RoleDesc: "Team Leader", Status: "A", HasBudgetAvailable: true });
                possibleRoles.push({ RoleId: 5, RoleCode: "QA", RoleDesc: "Quality Assurance", Status: "A", HasBudgetAvailable: false });
                possibleRoles.push({ RoleId: 6, RoleCode: "CSR", RoleDesc: "Agent", Status: "A", HasBudgetAvailable: false });

            }
            function LoadStatusOptions() {
                //TODO: Pull from database?
                statusOptions.length = 0;
                statusOptions.push({ StatusId: 1, StatusCode: "A", StatusDesc: "Active" });
                statusOptions.push({ StatusId: 2, StatusCode: "I", StatusDesc: "Inactive" });
                statusOptions.push({ StatusId: 7, StatusCode: "T", StatusDesc: "In Training" });
                statusOptions.push({ StatusId: 9, StatusCode: "L", StatusDesc: "LOA" });
            }
            function LoadTeamOptions(callback) {
                if (availableTeams != null && availableTeams.length > 0) {
                    if (callback != null) {
                        callback(availableTeams);
                    }
                }
                else {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "getTeamListExcludeProfile",
                            deepLoad: true
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            if (data.errormessage != null && data.errormessage != "") {
                                a$.jsonerror(data);
                                return;
                            }
                            else {
                                var teamList = JSON.parse(data.teamList);
                                availableTeams.length = 0;
                                availableTeams = teamList;
                                SortAvailableTeams();
                                if (callback != null) {
                                    callback();
                                }
                            }
                        }
                    });
                }
            }
            function LoadGroupOptions(callback) {
                if (availableGroups != null && availableGroups.length > 0) {
                    if (callback != null) {
                        callback(availableGroups);
                    }
                }
                else {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "getGroupList",
                            deepLoad: false
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {

                            if (data.errormessage != null && data.errormessage != "") {
                                a$.jsonerror(data);
                                return;
                            }
                            else {

                                var groupList = JSON.parse(data.groupList);
                                availableGroups.length = 0;
                                availableGroups = groupList;
                                if (callback != null) {
                                    callback();
                                }
                            }
                        }
                    });
                }
            }
            function LoadLocationOptions(callback) {
                if (availableLocations != null && availableLocations.length > 0) {
                    if (callback != null) {
                        callback(availableLocations);
                    }
                }
                else {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "getLocationList",
                            //deepLoad: false
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            if (data.errormessage != null && data.errormessage != "") {
                                a$.jsonerror(data);
                                return;
                            }
                            else {
                                var locationList = JSON.parse(data.locationList);
                                availableLocations.length = 0;
                                availableLocations = locationList;
                                if (callback != null) {
                                    callback();
                                }
                            }
                        }
                    });
                }
            }
            function LoadEmployeeTypeOptions() {
                //TODO: Pull from database?
                possibleEmployeeTypes.length = 0;
                possibleEmployeeTypes.push({ EmployeeTypeId: 1, EmployeeTypeDesc: "Employee" });
                possibleEmployeeTypes.push({ EmployeeTypeId: 2, EmployeeTypeDesc: "Temp" });
            }
            function LoadEmployeeIdTypeOptions() {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getEmployeeIdTypeList"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage != "") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            var typeList = $.parseJSON(data.employeeIdTypeList);
                            possibleEmployeeTypeIds.length = 0;
                            if (typeList != null) {
                                for (var t = 0; t < typeList.length; t++) {
                                    possibleEmployeeTypeIds.push(typeList[t]);
                                }
                            }
                        }
                    }
                });
            }
            function LoadLists(listToLoad) {
                listToLoad = listToLoad.toLowerCase();

                var loadAll = (listToLoad == "all");

                if (listToLoad == "roles" || loadAll == true) {
                    $("#userManager_RoleFilter", element).empty();
                    $("#userRole", element).empty();

                    $("#userManager_RoleFilter", element).append($('<option />', { value: "", text: "" }));
                    $("#userRole", element).append($('<option />', { value: "", text: "" }));

                    for (var i = 0; i < possibleRoles.length; i++) {
                        var item = possibleRoles[i];
                        $("#userManager_RoleFilter", element).append($('<option />', { value: item.RoleCode, text: item.RoleDesc }));
                        $("#userRole", element).append($('<option />', { value: item.RoleCode, text: item.RoleDesc }));
                    }
                }
                if (listToLoad == "userstatus" || loadAll == true) {
                    $("#userStatus", element).empty();
                    $("#userStatus", element).append($('<option />', { value: "", text: "" }));

                    $("#userManager_userStatus", element).empty();
                    $("#userManager_userStatus", element).append($('<option />', { value: "", text: "All" }));

                    for (var i = 0; i < statusOptions.length; i++) {
                        var item = statusOptions[i];
                        $("#userStatus", element).append($('<option />', { value: item.StatusId, text: item.StatusDesc }));
                        $("#userManager_userStatus", element).append($('<option />', { value: item.StatusId, text: item.StatusDesc }));
                    }
                }
                if (listToLoad == "employeeidtypes" || loadAll == true) {
                    $("#employeeTypeIdInput", element).empty();
                    $("#employeeTypeIdInput", element).append($('<option />', { value: "", text: "" }));

                    for (var i = 0; i < possibleEmployeeTypeIds.length; i++) {
                        var item = possibleEmployeeTypeIds[i];
                        $("#employeeTypeIdInput", element).append($('<option />', { value: item.IdType, text: item.IdTypeDesc }));
                    }
                }
                if (listToLoad == "employeetypeoptions" || loadAll == true) {
                    $("#userEmployeeType", element).empty();
                    $("#userEmployeeType", element).append($('<option />', { value: "", text: "" }));

                    $("#userManager_TypeFilter", element).empty();
                    $("#userManager_TypeFilter", element).append($('<option />', { value: "", text: "" }));


                    for (var i = 0; i < possibleEmployeeTypes.length; i++) {
                        var item = possibleEmployeeTypes[i];
                        $("#userEmployeeType", element).append($('<option />', { value: item.EmployeeTypeId, text: item.EmployeeTypeDesc }));
                        $("#userManager_TypeFilter", element).append($('<option />', { value: item.EmployeeTypeId, text: item.EmployeeTypeDesc }));
                    }
                }
                if (listToLoad == "teams" || loadAll == true) {
                    SortAvailableTeams();
                    $("#userManager_TeamFilter", element).empty();
                    $("#userManager_TeamFilter", element).append($('<option />', { value: "", text: "" }));

                    $("#userManager_AssistTeamInput", element).empty();
                    $("#userManager_AssistTeamInput", element).append($('<option />', { value: "", text: "" }));

                    $("#userChangeTeamNewTeamSelector", element).empty();
                    $("#userChangeTeamNewTeamSelector", element).append($('<option />', { value: "", text: "" }));

                    for (let tc = 0; tc < availableTeams.length; tc++) {
                        let teamItem = availableTeams[tc];
                        let teamName = teamItem.TeamName;
                        if (teamItem.ProjectIdSource != null) {
                            teamName += " (" + teamItem.ProjectIdSource.ProjectDesc + ")";
                        }
                        $("#userManager_TeamFilter", element).append($('<option />', { value: teamItem.TeamId, text: teamName }));
                        $("#userManager_AssistTeamInput", element).append($('<option />', { value: teamItem.TeamId, text: teamName }));
                        $("#userChangeTeamNewTeamSelector", element).append($('<option />', { value: teamItem.TeamId, text: teamName }));
                    }
                }
                if (listToLoad == "groups" || loadAll == true) {
                    SortAvailableGroups();
                    $("#userManager_AssistGroupInput", element).empty();
                    $("#userManager_AssistGroupInput", element).append($('<option />', { value: "", text: "" }));

                    $("#userManager_AssignUserGroupInput", element).empty();
                    $("#userManager_AssignUserGroupInput", element).append($('<option />', { value: "", text: "" }));
                    for (let gc = 0; gc < availableGroups.length; gc++) {
                        let groupItem = availableGroups[gc];
                        let groupName = groupItem.Name;
                        $("#userManager_AssistGroupInput", element).append($('<option />', { value: groupItem.GroupId, text: groupName }));
                        $("#userManager_AssignUserGroupInput", element).append($('<option />', { value: groupItem.GroupId, text: groupName }));
                    }
                }
            }
            function HandleUserListLoad(forceReload, callback) {
                WriteUserLoadingMessage("Loading User information...");
                LoadUserList(forceReload, function (listData) {
                    let listToRender = listData;
                    listToRender = FilterUserList(listToRender);
                    listToRender = SortUserList(listToRender, "userid");
                    WriteUserLoadingMessage("Rendering User information...");
                    RenderUserList(listToRender, function () {
                        HideUserLoadingMessage();
                        if (callback != null) {
                            callback();
                        }
                    });
                });
            }
            function LoadUserList(forceReload, callback) {
                if (forceReload == null) {
                    forceReload = false;
                }
                if (possibleUsers != null && possibleUsers.length > 0 && forceReload == false) {
                    if (callback != null) {
                        callback(possibleUsers);
                    }
                }
                else {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "selfserv",
                            cmd: "getAllProfiles"
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            if (data.errormessage != null && data.errormessage != "") {
                                a$.jsonerror(data);
                                return;
                            }
                            else {
                                var userList = $.parseJSON(data.allProfilesList);
                                possibleUsers.length = 0;
                                possibleUsers = userList;
                                if (callback != null) {
                                    callback(userList);
                                }
                            }
                        }
                    });

                }
            }
            function FilterUserList(listToFilter) {
                let filteredUserList = listToFilter;
                let roleFilter = $("#userManager_RoleFilter", element).val() || "";
                let typeFilter = $("#userManager_TypeFilter", element).val() || "";
                let firstNameFilter = $("#userManager_firstNameFilter", element).val() || "";
                let lastNameFilter = $("#userManager_lastNameFilter", element).val() || "";
                let teamFilter = $("#userManager_TeamFilter", element).val() || "";

                if (roleFilter != "") {
                    let roleObject = possibleRoles.find(x => x.RoleCode == roleFilter);
                    if (roleObject != null) {
                        filteredUserList = filteredUserList.filter(x => x.UserRole == roleObject.RoleDesc || x.UserRole == roleObject.RoleCode);
                    }
                    else {
                        filteredUserList = filteredUserList.filter(x => x.UserRole == roleFilter);
                    }
                }
                if (typeFilter != "") {
                    filteredUserList = filteredUserList.filter(x => x.EmployeeTypeId == typeFilter);
                }
                if (teamFilter != "") {
                    filteredUserList = filteredUserList.filter(x => x.CurrentTeamId == teamFilter);
                }
                if (firstNameFilter != "") {
                    filteredUserList = filteredUserList.filter(x => x.FirstName.toLowerCase().includes(firstNameFilter.toLowerCase()));
                }
                if (lastNameFilter != "") {
                    filteredUserList = filteredUserList.filter(x => x.LastName.toLowerCase().includes(lastNameFilter.toLowerCase()));
                }
                return filteredUserList;
            }
            function SortUserList(listToSort, fieldToSort) {
                if (listToSort == null) {
                    listToSort = possibleUsers;
                }
                let sortedUserList = listToSort;
                if (sortedUserList != null) {
                    switch (fieldToSort?.toLowerCase()) {
                        case "firstname":
                            sortedUserList = sortedUserList.sort((a, b) => {
                                if (a.FirstName.toLowerCase() < b.FirstName.toLowerCase()) {
                                    return -1;
                                }
                                if (a.FirstName.toLowerCase() > b.FirstName.toLowerCase()) {
                                    return 1;
                                }
                                if (a.FirstName.toLowerCase() == b.FirstName.toLowerCase()) {
                                    if (a.LastName.toLowerCase() < b.LastName.toLowerCase()) {
                                        return -1;
                                    }
                                    if (a.LastName.toLowerCase() > b.LastName.toLowerCase()) {
                                        return 1;
                                    }
                                    if (a.LastName.toLowerCase() == b.LastName.toLowerCase()) {
                                        return 0;
                                    }
                                }
                            });
                            break;
                        case "lastname":
                            sortedUserList = sortedUserList.sort((a, b) => {
                                if (a.LastName.toLowerCase() < b.LastName.toLowerCase()) {
                                    return -1;
                                }
                                if (a.LastName.toLowerCase() > b.LastName.toLowerCase()) {
                                    return 1;
                                }
                                if (a.LastName.toLowerCase() == b.LastName.toLowerCase()) {
                                    if (a.FirstName.toLowerCase() < b.FirstName.toLowerCase()) {
                                        return -1;
                                    }
                                    if (a.FirstName.toLowerCase() > b.FirstName.toLowerCase()) {
                                        return 1;
                                    }
                                    if (a.FirstName.toLowerCase() == b.FirstName.toLowerCase()) {
                                        return 0;
                                    }
                                }
                            });
                            break;
                        default:
                            sortedUserList = sortedUserList.sort((a, b) => {
                                if (a.UserId.toLowerCase() < b.UserId.toLowerCase()) {
                                    return -1;
                                }
                                if (a.UserId.toLowerCase() > b.UserId.toLowerCase()) {
                                    return 1;
                                }
                                if (a.UserId.toLowerCase() == b.UserId.toLowerCase()) {
                                    return 0;
                                }
                            });
                            break;
                    }
                }

                return sortedUserList;
            }
            function RenderUserList(listToRender, callback) {
                if (listToRender == null) {
                    listToRender = possibleUsers;
                }
                let userStatusFilter = $("#userManager_userStatus", element).val();

                let userInfoHolder = $("<div class=\"user-list\" />");

                if (listToRender != null && listToRender.length > 0) {

                    itemsToRender = listToRender.filter(u => u.UserStatus == userStatusFilter || userStatusFilter == "");

                    if (itemsToRender.length > maxUsersToShow) {
                        userInfoHolder.append("<div class=\"too-many-records-found-holder\">More than <b>" + maxUsersToShow + "</b> users found.  Please use filters to refine your search.</div>");
                        userInfoHolder.append("<div class=\"too-many-records-found-count-holder\">Found <b>" + itemsToRender.length + "</b> records.</div>");
                    }
                    else {

                        for (let uc = 0; uc < itemsToRender.length; uc++) {
                            let userItem = itemsToRender[uc];

                            let userId = userItem.UserId;

                            let userRow = $("<div class=\"user-list-item-holder\" />");

                            let userIdHolder = $("<div class=\"user-list-item user-id\" />");
                            userIdHolder.append(userId);

                            let userNameHolder = $("<div class=\"user-list-item user-name\" />");
                            userNameHolder.append(userItem.UserFullName);

                            let userRoleHolder = $("<div class=\"user-list-item user-role\" />");
                            let userRole = userItem.UserRole;
                            let roleObject = possibleRoles.find(r => r.RoleCode == userItem.UserRole);
                            if (roleObject != null) {
                                userRole = roleObject.RoleDesc;
                            }
                            userRoleHolder.append(userRole);

                            let userTeamHolder = $("<div class=\"user-list-item user-team\" />");
                            let teamName = "&nbsp;";
                            if (userItem.CurrentTeamId > 0 || userItem.CurrentTeamIdSource != null) {
                                let teamItem = userItem.CurrentTeamIdSource;
                                if (teamItem == null) {
                                    teamItem = availableTeams.find(t => t.TeamId == userItem.CurrentTeamId);
                                }
                                if (teamItem != null) {
                                    teamName += teamItem.TeamName;
                                }
                            }

                            userTeamHolder.append(teamName);

                            let userTypeHolder = $("<div class=\"user-list-item user-type\" />");
                            let employeeType = userItem.EmployeeTypeId;
                            let employeeTypeObject = possibleEmployeeTypes.find(x => x.EmployeeTypeId == userItem.EmployeeTypeId);
                            if (employeeTypeObject != null) {
                                employeeType = employeeTypeObject.EmployeeTypeDesc;
                            }
                            userTypeHolder.append(employeeType);
                            let userStatusHolder = $("<div class=\"user-list-item user-status\" />");
                            let userStatus = userItem.UserStatus;
                            let userStatusObject = statusOptions.find(us => us.StatusCode == userItem.UserStatus);
                            if (userStatusObject == null) {
                                userStatusObject = statusOptions.find(us => us.StatusId == userItem.UserStatus);
                            }
                            if (userStatusObject != null) {
                                userStatus = userStatusObject.StatusDesc;
                            }
                            userStatusHolder.append(userStatus);

                            let userButtonHolder = $("<div class=\"user-list-item user-buttons\" />");
                            let userEditButton = $("<button id=\"userEdit_" + userId + "\" title=\"Edit User\"><i class=\"fa fa-edit\"></i></button>");
                            userEditButton.off("click").on("click", function () {
                                let buttonId = this.id;
                                let userId = buttonId.split("_")[1];
                                LoadEditorForm(userId, function () {
                                    ShowEditorForm();
                                });
                            });

                            let userResetPasswordButton = $("<button id=\"userResetPassword_" + userId + "\" title=\"Change Password\"><i class=\"fa fa-key\"></i></button>");
                            userResetPasswordButton.on("click", function () {
                                let buttonId = this.id;
                                let userId = buttonId.split("_")[1];
                                LoadPasswordChangeForm(userId, function () {
                                    ShowChangePasswordForm();
                                });
                            });
                            let changeUserTeamButton = $("<button id=\"userChangeTeam_" + userId + "\" title=\"Manage User Team\"><i class=\"fa fa-people-group\"></i></button>");
                            changeUserTeamButton.on("click", function () {
                                let buttonId = this.id;
                                let userId = buttonId.split("_")[1];
                                LoadChangeUserTeamForm(userId, function () {
                                    ShowChangeUserTeamPanel();
                                });
                            });
                            
                            userButtonHolder.append(userEditButton);
                            userButtonHolder.append("&nbsp;");
                            userButtonHolder.append(userResetPasswordButton);
                            //if(canAddUsers == true && userItem.UserRole.toUpperCase() == "CSR".toUpperCase())
                            if (canAddUsers == true) {
                                userButtonHolder.append("&nbsp;");
                                userButtonHolder.append(changeUserTeamButton);
                            }
                            
                            if(userItem.UserStatus != 2 && terminateUsersAvailableToRoles.findIndex(i => i.toLowerCase() == legacyContainer.scope.TP1Role.toLowerCase()) >= 0)
                            {
                                let terminateUserButton = $("<button id=\"userTerminate_" + userId + "\" title=\"Inactivate User\"><i class=\"fa fa-remove\"></i></button>");
                                terminateUserButton.on("click", function () {
                                    let buttonId = this.id;
                                    let userId = buttonId.split("_")[1];
                                    LoadUserTerminationForm(function(){
                                        ShowUserTerminationForm();
                                    }, userId);
                                });
                                userButtonHolder.append("&nbsp;");
                                userButtonHolder.append(terminateUserButton);
                            }

                            userRow.append(userIdHolder);
                            userRow.append(userNameHolder);
                            userRow.append(userRoleHolder);
                            userRow.append(userTeamHolder);
                            userRow.append(userTypeHolder);
                            userRow.append(userStatusHolder);
                            userRow.append(userButtonHolder);

                            userInfoHolder.append(userRow);
                        }

                    }
                }
                else {
                    userInfoHolder.append("No users found.");
                }

                $("#userListHolder", element).empty();
                $("#userListHolder", element).append(userInfoHolder);
                if (callback != null) {
                    callback();
                }
            }
            function LoadEditorForm(userId, callback) {
                ShowEditorLoading();
                window.setTimeout(function () {
                    let user = possibleUsers.find(u => u.UserId == userId);
                    let userTeams = null;
                    $(".user-manager-user-id-available", element).removeClass("fal");
                    $(".user-manager-user-id-available", element).addClass("fas");
                    $(".user-manager-user-id-available", element).removeClass("green-check");
                    $(".user-manager-user-id-available", element).removeClass("red-check");
                    $(".user-manager-user-id-available", element).removeClass("yellow-check");
                    $(".user-id-available-status", element).empty();

                    $("#userAvatar", element).prop("src", defaultAvatarUrl);
                    if (user != null) {
                        $("#editorFormType", element).val("update");
                        $(".user-manager-user-id-available", element).addClass("green-check");
                        $(".user-manager-user-id-available", element).removeClass("fas");
                        $(".user-manager-user-id-available", element).addClass("fal");

                        let userAvatarUrl = defaultAvatarUrl;
                        if (user.AvatarImageFileName != "empty_headshot.png") {
                            userAvatarUrl = Global_CleanAvatarUrl(user.AvatarImageFileName);
                        }
                        $("#userAvatar", element).prop("src", userAvatarUrl);

                        $("#userId", element).val(user.UserId);
                        $("#userId", element).prop("readonly", true);
                        $("#userId", element).prop("disabled", true);
                        $("#userId", element).off("blur");
                        $("#userManager_UserId", element).val(user.UserId);

                        $("#userEmployeeId", element).val(user.EmployeeId);
                        $("#userFirstName", element).val(user.FirstName);
                        $("#userLastName", element).val(user.LastName);
                        let userRole = possibleRoles.find(r => r.RoleDesc == user.UserRole);
                        if (userRole == null) {
                            userRole = possibleRoles.find(r => r.RoleCode == user.UserRole);
                        }
                        if (userRole != null) {
                            $("#userRole", element).val(userRole.RoleCode);
                            if (userRole.RoleCode.toLowerCase() == "QA".toLowerCase() || userRole.RoleCode.toLowerCase() == "Quality Assurance".toLowerCase()) {
                                ShowUserGroupAssignmentForm();
                            }
                        }

                        if (user.HireDate != null && user.HireDate != "") {
                            $("#userHireDate", element).val(new Date(user.HireDate).toLocaleDateString());
                        }
                        if(user.InactiveDate != null && user.InactiveDate != "")
                        {
                            let inactiveDate = new Date(user.InactiveDate).toLocaleDateString();
                            $("#lblUserInactiveDate", element).html(`as of <i><b>${inactiveDate}</b></i>`);
                            $("#userTermDate", element).val(inactiveDate);
                        }
                        $("#userStatus", element).val(user.UserStatus);
                        $("#userEmailAddress", element).val(user.EmailAddress);
                        $("#userEmployeeType", element).val(user.EmployeeTypeId);
                        $("#userCreatedInfoHolder", element).empty();
                        let enterByName = user.EnterBy;
                        let enterByProfile = possibleUsers.find(u => u.UserId == user.EnterBy);
                        if (enterByProfile != null) {
                            enterByName = enterByProfile.UserFullName;
                        }
                        $("#userCreatedInfoHolder", element).append("<span>" + enterByName + " (<b>" + new Date(user.EnterDate).toLocaleDateString() + "</b>)</span>");
                        $("#userUpdatedInfoHolder", element).empty();
                        if (user.UpdateDate != null) {
                            let updateByName = user.UpdateBy;
                            let updateByProfile = possibleUsers.find(u => u.UserId == user.UpdateBy);
                            if (updateByProfile != null) {
                                updateByName = updateByProfile.UserFullName
                            }
                            $("#userUpdatedInfoHolder", element).append("<span>" + updateByName + " (<b>" + new Date(user.UpdateDate).toLocaleDateString() + "</b>)</span>");
                        }
                        GetCurrentEmployeeIds(user.UserId, function () {
                            RenderCurrentEmployeeIds(user.UserEmployeeIds);
                        });

                        LoadTeamInformationForUser(user.UserId);
                        LoadUserAssistItems(user.UserId, function () {
                            RenderUserAssistItems();
                        });
                        LoadUserStats(user.UserId);
                        LoadUserBudgetLedger(user);
                        LoadUserAttributes(user.UserId);
                        LoadUserAssignments(user.UserId, function () {
                            RenderUserAssignments();
                        });
                        DisplayEditorTabs(user);
                    }
                    if (callback != null) {
                        callback();
                    }
                }, 500);
            }
            function GetTeamsForUser(userId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getUserTeamsByUserId",
                        userid: userId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage != "") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            var userTeamList = $.parseJSON(data.userTeamList);
                            if (userTeamList != null) {
                                let userProfileIndex = possibleUsers.findIndex(u => u.UserId == userId);
                                if (userProfileIndex >= 0 && possibleUsers[userProfileIndex].Teams != null && possibleUsers[userProfileIndex].Teams.length == 0) {
                                    possibleUsers[userProfileIndex].Teams = userTeamList;
                                }
                                if (callback != null) {
                                    callback(userTeamList);
                                }
                            }
                        }
                    }
                });
            }
            function LoadTeamInformationForUser(userId, callback) {
                let user = possibleUsers.find(u => u.UserId == userId);
                let isAgent = false;
                if (user != null) {
                    isAgent = (user.UserRole.toUpperCase() == "CSR".toUpperCase());
                    //let userTeams = user.Teams;
                    if (user.Teams == null || user.Teams.length == 0) {
                        GetTeamsForUser(user.UserId);
                        user = possibleUsers.find(u => u.UserId == userId);
                    }
                    $("#currentUserTeamInfoHolder", element).empty();
                    $("#userTeamHistoryInfoHolder", element).empty();
                    if (user.Teams != null && user.Teams.length > 0) {

                        for (let tc = 0; tc < user.Teams.length; tc++) {
                            let userTeamItem = user.Teams[tc];
                            let isCurrentTeam = false;
                            let isTeamSupervisor = userTeamItem.IsTeamSupervisor || false;
                            let today = new Date().toDateString();
                            let endDate = new Date(userTeamItem.RemovedFromTeamDate).toDateString();
                            let endDateString = new Date(userTeamItem.RemovedFromTeamDate).toLocaleDateString();
                            if (userTeamItem.RemovedFromTeamDate != null) {
                                isCurrentTeam = (new Date(endDate) >= new Date(today));
                            }
                            let userTeamInfoHolder = $("<div class=\"user-editor-form-team-row\" />");
                            let teamNameHolder = $("<div class=\"user-editor-team-name-holder\" />");
                            let teamDatesHolder = $("<div class=\"user-editor-team-assigned-date-holder\" />");
                            let userTeamDates = "";

                            let teamName = userTeamItem.TeamId;

                            if (userTeamItem.TeamIdSource != null) {
                                teamName = userTeamItem.TeamIdSource.TeamName;
                            }
                            if (isCurrentTeam) {
                                userTeamDates = new Date(userTeamItem.AssignedToTeamDate).toLocaleDateString() + " - <strong>today</strong>";
                            }
                            else {
                                userTeamDates = new Date(userTeamItem.AssignedToTeamDate).toLocaleDateString() + " - " + endDateString;
                            }
                            teamNameHolder.append(teamName);
                            if (isTeamSupervisor == true) {
                                let supervisorLabel = $("<span class=\"user-editor-is-team-supervisor-label\" />");
                                supervisorLabel.append(" (Supervisor) ");
                                teamNameHolder.append(supervisorLabel);
                            }
                            teamDatesHolder.append(userTeamDates);

                            userTeamInfoHolder.append(teamNameHolder);
                            userTeamInfoHolder.append(teamDatesHolder);

                            if (isCurrentTeam == true) {
                                userTeamInfoHolder.addClass("current-team-item");
                                $("#currentUserTeamInfoHolder", element).append(userTeamInfoHolder);
                            }
                            else {
                                userTeamInfoHolder.addClass("history-team-item");
                                $("#userTeamHistoryInfoHolder", element).append(userTeamInfoHolder);

                            }
                        }
                    }
                }
                HandleChangeUserTeamButton(isAgent);
            }
            function SortAvailableTeams() {
                availableTeams = $(availableTeams).sort((a, b) => (a.TeamName > b.TeamName) ? 1 : (a.TeamName === b.TeamName) ? ((a.GroupIdSource?.GroupName > b.GroupIdSource?.GroupName) ? 1 : -1) : -1).toArray();
            }
            function SortAvailableGroups() {
                availableGroups = $(availableGroups).sort((a, b) => (a.GroupName > b.GroupName) ? 1 : 0).toArray();
            }
            function GetCurrentEmployeeIds(userId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getUserEmployeeIdList",
                        userid: userId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage != "") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            var userEmployeeIdList = $.parseJSON(data.userEmployeeIdList);
                            if (userEmployeeIdList != null) {
                                let userProfileIndex = possibleUsers.findIndex(u => u.UserId == userId);
                                if (userProfileIndex >= 0 && possibleUsers[userProfileIndex].UserEmployeeIds != null && possibleUsers[userProfileIndex].UserEmployeeIds.length == 0) {
                                    possibleUsers[userProfileIndex].UserEmployeeIds = userEmployeeIdList;
                                }
                                if (callback != null) {
                                    callback(userEmployeeIdList);
                                }
                            }
                        }
                    }
                });
            }
            function RenderCurrentEmployeeIds(currentEmployeeIds) {
                $("#employeeIdListHolder", element).empty();

                let noEmployeeIdFoundString = "No Employee ID items found for this user.";
                if (currentEmployeeIds != null && currentEmployeeIds.length > 0) {
                    for (var i = 0; i < currentEmployeeIds.length; i++) {
                        let item = currentEmployeeIds[i];
                        let employeeIdType = possibleEmployeeTypeIds.find(i => i.IdType == item.UserIdTypeId);

                        let employeeIdDataRow = $("<div class=\"user-editor-form-employee-id-row\" />");
                        let employeeIdValueHolder = $("<div class=\"user-editor-form-employee-id-holder\" />");
                        employeeIdValueHolder.append(item.EmployeeIdValue);

                        let employeeIdTypeHolder = $("<div class=\"user-editor-form-employee-id-value\" />");
                        let employeeIdTypeName = item.UserIdTypeId;
                        if (employeeIdType != null) {
                            employeeIdTypeName = employeeIdType.IdTypeDesc;
                        }
                        employeeIdTypeHolder.append(employeeIdTypeName);

                        let employeeIdEnterDateHolder = $("<div class=\"user-editor-form-employee-id-date\" />");
                        employeeIdEnterDateHolder.append(new Date(item.EnterDate).toLocaleDateString());;

                        let employeeIdButtonHolder = $("<div class=\"line-item-button-holder\" />");

                        let employeeIdDeleteButton = $("<button  id=\"deleteEmployeeId_" + item.RecordId + "\" class=\"button btn btn-delete\"><i class=\"fas fa-trash\"></i></button>");
                        $(employeeIdDeleteButton, element).off("click").on("click", function () {
                            let buttonId = this.id;
                            let idToEdit = buttonId.split('_')[1];
                            let userId = $("#userId", element).val();
                            ConfirmDeleteEmployeeId(idToEdit, userId, function () {
                                DeleteEmployeeId(idToEdit, userId, function () {
                                    ShowEmployeeIdContainer();
                                });
                            });
                        });
                        employeeIdButtonHolder.append(employeeIdDeleteButton);

                        employeeIdDataRow.append(employeeIdValueHolder);
                        employeeIdDataRow.append(employeeIdTypeHolder);
                        employeeIdDataRow.append(employeeIdEnterDateHolder);
                        employeeIdDataRow.append(employeeIdButtonHolder);

                        $("#employeeIdListHolder", element).append(employeeIdDataRow);
                    }
                }
                else {
                    $("#employeeIdListHolder", element).append("<div class=\"\">" + noEmployeeIdFoundString + "</div>");
                }
            }
            function DeleteEmployeeId(idToDelete, userId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "deleteUserEmployeeId",
                        recordid: idToDelete,
                        userid: userId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage != "") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            let currentUserIdList = $.parseJSON(data.userEmployeeIdList);
                            HandleReturnEmployeeIdList(userId, currentUserIdList);
                            if (callback != null) {
                                callback();
                            }
                        }
                    }
                });
            }
            function ValidateAddNewEmployeeId(callback) {
                $(".error-information-holder", element).empty();
                var formValid = true;
                var errorMessages = [];
                var employeeIdValue = $("#newEmployeeIdInput", element).val();
                //var goalMetric = $(".user-goal-manager-editor-goal-metric", element).val();
                var employeeIdType = $("#employeeTypeIdInput", element).val();

                if (employeeIdValue == "") {
                    errorMessages.push({ message: "Value", fieldclass: "", fieldid: "newEmployeeIdInput" });
                    formValid = false;
                }

                if (employeeIdType == "") {
                    errorMessages.push({ message: "Type Required", fieldclass: "", fieldid: "employeeTypeIdInput" });
                    formValid = false;
                }

                if (formValid) {
                    if (callback != null) {
                        callback();
                    }
                }
                else {
                    var messageString = "";
                    for (var m = 0; m < errorMessages.length; m++) {
                        let item = errorMessages[m];

                        if (item.fieldclass != "") {
                            $(item.fieldclass, element).addClass("errorField");
                            $(item.fieldclass, element).off("blur").on("blur", function () {
                                $(this).removeClass("errorField");
                            });
                        }
                        else if (item.fieldid != "") {
                            $("#" + item.fieldid, element).addClass("errorField");
                            $("#" + item.fieldid, element).off("blur").on("blur", function () {
                                $(this).removeClass("errorField");
                            });
                        }
                    }
                }
            }
            function AddNewEmployeeId(employeeIdObject, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "saveUserEmployeeId",
                        useremployeeid: JSON.stringify(employeeIdObject)
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage != "") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            let currentUserIdList = $.parseJSON(data.userEmployeeIdList);
                            HandleReturnEmployeeIdList(employeeIdObject.UserId, currentUserIdList);
                            if (callback != null) {
                                callback();
                            }
                        }
                    }
                });
            }
            function CollectNewEmployeeIdFromForm() {
                let returnObject = new Object();
                returnObject.RecordId = 0;
                returnObject.UserId = $("#userId", element).val();
                returnObject.UserIdTypeId = $("#employeeTypeIdInput", element).val();
                returnObject.LocationId = null;
                returnObject.EmployeeIdValue = $("#newEmployeeIdInput", element).val();
                returnObject.EnterDate = new Date().toLocaleDateString("en-US");

                return returnObject;
            }
            function ConfirmDeleteEmployeeId(idToDelete, userId, callback) {
                let userName = userId;
                let user = possibleUsers.find(u => u.UserId == userId);
                if (user != null) {
                    userName = user.UserFullName;
                }

                if (confirm("You are about to remove this Employee Identifier for " + userName + ". \nProceeding with this operation will require you to re-enter this information.\n\nPress OK to continue or CANCEL to not remove.")) {
                    callback();
                }
            }
            function HandleReturnEmployeeIdList(userId, currentUserIdList) {
                let userIndex = possibleUsers.findIndex(u => u.UserId == userId);
                if (userIndex >= 0) {
                    if (currentUserIdList != null) {
                        possibleUsers[userIndex].UserEmployeeIds.length = 0;
                        for (var i = 0; i < currentUserIdList.length; i++) {
                            possibleUsers[userIndex].UserEmployeeIds.push(currentUserIdList[i]);
                        }
                    }
                    RenderCurrentEmployeeIds(possibleUsers[userIndex].UserEmployeeIds);
                }
            }
            function GenerateDefaultEmployeeIds(callback) {
                let userId = $("#userId", element).val();
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "generateDefaultUserEmployeeId",
                        userid: userId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage != "") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            let currentUserIdList = $.parseJSON(data.userEmployeeIdList);
                            HandleReturnEmployeeIdList(userId, currentUserIdList);
                            if (callback != null) {
                                callback();
                            }
                        }
                    }
                });
            }
            function SavePasswordChangeForm(callback) {
                let changeInfo = new Object();
                changeInfo.UserId = $("#userResetPasswordUserId", element).val();;
                changeInfo.Data = $("#userEditorResetPassword", element).val();

                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "saveUserData1",
                        userdata: JSON.stringify(changeInfo)
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage != "") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            if (callback != null) {
                                callback(data);
                            }
                        }
                    }
                });
            }
            function ClearEditorForm(callback) {
                $("#userId", element).val("");
                $("#userId", element).prop("readonly", false);
                $("#userId", element).prop("disabled", false);
                $("#userId", element).off("blur").on("blur", function () {
                    CheckUserIdAvailable();
                });
                $("#userEmployeeId", element).val("");
                $("#userFirstName", element).val("");
                $("#userLastName", element).val("");
                $("#userRole", element).val("");
                $("#userHireDate", element).val("");
                $("#userTermDate", element).val("");
                $("#userStatus", element).val("A");
                $("#userEmailAddress", element).val("");
                $("#userEmployeeType", element).val("1");
                $("#userCreatedInfoHolder", element).empty();
                $("#userUpdatedInfoHolder", element).empty();

                $(".user-manager-user-id-available", element).removeClass("green-check");
                $(".user-manager-user-id-available", element).removeClass("red-check");
                $(".user-manager-user-id-available", element).removeClass("yellow-check");
                $(".user-id-available-status", element).empty();

                $("#teamListHolder", element).empty();
                $("#employeeIdListHolder", element).empty();

                $("input,select", element).each(function () {
                    $(this).removeClass("errorField");
                });
                $(".error-information-holder", element).empty();

                ClearAssistForm();
                ClearPasswordChangeForm();
                ClearNewEmployeeIdForm();
                ClearUserArrays();
                ClearChangeUserTeamForm();
                ClearUserAssignmentsForm();

                currentUserGroups.length = 0;
                currentUserLocations.length = 0;

                if (callback != null) {
                    callback();
                }
            }
            function ClearUserArrays() {
                userAssistItemsGroup.length = 0;
                userAssistItemsTeam.length = 0;
                currentUserProfileStats.length = 0;
            }
            function ClearNewEmployeeIdForm() {
                $("#newEmployeeIdInput", element).val("");
                $("#employeeTypeIdInput", element).val("");
            }
            function ClearPasswordChangeForm() {
                $("#userEditorResetPassword", element).val("");
            }
            function ClearAssistForm() {
                $("#userManager_AssistTeamInput", element).val("");
                $("#userManager_AssistGroupInput", element).val("");
            }
            function ClearChangeUserTeamForm() {
                $("#userChangeTeamUserId", element).val("");
                $("#userChangeTeamCurrentTeamId", element).val(-1);
                $("#userChangeTeamNewTeamSelector", element).val("");
                $("#userChangeTeamStartDate", element).val("");

                $("#userChangeTeamUserIdLabel", element).empty();
                $("#userChangeTeamCurrentUserTeamLabel", element).empty();


                $("input,select", $("#userEditorChangeUserTeamAssignmentPanel", element)).each(function () {
                    $(this).removeClass("errorField");
                });
            }
            function ClearUserAssignmentsForm() {
                $("#userManager_AssignUserGroupInput", element).val("");
                $("#userAssignedGroupListHolder", element).empty();
                $("#userAssignedTeamGroupHolder", element).empty();                
                $("#lblUserInactiveDate", element).empty();
            }
            function ValidateUserForm(callback) {
                $(".error-information-holder", element).empty();
                var formValid = true;
                var errorMessages = [];

                let employeeType = $("#userEmployeeType", element).val();
                let userId = $("#userId", element).val();
                let firstName = $("#userFirstName", element).val();
                let lastName = $("#userLastName", element).val();
                let userRole = $("#userRole", element).val();
                let hireDate = $("#userHireDate", element).val();
                let termDate = $("#userTermDate", element).val();
                let userStatus = $("#userStatus", element).val();                
                let userEmail = $("#userEmailAddress", element).val();

                if (employeeType == "") {
                    errorMessages.push({ message: "Employee Type Required", fieldclass: "", fieldid: "userEmployeeType" });
                    formValid = false;
                }
                if (userId == "") {
                    errorMessages.push({ message: "User Id Required", fieldclass: "", fieldid: "userId" });
                    formValid = false;
                }
                if (userId != "" && userId.length < 3) {
                    errorMessages.push({ message: "User Id must be at least 3 characters long", fieldclass: "", fieldid: "userId" });
                    formValid = false;
                }
                if (firstName == "") {
                    errorMessages.push({ message: "First Name Required", fieldclass: "", fieldid: "userFirstName" });
                    formValid = false;
                }
                if (lastName == "") {
                    errorMessages.push({ message: "Last Name Required", fieldclass: "", fieldid: "userLastName" });
                    formValid = false;
                }
                if (userRole == "") {
                    errorMessages.push({ message: "Role Required", fieldclass: "userRole", fieldid: "userRole" });
                    formValid = false;
                }

                if (formValid) {
                    if (callback != null) {
                        callback();
                    }
                } else {
                    var messageString = "";
                    if (errorMessages.length > 0) {
                        messageString += "<i class=\"fas fa-exclamation-triangle\"></i> <strong>Correct the following errors:</strong> <ul>";
                    }
                    for (var m = 0; m < errorMessages.length; m++) {
                        let item = errorMessages[m];

                        messageString += "<li>" + item.message + "</li>";
                        if (item.fieldclass != "") {
                            $(item.fieldclass, element).addClass("errorField");
                            $(item.fieldclass, element).off("blur").on("blur", function () {
                                $(this).removeClass("errorField");
                            });
                        }
                        else if (item.fieldid != "") {
                            $("#" + item.fieldid, element).addClass("errorField");
                            $("#" + item.fieldid, element).off("blur").on("blur", function () {
                                $(this).removeClass("errorField");
                            });
                        }
                    }
                    if (messageString != "") {
                        messageString += "</ul>";

                        $(".error-information-holder", element).html(messageString);
                        $(".error-information-holder", element).show();
                    }

                }
            }
            function SaveEditorForm(callback) {
                var userToSave = CollectFormDataForUser();
                SaveUser(userToSave, function () {
                    HandleUserListLoad(true, function () {
                        HideEditorForm();
                    });
                });
                if (callback != null) {
                    callback();
                }
            }
            function SaveUser(userObject, callback) {
                // let saveAction = $(".editor-form-user-type", element).val() || "add";
                let saveAction = $("#editorFormType", element).val() || "add";

                if (saveAction == null || saveAction == "") {
                    saveAction = "add";
                }

                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "saveUser",
                        userdata: JSON.stringify(userObject),
                        saveaction: saveAction.toLowerCase()
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage != "") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            let returnData = JSON.parse(data.userProfile);
                            if (callback != null) {
                                callback(returnData);
                            }
                        }
                    }
                });
            }
            function CollectFormDataForUser() {
                let userStatusValue = $("#userStatus", element).val();
                let userStatus = "1";
                if (userStatusValue != null && userStatusValue != "") {
                    let userStatusObject = statusOptions.find(o => o.StatusCode == userStatusValue || o.StatusId == userStatusValue);
                    if (userStatusObject != null) {
                        userStatus = userStatusObject.StatusId;
                    }
                }

                let returnObject = new Object();
                returnObject.UserId = $("#userId", element).val();
                returnObject.EmployeeId = $("#userEmployeeId", element).val();
                returnObject.FirstName = $("#userFirstName", element).val();
                returnObject.LastName = $("#userLastName", element).val();
                returnObject.UserStatus = userStatus;
                returnObject.UserRole = $("#userRole", element).val();
                returnObject.EmailAddress = $("#userEmailAddress", element).val();
                returnObject.EmployeeTypeId = $("#userEmployeeType", element).val();
                let hireDate = $("#userHireDate", element).val();

                if (hireDate != null && hireDate != "") {
                    returnObject.HireDate = new Date(hireDate).toLocaleDateString();
                }
                else {
                    returnObject.HireDate = null;
                }
                returnObject.InactiveDate = null;
                let termDate = $("#userTermDate", element).val();
                if(termDate != null && termDate != "")
                {
                    returnObject.InactiveDate = new Date(termDate).toLocaleDateString();
                }
                returnObject.CurrentLoginDate = null;
                returnObject.PreviousLoginDate = null;
                returnObject.AvatarImageFileName = null;
                returnObject.EnterDate = new Date().toLocaleDateString("en-US");
                returnObject.EnterBy = legacyContainer.scope.TP1Username;
                returnObject.UpdateDate = new Date().toLocaleDateString("en-US");
                returnObject.UpdateBy = legacyContainer.scope.TP1Username;

                return returnObject;
            }
            function CheckUserIdAvailable(callback) {
                let userId = $("#userId", element).val();
                if (userId != null && userId != "" && userId.length >= 3) {
                    $(".user-manager-user-id-available", element).removeClass("green-check");
                    $(".user-manager-user-id-available", element).removeClass("red-check");
                    $(".user-manager-user-id-available", element).addClass("yellow-check");
                    $(".user-manager-user-id-available", element).empty();

                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "userprofile",
                            cmd: "checkUserIdAvailable",
                            userid: userId
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            if (data.errormessage != null && data.errormessage != "") {
                                a$.jsonerror(data);
                                return;
                            }
                            else {
                                let isAvailable = (data.useridAvailable == "true") || false;
                                let userIdStatus = "User Id not available";
                                $(".user-manager-user-id-available", element).removeClass("green-check");
                                $(".user-manager-user-id-available", element).removeClass("red-check");
                                $(".user-manager-user-id-available", element).removeClass("yellow-check");
                                $(".user-manager-user-id-available", element).empty();
                                if (isAvailable == true) {
                                    $(".user-manager-user-id-available", element).addClass("green-check");
                                    $(".user-manager-user-id-available", element).addClass("fa-check-circle");
                                    $(".user-manager-user-id-available", element).removeClass("fa-times-circle");
                                    $(".user-manager-editor-save-btn", element).removeAttr("disabled");
                                    userIdStatus = "Available";
                                }
                                else {
                                    $(".user-manager-user-id-available", element).addClass("red-check");
                                    $(".user-manager-user-id-available", element).addClass("fa-times-circle");
                                    $(".user-manager-user-id-available", element).removeClass("fa-check-circle");
                                    $(".user-manager-editor-save-btn", element).attr("disabled", true);
                                }
                                $(".user-manager-user-id-available", element).append("<b class=\"user-id-available-status\"> " + userIdStatus + "</b>");
                                if (callback != null) {
                                    callback();
                                }
                            }
                        }
                    });
                }
                else {
                    $(".user-manager-user-id-available", element).removeClass("green-check");
                    $(".user-manager-user-id-available", element).removeClass("red-check");
                    $(".user-manager-user-id-available", element).removeClass("yellow-check");
                }

            }
            function ClearFilters(callback) {
                $("#userManager_RoleFilter", element).val("");
                $("#userManager_TypeFilter", element).val("");
                $("#userManager_TeamFilter", element).val("")
                $("#userManager_firstNameFilter", element).val("");
                $("#userManager_lastNameFilter", element).val("");
                $("#userManager_userStatus", element).val("1");

                if (callback != null) {
                    callback();
                }
            }
            function WriteUserLoadingMessage(messageToWrite) {
                $("#userLoadingMessage", element).empty();
                $("#userLoadingMessage", element).append(messageToWrite);
                ShowUserLoadingMessage();
            }
            function LoadPasswordChangeForm(userIdToChange, callback) {
                if (userIdToChange == null) {
                    userIdToChange = $("#userId", element).val();
                }
                $("#userResetPasswordUserId", element).val(userIdToChange);
                let userName = userIdToChange;
                let user = possibleUsers.find(u => u.UserId == userIdToChange);
                if (user != null) {
                    userName = user.UserFullName;
                }

                $("#userResetPasswordUserIdLabel", element).empty();
                $("#userResetPasswordUserIdLabel", element).text(userName);

                if (callback != null) {
                    callback();
                }
            }
            function LoadUserAssistItems(userId, callback) {
                LoadUserAssistTeamItems(userId, function () {
                    LoadUserAssistGroups(userId, function () {
                        if (callback != null) {
                            callback();
                        }
                    });
                });
            }
            function RenderUserAssistItems(callback) {
                RenderUserAssistTeamItems();
                RenderUserAssistGroupItems();
                if (callback != null) {
                    callback();
                }
            }
            function LoadUserAssistTeamItems(userId, callback) {
                if (userAssistItemsTeam != null && userAssistItemsTeam.length > 0) {
                    if (callback != null) {
                        callback(userAssistItemsTeam);
                    }
                }
                else {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "getAssistantsByUserId",
                            userid: userId
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            if (data.errormessage != null && data.errormessage != "") {
                                a$.jsonerror(data);
                                return;
                            }
                            else {
                                var supervisorTeamList = JSON.parse(data.supervisorTeamList);
                                userAssistItemsTeam.length = 0;
                                userAssistItemsTeam = supervisorTeamList;
                                if (callback != null) {
                                    callback(supervisorTeamList);
                                }
                            }
                        }
                    });
                }
            }
            function RenderUserAssistTeamItems(listToRender, callback) {
                if (listToRender == null) {
                    listToRender = userAssistItemsTeam;
                }
                $("#employeeAssistTeamListHolder", element).empty();
                let assistingListHolder = $("<div class=\"sub-form-list-holder\" />");

                if (listToRender.length > 0) {
                    for (let alc = 0; alc < listToRender.length; alc++) {
                        let assistItem = listToRender[alc];

                        let teamAssistingRow = $("<div class=\"sub-item-form-row-holder\" />");

                        let teamNameHolder = $("<div class=\"sub-item-inline-form-item-holder\" />");
                        let teamName = assistItem.TeamId;
                        if (assistItem.TeamIdSource != null) {
                            teamName = assistItem.TeamIdSource.TeamName
                        }
                        teamNameHolder.append(teamName);

                        let teamButtonHolder = $("<div class=\"line-item-button-holder\" />");
                        let removeAssistTeamButton = $("<button class=\"button btn btn-delete\" id=\"removeAssistTeam_" + assistItem.TeamId + "_" + assistItem.UserId + "\"><i class=\"fa fa-trash\"></i></button>");
                        removeAssistTeamButton.on("click", function () {
                            let id = this.id;
                            let teamId = id.split("_")[1];
                            let userId = id.split("_")[2];
                            ConfirmRemoveTeamAssist(teamId, userId, function () {
                                RemoveUserFromTeamAssist(teamId, userId, function () {
                                    LoadUserAssistTeamItems(userId, function () {
                                        RenderUserAssistTeamItems();
                                    });
                                });
                            });
                        });

                        teamButtonHolder.append(removeAssistTeamButton);

                        teamAssistingRow.append(teamNameHolder);
                        teamAssistingRow.append(teamButtonHolder);

                        assistingListHolder.append(teamAssistingRow);
                    }
                }
                else {
                    assistingListHolder.append("No team assists found.");
                }

                $("#employeeAssistTeamListHolder", element).append(assistingListHolder);
                if (callback != null) {
                    callback();
                }
            }
            function ValidateAddUserAssistanceToTeam(callback) {
                $(".error-information-holder", element).empty();
                var formValid = true;
                var errorMessages = [];
                let teamIdValue = $("#userManager_AssistTeamInput", element).val();

                if (teamIdValue == "") {
                    errorMessages.push({ message: "Value", fieldclass: "", fieldid: "userManager_AssistTeamInput" });
                    formValid = false;
                }

                if (formValid) {
                    if (callback != null) {
                        callback();
                    }
                }
                else {
                    var messageString = "";
                    for (var m = 0; m < errorMessages.length; m++) {
                        let item = errorMessages[m];

                        if (item.fieldclass != "") {
                            $(item.fieldclass, element).addClass("errorField");
                            $(item.fieldclass, element).off("blur").on("blur", function () {
                                $(this).removeClass("errorField");
                            });
                        }
                        else if (item.fieldid != "") {
                            $("#" + item.fieldid, element).addClass("errorField");
                            $("#" + item.fieldid, element).off("blur").on("blur", function () {
                                $(this).removeClass("errorField");
                            });
                        }
                    }
                }
            }
            function AddUserToTeamForAssistance(callback) {
                let userId = $("#userManager_UserId", element).val();
                let teamId = $("#userManager_AssistTeamInput", element).val();
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "assignUserToTeamForAssist",
                        userid: userId,
                        teamid: teamId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage != "") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            userAssistItemsTeam.length = 0;
                            if (callback != null) {
                                callback();
                            }
                        }
                    }
                });
            }
            function ConfirmRemoveTeamAssist(teamId, userId, callback) {
                let userName = userId;
                let teamName = teamId;

                let user = possibleUsers.find(u => u.UserId == userId);
                let team = availableTeams.find(t => t.TeamId == teamId);

                if (user != null) {
                    userName = user.UserFullName;
                }
                if (team != null) {
                    teamName = team.TeamName;
                }
                if (confirm("You are about to remove " + userName + " as an assist from " + teamName + ".\nProceeding with this operation will require you to re-enter this information.\n\nPress OK to continue or CANCEL to not remove.")) {
                    callback();
                }
            }
            function RemoveUserFromTeamAssist(teamId, userId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "removeUserFromTeamAssistant",
                        userid: userId,
                        teamid: teamId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage != "") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            userAssistItemsTeam.length = 0;
                            if (callback != null) {
                                callback();
                            }
                        }
                    }
                });

            }
            function LoadUserAssistGroups(userId, callback) {
                if (userAssistItemsGroup != null && userAssistItemsGroup.length > 0) {
                    if (callback != null) {
                        callback(userAssistItemsGroup);
                    }
                }
                else {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "getGroupAssistantsByUserId",
                            userid: userId
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            if (data.errormessage != null && data.errormessage != "") {
                                a$.jsonerror(data);
                                return;
                            }
                            else {
                                var supervisorGroupList = JSON.parse(data.supervisorGroupList);
                                userAssistItemsGroup.length = 0;
                                userAssistItemsGroup = supervisorGroupList;
                                if (callback != null) {
                                    callback(supervisorGroupList);
                                }
                            }
                        }
                    });
                }
            }
            function RenderUserAssistGroupItems(listToRender, callback) {
                if (listToRender == null) {
                    listToRender = userAssistItemsGroup;
                }
                $("#employeeAssistGroupListHolder", element).empty();
                let assistingListHolder = $("<div class=\"assistgroup-row-holder\" />");

                if (listToRender.length > 0) {
                    for (let alc = 0; alc < listToRender.length; alc++) {
                        let assistItem = listToRender[alc];

                        let groupAssistingRow = $("<div class=\"sub-item-form-row-holder\" />");

                        let groupNameHolder = $("<div class=\"sub-item-inline-form-item-holder\" />");
                        let groupName = assistItem.GroupId;
                        if (assistItem.GroupIdSource != null) {
                            groupName = assistItem.GroupIdSource.GroupName
                        }
                        groupNameHolder.append(groupName);

                        let groupButtonHolder = $("<div class=\"line-item-button-holder\" />");
                        let removeAssistGroupButton = $("<button class=\"button btn btn-delete\" id=\"removeAssistGroup_" + assistItem.GroupId + "_" + assistItem.UserId + "\"><i class=\"fa fa-trash\"></i></button>");
                        removeAssistGroupButton.on("click", function () {
                            let id = this.id;
                            let groupId = id.split("_")[1];
                            let userId = id.split("_")[2];
                            ConfirmRemoveGroupAssist(groupId, userId, function () {
                                RemoveUserFromGroupAssist(groupId, userId, function () {
                                    LoadUserAssistGroups(userId, function () {
                                        RenderUserAssistGroupItems();
                                    });
                                });
                            });
                        });

                        groupButtonHolder.append(removeAssistGroupButton);

                        groupAssistingRow.append(groupNameHolder);
                        groupAssistingRow.append(groupButtonHolder);

                        assistingListHolder.append(groupAssistingRow);
                    }
                }
                else {
                    assistingListHolder.append("No group assists found.");
                }

                $("#employeeAssistGroupListHolder", element).append(assistingListHolder);
                if (callback != null) {
                    callback();
                }
            }
            function ValidateAddUserAssistanceToGroup(callback) {
                $(".error-information-holder", element).empty();
                var formValid = true;
                var errorMessages = [];
                let groupIdValue = $("#userManager_AssistGroupInput", element).val();

                if (groupIdValue == "") {
                    errorMessages.push({ message: "Value", fieldclass: "", fieldid: "userManager_AssistGroupInput" });
                    formValid = false;
                }

                if (formValid) {
                    if (callback != null) {
                        callback();
                    }
                }
                else {
                    var messageString = "";
                    for (var m = 0; m < errorMessages.length; m++) {
                        let item = errorMessages[m];

                        if (item.fieldclass != "") {
                            $(item.fieldclass, element).addClass("errorField");
                            $(item.fieldclass, element).off("blur").on("blur", function () {
                                $(this).removeClass("errorField");
                            });
                        }
                        else if (item.fieldid != "") {
                            $("#" + item.fieldid, element).addClass("errorField");
                            $("#" + item.fieldid, element).off("blur").on("blur", function () {
                                $(this).removeClass("errorField");
                            });
                        }
                    }
                }
            }
            function AddUserToGroupForAssistance(callback) {
                let userId = $("#userManager_UserId", element).val();
                let groupId = $("#userManager_AssistGroupInput", element).val();
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "assignUserToGroupForAssist",
                        userid: userId,
                        groupid: groupId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage != "") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            userAssistItemsGroup.length = 0;
                            if (callback != null) {
                                callback();
                            }
                        }
                    }
                });
            }
            function ConfirmRemoveGroupAssist(groupId, userId, callback) {
                let userName = userId;
                let groupName = groupId;

                let user = possibleUsers.find(u => u.UserId == userId);
                let group = availableGroups.find(g => g.GroupId == groupId);

                if (user != null) {
                    userName = user.UserFullName;
                }
                if (group != null) {
                    groupName = group.GroupName;
                }
                if (confirm("You are about to remove " + userName + " as an assist from " + groupName + ".\nProceeding with this operation will require you to re-enter this information.\n\nPress OK to continue or CANCEL to not remove.")) {
                    callback();
                }
            }
            function RemoveUserFromGroupAssist(groupId, userId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "removeUserFromGroupAssistant",
                        userid: userId,
                        groupid: groupId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage != "") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            userAssistItemsGroup.length = 0;
                            if (callback != null) {
                                callback();
                            }
                        }
                    }
                });
            }
            /* User Group Assignment START */
            function LoadUserAssignments(userId, callback) {
                RenderCurrentUserTeamGroup(userId);

                LoadUserGroupAssignments(userId, function () {
                    //LoadUserLocationAssignments(userId, function(){
                    if (callback != null) {
                        callback();
                    }
                    //});
                });
            }
            function RenderUserAssignments(callback) {
                RenderUserGroupAssignments();
                //RenderUserLocationAssignments();
                if (callback != null) {
                    callback();
                }
            }
            function LoadUserGroupAssignments(userId, callback) {
                if (currentUserGroups != null && currentUserGroups.length > 0) {
                    if (callback != null) {
                        callback(currentUserGroups);
                    }
                }
                else {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "getGroupAssignmentsByUserId",
                            userid: userId
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            if (data.errormessage != null && data.errormessage != "") {
                                a$.jsonerror(data);
                                return;
                            }
                            else {
                                let userGroupList = JSON.parse(data.userGroupList);
                                currentUserGroups.length = 0;
                                currentUserGroups = userGroupList;
                                if (callback != null) {
                                    callback(userGroupList);
                                }
                            }
                        }
                    });
                }
            }
            function RenderUserGroupAssignments(listToRender, callback) {
                if (listToRender == null) {
                    listToRender = currentUserGroups;
                }
                let userGroupAssignmentHolder = $("<div class=\"usergroup-row-holder\" />");

                $("#userAssignedGroupListHolder", element).empty();
                if (listToRender.length > 0) {
                    for (let ugIndex = 0; ugIndex < listToRender.length; ugIndex++) {
                        let userGroupItem = listToRender[ugIndex];
                        let userGroupRow = $("<div class=\"sub-item-form-row-holder\" />");
                        let userGroupNameHolder = $("<div class=\"sub-item-inline-form-item-holder\" />");
                        let groupName = userGroupItem.GroupId;
                        if (userGroupItem.GroupIdSource != null) {
                            groupName = userGroupItem.GroupIdSource.GroupName;
                        }
                        else {
                            let groupObject = availableGroups.find(g => g.GroupId == userGroupItem.GroupId);
                            if (groupObject != null) {
                                groupName = groupObject.GroupName;
                            }
                        }
                        userGroupNameHolder.append(groupName);
                        let userGroupButtonHolder = $("<div class=\"line-item-button-holder\" />");
                        let removeUserGroupButton = $("<button class=\"button btn btn-delete\" id=\"removeUserGroup_" + userGroupItem.GroupId + "_" + userGroupItem.UserId + "\"><i class=\"fa fa-trash\"></i></button>");
                        removeUserGroupButton.on("click", function () {
                            let id = this.id;
                            let groupId = id.split("_")[1];
                            let userId = id.split("_")[2];
                            ConfirmRemoveUserGroup(groupId, userId, function () {
                                RemoveUserFromGroup(groupId, userId, function () {
                                    LoadUserGroupAssignments(userId, function () {
                                        RenderUserGroupAssignments();
                                    });
                                });
                            });
                        });
                        userGroupButtonHolder.append(removeUserGroupButton);

                        userGroupRow.append(userGroupNameHolder);
                        userGroupRow.append(userGroupButtonHolder);

                        userGroupAssignmentHolder.append(userGroupRow);
                    }
                }
                else {
                    userGroupAssignmentHolder.append("No explicit user group assignments.");
                }


                $("#userAssignedGroupListHolder", element).append(userGroupAssignmentHolder);
                if (callback != null) {
                    callback();
                }
            }
            // function ValidateUserGroupAssignments(callback) {
            //     let isValidAssignment = true;
            //     let userRole = $("#userRole", element).val();
            //     let rIndex = validUserGroupAssignmentRoles.findIndex(i => i.toLowerCase() == userRole.toLowerCase());
            //     isValidAssignment = (rIndex > -1);

            //     if (isValidAssignment === true) {
            //         if (callback != null) {
            //             callback();
            //         }
            //     }
            //     else
            //     {
            //         console.log("Not valid assignment to save to user group.");
            //         return;
            //     }
            // }
            function ConfirmRemoveUserGroup(groupId, userId, callback) {
                let userName = userId;
                let groupName = groupId;

                let user = possibleUsers.find(u => u.UserId == userId);
                let group = availableGroups.find(g => g.GroupId == groupId);

                if (user != null) {
                    userName = user.UserFullName;
                }
                if (group != null) {
                    groupName = group.GroupName;
                }
                if (confirm("You are about to remove " + userName + " as an from the group named " + groupName + ".\nProceeding with this operation will require you to re-enter this information.\n\nPress OK to continue or CANCEL to not remove.")) {
                    callback();
                }
            }
            function RemoveUserFromGroup(groupId, userId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "removeUserFromGroup",
                        userid: userId,
                        groupid: groupId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage != "") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            currentUserGroups.length = 0;
                            if (callback != null) {
                                callback();
                            }
                        }
                    }
                });
            }
            function SaveUserGroupAssignments(callback) {
                let userRole = $("#userRole", element).val() || "";
                let userId = $("#userManager_UserId", element).val();
                if (userRole.toLowerCase() == "QA".toLowerCase() || userRole.toLowerCase() == "Quality Assurance".toLowerCase()) {
                    let groupId = $("#userManager_AssignUserGroupInput", element).val();
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "assignUserToGroup",
                            userid: userId,
                            groupid: groupId
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            if (data.errormessage != null && data.errormessage != "") {
                                a$.jsonerror(data);
                                return;
                            }
                            else {
                                if (callback != null) {
                                    callback(userId);
                                }
                            }
                        }
                    });
                }
                return userId;
            }
            function RenderCurrentUserTeamGroup(userId) {

                let userObject = possibleUsers.find(u => u.UserId == userId);
                $("#userAssignedTeamGroupHolder", element).empty();
                let currentUserTeamGroupHolder = $("<div class=\"usergroup-row-holder\" />");
                let selectedRole = GetSelectedRole();
                if (selectedRole.toLowerCase() == "GL".toLowerCase() || selectedRole.toLowerCase() == "Group Leader".toLowerCase()) {
                    LoadGroupsSupervisedByUser(userId, currentUserTeamGroupHolder);
                }
                else {

                    if (userObject != null && userObject.Teams != null && userObject.Teams.length > 0) {
                        if (userObject.Teams.length == 1) {
                            let teamObject = null;
                            if (userObject.Teams[0].TeamIdSource != null) {
                                teamObject = userObject.Teams[0].TeamIdSource;
                            }
                            else {
                                teamObject = availableTeams.find(t => t.TeamId == userObject.Teams[0].TeamId);
                            }
                            let teamGroupRowHolder = $("<div class=\"sub-item-form-row-holder\" />");
                            let groupName = teamObject.GroupId;
                            let groupObject = availableGroups.find(g => g.GroupId == teamObject.GroupId);

                            if (groupObject != null) {
                                groupName = groupObject.GroupName;
                            }
                            let groupNameHolder = $("<div class=\"sub-item-inline-form-item-holder\" />");
                            groupNameHolder.append(groupName);

                            let userGroupTeamButtonHolder = $("<div class=\"line-item-button-holder\" />");
                            userGroupTeamButtonHolder.append("(via Team)");

                            teamGroupRowHolder.append(groupNameHolder);
                            teamGroupRowHolder.append(userGroupTeamButtonHolder);

                            currentUserTeamGroupHolder.append(teamGroupRowHolder);
                        }
                        else {
                            userObject.Teams?.forEach(function (teamObject) {
                                let teamGroupRowHolder = $("<div class=\"sub-item-form-row-holder\" />");
                                let groupName = teamObject.GroupId;
                                let groupObject = availableGroups.find(g => g.GroupId == teamObject.GroupId);

                                if (groupObject != null) {
                                    groupName = groupObject.GroupName;
                                }
                                let groupNameHolder = $("<div class=\"sub-item-inline-form-item-holder\" />");
                                groupNameHolder.append(groupName);
                                let userGroupTeamButtonHolder = $("<div class=\"line-item-button-holder\" />");
                                userGroupTeamButtonHolder.append("&nbsp;");

                                teamGroupRowHolder.append(groupNameHolder);
                                teamGroupRowHolder.append(userGroupTeamButtonHolder);

                                currentUserTeamGroupHolder.append(teamGroupRowHolder);
                            });
                        }
                    }
                }
                $("#userAssignedTeamGroupHolder", element).append(currentUserTeamGroupHolder);
            }
            function LoadGroupsSupervisedByUser(userId, objectToRenderTo) {
                GetGroupsSupervisedByUser(userId, function (listToRender) {
                    RenderGroupsSupervised(listToRender, objectToRenderTo);
                });
            }
            function GetGroupsSupervisedByUser(userId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getBySupervisorUserId",
                        userid: userId,
                        deepLoad: false
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage != "") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            var supervisorGroupList = JSON.parse(data.supervisorGroupList);
                            currentUserSupervisorGroups.length = 0;
                            currentUserSupervisorGroups = supervisorGroupList;
                            if (callback != null) {
                                callback(supervisorGroupList);
                            }
                            else {
                                return supervisorGroupList;
                            }
                        }
                    }
                });
            }
            function RenderGroupsSupervised(listToRender, objectToRenderTo) {
                if(listToRender == null)
                {
                    listToRender = currentUserSupervisorGroups;
                }

                for(let gIndex = 0; gIndex < listToRender.length;gIndex++)
                {
                    let userGroupItem = listToRender[gIndex];
                    let groupRow = $("<div class=\"sub-item-form-row-holder\" />");

                    let groupName = userGroupItem.GroupName;

                    let groupNameHolder = $("<div class=\"sub-item-inline-form-item-holder\" />");
                    groupNameHolder.append(groupName);

                    let userGroupButtonHolder = $("<div class=\"line-item-button-holder\" />");
                    userGroupButtonHolder.append("&nbsp;");

                    groupRow.append(groupNameHolder);
                    groupRow.append(userGroupButtonHolder);

                    $(objectToRenderTo).append(groupRow);
                }
            }
            /* User Group Assignment END */
            /*User Budget Information*/
            function LoadUserBudgetLedger(userObject) {
                if (userObject != null) {
                    let userHasBudget = DoesUserRoleHaveBudgetOption(userObject.UserRole);
                    if (userHasBudget == true) {
                        GetBudgetLedgerForUser(userObject.UserId, function (ledgerList) {
                            RenderBudgetLedgerForUser(ledgerList);
                        });
                    }
                }
            }
            function GetBudgetLedgerForUser(userId, callback) {
                let returnList = [];
                if (currentUserBudgetLedger != null) {
                    returnList = currentUserBudgetLedger.filter(u => u.UserId == userId);
                }

                if (returnList == null || returnList.length == 0) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "getUserBudgetLedgerForUser",
                            userid: userId
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            if (data.errormessage != null && data.errormessage != "") {
                                a$.jsonerror(data);
                                return;
                            }
                            else {
                                if (data.userBudgetList != null) {
                                    returnList = JSON.parse(data.userBudgetList);
                                }
                            }
                        }
                    });
                }
                if (callback != null) {
                    callback(returnList);
                }
                else {
                    return returnList;
                }
            }
            function RenderBudgetLedgerForUser(listToRender, callback) {
                if (listToRender == null) {
                    listToRender = currentUserBudgetDollarLedger;
                }
                let dollarAmountRemaining = 0;
                let acuityAmountRemaining = 0;

                let dollarLedgerList = listToRender.filter(i => i.LedgerTypeId == BUDGET_DOLLAR_ALLOCATED || i.LedgerTypeId == BUDGET_DOLLAR_SPENT);
                let creditsLedgerList = listToRender.filter(i => i.LedgerTypeId == BUDGET_CREDITS_ALLOCATED || i.LedgerTypeId == BUDGET_CREDITS_SPENT);

                $("#userBudgetDollarsCurrentLedger", element).empty();
                $("#userBudgetCreditsCurrentLedger", element).empty();
                let userBudgetDollarListHolder = $("<div class=\"user-budget-list-holder\" />");
                let userBudgetCreditListHolder = $("<div class=\"user-budget-list-holder\" />");
                if (dollarLedgerList != null && dollarLedgerList.length > 0) {
                    dollarAmountRemaining = 0;
                    for (let bIndex = 0; bIndex < dollarLedgerList.length; bIndex++) {
                        let budgetItem = dollarLedgerList[bIndex];
                        let amount = budgetItem.BudgetAmount;
                        dollarAmountRemaining += parseFloat(amount);
                        let budgetListRowItemHolder = $("<div class=\"dollar-budget-item-row-holder\" />");
                        let transDesc = "&nbsp;";
                        let earnSpendItemHolder = $("<div class=\"dollar-budget-item-holder earn-spend\" />");

                        let earnSpendHolder = $("<label />");
                        let earnSpendItem = $("<i class=\"fa\" />");
                        if (amount >= 0) {
                            transDesc = "Earned";
                            earnSpendItem.addClass("fa-turn-down");
                            earnSpendItem.addClass("earned");
                            budgetListRowItemHolder.addClass("earned-budget");

                        }
                        else {
                            transDesc = "Spent";

                            earnSpendItem.addClass("fa-turn-down-left");
                            earnSpendItem.addClass("spent");
                            budgetListRowItemHolder.addClass("spent-budget");
                        }

                        if (budgetItem.LedgerTypeId == BUDGET_DOLLAR_ALLOCATED) {
                            transDesc = "Allocated";
                            budgetListRowItemHolder.removeClass("earned-budget");
                            budgetListRowItemHolder.removeClass("spent-budget");
                            budgetListRowItemHolder.addClass("allocated-budget");

                        }
                        earnSpendHolder.append(earnSpendItem);
                        earnSpendHolder.append("&nbsp;");
                        earnSpendItemHolder.append(earnSpendHolder);
                        let transDescItemHolder = $("<div class=\"dollar-budget-item-holder trans-desc\" />");
                        transDescItemHolder.append(transDesc);

                        let transactionDateItemHolder = $("<div class=\"dollar-budget-item-holder trans-date\" />");
                        let transDate = new Date(budgetItem.LedgerDate).toLocaleDateString();
                        transactionDateItemHolder.append(transDate);

                        let transactionAmountItemHolder = $("<div class=\"dollar-budget-item-holder trans-amount\" />");

                        transactionAmountItemHolder.append(Math.abs(amount).toLocaleString("en-US", { style: "currency", currency: "USD" }));


                        budgetListRowItemHolder.append(earnSpendItemHolder);
                        budgetListRowItemHolder.append(transDescItemHolder);
                        budgetListRowItemHolder.append(transactionDateItemHolder);
                        budgetListRowItemHolder.append(transactionAmountItemHolder);

                        userBudgetDollarListHolder.append(budgetListRowItemHolder);
                    }
                }
                else {
                    userBudgetDollarListHolder.append("No Monetary Budget items found for user.");
                }

                if (creditsLedgerList != null && creditsLedgerList.length > 0) {
                    creditAmountRemaining = 0;
                    for (let bIndex = 0; bIndex < creditsLedgerList.length; bIndex++) {
                        let budgetItem = creditsLedgerList[bIndex];
                        let amount = budgetItem.BudgetAmount;
                        acuityAmountRemaining += parseFloat(amount);
                        let budgetListRowItemHolder = $("<div class=\"credit-budget-item-row-holder\" />");
                        let transDesc = "&nbsp;";
                        let earnSpendItemHolder = $("<div class=\"credit-budget-item-holder earn-spend\" />");

                        let earnSpendHolder = $("<label />");
                        let earnSpendItem = $("<i class=\"fa\" />");
                        if (amount >= 0) {
                            transDesc = "Earned";
                            earnSpendItem.addClass("fa-turn-down");
                            earnSpendItem.addClass("earned");
                            budgetListRowItemHolder.addClass("earned-budget");

                        }
                        else {
                            transDesc = "Spent";
                            earnSpendItem.addClass("fa-turn-down-left");
                            earnSpendItem.addClass("spent");
                            budgetListRowItemHolder.addClass("spent-budget");
                        }

                        if (budgetItem.LedgerTypeId == BUDGET_CREDITS_ALLOCATED) {
                            transDesc = "Allocated";
                            budgetListRowItemHolder.removeClass("earned-budget");
                            budgetListRowItemHolder.removeClass("spent-budget");
                            budgetListRowItemHolder.addClass("allocated-budget");

                        }

                        earnSpendHolder.append(earnSpendItem);
                        earnSpendHolder.append("&nbsp;");
                        earnSpendItemHolder.append(earnSpendHolder);
                        let transDescItemHolder = $("<div class=\"credit-budget-item-holder trans-desc\" />");
                        transDescItemHolder.append(transDesc);

                        let transactionDateItemHolder = $("<div class=\"credit-budget-item-holder trans-date\" />");
                        let transDate = new Date(budgetItem.LedgerDate).toLocaleDateString();
                        transactionDateItemHolder.append(transDate);

                        let transactionAmountItemHolder = $("<div class=\"credit-budget-item-holder trans-amount\" />");

                        transactionAmountItemHolder.append(Math.abs(amount));


                        budgetListRowItemHolder.append(earnSpendItemHolder);
                        budgetListRowItemHolder.append(transDescItemHolder);
                        budgetListRowItemHolder.append(transactionDateItemHolder);
                        budgetListRowItemHolder.append(transactionAmountItemHolder);

                        userBudgetCreditListHolder.append(budgetListRowItemHolder);
                    }
                }
                else {
                    userBudgetCreditListHolder.append("No Acuity Credit Budget items found for user.");
                }

                $("#userBudgetDollarsCurrentLedger", element).append(userBudgetDollarListHolder);
                $("#userBudgetCreditsCurrentLedger", element).append(userBudgetCreditListHolder);

                HandleBudgetSubHeaderData(dollarAmountRemaining, acuityAmountRemaining);
                if (callback != null) {
                    callback();
                }
            }

            function HandleBudgetSubHeaderData(dollarAmountRemaining, acuityPointsRemaining) {
                if (dollarAmountRemaining == null) {
                    dollarAmountRemaining = 0;
                }
                if (acuityPointsRemaining == null) {
                    acuityPointsRemaining = 0;
                }

                let today = new Date();
                let endOfMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toLocaleDateString();

                $("#userBudgetDollarRemainingDate", element).empty();
                $("#userBudgetDollarRemainingDate", element).text(endOfMonthDate);

                $("#userBudgetCreditsRemainingDate", element).empty();
                $("#userBudgetCreditsRemainingDate", element).text(endOfMonthDate);

                $("#userBudgetDollarRemainingAmount", element).empty();
                $("#userBudgetDollarRemainingAmount", element).text(dollarAmountRemaining.toLocaleString("en-US", { style: "currency", currency: "USD" }));

                $("#userBudgetCreditsRemainingAmount", element).empty();
                $("#userBudgetCreditsRemainingAmount", element).text(acuityPointsRemaining);
            }
            /*User Budget Information End*/
            /*Change User Team Options*/
            function LoadChangeUserTeamForm(userId, callback) {
                if (userId == null || userId == "") {
                    userId = $("#userId", element).val();
                }
                $("#userChangeTeamUserId", element).val(userId);
                let userName = userId;
                let user = FindUserById(userId);
                let currentTeamId = -1;
                if (user != null) {
                    userName = user.UserFullName;
                    currentTeamId = user.CurrentTeamId;
                }
                $("#userChangeTeamCurrentTeamId", element).val(currentTeamId);

                $("#userChangeTeamUserIdLabel", element).empty();
                $("#userChangeTeamUserIdLabel", element).text(userName);

                let currentTeamName = currentTeamId;
                let team = FindTeamById(currentTeamId);

                if (team != null) {
                    currentTeamName = team.TeamName;
                    if (team.ProjectIdSource != null) {
                        currentTeamName += " (" + team.ProjectIdSource.ProjectDesc + ")";
                    }
                }
                if (currentTeamId == null || currentTeamId < 0) {
                    currentTeamName = "(No Team Assigned)";
                }
                $("#userChangeTeamCurrentUserTeamLabel", element).empty();
                $("#userChangeTeamCurrentUserTeamLabel", element).text(currentTeamName);

                let defaultStartDate = new Date().toLocaleDateString();
                $("#userChangeTeamStartDate", element).val(defaultStartDate);

                if (callback != null) {
                    callback();
                }
            }
            function ConfirmTeamChange(userId, oldTeamId, newTeamId, callback) {
                let userName = userId;
                let oldTeamName = oldTeamId;
                let newTeamName = newTeamId;
                let user = FindUserById(userId);
                let oldTeam = FindTeamById(oldTeamId);
                let newTeam = FindTeamById(newTeamId);
                let assignmentDate = new Date($("#userChangeTeamStartDate", element).val()).toLocaleDateString();
                if (user != null) {
                    userName = user.UserFullName;
                }
                if (oldTeam != null) {
                    oldTeamName = oldTeam.TeamName;
                    if (oldTeam.ProjectIdSource != null) {
                        oldTeamName += " (" + oldTeam.ProjectIdSource.ProjectDesc + ")";
                    }
                }
                else if (oldTeamId <= 0) {
                    oldTeamName = "No Previous Team";
                }
                if (newTeam != null) {
                    newTeamName = newTeam.TeamName;
                    if (newTeam.ProjectIdSource != null) {
                        newTeamName += " (" + newTeam.ProjectIdSource.ProjectDesc + ")";
                    }
                }
                let confirmMessage = "You are about to remove " + userName + " from the team of\n\t" + oldTeamName + "\nand assign them to the new team of\n\t" + newTeamName + "\n starting on " + assignmentDate + ".";
                if (oldTeamId <= 0) {
                    confirmMessage = "You will be adding " + userName + " to the team of " + newTeamName + ".\nThey will start on " + assignmentDate + ".";
                }
                else if (oldTeamId > 0 && (newTeamId == null || newTeamId == "" || newTeamId < 0)) {

                    confirmMessage = "You are about to remove " + userName + " from their old team of " + oldTeamName + ".\nThis will take place on " + assignmentDate + ".";
                }

                confirmMessage += "\n\nPress OK to continue or CANCEL to not proceed.";

                if (confirm(confirmMessage)) {
                    callback();
                }
            }
            function ValidateChangeUserTeamForm(callback) {
                $(".error-infomration-holder").empty();

                let isValidForm = true;
                let newTeamSelected = $("#userChangeTeamNewTeamSelector", element).val();
                let oldTeamId = $("#userChangeTeamCurrentTeamId", element).val();
                let newTeamStartDate = $("#userChangeTeamStartDate").val();
                let errorMessages = [];

                if (oldTeamId <= 0) {
                    if (newTeamSelected == null || newTeamSelected == "") {
                        isValidForm = false;
                        errorMessages.push({ message: "New Team Required", fieldclass: "", fieldid: "userChangeTeamNewTeamSelector" });
                    }
                }
                if (newTeamStartDate == null || newTeamStartDate == "") {
                    isValidForm = false;
                    errorMessages.push({ message: "Date Required", fieldclass: "", fieldid: "userChangeTeamStartDate" });
                }

                if (isValidForm == true) {
                    if (callback != null) {
                        callback();
                    }
                }
                else {
                    for (var m = 0; m < errorMessages.length; m++) {
                        let item = errorMessages[m];

                        if (item.fieldclass != "") {
                            $(item.fieldclass, element).addClass("errorField");
                            $(item.fieldclass, element).off("blur").on("blur", function () {
                                $(this).removeClass("errorField");
                            });
                        }
                        else if (item.fieldid != "") {
                            $("#" + item.fieldid, element).addClass("errorField");
                            $("#" + item.fieldid, element).off("blur").on("blur", function () {
                                $(this).removeClass("errorField");
                            });
                        }
                    }
                }
            }
            function SaveChangeUserTeamForm(callback) {
                ValidateChangeUserTeamForm(function () {
                    let userId = $("#userChangeTeamUserId", element).val();
                    let oldTeamId = $("#userChangeTeamCurrentTeamId", element).val();
                    let newTeamId = $("#userChangeTeamNewTeamSelector", element).val();
                    newTeamId == "" ? -1 : newTeamId;

                    ConfirmTeamChange(userId, oldTeamId, newTeamId, function () {
                        let effectiveDate = $("#userChangeTeamStartDate", element).val();

                        a$.ajax({
                            type: "POST",
                            service: "C#",
                            async: false,
                            data: {
                                lib: "selfserve",
                                cmd: "changeUserTeam",
                                userid: userId,
                                teamid: newTeamId,
                                effectivedate: effectiveDate,
                                updateby: legacyContainer.scope.TP1Username
                            },
                            dataType: "json",
                            cache: false,
                            error: a$.ajaxerror,
                            success: function (data) {
                                if (data.errormessage != null && data.errormessage != "") {
                                    a$.jsonerror(data);
                                    return;
                                }
                                else {
                                    let uIndex = possibleUsers.findIndex(u => u.UserId == userId);
                                    let updatedProfile = JSON.parse(data.userProfile);
                                    if (uIndex >= 0) {
                                        possibleUsers[uIndex] = updatedProfile;
                                    }
                                    if (callback != null) {
                                        callback(userId);
                                    }
                                }
                            }
                        });
                    })
                });
            }
            /*Change User Team Options End*/
            /*User Stats Information*/
            function LoadUserStats(userId, callback) {
                ko.postbox.publish("itemStatsTabLoad", { section: "csr", id: userId });
            }
            /*User Stats Information End*/
            /* User Termination Handling Start */
            function ConfirmUserTermination(callback)
            {
                let userId = $("#userTerminateUserId", element).val();
                let terminationDate = new Date($("#userTerminateUserOnDate", element).val()).toLocaleDateString();
                let userName = userId;
                let userObject = possibleUsers.find(u  => u.UserId == userId);
                if(userObject != null)
                {
                    userName = userObject.UserFullName;
                }
                if(confirm(`You are about to inactivate ${userName} for the date of ${terminationDate}.  This will remove any data that is after that date already in the database.\n\nPress OKAY to continue and mark user as inactive\nor\nCANCEL to stop this process.`))
                {
                    if(callback != null)
                    {
                        callback();
                    }
                }
            }
            function SaveUserTermination(callback)
            {
                ConfirmUserTermination(function(){
                    let userId = $("#userTerminateUserId", element).val();
                    let terminationDate = $("#userTerminateUserOnDate", element).val();
                    
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserv",
                            cmd: "setUserTerminated",
                            userid: userId,
                            termDate: terminationDate,
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            if (data.errormessage != null && data.errormessage != "") {
                                a$.jsonerror(data);
                                return;
                            }
                            else {
                                possibleUsers.length = 0;
                                if (callback != null) {
                                    callback();
                                }
                            }
                        }
                    });
                });
            }
            function ClearTerminationForm(callback)
            {
                $("#userTerminateUserId", element).val("");
                $("#userTerminateUserOnDate", element).val("");
                if(callback != null)
                {
                    callback();
                }
            }
            function LoadUserTerminationForm(callback, userId)
            {
                $("#userTerminateUserId", element).val(userId);
                let userObject = possibleUsers.find(u  => u.UserId == userId);
                let userName = userId;
                if(userObject != null)
                {
                    userName = userObject.UserFullName;
                }
                $("#userTerminateUserNameLabel", element).text(userName);

                if(callback != null)
                {
                    callback();
                }
            }
            /* User Termination Handling End */
            /*User Attributes Information*/
            function GetAttributesForUser(userId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getUserAttributesForUser",
                        userid: userId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage != "") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            var userAttributesList = JSON.parse(data.userAttributes);
                            if (userAttributesList != null) {
                                let userProfileIndex = possibleUsers.findIndex(u => u.UserId == userId);
                                if (userProfileIndex >= 0 && possibleUsers[userProfileIndex].UserAttributes != null && possibleUsers[userProfileIndex].UserAttributes.length == 0) {
                                    possibleUsers[userProfileIndex].UserAttributes = userAttributesList;
                                }
                                if (callback != null) {
                                    callback(userAttributesList);
                                }
                            }
                        }
                    }
                });
            }
            function LoadUserAttributes(userId, callback) {
                if (userId == null || userId == "") {
                    userId = $("#userId", element).val();
                }
                $("#userAttributesListHolder", element).empty();

                let user = FindUserById(userId);
                let userAttributeHolder = $("<div class=\"user-manager-user-attributes-holder\" />");

                if (user != null) {
                    if (user.UserAttributes == null || user.UserAttributes.length == 0) {
                        GetAttributesForUser(user.UserId);
                        user = possibleUsers.find(u => u.UserId == userId);
                    }

                    if (user.UserAttributes != null && user.UserAttributes.length > 0) {
                        RenderUserAttributes(user, userAttributeHolder);

                    }
                    else {
                        userAttributeHolder.append("No attributes found for user.");
                    }
                }
                else {
                    userAttributeHolder.append("User data not found.");
                }

                $("#userAttributesListHolder", element).append(userAttributeHolder);
            }
            function RenderUserAttributes(userObject, objectToRenderTo) {
                let userAttributeListing = $("<div />");
                for (let aIndex = 0; aIndex < userObject.UserAttributes.length; aIndex++) {
                    let attributeItem = userObject.UserAttributes[aIndex];
                    let attributeRow = $("<div class=\"user-attribute-row-holder\" />");
                    let attributeNameHolder = $("<div class=\"user-attribute-item-holder attribute-name\" />");
                    let attributeName = attributeItem.FilterId;
                    if (attributeItem.FilterIdSource != null) {
                        attributeName = attributeItem.FilterIdSource.Name;
                    }
                    attributeNameHolder.append(attributeName);

                    attributeRow.append(attributeNameHolder);

                    userAttributeListing.append(attributeRow);
                }
                $(objectToRenderTo).append(userAttributeListing);

            }
            /*User Attributes Information End*/
            function DisplayEditorTabs(userObject) {
                $("div[id^='userManagerFormTab_']", element).each(function () {
                    $(this).show();
                });

                let userHasBudget = DoesUserRoleHaveBudgetOption(userObject.UserRole);
                if (userHasBudget != true) {
                    $("#userManagerFormTab_UserBudget", element).hide();
                }

            }
            function HandleBottomButtons() {
                appLib.getConfigParameterByName("DAILY_IMPORT_ROSTER", function (returnParameter) {
                    if (returnParameter != null) {
                        canAddUsers = (returnParameter.ParamValue.toUpperCase() == "No".toUpperCase());
                    }
                });
                if (canAddUsers == true) {
                    ShowBottomButtons();
                }
                else {
                    HideBottomButtons();
                }
            }
            function HideAll(callback) {
                HideEditorForm();
                HideEditorLoading();
                HideChangePasswordForm();
                HideChangeUserTeamPanel();
                HideUserTerminationForm();
                HideAllTabContainers();                
                if (callback != null) {
                    callback();
                }
            }
            function ShowEditorForm(callback) {
                HideEditorLoading();
                $("#userEditorFormPanel", element).show();
                $(".tab-holder-item", $("#userEditorFormPanel", element))[0].click();
            }
            function HideEditorForm(callback) {
                $("#userEditorFormPanel", element).hide();
            }
            function ShowUserLoadingMessage() {
                $("#userLoadingHolder", element).show();
            }
            function HideUserLoadingMessage() {
                $("#userLoadingHolder", element).hide();
            }
            function HideChangePasswordForm() {
                $("#userEditorResetPasswordPanel", element).hide();
            }
            function ShowChangePasswordForm() {
                $("#userEditorResetPasswordPanel", element).show();
            }
            function HideAllTabContainers() {
                HideTeamTabContainer();
                HideEmployeeIdContainer();
                HideAssistingTabContainer();
                HideUserStatsTabContainer();
                HideUserBudgetTabContainer();
                HideAttributesTabContainer();
                HideUserLocationTabContainer();
                HideUserGroupTabContainer();
                HideUserLocationAssignmentForm();
                HideUserGroupAssignmentForm();
            }
            function MarkActiveEditorTab(tabId) {
                $("div[id^='userManagerFormTab_']", element).each(function () {
                    $(this).removeClass("active");
                });
                $("#" + tabId, element).addClass("active");
            }
            function ShowTeamTabContainer() {
                HideAllTabContainers();
                $("#userManager_TeamTabContainer", element).show();
            }
            function HideTeamTabContainer() {
                $("#userManager_TeamTabContainer", element).hide();
            }
            function ShowEmployeeIdContainer() {
                HideAllTabContainers();
                $("#userManager_EmployeeIdTabContainer", element).show();
            }
            function HideEmployeeIdContainer() {
                $("#userManager_EmployeeIdTabContainer", element).hide();
            }
            function HideAssistingTabContainer() {
                $("#userManager_AssistingTabContainer", element).hide();
            }
            function ShowAssistingTabContainer() {
                HideAllTabContainers();
                $("#userManager_AssistingTabContainer", element).show();
            }
            function HideUserStatsTabContainer() {
                $("#userManager_UserStatsTabContainer", element).hide();
            }
            function ShowUserStatsTabContainer() {
                HideAllTabContainers();
                $("#userManager_UserStatsTabContainer", element).show();
            }
            function HideUserBudgetTabContainer() {
                $("#userManager_UserBudgetTabContainer", element).hide();
            }
            function ShowUserBudgetTabContainer() {
                HideAllTabContainers();
                $("#userManager_UserBudgetTabContainer", element).show();
            }
            function HideBottomButtons() {
                $(".bottom-buttons", element).hide();
            }
            function ShowBottomButtons() {
                $(".bottom-buttons", element).show();
            }
            function HideChangeUserTeamPanel() {
                $("#userEditorChangeUserTeamAssignmentPanel", element).hide();
            }
            function ShowChangeUserTeamPanel() {
                $("#userEditorChangeUserTeamAssignmentPanel", element).show();
            }
            function HideUserLocationTabContainer() {
                $("#userManager_UserLocationTabContainer", element).hide();
            }
            function ShowUserLocationTabContainer() {
                HideAllTabContainers();
                ToggleUserLocationAssignmentForm();
                $("#userManager_UserLocationTabContainer", element).show();
            }
            function ToggleUserLocationAssignmentForm() {
                let selectedRole = GetSelectedRole();
                if (selectedRole.toLowerCase() == "MGMT".toLowerCase() || selectedRole.toLowerCase() == "Management".toLowerCase()) {
                    ShowUserLocationAssignmentForm();
                }
                else {
                    HideUserLocationAssignmentForm();
                }
            }
            function HideUserLocationAssignmentForm() {
                console.log("HideUserLocationAssignmentForm()");
                $("#userLocationAssignmentFormHolder", element).hide();
            }
            function ShowUserLocationAssignmentForm() {
                console.log("ShowUserLocationAssignmentForm()");
                $("#userLocationAssignmentFormHolder", element).show();
            }
            function HideUserGroupTabContainer() {
                $("#userManager_UserGroupTabContainer", element).hide();
            }
            function ShowUserGroupTabContainer() {
                HideAllTabContainers();
                ToggleUserGroupAssignmentForm();
                $("#userManager_UserGroupTabContainer", element).show();
            }
            function ToggleUserGroupAssignmentForm() {
                let selectedRole = GetSelectedRole();

                if (selectedRole.toLowerCase() == "QA".toLowerCase() || selectedRole.toLowerCase() == "Quality Assurance".toLowerCase()) {
                    ShowUserGroupAssignmentForm();
                }
                else {
                    HideUserGroupAssignmentForm();
                }
            }
            function HideUserGroupAssignmentForm() {
                $("#userGroupAssignmentFormHolder", element).hide();
            }
            function ShowUserGroupAssignmentForm() {
                $("#userGroupAssignmentFormHolder", element).show();
            }
            function HandleChangeUserTeamButton(isAgent) {
                if (isAgent == null) {
                    isAgent = false;
                }

                if (canAddUsers == true && isAgent) {
                    $("#userManagerForm_ChangeUserTeam", element).show();
                }
                else {
                    $("#userManagerForm_ChangeUserTeam", element).hide();
                }
            }
            function HideAttributesTabContainer() {
                $("#userManager_AttributesTabContainer", element).hide();
            }
            function ShowAttributesTabContainer() {
                HideAllTabContainers();
                $("#userManager_AttributesTabContainer", element).show();
            }
            function HideEditorLoading() {
                $("#editorLoadingPanel", element).hide();
            }
            function ShowEditorLoading() {
                $("#editorLoadingPanel", element).show();
            }
            function ShowUserTerminationForm()
            {
                $("#userEditorTerminateUserPanel", element).show();
            }
            function HideUserTerminationForm()
            {
                $("#userEditorTerminateUserPanel", element).hide();
            }

            /* Reusable Functions*/
            function GetSelectedRole() {
                let returnValue = $("#userRole", element).val() || "";
                return returnValue;
            }
            function FindUserById(userId, listToSearch) {
                if (listToSearch == null) {
                    listToSearch = possibleUsers;
                }
                return listToSearch.find(u => u.UserId == userId);
            }
            function FindTeamById(teamId, listToSearch) {
                if (listToSearch == null) {
                    listToSearch = availableTeams;
                }
                return listToSearch.find(u => u.TeamId == teamId);
            }
            function DoesUserRoleHaveBudgetOption(userRole) {
                let returnValue = false;
                let userRoleObject = possibleRoles.find(u => u.RoleDesc == userRole || u.RoleCode == userRole || u.RoleId == userRole);
                if (userRoleObject != null) {
                    returnValue = userRoleObject.HasBudgetAvailable;
                }
                return returnValue;
            }
            scope.load = function () {
                scope.Initialize();
                HandleUserListLoad();
                appLib.HandleResourceTexts();
            };

            ko.postbox.subscribe("userAdminReload", function (requireReload) {
                if (requireReload == true) {
                    possibleUsers.length = 0;
                }
                WriteUserLoadingMessage("Reloading data...");
                window.setTimeout(function () {
                    HandleUserListLoad(requireReload);
                }, 500);

            });
            ko.postbox.subscribe("userAdminLoad", function () {
                scope.load();
            });
        }
    };
}]);