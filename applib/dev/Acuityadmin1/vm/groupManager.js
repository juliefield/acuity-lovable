angularApp.directive("ngGroupManager", ['api', '$rootScope', function (api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/groupManager.htm?' + Date.now(),
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
            var possibleGroups = [];
            var possibleLocations = [];
            var possibleProjects = [];
            var possibleTeams = [];
            var possibleSupervisors = [];
            var defaultCoachingSessions = -1;
            var defaultRecognitions = -1;

/* Button Options Start */
            $("#btnAddNewGroup", element).off("click").on("click", function () {
                ClearEditorForm(function () {
                    LoadEditorForm(null, function () {
                        ShowEditorForm();
                    });
                });
            });
            $("#collapseAll", element).off("click").on("click", function () {
                HideAllTeamsInGroup();
            });
            $("#btnApplyFilter", element).off("click").on("click", function () {
                WriteGroupLoadingMessage("Applying filters...");
                window.setTimeout(function(){
                    HandleGroupListLoad(false, function(){
                        HideGroupLoadingMessage();
                    });
                }, 500);
                
            });
            $("#btnClearFilter", element).off("click").on("click", function () {
                WriteGroupLoadingMessage("Clearing filters and reloading list...");
                window.setTimeout(function () {
                    ClearFilters(function () {
                        HandleGroupListLoad(false, function () {
                            HideGroupLoadingMessage();
                        });
                    });
                }, 500);
            });
            $("#btnSave", element).off("click").on("click", function () {
                ValidateGroupForm(function () {
                    SaveEditorForm(function () {
                        ClearEditorForm();
                        HideEditorForm();
                    });
                });
            });
            $(".btn-close", element).off("click").on("click", function () {
                ClearEditorForm(function () {
                    HideEditorForm();
                });
            });
            $("#groupManagerFormTab_Teams", element).off("click").on("click", function () {
                ShowGroupTeamTabContainer();
                MarkActiveEditorTab(this.id);
            });
            $("#groupManagerFormTab_Stats", element).off("click").on("click", function () {
                ShowGroupStatsTabContainer();
                MarkActiveEditorTab(this.id);
            });
/* Button Options End */

            scope.Initialize = function () {
                HideAll();
                SetConfigParameterValues();
                HandleBottomButtons();
                SetDatePickerFields();
                LoadStatusOptions();
                LoadProjectOptions();
                LoadLocationOptions();
                LoadSupervisorOptions();
                LoadTeamOptions();

                LoadLists("all");
            };
            function SetDatePickerFields() {
            }
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
            function LoadLocationOptions(callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getLocationList"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var objectList = $.parseJSON(data.locationList);
                        possibleLocations.length = 0
                        possibleLocations = objectList;
                        if (callback != null) {
                            callback(data);
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
            function LoadTeamOptions(callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "selfserv",
                        cmd: "getAllTeams"
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
            function LoadLists(listToLoad) {
                listToLoad = listToLoad.toLowerCase();

                let loadAll = (listToLoad == "all");

                if (listToLoad == "projects" || loadAll) {
                    $("#groupEditor_ProjectId", element).empty();
                    $("#groupEditor_ProjectId", element).append($('<option />', { value: "", text: "" }));
                    $("#groupManager_projectFilter", element).empty();
                    $("#groupManager_projectFilter", element).append($('<option />', { value: "", text: "" }));
                    for (var i = 0; i < possibleProjects.length; i++) {
                        var item = possibleProjects[i];
                        $("#groupEditor_ProjectId", element).append($('<option />', { value: item.ProjectId, text: item.ProjectDesc }));
                        $("#groupManager_projectFilter", element).append($('<option />', { value: item.ProjectId, text: item.ProjectDesc }));
                    }
                }
                if (listToLoad == "locations" || loadAll) {
                    $("#groupEditor_LocationId", element).empty();
                    $("#groupEditor_LocationId", element).append($('<option />', { value: "", text: "" }));
                    $("#groupManager_locationFilter", element).empty();
                    $("#groupManager_locationFilter", element).append($('<option />', { value: "", text: "" }));
                    for (var i = 0; i < possibleLocations.length; i++) {
                        var item = possibleLocations[i];
                        $("#groupEditor_LocationId", element).append($('<option />', { value: item.LocationId, text: item.Name }));
                        $("#groupManager_locationFilter", element).append($('<option />', { value: item.LocationId, text: item.Name }));
                    }
                }
                if (listToLoad == "supervisors" || loadAll) {
                    let supervisorList = SortSupervisorList();
                    $("#groupEditor_SupervisorUserId", element).empty();
                    $("#groupEditor_SupervisorUserId", element).append($('<option />', { value: "", text: "" }));
                    $("#groupManager_supervisorFilter", element).empty();
                    $("#groupManager_supervisorFilter", element).append($('<option />', { value: "", text: "" }));
                    for (var i = 0; i < supervisorList.length; i++) {
                        var item = supervisorList[i];
                        $("#groupEditor_SupervisorUserId", element).append($('<option />', { value: item.UserId, text: item.UserFullName }));
                        $("#groupManager_supervisorFilter", element).append($('<option />', { value: item.UserId, text: item.UserFullName }));
                    }
                }
                if (listToLoad == "groupstatus" || loadAll) {
                    $("#groupEditor_GroupStatus", element).empty();
                    $("#groupEditor_GroupStatus", element).append($('<option />', { value: "", text: "" }));
                    $("#groupManager_statusFilter", element).empty();
                    $("#groupManager_statusFilter", element).append($('<option />', { value: "", text: "All" }));
                    for (var i = 0; i < statusOptions.length; i++) {
                        var item = statusOptions[i];
                        $("#groupEditor_GroupStatus", element).append($('<option />', { value: item.StatusCode, text: item.StatusDesc }));
                        $("#groupManager_statusFilter", element).append($('<option />', { value: item.StatusCode, text: item.StatusDesc }));
                    }
                }
            }
            function PushCurrentSupervisorToSupervisorList(supervisorUserObject, assignedId) {
                let isInList = false;

                if (supervisorUserObject != null && supervisorUserObject.UserId != null && supervisorUserObject.UserId != "") {
                    $('#groupEditor_SupervisorUserId  option').each(function (isInList) {
                        if (this.value == supervisorUserObject.UserId) {
                            isInList = true;
                        }
                    });
                    if (isInList == false) {
                        $("#groupEditor_SupervisorUserId", element).append($('<option />', { value: supervisorUserObject.UserId, text: supervisorUserObject.UserFullName }));
                    }
                }
                else
                {
                    $('#groupEditor_SupervisorUserId  option').each(function (isInList) {
                        if (this.value == assignedId) {
                            isInList = true;
                        }
                    });
                    if (isInList == false) {
                        $("#groupEditor_SupervisorUserId", element).append($('<option />', { value: assignedId, text: assignedId }));
                    }
                }
            }
            function SortSupervisorList(listToSort)
            {
                if(listToSort == null)
                {
                    listToSort = possibleSupervisors;
                }
                let sortedList = listToSort;

                sortedList  = sortedList.sort((a,b) => {
                    if(a.FirstName > b.FirstName)
                    {
                        return 1;
                    }
                    else if(a.FirstName < b.FirstName)
                    {
                        return -1
                    }
                    else
                    {
                        if(a.LastName > b.LastName)
                        {
                            return 1;
                        }
                        else if (a.LastName < b.LastName)
                        {
                            return -1;
                        }
                        else
                        {
                            return 0;
                        }
                    }
                });

                return sortedList;
            }
            function HandleGroupListLoad(forceReload, callback) {
                WriteGroupLoadingMessage("Loading Group Information...");
                LoadGroupList(forceReload, function (listData) {
                    let listToRender = listData;
                    listToRender = FilterGroupList(listToRender);
                    listToRender = SortGroupList(listToRender);
                    RenderGroupList(listToRender, function () {
                        HideGroupLoadingMessage();
                        if (callback != null) {
                            callback();
                        }
                    });
                });
            }
            function LoadGroupList(forceReload, callback) {
                if (forceReload == null) {
                    forceReload = false;
                }
                if (possibleGroups != null && possibleGroups.length > 0 && forceReload == false) {
                    if (callback != null) {
                        callback(possibleGroups);
                    }
                }
                else {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "selfserv",
                            cmd: "getGroupList",
                            deepLoad: true
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            var groupList = $.parseJSON(data.groupList);
                            possibleGroups.length = 0;
                            possibleGroups = groupList;
                            if (callback != null) {
                                callback(groupList);
                            }
                        }
                    });

                }
            }
            function FilterGroupList(listToFilter)
            {
                let filteredList = listToFilter
                let groupNameFilter = $("#groupManager_groupNameFilter", element).val() || "";
                let supervisorFilter = $("#groupManager_supervisorFilter", element).val() || "";
                let locationFilter = $("#groupManager_locationFilter", element).val() || "";
                let projectFilter = $("#groupManager_projectFilter", element).val() || "";
                let statusFilter = $("#groupManager_statusFilter", element).val() || "";

                if(groupNameFilter != "")
                {
                    filteredList = filteredList.filter(g => g.GroupName.toLowerCase().includes(groupNameFilter.toLowerCase()));
                }
                if(supervisorFilter != "")
                {
                    filteredTeamList = filteredTeamList.filter(x => x.SupervisorUserId == supervisorFilter);
                }
                if(locationFilter != "")
                {
                    filteredTeamList = filteredTeamList.filter(x => x.LocationId == locationFilter);
                }
                if(projectFilter != "")
                {
                    filteredTeamList = filteredTeamList.filter(x => x.ProjectId == projectFilter);
                }
                if(statusFilter != "")
                {
                    filteredList = filteredList.filter(g => g.Status == statusFilter);
                }
                return filteredList;
            }
            function SortGroupList(listToSort, fieldToSort)
            {
                let sortedGroupList = listToSort;
                if(listToSort == null)
                {
                    sortedGroupList = possibleGroups;
                }

                if(sortedGroupList != null)
                {
                    switch(fieldToSort?.toLowerCase())
                    {
                        default:
                            sortedGroupList = sortedGroupList.sort((a,b) => {
                                if (a.GroupName.toLowerCase() < b.GroupName.toLowerCase()) {
                                    return -1;
                                }
                                if (a.GroupName.toLowerCase() > b.GroupName.toLowerCase()) {
                                    return 1;
                                }
                                if (a.GroupName.toLowerCase() == b.GroupName.toLowerCase()) {
                                    return 0;
                                }
                            });
                            break;
                    }
                }
                return sortedGroupList;
            }
            function RenderGroupList(listToRender, callback) {
                if (listToRender == null) {
                    listToRender = possibleGroups;
                }
                $("#groupListHolder", element).empty();
                let groupListHolder = $("<div class=\"group-list\" />");

                if (listToRender != null && listToRender.length > 0) {
                    for (let gc = 0; gc < listToRender.length; gc++) {
                        let groupItem = listToRender[gc];

                        let groupRowHolder = $("<div class=\"group-list-row\" id=\"groupRow_" + groupItem.GroupId + "\" />");

                        let groupExpanderHolder = $("<div class=\"group-list-item group-expander\" id=\"groupExpander_" + groupItem.GroupId + "\" />");
                        groupExpanderHolder.append("<i class=\"fa fa-plus\"></i>");
                        groupExpanderHolder.on("click", function () {
                            let itemId = this.id;
                            let groupId = itemId.split("_")[1];
                            ToggleTeamList(groupId);
                        });
                        let groupNameHolder = $("<div class=\"group-list-item group-name\" id=\"groupName_" + groupItem.GroupId + "\" />");
                        groupNameHolder.append(groupItem.GroupName);
                        groupNameHolder.on("click", function () {
                            let itemId = this.id;
                            let groupId = itemId.split("_")[1];
                            ToggleTeamList(groupId);
                        });
                        let groupLocationHolder = $("<div class=\"group-list-item group-location-name\" />");
                        let locationName = groupItem.LocationId;
                        if (groupItem.LocationIdSource != null) {
                            locationName = groupItem.LocationIdSource.LocationName;
                        }
                        else {
                            let location = possibleLocations.find(l => l.LocationId == groupItem.LocationId);
                            if (location != null) {
                                locationName = location.Name;
                            }
                        }
                        groupLocationHolder.append(locationName);

                        let groupSupervisorHolder = $("<div class=\"group-list-item group-leader-name\" />");
                        let supervisorName = groupItem.SupervisorUserId;
                        if (groupItem.SupervisorUserIdSource != null && groupItem.SupervisorUserIdSource.UserId != null) {
                            supervisorName = groupItem.SupervisorUserIdSource.UserFullName;
                        }
                        groupSupervisorHolder.append(supervisorName);

                        let groupProjectHolder = $("<div class=\"group-list-item group-project-name\" />");
                        let projectName = groupItem.ProjectId;
                        if (groupItem.ProjectIdSource != null) {
                            projectName = groupItem.ProjectIdSource.Name;
                        }
                        groupProjectHolder.append(projectName);

                        let groupStatusHolder = $("<div class=\"group-list-item group-status\" />");
                        let groupStatus = groupItem.Status;
                        let statusItem = statusOptions.find(s => s.StatusCode == groupItem.Status);
                        if (statusItem != null) {
                            groupStatus = statusItem.StatusDesc;
                        }

                        groupStatusHolder.append(groupStatus);

                        let groupTeamCountHolder = $("<div class=\"group-list-item group-team-count\" />");
                        let teamCount = groupItem.AssignedTeamsCount || 0;
                        groupTeamCountHolder.append(teamCount);
                        let groupUserCountHolder = $("<div class=\"group-list-item group-user-count\" />");
                        let userCount = groupItem.AssignedUsersCount || 0;
                        groupUserCountHolder.append(userCount);

                        let groupButtonHolder = $("<div class=\"group-list-item group-buttons\" />");

                        let editButton = $("<button class=\"group-buttons\" id=\"editGroup_" + groupItem.GroupId + "\"><i class=\"fa fa-edit\"></i></button>");
                        editButton.off("click").on("click", function () {
                            let itemId = this.id;
                            let groupId = itemId.split("_")[1];
                            LoadEditorForm(groupId, function () {
                                ShowEditorForm();
                            });
                        });

                        let groupTeamsRow = $("<div class=\"group-team-row team-list-holder\" id=\"teamsInGroup_" + groupItem.GroupId + "\" />");
                        BuildTeamsAssignedToGroup(groupItem.AssignedTeams, groupTeamsRow);

                        groupButtonHolder.append(editButton);

                        groupRowHolder.append(groupExpanderHolder);
                        groupRowHolder.append(groupNameHolder);
                        groupRowHolder.append(groupLocationHolder);
                        groupRowHolder.append(groupSupervisorHolder);
                        groupRowHolder.append(groupProjectHolder);
                        groupRowHolder.append(groupStatusHolder);
                        groupRowHolder.append(groupTeamCountHolder);
                        //Removed the user count currently until we can get numbers based on the data and how we want to display that information
                        //groupRowHolder.append(groupUserCountHolder);
                        groupRowHolder.append(groupButtonHolder);

                        groupRowHolder.append(groupTeamsRow);

                        groupListHolder.append(groupRowHolder);
                    }
                }
                else {
                    groupListHolder.append("No Groups Found.");
                }

                $("#groupListHolder", element).append(groupListHolder);

                HideAllTeamsInGroup();

                if (callback != null) {
                    callback();
                }
            }
            function BuildTeamsAssignedToGroup(listToRender, objectToRenderTo) {
                let teamsAssignedHolder = $("<div class=\"group-thing-team-list-holder\" />");
                if (listToRender != null && listToRender.length > 0) {

                    let groupTeamRowThings = $("<div class=\"group-thing-team-list-row-holder\" />");
                    let groupTeamRowHeader = $("<div class=\"group-thing-team-list-row-header\" />");
                    groupTeamRowHeader.append("<div class=\"things-list-header-label-item\">Teams</div>");

                    groupTeamRowThings.append(groupTeamRowHeader);

                    for (let tc = 0; tc < listToRender.length; tc++) {
                        let teamItem = listToRender[tc];
                        let teamAssignedRow = $("<div class=\"group-team-assigned-row\" />");
                        let teamAssignedNameHolder = $("<div class=\"\" />");
                        let teamName = teamItem.Name;
                        if(teamItem.Status.toUpperCase() == "I")
                        {
                            teamAssignedRow.addClass("inactive");

                            teamName += " (INACTIVE)";
                        }

                        teamAssignedNameHolder.append(teamName);

                        teamAssignedRow.append(teamAssignedNameHolder);

                        groupTeamRowThings.append(teamAssignedRow);

                    }
                    teamsAssignedHolder.append(groupTeamRowThings);
                }
                else {
                    teamsAssignedHolder.append("No teams found in group.");
                }

                objectToRenderTo.append(teamsAssignedHolder);
            }
            function ValidateGroupForm(callback) {
                var formValid = true;
                var errorMessages = [];
                let locationId = parseInt($("#groupEditor_LocationId", element).val());
                let projectId = parseInt($("#groupEditor_ProjectId", element).val());
                let supervisorUserId = $("#groupEditor_SupervisorUserId", element).val();
                let groupName = $("#groupEditor_GroupName", element).val();
                let groupStatus = $("#groupEditor_GroupStatus", element).val();

                if (locationId == null || locationId == 0 || locationId == "" || isNaN(locationId)) {
                    errorMessages.push({ message: "Location Required", fieldclass: "", fieldid: "groupEditor_LocationId" });
                    formValid = false;
                }

                if (projectId == null || projectId == 0 || projectId == "" || isNaN(projectId)) {
                    errorMessages.push({ message: "Project Required", fieldclass: "", fieldid: "groupEditor_ProjectId" });
                    formValid = false;
                }

                if (supervisorUserId == null || supervisorUserId == "") {
                    errorMessages.push({ message: "Supervisor Required", fieldclass: "", fieldid: "groupEditor_SupervisorUserId" });
                    formValid = false;
                }
                if (groupName == null || groupName == "") {
                    errorMessages.push({ message: "Name Required", fieldclass: "", fieldid: "groupEditor_GroupName" });
                    formValid = false;
                }
                if (groupStatus == null || groupStatus == "") {
                    errorMessages.push({ message: "Status Required", fieldclass: "", fieldid: "groupEditor_GroupStatus" });
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

            };
            function ClearEditorForm(callback) {

                $(".error-information-holder", element).empty();
                $(".error-information-holder", element).hide();

                $("#editorFormType", element).val("add");
                $("#groupEditor_GroupId", element).val(-1);
                $("#groupEditor_GroupName", element).val("");
                $("#groupEditor_ProjectId", element).val("");
                $("#groupEditor_LocationId", element).val("");
                $("#groupEditor_SupervisorUserId", element).val("");
                $("#groupEditor_GroupStatus", element).val("A");

                $("#groupEditor_AgentCoachingSessions", element).val(defaultCoachingSessions);
                $("#groupEditor_AgentRecognitions", element).val(defaultRecognitions);


                if (callback != null) {
                    callback();
                }
            }
            function SaveEditorForm(callback) {
                let groupToSave = CollectEditorDataForGroup();
                SaveGroup(groupToSave, function(){
                    HandleGroupListLoad(true, function(){
                        if(callback != null)
                        {
                            callback();
                        }
                    });
                });                
            }
            function SaveGroup(groupObject, callback)
            {
                let formType = $("#editorFormType", element).val() || "add";
                if(groupObject != null)
                {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "selfserve",
                            cmd: "saveGroup",
                            groupitem: JSON.stringify(groupObject),
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
            function CollectEditorDataForGroup() {
                let returnObject = new Object();

                returnObject.GroupId = $("#groupEditor_GroupId", element).val() || -1;
                returnObject.LocationId = $("#groupEditor_LocationId", element).val();
                returnObject.ProjectId = $("#groupEditor_ProjectId", element).val();;
                returnObject.SupervisorUserId = $("#groupEditor_SupervisorUserId", element).val();;
                returnObject.GroupName = $("#groupEditor_GroupName", element).val();
                returnObject.Status = $("#groupEditor_GroupStatus", element).val();
                let coachingSessions =$("#groupEditor_AgentCoachingSessions", element).val();
                if(coachingSessions == null || coachingSessions == "")
                {
                    coachingSessions = -1;
                }
                returnObject.CoachingSessionsPerAgentPerMonth = parseInt(coachingSessions);
                let recognitions =$("#groupEditor_AgentRecognitions", element).val();
                if(recognitions == null || recognitions == "")
                {
                    recognitions = -1;
                }
                returnObject.RecognitionsPerAgentPerMonth = parseInt(recognitions);
                
                returnObject.CreatedOn = new Date().toLocaleDateString();
                returnObject.CreatedBy = legacyContainer.scope.TP1Username;
                returnObject.UpdatedOn = new Date().toLocaleDateString();
                returnObject.UpdatedBy = legacyContainer.scope.TP1Username;
                
                return returnObject;
            }
            function ClearFilters(callback)
            {
                $("#groupManager_groupNameFilter", element).val("");
                $("#groupManager_supervisorFilter", element).val("");
                $("#groupManager_locationFilter", element).val("");
                $("#groupManager_projectFilter", element).val("");
                $("#groupManager_statusFilter", element).val("A");

                if(callback != null)
                {
                    callback();
                }
            }
            function LoadEditorForm(groupId, callback) {
                let group = possibleGroups.find(g => g.GroupId == groupId);
                if (group != null) {
                    let coachingSessions = group.CoachingSessionsPerAgentPerMonth;
                    if(coachingSessions == "" || coachingSessions == -1)
                    {
                        coachingSessions = defaultCoachingSessions;
                    }
                    let recognitions =  group.RecognitionsPerAgentPerMonth;
                    if(recognitions == "" || recognitions == -1)
                    {
                        recognitions = defaultRecognitions;
                    }
                    $("#editorFormType", element).val("edit");
                    $("#groupEditor_GroupId", element).val(group.GroupId);
                    $("#groupEditor_GroupName", element).val(group.GroupName);
                    $("#groupEditor_ProjectId", element).val(group.ProjectId);
                    $("#groupEditor_LocationId", element).val(group.LocationId);
                    let currentSupervisor = possibleSupervisors.find(u => u.UserId == group.SupervisorUserId);
                    if (currentSupervisor == null) {
                        currentSupervisor = group.SupervisorUserIdSource;
                        PushCurrentSupervisorToSupervisorList(currentSupervisor, group.SupervisorUserId);
                    }
                    $("#groupEditor_SupervisorUserId", element).val(group.SupervisorUserId);

                    $("#groupEditor_GroupStatus", element).val(group.Status);
                    $("#groupEditor_AgentCoachingSessions", element).val(coachingSessions);
                    $("#groupEditor_AgentRecognitions", element).val(recognitions);


                    LoadGroupTeamsInEditorForm(group.GroupId, function(groupList){
                        RenderGroupTeamsInEditorForm(groupList, group.groupId);
                    });
                    ko.postbox.publish("itemStatsTabLoad", {section:"group", id: groupId});
                }
                else {
                    $("#groupEditor_AgentCoachingSessions", element).val(defaultCoachingSessions);
                    $("#groupEditor_AgentRecognitions", element).val(defaultRecognitions);

                    $("#editorFormType", element).val("add");
                    $("#groupEditor_GroupId", element).val(-1);

                }
                if (callback != null) {
                    callback();
                }
            }
            function LoadGroupTeamsInEditorForm(groupId, callback)
            {
                let returnList = null;
                let group = possibleGroups.find(g => g.GroupId == groupId);
                if(group != null)
                {
                    returnList = group.AssignedTeams;
                }
                if(callback != null)
                {
                    callback(returnList);
                }
            }
            function RenderGroupTeamsInEditorForm(listToRender, groupId, callback)
            {
                if(listToRender == null || listToRender.length == 0)
                {
                    let group = possibleGroups.find(g => g.GroupId == groupId);
                    if(group != null)
                    {
                        listToRender = group.AssignedTeams || [];
                    }
                }
                $("#groupManager_TeamsTabContainer", element).empty();
                let teamGroupListHolder = $("<div />");
                if(listToRender.length > 0)
                {
                    for(let tc = 0; tc < listToRender.length; tc++)
                    {
                        let teamItem = listToRender[tc];
                        let teamRow = $("<div class=\"sub-tab-row-holder\" />");
                        let teamNameHolder = $("<div class=\"\" />");
                        let teamName = teamItem.TeamName;
                        teamNameHolder.append(teamName);
                        teamRow.append(teamNameHolder);
                        teamGroupListHolder.append(teamRow);
                    }
                }
                else
                {
                    teamGroupListHolder.append("No Teams found for group.");
                }
                $("#groupManager_TeamsTabContainer", element).append(teamGroupListHolder);

                if(callback != null)
                {
                    callback();
                }
            }
            function HandleBottomButtons() {                
                appLib.getConfigParameterByName("DAILY_IMPORT_ROSTER", function(returnParameter){
                    if(returnParameter != null)
                    {
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
            function HideAll() {
                HideEditorForm();
                HideAllTabContainers();
            }
            function HideAllTabContainers() {
                HideGroupStatsTabContainer();
                HideGroupTeamTabContainer();
            }
            function MarkActiveEditorTab(tabId) {
                $("div[id^='groupManagerFormTab_']", element).each(function () {
                    $(this).removeClass("active");
                });
                $("#" + tabId, element).addClass("active");
            }
            function HideAllTeamsInGroup() {
                $(".team-list-holder", element).each(function () {
                    $(this).hide();
                });
                $(".group-expander i", element).each(function () {
                    if (this.id == null || this.id != "collapseAll") {
                        $(this).removeClass("fa-minus");
                        $(this).addClass("fa-plus");
                    }
                });
            }
            function HideEditorForm() {
                $("#groupEditorFormPanel", element).hide();
            }
            function ShowEditorForm() {
                $("#groupEditorFormPanel", element).show();
                $(".tab-holder-item", $("#groupEditorFormPanel", element))[0].click();
            }
            function WriteGroupLoadingMessage(messageToWrite) {
                $("#groupLoadingMessage", element).empty();
                $("#groupLoadingMessage", element).append(messageToWrite);
                ShowGroupLoadingMessage();
            }
            function HideGroupLoadingMessage() {
                $("#groupLoadingHolder", element).hide();
            }
            function ShowGroupLoadingMessage() {
                $("#groupLoadingHolder", element).show();
            }
            function ToggleTeamList(groupId) {
                let isCurrentlyVisible = $("#teamsInGroup_" + groupId, element).is(":visible");
                let expanderClass = "fa-minus";

                if (isCurrentlyVisible == true) {
                    HideTeamsInGroup(groupId);
                    expanderClass = "fa-plus";
                }
                else {
                    ShowTeamsInGroup(groupId);
                }
                $("i", $("#groupExpander_" + groupId)).removeClass("fa-plus");
                $("i", $("#groupExpander_" + groupId)).removeClass("fa-minus");
                $("i", $("#groupExpander_" + groupId)).addClass(expanderClass);

            }
            function HideTeamsInGroup(groupId) {
                $("#teamsInGroup_" + groupId, element).hide();
            }
            function ShowTeamsInGroup(groupId) {
                $("#teamsInGroup_" + groupId, element).show();
            }
            function HideGroupTeamTabContainer() {
                $("#groupManager_TeamsTabContainer", element).hide();
            }
            function ShowGroupTeamTabContainer() {
                HideAllTabContainers();
                $("#groupManager_TeamsTabContainer", element).show();
            }
            function HideGroupStatsTabContainer() {
                $("#groupManager_StatsTabContainer", element).hide();
            }
            function ShowGroupStatsTabContainer() {
                HideAllTabContainers();
                $("#groupManager_StatsTabContainer", element).show();
            }
            function HideBottomButtons() {
                $(".bottom-buttons", element).hide();
            }
            function ShowBottomButtons() {
                $(".bottom-buttons", element).show();
            }
            scope.load = function () {
                scope.Initialize();
                HandleGroupListLoad();
                HideGroupLoadingMessage();
            };
            ko.postbox.subscribe("groupAdminReload", function (requireReload) {
                if (requireReload == true) {
                    possibleGroups.length = 0;
                }
                WriteGroupLoadingMessage("Reloading groups data...");
                window.setTimeout(function () {
                    HandleGroupListLoad();
                }, 500);

            });
            ko.postbox.subscribe("groupAdminLoad", function () {
                scope.load();
            });
        }
    };
}]);