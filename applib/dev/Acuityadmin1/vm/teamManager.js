angularApp.directive("ngTeamManager", ['api', '$rootScope', function (api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/teamManager.htm?' + Date.now(),
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
            var defaultAvatarUrl = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";
            var statusOptions = [];
            var possibleUsers = [];
            var possibleGroups = [];
            var possibleProjects = [];
            var possibleTeams = [];
            var possibleSupervisors = [];
            var usersLoaded = false;
            var defaultCoachingSessions = -1;
            var defaultRecognitions = -1;
            var currentTeamStats = [];
            /* Button Clicking Start */
            $("#btnSave", element).off("click").on("click", function () {
                ValidateTeamForm(function () {
                    SaveTeamForm(function () {
                        ClearEditorForm();
                        HideEditorForm();
                        ko.postbox.publish("teamAdminReload", true);
                    });
                });
            });
            $(".btn-close", element).off("click").on("click", function () {
                ClearEditorForm(function () {
                    HideEditorForm();
                });
            });
            $("#btnAddNewTeam", element).off("click").on("click", function () {
                ClearEditorForm(function () {
                    LoadEditorForm(null, function () {
                        ShowEditorForm();
                    });
                });
            });
            $("#btnClearFilter", element).off("click").on("click", function () {
                WriteTeamLoadingMessage("Clearing filters and reloading list...");
                window.setTimeout(function () {
                    ClearFilters(function () {
                        HandleTeamListLoad(false, function () {
                            HideTeamLoadingMessage();
                        });
                    });
                }, 500);
            });
            $("#btnApplyFilter", element).off("click").on("click", function () {
                WriteTeamLoadingMessage("Applying filters...");
                window.setTimeout(function () {
                    HandleTeamListLoad(false, function () {
                        HideTeamLoadingMessage();
                    });
                }, 500);

            });
            $("#teamManagerFormTab_Users", element).off("click").on("click", function () {
                ShowUserTabContainer();
                MarkActiveEditorTab(this.id);
            });
            $("#teamManagerFormTab_Stats", element).off("click").on("click", function () {
                ShowTeamStatsTabContainer();
                MarkActiveEditorTab(this.id);
            });
            $("#collapseAll", element).off("click").on("click", function () {
                HideAllUsersOnTeams();
            });
            /* Button Clicking End */

            scope.Initialize = function () {
                HideAll();
                SetConfigParameterValues();
                HandleBottomButtons();
                SetDatePickerFields();
                LoadStatusOptions();
                LoadProjectOptions();
                LoadGroupOptions();
                LoadSupervisorOptions();
                LoadPossibleUsers(function () {
                    usersLoaded = true;
                });
                LoadLists("all");
                $("#teamManager_statusFilter", element).val("A");

            };

            function SetDatePickerFields() {

            }
            function LoadStatusOptions() {
                //TODO: Pull from database?
                statusOptions.length = 0;
                statusOptions.push({ StatusId: 1, StatusCode: "A", StatusDesc: "Active" });
                statusOptions.push({ StatusId: 2, StatusCode: "I", StatusDesc: "Inactive" });
            }
            function LoadProjectOptions(callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getProjectList"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var objectList = $.parseJSON(data.projectList);
                        possibleProjects.length = 0;
                        possibleProjects = objectList;
                        if (callback != null) {
                            callback(objectList);
                        }
                    }
                });
            }
            function LoadGroupOptions(callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getGroupList"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var objectList = $.parseJSON(data.groupList);
                        possibleGroups.length = 0;
                        possibleGroups = objectList;
                        if (callback != null) {
                            callback(possibleGroups);
                        }
                    }
                });
            }
            function LoadSupervisorOptions(callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getSupervisorList",
                        userid: legacyContainer.scope.TP1Username
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var objectList = $.parseJSON(data.userProfileList);
                        possibleSupervisors.length = 0;
                        possibleSupervisors = objectList;
                        if (callback != null) {
                            callback(objectList);
                        }
                    }
                });
            }
            function LoadLists(listToLoad) {
                listToLoad = listToLoad.toLowerCase();

                var loadAll = (listToLoad == "all");

                if (listToLoad == "supervisors" || loadAll) {
                    let sortedList = SortSupervisorList();
                    if ($("#teamManager_supervisorFilter", element) != null) {
                        $("#teamManager_supervisorFilter", element).empty();
                        $("#teamManager_supervisorFilter", element).append($('<option />', { value: "", text: "" }));

                        $("#teamEditor_SupervisorUserId", element).empty();
                        $("#teamEditor_SupervisorUserId", element).append($('<option />', { value: "", text: "" }));

                        for (var i = 0; i < sortedList.length; i++) {
                            var item = sortedList[i];
                            $("#teamEditor_SupervisorUserId", element).append($('<option />', { value: item.UserId, text: item.UserFullName }));
                            $("#teamManager_supervisorFilter", element).append($('<option />', { value: item.UserId, text: item.UserFullName }));
                        }
                    }
                }
                if (listToLoad == "groups" || loadAll) {
                    if ($("#teamEditor_GroupId", element) != null) {
                        $("#teamEditor_GroupId", element).empty();
                        $("#teamEditor_GroupId", element).append($('<option />', { value: "", text: "" }));

                        $("#teamEditor_RollupGroupId", element).empty();
                        $("#teamEditor_RollupGroupId", element).append($('<option />', { value: "", text: "" }));

                        for (let i = 0; i < possibleGroups.length; i++) {
                            let item = possibleGroups[i];
                            $("#teamEditor_GroupId", element).append($('<option />', { value: item.GroupId, text: item.Name }));
                            $("#teamEditor_RollupGroupId", element).append($('<option />', { value: item.GroupId, text: item.Name }));
                        }
                    }
                }
                if (listToLoad == "projects" || loadAll) {
                    if ($("#teamManager_projectFilter", element) != null) {
                        $("#teamManager_projectFilter", element).empty();
                        $("#teamManager_projectFilter", element).append($('<option />', { value: "", text: "" }));

                        $("#teamEditor_ProjectId", element).empty();
                        $("#teamEditor_ProjectId", element).append($('<option />', { value: "", text: "" }));

                        for (let i = 0; i < possibleProjects.length; i++) {
                            let item = possibleProjects[i];
                            $("#teamEditor_ProjectId", element).append($('<option />', { value: item.ProjectId, text: item.ProjectDesc }));
                            $("#teamManager_projectFilter", element).append($('<option />', { value: item.ProjectId, text: item.ProjectDesc }));
                        }
                    }
                }
                if (listToLoad == "teamstatus" || loadAll == true) {
                    $("#teamManager_statusFilter", element).empty();
                    $("#teamManager_statusFilter", element).append($('<option />', { value: "", text: "All" }));

                    $("#teamEditor_TeamStatus", element).empty();
                    $("#teamEditor_TeamStatus", element).append($('<option />', { value: "", text: "" }));

                    for (var i = 0; i < statusOptions.length; i++) {
                        var item = statusOptions[i];
                        $("#teamEditor_TeamStatus", element).append($('<option />', { value: item.StatusCode, text: item.StatusDesc }));
                        $("#teamManager_statusFilter", element).append($('<option />', { value: item.StatusCode, text: item.StatusDesc }));
                    }
                }
            }
            function LoadPossibleUsers(callback) {
                if (possibleUsers != null && possibleUsers.length > 0) {
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
                            cmd: "getUserList",
                            projectid: -1,
                            includeInactive: true
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            var userList = $.parseJSON(data.userProfileList);
                            possibleUsers.length = 0;
                            possibleUsers = userList;
                            usersLoaded == true;
                            if (callback != null) {
                                callback(data);
                            }
                        }
                    });
                }
            }
            function LoadUserByUserId(userId) {
                let returnObject = null;
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserv",
                        cmd: "getUserProfile",
                        userid: userId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var userProfile = $.parseJSON(data.userFullProfile);
                        returnObject = userProfile;
                        if (possibleUsers != null) {
                            let uIndex = possibleUsers.findIndex(u => u.UserId == userId);
                            if (uIndex < 0) {
                                possibleUsers.push(userProfile);
                            }
                        }
                    }
                });

                return returnObject;
            }
            function SortSupervisorList(listToSort) {
                if (listToSort == null) {
                    listToSort = possibleSupervisors;
                }
                let sortedList = listToSort;

                sortedList = sortedList.sort((a, b) => {
                    if (a.FirstName > b.FirstName) {
                        return 1;
                    }
                    else if (a.FirstName < b.FirstName) {
                        return -1
                    }
                    else {
                        if (a.LastName > b.LastName) {
                            return 1;
                        }
                        else if (a.LastName < b.LastName) {
                            return -1;
                        }
                        else {
                            return 0;
                        }
                    }
                });

                return sortedList;
            }
            function HandleTeamListLoad(forceReload, callback) {
                WriteTeamLoadingMessage("Loading Team information...");
                LoadTeamList(forceReload, function (listData) {
                    let listToRender = listData;
                    listToRender = FilterTeamList(listToRender);
                    listToRender = SortTeamList(listToRender);
                    WriteTeamLoadingMessage("Rendering Team information...");
                    RenderTeamList(listToRender, function () {
                        HideTeamLoadingMessage();
                        if (callback != null) {
                            callback();
                        }
                    });
                });
            }
            function FilterTeamList(listToFilter) {
                let filteredTeamList = listToFilter;
                let teamNameFilter = $("#teamManager_teamNameFilter", element).val() || "";
                let projectFilter = $("#teamManager_projectFilter", element).val() || "";
                let supervisorFilter = $("#teamManager_supervisorFilter", element).val() || "";
                let statusFilter = $("#teamManager_statusFilter").val() || "";
                if (teamNameFilter != "") {
                    filteredTeamList = filteredTeamList.filter(x => x.TeamName.toLowerCase().includes(teamNameFilter.toLowerCase()));
                }
                if (projectFilter != "") {
                    filteredTeamList = filteredTeamList.filter(x => x.ProjectId == projectFilter);
                }
                if (supervisorFilter != "") {
                    filteredTeamList = filteredTeamList.filter(x => x.SupervisorUserId == supervisorFilter);
                }
                if (statusFilter != "") {
                    filteredTeamList = filteredTeamList.filter(x => x.Status == statusFilter);
                }
                return filteredTeamList;
            }
            function SortTeamList(listToSort, fieldToSort) {
                let sortedTeamList = listToSort;
                if (listToSort == null) {
                    sortedTeamList = possibleTeams;
                }
                if (sortedTeamList != null) {
                    switch (fieldToSort?.toLowerCase()) {
                        default:
                            sortedTeamList = sortedTeamList.sort((a, b) => {
                                if (a.TeamName.toLowerCase() < b.TeamName.toLowerCase()) {
                                    return -1;
                                }
                                if (a.TeamName.toLowerCase() > b.TeamName.toLowerCase()) {
                                    return 1;
                                }
                                if (a.TeamName.toLowerCase() == b.TeamName.toLowerCase()) {
                                    return 0;
                                }
                            });
                            break;
                    }
                }

                return sortedTeamList;
            }
            function LoadTeamList(forceReload, callback) {
                if (forceReload == null) {
                    forceReload = false;
                }
                if (possibleTeams != null && possibleTeams.length > 0 && forceReload == false) {
                    if (callback != null) {
                        callback(possibleTeams);
                    }
                }
                else {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "selfserv",
                            cmd: "getAllTeams",
                            deepLoad: true
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            var teamList = $.parseJSON(data.teamList);
                            possibleTeams.length = 0;
                            possibleTeams = teamList;
                            if (callback != null) {
                                callback(teamList);
                            }
                        }
                    });

                }
            }
            function RenderTeamList(listToRender, callback) {
                if (listToRender == null) {
                    listToRender = possibleTeams;
                }
                $("#teamListHolder", element).empty();
                let teamListHolder = $("<div class=\"team-list\" />");

                if (listToRender != null && listToRender.length > 0) {
                    for (let tc = 0; tc < listToRender.length; tc++) {
                        let teamItem = listToRender[tc];
                        let teamRowHolder = $("<div class=\"team-list-item-holder\" id=\"teamRow_" + teamItem.TeamId + "\" />");

                        let teamExpanderHolder = $("<div class=\"team-list-item team-expander\" id=\"teamExpander_" + teamItem.TeamId + "\" />");
                        teamExpanderHolder.append("<i class=\"fa fa-plus\"></i>");
                        teamExpanderHolder.on("click", function () {
                            let itemId = this.id;
                            let teamId = itemId.split("_")[1];
                            ToggleUserList(teamId);
                        });

                        let teamNameHolder = $("<div class=\"team-list-item team-name\" id=\"teamName_" + teamItem.TeamId + "\" />");
                        teamNameHolder.on("click", function () {
                            let itemId = this.id;
                            let teamId = itemId.split("_")[1];
                            ToggleUserList(teamId);
                        });

                        teamNameHolder.append(teamItem.TeamName);

                        if (teamItem.Colors != null && teamItem.Colors.length > 0) {
                            let teamColor1 = teamItem.Colors[0] || "transparent";
                            let teamColor2 = teamItem.Colors[1] || "transparent";

                            let teamColorHolder = $("<span />");
                            teamColorHolder.css("background", "linear-gradient(135deg, " + teamColor1 + " 50%, " + teamColor2 + " 50%)");
                            teamColorHolder.append("&nbsp;&nbsp;&nbsp;");

                            teamNameHolder.append("&nbsp;&nbsp;");
                            teamNameHolder.append(teamColorHolder);
                        }

                        let teamLeaderHolder = $("<div class=\"team-list-item team-leader-name\" />");
                        let supervisorName = teamItem.SupervisorUserId;
                        if (teamItem.SupervisorUserIdSource != null) {
                            supervisorName = teamItem.SupervisorUserIdSource.UserFullName;
                        }
                        teamLeaderHolder.append(supervisorName);

                        let teamGroupHolder = $("<div class=\"team-list-item team-group-name\" />");
                        let groupName = teamItem.GroupId;
                        if (teamItem.GroupIdSource != null) {
                            groupName = teamItem.GroupIdSource.GroupName;
                        }
                        teamGroupHolder.append(groupName);

                        let teamProjectHolder = $("<div class=\"team-list-item team-project-name\" />");
                        let projectName = teamItem.ProjectId;
                        if (teamItem.ProjectIdSource != null) {
                            projectName = teamItem.ProjectIdSource.ProjectDesc;
                        }
                        teamProjectHolder.append(projectName);

                        let teamUserCountHolder = $("<div class=\"team-list-item team-user-count\" />");

                        let userCount = teamItem.TotalCurrentUsersOnTeam;
                        if (teamItem.AssignedUsers != null && teamItem.AssignedUsers.length > 0) {
                            userCount = teamItem.AssignedUsers.length;
                        }
                        teamUserCountHolder.append(userCount);

                        let teamStatusHolder = $("<div class=\"team-list-item team-status\" />");
                        let teamStatus = teamItem.Status;
                        let statusItem = statusOptions.find(s => s.StatusCode == teamItem.Status);
                        if (statusItem != null) {
                            teamStatus = statusItem.StatusDesc;
                        }
                        teamStatusHolder.append(teamStatus);

                        let teamButtonHolder = $("<div class=\"team-list-item team-buttons\" />");

                        let editButton = $("<button class=\"\" id=\"editTeam_" + teamItem.TeamId + "\"><i class=\"fa fa-edit\"></i></button>");
                        editButton.off("click").on("click", function () {
                            let itemId = this.id;
                            let teamId = itemId.split("_")[1];
                            LoadEditorForm(teamId, function () {
                                ShowEditorForm();
                            });
                        });
                        teamButtonHolder.append(editButton);

                        let teamUsersRow = $("<div class=\"team-user-row user-list-holder\" id=\"usersOnTeam_" + teamItem.TeamId + "\" />");

                        BuildUsersAssignedToTeam(teamItem.AssignedUsers, teamUsersRow);

                        teamRowHolder.append(teamExpanderHolder);
                        teamRowHolder.append(teamNameHolder);
                        teamRowHolder.append(teamLeaderHolder);
                        teamRowHolder.append(teamGroupHolder);
                        teamRowHolder.append(teamProjectHolder);
                        teamRowHolder.append(teamUserCountHolder);
                        teamRowHolder.append(teamStatusHolder);
                        teamRowHolder.append(teamButtonHolder);

                        teamRowHolder.append(teamUsersRow);


                        teamListHolder.append(teamRowHolder);

                    }
                }
                else {
                    teamListHolder.append("No Teams Found.");
                }

                $("#teamListHolder", element).append(teamListHolder);
                HideAllUsersOnTeams();

                if (callback != null) {
                    callback();
                }
            }
            function BuildUsersAssignedToTeam(listToRender, objectToRenderTo) {
                let userAssignedHolder = $("<div class=\"team-thing-user-list-holder\" />");
                if (listToRender != null && listToRender.length > 0) {
                    let userAssignedRowThings = $("<div class=\"team-thing-user-list-row-holder\" />");
                    let userAssignedRowHeader = $("<div class=\"team-thing-user-list-row-header\" />");
                    userAssignedRowHeader.append("<div class=\"things-list-header-label-item\">Users</div>");
                    userAssignedRowThings.append(userAssignedRowHeader);
                    userAssignedHolder.append(userAssignedRowThings);

                    for (let uc = 0; uc < listToRender.length; uc++) {
                        let userItem = listToRender[uc];
                        let userAssignedToTeamRow = $("<div class=\"team-user-assigned-row\" />");
                        let userAvatarHolder = $("<div class=\"sub-item-inline-item user-avatar\" />");
                        let userAvatar = $("<img class=\"sub-item-inline-item small-avatar\" />");
                        let userAvatarUrl = defaultAvatarUrl;
                        if (userItem.AvatarImageFileName != null && userItem.AvatarImageFileName != "" && userItem.AvatarImageFileName != "empty_headshot.png") {
                            userAvatarUrl = Global_CleanAvatarUrl(userItem.AvatarImageFileName);
                        }

                        userAvatar.prop("src", userAvatarUrl);
                        userAvatarHolder.append(userAvatar);

                        let userNameHolder = $("<div class=\"sub-item-inline-item user-name\" />");
                        userNameHolder.append(userItem.UserFullName);

                        userAssignedToTeamRow.append(userAvatarHolder);
                        userAssignedToTeamRow.append(userNameHolder);

                        userAssignedHolder.append(userAssignedToTeamRow);

                    }
                }
                else {
                    userAssignedHolder.append("No users found on team.");
                }
                objectToRenderTo.append(userAssignedHolder);
            }
            function LoadEditorForm(teamId, callback) {
                let team = possibleTeams.find(t => t.TeamId == teamId);
                
                if (team != null) {

                    let coachingSessions = team.CoachingSessionsPerAgentPerMonth;
                    if (coachingSessions == "" || coachingSessions == -1) {
                        coachingSessions = defaultCoachingSessions;
                    }
                    let recognitions = team.RecognitionsPerAgentPerMonth;
                    if (recognitions == "" || recognitions == -1) {
                        recognitions = defaultRecognitions;
                    }

                    $("#editorFormType", element).val("edit");
                    $("#teamEditor_TeamId", element).val(team.TeamId);
                    $("#teamEditor_TeamName", element).val(team.Name);
                    $("#teamEditor_SupervisorUserId", element).val(team.SupervisorUserId);
                    $("#teamEditor_ProjectId", element).val(team.ProjectId);
                    $("#teamEditor_GroupId", element).val(team.GroupId);
                    $("#teamEditor_RollupGroupId", element).val(team.RollupGroupId);
                    $("#teamEditor_TeamStatus", element).val(team.Status);
                    $("#teamEditor_AgentCoachingSessions", element).val(coachingSessions);
                    $("#teamEditor_AgentRecognitions", element).val(recognitions);
                    let color1 = team.TeamColor1 || team.Colors[0] || "";
                    let color2 = team.TeamColor2 || team.Colors[1] || "";
                    $("#teamEditor_TeamColor1", element).val(color1);
                    $("#teamEditor_TeamColor2", element).val(color2);
                    $("#teamEditor_TeamMotto", element).val(team.TeamMotto);
                    let createInfo = `${new Date(team.CreatedOn).toLocaleDateString()} (${team.CreatedBy})`;
                    let updateInfo = `${new Date(team.UpdatedOn).toLocaleDateString()} (${team.UpdatedBy})`;
                    $("#teamCreatedInfo", element).append(createInfo);
                    if(team.UpdatedOn != null || team.UpdatedOn != "")
                    {
                        $("#teamUpdateInfo", element).append(updateInfo);
                    }
                    
                    

                    LoadTeamColorsForEditor(team);
                    LoadTeamUsersInEditorForm(team.TeamId, function (usersList) {
                        RenderTeamUsersInEditorForm(usersList, team.TeamId);
                        RenderHistoricalTeamUsers(team.TeamId);
                    });
                    LoadTeamStats(team.TeamId);

                }
                else {
                    $("#editorFormType", element).val("add");
                    $("#teamEditor_TeamId", element).val(-1);
                }
                if (callback != null) {
                    callback();
                }
            }
            function LoadTeamColorsForEditor(teamObject) {
                $("#teamColorsHolder", element).css("background-image", "");
                $("#teamColorsHolder2", element).css("background-image", "");

                $("#teamEditor_TeamColor1", element).setColor("transparent");
                $("#teamEditor_TeamColor2", element).setColor("transparent");


                let color1 = teamObject.TeamColor1;
                let color2 = teamObject.TeamColor2;

                if (teamObject != null && teamObject.Colors != null && teamObject.Colors.length > 0) {
                    if (color1 == null || color1 == "") {
                        color1 = teamObject.Colors[0] || "transparent";
                    }
                    if (color2 == null || color2 == "") {
                        color2 = teamObject.Colors[1] || "transparent";
                    }

                    $("#teamColorsHolder", element).css("background-image", "linear-gradient(45deg, " + color1 + " 50%, " + color2 + " 50%)");
                    $("#teamColorsHolder2", element).css("background-image", "linear-gradient(135deg, " + color1 + " 50%, " + color2 + " 50%)");

                    $("#teamEditor_TeamColor1", element).setColor(color1);
                    $("#teamEditor_TeamColor2", element).setColor(color2);
                }
            }
            function LoadTeamUsersInEditorForm(teamId, callback) {
                //TODO: Determine how we want to handle the loading of past users along with current users.
                //Already have a list of the current users (team.AssignedUsers)
                //should we include any kind of historical users and their information?
                let returnList = null;
                let team = possibleTeams.find(t => t.TeamId == teamId);
                if (team != null) {
                    returnList = team.AssignedUsers;
                }
                if (callback != null) {
                    callback();
                }
            }
            function RenderTeamUsersInEditorForm(listToRender, teamId, callback) {
                if (listToRender == null || listToRender.length == 0) {
                    let team = possibleTeams.find(t => t.TeamId == teamId);
                    if (team != null) {
                        listToRender = team.AssignedUsers || [];
                    }
                }
                let currentUserTeamListHolder = $("<div />");
                let currentTeamUserCounter = 0;

                $("#currentTeamUsersHolder", element).empty();
                if (listToRender.length > 0) {
                    for (let uc = 0; uc < listToRender.length; uc++) {
                        let userItem = listToRender[uc];
                        let userRow = $("<div class=\"sub-tab-row-holder\" />");
                        let userAvatarHolder = $("<div class=\"sub-item-inline-item\" />");

                        let userAvatarUrl = defaultAvatarUrl;
                        if (userItem.AvatarImageFileName != null && userItem.AvatarImageFileName != "" && userItem.AvatarImageFileName != "empty_headshot.png") {
                            userAvatarUrl = Global_CleanAvatarUrl(userItem.AvatarImageFileName);
                        }
                        let userAvatar = $("<img class=\"sub-item-inline-item small-avatar\" />");
                        userAvatar.prop("src", userAvatarUrl);
                        userAvatarHolder.append(userAvatar);


                        let userNameHolder = $("<div class=\"sub-item-inline-item\" />");
                        userNameHolder.append(userItem.UserFullName);

                        userRow.append(userAvatarHolder);
                        userRow.append(userNameHolder);

                        currentUserTeamListHolder.append(userRow);
                        currentTeamUserCounter++;
                    }
                }

                $("#lblCurrentUserCounter", element).empty();
                $("#lblCurrentUserCounter", element).append("(" + currentTeamUserCounter + ")");

                if (currentTeamUserCounter <= 0) {
                    $("#currentTeamUsersHolder", element).append("No current users found for team.");
                }

                $("#currentTeamUsersHolder", element).append(currentUserTeamListHolder);

                if (callback != null) {
                    callback();
                }
            }
            function RenderHistoricalTeamUsers(teamId, callback) {
                let team = possibleTeams.find(t => t.TeamId == teamId);

                let historicalUserTeamListHolder = $("<div />");
                let historicalTeamUserCount = 0;

                $("#historicalTeamUsersHolder", element).empty();
                if (team != null && team.HistoricalUsers != null && team.HistoricalUsers.length > 0) {
                    for (let uc = 0; uc < team.HistoricalUsers.length; uc++) {
                        let userTeamItem = team.HistoricalUsers[uc];
                        let userItem = null;
                        if (userTeamItem.UserIdSource != null) {
                            userItem = userTeamItem.UserIdSource;
                        }
                        else {
                            if (usersLoaded == true) {
                                userItem = possibleUsers.find(u => u.UserId == userTeamItem.UserId);
                            }
                            else {
                                userItem = LoadUserByUserId(userTeamItem.UserId);
                            }
                        }
                        if (userItem != null) {
                            let userRow = $("<div class=\"sub-tab-row-holder\" />");
                            let userAvatarHolder = $("<div class=\"sub-item-inline-item\" />");

                            let userAvatarUrl = defaultAvatarUrl;
                            if (userItem.AvatarImageFileName != null && userItem.AvatarImageFileName != "" && userItem.AvatarImageFileName != "empty_headshot.png") {
                                userAvatarUrl = Global_CleanAvatarUrl(userItem.AvatarImageFileName);
                            }
                            let userAvatar = $("<img class=\"sub-item-inline-item small-avatar\" />");
                            userAvatar.prop("src", userAvatarUrl);
                            userAvatarHolder.append(userAvatar);

                            let userNameHolder = $("<div class=\"sub-item-inline-item\" />");
                            userNameHolder.append(userItem.UserFullName);

                            let userTeamDatesHolder = $("<div class=\"sub-item-inline-item team-user-assigned-dates\" />");
                            let startDate = new Date(userTeamItem.AssignedToTeamDate).toLocaleDateString();
                            let endDate = new Date(userTeamItem.RemovedFromTeamDate).toLocaleDateString();;
                            userTeamDatesHolder.append(startDate + " - " + endDate)

                            userRow.append(userAvatarHolder);
                            userRow.append(userNameHolder);
                            userRow.append(userTeamDatesHolder);

                            historicalUserTeamListHolder.append(userRow);
                        }
                    }
                    historicalTeamUserCount = team.HistoricalUsers.length;
                }

                $("#lblHistoricalUserCounter", element).empty();
                $("#lblHistoricalUserCounter", element).append("(" + historicalTeamUserCount + ")");

                if (historicalTeamUserCount <= 0) {
                    $("#historicalTeamUsersHolder", element).append("No historical users found for team.");
                }

                $("#historicalTeamUsersHolder", element).append(historicalUserTeamListHolder);

                if (callback != null) {
                    callback();
                }
            }
            function ClearEditorForm(callback) {
                $(".error-information-holder", element).empty();
                $("#editorFormType", element).val("add");
                $("#teamEditor_TeamId", element).val(-1);
                $("#teamEditor_TeamName", element).val("");
                $("#teamEditor_SupervisorUserId", element).val("");
                $("#teamEditor_ProjectId", element).val("");
                $("#teamEditor_GroupId", element).val("");
                $("#teamEditor_RollupGroupId", element).val("");
                $("#teamEditor_TeamStatus", element).val("A");
                $("#teamEditor_AgentCoachingSessions", element).val(defaultCoachingSessions);
                $("#teamEditor_AgentRecognitions", element).val(defaultRecognitions);
                $("#teamEditor_TeamColor1", element).val("");
                $("#teamEditor_TeamColor2", element).val("");
                $("#teamEditor_TeamMotto", element).val("");

                $(".error-information-holder", element).html("");
                $(".error-information-holder", element).hide();

                if (callback != null) {
                    callback();
                }
            }
            function ValidateTeamForm(callback) {
                var formValid = true;
                var errorMessages = [];
                var teamName = $("#teamEditor_TeamName", element).val();
                var supervisorId = $("#teamEditor_SupervisorUserId", element).val();
                var projectId = $("#teamEditor_ProjectId", element).val();
                var groupId = $("#teamEditor_GroupId", element).val();
                var agentCoachingSessionsPerMonth = $("#teamEditor_AgentCoachingSessions", element).val();
                var agentRecognitionsPerMonth = $("#teamEditor_AgentRecognitions", element).val();

                if (teamName == null || teamName == "") {
                    errorMessages.push({ message: "Team Name Required", fieldclass: "", fieldid: "teamEditor_TeamName" });
                    formValid = false;
                }
                if (supervisorId == null || supervisorId == "") {
                    errorMessages.push({ message: "Supervisor Required", fieldclass: "", fieldid: "#teamEditor_SupervisorUserId" });
                    formValid = false;
                }
                if (projectId == null || projectId == "" || projectId == 0) {
                    errorMessages.push({ message: "Project Required", fieldclass: "", fieldid: "#teamEditor_ProjectId" });
                    formValid = false;
                }
                if (groupId == null || groupId == "" || groupId == 0) {
                    errorMessages.push({ message: "Group Required", fieldclass: "", fieldid: "#teamEditor_GroupId" });
                    formValid = false;
                }

                if (agentCoachingSessionsPerMonth == null || agentCoachingSessionsPerMonth == "") {
                    errorMessages.push({ message: "Coaching Sessions Per Agent Per Month Required", fieldclass: "", fieldid: "#teamEditor_AgentCoachingSessions" });
                    formValid = false;
                }
                else {
                    let regEx = new RegExp("^[0-9]*$");
                    if (!regEx.test(agentCoachingSessionsPerMonth)) {
                        errorMessages.push({ message: "Coaching Sessions Per Agent Per Month must be at least 0", fieldclass: "", fieldid: "#teamEditor_AgentCoachingSessions" });
                        formValid = false;
                    }
                }
                if (agentRecognitionsPerMonth == null || agentRecognitionsPerMonth == "") {
                    errorMessages.push({ message: "Recognitions Per Agent Per Month Required", fieldclass: "", fieldid: "#teamEditor_AgentRecognitions" });
                    formValid = false;
                }
                else {
                    let regEx = new RegExp("^[0-9]*$");
                    if (!regEx.test(agentRecognitionsPerMonth)) {
                        errorMessages.push({ message: "Recognitions Per Agent Per Month must be at least 0", fieldclass: "", fieldid: "#teamEditor_AgentRecognitions" });
                        formValid = false;
                    }
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
            function SaveTeamForm(callback) {
                let teamToSave = CollectEditorDataForTeam();
                SaveTeam(teamToSave, function () {
                    HandleTeamListLoad(true, function () {
                        if (callback != null) {
                            callback();
                        }
                    });
                });
            }
            function SaveTeam(teamObject, callback) {
                let formType = $("#editorFormType", element).val() || "add";
                if (teamObject != null) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "selfserve",
                            cmd: "saveTeam",
                            teamitem: JSON.stringify(teamObject),
                            savetype: formType
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            if (callback != null) {
                                callback(data);
                            }
                        }
                    });
                }
            }
            function CollectEditorDataForTeam() {
                var returnObject = new Object();
                returnObject.TeamId = $("#teamEditor_TeamId", element).val();
                returnObject.ProjectId = $("#teamEditor_ProjectId", element).val();
                returnObject.GroupId = $("#teamEditor_GroupId", element).val();
                returnObject.RollupGroupId = $("#teamEditor_RollupGroupId", element).val();
                returnObject.TeamName = $("#teamEditor_TeamName", element).val()
                returnObject.SupervisorUserId = $("#teamEditor_SupervisorUserId", element).val();
                returnObject.Status = $("#teamEditor_TeamStatus", element).val();
                returnObject.CreatedOn = new Date().toLocaleDateString();
                returnObject.CreatedBy = legacyContainer.scope.TP1Username;
                let coachingSessions = $("#teamEditor_AgentCoachingSessions", element).val();
                if (coachingSessions == null || coachingSessions == "") {
                    coachingSessions = -1;
                }
                returnObject.CoachingSessionsPerAgentPerMonth = parseInt(coachingSessions);
                let recognitions = $("#teamEditor_AgentRecognitions", element).val()
                if (recognitions == null || recognitions == "") {
                    recognitions = -1;
                }
                returnObject.TeamColor1 = $("#teamEditor_TeamColor1", element).val();
                returnObject.TeamColor2 = $("#teamEditor_TeamColor2", element).val();
                returnObject.TeamMotto = $("#teamEditor_TeamMotto", element).val();

                returnObject.RecognitionsPerAgentPerMonth = parseInt(recognitions);

                return returnObject;
            }
            function ClearFilters(callback) {
                $("#teamManager_teamNameFilter", element).val("");
                $("#teamManager_supervisorFilter", element).val("");
                $("#teamManager_projectFilter", element).val("");
                $("#teamManager_statusFilter", element).val("A");

                if (callback != null) {
                    callback();
                }
            }
            /*Team Stats Information*/
            function LoadTeamStats(teamId, callback) {
                ko.postbox.publish("itemStatsTabLoad", { section: "team", id: teamId });
            }
            /*Team Stats Information End*/
            function SetConfigParameterValues() {
                appLib.getConfigParameterByName("SIDEKICK_DEFAULT_AGENT_COACH_GOAL", function (returnParameter) {
                    if (returnParameter != null) {
                        defaultCoachingSessions = parseInt(returnParameter.ParamValue);
                    }
                });
                appLib.getConfigParameterByName("SIDEKICK_DEFAULT_AGENT_RECOGNITION_GOAL", function (returnParameter) {
                    if (returnParameter != null) {
                        defaultRecognitions = parseInt(returnParameter.ParamValue);
                    }
                });
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
                HideAllTabContainers();
                if (callback != null) {
                    callback();
                }
            }
            function HideAllTabContainers() {
                HideUserTabContainer();
                HideTeamStatsTabContainer();
            }
            function MarkActiveEditorTab(tabId) {
                $("div[id^='teamManagerFormTab_']", element).each(function () {
                    $(this).removeClass("active");
                });
                $("#" + tabId, element).addClass("active");
            }
            function HideAllUsersOnTeams() {
                $(".user-list-holder", element).each(function () {
                    $(this).hide();
                });
                $(".team-expander i", element).each(function () {
                    if (this.id == null || this.id != "collapseAll") {
                        $(this).removeClass("fa-minus");
                        $(this).addClass("fa-plus");
                    }
                });
            }
            function ToggleUserList(teamId) {
                let isCurrentlyVisible = $("#usersOnTeam_" + teamId, element).is(":visible");
                let expanderClass = "fa-minus";

                if (isCurrentlyVisible == true) {
                    HideUsersOnTeam(teamId);
                    expanderClass = "fa-plus";
                }
                else {
                    ShowUsersOnTeam(teamId);
                }
                $("i", $("#teamExpander_" + teamId)).removeClass("fa-plus");
                $("i", $("#teamExpander_" + teamId)).removeClass("fa-minus");
                $("i", $("#teamExpander_" + teamId)).addClass(expanderClass);


            }
            function ShowUsersOnTeam(teamId) {
                $("#usersOnTeam_" + teamId, element).show();
            }
            function HideUsersOnTeam(teamId) {
                $("#usersOnTeam_" + teamId, element).hide();
            }
            function HideEditorForm() {
                $("#teamEditorFormPanel", element).hide();
            }
            function ShowEditorForm() {
                $("#teamEditorFormPanel", element).show();
                $(".tab-holder-item", $("#teamEditorFormPanel", element))[0].click();
            }
            function WriteTeamLoadingMessage(messageToWrite) {
                $("#teamLoadingMessage", element).empty();
                $("#teamLoadingMessage", element).append(messageToWrite);
                ShowTeamLoadingMessage();
            }
            function HideTeamLoadingMessage() {
                $("#teamLoadingHolder", element).hide();
            }
            function ShowTeamLoadingMessage() {
                $("#teamLoadingHolder", element).show();
            }
            function HideUserTabContainer() {
                $("#teamManager_UserTabContainer", element).hide();
            }
            function ShowUserTabContainer() {
                HideAllTabContainers();
                $("#teamManager_UserTabContainer", element).show();
            }
            function HideTeamStatsTabContainer() {
                $("#teamManager_StatsTabContainer", element).hide();
            }
            function ShowTeamStatsTabContainer() {
                HideAllTabContainers();
                $("#teamManager_StatsTabContainer", element).show();
            }
            function HideBottomButtons() {
                $(".bottom-buttons", element).hide();
            }
            function ShowBottomButtons() {
                $(".bottom-buttons", element).show();
            }
            scope.load = function () {
                scope.Initialize();
                $("#teamEditor_TeamColor1").simpleColor({
                    livePreview: true,
                    onSelect: function (hex, element) {
                        $(element.attr("id")).setColor("#" + hex);
                    }
                });
                $("#teamEditor_TeamColor2").simpleColor({
                    livePreview: true,
                    onSelect: function (hex, element) {
                        $(element.attr("id")).setColor("#" + hex);
                    }
                });
                HandleTeamListLoad();
            };
            ko.postbox.subscribe("teamAdminReload", function (requireReload) {
                if (requireReload == true) {
                    possibleTeams.length = 0;
                }
                WriteTeamLoadingMessage("Reloading data...");
                window.setTimeout(function () {
                    HandleTeamListLoad(requireReload);
                }, 500);
            });
            ko.postbox.subscribe("teamAdminLoad", function () {
                scope.load();
            });
        }
    };
}]);