angularApp.directive("ngChimePerfectAttendance", ['api','$compile', '$rootScope', function(api, $compile, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/AGAMEFLEX1/view/chimePerfectAttendance.htm?' + Date.now(),
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
        link: function(scope, element, attrs, legacyContainer) {     
            var currentUser = null;
            
            scope.Initialize = function() {
                
                scope.CurrentDivisionList = [];
                scope.CurrentUserWinningList = [];
                scope.AvailableSpinsList = [];
                scope.AllEligiblePrizeList = [];
                scope.WinningOptionPrizes = [];
                scope.CurrentUserScores = [];
                scope.ActiveUsers = [];

                scope.MyTeamId = -1;

                HideAll();
                SetDatePickerFields();
                LoadCurrentAssignedTeamId();
                LoadEligiblePrizeList();
                LoadCurrentUserWinningsList();
                LoadCurrentUserScores();
                LoadActiveUsers();
                LoadCurrentUserData();
            };
            function HideAll()
            {
                HideTeamListing();
                HideSpinner();
                HideUserWinnings();  
                HidePossiblePrizes();
                HideMyScores();
                HideChat();
                HidePrizeWinning();
            }
            function SetDatePickerFields()
            {
            }    
            function LoadCurrentAssignedTeamId(callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "getAssignedTeamForUser"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){                   
                        let myTeamId = data.assignedTeamForToday;
                        if(myTeamId != null)
                        {
                            scope.MyTeamId = myTeamId;
                        }
                        if(callback != null)
                        {
                            callback();
                        }
                    }
                });
            }
            function LoadEligiblePrizeList(callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "getAllPrizeOptions"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){                        
                        var prizeList = $.parseJSON(data.allPrizesList);                
                        scope.AllEligiblePrizeList.length = 0;
                        if (prizeList != null)
                        {
                            for(var t = 0; t < prizeList.length; t++)
                            {
                                scope.AllEligiblePrizeList.push(prizeList[t]);
                            }    
                        }
                        if(callback != null)
                        {
                            callback();
                        }
                    }
                });
            }
            function LoadCurrentUserWinningsList(callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getPrizeWinningsForUser"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){                        
                        var allUserWinnings = $.parseJSON(data.allPrizesWonList);                
                        scope.CurrentUserWinningList.length = 0;
                        if (allUserWinnings != null)
                        {
                            for(var t = 0; t < allUserWinnings.length; t++)
                            {
                                scope.CurrentUserWinningList.push(allUserWinnings[t]);
                            }    
                        }
                        if(scope.CurrentUserWinningList.length > 0)
                        {
                            SetupAvailableSpins();
                            let availableSpins = scope.AvailableSpinsList;

                            if(availableSpins == null || availableSpins.length ==0)
                            {
                                DisableSpinButton();
                            }
                            else
                            {
                                EnableSpinButton();
                            }
                        }
                        else
                        {
                            DisableSpinButton();
                        }
                    
                        if(callback != null)
                        {
                            callback();
                        }
                    }
                });
            }
            function SetupAvailableSpins(callback)
            {
                let availableSpins = [];
                let dailySpins = scope.CurrentUserWinningList.filter(p => p.DateRedeemed == null && p.ClientPrizeTypeIdEarned == 1);
                let weeklySpins = scope.CurrentUserWinningList.filter(p => p.DateRedeemed == null && p.ClientPrizeTypeIdEarned == 2);
                let grandPrizeSpins = scope.CurrentUserWinningList.filter(p => p.DateRedeemed == null && p.ClientPrizeTypeIdEarned == 3);

                if(dailySpins != null)
                {
                    dailySpins.sort((a,b) => new Date(a.DateEarned) - new Date(b.DateEarned));

                    for(let x = 0; x < dailySpins.length;x++)
                    {
                        availableSpins.push(dailySpins[x]);
                    }
                }
                if(weeklySpins != null)
                {
                    weeklySpins.sort((a,b) => new Date(a.DateEarned) - new Date(b.DateEarned));
                    for(let x = 0; x < weeklySpins.length;x++)
                    {
                        availableSpins.push(weeklySpins[x]);
                    }
                }
                if(grandPrizeSpins != null)
                {
                    grandPrizeSpins.sort((a,b) => new Date(a.DateEarned) - new Date(b.DateEarned));
                    for(let x = 0; x < grandPrizeSpins.length;x++)
                    {
                        availableSpins.push(grandPrizeSpins[x]);
                    }        
                }
                scope.AvailableSpinsList.length = 0;
                for(let i = 0; i < availableSpins.length; i++)
                {
                    scope.AvailableSpinsList.push(availableSpins[i]);
                }

                if(callback != null)
                {
                    callback();
                }
            }

            function LoadCurrentUserScores(callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getScoresForUser"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){                        
                        var userScores = $.parseJSON(data.userScores);                
                        scope.CurrentUserScores.length = 0;
                        if (userScores != null)
                        {
                            for(var t = 0; t < userScores.length; t++)
                            {
                                scope.CurrentUserScores.push(userScores[t]);
                            }    
                        }
                        if(callback != null)
                        {
                            callback();
                        }
                    }
                });
            }
            function LoadActiveUsers(callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    //async: false,
                    async: true,
                    data: {
                        lib: "userprofile",
                        cmd: "getActiveProfiles"
                    },
                    dataType: "json",
                    cache: true,
                    error: a$.ajaxerror,
                    success: function(data){                        
                        var profiles = $.parseJSON(data.userProfiles);                
                        scope.ActiveUsers.length = 0;
                        if (profiles != null)
                        {
                            for(var t = 0; t < profiles.length; t++)
                            {
                                scope.ActiveUsers.push(profiles[t]);
                            }    
                        }
                        if(callback != null)
                        {
                            callback();
                        }
                    }
                });
            }
            
            function LoadCurrentUserData()
            {
                currentUser = GetProfileFromUserId(legacyContainer.scope.TP1Username);
                
                if(currentUser != null)
                {
                    $(".pa-current-user-name", element).text(currentUser.FirstName);
                    let fullAvatarImagePath = a$.debugPrefix() +  a$.scrubAvatarLocation(currentUser.AvatarImageFileName, true);
                    $(".pa-user-avatar", element).prop("src", fullAvatarImagePath);
                }
                
            }

            function GetProfileFromUserId(userId)
            {
                let profile = null;
                profile =  scope.ActiveUsers.find(u => u.UserId == userId);

                if(profile != null)
                {
                    return profile;
                }

                else
                {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "userprofile",
                            cmd: "getProfileByUserId",
                            userid: userId
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function(data){                        
                            var profiles = $.parseJSON(data.userProfiles);                
                            if (profiles != null)
                            {
                                for(var t = 0; t < profiles.length; t++)
                                {
                                    scope.ActiveUsers.push(profiles[t]);
                                    profile = profiles[t];
                                }    
                            }
                        }
                    });                    
                }
                return profile;
            }
            function HideTeamListing()
            {
                $(".pa-team-list-holder", element).hide();
            }
            function ShowTeamListing()
            {
                HideAll();                
                $(".pa-team-list-holder", element).show();
                MarkTabActive(".pa-show-team-button");
            }
            function HidePossiblePrizes()
            {
                $(".pa-possible-prize-holder", element).hide();
            }
            function ShowPossiblePrizes()
            {
                HideAll();
                $(".pa-possible-prize-holder", element).show();
                MarkTabActive(".pa-show-possible-prize-button");
            }
            function HideSpinner()
            {
                ResetSpinnerButton();                                    
                $(".pa-spinner-holder", element).hide();
            }

            function ResetSpinnerButton()
            {
                $(".pa-spinner-spin-button", element).html("Take a spin!");
                $(".pa-spinner-spin-button", element).removeClass("grand-prize-button-selected");
            }
            function ShowSpinner()
            {
                $(".pa-spinner-holder", element).show();
            }
            function HideUserWinnings()
            {
                $(".pa-user-winnings-holder", element).hide();
            }
            function ShowUserWinnings()
            {
                HideAll();
                $(".pa-user-winnings-holder", element).show();
                MarkTabActive(".pa-show-user-winnings-button");
            }
            function HideMyScores()
            {
                $(".pa-my-scores-holder", element).hide();
            }
            function ShowMyScores()
            {
                HideAll();
                $(".pa-my-scores-holder", element).show();
                MarkTabActive(".pa-show-my-score-button");
            }
            function HideChat()
            {
                $(".pa-chat-holder", element).hide();
            }
            function ShowChat()
            {
                HideAll();
                $(".pa-chat-holder", element).show();
                MarkTabActive(".pa-show-chat-button");
            }
            function HidePrizeWinning()
            {
                $(".pa-spinner-user-prize-holder", element).hide();
            }

            function ShowPrizeWinning()
            {
                $(".pa-spinner-user-prize-holder", element).show();
            }

            function HideAllTeamUserRows()
            {
                $("div[id^='teamMembersNamesRow_']", element).each(function(){
                    $(this).hide();
                });
                ToggleTeamMemberRow(scope.MyTeamId);
            }
            function ShowLoadingPanel()
            {
                $(".pa-loading-panel", element).show();
            }
            function HideLoadingPanel()
            {
                $(".pa-loading-panel", element).hide();
            }

            function ToggleTeamMemberRow(teamId)
            {
                let userRow = $("div[id='teamMembersNamesRow_" + teamId + "']", element);
                let userNameArrow = $("#teamMemberNamesArrow_" + teamId, element);

                let isVisible = $(userRow).is(":visible");
                if(isVisible == true)
                {
                    userNameArrow.removeClass("fa-caret-down");
                    userNameArrow.addClass("fa-caret-right");
                    userRow.hide();
                }
                else
                {
                    userNameArrow.removeClass("fa-caret-right");
                    userNameArrow.addClass("fa-caret-down");

                    userRow.show();
                }
            }
            function EnableSpinButton()
            {
                $(".pa-spinner-spin-button", element).show();
                $(".pa-spinner-spin-button", element).prop("disabled", false);

                $(".pa-show-spinner-button", element).show();
                $(".pa-show-spinner-button", element).prop("disabled", false);
            }
            function DisableSpinButton()
            {
                $(".pa-spinner-spin-button", element).hide();
                $(".pa-spinner-spin-button", element).prop("disabled", true);
                
                $(".pa-show-spinner-button", element).hide();
                $(".pa-show-spinner-button", element).prop("disabled", true);
            }
            function DisplayGameListing(callback)
            {
                if($(".pa-team-list-body", element).children().length > 0)
                {
                    if(callback != null)
                    {
                        callback();
                    }
                    else
                    {
                        ShowTeamListing();
                        return;
                    }
                }
                else
                {
                    $(".pa-team-list-body", element).empty();
                    let divisionGameListHolder = $("<div />");
    
                    if(scope.CurrentDivisionList != null && scope.CurrentDivisionList.length > 0)
                    {
                        let divisionList = scope.CurrentDivisionList;
    
                        for(var i = 0; i < divisionList.length; i++)
                        {
                            let item = divisionList[i];
                            let divisionHolder = $("<div class=\"pa-division-holder\" />");
                            
                            let divisionNameHeader = $("<div class=\"pa-division-name-header\" />");
                            divisionNameHeader.append(item.Name);
    
                            divisionHolder.append(divisionNameHeader);
                            
                            if(item.AssignedTeams != null && item.AssignedTeams.length > 0)
                            {
                                for(var t = 0; t < item.AssignedTeams.length; t++)
                                {
                                    let teamItem = item.AssignedTeams[t];
                                    let teamRow = $("<div class=\"pa-team-row-holder\" />");
                                    if(teamItem.ClientTeamId == scope.MyTeamId)
                                    {
                                        teamRow.addClass("team-active");
                                    }
                                    let teamMemberRowHolder = $("<div id=\"teamMembersNamesRow_" + teamItem.ClientTeamId + "\" class=\"inline-item pa-team-member-expander\" />");
                                    BuildTeamMembersListForInlineDisplay(teamMemberRowHolder, teamItem);
    
                                    let teamNameHolder = $("<div id=\"teamRow_" + teamItem.ClientTeamId + "\" class=\"inline-item pa-team-name-holder\" />");
                                    teamNameHolder.append("<i id=\"teamMemberNamesArrow_" + teamItem.ClientTeamId + "\" class=\"fas fa-caret-right\"></i>&nbsp;");
                                    teamNameHolder.append("&nbsp;");
                                    teamNameHolder.append(teamItem.Name);
                                    
                                    $(teamNameHolder, element).off("click").on("click", function(){
                                        let itemId = this.id;
                                        let teamId = itemId.split('_')[1];
    
                                        ToggleTeamMemberRow(teamId);
                                    });
    
                                    let leaderHolder = $("<div class=\"inline-item pa-leader-holder\" />");
                                    let leaderName = teamItem.TeamLeaderUserId;
                                    if(teamItem.TeamLeaderUserId != null && teamItem.TeamLeaderUserId != "")
                                    {
                                        let profile = GetProfileFromUserId(teamItem.TeamLeaderUserId);
                                        if(profile != null)
                                        {
                                            leaderName = profile.UserFullName;
                                        }
                                    }
    
                                    leaderHolder.append(leaderName);
    
                                    let currentScoringHolder = $("<div class=\"inline-item pa-scoring-holder\" />");
                                    RenderScoringRowForTeam(teamItem.CurrentScore, currentScoringHolder);
            
                                    teamRow.append(teamNameHolder);
                                    teamRow.append(leaderHolder);
                                    teamRow.append(currentScoringHolder);
                                    teamRow.append(teamMemberRowHolder);
    
                                    divisionHolder.append(teamRow);    
                                }
                            }
                            else
                            {
                                divisionHolder.append("No Teams Found to load.");
                            }
                            divisionGameListHolder.append(divisionHolder);
                        }
                    }
                    else
                    {
                        divisionGameListHolder.append("No information found to load.");
                    }                
                    $(".pa-team-list-body", element).append(divisionGameListHolder);
    
                    HideAllTeamUserRows();
    
                    if(callback != null)
                    {
                        callback();
                    }
                    else
                    {
                        ShowTeamListing();
                    }
                }
            }

            function BuildTeamMembersListForInlineDisplay(holderObject, teamObject)
            {
                $(holderObject).empty();
                let dataHolder = $("<div class=\"pa-team-member-data-holder\" />");
                if(teamObject != null && teamObject.AssignedPlayers != null && teamObject.AssignedPlayers.length > 0)
                {
                    if(teamObject.TeamLeaderUserIdSource != null)
                    {
                        dataHolder.append(getUserHtmlToRenderForAttendance(teamObject.TeamLeaderUserIdSource, null, true));
                    }
                    
                    for(var u = 0; u < teamObject.AssignedPlayers.length; u++)
                    {
                        let userItem = teamObject.AssignedPlayers[u];
                        dataHolder.append(getUserHtmlToRenderForAttendance(userItem, teamObject.AssignedScores, false));
                    }
                }
                else
                {
                    $(dataHolder).append("No Team Members found.");    
                }
                $(holderObject).append(dataHolder);
            }
            function getUserHtmlToRenderForAttendance(userObject, teamScores, isTeamLeader)
            {
                let returnHtml = $("<div class=\"pa-team-member-item-holder inline-item\" />");
                if(isTeamLeader)
                {
                    returnHtml.addClass("pa-team-leader");
                }
                let profile = GetProfileFromUserId(userObject.UserId);
                let avatarImagePath = a$.debugPrefix() + "/jq/avatars/empty_headshot.png";
                let userDisplayName = userObject.UserId;

                let userMemberAvatarHolder = $("<div class=\"pa-team-member-item-avatar\" />");
                if(profile != null)
                {
                    avatarImagePath = a$.debugPrefix() + a$.scrubAvatarLocation(profile.AvatarImageFileName, true);
                    userDisplayName = profile.UserFullName;
                }
                let avatarImageCircle = $("<div class=\"pa-member-avatar-holder\" />");
                let avatarImage = $("<img class=\"pa-team-member-avatar user-profile-img-avatar-list\" />");
                avatarImage.attr("src", avatarImagePath);

                avatarImageCircle.append(avatarImage);

                userMemberAvatarHolder.append(avatarImageCircle);

                let userMemberStatusHolder = $("<div class=\"pa-team-member-item-status\" />");
                let statusName = "<i class=\"fa fa-question-circle unknown\">&nbsp;</i>";

                if(teamScores != null && teamScores.length > 0)
                {
                    let yesterdayDate = new Date();
                    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

                    let userScore = teamScores.find(s => s.ClientTeamPlayerId == userObject.ClientTeamPlayerId && 
                        new Date(s.ScoreDate).toLocaleDateString("en-US") == yesterdayDate.toLocaleDateString("en-US"));

                    if(userScore != null)
                    {
                        if(userScore.PlayerScore < userScore.MaxScore)
                        {
                            statusName = "<i class=\"fa fa-times-circle bad\">&nbsp;</i>";
                        }
                        else
                        {
                            statusName = "<i class=\"fa fa-check-circle good\">&nbsp;</i>";
                        }
                    }
                }
                userMemberStatusHolder.append(statusName);

                let userMemberNameHolder = $("<div class=\"pa-team-member-item-name\" />");
                userMemberNameHolder.append(userDisplayName);

                returnHtml.append(userMemberAvatarHolder);
                returnHtml.append(userMemberStatusHolder);
                returnHtml.append(userMemberNameHolder);
                

                return returnHtml;
            }
            function LoadPossiblePrizesListing(callback)
            {   
                if($(".pa-prize-possible-body", element).children().length > 0)
                {
                    if(callback != null)
                    {
                        callback();
                    }
                    else
                    {
                        ShowPossiblePrizes();
                        return;
                    }
                }
                else
                {
                    $(".pa-prize-possible-body", element).empty();
                    let numberOfPrizesToShow = 1000;
                    if(scope.AllEligiblePrizeList.length < numberOfPrizesToShow)
                    {
                        numberOfPrizesToShow = scope.AllEligiblePrizeList.length;
                    }
                    let prizeDisplayHolder = $("<div class=\"pa-prize-possible-all-holder\" />");
                    for(var i = 0; i < numberOfPrizesToShow; i++)
                    {
                        //TODO: Randomize what we are pulling from the eligible list???                  
                        let item = scope.AllEligiblePrizeList[i];

                        let prizeItemHolder = $("<div class=\"pa-prize-possible-item-holder inline-item\" />");
                        let prizeItem = $("<div class=\"pa-prize-possible-item\" />");
                        let prizeItemImage = $("<div class=\"pa-prize-item-image\" />");
                        let prizeImageUrl = "";

                        if(item.PrizeImageUrl != null && item.PrizeImageUrl != "")
                        {
                            prizeImageUrl = "<img src=\"" + a$.debugPrefix() + item.PrizeImageUrl + "\">";
                        }


                        prizeItemImage.append(prizeImageUrl);
                        let prizeItemName = $("<div class=\"pa-prize-item-name\" />");
                        prizeItemName.append(item.Name);

                        prizeItem.append(prizeItemImage);
                        prizeItem.append("<br />");
                        prizeItem.append(prizeItemName);

                        prizeItemHolder.append(prizeItem);
                        prizeDisplayHolder.append(prizeItemHolder);
                    }


                    $(".pa-prize-possible-body", element).append(prizeDisplayHolder);

                    if(callback != null)
                    {
                        callback();
                    }
                    else
                    {
                        ShowPossiblePrizes();
                    }
                    
                }
            }

            function DisplaySpinner(callback)
            {
                $(".spinner-object-holder", element).empty();
                $("#winningPrizeId", element).val(0);
                let availableSpins = [];
                
                let dailySpins = scope.AvailableSpinsList.filter(p => p.DateRedeemed == null && p.ClientPrizeTypeIdEarned == 1);
                let weeklySpins = scope.AvailableSpinsList.filter(p => p.DateRedeemed == null && p.ClientPrizeTypeIdEarned == 2);
                let grandPrizeSpins = scope.AvailableSpinsList.filter(p => p.DateRedeemed == null && p.ClientPrizeTypeIdEarned == 3);

                let dailySpinCount = dailySpins.length || 0;
                let weeklySpinCount = weeklySpins.length || 0;
                let grandPrizeClaimCount = grandPrizeSpins.length || 0;

                for(let x = 0; x < dailySpinCount;x++)
                {
                    availableSpins.push(dailySpins[x]);
                }
                for(let x = 0; x < weeklySpinCount;x++)
                {
                    availableSpins.push(weeklySpins[x]);
                }
                for(let x = 0; x < grandPrizeClaimCount;x++)
                {
                    availableSpins.push(grandPrizeSpins[x]);
                }

                $(".pa-user-daily-prize-claims", element).text(dailySpinCount);
                $(".pa-user-weekly-prize-claims", element).text(weeklySpinCount);
                $(".pa-user-grand-prize-claims", element).text(grandPrizeClaimCount);

                let availableSpinCount = availableSpins.length;
                let spinnerPrizeTypeId = 3;
                
                if(availableSpins != null && availableSpinCount > 0)
                {
                    spinnerPrizeTypeId = availableSpins[0].ClientPrizeTypeIdEarned; 
                }
                
                BuildPrizeArrayForWinnerOptions(spinnerPrizeTypeId);

                let availablePrizesForType = scope.AllEligiblePrizeList.filter(p => p.ClientPrizeTypeId == spinnerPrizeTypeId);
                let spinnerObjectHolder = $("<div class=\"pa-spinner-object\" />");
                
                if(availablePrizesForType.length > 0)
                {
                    $("#spinnerPrizeCount", element).val(availablePrizesForType.length)

                    for(let i =0; i < availablePrizesForType.length; i++)
                    {
                        let prizeItem = availablePrizesForType[i];

                        let prizeDisplayItem = $("<div class=\"pa-spinner-item-holder\" />");
                        prizeDisplayItem.attr("value", prizeItem.ClientPrizeId);
                        prizeDisplayItem.attr("itemIndex", i);

                        let prizeDisplayName = $("<div class=\"pa-spinner-item-name\" />");
                        prizeDisplayName.append(prizeItem.Name);
                        let prizeDisplayImage = $("<div class=\"pa-spinner-item-image\" />");
                        let prizeImageUrl = "";
                        if(prizeItem.PrizeImageUrl != null && prizeItem.PrizeImageUrl != "")
                        {
                            prizeImageUrl = "<img src=\"" + a$.debugPrefix() + prizeItem.PrizeImageUrl + "\">";
                        }
                        prizeDisplayImage.append(prizeImageUrl);
                        
                        prizeDisplayItem.append(prizeDisplayImage);
                        prizeDisplayItem.append(prizeDisplayName);

                        if(spinnerPrizeTypeId == 3) //TODO: Handle based on usesselector option
                        {

                            $(".pa-spinner-spin-button", element).text("Select your prize");

                            $(prizeDisplayItem, element).off("click").on("click", function(){                                
                                let idSelected = $(this).attr("value");      
                                $("#winningPrizeId", element).val(idSelected);
                                MarkSelectedItem(idSelected);
                            });
                        }
                        else
                        {
                            $(".pa-spinner-spin-button", element).text("Take a Spin!");
                        }
                        spinnerObjectHolder.append(prizeDisplayItem);
                    }
                }
                else
                {
                    spinnerObjectHolder.append("No Prizes found for spins available.");
                }

                if(availableSpinCount == 0)
                {
                    DisableSpinButton();
                }
                else
                {
                    EnableSpinButton();
                }
                
                $(".spinner-object-holder", element).append(spinnerObjectHolder);
                if(callback != null)
                {
                    callback();
                }
                else
                {
                    ShowSpinner();
                }
            }

            function MarkSelectedItem(idToMark)
            {
                $(".pa-spinner-item-holder", element).each(function(){
                    $(this).removeClass("selected-prize-item");
                });

                $(".pa-spinner-item-holder[value='" + idToMark + "']", element).addClass("selected-prize-item");
                $(".pa-spinner-spin-button", element).html("<i class='fa fa-check'></i> Confirm your prize");
                $(".pa-spinner-spin-button", element).addClass("grand-prize-button-selected");
            }

            function DoSpinForPrize(spinTypeId)
            {
                let spinOptions = scope.AvailableSpinsList.filter(p => p.DateRedeemed == null);

                if(spinOptions.length > 0)
                {
                    if(spinTypeId == null)
                    {
                        spinTypeId = spinOptions[0].ClientPrizeTypeIdEarned;
                    }
                
                    if(spinTypeId == 3)
                    {
                        let winningPrizeId = parseInt($("#winningPrizeId", element).val());
                        if(winningPrizeId == 0)
                        {
                            alert("You must select a prize below to proceed.");
                        }
                        else
                        {
                            EndSpin(winningPrizeId);
                        }
                    }
                    else
                    {
                        StartSpin(function(winningPrizeId){
                            EndSpin(winningPrizeId, function(){
                                $("#winningPrizeId", element).val(0);
                                DisplaySpinner();
                            });
                        });                    
    
                    }
                }
                else
                {
                    alert("You have no more spins remaining.");
                }
            }
            
            function StartSpin(callback)
            {	
                let currentOptionCount = 0;
                let spinnerCurrentCount = 0;
                let maxOptionCount = parseInt($("#spinnerPrizeCount", element).val()) || 0;
                let spinnerMaxCount = 5;
                let showWinningOption = false;
                let winningOptionValueIndex = Math.floor(Math.random() * 100);
                let winningOptionObject = scope.WinningOptionPrizes[winningOptionValueIndex -1];
                if(winningOptionObject == null)
                {
                    winningOptionObject = scope.WinningOptionPrizes[0];                    
                } 
                let winningOptionValue = winningOptionObject.ClientPrizeId;
                $("#winningPrizeId", element).val(winningOptionValue);
                $("#spinnerLoopNumber", element).val(0);
                
                let timer = setInterval(function(){
                    if(spinnerCurrentCount > spinnerMaxCount) 
                    {
                        clearInterval(timer);
                        callback(winningOptionValue);                        
                    }
                    else
                    {
                        let currentOptionValue = $(".pa-spinner-item-holder[itemIndex='" + currentOptionCount + "']", $(".pa-spinner-object", element)).attr("value");

                        if(spinnerCurrentCount >= spinnerMaxCount)
                        {
                            showWinningOption = true;
                        }
                        let previousOptionItemCount = (currentOptionCount -1)
                        if(previousOptionItemCount < 0)
                        {
                            previousOptionItemCount = (maxOptionCount-1);
                        }
                        $(".pa-spinner-item-holder[itemIndex='" + previousOptionItemCount + "']", $(".pa-spinner-object", element)).removeClass("active-spinner-item");
                        $(".pa-spinner-item-holder[itemIndex='" + currentOptionCount + "']", $(".pa-spinner-object", element)).addClass("active-spinner-item");
                        if(showWinningOption == true && currentOptionValue == winningOptionValue)
                        {
                            spinnerCurrentCount *= 10;
                        }
                        currentOptionCount++;
                        if(currentOptionCount == maxOptionCount)
                        {
                            currentOptionCount = 0;
                            spinnerCurrentCount++;
                            $("#spinnerLoopNumber").val(spinnerCurrentCount);
                        }
                    }
                }, 50);

            }
            function EndSpin(winningValue, callback)
            {
                let prize = scope.AllEligiblePrizeList.find(x => x.ClientPrizeId == winningValue);
                
                if(prize != null)                
                {
                    //let spinOption = scope.CurrentUserWinningList.find(x => x.DateRedeemed  == null && x.ClientPrizeTypeIdEarned == prize.ClientPrizeTypeId);
                    let spinOption = scope.AvailableSpinsList.find(x => x.DateRedeemed  == null && x.ClientPrizeTypeIdEarned == prize.ClientPrizeTypeId);
                    if(spinOption != null)
                    {
                        AssignPrizeToUser(spinOption.ClientPlayerPrizeId, prize.ClientPrizeId,function(){
                            $(".pa-spinner-user-prize-holder", element).empty();
                            let winningItemHolder = $("<div class=\"pa-spinner-winning-prize-holder\" />");
                            
                            let winningItemMessage = $("<div class=\"pa-spinner-winning-prize-message-holder\" />");
                            winningItemMessage.append("You have won " + prize.Name + "!");

                            let winningItemImage = $("<div class=\"pa-spinner-winning-prize-image-holder\"/>");
                            if(prize.PrizeImageUrl != null && prize.PrizeImageUrl != "")
                            {
                                winningItemImage.append("<img src=\"" + a$.debugPrefix() + prize.PrizeImageUrl + "\">")
                            }
                            winningItemHolder.append(winningItemMessage);
                            winningItemHolder.append(winningItemImage);

                            $(".pa-spinner-user-prize-holder", element).append(winningItemHolder);
                            ShowPrizeWinning();
                            let hideWinner = setTimeout(function(){
                                HidePrizeWinning();
                                LoadCurrentUserWinningsList(function(){
                                    if($(".pa-show-user-winnings-button", element).hasClass("active") == true)
                                    {
                                        DisplayUserWinningsListing();
                                    }
                                    ResetSpinnerButton();
                                    DisplaySpinner();
                                });
                            }, 5000);
                        });
                    }
                }
                if(callback != null)
                {
                    callback();
                }
            }

            function BuildPrizeArrayForWinnerOptions(prizeTypeId, callback)
            {
                if(prizeTypeId == null || prizeTypeId == 0)
                {
                    prizeTypeId = 1;
                }

                let baseArray = scope.AllEligiblePrizeList.filter(t => t.ClientPrizeTypeId == prizeTypeId);
                scope.WinningOptionPrizes.length = 0;
                let maxNumberOfItems = Math.floor(Math.round((100/baseArray.length)));
                let tempArray = [];
                //load something to pull from
                for(var i =0; i < baseArray.length; i++)
                {
                    let currentCounter = 0;
                    while(currentCounter < maxNumberOfItems)
                    {
                        tempArray.push(baseArray[i]);
                        currentCounter++
                    }
                }
                //shuffle
                for(var j = tempArray.length; j >= 0; j--)
                {
                    var n = Math.floor(Math.random() * (j+1));
                    var holdItem = tempArray[n];
                    tempArray[n] = tempArray[j];
                    tempArray[j] = holdItem;
                }
                //fill the array for prize drawing.

                for(var c = 0; c < tempArray.length; c++)
                {
                    if(tempArray[c] == null || tempArray[c] == "")
                    {
                        var randomItem = Math.floor(Math.random() * (baseArray.length + 1));
                        if(baseArray[randomItem] != null)
                        {
                            tempArray[c] = baseArray[randomItem];
                        }
                        else
                        {
                            tempArray[c] = baseArray[0];
                        }
                    }
                    scope.WinningOptionPrizes.push(tempArray[c]);
                }
                
                if(callback != null)
                {
                    callback();
                }
            }
            function AssignPrizeToUser(playerPrizeId, clientPrizeId, callback)
            {
                
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "assignPrizeToUser",
                        playerprizeid: playerPrizeId,
                        clientprizeid: clientPrizeId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){                                                
                        if(callback != null)
                        {
                            callback();
                        }
                    }
                });
            }

            function DisplayUserWinningsListing(callback)
            {
                $(".pa-user-winnings-list", element).empty();

                let allUserWinningsHolder = $("<div />");

                //header
                let userWinningRowHeader = $("<div  />");

                let userWinningDateHeader = $("<div class=\"inline-item header-item\" />");
                userWinningDateHeader.append("Date");
                let userPrizeNameHeader = $("<div class=\"inline-item header-item\" />");
                userPrizeNameHeader.append("Prize");
                let userRedeemDateHeader = $("<div class=\"inline-item header-item\" />");
                userRedeemDateHeader.append("Redeemed On");
                let userFulfilledDateHeader = $("<div class=\"inline-item header-item\" />");
                userFulfilledDateHeader.append("Fulfilled On");

                userWinningRowHeader.append(userWinningDateHeader);
                userWinningRowHeader.append(userPrizeNameHeader);
                userWinningRowHeader.append(userRedeemDateHeader);
                userWinningRowHeader.append(userFulfilledDateHeader);

                allUserWinningsHolder.append(userWinningRowHeader);

                //list of items
                if(scope.CurrentUserWinningList != null && scope.CurrentUserWinningList.length > 0)
                {
                    let usersDisplayList =  scope.CurrentUserWinningList;
                    usersDisplayList = usersDisplayList.sort((a, b) => new Date(b.DateEarned) - new Date(a.DateEarned));

                    for(var i = 0; i < usersDisplayList.length; i++)
                    {
                        let item = usersDisplayList[i];
                        let userWinningRow = $("<div />");

                        let userWinningDate = $("<div class=\"inline-item\" />");
                        userWinningDate.append(new Date(item.DateEarned).toLocaleDateString("en-US"));
                        
                        let userPrizeName = $("<div class=\"inline-item\" />");
                        let prizeName = item.ClientPrizeId;
                        let prizeImageHolder = $("<span class=\"pa-prize-winning-holder-small inline-item\" />");
                        let prizeImageUrl = null;

                        if(item.ClientPrizeIdSource != null)
                        {
                            prizeName = item.ClientPrizeIdSource.Name;
                            prizeImageUrl = "<img src=\"" + a$.debugPrefix() + item.ClientPrizeIdSource.PrizeImageUrl + "\">";
                        }
                        else if(item.ClientPrizeId != null && item.ClientPrizeId > 0)
                        {
                            let prize = scope.AllEligiblePrizeList.find(x => x.ClientPrizeId == item.ClientPrizeId);
                            if(prize != null)
                            {
                                prizeName = prize.Name;
                                prizeImageUrl = "<img src=\"" + a$.debugPrefix() + prize.PrizeImageUrl + "\">";
                            }
                        }
                        if(prizeName == null || prizeName == "")
                        {
                            prizeName = "Prize result not found.";
                            prizeImageUrl = "";
                        }
                        if(prizeImageUrl != null && prizeImageUrl != "")
                        {
                            prizeImageHolder.append(prizeImageUrl);
                            userPrizeName.append(prizeImageHolder);
                        }
                        userPrizeName.append(prizeName);

                        let userRedeemDate = $("<div class=\"inline-item\" />");
                        let dateRedeemed = "&nbsp;";
                        if(item.DateRedeemed != null)
                        {
                            dateRedeemed = new Date(item.DateRedeemed).toLocaleDateString("en-US");
                        }
                        userRedeemDate.append(dateRedeemed);

                        let userFulfilledDate = $("<div class=\"inline-item\" />");
                        let fulfillDate = "&nbsp;";
                        if(item.FulfilledDate != null)
                        {
                            fulfillDate = new Date(item.FulfilledDate).toLocaleDateString();
                            if(item.FulfilledBy != null && item.FulfilledBy != "")
                            {
                                let userFulfilledByName = item.FulfilledBy;                                
                                let fulfillProfile = GetProfileFromUserId(item.FulfilledBy);                                
                                if(fulfillProfile != null && fulfillProfile.UserFullName != "")
                                {
                                    userFulfilledByName = fulfillProfile.UserFullName;
                                }
                                fulfillDate += " (" + userFulfilledByName + ")";
                            }
                        }
                        userFulfilledDate.append(fulfillDate);

                        userWinningRow.append(userWinningDate);
                        userWinningRow.append(userPrizeName);
                        userWinningRow.append(userRedeemDate);
                        userWinningRow.append(userFulfilledDate);

                        allUserWinningsHolder.append(userWinningRow);

                    }
                }
                else
                {
                    allUserWinningsHolder.append("<p>No winnings found for user.</p>");
                }
                
                $(".pa-user-winnings-list", element).append(allUserWinningsHolder);

                if(callback != null)
                {
                    callback();
                }
                else
                {
                    ShowUserWinnings();
                }
            }

            function DisplayUserScores(callback)
            {
                $(".pa-my-scores-list", element).empty();

                let myScoreHolder= $("<div class=\"pa-my-score-list-holder\" />");

                let myScoreHeaderRow = $("<div class=\"pa-my-score-row-header\" />");
                let myScoreDateHeader = $("<div class=\"pa-my-score-data-item-header my-score-date\" />");
                myScoreDateHeader.append("Score Date");
                let myScoreValueHeader = $("<div class=\"pa-my-score-data-item-header my-score-value\" />");
                myScoreValueHeader.append("Score");
                let myScorePossibleHeader = $("<div class=\"pa-my-score-data-item-header my-score-possible\" />");
                myScorePossibleHeader.append("Possible");

                let myScoreStatusHeader = $("<div class=\"pa-my-score-data-item-header my-score-status\" />");
                myScoreStatusHeader.append("Status");

                myScoreHeaderRow.append(myScoreDateHeader);
                myScoreHeaderRow.append(myScoreValueHeader);
                myScoreHeaderRow.append(myScorePossibleHeader);
                myScoreHeaderRow.append(myScoreStatusHeader);

                myScoreHolder.append(myScoreHeaderRow);

                if(scope.CurrentUserScores != null && scope.CurrentUserScores.length > 0)
                {
                    let displayUserScores = scope.CurrentUserScores;
                    displayUserScores = displayUserScores.sort((a, b) => new Date(b.ScoreDate) - new Date(a.ScoreDate));

                    for(var s = 0; s < displayUserScores.length; s++)
                    {
                        let item = displayUserScores[s];

                        let myScoreRow = $("<div class=\"pa-my-score-row\" />");

                        let myScoreDateHolder = $("<div class=\"pa-my-score-data-item my-score-date\" />");
                        myScoreDateHolder.append(new Date(item.ScoreDate).toLocaleDateString("en-US"));

                        let myScoreValueHolder = $("<div class=\"pa-my-score-data-item my-score-value\" />");
                        myScoreValueHolder.append(item.PlayerScore);

                        let myScorePossibleHolder = $("<div class=\"pa-my-score-data-item my-score-possible\" />");
                        myScorePossibleHolder.append(item.MaxScore);

                        let myScoreStatusHolder = $("<div class=\"pa-my-score-data-item my-score-status\" />");
                        let statusDisplayItem = "<i class=\"far fa-check-circle good\"></i>";
                        if(item.PlayerScore < item.MaxScore)
                        {
                            statusDisplayItem = "<i class=\"far fa-times-circle bad\"></i>";
                        }

                        myScoreStatusHolder.append(statusDisplayItem);

                        myScoreRow.append(myScoreDateHolder);
                        myScoreRow.append(myScoreValueHolder);
                        myScoreRow.append(myScorePossibleHolder);
                        myScoreRow.append(myScoreStatusHolder);
  
                        myScoreHolder.append(myScoreRow);
                    }
                }
                else
                {
                    myScoreHolder.append("<p>No Scores found.</p>");
                }

                $(".pa-my-scores-list", element).append(myScoreHolder);
                if(callback !=null)
                {
                    callback();
                }
                else
                {
                    ShowMyScores();
                }

            }
            
            function RenderScoringRowForTeam(currentScore, holdingObject)
            {
                let score = parseInt(currentScore) || 0;                

                let renderString = $("#renderString", element).val();
                
                if(renderString == null || renderString == "")
                {
                    renderString = "PERFECT_ATTENDANCE" //TODO: Put in some property of the game?
                }
                let renderHtml = $("<div class=\"pa-scoring-holder-team\" />");


                for(var i = 0; i < renderString.length; i++)
                {
                    let renderItem = renderString[i];
                    if(renderItem != "_")
                    {
                        let scoreItem = $("<span class=\"pa-base-score-item\">" + renderItem.toUpperCase() + "</span>");
                        renderHtml.append(scoreItem);
                    }
                    else
                    {
                        let spaceItem = $("<span class=\"pa-base-space-item\"> </span>");
                        renderHtml.append(spaceItem);
                    }
                }

                $(".pa-base-score-item", $(renderHtml)).each(function(i){
                    while(i < score)
                    {
                        $(this).addClass("pa-score-item-active");
                        i++;
                    }
                });


                let scoreInfo = $("<span class=\"pa-scoring-current-score-number\" />");
                let renderStringRemovedSpaces = renderString.replaceAll("_", "");
                scoreInfo.append(score + "/" + renderStringRemovedSpaces.length);
                scoreInfo.append(" " + ((score / renderStringRemovedSpaces.length)*100).toFixed(0) + "%");

                renderHtml.append(scoreInfo);
                
                $(holdingObject).append(renderHtml);
            }

            function HandleAttendanceGameListLoad(callback)
            {
                scope.LoadAttendanceGameList(function(){
                    DisplayGameListing();
                    if(callback != null)
                    {
                        callback();
                    }
                });
            }

            function MarkTabActive(tabClassName)
            {
                $(".header-tab", element).each(function(){
                    $(this).removeClass("active");
                });

                $(tabClassName, element).addClass("active");
            }

            scope.LoadAttendanceGameList = function(callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "getDivisonIdForUser"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){                        
                        var divisionList = $.parseJSON(data.assignedDivisionList);                
                        scope.CurrentDivisionList.length = 0;
                        if (divisionList != null)
                        {
                            for(var t = 0; t < divisionList.length; t++)
                            {
                                scope.CurrentDivisionList.push(divisionList[t]);
                            }    
                        }
                        if(callback != null)
                        {
                            callback();
                        }
                    }
                });
            }
            scope.load = function() {                                
                ShowLoadingPanel();
                scope.Initialize();
                HandleAttendanceGameListLoad();

                $(".pa-show-team-button", element).off("click").on("click", function(){
                    DisplayGameListing();                    
                });

                $(".pa-show-spinner-button", element).off("click").on("click", function(){                    
                    DisplaySpinner();
                });
                $(".pa-spinner-spin-button", element).off("click").on("click", function(){
                    DoSpinForPrize();
                });                
                $(".pa-spinner-close-button", element).off("click").on("click", function(){                    
                    HideSpinner();
                });

                $(".pa-show-user-winnings-button", element).off("click").on("click", function(){                    
                    DisplayUserWinningsListing(function(){
                        ShowUserWinnings();
                    })
                });
                $(".pa-user-winnings-close-button", element).off("click").on("click", function(){                    
                    HideUserWinnings();
                });
                $(".pa-show-possible-prize-button", element).off("click").on("click", function(){
                    LoadPossiblePrizesListing(function(){
                        ShowPossiblePrizes();
                    });
                    
                });
                $(".pa-possible-prize-close-button", element).off("click").on("click", function(){
                    HidePossiblePrizes();
                });

                $(".pa-show-my-score-button", element).off("click").on("click", function(){
                    DisplayUserScores(function(){
                        ShowMyScores();
                    });
                });
                $(".pa-show-chat-button", element).off("click").on("click", function(){
                    ShowChat();
                });
                
                // $("#resetAllSpins", element).off("click").on("click", function(){
                //     a$.ajax({
                //         type: "POST",
                //         service: "C#",
                //         async: false,
                //         data: {
                //             lib: "flex",
                //             cmd: "AdminResetAllSpins"
                //         },
                //         dataType: "json",
                //         cache: false,
                //         error: a$.ajaxerror,
                //         success: function(data){                        
                //             alert("All spins reset. Reloading information.");
                //             DisplayGameListing();   
                //         }
                //     });
                // });

                // $("#admin-renderString-change", element).off("click").on("click", function(){
                //     DisplayGameListing();
                // });

                HideLoadingPanel();
            };
            scope.load();
        }
    };

    
    }]);

    