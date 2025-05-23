angularApp.directive("ngAgameFlexIntraTeamManager", ['api', '$rootScope', function(api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/AGAMEFLEX1/view/agameflexintrateammanager.htm?' + Date.now(),
        scope: {
            assoc: "@",
            text: "@",
            details: "@",
            cid: "@",
            filters: "@",
            panel: "@",
            hidetopper: "@",
            toppertext: "@",
            includeheader: "@"
        },
        require: '^ngLegacyContainer',
        link: function(scope, element, attrs, legacyContainer) {
            
            // if (scope.includeheader == "true") {
            //     $(".flex-game-widget-header-holder", element).show();
            // }
            // else
            // {
            //     $(".flex-game-widget-header-holder", element).hide();
            // }

            scope.Initialize = function(callback) {  
                scope.CurrentTeamList = [];
                scope.CurrentIntraTeamList = [];
                scope.AvailableUsersForBaseTeam = [];
                HideAll();
                //SetDatePickers();
                GetAllListOptions();
                LoadListOptions("all");
                if(callback != null)
                {
                    callback();
                }
            };
            function HideAll()
            {
                HideUserStatus();
                HideEditorForm();
            }
            function SetDatePickers()
            {
                //$(".user-goal-manager-editor-complete-by-date", element).datepicker();
            }
            function GetAllListOptions()
            {
                LoadTeamOptions();
            }

            function LoadTeamOptions()
            {
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
                    success: function(data){
                        scope.CurrentTeamList.length = 0;
                        var teamOptions = JSON.parse(data.teamList);                        
                        if(teamOptions != null)
                        {
                            for(var i = 0 ; i < teamOptions.length; i++)
                            {
                                scope.CurrentTeamList.push(teamOptions[i]);
                            }
                        }
                    }
                });
            }

            function LoadListOptions(loadtypes)
            {
                var loadAll = (loadtypes === "all");

                loadtypes = loadtypes.toLowerCase();

                if(loadtypes == "teams" || loadAll)
                {
                    if ($(".flex-intra-team-manager-editor-base-team", element) != null) {
                        $(".flex-intra-team-manager-editor-base-team", element).empty();
                        $(".flex-intra-team-manager-editor-base-team", element).append($('<option />', { value: "", text: "Select a Team" }));
                        for (var i = 0; i < scope.CurrentTeamList.length; i++) {
                            let item = scope.CurrentTeamList[i];
                            let teamName = item.Name;
                            if(item.ProjectIdSource != null && item.ProjectIdSource.Name != "")
                            {
                                teamName = item.Name + " (" + item.ProjectIdSource.Name + ")"
                            }
                            $(".flex-intra-team-manager-editor-base-team", element).append($('<option />', { value: item.TeamId , text: teamName }));
                        }
                    }
                    if($(".flex-intra-team-manager-filter-base-team", element) != null)
                    {
                        $(".flex-intra-team-manager-filter-base-team", element).empty();
                        $(".flex-intra-team-manager-filter-base-team", element).append($('<option />', { value: "", text: "" }));
                        for (var i = 0; i < scope.CurrentTeamList.length; i++) {
                            let item = scope.CurrentTeamList[i];                            
                            let teamName = item.Name;
                            if(item.ProjectIdSource != null && item.ProjectIdSource.Name != "")
                            {
                                teamName = item.Name + " (" + item.ProjectIdSource.Name + ")"
                            }
                            $(".flex-intra-team-manager-filter-base-team", element).append($('<option />', { value: item.TeamId , text: teamName }));
                        }
                    }
                }
            }            
            function HideEditorForm()
            {
                ClearEditorForm();
                $(".flex-intra-team-manager-editor-holder", element).hide();                
            }

            function HandleBaseTeamChange()
            {
                let currentIntraTeamId = parseInt($("#intraTeamId", element).val());                
                if(Number.isNaN(currentIntraTeamId) || currentIntraTeamId == 0)
                {
                    return;
                }
                let currentIntraTeam = scope.CurrentIntraTeamList.find(t => t.IntraTeamId == currentIntraTeamId);
                if(currentIntraTeam == null)
                {
                    return;
                }
                let baseTeamId = parseInt($(".flex-intra-team-manager-editor-base-team", element).val());
                
                LoadCurrentUserOptions(currentIntraTeam);
                LoadAvailableUsersOptions(baseTeamId);
            }
            
            function LoadCurrentUserOptions(teamObject)
            {
                $(".flex-intra-team-manager-editor-agent-list-current-members", element).empty();
                let currentUsersHolder = $("<div />");
                if( teamObject == null || 
                    (teamObject != null && teamObject.TeamId == 0) || 
                    (teamObject != null && (teamObject.AssignedUsers == null || teamObject.AssignedUsers.length == 0))
                ){
                    currentUsersHolder.append("<p>No users found for current intra-team.</p>");
                }
                else
                {
                    let currentUsersAssigned = teamObject.AssignedUsers;
                    if(currentUsersAssigned != null)
                    {
                        for(var i=0;i<currentUsersAssigned.length; i++)
                        {   
                            let userItem = currentUsersAssigned[i];
                            let currentUserRow = $("<div class=\"flex-intra-team-manager-current-user_row\" />");
                            let currentUserName = $("<label class=\"flex-intra-team-manager-current-user-name\" />").append(userItem.UserFullName);
                            let currentUserButtons = $("<div class=\"flex-intra-team-manager-current-user-button-holder inline_button-holder\" />");

                            let currentUserRemoveButton = $("<button class=\"flex-intra-team-manager-current-user-remove-button\" id=\"removeUser_" + userItem.UserId + "_" + teamObject.IntraTeamId + "\"><i class=\"fa fa-remove\"></i></button>");

                            $(currentUserRemoveButton, element).off("click").on("click", function(){
                                let buttonId = this.id;
                                let userId = buttonId.split('_')[1];
                                let intraTeamId = buttonId.split('_')[2];
                                ConfirmRemoveUserFromIntraTeam(userItem.UserFullName, userId, intraTeamId, function(userId, intraTeamId){                                    
                                    RemoveUserFromIntraTeam(userId, intraTeamId);
                                })
                                
                            });
                            currentUserButtons.append(currentUserRemoveButton);

                            currentUserRow.append(currentUserName);
                            currentUserRow.append(currentUserButtons);

                            currentUsersHolder.append(currentUserRow);
                        }
                    }
                }

                $(".flex-intra-team-manager-editor-agent-list-current-members", element).append(currentUsersHolder);

            }

            function ConfirmRemoveUserFromIntraTeam(userFullName, userId, intraTeamId, callback)
            {
                if(confirm("Remove " + userFullName + " from the team?"))
                {
                    callback(userId, intraTeamId);
                }
            }
            function RemoveUserFromIntraTeam(userId, intraTeamId, callback)
            {   
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "removeUserFromIntraTeam",
                        userid: userId,
                        intrateamid: intraTeamId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){
                        HandleIntraTeamLoad();
                        LoadEditorForm(intraTeamId, function(){
                            if(callback != null)
                            {
                                callback();
                            }
                        });
                    }
                });
            }

            function LoadAvailableUsersOptions(baseTeamId)
            {
                $(".flex-intra-team-manager-editor-agent-list-available", element).empty();
                let availableUserHolder = $("<div class=\"flex-intra-team-manager-available-user-holder\" />");
                let baseTeam = scope.CurrentTeamList.find(t => t.TeamId == baseTeamId);
                if(baseTeam != null && baseTeam.AssignedUsers != null && baseTeam.AssignedUsers.length > 0)
                {
                    let teamId = parseInt($("#intraTeamId", element).val());
                    let currentUsersList = [];
                    let currentIntraTeam = scope.CurrentIntraTeamList.find(t => t.IntraTeamId == teamId);
                    if(currentIntraTeam != null)
                    {
                        currentUsersList = currentIntraTeam.AssignedUsers;
                    }

                    let ActualAvaiable = 0;
                    for(var i = 0; i < baseTeam.AssignedUsers.length; i++)
                    {
                        let userItem = baseTeam.AssignedUsers[i];
                        let userAssigned = false;
                        if(currentUsersList != null && currentUsersList.length > 0)
                        {
                            userAssigned = (currentUsersList.find(u => u.UserId == userItem.UserId) != null);
                        }

                        if(userAssigned === false)
                        {
                            ActualAvaiable += 1;
                            let availableUserRow = $("<div class=\"flex-intra-team-manager-available-user_row\" />");
                            //let availableUserCheckbox = $("<input type=\"checkbox\" name=\"possibleUser_" + userItem.UserId + "\" />");
                            let availableUserName = $("<label class=\"flex-intra-team-manager-available-user-name\" />").append(userItem.UserFullName);
                            
                            let availableUserButtons = $("<div class=\"flex-intra-team-manager-available-user-button-holder inline_button-holder\" />");

                            let availableUserAddButton = $("<button class=\"flex-intra-team-manager-available-user-remove-button\" id=\"addUser_" + userItem.UserId + "_" + teamId + "\"><i class=\"fa fa-plus\"></i></button>");

                            $(availableUserAddButton, element).off("click").on("click", function(){
                                let buttonId = this.id;
                                let userId = buttonId.split('_')[1];
                                let intraTeamId = buttonId.split('_')[2];                                
                                AddUserToIntraTeam(userId, intraTeamId, function(){
                                    HandleIntraTeamLoad();
                                    LoadEditorForm(intraTeamId, function(){
                                        ShowEditorForm();
                                    });
                                });
                            });

                            availableUserButtons.append(availableUserAddButton);

                            //availableUserRow.append(availableUserCheckbox);
                            availableUserRow.append(availableUserName);
                            availableUserRow.append(availableUserButtons);

                            availableUserHolder.append(availableUserRow);
                        }
                    }

                    if(ActualAvaiable == 0)
                    {
                        availableUserHolder.append("<p>All users on the team have been assigned as current members on this Intra-team</p>");
                    }
                }
                else
                {
                    availableUserHolder.append("<p>No users found available for selected team.</p>");
                }

                $(".flex-intra-team-manager-editor-agent-list-available", element).append(availableUserHolder);
            }
            function AddUserToIntraTeam(userId, intraTeamId, callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "addUserToIntraTeam",
                        userid: userId,
                        intrateamid: intraTeamId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){                        
                        //SaveEditorForm(true);
                        if(callback != null)
                        {
                            callback();
                        }
                    }
                }); 
            }

            function ShowEditorForm()
            {
                let editorHeaderText = "Edit Intra-Team";
                if(parseInt($("#intraTeamId").val()) <= 0)
                {
                    editorHeaderText = "Add Intra-Team";
                    $(".flex-intra-team-manager-user-options-holder", element).hide();

                }
                $(".flex-intra-team-manager-editor-header-label", element).text(editorHeaderText);
                $(".flex-intra-team-manager-editor-holder", element).show();
            }
            function LoadEditorForm(idToLoad, callback)
            {
                let intraTeam = scope.CurrentIntraTeamList.find(t => t.IntraTeamId == idToLoad);
                $("#intraTeamId", element).val(idToLoad);
                if(intraTeam != null)
                {
                    $(".flex-intra-team-manager-editor-team-name", element).val(intraTeam.TeamName);                                        
                    $(".flex-intra-team-manager-editor-base-team", element).val(intraTeam.TeamId);
                    $("#createBy", element).val(intraTeam.EntBy);
                    $("#createOn", element).val(new Date(intraTeam.EntDt).toLocaleDateString("en-US"));
                    $(".flex-intra-team-manager-editor-agent-list-current-members", element).empty();
                    $(".flex-intra-team-manager-editor-agent-list-current-members", element).append("<div>current users can go here.</div>");                        
                    $(".flex-intra-team-manager-editor-agent-list-available", element).empty();
                    $(".flex-intra-team-manager-editor-agent-list-available", element).append("<div>available users can go here.</div>");                    
                    $(".flex-intra-team-manager-editor-team-status", element).val(intraTeam.Status);
                    $(".flex-intra-team-manager-user-options-holder", element).show();

                    LoadCurrentUserOptions(intraTeam);
                    LoadAvailableUsersOptions(intraTeam.TeamId);
                }
                else
                {
                    $(".flex-intra-team-manager-editor-agent-list-current-members", element).empty();
                    $(".flex-intra-team-manager-editor-agent-list-available", element).empty();
                    
                    $(".flex-intra-team-manager-user-options-holder", element).hide();
                }
                
                if(callback != null)
                {
                    callback();
                }
                else
                {
                    ShowEditorForm();
                }
            }            
            function ClearEditorForm(callback)
            {
                $(".flex-intra-team-manager-editor-team-name", element).val("");
                $(".flex-intra-team-manager-editor-base-team", element).val("");
                $(".flex-intra-team-manager-editor-team-status", element).val("A");
                $("#intraTeamId", element).val(0);
                $("#createBy", element).val(legacyContainer.scope.TP1Username);
                $("#createOn", element).val(new Date().toLocaleDateString("en-US"));

                if(callback != null)
                {
                    callback();
                }

            }
            function SaveEditorForm(forceReload)
            {
                let intraTeamObject = CollectFormDataForIntraTeam();                
                SaveIntraTeam(intraTeamObject, function(editorInformation){
                    let reloadEditor = (intraTeamObject.IntraTeamId != $("#intraTeamId").val());
                    if(reloadEditor === true || forceReload == true)
                    {
                        let itemIndex = scope.CurrentIntraTeamList.indexOf(scope.CurrentIntraTeamList.find(i => i.IntraTeamId == intraTeamObject.IntraTeamId));

                        if( itemIndex == -1)
                        {
                            scope.CurrentIntraTeamList.push(intraTeamObject);
                        }
                        else
                        {
                            scope.CurrentIntraTeamList[itemIndex] = intraTeamObject;
                        }                        
                        LoadEditorForm(intraTeamObject.IntraTeamId, function(){
                            ShowEditorForm();
                        });    
                    }
                    else
                    {
                        HideEditorForm();
                    }
                    HandleIntraTeamLoad();
                });
            }

            function SaveIntraTeam(intraTeamToSave, callback)
            {   
                if(intraTeamToSave != null)
                {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "saveIntraTeam",
                            intrateam: JSON.stringify(intraTeamToSave)
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function(data) {                            
                            intraTeamToSave.IntraTeamId = data.intraTeamId;                     
                            if (callback != null) {
                                callback(data);
                            }
                        }
                    });

                }             
            }
            function ConfirmDeleteAllTeams(callback)
            {
                if(confirm("You are about to deleted all of the items selected.\nPress OK to continue or Cancel to cancel this action."))
                {
                    callback();
                }
            }
            function ConfirmDeleteTeam(idToDelete, callback)
            {
                let intraTeam = scope.CurrentIntraTeamList.find(t => t.IntraTeamId == idToDelete);
                let teamName = "";
                if(intraTeam != null)
                {
                    teamName = intraTeam.Name;
                }
                if(confirm("Delete team " + teamName + "?"))
                {
                    callback();
                }
            }
            function DeleteTeam(idToDelete, callback)
            {   
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "deleteIntraTeam",
                        intrateamid: parseInt(idToDelete)
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function() {                                                    
                        if (callback != null) {
                            callback();
                        }
                    }
                });
            }
            function ConfirmInactivateAllTeams(callback)
            {
                if(confirm("You are about to inactivate all of the items selected.\nPress OK to continue or Cancel to cancel this action."))
                {
                    callback();
                }
            }
            function InactivateAllSelectedTeams(callback)
            {
                let teamsSelected = CollectSelectedTeams();
                if(teamsSelected.length > 0)
                {
                    for(var i= 0; i< teamsSelected.length; i++)
                    {
                        InactivateTeam(teamsSelected[i]);
                    }
                    if(callback != null)
                    {
                        callback();
                    }                    
                }  
            }
            function InactivateTeam(idToInactivate, callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "inactivateIntraTeam",
                        intrateamid: parseInt(idToInactivate)
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function() {                                                    
                        if (callback != null) {
                            callback();
                        }
                    }
                });
            }
            function ValidateIntraTeamForm(callback)
            {
                $(".error-information-holder", element).empty();
                var formValid = true;
                var errorMessages = [];

                var baseTeam = $(".flex-intra-team-manager-editor-base-team", element).val();
                var teamName = $(".flex-intra-team-manager-editor-team-name", element).val();
                var status = $(".flex-intra-team-manager-editor-team-status", element).val();

                if(baseTeam == null || baseTeam == "")
                {
                    errorMessages.push({ message: "Team Required", fieldclass: ".flex-intra-team-manager-editor-base-team", fieldid: "" });                 
                    formValid = false;
                }

                if(teamName == null || teamName == "")
                {
                    errorMessages.push({ message: "Team Name Required", fieldclass: ".flex-intra-team-manager-editor-team-name", fieldid: "" });                 
                    formValid = false;

                }
                if(status == null || status == "")
                {
                    errorMessages.push({ message: "Status Required", fieldclass: ".flex-intra-team-manager-editor-team-status", fieldid: "" });                 
                    formValid = false;
                }
                if(formValid)
                {
                    if(callback != null)
                    {
                        callback();
                    }
                }
                else 
                {
                    var messageString = "";
                    if (errorMessages.length > 0) {
                        messageString += "<i class=\"fas fa-exclamation-triangle\"></i> <strong>Correct the following errors:</strong> <ul>";
                    }
                    for (var m = 0; m < errorMessages.length; m++) {
                        let item = errorMessages[m];

                        messageString += "<li>" + item.message + "</li>";
                        if (item.fieldclass != "") {
                            $(item.fieldclass, element).addClass("errorField");
                            $(item.fieldclass, element).off("blur").on("blur", function() {
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
            function CollectFormDataForIntraTeam()
            {
                var returnObject = new Object();

                returnObject.IntraTeamId = $("#intraTeamId", element).val();
                returnObject.TeamId = $(".flex-intra-team-manager-editor-base-team", element).val();
                returnObject.TeamName = $(".flex-intra-team-manager-editor-team-name", element).val();
                returnObject.Status = $(".flex-intra-team-manager-editor-team-status", element).val();
                returnObject.EntBy = $("#createBy", element).val();
                returnObject.EntDt = new Date($("#createOn", element).val()).toLocaleDateString("en-US");

                return returnObject;
            }
            function MarkAllTeams()
            {
                var allTeamsHolder = ".flex-intra-team-manager-list-holder";
                let checkallCheckboxName = "#markAllTeams";
                var checkAllCheckbox = $(checkallCheckboxName, element);
                var allTeamsCheckboxes = $("input[type='checkbox']", $(allTeamsHolder, element));
                var checkValue = (checkAllCheckbox).is(":checked");

                $(allTeamsCheckboxes).each(function() {
                    $(this).prop("checked", checkValue);
                });
            }
            function DeleteAllSelectedTeams(callback)
            {
                let teamsSelected = CollectSelectedTeams();
                if(teamsSelected.length > 0)
                {
                    for(var i= 0; i< teamsSelected.length; i++)
                    {
                        DeleteTeam(teamsSelected[i]);
                    }
                    if(callback != null)
                    {
                        callback();
                    }                    
                }       
            }

            function CollectSelectedTeams()
            {
                let selectedTeams = [];
                let allTeamsCheckboxes = $("input[type='checkbox']", $(".flex-intra-team-manager-list-holder", element));
                $(allTeamsCheckboxes).each(
                    function(){
                        if($(this).is(":checked"))
                        {
                            var checkboxId = this.id;
                            let teamId = checkboxId.split('_')[1];

                            selectedTeams.push(teamId);
                        }
                    }
                );
                return selectedTeams;
            }
            function DisplayIntraTeams(callback)
            {
                $(".flex-intra-team-manager-teams-list", element).empty();

                let intraTeamListHeader = $("<div class=\"flex-intra-team-manager-list-header\" />");
                let intraTeamListHolder = $("<div class=\"flex-intra-team-manager-list-holder\"/>");

                if(scope.CurrentIntraTeamList.length > 0)
                {
                    let intraTeamList = scope.CurrentIntraTeamList;                    

                    let pageSize = $(".flex-intra-team-manager-list-page-size", element).val();;
                    if(pageSize.toLowerCase() == "all")
                    {
                        pageSize = intraTeamList.length;
                    }
                    else
                    {
                        pageSize = parseInt(pageSize);
                    }
                    let currentPage = parseInt($(".flex-intra-team-manager-list-current-page", element).val()) || 1;
                    intraTeamList = ApplyFiltersToList(intraTeamList);

                    let totalPages = LoadPagingInformation(intraTeamList, pageSize, currentPage);
                    if(totalPages < currentPage)
                    {
                        ResetCurrentPageToFirst();
                        currentPage = 1;
                    }
                    intraTeamList = intraTeamList.slice(((currentPage -1) * pageSize), (((currentPage -1) * pageSize) + pageSize));

                    let headerCheckboxColumn = $("<div class=\"flex-intra-team-manager-list-header-column checkbox-column\" />");                
                    let selectAllCheckbox = $("<input type=\"checkbox\" id=\"markAllTeams\" />");
                    $(selectAllCheckbox, element).off("click").on("click", function(){
                        MarkAllTeams();
                    });
                    headerCheckboxColumn.append(selectAllCheckbox);
                    let headerIntraTeamNameColumn = $("<div class=\"flex-intra-team-manager-list-header-column intra-team-name-column\" />");
                    headerIntraTeamNameColumn.append("Intra-Team Name")
                    let headerBaseTeamNameColumn = $("<div class=\"flex-intra-team-manager-list-header-column base-team-name-column\" />");
                    headerBaseTeamNameColumn.append("Base Team")
                    let headerTeamMemberCountColumn = $("<div class=\"flex-intra-team-manager-list-header-column intra-team-member-count-column\" />");
                    headerTeamMemberCountColumn.append("# of Members")
                    let headerIntraTeamStatusColumn = $("<div class=\"flex-intra-team-manager-list-header-column intra-team-status-column\" />");
                    headerIntraTeamStatusColumn.append("Status");
                    let headerTeamManagerButtonsColumn = $("<div class=\"flex-intra-team-manager-list-header-column intra-team-buttons-column\" />");
                    headerTeamManagerButtonsColumn.append("&nbsp;")
    
    
                    intraTeamListHeader.append(headerCheckboxColumn);
                    intraTeamListHeader.append(headerIntraTeamNameColumn);
                    intraTeamListHeader.append(headerBaseTeamNameColumn);
                    intraTeamListHeader.append(headerTeamMemberCountColumn);
                    intraTeamListHeader.append(headerIntraTeamStatusColumn);
                    intraTeamListHeader.append(headerTeamManagerButtonsColumn);


                    for(var i =0 ; i < intraTeamList.length; i++)
                    {
                        let item = intraTeamList[i];
    
                        let intraTeamDataItem = $("<div class=\"flex-intra-team-manager-list-data-item-holder\" id=\"intraTeamDataRow_" + item.IntraTeamId + "\" />");
                        
                        let checkboxColumn = $("<div class=\"flex-intra-team-manager-list-data-item checkbox-column\" />");
                        let intraTeamCheckbox = $("<input type=\"checkbox\" id=\"intraTeam_" + item.IntraTeamId + "\" value=\"" + item.IntraTeamId + "\" />");
                        checkboxColumn.append(intraTeamCheckbox);
                        
                        let intraTeamNameColumn = $("<div class=\"flex-intra-team-manager-list-data-item intra-team-name-column\" id=\"" + item.IntraTeamId + "\" />");
                        intraTeamNameColumn.append(item.TeamName);
                        
                        $(intraTeamNameColumn, element).off("click").on("click", function(){
                            let teamId = this.id;
                            ToggleTeamMembers("intraTeamDataRow_" + teamId);
                        });

                        let baseTeamNameColumn = $("<div class=\"flex-intra-team-manager-list-data-item base-team-name-column\" />");
                        let baseTeamName = "";
                        if(item.TeamIdSource != null)
                        {
                            baseTeamName = item.TeamIdSource.TeamName;
                        }
                        else
                        {
                            let baseTeam = scope.CurrentTeamList.find(t => t.TeamId == item.TeamId);
                            if(baseTeam != null)
                            {
                                baseTeamName = baseTeam.TeamName;
                            }
                        }
                        baseTeamNameColumn.append(baseTeamName);
                        
                        let teamMemberCountColumn = $("<div class=\"flex-intra-team-manager-list-data-item intra-team-member-count-column\" />");
                        let assignedCount = 0;
                        if(item.AssignedUsers != null)
                        {
                            assignedCount = item.AssignedUsers.length;
                        }
                        teamMemberCountColumn.append(assignedCount);
    
                        let intraTeamStatusColumn = $("<div class=\"flex-intra-team-manager-list-data-item intra-team-status-column\" />");
                        let intraTeamStatus = item.Status;

                        if(intraTeamStatus != "")
                        {
                            switch(intraTeamStatus)
                            {
                                case "A":
                                    intraTeamStatus = "Active";    
                                    break;
                                case "I":
                                    intraTeamStatus = "Inactive";
                                    break;
                            }

                        }
                        intraTeamStatusColumn.append(intraTeamStatus);
    
                        let itemButtonColumn = $("<div class=\"flex-intra-team-manager-list-data-item intra-team-buttons-column\" />");
                        let editTeamButton = $("<button id=\"EditIntraTeam_" + item.IntraTeamId + "\"><i class=\"fa fa-edit\"></i></button>");
                        $(editTeamButton, element).off("click").on("click", function(){
                            let buttonId = this.id;
                            let intraTeamId = buttonId.split('_')[1];
                            LoadEditorForm(intraTeamId, function(){
                                ShowEditorForm();
                            })
                        });
                        let deleteTeamButton = $("<button class=\"button--red\" id=\"DeleteIntraTeam_" + item.IntraTeamId + "\"><i class=\"fa fa-trash\"></i></button>");
                        $(deleteTeamButton, element).off("click").on("click", function(){
                            let buttonId = this.id;
                            let intraTeamId = buttonId.split('_')[1];
                            ConfirmDeleteTeam(intraTeamId, function(){
                                DeleteTeam(intraTeamId, function(){
                                    HandleIntraTeamLoad();
                                })
                            });                        
                        });
                        

                        itemButtonColumn.append(editTeamButton);
                        itemButtonColumn.append("&nbsp;");
                        itemButtonColumn.append(deleteTeamButton);
    
                        intraTeamDataItem.append(checkboxColumn);
                        intraTeamDataItem.append(intraTeamNameColumn);
                        intraTeamDataItem.append(baseTeamNameColumn);
                        intraTeamDataItem.append(teamMemberCountColumn);
                        intraTeamDataItem.append(intraTeamStatusColumn);
                        intraTeamDataItem.append(itemButtonColumn);

                        
                        let intraTeamMembersListHolder = $("<div class=\"flex-intra-team-member-list-users-row\" />");
                        let intraTeamMembersListCheckboxSpacer = $("<div class=\"flex-intra-team-manager-list-data-item checkbox-column\" />");
                        intraTeamMembersListCheckboxSpacer.append("&nbsp;");

                        let intraTeamMembersListData = $("<div class=\"flex-intra-team-member-list-users\" />");
                        let teamMembersList = "";
                        if(item.AssignedUsers != null && item.AssignedUsers.length > 0)
                        {
                            let usersArray = [];
                            for(let u = 0; u < item.AssignedUsers.length; u++)
                            {
                                let agent = item.AssignedUsers[u];
                                usersArray.push(agent.UserFullName);
                            }

                            teamMembersList = usersArray.join(", ");
                        }
                        else
                        {
                            teamMembersList = "No Team Members Found for team.";
                        }
                        intraTeamMembersListData.append(teamMembersList);

                        intraTeamMembersListHolder.append(intraTeamMembersListCheckboxSpacer);
                        intraTeamMembersListHolder.append(intraTeamMembersListData);

                        intraTeamDataItem.append(intraTeamMembersListHolder);

                        intraTeamListHolder.append(intraTeamDataItem);
                    }
                    $(".flex-intra-team-manager-button-delete-selected", element).show();
                }
                else
                {
                    $(".flex-intra-team-manager-button-delete-selected", element).hide();
                    intraTeamListHolder.append("No Intra-teams found.");
                }
                $(".flex-intra-team-manager-teams-list", element).append(intraTeamListHeader);
                $(".flex-intra-team-manager-teams-list", element).append(intraTeamListHolder);
                HideAllTeamMembers();                

                if(callback != null)
                {
                    callback();
                }
                else
                {
                    HideUserStatus();
                }
            }

            function LoadPagingInformation(data, pageSize, currentPage)
            {
                let totalPages = Math.ceil(data.length / pageSize);
                if(currentPage > totalPages)
                {
                    currentPage = 1;
                }

                $(".flex-intra-team-manager-list-current-page", element).empty();
                if(totalPages > 0)
                {
                    for(var i = 1; i <= totalPages; i++)
                    {
                        let pageItem = $("<option value=\"" + i +  "\">" + i + "</option>");
                        if(currentPage == i)
                        {
                            $(pageItem).attr("selected", "selected");
                        }
                        
                        $(".flex-intra-team-manager-list-current-page", element).append(pageItem);
                    }
                }

                $(".flex-intra-team-manager-list-record-count", element).text(data.length);
                $(".flex-intra-team-manager-list-total-page-count", element).text(totalPages);  
                
                return totalPages;
            }

            function ApplyFiltersToList(baseList)
            {
                let returnList = baseList;
                let baseTeamFilter = $(".flex-intra-team-manager-filter-base-team", element).val();
                let teamNameFilter = $(".flex-intra-team-manager-filter-intrateam-name", element).val();
                let includeInactiveTeams = $("#includeInactiveTeams", element).is(":checked") || false;

                if(includeInactiveTeams == false)
                {
                    returnList = returnList.filter(t => t.Status == "A");
                }
                if(baseTeamFilter != null && baseTeamFilter != "")
                {
                    returnList = returnList.filter(t => t.TeamId == parseInt(baseTeamFilter));
                }
                if(teamNameFilter != null && teamNameFilter != "")
                {
                    returnList = returnList.filter(t => t.TeamName.toLowerCase().includes(teamNameFilter.toLowerCase()));
                }
                

                return returnList;
            }

            function HandleIntraTeamLoad()
            {
                scope.LoadIntraTeams(function(data){
                    DisplayIntraTeams();                    
                });
            }
            function ResetCurrentPageToFirst()
            {
                let currentPage = parseInt($(".flex-intra-team-manager-list-current-page", element).val()) || 1;
                if(currentPage != 1)
                {
                    $(".flex-intra-team-manager-list-current-page", element).val(1);
                }                
            }
            
            function ClearFilter(callback)
            {
                $(".flex-intra-team-manager-filter-intrateam-name", element).val("");
                $(".flex-intra-team-manager-filter-base-team", element).val("");
                $("#includeInactiveTeams", element).prop("checked", false);
                ResetCurrentPageToFirst();
                DisplayIntraTeams();
                if(callback != null)
                {
                    callback();
                }
            }

            function ToggleTeamMembers(intraTeamId)
            {
                let item = $(".flex-intra-team-member-list-users-row", $("#" + intraTeamId, element));
                if($(item).is(":visible"))
                {
                    $(item).hide();
                }
                else
                {
                    $(item).show();
                }
            }

            function HideAllTeamMembers()
            {
                $(".flex-intra-team-member-list-users-row", element).each(function(){
                    $(this).hide();
                });
            }
            function HideUserStatus()
            {
                var currentDisplayStatus = $(".flex-game-user-status", element).css("display");

                if (currentDisplayStatus != "none") {
                    $(".flex-game-user-status", element).hide();
                }
            }
            function ShowUserStatus(displayForTiming)
            {
                var currentDisplayStatus = $(".flex-game-user-status").css("display");

                if (displayForTiming == null) {
                    displayForTiming = 60000 //1 minute is default for displaying data. 
                }
                
                if (currentDisplayStatus == "none") {
                    $(".flex-game-user-status").show();
                    window.setTimeout(function() {
                        HideUserStatus();
                    }, displayForTiming);
                }
            }
            function WriteUserStatus(message, displayForTiming)
            {
                $(".flex-game-user-status", element).html(message);
                ShowUserStatus(displayForTiming);
            }
            scope.LoadIntraTeams = function(callback){
                
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getIntraTeamList"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data) {                                                
                        var intraTeams = JSON.parse(data.intraTeamList);
                        scope.CurrentIntraTeamList.length = 0;
                        if(intraTeams != null)
                        {
                            for(var i=0; i< intraTeams.length; i++)
                            {
                                scope.CurrentIntraTeamList.push(intraTeams[i]);
                            }
                        }
                        if (callback != null) {
                            callback(data);
                        }
                    }
                });  
            };

            scope.load = function() {
                scope.Initialize();
                HandleIntraTeamLoad();

                $(".flex-intra-team-manager-editor-base-team", element).off("change").on("change", function(){
                    HandleBaseTeamChange();
                });

                $(".flex-intra-team-manager-button-add-new", element).off("click").on("click", function(){
                    ClearEditorForm(function(){
                        ShowEditorForm();
                    })
                });
                $(".flex-intra-team-manager-button-refresh", element).off("click").on("click", function(){                
                    WriteUserStatus("Refreshing Intra-Team Listing...", 5000);    
                    HideEditorForm();
                    ResetCurrentPageToFirst();
                    HandleIntraTeamLoad();
                });
                $(".flex-intra-team-manager-editor-button-save", element).off("click").on("click", function(){
                    ValidateIntraTeamForm(function(){
                        SaveEditorForm();
                    });
                });
                $(".flex-intra-team-manager-editor-button-cancel", element).off("click").on("click", function(){
                    HideEditorForm();
                });
                $(".flex-intra-team-manager-button-delete-selected", element).off("click").on("click", function(){
                    ConfirmDeleteAllTeams(function(){
                        DeleteAllSelectedTeams(function(){
                            HandleIntraTeamLoad();
                        });    
                    });
                });
                $(".flex-intra-team-manager-button-inactivate-selected", element).off("click").on("click", function(){
                    ConfirmInactivateAllTeams(function(){
                        InactivateAllSelectedTeams(function(){
                            HandleIntraTeamLoad();
                        });
                    });                });
                $(".flex-intra-team-manager-button-apply-filter", element).off("click").on("click", function(){
                    WriteUserStatus("Applying filter options...", 5000);                    
                    DisplayIntraTeams();
                });
                $(".flex-intra-team-manager-button-clear-filter", element).off("click").on("click", function(){
                    ClearFilter();
                });
                $(".intra-team-btn-return-game-list", element).off("click").on("click", function() {                    
                    var prefixInfo = a$.gup("prefix");
                    var hrefLocation = "default.aspx";
                    if (prefixInfo != null && prefixInfo != "") {
                        hrefLocation += "?prefix=" + prefixInfo;
                    }

                    document.location.href = hrefLocation;
                });
                $(".flex-intra-team-manager-list-page-size", element).off("change").on("change", function(){
                    DisplayIntraTeams();
                });
                $(".flex-intra-team-manager-list-current-page", element).off("change").on("change", function(){
                    DisplayIntraTeams();
                });
            };
            scope.load();
        }
    };
}]);