angularApp.directive("ngProjectManager", ['api', '$rootScope', function (api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/projectManager.htm?' + Date.now(),
        scope: {
            assoc: "@",
            text: "@",
            details: "@",
            cid: "@",
            filters: "@",
            panel: "@",
            hidetopper: "@",
            toppertext: "@",
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
            var possibleProjects = [];
            var statusOptions = [];
            var modelOptions = [];
            var possibleLocations = []
            var possibleGroups = [];
            var possibleTeams = [];
            var defaultCoachingSessions = -1;
            var defaultRecognitions = -1;
            /* Button Click Start */
            $("#btnAddNewProject", element).off("click").on("click", function () {
                ClearEditorForm(function () {
                    LoadEditorForm(null, function () {
                        ShowEditorForm();
                    });
                });
            });
            $("#btnApplyFilter", element).off("click").on("click", function () {
                WriteProjectLoadingMessage("Applying filters...");
                window.setTimeout(function () {
                    HandleProjectListLoad(false, function () {
                        HideProjectLoadingMessage();
                    });
                }, 500);
            });
            $("#btnClearFilter", element).off("click").on("click", function () {
                WriteProjectLoadingMessage("Clearing filters and reloading list...");
                window.setTimeout(function () {
                    ClearFilters(function () {
                        HandleProjectListLoad(false, function () {
                            HideProjectLoadingMessage();
                        });
                    });
                }, 500);
            });
            $("#btnSave", element).off("click").on("click", function () {
                ValidateProjectForm(function () {
                    SaveProjectForm(function () {
                        ClearEditorForm();
                        HideEditorForm();
                        ko.postbox.publish("projectAdminReload", true);
                    });
                });
            });
            $(".btn-close", element).off("click").on("click", function () {
                ClearEditorForm(function () {
                    HideEditorForm();
                });
            });
            $("#projectManagerFormTab_Locations", element).off("click").on("click", function () {
                ShowLocationsTabContainer();
                MarkActiveEditorTab(this.id);
            });
            $("#projectManagerFormTab_Groups", element).off("click").on("click", function () {
                ShowGroupsTabContainer();
                MarkActiveEditorTab(this.id);
            });
            $("#projectManagerFormTab_Teams", element).off("click").on("click", function () {
                ShowTeamsTabContainer();
                MarkActiveEditorTab(this.id);
            });
            $("#projectManagerFormTab_Users", element).off("click").on("click", function () {
                ShowUsersTabContainer();
                MarkActiveEditorTab(this.id);
            });
            $("#projectManagerFormTab_Stats", element).off("click").on("click", function () {
                ShowStatsTabContainer();
                MarkActiveEditorTab(this.id);
            });
            /* Button Click End */
            scope.Initialize = function () {
                HideAll();
                SetConfigParameterValues();
                SetDatePickerFields();
                HandleBottomButtons();
                LoadPossibleLocations();
                LoadPossibleGroups();
                LoadPossibleTeams();
                LoadStatusOptions();
                LoadModelOptions();
                LoadLists("ALL");
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
            function LoadLists(listToLoad) {
                listToLoad = listToLoad.toLowerCase();
                let loadAll = (listToLoad == "all");
                if (listToLoad == "projectstatus" || loadAll) {
                    $("#projectEditor_ProjectStatus", element).empty();
                    $("#projectEditor_ProjectStatus", element).append($('<option />', { value: "", text: "" }));
                    $("#projectManager_ProjectStatusFilter", element).empty();
                    $("#projectManager_ProjectStatusFilter", element).append($('<option />', { value: "", text: "All" }));
                    for (var i = 0; i < statusOptions.length; i++) {
                        var item = statusOptions[i];
                        $("#projectEditor_ProjectStatus", element).append($('<option />', { value: item.StatusCode, text: item.StatusDesc }));
                        $("#projectManager_ProjectStatusFilter", element).append($('<option />', { value: item.StatusCode, text: item.StatusDesc }));
                    }
                }
                if (listToLoad == "models" || loadAll) {
                    for (var i = 0; i < modelOptions.length; i++) {
                        var item = modelOptions[i];
                        $("#projectEditor_ModelId", element).append($('<option />', { value: item.ModelId, text: item.ModelName }));
                    }
                }
            }
            function LoadPossibleLocations(callback) {
                if (possibleLocations == null || possibleLocations.length == 0) {
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
                            let locationList = $.parseJSON(data.locationList);
                            possibleLocations.length = 0;
                            possibleLocations = locationList;
                            if (callback != null) {
                                callback(locationList);
                            }
                        }
                    });
                }
            }
            function LoadPossibleGroups(callback) {
                if (possibleGroups == null || possibleGroups.length == 0) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "getGroupList",
                            deepload: false
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            let groupList = $.parseJSON(data.groupList);
                            possibleGroups.length = 0;
                            possibleGroups = groupList;
                            if (callback != null) {
                                callback(groupList);
                            }
                        }
                    });
                }
            }
            function LoadPossibleTeams(callback) {
                if (possibleTeams == null || possibleTeams.length == 0) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "getTeamList",
                            deepload: false
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            let teamList = $.parseJSON(data.teamList);
                            possibleTeams.length = 0;
                            possibleTeams = teamList;
                            if (callback != null) {
                                callback(teamList);
                            }
                        }
                    });
                }
            }
            function LoadStatusOptions() {
                //TODO: Pull from database?
                statusOptions.length = 0;
                statusOptions.push({ StatusId: 1, StatusCode: "A", StatusDesc: "Active" });
                statusOptions.push({ StatusId: 2, StatusCode: "I", StatusDesc: "Inactive" });
            }
            function LoadModelOptions() {
                //TODO: Pull from database?
                modelOptions.length = 0;
                modelOptions.push({ ModelId: 1, ModelName: "Default" });
                modelOptions.push({ ModelId: 2, ModelName: "Model 2" });
                modelOptions.push({ ModelId: 3, ModelName: "Model 3" });
                modelOptions.push({ ModelId: 4, ModelName: "Model 4" });

            }
            function LoadEditorForm(projectId, callback) {
                let project = possibleProjects.find(p => p.ProjectId == projectId);
                if (project != null) {

                    let coachingSessions = project.CoachingSessionsPerAgentPerMonth;
                    if (coachingSessions == "" || coachingSessions == -1) {
                        coachingSessions = defaultCoachingSessions;
                    }
                    let recognitions = project.RecognitionsPerAgentPerMonth;
                    if (recognitions == "" || recognitions == -1) {
                        recognitions = defaultRecognitions;
                    }
                    $("#projectEditor_ProjectId", element).val(project.ProjectId);
                    $("#editorFormType", element).val("edit");
                    $("#projectEditor_ProjectName", element).val(project.Name);
                    $("#projectEditor_ProjectStatus", element).val(project.Status);
                    $("#projectEditor_RosterCode", element).val(project.RosterCode);
                    $("#projectEditor_ClientId", element).val(project.CliendId);
                    $("#projectEditor_ModelId", element).val(project.ModelId);
                    $("#projectEditor_AgentCoachingSessions", element).val(coachingSessions);
                    $("#projectEditor_AgentRecognitions", element).val(recognitions);

                    BuildLocationsForProjectInEditorForm(project, project.ProjectId);
                    BuildGroupsForProjectInEditorForm(project, project.ProjectId);
                    BuildTeamsForProjectInEditorForm(project, project.ProjectId);
                    BuildUsersForProjectInEditorForm(project, project.ProjectId);
                    ko.postbox.publish("itemStatsTabLoad", { section: "project", id: project.ProjectId });
                }
                else {
                    $("#projectEditor_AgentCoachingSessions", element).val(defaultCoachingSessions);
                    $("#projectEditor_AgentRecognitions", element).val(defaultRecognitions);

                    $("#projectEditor_ProjectId", element).val(-1);
                    $("#editorFormType", element).val("add");
                }
                if (callback != null) {
                    callback();
                }
            }
            function BuildLocationsForProjectInEditorForm(projectObject, projectId, callback) {
                if (projectObject == null) {
                    projectObject = possibleProjects.find(p => p.ProjectId == projectId);
                }
                let projectManagerLocationsList = $("<div />");
                $("#projectManager_LocationsTabContainer", element).empty();

                let projectLocationList = [];
                projectLocationList = projectObject.AssignedLocations;
                if (projectLocationList == null || projectLocationList.length == 0) {
                    projectLocationList = [];
                    let locationIdsToLoad = GetLocationsFromGroupsAssignedToProject(projectObject.ProjectId);
                    $(locationIdsToLoad).each(function () {
                        let location = possibleLocations.find(l => l.LocationId == this);
                        if (location != null) {
                            projectLocationList.push(location);
                        }
                    });
                }

                if (projectLocationList != null && projectLocationList.length > 0) {
                    for (let lc = 0; lc < projectLocationList.length; lc++) {
                        let locationItem = projectLocationList[lc];
                        let assignedLocationRow = $("<div class=\"location-assigned-row\" />");
                        let assignedLocationNameHolder = $("<div class=\"\" />");
                        let locationName = locationItem?.Name || "[Location Name NOT FOUND]";
                        assignedLocationNameHolder.append(locationName);

                        assignedLocationRow.append(assignedLocationNameHolder);

                        projectManagerLocationsList.append(assignedLocationRow);
                    }

                }
                else {
                    projectManagerLocationsList.append("No locations found for project");
                }
                $("#projectManager_LocationsTabContainer", element).append(projectManagerLocationsList);
            }
            function GetLocationsFromGroupsAssignedToProject(projectId) {
                let returnArray = [];
                let groupsList = possibleGroups.filter(g => g.ProjectId == projectId);
                if (groupsList != null && groupsList.length > 0) {
                    $(groupsList).each(function () {
                        let locationIndex = returnArray.findIndex(i => i == this.LocationId);
                        if (locationIndex < 0) {
                            returnArray.push(this.LocationId);
                        }
                    })
                }
                return returnArray;
            }
            function BuildGroupsForProjectInEditorForm(projectObject, projectId, callback) {
                if (projectObject == null) {
                    projectObject = possibleProjects.find(p => p.ProjectId == projectId);
                }
                let projectManageGroupList = $("<div />");
                $("#projectManager_GroupsTabContainer", element).empty();
                let projectGroupList = [];
                projectGroupList = projectObject.AssignedGroups;

                if (projectGroupList == null || projectGroupList.length == 0) {
                    projectGroupList = possibleGroups.filter(g => g.ProjectId == projectObject.ProjectId);
                }

                if (projectGroupList != null && projectGroupList.length > 0) {
                    for (let lc = 0; lc < projectGroupList.length; lc++) {
                        let groupItem = projectGroupList[lc];
                        let assignedGroupRow = $("<div class=\"group-assigned-row\" />");
                        let assignedGroupNameHolder = $("<div class=\"\" />");

                        assignedGroupNameHolder.append(groupItem.GroupName);

                        assignedGroupRow.append(assignedGroupNameHolder);

                        projectManageGroupList.append(assignedGroupRow);
                    }

                }
                else {
                    projectManageGroupList.append("No groups found for project");
                }


                $("#projectManager_GroupsTabContainer", element).append(projectManageGroupList);
            }
            function BuildTeamsForProjectInEditorForm(projectObject, projectId, callback) {
                if (projectObject == null) {
                    projectObject = possibleProjects.find(p => p.ProjectId == projectId);
                }
                let projectManagerTeamList = $("<div />");
                $("#projectManager_TeamsTabContainer", element).empty();
                let projectTeamList = [];
                projectTeamList = projectObject.AssignedTeams;

                if (projectTeamList == null || projectTeamList.length == 0) {
                    projectTeamList = possibleTeams.filter(t => t.ProjectId == projectObject.ProjectId);
                }
                if (projectTeamList != null && projectTeamList.length > 0) {
                    for (let lc = 0; lc < projectTeamList.length; lc++) {
                        let teamItem = projectTeamList[lc];
                        let assignedTeamRow = $("<div class=\"team-assigned-row\" />");
                        let assignedTeamNameHolder = $("<div class=\"\" />");

                        let teamName = teamItem.TeamName;
                        if (teamItem.GroupIdSource != null) {
                            teamName += " <span class=\"group-name-with-team-name\">(" + teamItem.GroupIdSource.GroupName + ")</span>"
                        }
                        else if (teamItem.GroupId != null && teamItem.GroupId != "") {
                            let group = possibleGroups.find(g => g.GroupId == teamItem.GroupId);
                            if (group != null) {
                                teamName += " <span class=\"group-name-with-team-name\">(" + group.GroupName + ")<span>"
                            }
                        }
                        assignedTeamNameHolder.append(teamName);


                        assignedTeamRow.append(assignedTeamNameHolder);

                        projectManagerTeamList.append(assignedTeamRow);
                    }

                }
                else {
                    projectManagerTeamList.append("No teams found for project");
                }


                $("#projectManager_TeamsTabContainer", element).append(projectManagerTeamList);
            }
            function BuildUsersForProjectInEditorForm(projectObject, projectId, callback) {
                $("#projectManager_UsersTabContainer", element).empty();
                $("#projectManager_UsersTabContainer", element).append("Users for project here.");
            }
            function BuildStatsForProjectInEditorForm(projectObject, projectId, callback) {
                $("#projectManager_StatsTabContainer", element).empty();
                $("#projectManager_StatsTabContainer", element).append("Stats coming soon.");
            }
            function ValidateProjectForm(callback) {
                var formValid = true;
                var errorMessages = [];
                var projectName = $("#projectEditor_ProjectName", element).val();
                var projectStatus = $("#projectEditor_ProjectStatus", element).val();

                if (projectName == null || projectName == "") {
                    errorMessages.push({ message: "Project Name Required", fieldclass: "", fieldid: "projectEditor_ProjectName" });
                    formValid = false;
                }
                if (projectStatus == null || projectStatus == "") {
                    errorMessages.push({ message: "Status Required", fieldclass: "", fieldid: "projectEditor_ProjectStatus" });
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
            function ClearEditorForm(callback) {
                $("#projectEditor_ProjectId", element).val(-1);
                $("#editorFormType", element).val("add");
                $("#projectEditor_ProjectName", element).val("");
                $("#projectEditor_ProjectStatus", element).val("");
                $("#projectEditor_RosterCode", element).val("");
                $("#projectEditor_ClientId", element).val("");
                $("#projectEditor_ModelId", element).val(1);
                $("#projectEditor_AgentCoachingSessions", element).val(defaultCoachingSessions)
                $("#projectEditor_AgentRecognitions", element).val(defaultRecognitions)

                $("#projectManager_LocationsTabContainer", element).empty();
                $("#projectManager_GroupsTabContainer", element).empty();
                $("#projectManager_TeamsTabContainer", element).empty();
                $("#projectManager_UsersTabContainer", element).empty();
                // $("#projectManager_StatsTabContainer", element).empty();

                $(".error-information-holder", element).empty();
                $(".error-information-holder", element).hide();
                if (callback != null) {
                    callback();
                }
            }
            function SaveProjectForm(callback) {
                let projectToSave = CollectEditorDataForProject();
                SaveProject(projectToSave, function () {
                    HandleProjectListLoad(true, function () {
                        HideEditorForm();
                        if (callback != null) {
                            callback();
                        }
                    });
                });
            }
            function SaveProject(projectObject, callback) {
                let formType = $(".editor-form-team-type", element).val() || "add";

                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "selfserve",
                        cmd: "saveProject",
                        projectitem: JSON.stringify(projectObject),
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
            function CollectEditorDataForProject() {
                let returnObject = new Object();
                returnObject.ProjectId = parseInt($("#projectEditor_ProjectId", element).val());
                returnObject.ProjectDesc = $("#projectEditor_ProjectName", element).val();
                returnObject.Status = $("#projectEditor_ProjectStatus", element).val();
                returnObject.ModelId = $("#projectEditor_ModelId", element).val() || 1;
                returnObject.RosterCode = $("#projectEditor_RosterCode", element).val();
                let coachingSessions = $("#projectEditor_AgentCoachingSessions", element).val();
                if (coachingSessions == null || coachingSessions == "") {
                    coachingSessions = -1;
                }
                returnObject.CoachingSessionsPerAgentPerMonth = parseInt(coachingSessions);
                let recognitions = $("#projectEditor_AgentRecognitions", element).val();
                if (recognitions == null || recognitions == "") {
                    recognitions = -1;
                }
                returnObject.RecognitionsPerAgentPerMonth = parseInt(recognitions);
                returnObject.CreatedOn = new Date().toLocaleDateString();
                returnObject.CreatedBy = legacyContainer.scope.TP1Username;
                returnObject.UpdatedOn = new Date().toLocaleDateString();
                returnObject.UpdatedBy = legacyContainer.scope.TP1Username;

                return returnObject;
            }
            function ClearFilters(callback) {
                $("#projectManager_ProjectNameFilter", element).val("");
                $("#projectManager_ProjectStatusFilter", element).val("A");

                if (callback != null) {
                    callback();
                }
            }
            function HandleProjectListLoad(forceReload, callback) {
                WriteProjectLoadingMessage("Loading project information...");
                LoadProjectList(forceReload, function (listData) {
                    let listToRender = listData;
                    listToRender = FilterProjectList(listToRender);
                    listToRender = SortProjectList(listToRender);
                    RenderProjectList(listToRender, function () {
                        HideProjectLoadingMessage();
                        if (callback != null) {
                            callback();
                        }
                    });
                });
            }
            function LoadProjectList(forceReload, callback) {
                if (forceReload == null) {
                    forceReload = false;
                }
                if (possibleProjects != null && possibleProjects.length > 0 && forceReload == false) {
                    if (callback != null) {
                        callback(possibleProjects);
                    }
                }
                else {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "selfserve",
                            cmd: "getProjectList",
                            projectid: 0,
                            deepload: true
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            let projectList = $.parseJSON(data.projectList);
                            possibleProjects.length = 0;
                            possibleProjects = projectList;
                            if (callback != null) {
                                callback(projectList);
                            }
                        }
                    });
                }
            }
            function FilterProjectList(listToFilter) {
                let filteredList = listToFilter;
                let projectNameFilter = $("#projectManager_ProjectNameFilter", element).val() || "";
                let projectStatusFilter = $("#projectManager_ProjectStatusFilter", element).val() || "";

                if (projectNameFilter != "") {
                    filteredList = filteredList.filter(p => p.ProjectDesc.toLowerCase().includes(projectNameFilter.toLowerCase()));
                }
                if (projectStatusFilter != "") {
                    filteredList = filteredList.filter(p => p.Status == projectStatusFilter);
                }

                return filteredList;
            }
            function SortProjectList(listToSort, fieldToSort) {
                let sortedProjectList = listToSort;
                if (listToSort == null) {
                    sortedProjectList = possibleProjects;
                }
                if (sortedProjectList != null) {
                    switch (fieldToSort?.toLowerCase()) {
                        default:
                            sortedProjectList = sortedProjectList.sort((a, b) => {
                                if (a.ProjectDesc.toLowerCase() < b.ProjectDesc.toLowerCase()) {
                                    return -1;
                                }
                                if (a.ProjectDesc.toLowerCase() > b.ProjectDesc.toLowerCase()) {
                                    return 1;
                                }
                                if (a.ProjectDesc.toLowerCase() == b.ProjectDesc.toLowerCase()) {
                                    return 0;
                                }
                            });
                            break;
                    }
                }

                return sortedProjectList;
            }
            function RenderProjectList(listToRender, callback) {
                if (listToRender == null) {
                    listToRender = possibleProjects;
                }
                $("#projectListHolder", element).empty();
                let projectListHolder = $("<div class=\"project-list\" />");

                if (listToRender != null && listToRender.length > 0) {
                    for (let pc = 0; pc < listToRender.length; pc++) {
                        let projectItem = listToRender[pc];

                        let locationArray = GetLocationsFromGroupsAssignedToProject(projectItem.ProjectId);
                        let locationsList = [];
                        for (let lc = 0; lc < locationArray.length; lc++) {
                            let location = possibleLocations.find(l => l.LocationId == locationArray[lc]);
                            let lIndex = locationsList.findIndex(l => l.LocationId == locationArray[lc]);
                            if (lIndex < 0) {
                                locationsList.push(location);
                            }
                        }

                        let groupsList = possibleGroups.filter(g => g.ProjectId == projectItem.ProjectId);
                        let teamsList = possibleTeams.filter(t => t.ProjectId == projectItem.ProjectId);

                        let projectRowHolder = $("<div class=\"project-list-row\" id=\"projectRow_" + projectItem.ProjectId + "\" />");
                        let projectExpanderHolder = $("<div class=\"project-list-item project-expander\" id=\"projectExpander_" + projectItem.ProjectId + "\" />");
                        projectExpanderHolder.append("<i class=\"fa fa-plus\"></i>");
                        projectExpanderHolder.on("click", function () {
                            let itemId = this.id;
                            let projectId = itemId.split("_")[1];
                            ToggleProjectList(projectId);
                        });
                        let projectNameHolder = $("<div class=\"project-list-item project-name\" id=\"projectName_" + projectItem.ProjectId + "\" />");
                        projectNameHolder.append(projectItem.ProjectDesc);
                        projectNameHolder.on("click", function () {
                            let itemId = this.id;
                            let projectId = itemId.split("_")[1];
                            ToggleProjectList(projectId);
                        });
                        let projectStatusHolder = $("<div class=\"project-list-item project-status\" />");
                        let projectStatus = projectItem.Status;
                        let statusItem = statusOptions.find(s => s.StatusCode == projectItem.Status);
                        if (statusItem != null) {
                            projectStatus = statusItem.StatusDesc;
                        }
                        projectStatusHolder.append(projectStatus);

                        let projectLocationCountHolder = $("<div class=\"project-list-item project-location-count\" />");
                        let locationsForProjectCount = projectItem.AssignedLocations?.length || 0;
                        if (locationsForProjectCount == 0) {
                            let locationsForProjectArray = GetLocationsFromGroupsAssignedToProject(projectItem.ProjectId);
                            if (locationsForProjectArray != null) {
                                locationsForProjectCount = locationsForProjectArray.length;
                            }
                        }
                        projectLocationCountHolder.append(locationsForProjectCount);
                        let projectGroupCountHolder = $("<div class=\"project-list-item project-group-count\" />");
                        let groupsForProjectCount = projectItem.AssignedGroups?.length || 0;

                        if (groupsForProjectCount == 0) {
                            groupsForProjectCount = groupsList?.length || 0;
                            //groupsForProjectCount = groupsList?.length;
                        }
                        projectGroupCountHolder.append(groupsForProjectCount);
                        let projectTeamCountHolder = $("<div class=\"project-list-item project-team-count\" />");
                        let teamsForProjectCount = projectItem.AssignedTeams?.length || 0;
                        if (teamsForProjectCount == 0) {
                            teamsForProjectCount = teamsList?.length || 0;
                            //teamsForProjectCount = possibleTeams.filter(t => t.ProjectId == projectItem.ProjectId)?.length;
                        }
                        projectTeamCountHolder.append(teamsForProjectCount);
                        // let projectUserCountHolder = $("<div class=\"project-list-item project-user-count\" />");                        
                        // projectUserCountHolder.append(0);
                        let projectButtonsHolder = $("<div class=\"project-list-item project-buttons\" />");

                        let projectEditButton = $("<button class=\"button project-button\" id=\"editProject_" + projectItem.ProjectId + "\"><i class=\"fa fa-edit\"></i></button>");
                        projectEditButton.off("click").on("click", function () {
                            let itemId = this.id;
                            let projectId = itemId.split("_")[1];
                            LoadEditorForm(projectId, function () {
                                ShowEditorForm();
                            });
                        });

                        let projectThingsRow = $("<div class=\"project-thing-row project-thing-list-holder accordion-group-items\" id=\"thingsAssignedToProject_" + projectItem.ProjectId + "\" /> ");
                        let projectLocationRowHolder = $("<div class=\"project-thing-location-list-holder accordion-group-item\" />");

                        if (locationsList.length > 0) {
                            let projectLocationRowThings = $("<div class=\"project-thing-location-list-row-holder\" />");
                            let projectLocationRowHeader = $("<div class=\"project-thing-location-list-row-header accordion-group-item-header\" />");
                            projectLocationRowHeader.append("<div class=\"things-list-header-label-item\">Locations</div>");

                            projectLocationRowThings.append(projectLocationRowHeader);

                            for (let lc = 0; lc < locationsList.length; lc++) {
                                let locationItem = locationsList[lc];

                                let locationRow = $("<div class=\"project-location-row accordion-group-item-listings\" />");
                                let locationName = locationItem?.Name || "[Location Name NOT FOUND]";
                                locationRow.append(locationName);

                                projectLocationRowThings.append(locationRow);
                            }
                            projectLocationRowHolder.append(projectLocationRowThings);
                        }
                        else {
                            projectLocationRowHolder.append("No Locations Found.");
                        }

                        let projectGroupRowHolder = $("<div class=\"project-thing-group-list-holder accordion-group-item\" />");
                        if (groupsList.length > 0) {
                            let projectGroupRowThings = $("<div class=\"project-thing-group-list-row-holder\" />");
                            let projectGroupRowHeader = $("<div class=\"project-thing-groups-list-row-header accordion-group-item-header\" />");
                            projectGroupRowHeader.append("<div class=\"things-list-header-label-item\">Groups</div>");

                            projectGroupRowThings.append(projectGroupRowHeader);

                            for (let gc = 0; gc < groupsList.length; gc++) {
                                let groupItem = groupsList[gc];

                                let groupRow = $("<div class=\"project-group-row accordion-group-item-listings\" />");
                                groupRow.append(groupItem.GroupName);

                                projectGroupRowThings.append(groupRow);
                            }
                            projectGroupRowHolder.append(projectGroupRowThings);
                        }
                        else {
                            projectGroupRowHolder.append("No Groups Found.");
                        }

                        let projectTeamRowHolder = $("<div class=\"project-thing-team-list-holder accordion-group-item\" />");
                        if (teamsList.length > 0) {
                            let projectTeamRowThings = $("<div class=\"project-thing-teams-list-row-holder\" />");
                            let projectTeamRowHeader = $("<div class=\"project-thing-teams-list-row-header accordion-group-item-header\" />");
                            projectTeamRowHeader.append("<div class=\"things-list-header-label-item\">Teams</div>");

                            projectTeamRowThings.append(projectTeamRowHeader);

                            for (let tc = 0; tc < teamsList.length; tc++) {
                                let teamItem = teamsList[tc];

                                let teamRow = $("<div class=\"project-team-row accordion-group-item-listings\" />");
                                teamRow.append(teamItem.TeamName);

                                projectTeamRowThings.append(teamRow);
                            }
                            projectTeamRowHolder.append(projectTeamRowThings);
                        }
                        else {
                            projectTeamRowHolder.append("No Teams Found.");
                        }

                        projectThingsRow.append(projectLocationRowHolder);
                        projectThingsRow.append(projectGroupRowHolder);
                        projectThingsRow.append(projectTeamRowHolder);

                        projectButtonsHolder.append(projectEditButton);

                        projectRowHolder.append(projectExpanderHolder);
                        projectRowHolder.append(projectNameHolder);
                        projectRowHolder.append(projectStatusHolder);
                        projectRowHolder.append(projectLocationCountHolder);
                        projectRowHolder.append(projectGroupCountHolder);
                        projectRowHolder.append(projectTeamCountHolder);
                        //TODO: Determine how we get the users count for the project level.
                        //projectRowHolder.append(projectUserCountHolder);
                        projectRowHolder.append(projectButtonsHolder);

                        projectRowHolder.append(projectThingsRow);

                        projectListHolder.append(projectRowHolder);

                    }
                }
                else {
                    projectListHolder.append("No Projects found.");
                }

                $("#projectListHolder", element).append(projectListHolder);
                HideAllThingsInProject();

                if (callback != null) {
                    callback();
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
            function HideAll() {
                HideEditorForm();
                HideAllTabContainers();
            }
            function HideAllTabContainers() {
                HideLocationsTabContainer();
                HideGroupsTabContainer();
                HideTeamsTabContainer();
                HideUsersTabContainer();
                HideStatsTabContainer();
            }
            function MarkActiveEditorTab(tabId) {
                $("div[id^='projectManagerFormTab_']", element).each(function () {
                    $(this).removeClass("active");
                });
                $("#" + tabId, element).addClass("active");
            }
            function HideAllThingsInProject() {
                $(".project-thing-list-holder", element).each(function () {
                    $(this).hide();
                });
                $(".project-expander i", element).each(function () {
                    if (this.id == null || this.id != "collapseAll") {
                        $(this).removeClass("fa-minus");
                        $(this).addClass("fa-plus");
                    }
                });
            }
            function HideEditorForm() {
                $("#projectEditorFormPanel", element).hide();
            }
            function ShowEditorForm() {
                $("#projectEditorFormPanel", element).show();
                $(".tab-holder-item", $("#projectEditorFormPanel", element))[0].click();
            }
            function WriteProjectLoadingMessage(messageToWrite) {
                $("#projectLoadingMessage", element).empty();
                $("#projectLoadingMessage", element).append(messageToWrite);
                ShowProjectLoadingMessage();
            }
            function HideProjectLoadingMessage() {
                $("#projectLoadingHolder", element).hide();
            }
            function ShowProjectLoadingMessage() {
                $("#projectLoadingHolder", element).show();
            }
            function ToggleProjectList(projectId) {
                let isCurrentlyVisible = $("#thingsAssignedToProject_" + projectId, element).is(":visible");
                let expanderClass = "fa-minus";

                if (isCurrentlyVisible == true) {
                    HideThingsInProject(projectId);
                    expanderClass = "fa-plus";
                }
                else {
                    ShowThingsInProject(projectId);
                }
                $("i", $("#projectExpander_" + projectId)).removeClass("fa-plus");
                $("i", $("#projectExpander_" + projectId)).removeClass("fa-minus");
                $("i", $("#projectExpander_" + projectId)).addClass(expanderClass);
            }
            function HideThingsInProject(projectId) {
                $("#thingsAssignedToProject_" + projectId, element).hide();
            }
            function ShowThingsInProject(projectId) {
                $("#thingsAssignedToProject_" + projectId, element).show();
            }
            function HideGroupsTabContainer() {
                $("#projectManager_GroupsTabContainer", element).hide();
            }
            function ShowGroupsTabContainer() {
                HideAllTabContainers();
                $("#projectManager_GroupsTabContainer", element).show();
            }
            function HideLocationsTabContainer() {
                $("#projectManager_LocationsTabContainer", element).hide();
            }
            function ShowLocationsTabContainer() {
                HideAllTabContainers();
                $("#projectManager_LocationsTabContainer", element).show();
            }
            function HideTeamsTabContainer() {
                $("#projectManager_TeamsTabContainer", element).hide();
            }
            function ShowTeamsTabContainer() {
                HideAllTabContainers();
                $("#projectManager_TeamsTabContainer", element).show();
            }
            function HideUsersTabContainer() {
                $("#projectManager_UsersTabContainer", element).hide();
            }
            function ShowUsersTabContainer() {
                HideAllTabContainers();
                $("#projectManager_UsersTabContainer", element).show();
            }
            function HideStatsTabContainer() {
                $("#projectManager_StatsTabContainer", element).hide();
            }
            function ShowStatsTabContainer() {
                HideAllTabContainers();
                $("#projectManager_StatsTabContainer", element).show();
            }
            function HideBottomButtons() {
                $(".bottom-buttons", element).hide();
            }
            function ShowBottomButtons() {
                $(".bottom-buttons", element).show();
            }
            scope.load = function () {
                scope.Initialize();
                HandleProjectListLoad();
            };

            ko.postbox.subscribe("projectAdminReload", function (requireReload) {
                if (requireReload == true) {
                    possibleProjects.length = 0;
                }
                WriteProjectLoadingMessage("Reloading projects data...");
                window.setTimeout(function () {
                    HandleProjectListLoad();
                }, 500); scope.load();
            });
            ko.postbox.subscribe("projectAdminLoad", function () {
                scope.load();
            });
        }
    };
}]);