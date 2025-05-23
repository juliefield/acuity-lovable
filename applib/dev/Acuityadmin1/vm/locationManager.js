angularApp.directive("ngLocationManager", ['api', '$rootScope', function (api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/locationManager.htm?' + Date.now(),
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
            var possibleProjectList = [];
            var possibleLocations = [];
            var possibleProjects = [];
            var possibleGroups = [];
            var possibleTeams = [];
            var statusOptions = [];

            scope.Initialize = function () {
                HideAll();
                HandleBottomButtons();
                SetDatePickerFields();
                LoadStatusOptions();
                LoadGroupOptions();
                LoadTeamOptions();
                LoadProjectOptions();
                LoadLists("ALL");
            };

            function SetDatePickerFields() {
            }

            function LoadProjectOptions(callback) {
                if (possibleProjects == null || possibleProjects.length == 0) {
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
                            let projectList = $.parseJSON(data.projectList);
                            possibleProjects.length == 0;
                            possibleProjects = projectList;
                            if (callback != null) {
                                callback(projectList);
                            }
                        }
                    });
                }
                else {
                    if (callback != null) {
                        callback(possibleProjects);
                    }
                }
            }
            function LoadGroupOptions(callback) {
                if (possibleGroups == null || possibleGroups.length == 0) {
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
                            let groupList = $.parseJSON(data.groupList);
                            possibleGroups.length = 0;
                            possibleGroups = groupList;
                            if (callback != null) {
                                callback(groupList);
                            }
                        }
                    });
                }
                else {
                    if (callback != null) {
                        callback(possibleGroups);
                    }
                }

            }
            function LoadTeamOptions(callback) {
                if (possibleTeams == null || possibleTeams.length == 0) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "getTeamList"
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
                else {
                    if (callback != null) {
                        callback(possibleTeams);
                    }
                }

            }
            function LoadStatusOptions() {
                statusOptions.length = 0;
                statusOptions.push({ StatusId: 1, StatusCode: "A", StatusDesc: "Active" });
                statusOptions.push({ StatusId: 2, StatusCode: "I", StatusDesc: "Inactive" });
            }
            function LoadLists(listToLoad) {
                listToLoad = listToLoad.toLowerCase();

                let loadAll = (listToLoad == "all");

                if (listToLoad == "status" || loadAll == true) {
                    $("#locationManager_Status", element).empty();
                    $("#locationManager_Status", element).append($('<option />', { value: "", text: "" }));
                    $("#locationManager_StatusFilter", element).empty();
                    $("#locationManager_StatusFilter", element).append($('<option />', { value: "", text: "All" }));

                    for (let i = 0; i < statusOptions.length; i++) {
                        let item = statusOptions[i];
                        $("#locationManager_Status", element).append($('<option />', { value: item.StatusCode, text: item.StatusDesc }));
                        $("#locationManager_StatusFilter", element).append($('<option />', { value: item.StatusCode, text: item.StatusDesc }));
                    }
                }
            }
            function HandleLocationListLoad(forceReload, callback) {
                LoadLocationList(forceReload, function (listData) {
                    let listToRender = listData;
                    listToRender = FilterLocationList(listToRender);
                    listToRender = SortLocationList(listToRender);
                    RenderLocations(listToRender, function () {
                        if (callback != null) {
                            callback();
                        }
                    })
                });
            }
            function LoadLocationList(forceReload, callback) {
                if (forceReload == null) {
                    forceReload = false;
                }
                if (possibleLocations != null && possibleLocations.length > 0 && forceReload == false) {
                    if (callback != null) {
                        callback(possibleLocations);
                    }
                }
                else {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "selfserve",
                            cmd: "getLocationList"
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            var objectList = $.parseJSON(data.locationList);
                            possibleLocations.length = 0;
                            possibleLocations = objectList;
                            if (callback != null) {
                                callback(objectList);
                            }
                        }
                    });
                }
            }
            function FilterLocationList(listToFilter) {
                let filteredList = listToFilter;

                let locationNameFilter = $("#locationManager_LocationNameFilter", element).val() || "";
                let locationCityFilter = $("#locationManager_CityFilter", element).val() || "";
                let locationStatusFilter = $("#locationManager_StatusFilter", element).val() || "";

                if (locationNameFilter != "") {
                    filteredList = filteredList.filter(l => l.Name.toLowerCase().includes(locationNameFilter.toLowerCase()));
                }
                if (locationCityFilter != "") {
                    filteredList = filteredList.filter(l => l.City.toLowerCase().includes(locationCityFilter.toLowerCase()));
                }
                if (locationStatusFilter != "") {
                    filteredList = filteredList.filter(l => l.Status == locationStatusFilter);
                }

                return filteredList;
            }
            function SortLocationList(listToSort, fieldToSort) {
                let sortedLocationList = listToSort;
                if (listToSort == null) {
                    sortedLocationList = possibleLocations;
                }
                if (sortedLocationList != null) {
                    switch (fieldToSort?.toLowerCase()) {
                        default:
                            sortedLocationList = sortedLocationList.sort((a, b) => {
                                if (a.Name.toLowerCase() < b.Name.toLowerCase()) {
                                    return -1;
                                }
                                if (a.Name.toLowerCase() > b.Name.toLowerCase()) {
                                    return 1;
                                }
                                if (a.Name.toLowerCase() == b.Name.toLowerCase()) {
                                    return 0;
                                }
                            });
                            break;
                    }
                }

                return sortedLocationList;
            }
            function RenderLocations(listToRender, callback) {
                if (listToRender == null) {
                    listToRender = possibleLocations;
                }
                $("#locationListHolder", element).empty();
                let locationListHolder = $("<div class=\"location-list\" />");

                if (listToRender != null && listToRender.length > 0) {
                    for (let lc = 0; lc < listToRender.length; lc++) {
                        let locationItem = listToRender[lc];
                        let projectList = [];
                        let groupsList = possibleGroups.filter(g => g.LocationId == locationItem.LocationId);
                        let teamsList = [];

                        for(let i = 0; i < groupsList.length;i++)
                        {
                            let groupItem = groupsList[i];

                            let groupTeams = possibleTeams.filter(t => t.GroupId == groupItem.GroupId);
                            for(let tc = 0; tc < groupTeams.length; tc++)
                            {
                                let teamItem = groupTeams[tc];
                                let tIndex = teamsList.findIndex(t => t.TeamId == teamItem.TeamId);                                
                                let pIndex = projectList.findIndex(p => p.ProjectId == teamItem.ProjectId);

                                if(tIndex < 0)
                                {
                                    teamsList.push(teamItem);
                                }
                                if(pIndex < 0)
                                {
                                    let projectItem = possibleProjects.find(p => p.ProjectId == teamItem.ProjectId);
                                    projectList.push(projectItem);
                                }

                            }
                        }
                        

                        let locationRow = $("<div class=\"location-list-row\" id=\"locationRow_" + locationItem.LocationId + "\" />");
                        let locationExpanderHolder = $("<div class=\"location-list-item location-expander\" id=\"locationExpander_" + locationItem.LocationId + "\" />");
                        locationExpanderHolder.append("<i class=\"fa fa-plus\"></i>");
                        locationExpanderHolder.on("click", function(){
                            let itemId = this.id;
                            let locationId = itemId.split("_")[1];
                            ToggleLocationList(locationId);
                        });

                        let locationNameHolder = $("<div class=\"location-list-item location-name\" id=\"locationName_" + locationItem.LocationId + "\" />");
                        locationNameHolder.append(locationItem.Name);
                        locationNameHolder.on("click", function(){
                            let itemId = this.id;
                            let locationId = itemId.split("_")[1];
                            ToggleLocationList(locationId);
                        });

                        let locationCityHolder = $("<div class=\"location-list-item location-city\" />");
                        locationCityHolder.append(locationItem.City);

                        let locationStateHolder = $("<div class=\"location-list-item location-state\" />");
                        locationStateHolder.append(locationItem.State);

                        let locationStatusHolder = $("<div class=\"location-list-item location-status\" />");
                        let locationStatus = locationItem.Status;
                        let statusObject = statusOptions.find(l => l.StatusCode == locationItem.Status);
                        if (statusObject != null) {
                            locationStatus = statusObject.StatusDesc;
                        }
                        locationStatusHolder.append(locationStatus);
                        let locationGroupCountHolder = $("<div class=\"location-list-item location-group-count\" />");
                        
                        let groupCount = groupsList.length || 0;
                        locationGroupCountHolder.append(groupCount);
                        let locationTeamCountHolder = $("<div class=\"location-list-item location-team-count\" />");
                        let teamCount = teamsList.length || 0;
                        locationTeamCountHolder.append(teamCount);
                        let locationButtonsHolder = $("<div class=\"location-list-item location-buttons\" />");

                        let locationEditButton = $("<button class=\"button location-button\" id=\"editLocation_" + locationItem.LocationId + "\"><i class=\"fa fa-edit\"></i></button>");
                        locationEditButton.off("click").on("click", function () {
                            let itemId = this.id;
                            let locationId = itemId.split("_")[1];
                            LoadEditorForm(locationId, function () {
                                ShowEditorForm();
                            });
                        });

                        let locationThingsRow = $("<div class=\"location-thing-row location-thing-list-holder\" id=\"thingsAssignedToLocation_" + locationItem.LocationId + "\" />");
                        
                        let projectsForLocationHolder = $("<div class=\"location-thing-item-project-holder\" />");                        

                        if(projectList.length > 0)
                        {
                            let locationProjectRowThings = $("<div class=\"location-thing-project-list-row-holder accordion-group-item\" />");
                            let locationProjectRowHeader = $("<div class=\"location-thing-project-list-row-header accordion-group-item-header\" />");
                            locationProjectRowHeader.append("<div class=\"things-list-header-label-item\">Projects</div>");

                            locationProjectRowThings.append(locationProjectRowHeader);

                            for(let pc = 0; pc < projectList.length; pc++)
                            {
                                let projectItem = projectList[pc];
                                let projectRow = $("<div class=\"location-project-row\" />");
    
                                projectRow.append(projectItem.Name);
                                    
                                locationProjectRowThings.append(projectRow);
                            }
                            projectsForLocationHolder.append(locationProjectRowThings);
                        }
                        else
                        {   
                            projectsForLocationHolder = $("<div class=\"location-thing-group-list-row-holder accordion-group-item\" />");
                            projectsForLocationHolder.append("No Projects Found.");
                        }

                        let groupsForLocationHolder = $("<div class=\"location-thing-item-group-holder\" />");
                        if(groupsList.length > 0)
                        {
                            let locationGroupRowThings = $("<div class=\"location-thing-group-list-row-holder accordion-group-item\" />");
                            let locationGroupRowHeader = $("<div class=\"location-thing-group-list-row-header accordion-group-item-header\" />");
                            locationGroupRowHeader.append("<div class=\"things-list-header-label-item\">Groups</div>");

                            locationGroupRowThings.append(locationGroupRowHeader);

                            for(let gc = 0; gc < groupsList.length; gc++)
                            {
                                let groupItem = groupsList[gc];
                                let groupRow = $("<div class=\"location-group-row\" />");
    
                                groupRow.append(groupItem.GroupName);
                                locationGroupRowThings.append(groupRow);                                
                            }
                            groupsForLocationHolder.append(locationGroupRowThings);
                        }
                        else 
                        {   
                            groupsForLocationHolder = $("<div class=\"location-thing-group-list-row-holder accordion-group-item\" />");
                            groupsForLocationHolder.append("No Groups Found.");
                        }
                        
                        let teamsForLocationHolder = $("<div class=\"location-thing-item-team-holder\" />");
                        if(teamsList.length > 0)
                        {
                            let locationTeamRowThings = $("<div class=\"location-thing-team-list-row-holder accordion-group-item\" />");
                            let locationTeamRowHeader = $("<div class=\"location-thing-team-list-row-header accordion-group-item-header\" />");
                            locationTeamRowHeader.append("<div class=\"things-list-header-label-item\">Teams</div>");

                            locationTeamRowThings.append(locationTeamRowHeader);

                            for(let tc = 0; tc < teamsList.length; tc++)
                            {
                                let teamItem = teamsList[tc];
                                let teamRow = $("<div class=\"location-team-row\" />");
    
                                teamRow.append(teamItem.TeamName);
    
                                locationTeamRowThings.append(teamRow);
                            }
                            teamsForLocationHolder.append(locationTeamRowThings);
    
                        }
                        else
                        {   
                            teamsForLocationHolder = $("<div class=\"location-thing-group-list-row-holder accordion-group-item\" />");
                            teamsForLocationHolder.append("No Teams Found.");
                        }

                        locationThingsRow.append(projectsForLocationHolder);
                        locationThingsRow.append(groupsForLocationHolder);
                        locationThingsRow.append(teamsForLocationHolder);

                        locationButtonsHolder.append(locationEditButton);

                        locationRow.append(locationExpanderHolder);
                        locationRow.append(locationNameHolder);
                        locationRow.append(locationCityHolder);
                        locationRow.append(locationStateHolder);
                        locationRow.append(locationStatusHolder);
                        locationRow.append(locationGroupCountHolder);
                        locationRow.append(locationTeamCountHolder);
                        locationRow.append(locationButtonsHolder);

                        locationRow.append(locationThingsRow);

                        locationListHolder.append(locationRow);
                    }
                }
                else {
                    locationListHolder.append("No Locations found.");
                }

                $("#locationListHolder", element).append(locationListHolder);
                HideAllThingsInLocation();

                if (callback != null) {
                    callback();
                }
            }
            function LoadPossibleGroupsInEditor(groupsList) {
                // let groupListHolder = $("<div />");
                // if (scope.CurrentGroupList != null && scope.CurrentGroupList.length > 0) {
                //     $(".location-data-assigned-groups", element).empty();
                //     let locationId = $(".editor-form-location-id", element).val();
                //     for (var t = 0; t < scope.CurrentGroupList.length; t++) {
                //         let isGroupAssigned = false;
                //         let item = scope.CurrentGroupList[t];
                //         let groupIndex = -1;

                //         if (groupsList != null && item != null) {
                //             groupIndex = groupsList.findIndex(i => i.GroupId == item.GroupId);
                //             isGroupAssigned = (groupIndex >= 0);
                //         }
                //         let groupHolderRow = $("<div class=\"data-assigned-item\" />");
                //         let groupName = $("<div />");
                //         if (isGroupAssigned == true) {
                //             groupName.append("<span class=\"green-check\"><i class=\"fas fa-check-circle\"></i>&nbsp;&nbsp;</span>");
                //         }
                //         groupName.append(item.GroupName);

                //         groupHolderRow.append(groupName);

                //         groupListHolder.append(groupHolderRow);
                //     }
                // }
                // else {
                //     groupListHolder.append("No Groups found.");
                // }

                // $(".location-data-assigned-groups", element).append(groupListHolder);

            }
            function LoadPossibleTeamsInEditor(teamsList) {
                // let teamListHolder = $("<div />");
                // if (scope.CurrentTeamList != null && scope.CurrentTeamList.length > 0) {
                //     $(".location-data-assigned-teams", element).empty();
                //     let locationId = $(".editor-form-location-id", element).val();
                //     for (var t = 0; t < scope.CurrentTeamList.length; t++) {
                //         let isTeamAssigned = false;
                //         let item = scope.CurrentTeamList[t];
                //         let teamIndex = -1;

                //         if (teamsList != null && item != null) {
                //             teamIndex = teamsList.findIndex(i => i.TeamId == item.TeamId);
                //             isTeamAssigned = (teamIndex >= 0);
                //         }
                //         let teamHolderRow = $("<div class=\"data-assigned-item\" />");
                //         let teamName = $("<div />");
                //         if (isTeamAssigned == true) {
                //             teamName.append("<span class=\"green-check\"><i class=\"fas fa-check-circle\"></i>&nbsp;&nbsp;</span>");
                //         }
                //         teamName.append(item.TeamName);

                //         teamHolderRow.append(teamName);

                //         teamListHolder.append(teamHolderRow);
                //     }
                // }
                // else {
                //     teamListHolder.append("No Teams found.");
                // }

                // $(".location-data-assigned-teams", element).append(teamListHolder);

            }
            function LoadPossibleUsersInEditor(usersList) {
                // $(".location-data-assigned-users", element).empty();
                // let userDataHolder = $("<div />");
                // if (usersList != null && usersList.length > 0) {
                //     for (var u = 0; u < usersList.length; u++) {
                //         let item = usersList[u];

                //         let userRow = $("<div class=\"data-assigned-item\" />");
                //         let userName = $("<div />");
                //         userName.append("<span class=\"green-check\"><i class=\"fas fa-check-circle\"></i>&nbsp;&nbsp;</span>");
                //         userName.append(item.UserFullName);

                //         userRow.append(userName);

                //         userDataHolder.append(userRow);
                //     }
                // }
                // else {
                //     userDataHolder.append("No Users found.");
                // }
                // $(".location-data-assigned-users", element).append(userDataHolder);
            }
            function LoadPossibleProjectsInEditor(projectsList) {
                // let projectListHolder = $("<div />");
                // if (scope.CurrentProjectList != null && scope.CurrentProjectList.length > 0) {
                //     $(".location-data-assigned-projects", element).empty();
                //     let locationId = $(".editor-form-location-id", element).val();
                //     for (var t = 0; t < scope.CurrentProjectList.length; t++) {
                //         let isProjectAssigned = false;
                //         let item = scope.CurrentProjectList[t];
                //         let projectIndex = -1;

                //         if (projectsList != null && item != null) {
                //             projectIndex = projectsList.findIndex(i => i.ProjectId = item.ProjectId);
                //             isProjectAssigned = (projectIndex >= 0);
                //         }
                //         let projectHolderRow = $("<div class=\"data-assigned-item\" />");
                //         let projectName = $("<div />");
                //         if (isProjectAssigned == true) {
                //             projectName.append("<span class=\"green-check\"><i class=\"fas fa-check-circle\"></i>&nbsp;&nbsp;</span>");
                //         }
                //         projectName.append(item.Name);

                //         projectHolderRow.append(projectName);

                //         projectListHolder.append(projectHolderRow);
                //     }
                // }
                // else {
                //     projectListHolder.append("No Projects found.");
                // }

                // $(".location-data-assigned-projects", element).append(projectListHolder);
            }
            function LoadEditorForm(locationId, callback) {
                let location = possibleLocations.find(l => l.LocationId == locationId);
                // let assignedGroups = null;
                // let assignedTeams = null;
                // let assignedUsers = null;
                // let assignedProjects = null;

                if (location != null) {
                    $("#editorFormType", element).val("edit");
                    $("#locationEditor_LocationId", element).val(location.LocationId);
                    $("#locationManager_LocationName", element).val(location.Name);
                    $("#locationManager_LocationCity", element).val(location.City);
                    $("#locationManager_LocationState", element).val(location.State);
                    $("#locationManager_Status", element).val(location.Status);
                }
                BuildProjectsForLocationInEditorForm(location, locationId);
                BuildGroupsForLocationInEditorForm(location, locationId);
                BuildTeamsForLocationInEditorForm(location, locationId);
                ko.postbox.publish("itemStatsTabLoad", {section: "location", id: locationId});

                if (callback != null) {
                    callback();
                }
            }
            function BuildProjectsForLocationInEditorForm(locationObject, locationId)
            {
                if(locationObject == null)
                {
                    locationObject = possibleLocations.find(l => l.LocationId == locationId);
                }
                let locationManagerProjectList = $("<div />");
                $("#locationManager_ProjectsTabContainer", element).empty();
                //get the groups for the location, and use them for the projects to pull
                let groupList = possibleGroups.filter(g => g.LocationId == locationObject?.LocationId || g.LocationId == locationId);                
                let projectLocationList = [];
                if(groupList != null)
                {
                    for(let g = 0; g < groupList.length; g++)
                    {
                        let groupItem = groupList[g];
                        let projectIndex = projectLocationList.findIndex(p => p.ProjectId == groupItem.ProjectId);
                        if(projectIndex < 0)
                        {
                            let project = possibleProjects.find(p => p.ProjectId == groupItem.ProjectId);
                            if(project != null)
                            {
                                projectLocationList.push(project);
                            }
                        }
                    }
                }
                if(projectLocationList != null && projectLocationList.length > 0)
                {
                    for(let pc = 0; pc < projectLocationList.length; pc++)
                    {
                        let projectItem = projectLocationList[pc];

                        let assignedProjectRow = $("<div class=\"project-assigned-row\" />");
                        let assignedProjectNameHolder = $("<div class=\"\" />");

                        assignedProjectNameHolder.append(projectItem.ProjectDesc);

                        assignedProjectRow.append(assignedProjectNameHolder);

                        locationManagerProjectList.append(assignedProjectRow);

                    }
                }
                else
                {
                    locationManagerProjectList.append("No Projects found for location.");
                }
                $("#locationManager_ProjectsTabContainer", element).append(locationManagerProjectList);

            }
            function BuildGroupsForLocationInEditorForm(locationObject, locationId)
            {
                if(locationObject == null)
                {
                    locationObject = possibleLocations.find(l => l.LocationId == locationId);                    
                }
                let locationManagerGroupList = $("<div />");
                $("#locationManager_GroupsTabContainer", element).empty();
                let groupLocationList = [];
                groupLocationList = possibleGroups.filter(g => g.LocationId == locationObject?.LocationId || g.LocationId == locationId);
                if(groupLocationList != null && groupLocationList.length > 0)
                {
                    for(let gc = 0; gc < groupLocationList.length; gc++)
                    {
                        let groupItem = groupLocationList[gc];
                        let assignedGroupItem = $("<div class=\"group-assigned-row\" />");
                        let assignedGroupNameHolder = $("<div class=\"\" />");
                        assignedGroupNameHolder.append(groupItem.Name);

                        assignedGroupItem.append(assignedGroupNameHolder);

                        locationManagerGroupList.append(assignedGroupItem);
                    }
                }
                else
                {
                    locationManagerGroupList.append("No Groups found for location.");
                }


                $("#locationManager_GroupsTabContainer", element).append(locationManagerGroupList);
            }
            function BuildTeamsForLocationInEditorForm(locationObject, locationId)
            {
                if(locationObject == null)
                {
                    locationObject = possibleLocations.find(l => l.LocationId == locationId);
                }
                let teamManagerProjectList = $("<div />");
                $("#locationManager_TeamsTabContainer", element).empty();                
                let groupList = possibleGroups.filter(g => g.LocationId == locationObject?.LocationId || g.LocationId == locationId);                
                let locationTeamList = [];
                if(groupList != null)
                {
                    for(let g = 0; g < groupList.length; g++)
                    {
                        let groupItem = groupList[g];
                        let teamsList = possibleTeams.filter(t => t.GroupId == groupItem.GroupId);
                        for(let tc = 0; tc < teamsList.length;tc++)
                        {
                            let teamItem = teamsList[tc];
                            let teamIndex = locationTeamList.findIndex(t => t.TeamId == teamItem.TeamId);
                            if(teamIndex < 0)
                            {
                               locationTeamList.push(teamItem);
                            }
                        }
                    }
                }
                if(locationTeamList != null && locationTeamList.length > 0)
                {
                    for(let pc = 0; pc < locationTeamList.length; pc++)
                    {
                        let teamItem = locationTeamList[pc];

                        let assignedTeamRow = $("<div class=\"team-assigned-row\" />");
                        let assignedTeamNameHolder = $("<div class=\"\" />");

                        let teamName = teamItem.TeamName;
                        if(teamItem.GroupIdSource != null)
                        {
                            teamName += " <span class=\"group-name-with-team-name\">(" + teamItem.GroupIdSource.GroupName + ")</span>"
                        }
                        else if(teamItem.GroupId != null && teamItem.GroupId != "")
                        {
                            let group = possibleGroups.find(g => g.GroupId == teamItem.GroupId);
                            if(group != null)
                            {
                                teamName += " <span class=\"group-name-with-team-name\">(" + group.GroupName + ")<span>"
                            }
                        }
                        assignedTeamNameHolder.append(teamName);


                        assignedTeamRow.append(assignedTeamNameHolder);

                        teamManagerProjectList.append(assignedTeamRow);

                    }
                }
                else
                {
                    teamManagerProjectList.append("No Projects found for location.");
                }
                $("#locationManager_TeamsTabContainer", element).append(teamManagerProjectList);
            }
            function ValidateLocationForm(callback) {
                var formValid = true;
                var errorMessages = [];
                var locationName = $("#locationManager_LocationName", element).val();


                if (locationName == null || locationName == "") {
                    errorMessages.push({ message: "Location Name Required", fieldclass: "", fieldid: "locationManager_LocationName" });
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

            function SaveLocationForm(callback) {
                let locationObject = CollectEditorDataForLocation();
                SaveLocation(locationObject, function () {
                    HandleLocationListLoad(function () {
                        HideEditorForm();
                        if(callback != null)
                        {
                            callback();
                        }
                    });
                });
            }
            function CollectEditorDataForLocation() {
                var returnObject = new Object();
                
                returnObject.LocationId = $("#locationEditor_LocationId", element).val();
                returnObject.OrganizationId = 1;
                returnObject.Name = $("#locationManager_LocationName", element).val();
                returnObject.City = $("#locationManager_LocationCity", element).val();
                returnObject.State = $("#locationManager_LocationState", element).val();
                returnObject.Status = $("#locationManager_Status", element).val();
                returnObject.CreatedBy = legacyContainer.scope.TP1Username;
                returnObject.CreatedOn = new Date().toLocaleDateString();
                returnObject.UpdatedBy = legacyContainer.scope.TP1Username;
                returnObject.UpdatedOn = new Date().toLocaleDateString();

                return returnObject;
            }
            function SaveLocation(locationObject, callback) {
                let formType = $("#editorFormType", element).val() || "add";
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "selfserv",
                        cmd: "saveLocation",
                        locationitem: JSON.stringify(locationObject),
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
            function ClearEditorForm(callback) {
                $("#editorFormType", element).val("add");
                $("#locationEditor_LocationId", element).val(0);
                $("#locationManager_LocationName", element).val("");
                $("#locationManager_LocationCity", element).val("");
                $("#locationManager_LocationState", element).val("");
                $("#locationManager_Status", element).val("");

                if (callback != null) {
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
            function HideAllTabContainers()
            {
                HideProjectsTabContainer();
                HideGroupsTabContainer();
                HideTeamsTabContainer();
                HideStatsTabContainer();
            }
            function MarkActiveEditorTab(tabId)
            {
                $("div[id^='locationManagerFormTab_']", element).each(function () {
                    $(this).removeClass("active");
                });
                $("#" + tabId, element).addClass("active");
            }
            function ToggleLocationList(locationId)
            {
                let isCurrentlyVisible = $("#thingsAssignedToLocation_" + locationId, element).is(":visible");
                let expanderClass = "fa-minus";
                if(isCurrentlyVisible == true)
                {
                    HideThingsInLocation(locationId);
                    expanderClass = "fa-plus";
                }
                else
                {
                    ShowThingsInLocation(locationId);
                }

                $("i", $("#locationExpander_" + locationId)).removeClass("fa-plus");
                $("i", $("#locationExpander_" + locationId)).removeClass("fa-minus");
                $("i", $("#locationExpander_" + locationId)).addClass(expanderClass);
                
            }
            function HideAllThingsInLocation()
            {
                $(".location-thing-list-holder", element).each(function () {
                    $(this).hide();
                });
                $(".location-expander i", element).each(function () {
                    if (this.id == null || this.id != "collapseAll") {
                        $(this).removeClass("fa-minus");
                        $(this).addClass("fa-plus");
                    }
                });
            }
            function HideThingsInLocation(locationId)
            {
                $("#thingsAssignedToLocation_" + locationId, element).hide();
            }
            function ShowThingsInLocation(locationId)
            {
                $("#thingsAssignedToLocation_" + locationId, element).show();
            }
            function HideProjectsTabContainer()
            {
                $("#locationManager_ProjectsTabContainer", element).hide();
            }
            function ShowProjectsTabContainer()
            {
                HideAllTabContainers();
                $("#locationManager_ProjectsTabContainer", element).show();
            }
            function HideGroupsTabContainer()
            {
                $("#locationManager_GroupsTabContainer", element).hide();
            }
            function ShowGroupsTabContainer()
            {
                HideAllTabContainers();
                $("#locationManager_GroupsTabContainer", element).show();
            }
            function HideTeamsTabContainer()
            {
                $("#locationManager_TeamsTabContainer", element).hide();
            }
            function ShowTeamsTabContainer()
            {
                HideAllTabContainers();
                $("#locationManager_TeamsTabContainer", element).show();
            }
            function HideStatsTabContainer()
            {
                $("#locationManager_StatsTabContainer", element).hide();
            }
            function ShowStatsTabContainer()
            {
                HideAllTabContainers();
                $("#locationManager_StatsTabContainer", element).show();
            }
            function HideEditorForm() {
                $("#locationEditorPanel", element).hide();
            }
            function ShowEditorForm() {
                $("#locationEditorPanel", element).show();
                $(".tab-holder-item", $("#locationEditorPanel", element))[0].click();
            }
            function HideBottomButtons() {
                $(".bottom-buttons", element).hide();
            }
            function ShowBottomButtons() {
                $(".bottom-buttons", element).show();
            }
            scope.load = function () {
                scope.Initialize();
                HandleLocationListLoad();

                $("#btnAddNewLocation", element).off("click").on("click", function () {
                    ClearEditorForm(function () {
                        LoadEditorForm(null, function () {
                            ShowEditorForm();
                        });
                    });
                });

                $("#btnSave", element).off("click").on("click", function () {
                        ValidateLocationForm(function () {
                            SaveLocationForm(function(){
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
                $("#locationManagerFormTab_Projects", element).off("click").on("click", function () {
                    ShowProjectsTabContainer();
                    MarkActiveEditorTab(this.id);
                });
                $("#locationManagerFormTab_Groups", element).off("click").on("click", function () {
                    ShowGroupsTabContainer()
                    MarkActiveEditorTab(this.id);
                });
                $("#locationManagerFormTab_Teams", element).off("click").on("click", function () {
                    ShowTeamsTabContainer();
                    MarkActiveEditorTab(this.id);
                });
                $("#locationManagerFormTab_Stats", element).off("click").on("click", function () {
                    ShowStatsTabContainer();
                    MarkActiveEditorTab(this.id);
                });
            };
            ko.postbox.subscribe("locationAdminLoad", function () {
                scope.load();
            });
        }
    };
}]);