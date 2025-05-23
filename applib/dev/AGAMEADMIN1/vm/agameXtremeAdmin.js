angularApp.directive("ngAgameXtremeAdmin", ['api', '$rootScope', function (api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/AGAMEADMIN1/view/agameXtremeAdmin.htm?' + Date.now(),
        scope: {
            assoc: "@",
            text: "@",
            details: "@",
            cid: "@",
            filters: "@",
            panel: "@",
            hidetopper: "@",
            toppertext: "@",
            displayLimitedData: "@",
            addonlyDisplay: "@",
            tempReferenceKey: "@",
            userId: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
            var hasAGameAccess = false;
            var configParams = [];
            var possibleThemes = [];
            var possibleGameTeams = [];
            var possibleDivisions = [];
            var possibleGames = [];
            var currentXtremeGameObject = null;
            var originalXtremeGameObject = null;
            var possiblePositions = [];
            var availableOwnerSlots = [4, 6, 8];
            var possibleOwners = [];
            var currentGameWeekNumber = 100000;
            var today = new Date();
            var loadingUrl = a$.debugPrefix() + "/applib/css/images/acuity-loading.gif"
            //TODO: Determine what the default colors should be.
            var defaultColor1 = "black";
            var defaultColor2 = "white";
            var defaultNumberOfPlayoffTeams = 1;
            var defaultNumberOfDivisions = 4;
            var _defDate = "6/15/2021";
            var currentGameInProgress = false;

            /* Events Handling START */
            $("input", element).on("change", function () {
                MarkInformationDirty();
            });
            $(".editor-item-save", element).off("click").on("click", function () {
                let clickedStep = $(this).attr("step");
                let currentStep = $("#currentEditorStep", element).val();

                if (clickedStep != currentStep) {
                    $("#currentEditorStep", element).val(clickedStep);
                }
                SaveEditorStep(currentStep, function () {
                    ShowEditorStep(clickedStep);
                });
            });
            $(".btn-close", element).off("click").on("click", function () {
                let isDirty = ($("#xtremeEditor_InfoIsDirty", element).val() == "Y");
                let ogGameStorageVal = $("#originalxTremeGameStorage", element).val();
                if (ogGameStorageVal != null && ogGameStorageVal != "") {
                    currentXtremeGameObject = JSON.parse(ogGameStorageVal);
                }
                if (isDirty == true) {
                    if (confirm("You have unsaved changes.\nPress OK to close and ignore those changes\n  -or-  \nPress CANCEL to allow you to save your changes first.")) {
                        ClearForm(function () {
                            HideXtremeEditorForm();
                            RenderCurrentLeagueData(currentXtremeGameObject);
                            HandleThemeChange(currentXtremeGameObject?.AGameThemeId);
                            originalXtremeGameObject = null;
                        });
                    }
                }
                else {
                    ClearForm(function () {
                        HideXtremeEditorForm();
                        RenderCurrentLeagueData(currentXtremeGameObject);
                        HandleThemeChange(currentXtremeGameObject?.AGameThemeId);
                        originalXtremeGameObject = null;
                    });
                }
            });
            $("#xtremeEditorDivisionCountExcludePlayoffs", element).off("change").on("change", function () {
                let divisionCountNoPlayoffs = Number.parseInt($(this).val());
                let teamsPerDivision = Number.parseInt($("#xtremeEditorPlayoffTeamsPerDivision", element).val());
                let hasPlayoffs = $("#xtremeEditorHasPlayoffs", element).is(":checked");
                let divisionCount = divisionCountNoPlayoffs;
                if (hasPlayoffs == true) {
                    divisionCount += 1;
                }
                $("#xtremeEditorDivisionsInLeague", element).val(divisionCount);
                $("#xtremeEditorPlayoffTeamCount", element).text(CalculateNumberOfPlayoffTeams(divisionCountNoPlayoffs, teamsPerDivision));
                BuildDivisionOptions($(this).val());
            });
            $("#btnAddPositionToGame", element).off("click").on("click", function () {
                AddPositionToGame(function () {
                    RenderPossiblePositions(currentXtremeGameObject.AssignedPositions);
                });
            });
            $("#btnResetThemePositions", element).off("click").on("click", function () {
                ResetCurrentGamePositionsToThemeDefaults();
            });
            $("#btnAddWeekToGame", element).off("click").on("click", function () {
                console.log("btnAddWeekToGame clicked. Determine what to do with this. [NYI]");
            });
            $("#btnSaveEditorExtreme", element).off("click").on("click", function () {
                WriteUserMessage("Saving information...");
                window.setTimeout(function(){
                    let currentStep = $("#currentEditorStep", element).val();
                    SaveEditorStep(currentStep, function () {
                        ValidateLeagueData(function () {
                            SaveLeagueData(function (savedLeague) {
                                originalXtremeGameObject = savedLeague;
                                $("#originalxTremeGameStorage", element).val("");
                                RenderCurrentLeagueData(savedLeague);
                                CopyGameForRollback(savedLeague);
                                leagueId = $("#xtremeEditor_LeagueId").val();
                                LoadCurrentLeagueEditorForm(leagueId, function (gameToLoad) {
                                    RenderCurrentLeagueEditorForm(gameToLoad);
                                });
                            });
                        });
                        HideUserMessage();
                    });
                }, 500);
            });
            $("#btnSaveAndCloseEditorExtreme", element).off("click").on("click", function () {
                $(".editor-item-save", element).each(function () {
                    let stepToSave = $(this).attr("step");
                    if (stepToSave != null && stepToSave != "") {
                        SaveEditorStep(stepToSave);
                    }
                });
                ValidateLeagueData(function () {
                    SaveLeagueData(function (savedLeague) {
                        originalXtremeGameObject = savedLeague;
                        $("#originalxTremeGameStorage", element).val("");
                        RenderCurrentLeagueData(savedLeague);
                        ClearForm();
                        HideXtremeEditorForm();
                        HideUserMessage();
                    });
                });
            });
            $("#xtremeEditorHasPlayoffs", element).off("change").on("change", function () {

            });
            $("#xtremeEditorPlayoffTeamsPerDivision", element).off("change").on("change", function () {
                let divisionCountNoPlayoffs = Number.parseInt($("#xtremeEditorDivisionCountExcludePlayoffs", element).val());
                let teamsPerDivision = Number.parseInt($(this).val());
            });
            $("#xtremeEditorTheme", element).off("change").on("change", function () {
                HandleThemeChange($(this).val(), function () {
                    MarkInformationDirty();
                });
            });
            $("#xtremeEditorWeeksToRun", element).off("blur").on("blur", function () {
                let leagueStartDate = new Date($("#xtremeEditorStartDate", element).val());
                let numberOfWeeks = parseInt($(this).val());
                let playoffStartDate = CalculatePlayoffStartDate(leagueStartDate, numberOfWeeks);
                playoffStartDate = new Date(playoffStartDate);
                $("#xtremeEditorPlayoffStartDate", element).val(playoffStartDate.toLocaleDateString());
                MarkInformationDirty();
            });
            $("#xtremeEditorStartDate", element).off("change").on("change", function () {
                let leagueStartDate = new Date($(this).val());
                let numberOfWeeks = parseInt($("#xtremeEditorWeeksToRun", element).val());
                let playoffStartDate = CalculatePlayoffStartDate(leagueStartDate, numberOfWeeks);
                playoffStartDate = new Date(playoffStartDate);
                $("#xtremeEditorPlayoffStartDate", element).val(playoffStartDate.toLocaleDateString());
                MarkInformationDirty();
            });
            $("#xtremeEditorMaxOwnerCount", element).off("change").on("change", function () {
                MarkInformationDirty();
                //TODO: Handle the owner count change.
            });
            /* Events Handling END*/

            scope.Initialize = function () {
                $("#userMessageLoadingImage", element).attr("Src", loadingUrl);
                let firstStepValue = $($(".editor-item-save", element)[0]).attr("step");
                $("#currentEditorStep", element).val(firstStepValue);
                LoadConfigParameters();
                LoadOwnerCountOptions();
                LoadThemesOptions(function () {
                    RenderThemeOptions();
                });
                LoadPossibleTeams();
                LoadPossibleOwners();
                SetDatePickers();
                HideAll();
                LoadAllXtremeInformation();
                LoadDefaultLeagueInformation();
                ShowEditorStep(firstStepValue);
            };

            function SetDatePickers() {
                $(".datepicker", element).datepicker();
            }
            function LoadConfigParameters() {
                appLib.getConfigParameters(true, function (parameterList) {
                    configParams = parameterList;
                    SetDefaultsFromConfigParameters(parameterList);
                });
            }
            function SetDefaultsFromConfigParameters(parameters) {
                if (parameters == null || parameters.length == 0) {
                    parameters = configParams;
                }
                if (parameters.length > 0) {
                    let defaultTeamColor1Param = parameters.find(p => p?.ParamName?.toUpperCase() == "DEFAULT_COLOR_1");
                    let defaultTeamColor2Param = parameters.find(p => p?.ParamName?.toUpperCase() == "DEFAULT_COLOR_2");

                    if (defaultTeamColor1Param != null) {
                        defaultColor1 = defaultTeamColor1Param.ParamValue;
                    }
                    if (defaultTeamColor2Param != null) {
                        defaultColor2 = defaultTeamColor2Param.ParamValue;
                    }
                }
            };
            function CopyGameForRollback(gameToCopy) {
                if(gameToCopy == null)
                {
                    return;
                }
                if ($("#originalxTremeGameStorage", element).val() == null || $("#originalxTremeGameStorage", element).val() == "") {
                    let gameValueString = JSON.stringify(gameToCopy);
                    $("#originalxTremeGameStorage", element).val(gameValueString);
                    originalXtremeGameObject = JSON.parse(gameValueString);
                }
            }
            function LoadThemesOptions(callback) {
                if (possibleThemes != null && possibleThemes.length > 0) {
                    if (callback != null) {
                        callback();
                    }
                    return;
                }
                else {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "flex",
                            cmd: "getAGameThemeList",
                        },
                        dataType: "json",
                        cache: false,
                        error: function (response) {
                            a$.ajaxerror(response);
                        },
                        success: function (data) {
                            if (data.errormessage != null && data.errormessage == "true") {
                                a$.jsonerror(data);
                                return;
                            }
                            else {
                                let aGameThemeList = $.parseJSON(data.aGameThemeList);
                                possibleThemes.length = 0;
                                possibleThemes = aGameThemeList;
                                if (callback != null) {
                                    callback();
                                }

                            }
                        }
                    });
                }
            }
            function LoadPossibleOwners(isAsync, callback) {
                if (isAsync == null) {
                    isAsync = true;
                }
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: isAsync,
                    data: {
                        lib: "selfserve",
                        cmd: "getPossibleXtremeOwners",
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage == "true") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            let possibleOwnersList = JSON.parse(data.possibleOwnersList);
                            possibleOwners.length = 0;
                            possibleOwners = possibleOwnersList;
                            if (callback != null) {
                                callback();
                            }

                        }
                    }
                });
            }
            function LoadPossibleTeams(callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "getAllCurrentAGameTeams"
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage == "true") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            let teamList = $.parseJSON(data.divisionTeamsList);
                            possibleGameTeams.length = 0;
                            possibleGameTeams = teamList;
                        }
                        if(callback != null)
                        {
                            callback();
                        }
                    }
                });
            }
            function LoadOwnerCountOptions(callback) {
                $("#xtremeEditorMaxOwnerCount", element).empty();
                $("#xtremeEditorMaxOwnerCount", element).append($("<option />", { text: "Select # of Owners", value: 0 }));

                $(availableOwnerSlots).each(function (index) {
                    let itemOption = $("<option />", { text: availableOwnerSlots[index].toString(), value: availableOwnerSlots[index].toString() });
                    $("#xtremeEditorMaxOwnerCount", element).append(itemOption);

                });
                if (callback != null) {
                    callback();
                }
            }
            function LoadDefaultLeagueInformation(callback) {

                let defaultDate = AddDaysToDate(today, 14);
                let defaultDraftDate = AddDaysToDate(today, 10);
                let defaultRosterDate = AddDaysToDate(today, 12);
                let defaultWeeksToRun = 8;
                let playoffStart = AddDaysToDate(today, (defaultWeeksToRun * 7));
                let defaultDivisionsCount = 1;
                let firstStepValue = "basic";
                let defaultOwnerCount = 4;
                let defaultPlayerDraftCount = 12;
                let defaultOveragePlayerCount = 4;

                $("#xtremeEditor_LeagueId", element).val(-1);
                $("#xtremeEditorTheme", element).val("");
                $("#xtremeEditorStartDate", element).val(defaultDate.toLocaleDateString());
                $("#xtremeEditorRosterVisibleDate", element).val(defaultRosterDate.toLocaleDateString());
                $("#xtremeEditorWeeksToRun", element).val(defaultWeeksToRun);
                $("#xtremeEditorDivisionCountExcludePlayoffs", element).val(defaultDivisionsCount);
                $("#xtremeEditorHasPlayoffs", element).prop("checked", false);
                $("#xtremeEditorPlayoffTeamsPerDivision", element).val(defaultNumberOfPlayoffTeams)
                $("#xtremeEditorPlayoffStartDate", element).val(playoffStart.toLocaleDateString());
                $("#xtremeEditor_InfoIsDirty", element).val("N");
                $("#xtremeEditorDivisionsInLeague", element).val(CalculateNumberOfPlayoffTeams(defaultDivisionsCount, defaultNumberOfPlayoffTeams));
                $("#xtremeEditorMaxOwnerCount", element).val(defaultOwnerCount);
                $("#xtremeEditorDraftDate", element).val(defaultDraftDate.toLocaleDateString());
                $("#xtremeEditorPlayerDraftCount", element).val(defaultPlayerDraftCount);
                $("#xtremeEditorOveragePlayerCount", element).val(defaultOveragePlayerCount);

                BuildDivisionOptions();

                $("#xtremeEditorDivisionCountExcludePlayoffs", element).change();
                $("#xtremeEditorWeeksToRun", element).change();
                $("#xtremeEditorTheme", element).change();
                $("#xtremeEditorMaxOwnerCount", element).change();
                $("#currentEditorStep", element).val(firstStepValue);

                if (callback != null) {
                    callback();
                }
            }
            function LoadAllXtremeInformation() {
                LoadCurrentXtremeLeagueInformation();
                MarkCurrentWeekTabs(currentGameWeekNumber);
            }
            function LoadCurrentXtremeLeagueInformation() {
                GetCurrentLeagueData(function (gameToRender) {
                    currentXtremeGameObject = gameToRender;
                    CopyGameForRollback(gameToRender);
                    RenderCurrentLeagueData(gameToRender);
                    HandleThemeChange(gameToRender?.AGameThemeId);
                });
            }
            function DetermineGameInProgress(gameObject) {
                if (gameObject != null) {
                    if (gameObject.LeagueSchedule != null && gameObject.LeagueSchedule.length > 0) {
                        let item = gameObject.LeagueSchedule.find(s => new Date(s.WeekStartDate) < today);
                        currentGameInProgress = (item != null);
                    }
                }
                HandleGameInProgressOptions();
            }
            function HandleGameInProgressOptions() {
                let isScheduleButtonAvaialble = DetermineGenerateLeagueScheduleButtonAvailable();
                if (isScheduleButtonAvaialble == true) {
                    ShowGenerateScheduleButton();
                }
                else {
                    HideGenerateScheduleButton();
                }
            }
            function DetermineGenerateLeagueScheduleButtonAvailable() {
                let isButtonAvailable = true;
                if (currentXtremeGameObject == null) {
                    isButtonAvailable = false;
                }
                else {
                    if (currentXtremeGameObject.LeagueDivisions != null && currentXtremeGameObject.LeagueDivisions.length > 0) {
                        for (let dc = 0; dc < currentXtremeGameObject.LeagueDivisions.length; dc++) {
                            let division = currentXtremeGameObject.LeagueDivisions[dc];
                            if (division.IsPlayoffs == false) {
                                isButtonAvailable = isButtonAvailable && ((division.TeamIdsAssigned?.length || 0) > 0);
                            }
                        }
                    }
                    else {
                        isButtonAvailable = false;
                    }
                }
                isButtonAvailable = isButtonAvailable && (currentGameInProgress != true);
                //TODO: Determine all business rules here.
                return isButtonAvailable;
            }
            function HandleGameInProgressEditor(renableAll) {
                if (renableAll != null) {
                    currentGameInProgress = false;
                }

                $("#xtremeEditorTheme", element).prop("disabled", currentGameInProgress);
                $("#leagueEditorStartDate", element).prop("disabled", currentGameInProgress);
                $("#leagueEditorRosterVisibleDate", element).prop("disabled", currentGameInProgress);
                $("#leagueEditorWeeksToRun", element).prop("disabled", currentGameInProgress);
                $("#leagueEditorDivisionCountExcludePlayoffs", element).prop("disabled", currentGameInProgress);
                //$("#leagueEditorDivisionCount", element).prop("disabled", currentGameInProgress);
                $("#leagueEditorHasPlayoffs", element).prop("disabled", currentGameInProgress);
                $("#leagueEditorRosterPlayoffStartDate", element).prop("disabled", currentGameInProgress);
                $("#leagueEditorPlayoffTeamsPerDivision", element).prop("disabled", currentGameInProgress);
                $("#xtremeEditorPlayoffTeamCount", element).prop("disabled", currentGameInProgress);

                $("input[id^='divisionName_']", element).each(function () {
                    $(this).prop("disabled", currentGameInProgress);
                });
                $("select[id^='teamDivisionSelector_']", element).each(function () {
                    $(this).prop("disabled", currentGameInProgress);
                });
                $("input[id^='positionName_']", element).each(function () {
                    $(this).prop("disabled", currentGameInProgress);
                });
                $("input[id^='positionQuantity_']", element).each(function () {
                    $(this).prop("disabled", currentGameInProgress);
                });
                $("input[id^='positionMultiplier_']", element).each(function () {
                    $(this).prop("disabled", currentGameInProgress);
                });
                if (currentGameInProgress == true) {
                    $("#addPositionRowHolder", element).hide();
                    $("#positionButtonOptionsHolder", element).hide();
                }
                else {
                    $("#addPositionRowHolder", element).show();
                    $("#positionButtonOptionsHolder", element).show();
                }

            }
            function GetCurrentLeagueData(callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "getAGameExtremeLeague"
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage == "true") {
                            a$.jsonerror(data);
                        }
                        else {
                            let leagueObject = JSON.parse(data.xtremeLeagueObject);
                            if (leagueObject != null && leagueObject.AGameThemeId == 0 && leagueObject.LeagueDivisions.length == 0) {
                                leagueObject = null;
                            }
                            else {
                                currentXtremeGameObject = leagueObject;
                            }
                            //DetermineGameInProgress(currentXtremeGameObject);
                            if (callback != null) {
                                callback(currentXtremeGameObject);
                            }

                        }
                    }
                });
            }
            function RenderCurrentLeagueData(gameDataToRender) {
                if (gameDataToRender != null) {
                    RenderCurrentLeagueSetup();
                    RenderScheduleForDivision(currentXtremeGameObject, null, function () {
                        for (let i = 0; i < currentXtremeGameObject.LeagueDivisions.length; i++) {
                            let divisionId = currentXtremeGameObject.LeagueDivisions[i].DivisionId;
                            if (currentGameWeekNumber > 5000) {
                                HandleScheduleDisplay(1, divisionId, currentXtremeGameObject.HasPreseason);
                            }
                            else {
                                HandleScheduleDisplay(currentGameWeekNumber, divisionId);
                            }
                        }
                    });
                }
                else {
                    DisplayNoCurrentLeagueSetup();
                }
                MarkCurrentWeekTabs(currentGameWeekNumber);
            }
            function RenderCurrentLeagueSetup() {
                let gameObject = currentXtremeGameObject;
                $("#currentXtremeGameHolder", element).empty();
                let currentXtremeGameHolder = $("<div class=\"agame-current-game-holder\" />");

                let gameThemeHolder = $("<div class=\"agame-current-game-theme-holder\" />");
                let gameThemeData = $("<div class=\"agame-current-game-theme-data\" />");
                let theme = possibleThemes.find(t => t.AGameThemeId == gameObject.AGameThemeId);
                if (theme != null) {
                    gameThemeData.addClass(theme.ThemeTag);
                    gameThemeData.addClass(theme.ThemeTag + "-background");
                    let themeImageUrl = theme.ThemeImage;
                    if (themeImageUrl == null || themeImageUrl == "") {
                        themeImageUrl = theme.ThemeBackgroundImage;
                    }
                    if (themeImageUrl != null && themeImageUrl != "") {
                        let themeImageHolder = $("<div class=\"agame-current-game-theme-image-holder\" />");

                        let themeImage = $("<img class=\"agame-current-game-theme-image\" />");
                        themeImage.prop("src", theme.ThemeBackgroundImage);

                        themeImageHolder.append(themeImage);

                        gameThemeData.append(themeImageHolder);
                    }

                    let themeNameHolder = $("<div class=\"agame-current-game-theme-name-holder\"/>");
                    themeNameHolder.append(theme.Name);
                    gameThemeData.append(themeNameHolder);
                }
                gameThemeHolder.append(gameThemeData);
                let gameDataHolder = $("<div class=\"agame-current-game-data-holder\" />");
                let gameRosterVisibileDateHolder = $("<div class=\"agame-current-game-data-item-holder roster-visible-date\" />");
                let gameRosterVisibileDateLabel = $("<span class=\"agame-item-label\">Roster Visible Date:</span>");
                let gameRosterVisibileDate = new Date(gameObject.RosterVisibleDate).toLocaleDateString();
                gameRosterVisibileDateHolder.append(gameRosterVisibileDateLabel);
                gameRosterVisibileDateHolder.append(gameRosterVisibileDate);

                let gameStartDateHolder = $("<div class=\"agame-current-game-data-item-holder\" />");
                let gameStartDate = new Date(gameObject.StartDate).toLocaleDateString();
                let gameStartDateLabel = $("<span class=\"agame-item-label\">Start Date:</span>");
                gameStartDateHolder.append(gameStartDateLabel);
                gameStartDateHolder.append(gameStartDate);

                let weeksToRunHolder = $("<div class=\"agame-current-game-data-item-holder\" />");
                weeksToRunHolder.append("<span class=\"agame-item-label\">Weeks to Run:</span>");
                weeksToRunHolder.append(gameObject.NumberOfWeeks);

                let gamePlayoffHolder = $("<div class=\"agame-current-game-data-item-holder\" />");
                gamePlayoffHolder.append("<span class=\"agame-item-label\">Has Playoffs:</span>");

                if (gameObject.HasPlayoffs == true) {
                    gamePlayoffHolder.append("Yes");
                    let playoffData = $("<div class=\"agame-current-game-data-item-holder\" />");
                    let playoffStartDateHolder = $("<div class=\"agame-item-label-spacing\"  />");
                    playoffStartDateHolder.append("<span class=\"agame-item-label\">Playoff Start Date:</span>");
                    playoffStartDateHolder.append(new Date(gameObject.PlayoffStartDate).toLocaleDateString());

                    let playoffTeamsCountHolder = $("<div class=\"agame-current-game-data-item-holder\" />");
                    playoffTeamsCountHolder.append("<span class=\"agame-item-label\">Teams in Playoffs:</span>");
                    //let playoffTeamsCount = (gameObject.LeagueDivisions?.length || 0) * ($("#leagueEditorPlayoffTeamsPerDivision", element).val() || 1);
                    let divisionCount = gameObject.LeagueDivisions.filter(d => d.IsPlayoffs == false && d.Region == "manual")?.length || 0;

                    //let playoffTeamsCount = CalculateNumberOfPlayoffTeams((gameObject.LeagueDivisions?.length || 0), ($("#leagueEditorPlayoffTeamsPerDivision", element).val() || 1));
                    let playoffTeamsCount = CalculateNumberOfPlayoffTeams(divisionCount, ($("#leagueEditorPlayoffTeamsPerDivision", element).val() || 1));
                    playoffTeamsCountHolder.append(playoffTeamsCount);

                    // let numberOfPlayoffWeeksHolder = $("<div class=\"agame-item-label-spacing\" />");
                    // numberOfPlayoffWeeksHolder.append("<span class=\"agame-item-label\">Number of weeks in playoffs:</span>");
                    // let playoffWeeksCount = CalculateNumberOfPlayoffWeeks();
                    // numberOfPlayoffWeeksHolder.append(playoffWeeksCount);

                    playoffData.append(playoffStartDateHolder);
                    playoffData.append(playoffTeamsCountHolder);
                    //playoffData.append(numberOfPlayoffWeeksHolder);

                    gamePlayoffHolder.append(playoffData);
                }
                else {
                    gamePlayoffHolder.append("No");
                }
                let gamePreseasonHolder = $("<div class=\"agame-current-game-data-item-holder\" />");
                gamePreseasonHolder.append("<span class=\"agame-item-label\">Has Preseason:</span>");
                if (gameObject.HasPreseason == true || gameObject.LeagueSchedule.filter(w => w.WeekType == "T").length > 0) {
                    gamePreseasonHolder.append("Yes");
                }
                else {
                    gamePreseasonHolder.append("No");
                }
                let ownerCountHolder = $("<div class=\"agame-current-game-data-item-holder\" />");
                let ownerCount = gameObject.MaxOwnerCount || 0;
                ownerCountHolder.append("<span class=\"agame-item-label\">Max # of Owners:</span>");
                ownerCountHolder.append(ownerCount);

                let ownerSlotsFilledHolder = $("<div class=\"agame-current-game-data-item-holder\" />");
                let assignedOwnersCount = gameObject.OwnersList.length || 0;
                ownerSlotsFilledHolder.append("<span class=\"agame-item-label\">Current # of Owners:</span>");
                ownerSlotsFilledHolder.append(assignedOwnersCount);

                let draftDateHolder = $("<div class=\"agame-current-game-data-item-holder\" />");

                let draftDate = "";
                if (gameObject.DraftDate != null) {
                    draftDate = new Date(gameObject.DraftDate).toLocaleDateString();
                }
                draftDateHolder.append("<span class=\"agame-item-label\">Draft Date:</span>");
                draftDateHolder.append(draftDate);

                let playersDraftedHolder = $("<div class=\"agame-current-game-data-item-holder\" />");
                let playersDraftedCount = gameObject.DraftedPlayerCount || 0;
                playersDraftedHolder.append("<span class=\"agame-item-label\"># of Players Drafted:</span>");
                playersDraftedHolder.append(playersDraftedCount);

                let extraPlayersHolder = $("<div class=\"agame-current-game-data-item-holder\" />");
                let extraPlayerCount = gameObject.ExtraPlayerCount || 0;
                extraPlayersHolder.append("<span class=\"agame-item-label\"># of Extra Players:</span>");
                extraPlayersHolder.append(extraPlayerCount);

                let draftRoomStatusHolder = $("<div class=\"agame-current-game-data-item-holder\" />");
                let draftRoomStatusLink = $("<a class=\"agame-xtreme-game-room-link\" alt=\"Click to switch status\" title=\"Click to swtich status\" />");

                let draftRoomStatus = "";
                if (gameObject.Status.toUpperCase() == "D") {
                    draftRoomStatus = "Open";
                }
                else {
                    draftRoomStatus = "Closed";
                }
                draftRoomStatusHolder.append("<span class=\"agame-item-label\">Draft room Status:</span>");
                draftRoomStatusLink.append(draftRoomStatus);
                if (gameObject.Status.toUpperCase() == "D") {
                    draftRoomStatusLink.on("click", function () {
                        DisplayWorkingIndicator("Closing draft rooms...", function () {
                            CloseDraftRoom(function () {
                                currentXtremeGameObject = null;
                                HideWorkingIndicator();
                                LoadCurrentXtremeLeagueInformation();
                            });
                        });
                    });
                }
                else {
                    draftRoomStatusLink.on("click", function () {
                        DisplayWorkingIndicator("Opening draft rooms...", function () {
                            OpenDraftRoom(function () {
                                currentXtremeGameObject = null;
                                HideWorkingIndicator();
                                LoadCurrentXtremeLeagueInformation();
                            });
                        });
                    });
                }

                draftRoomStatusHolder.append(draftRoomStatusLink);

                //let draftDateHolder = $("<div class=\"agame-current-game-data-item-holder\" />");

                let gameDivisionHolder = $("<div class=\"agame-current-division-holder\" />");
                if (gameObject.LeagueDivisions != null && gameObject.LeagueDivisions.length > 0) {
                    for (let dc = 0; dc < gameObject.LeagueDivisions.length; dc++) {
                        let divisionItem = gameObject.LeagueDivisions[dc];
                        let divisionItemHolder = $("<div class=\"agame-division-item-holder\" id=\"currentDivisionHolder_" + divisionItem.DivisionId + "\" />");
                        let divisionItemHeader = $("<div class=\"agame-division-item-header\" id=\"currentDivisionHeader_" + divisionItem.DivisionId + "\"/>");
                        divisionItemHeader.on("click", function () {
                            let id = this.id;
                            let divisionId = id.split("_")[1];
                            ToggleDivisionDisplay(divisionId);
                        });
                        let divisionItemBody = $("<div class=\"agame-division-item-body\" id=\"currentDivisionBody_" + divisionItem.DivisionId + "\"/>");
                        let divisionItemTeamsHolder = $("<div class=\"agame-division-team-holder\" id=\"currentDivisionTeamHolder_" + divisionItem.DivisionId + "\" />");
                        let divisionItemScheduleHolder = $("<div class=\"agame-division-schedule-holder\" id=\"currentDivisionScheduleHolder_" + divisionItem.DivisionId + "\" />");

                        let divisionItemDivisionNameHolder = $("<div class=\"agame-division-item-name-holder\" />");
                        divisionItemDivisionNameHolder.append(divisionItem.DivisionName);

                        divisionItemHeader.append(divisionItemDivisionNameHolder);

                        let teamCount = divisionItem.TeamIdsAssigned?.length || 0;

                        let divisionTeamCountHolder = $("<div class=\"agame-division-counter count-holder\" />");
                        divisionTeamCountHolder.append("<span class=\"agame-item-label\">Total Teams:</span> ");
                        divisionTeamCountHolder.append(teamCount);

                        divisionItemHeader.append(divisionTeamCountHolder);

                        if (divisionItem.TeamIdsAssigned != null && divisionItem.TeamIdsAssigned.length > 0) {
                            let totalPlayerCount = 0;

                            for (let tc = 0; tc < divisionItem.TeamIdsAssigned.length; tc++) {
                                let teamInfo = $("<div class=\"division-team-data-holder\" />");
                                let assignedTeam = divisionItem.TeamIdsAssigned[tc];
                                let teamItem = GetExtremeTeamById(assignedTeam);
                                let teamColorItem = $("<div class=\"agame-league-team-color-holder\" />");
                                teamColorItem.append("&nbsp;&nbsp;&nbsp;&nbsp;");

                                let teamNameHolder = $("<div class=\"agame-league-division-team-name-holder\" />");


                                if (teamItem != null) {
                                    let teamColor1 = defaultColor1;
                                    let teamColor2 = defaultColor2;
                                    if (teamItem.Colors != null) {
                                        teamColor1 = teamItem.Colors[0] || defaultColor1;
                                        teamColor2 = teamItem.Colors[1] || defaultColor2;
                                    }
                                    if(teamItem.UserCount != null)
                                    {
                                        totalPlayerCount += teamItem.UserCount;
                                    }
                                    teamColorItem.css("background", "linear-gradient(135deg, " + teamColor1 + " 50%, " + teamColor2 + " 50%)");
                                    teamInfo.append(teamColorItem);
                                    teamNameHolder.append(teamItem.TeamName);
                                }
                                else {
                                    let divisionTeam = possibleGameTeams.find(t => t.ClientTeamId == assignedTeam);
                                    if (divisionTeam != null) {
                                        teamNameHolder.append(divisionTeam.ClientTeamName);
                                    }
                                    else {
                                        teamNameHolder.append("Team not found ID: " + assignedTeam);
                                    }
                                }
                                teamInfo.append(teamNameHolder);

                                divisionItemTeamsHolder.append(teamInfo);
                            }

                            let divisionPlayerCountHolder = $("<div class=\"agame-division-counter count-holder\" />");
                            divisionPlayerCountHolder.append("<span class=\"agame-item-label\">Total Players: </span>");
                            divisionPlayerCountHolder.append(totalPlayerCount);

                            divisionItemHeader.append(divisionPlayerCountHolder);
                        }
                        else {
                            divisionItemTeamsHolder.append("No Teams found for division");
                        }

                        divisionItemBody.append(divisionItemTeamsHolder);
                        divisionItemBody.append(divisionItemScheduleHolder);

                        divisionItemHolder.append(divisionItemHeader);
                        divisionItemHolder.append(divisionItemBody);

                        gameDivisionHolder.append(divisionItemHolder);
                    }
                }
                else {
                    gameDivisionHolder.append("No Divisions Created for game.");
                }
                let gamePositionsHolder = $("<div class=\"agame-current-positions-holder\" />");
                if (gameObject.AssignedPositions != null && gameObject.AssignedPositions.length > 0) {

                    let positionHeaderItemRow = $("<div class=\"agame-current-positions-header agame-current-row\" />");
                    let positionHeaderNameHolder = $("<div class=\"header-item agame-current-row-item position-name\">Position</div>");
                    let positionHeaderQuantityHolder = $("<div class=\"header-item agame-current-row-item position-quantity\">Quantity</div>");
                    let positionHeaderMultiplierHolder = $("<div class=\"header-item agame-current-row-item position-multiplier\">Multiplier</div>");


                    positionHeaderItemRow.append(positionHeaderNameHolder);
                    positionHeaderItemRow.append(positionHeaderQuantityHolder);
                    positionHeaderItemRow.append(positionHeaderMultiplierHolder);

                    gamePositionsHolder.append(positionHeaderItemRow);

                    for (let pc = 0; pc < gameObject.AssignedPositions.length; pc++) {
                        let positionItem = gameObject.AssignedPositions[pc];
                        let positionItemRow = $("<div class=\"agame-current-row\"/>");

                        let positionNameHolder = $("<div class=\"agame-current-row-item position-name\" />");
                        positionNameHolder.append(positionItem.PositionName);
                        let positionQuantityHolder = $("<div class=\"agame-current-row-item position-quantity\" />");
                        positionQuantityHolder.append(positionItem.Quantity);

                        let positionMultiplierHolder = $("<div class=\"agame-current-row-item position-multiplier\" />");
                        positionMultiplierHolder.append(positionItem.Multiplier);

                        positionItemRow.append(positionNameHolder);
                        positionItemRow.append(positionQuantityHolder);
                        positionItemRow.append(positionMultiplierHolder);

                        gamePositionsHolder.append(positionItemRow);
                    }
                }
                else {
                    gamePositionsHolder.append("No Positions found for the theme.");
                }

                let gameScheduleWeeksHolder = $("<div class=\"agame-current-schedule-weeks-holder\" />");

                if (gameObject.LeagueSchedule != null && gameObject.LeagueSchedule.length > 0) {
                    let gameScheduleWeeksHeader = $("<div class=\"header-item agame-current-schedule-week-row\" />");
                    let gameScheduleWeeksWeekNumberHeader = $("<div class=\"header-item agame-current-row-item week-number\">#</div>");
                    let gameScheduleWeeksStartDateHeader = $("<div class=\"header-item agame-current-row-item week-start-date\">Start Date</div>");
                    let gameScheduleWeeksEndDateHeader = $("<div class=\"header-item agame-current-row-item week-end-date\">End Date</div>");

                    gameScheduleWeeksHeader.append(gameScheduleWeeksWeekNumberHeader);
                    gameScheduleWeeksHeader.append(gameScheduleWeeksStartDateHeader);
                    gameScheduleWeeksHeader.append(gameScheduleWeeksEndDateHeader);

                    gameScheduleWeeksHolder.append(gameScheduleWeeksHeader);


                    let regularSeasonSchedule = gameObject.LeagueSchedule.filter(w => w.WeekType == "R");
                    let preseasonSchedule = gameObject.LeagueSchedule.filter(w => w.WeekType == "T");

                    //preseason weeks
                    for (let wc = 0; wc < preseasonSchedule.length; wc++) {
                        //let currentWeekScheduleItem = gameObject.LeagueSchedule[wc];
                        let currentWeekScheduleItem = preseasonSchedule[wc];
                        let isTodayInScheduledWeek = false;
                        let startDate = new Date(currentWeekScheduleItem.WeekStartDate);
                        let endDate = new Date(currentWeekScheduleItem.WeekEndDate);
                        isTodayInScheduledWeek = (startDate <= today) && (today <= endDate);

                        let gameScheduleWeekRow = $("<div class=\"agame-current-schedule-week-row\" />");
                        if (isTodayInScheduledWeek == true) {
                            gameScheduleWeekRow.addClass("is-current-week");
                            currentGameWeekNumber = parseInt(currentWeekScheduleItem.WeekNumber);
                        }
                        let gameScheduleWeekNumberHolder = $("<div class=\"agame-current-row-item week-number\" />");
                        gameScheduleWeekNumberHolder.append("PS-" + currentWeekScheduleItem.WeekNumber);
                        let gameScheduleWeekStartDateHolder = $("<div class=\"agame-current-row-item week-start-date\" />");
                        gameScheduleWeekStartDateHolder.append(new Date(startDate).toLocaleDateString());

                        let gameScheduleWeekEndDateHolder = $("<div class=\"agame-current-row-item week-end-date\" />");
                        gameScheduleWeekEndDateHolder.append(new Date(endDate).toLocaleDateString());

                        gameScheduleWeekRow.append(gameScheduleWeekNumberHolder);
                        gameScheduleWeekRow.append(gameScheduleWeekStartDateHolder);
                        gameScheduleWeekRow.append(gameScheduleWeekEndDateHolder);

                        gameScheduleWeeksHolder.append(gameScheduleWeekRow);
                    }

                    //regular season weeks
                    for (let wc = 0; wc < regularSeasonSchedule.length; wc++) {
                        //let currentWeekScheduleItem = gameObject.LeagueSchedule[wc];
                        let currentWeekScheduleItem = regularSeasonSchedule[wc];
                        let isTodayInScheduledWeek = false;
                        let startDate = new Date(currentWeekScheduleItem.WeekStartDate);
                        let endDate = new Date(currentWeekScheduleItem.WeekEndDate);
                        isTodayInScheduledWeek = (startDate <= today) && (today <= endDate);

                        let gameScheduleWeekRow = $("<div class=\"agame-current-schedule-week-row\" />");
                        if (isTodayInScheduledWeek == true) {
                            gameScheduleWeekRow.addClass("is-current-week");
                            currentGameWeekNumber = parseInt(currentWeekScheduleItem.WeekNumber);
                        }
                        let gameScheduleWeekNumberHolder = $("<div class=\"agame-current-row-item week-number\" />");
                        gameScheduleWeekNumberHolder.append(currentWeekScheduleItem.WeekNumber);
                        let gameScheduleWeekStartDateHolder = $("<div class=\"agame-current-row-item week-start-date\" />");
                        gameScheduleWeekStartDateHolder.append(new Date(startDate).toLocaleDateString());

                        let gameScheduleWeekEndDateHolder = $("<div class=\"agame-current-row-item week-end-date\" />");
                        gameScheduleWeekEndDateHolder.append(new Date(endDate).toLocaleDateString());

                        gameScheduleWeekRow.append(gameScheduleWeekNumberHolder);
                        gameScheduleWeekRow.append(gameScheduleWeekStartDateHolder);
                        gameScheduleWeekRow.append(gameScheduleWeekEndDateHolder);

                        gameScheduleWeeksHolder.append(gameScheduleWeekRow);
                    }

                    if (gameObject.HasPlayoffs == true && gameObject.PlayoffSchedule != null && gameObject.PlayoffSchedule.length > 0) {
                        for (let pwc = 0; pwc < gameObject.PlayoffSchedule.length; pwc++) {
                            let playoffWeekScheduleItem = gameObject.PlayoffSchedule[pwc];
                            let startDate = new Date(playoffWeekScheduleItem.WeekStartDate);
                            let endDate = new Date(playoffWeekScheduleItem.WeekEndDate);
                            isTodayInScheduledWeek = (startDate <= today) && (today <= endDate);

                            let gameSchedulePlayoffWeekRow = $("<div class=\"agame-current-schedule-week-row playoffs-row\" />");
                            if (isTodayInScheduledWeek == true) {
                                gameScheduleWeekRow.addClass("is-current-week");
                            }
                            let gameScheduleWeekNumberHolder = $("<div class=\"agame-current-row-item week-number\" />");
                            gameScheduleWeekNumberHolder.append("P-" + playoffWeekScheduleItem.WeekNumber);
                            let gameScheduleWeekStartDateHolder = $("<div class=\"agame-current-row-item week-start-date\" />");
                            gameScheduleWeekStartDateHolder.append(new Date(startDate).toLocaleDateString());

                            let gameScheduleWeekEndDateHolder = $("<div class=\"agame-current-row-item week-end-date\" />");
                            gameScheduleWeekEndDateHolder.append(new Date(endDate).toLocaleDateString());

                            gameSchedulePlayoffWeekRow.append(gameScheduleWeekNumberHolder);
                            gameSchedulePlayoffWeekRow.append(gameScheduleWeekStartDateHolder);
                            gameSchedulePlayoffWeekRow.append(gameScheduleWeekEndDateHolder);

                            gameScheduleWeeksHolder.append(gameSchedulePlayoffWeekRow);
                        }
                    }
                }
                else {
                    gameScheduleWeeksHolder.append("Currently no schedule weeks setup.");
                }

                let gameButtonsHolder = $("<div class=\"agame-button-container\"  />");
                let editButton = $("<button class=\"button btn agame-button\" id=\"btnEditLeague\"><i class=\"fa fa-edit\"></i> Edit League</button>");
                editButton.on("click", function () {
                    let id = this.id;
                    let leagueId = id.split("_")[1];
                    LoadCurrentLeagueEditorForm(leagueId, function (gameToLoad) {
                        RenderCurrentLeagueEditorForm(gameToLoad, function () {
                            let firstStep = $($(".editor-item-save", element)[0]).attr("step");
                            MarkEditorStepActive(firstStep);
                            ShowXtremeEditorForm();
                        });
                    });
                });
                let refreshButton = $("<button class=\"button btn agame-button\" id=\"btnRefreshLeague\"><i class=\"fa fa-refresh\"></i> Refresh</button>");
                refreshButton.on("click", function () {
                    ko.postbox.publish("AgameXtremeAdminReload");
                });
                let generateScheduleButton = $("<button class=\"button btn agame-button\" id=\"btnGenerateLeagueSchedule\">Generate Schedule</button>");
                generateScheduleButton.on("click", function () {
                    DisplayWorkingIndicator("Generating Schedule...", function () {
                        GenerateScheduleForLeague(function () {
                            LoadCurrentXtremeLeagueInformation();
                        });
                    });
                });
                let completeLeagueButton = $("<button id=\"btnCompleteLeague\" class=\"button btn agame-button\"><i class=\"fa\"></i>Complete/Cancel League</button>");
                completeLeagueButton.on("click", function () {
                    ConfirmLeagueComplete(function () {
                        //TODO: Write a UI message to the user?
                        HandleLeagueComplete(function () {
                            ClearCurrentLeagueCache();
                            currentXtremeGameObject = null;
                            currentGameWeekNumber = 10000;
                            currentGameInProgress = false;
                            LoadCurrentXtremeLeagueInformation();
                        });
                    });
                });
                let createTeamsFromOwnersButton = $("<button id=\"btnCreateOwnerTeams\" class=\"button btn agame-button\"><i class=\"fa\"></i>Create Teams for Owners</button>");
                createTeamsFromOwnersButton.on("click", function(){
                    DisplayWorkingIndicator("Generating teams for owners...");
                    window.setTimeout(function(){
                        GenerateTeamsForOwners(function(){
                            LoadCurrentXtremeLeagueInformation();
                            HideWorkingIndicator();
                        });
                    }, 500);
                });

                let workingIndicatorHolder = $("<div id=\"workingIndicatorHolder\" class=\"agame-league-working-indicator-holder\" />");
                let workingIndicatorImage = $("<img src=\"" + loadingUrl + "\" alt=\"Working...\" height=\"50\" width=\"50\" >");
                let workingIndicatorLabel = $("<span id=\"workingIndicatorMessage\">Doing some work...</span>");

                workingIndicatorHolder.append(workingIndicatorImage);
                workingIndicatorHolder.append(workingIndicatorLabel);

                gameButtonsHolder.append(editButton);
                gameButtonsHolder.append(refreshButton);
                gameButtonsHolder.append(createTeamsFromOwnersButton);
                gameButtonsHolder.append(generateScheduleButton);
                gameButtonsHolder.append(completeLeagueButton);

                gameButtonsHolder.append(workingIndicatorHolder);

                gameDataHolder.append(gameStartDateHolder);
                gameDataHolder.append(gameRosterVisibileDateHolder);
                gameDataHolder.append(weeksToRunHolder);
                gameDataHolder.append(ownerCountHolder);
                gameDataHolder.append(ownerSlotsFilledHolder);
                gameDataHolder.append(draftDateHolder);
                gameDataHolder.append(playersDraftedHolder);
                gameDataHolder.append(extraPlayersHolder);
                gameDataHolder.append(draftRoomStatusHolder);
                gameDataHolder.append(gamePreseasonHolder);
                gameDataHolder.append(gamePlayoffHolder);

                let positionScheduleBlockHolder = $("<div class=\"agame-current-game-data-position-block-holder\"/>");
                positionScheduleBlockHolder.append(gamePositionsHolder);
                positionScheduleBlockHolder.append(gameScheduleWeeksHolder);

                currentXtremeGameHolder.append(gameThemeHolder);
                currentXtremeGameHolder.append(gameDataHolder);
                currentXtremeGameHolder.append(gameButtonsHolder);
                currentXtremeGameHolder.append("<div class=\"clearfix\"></div>");
                currentXtremeGameHolder.append(positionScheduleBlockHolder);
                currentXtremeGameHolder.append(gameDivisionHolder);

                $("#currentXtremeGameHolder", element).append(currentXtremeGameHolder);
                CollapseAllCurrentLeageDivisions(function () {
                    ExpandFirstDivision();
                });
                HandleAllScheduleDisplays();
                HideWorkingIndicator();
                HandleGameInProgressOptions();
            }
            function DisplayNoCurrentLeagueSetup() {

                let messageHolder = $("<div class=\"agame-no-game-found-holder\" />");
                let messageLabel = $("<div class=\"agame-no-game-message-holder\" />");
                let noCurrentGameMessageText = "There is currently no game information setup.";
                let createNewAGameButtonHolder = $("<div class=\"create-new-agame-button-holder\" />");

                let createNewAGameButton = $("<button />");
                createNewAGameButton.append("Create a New xTreme League");

                $(createNewAGameButton, element).off("click").on("click", function () {
                    CreateNewAGameXtremeLeagueButtonClicked();
                });

                createNewAGameButtonHolder.append(createNewAGameButton);

                messageLabel.append(noCurrentGameMessageText);

                messageHolder.append(messageLabel);
                messageHolder.append(createNewAGameButtonHolder);

                $("#currentXtremeGameHolder", element).empty();
                $("#currentXtremeGameHolder", element).append(messageHolder);

            }
            function CreateNewAGameXtremeLeagueButtonClicked() {
                $("#xtremeEditorTheme", element).val(DetermineDefaultThemeId(_defDate));
                $("#xtremeEditorTheme", element).change();
                ShowXtremeEditorForm();
            }
            function LoadCurrentLeagueEditorForm(leagueId, callback) {
                let returnObject = null;
                if (currentXtremeGameObject != null && leagueId == currentXtremeGameObject.Id) {
                    originalXtremeGameObject = currentXtremeGameObject;
                    returnObject = currentXtremeGameObject;
                }
                else {
                    GetCurrentLeagueData(function (gameObject) {
                        returnObject = gameObject
                    });
                }
                if (callback != null) {
                    callback(returnObject);
                }
                else {
                    return returnObject;
                }
            }
            function RenderCurrentLeagueEditorForm(gameObject, callback) {
                if (gameObject == null) {
                    gameObject = currentXtremeGameObject;
                }

                let divisionCount = gameObject.LeagueDivisions.length || 1;

                let divisionCountNoPlayoffs = gameObject.LeagueDivisions.filter(d => d.IsPlayoffs == false).length || 1;
                if (divisionCount < 1) {
                    divisionCount = 1;
                }

                $("#xtremeEditorTheme", element).val(gameObject.AGameThemeId);
                $("#xtremeEditorStartDate", element).val(new Date(gameObject.StartDate).toLocaleDateString());
                $("#xtremeEditorRosterVisibleDate", element).val(new Date(gameObject.RosterVisibleDate).toLocaleDateString());
                $("#xtremeEditorWeeksToRun", element).val(gameObject.NumberOfWeeks);
                $("#xtremeEditorDivisionCountExcludePlayoffs", element).val(divisionCountNoPlayoffs);
                $("#xtremeEditorDivisionsInLeague", element).val(divisionCount);
                if (gameObject.PlayoffStartDate != null) {
                    $("#xtremeEditorPlayoffStartDate", element).val(new Date(gameObject.PlayoffStartDate).toLocaleDateString());
                }

                $("#xtremeEditorHasPlayoffs", element).prop("checked", gameObject.HasPlayoffs);
                $("#xtremeEditorHasPreseason", element).prop("checked", (gameObject.HasPreseason || (gameObject.LeagueSchedule?.filter(w => w.WeekType == "T").length > 0)));
                $("#xtremeEditorMaxOwnerCount", element).val(gameObject.MaxOwnerCount || 0);
                let draftDate = AddDaysToDate(gameObject.StartDate, -3);
                if (gameObject.DraftDate != null) {
                    draftDate = gameObject.DraftDate;
                }
                $("#xtremeEditorDraftDate", element).val(new Date(draftDate).toLocaleDateString());
                $("#xtremeEditorPlayerDraftCount", element).val(gameObject.DraftedPlayerCount || 0);
                $("#xtremeEditorOveragePlayerCount", element).val(gameObject.ExtraPlayerCount || 0);

                $("#xtremeEditorTheme", element).change();

                possibleDivisions = gameObject.LeagueDivisions;

                ShowEditorStep("divisions");
                ShowEditorStep("owners");
                ShowEditorStep("default");
                $("#xtremeEditor_InfoIsDirty").val("N"); //set the load to not be dirty.

                $("#xtremeEditorPlayoffTeamCount", element).text(CalculateNumberOfPlayoffTeams(divisionCountNoPlayoffs, ($("#leagueEditorPlayoffTeamsPerDivision", element).val() || 1)));

                if (callback != null) {
                    callback();
                }
            }
            function CalculateNumberOfPlayoffTeams(divisionCount, teamsAllowedInPlayoffsPerDivision) {
                if (currentXtremeGameObject != null && currentXtremeGameObject.HasPlayoffs == true) {
                    let currentGameDivisionCount = currentXtremeGameObject.LeagueDivisions.filter(d => d.IsPlayoffs == false).length || 1;
                    if (divisionCount != currentGameDivisionCount) {
                        divisionCount = currentGameDivisionCount;
                    }
                }
                let calculatedValue = divisionCount * teamsAllowedInPlayoffsPerDivision;
                return calculatedValue;
            }
            function CalculatePlayoffStartDate(leagueStartDate, numberOfWeeks) {
                let daysToAdd = (numberOfWeeks * 7);
                let playoffStartDate = AddDaysToDate(leagueStartDate, daysToAdd);

                return playoffStartDate;
            }
            function CollectLeagueDataToSave() {

                if (currentXtremeGameObject == null) {
                    currentXtremeGameObject = new Object();
                    currentXtremeGameObject.Id = $("#xtremeEditor_LeagueId", element).val();
                    currentXtremeGameObject.ClientId = -1;
                    currentXtremeGameObject.AGameThemeId = parseInt($("#xtremeEditorTheme", element).val());
                    currentXtremeGameObject.NumberOfWeeks = parseInt($("#xtremeEditorWeeksToRun", element).val());
                    currentXtremeGameObject.StartDate = new Date($("#xtremeEditorStartDate", element).val());
                    currentXtremeGameObject.RosterVisibleDate = new Date($("#xtremeEditorRosterVisibleDate", element).val());
                    currentXtremeGameObject.IsActive = true;
                    currentXtremeGameObject.HasPlayoffs = $("#xtremeEditorHasPlayoffs", element).is(":checked");
                    currentXtremeGameObject.PlayoffStartDate = new Date($("#xtremeEditorPlayoffStartDate", element).val());
                    currentXtremeGameObject.HasPlayoffLimit = true;
                    currentXtremeGameObject.NumberOfTeamsInPlayoffs = 0; //parseInt($("#leagueEditorPlayoffTeamCount", element).val());
                    currentXtremeGameObject.LeagueDivisions = GetDivisionsData();
                    currentXtremeGameObject.AssignedPositions = [];
                    currentXtremeGameObject.HasPreseason = false;
                    currentXtremeGameObject.IsExtremeLeague = true;
                    currentXtremeGameObject.LeagueSchedule = [];
                    currentXtremeGameObject.PlayoffSchedule = [];
                    currentXtremeGameObject.Status = "A";
                    currentXtremeGameObject.MaxOwnerCount = parseInt($("#xtremeEditorMaxOwnerCount", element).val());
                    currentXtremeGameObject.OwnersList = GetOwnersData();
                    currentXtremeGameObject.DraftDate = new Date($("#xtremeEditorDraftDate", element).val());
                    currentXtremeGameObject.DraftedPlayerCount = parseInt($("#xtremeEditorPlayerDraftCount", element).val());
                    currentXtremeGameObject.ExtraPlayerCount = parseInt($("#xtremeEditorOveragePlayerCount", element).val());

                    currentXtremeGameObject.EntBy = legacyContainer.scope.TP1Username;
                    currentXtremeGameObject.EntDt = new Date();
                }

                return currentXtremeGameObject;
            }
            function GetDivisionsData() {
                let returnArray = [];
                $("input[id^='divisionName_']", element).each(function () {
                    let id = this.id;
                    let divisionId = id.split("_")[1];
                    let currentDivision = currentXtremeGameObject?.LeagueDivisions?.find(d => d.DivisionId == divisionId);
                    let divisionData = new Object();
                    if (currentDivision == null) {
                        divisionData = new Object();
                        divisionData.DivisionId = divisionId;
                        divisionData.ClientId = (currentXtremeGameObject.ClientId || 0); //legacyContainer.scope.client; ???
                        divisionData.TeamIdsAssigned = [];
                        divisionData.Region = "manual";
                        divisionData.EntBy = legacyContainer.scope.TP1Username;
                        divisionData.EntDt = new Date();

                    }
                    else {
                        divisionData = currentDivision;
                    }
                    divisionData.DivisionName = $(this).val();
                    divisionData.MaxNumberOfTeamsInDivision = -1;

                    returnArray.push(divisionData);
                });
                return returnArray;
            }
            function GetOwnersData() {
                let returnArray = [];
                $("select[id^='xtremeOwnerOption_']", element).each(function () {
                    let id = this.id;
                    let positionId = id.split("_")[1];
                    let ownerUserId = $(this).val();
                    let divisionId = $("#xtremeOwnerDivisionOption_" + positionId, element).val();

                    if (ownerUserId != null && ownerUserId != "") {
                        let itemIndex = returnArray.findIndex(i => i.UserId == ownerUserId);
                        if(itemIndex < 0)
                        {
                            let ownerObject = new Object();
                            ownerObject.DivisionId = divisionId;
                            ownerObject.UserId = ownerUserId;
                            ownerObject.PositionId = -positionId;
                            returnArray.push(ownerObject);
                        }
                        else
                        {
                            if(returnArray[itemIndex].DivisionId != divisionId)
                            {
                                returnArray[itemIndex].DivisionId = divisionId;
                                ownerObject.PositionId = -positionId;
                            }
                        }
                    }
                    // if (ownerUserId != null && ownerUserId != "" && divisionId > 0) {
                    //     if (returnArray.findIndex(i => i.UserId == ownerUserId && i.DivisionId == divisionId) < 0) {
                    //         let ownerObject = new Object();
                    //         ownerObject.DivisionId = divisionId;
                    //         ownerObject.UserId = ownerUserId;
                    //         ownerObject.PositionId = -positionId;
                    //         returnArray.push(ownerObject);
                    //     }
                    // }
                });
                return returnArray;
            }
            function ValidateLeagueData(callback) {
                $(".error-information-holder", element).empty();

                var formValid = true;
                let errorMessages = [];
                let themeId = $("#xtremeEditorTheme", element).val();
                let startDate = new Date($("#xtremeEditorStartDate", element).val());
                let ownerCount = parseInt($("#xtremeEditorMaxOwnerCount", element).val());
                let draftDate = $("#xtremeEditorDraftDate", element).val();
                let playersDraftCount = parseInt($("#xtremeEditorPlayerDraftCount", element).val());
                let extraPlayersCount = parseInt($("#xtremeEditorOveragePlayerCoiunt", element).val());
                let divisionCountNoPlayoffs = parseInt($("#xtremeEditorDivisionCountExcludePlayoffs", element).val()) || 0;

                //TODO: Determine what we need to validate for the game.

                if (themeId == null || themeId == "" || themeId == -1) {
                    errorMessages.push({ message: "Theme is Required.", fieldclass: "", fieldid: "xtremeEditorTheme" });
                    formValid = false;
                }
                if (startDate == null || startDate == "") {
                    errorMessages.push({ message: "Start Date is Required.", fieldclass: "", fieldid: "xtremeEditorStartDate" });
                    formValid = false;
                }
                if (divisionCountNoPlayoffs == null || divisionCountNoPlayoffs < 1) {
                    errorMessages.push({ message: "At least 1 division is Required.", fieldclass: "", fieldid: "xtremeEditorDivisionCountExcludePlayoffs" });
                    formValid = false;
                }
                if (ownerCount == null || ownerCount <= 0) {
                    errorMessages.push({ message: "Owner Count is Required.", fieldclass: "", fieldid: "xtremeEditorMaxOwnerCount" });
                    formValid = false;
                }
                if (playersDraftCount == null) {
                    errorMessages.push({ message: "Drafted Player Count is Required.", fieldclass: "", fieldid: "xtremeEditorPlayerDraftCount" });
                    formValid = false;
                }
                else if (playersDraftCount <= 0) {
                    errorMessages.push({ message: "Drafted Player Count must be more than 0.", fieldclass: "", fieldid: "xtremeEditorPlayerDraftCount" });
                    formValid = false;
                }
                if (extraPlayersCount == null) {
                    errorMessages.push({ message: "Extra Players count is Required.", fieldclass: "", fieldid: "xtremeEditorOveragePlayerCount" });
                    formValid = false;
                }
                else if (extraPlayersCount < 0) {
                    errorMessages.push({ message: "Extra Players count must be 0 or higher.", fieldclass: "", fieldid: "xtremeEditorOveragePlayerCount" });
                    formValid = false;
                }
                if (draftDate != null && (new Date(draftDate) > new Date(startDate))) {
                    errorMessages.push({ message: "Draft Date must be before start date of game..", fieldclass: "", fieldid: "xtremeEditorDraftDate" });
                    formValid = false;
                }
                if (formValid) {
                    HideErrorInformation();
                    if (callback != null) {
                        callback();
                    }
                } else {
                    var messageString = "";
                    if (errorMessages.length > 0) {
                        messageString += "<i class=\"fas fa-exclamation-triangle text-red\"></i> <strong>Correct the following errors:</strong> <ul>";
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
                        ShowErrorInformation();
                    }
                }
            }
            function SaveLeagueData(callback) {
                let isDirty = ($("#xtremeEditor_InfoIsDirty", element).val().toUpperCase() == "Y");
                if (isDirty == true) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "flex",
                            cmd: "saveAGameExtremeLeague",
                            leaguedata: JSON.stringify(currentXtremeGameObject)
                        },
                        dataType: "json",
                        cache: false,
                        error: function (response) {
                            a$.ajaxerror(response);
                        },
                        success: function (data) {
                            if (data.errormessage != null && data.errormessage == "true") {
                                a$.jsonerror(data);
                                return;
                            }
                            else {
                                let leagueObject = JSON.parse(data.xtremeLeagueObject);
                                currentXtremeGameObject = leagueObject;
                                if (callback != null) {
                                    callback(leagueObject);
                                }
                            }
                        }
                    });
                }
                else {
                    if (callback != null) {
                        callback();
                    }
                }

            }
            function BuildDivisionOptions(divisionCount, callback) {
                let divisionCounter = defaultNumberOfDivisions;
                if (divisionCount != null) {
                    divisionCounter = Number.parseInt(divisionCount);
                }
                else {
                    if ($("#xtremeEditorDivisionsInLeague", element).val() == null || $("#xtremeEditorDivisionsInLeague", element).val() == "") {
                        divisionCounter = 1;
                    }
                    else {
                        divisionCounter = Number.parseInt($("#xtremeEditorDivisionsInLeague", element).val());
                    }
                }
                if (currentXtremeGameObject != null && currentXtremeGameObject.LeagueDivisions?.length > divisionCounter) {
                    currentXtremeGameObject.LeagueDivisions.length = divisionCounter;
                }

                $("#xtremeDivisionList", element).empty();
                for (let dc = 1; dc <= divisionCounter; dc++) {
                    let divisionItemHolder = $("<div />");
                    let divisionItem = new Object();

                    if (possibleDivisions != null && possibleDivisions[dc - 1] != null) {
                        divisionItem = possibleDivisions[dc - 1];
                    }
                    else {
                        divisionItem = new Object();
                        divisionItem.DivisionId = -dc;
                        divisionItem.ClientId = -1;
                        divisionItem.DivisionName = "Division " + dc + " Name";
                        //divisionItem.TeamIdsAssigned = [];
                        divisionItem.IsPlayoffs = false; //only create regular season divisions.
                        divisionItem.Region = "manual";
                        if (currentXtremeGameObject != null && currentXtremeGameObject.LeagueDivisions?.findIndex(d => d.DivisionId == divisionItem.DivisionId) < 0) {
                            currentXtremeGameObject.LeagueDivisions.push(divisionItem);
                        }
                    }
                    let defaultDivisionLabel = "Division " + dc + " Name";

                    let divisionNameLabel = $("<label>" + defaultDivisionLabel + "</label>");
                    let divisionNameTextbox = $("<input type=\"text\" class=\"agame-league-editor-division-name\" id=\"divisionName_" + divisionItem.DivisionId + "\" />");
                    divisionNameTextbox.val(divisionItem.DivisionName);
                    divisionNameTextbox.off("blur").on("blur", function () {
                        AddDivisionOption(this, function () {
                            MarkInformationDirty();
                        });
                    });

                    divisionItemHolder.append(divisionNameLabel);
                    divisionItemHolder.append(divisionNameTextbox);
                    divisionItemHolder.append("<br />");

                    $("#xtremeDivisionList", element).append(divisionItemHolder);
                }

                if (callback != null) {
                    callback();
                }
            }
            function AddDivisionOption(item, callback) {
                let divisionName = $(item).val();
                let indexValue = item.id?.split("_")[1] || 0;
                indexValue = Math.abs(indexValue); //handle "new" divisions
                let divisionIdValue = item.id?.split("_")[1];
                indexValue = parseInt(indexValue) - 1;
                let divisionIndex = possibleDivisions.findIndex(x => x.DivisionName == divisionName);
                if (divisionIndex < 0) {
                    if (possibleDivisions.length > indexValue) {
                        possibleDivisions[indexValue].DivisionName = divisionName;
                        divisionIdValue = possibleDivisions[indexValue].DivisionId;
                    }
                    else {
                        let divisionObject = new Object();
                        divisionObject.DivisionId = possibleDivisions.length;
                        divisionObject.ClientId = -1;
                        divisionObject.DivisionName = divisionName;
                        divisionObject.TeamIdsAssigned = [];
                        divisionObject.Region = "manual";
                        //TODO: Load teams assigned to division here?
                        divisionObject.EntBy = legacyContainer.scope.TP1Username;
                        divisionObject.EntDt = new Date();
                        possibleDivisions.push(divisionObject);
                        divisionIdValue = divisionObject.DivisionId;
                    }
                }

                let gameDivisionIndex = currentXtremeGameObject?.LeagueDivisions?.findIndex(x => x.DivisionId == divisionIdValue);
                if (gameDivisionIndex > -1) {
                    currentXtremeGameObject.LeagueDivisions[gameDivisionIndex].DivisionName = divisionName;
                }
                if (callback != null) {
                    callback();
                }
            }
            function BuildOwnerOptions(ownerList, callback) {
                if (ownerList == null) {
                    ownerList = currentXtremeGameObject.OwnersList;
                }
                $("#xtremeOwnerList", element).empty();

                let ownerListHeaderHolder = $("<div class=\"xtreme-game-owner-list-header-holder\" />");
                let ownerRowHeaderHolder = $("<div class=\"xtreme-game-owner-row-holder header-item\" />");

                let positionHeaderItem = $("<div class=\"header-item inline-item league-position\" />");
                positionHeaderItem.append("&nbsp;");
                let ownerHeaderItem = $("<div class=\"header-item inline-item league-owner\" />");
                ownerHeaderItem.append("Owner");
                let divisionHeaderItem = $("<div class=\"header-item inline-item league-division\" />");
                divisionHeaderItem.append("Division");

                ownerRowHeaderHolder.append(positionHeaderItem);
                ownerRowHeaderHolder.append(ownerHeaderItem);
                ownerRowHeaderHolder.append(divisionHeaderItem);

                ownerListHeaderHolder.append(ownerRowHeaderHolder);
                $("#xtremeOwnerList", element).append(ownerListHeaderHolder);

                let ownerListHolder = $("<div class=\"xtreme-game-owner-list-holder\" />");

                let maxOwnerCount = currentXtremeGameObject.MaxOwnerCount;
                let currentSetOwnerCount = parseInt($("#xtremeEditorMaxOwnerCount", element).val());

                if (maxOwnerCount != currentSetOwnerCount) {
                    maxOwnerCount = currentSetOwnerCount;
                }
                if (possibleOwners.length == 0) {
                    LoadPossibleOwners(false);
                }
                for (let oIndex = 1; oIndex <= maxOwnerCount; oIndex++) {
                    let ownerRowHolder = $("<div class=\"xtreme-game-owner-row-holder\" />");
                    RenderOwnerOptionRow(oIndex, ownerRowHolder);

                    ownerListHolder.append(ownerRowHolder);
                }
                $("#xtremeOwnerList", element).append(ownerListHolder);
                SetCurrentOwnersAndDivisions();
                CalculateExtremeDivisionAssignmentCounts();

                if (callback != null) {
                    callback();
                }
            }
            function RenderOwnerOptionRow(rowCount, objectToRenderTo) {
                let positionInputHolder = $("<div class=\"inline-item league-position\" />");
                let ownerInputHolder = $("<div class=\"inline-item league-owner\" />");
                let divisionInputHolder = $("<div class=\"inline-item league-division\" />");

                let positionOptionLabel = $("<label id=\"xtremeOwnerOptionPosition_\">" + rowCount + "</label>");
                let ownerSelectOption = $("<select id=\"xtremeOwnerOption_" + rowCount + "\"></select>");
                ownerSelectOption.on("change", function () {
                    MarkInformationDirty();
                    SaveOwnerStep();
                    RenderDivisionsListsForOwnerPanel(function () {
                        CalculateExtremeDivisionAssignmentCounts();
                    });

                });

                ownerSelectOption.append($("<option />", { text: "Select Owner", value: "" }));

                for (let uIndex = 0; uIndex < possibleOwners.length; uIndex++) {
                    let userObject = possibleOwners[uIndex];
                    ownerSelectOption.append($("<option />", { text: userObject.UserFullName, value: userObject.UserId }));
                }


                let divisionSelectOption = $("<select id=\"xtremeOwnerDivisionOption_" + rowCount + "\"></select>");
                divisionSelectOption.on("change", function () {
                    MarkInformationDirty();
                    SaveOwnerStep();
                    RenderDivisionsListsForOwnerPanel(function () {
                        CalculateExtremeDivisionAssignmentCounts();
                    });
                });

                divisionSelectOption.append($("<option />", { text: "Select Division", value: -1 }));
                for (let dIndex = 0; dIndex < currentXtremeGameObject.LeagueDivisions?.length; dIndex++) {
                    let divisionItem = currentXtremeGameObject.LeagueDivisions[dIndex];
                    divisionSelectOption.append($("<option />", { text: divisionItem.DivisionName, value: divisionItem.DivisionId }));
                }

                let maxDivisionCount = parseInt($("#xtremeEditorDivisionCountExcludePlayoffs", element).val()) || 1;
                if (maxDivisionCount == 1) {
                    $(divisionSelectOption).val(currentXtremeGameObject.LeagueDivisions[0].DivisionId);
                }
                positionInputHolder.append(positionOptionLabel);
                ownerInputHolder.append(ownerSelectOption);
                divisionInputHolder.append(divisionSelectOption);

                $(objectToRenderTo).append(positionInputHolder);
                $(objectToRenderTo).append(ownerInputHolder);
                $(objectToRenderTo).append(divisionInputHolder);
            }
            function SetCurrentOwnersAndDivisions() {
                let maxOwnersCount = parseInt($("#xtremeEditorMaxOwnerCount", element).val());
                let ownerCount = 1;
                currentXtremeGameObject.OwnersList.forEach(function(ownerItem){
                    if(ownerItem.UserId != null && ownerItem.UserId != "" && ownerCount <= maxOwnersCount){
                        $("#xtremeOwnerOption_" + ownerCount, element).val(ownerItem.UserId);
                        $("#xtremeOwnerDivisionOption_" + ownerCount, element).val(ownerItem.DivisionId);
                        ownerCount++;
                    }
                });
            }
            function RenderDivisionsListsForOwnerPanel(callback) {
                $("#currentDivisionAssignments", element).empty();
                $(".agame-league-editor-division-name", element).each(function () {
                    let id = $(this)[0].id;
                    let divisionId = id.split("_")[1];
                    let divisionAssignmentHolder = $("<div class=\"agame-divisions-team-header-holder\" />");
                    let divisionNameHolder = $("<span class=\"assigned-division-name-holder\" />");
                    divisionNameHolder.append($(this).val() + "&nbsp;&nbsp;");

                    let divisionNameCountHolder = $("<span class=\"assigned-division-count-holder\" />");
                    divisionNameCountHolder.attr("id", id);

                    let divisionCurrentOwnerHolder = $("<div class=\"agame-divisions-current-teams-holder\" />");
                    divisionCurrentOwnerHolder.attr("id", "divisionOwnersHolder_" + divisionId);
                    RenderOwnersInDivision(divisionId, divisionCurrentOwnerHolder);

                    divisionNameCountHolder.append(0);

                    divisionAssignmentHolder.append(divisionNameHolder);
                    divisionAssignmentHolder.append(divisionNameCountHolder);
                    divisionAssignmentHolder.append(divisionCurrentOwnerHolder);
                    $("#currentDivisionAssignments", element).append(divisionAssignmentHolder);
                });
                if (callback != null) {
                    callback();
                }
                return null;
            }
            function RenderOwnersInDivision(divisionIdToRender, objectToRenderTo) {
                let ownerData = GetOwnersData();
                let divisionOwnerRow = $("<div class=\"division-assigned-owner-row\" />");
                let divisionOwners = ownerData.filter(i => i.DivisionId == divisionIdToRender) || [];

                for (let oc = 0; oc < divisionOwners.length; oc++) {
                    let ownerItem = divisionOwners[oc];
                    let ownerName = ownerItem.UserId;
                    let ownerObject = possibleOwners.find(u => u.UserId == ownerItem.UserId);
                    if (ownerObject != null) {
                        ownerName = ownerObject.UserFullName;
                    }
                    let ownerNameHolder = $("<div class=\"divisiont-assigned-team-name\" />");
                    ownerNameHolder.append(ownerName);

                    divisionOwnerRow.append(ownerNameHolder);
                }
                $(objectToRenderTo, element).append(divisionOwnerRow);
            }

            function CalculateExtremeDivisionAssignmentCounts(callback) {
                let ownerData = GetOwnersData();
                $("span[id^='divisionName_']", element).each(function () {
                    let id = this.id;
                    let divisionId = id.split("_")[1];
                    let count = ownerData.filter(x => x.DivisionId == divisionId)?.length || 0;
                    $(this).empty();
                    $(this).append(count);
                });
                if (callback != null) {
                    callback();
                }
            }
            function HandleThemeChange(selectedValue, callback) {
                $("#xtremeAdminEditorBackground", element).removeClass();
                let currentSelectedTheme = possibleThemes.find(i => i.Id == selectedValue);
                $("#xtremeEditorThemeImageHolder", element).attr("src", null);
                let defaultImage = a$.debugPrefix() + "/3/ng/AgameFlex/images/game-bg-default.jpg";
                let backgroundImage = a$.debugPrefix() + "/3/ng/AgameFlex/images/game-bg-default.jpg";
                let ignoreGameAssignments = false;
                let imageToShow = defaultImage;

                if (currentSelectedTheme != null) {

                    ignoreGameAssignments = (currentSelectedTheme.AGameThemeId != currentXtremeGameObject?.AGameThemeId);
                    imageToShow = currentSelectedTheme.ThemeImage || currentSelectedTheme.ThemeBackgroundImage || defaultImage;
                    backgroundImage = currentSelectedTheme.ThemeBackgroundImage || defaultImage;
                    $("#xtremeAdminEditorBackground", element).addClass(currentSelectedTheme.ThemeTag + "-full-background");
                }
                else {
                    $("#xtremeEditorThemeImageHolder", element).attr("height", 0);
                    $("#xtremeEditorThemeImageHolder", element).attr("width", 0);
                }

                $("#xtremeEditorThemeImageHolder", element).attr("src", imageToShow);
                $("#currentXtremeGameHolder", element).css("background-image", "url('" + backgroundImage + "')");

                GetPossiblePositionsForTheme(selectedValue, ignoreGameAssignments, function (positionList) {
                    RenderPossiblePositions(positionList);
                });

                if (callback != null) {
                    callback();
                }
            }
            function RenderThemeOptions(callback) {
                if (possibleThemes != null && possibleThemes.length > 0) {
                    $("#xtremeEditorTheme", element).empty();
                    $("#xtremeEditorTheme", element).append($("<option />", { value: "", text: "Select Theme" }));

                    for (let tc = 0; tc < possibleThemes.length; tc++) {
                        let theme = possibleThemes[tc];
                        let themeOption = $("<option />", { value: theme.Id, text: theme.Name });
                        $("#xtremeEditorTheme", element).append(themeOption);
                    }
                }
                if (callback != null) {
                    callback();
                }
            }
            function GetPossiblePositionsForTheme(themeId, ignoreGameAssignments, callback) {
                if (themeId == null || themeId <= 0 || themeId == "") {
                    themeId = $("#xtremeEditorTheme", element).val();
                }
                if (ignoreGameAssignments == false && currentXtremeGameObject != null && currentXtremeGameObject.AssignedPositions != null && currentXtremeGameObject.AssignedPositions.length > 0) {
                    if (callback != null) {
                        callback(currentXtremeGameObject.AssignedPositions);
                    }
                }
                else if (possiblePositions != null && possiblePositions.length > 0 && possiblePositions.filter(tid => tid.ThemeId == themeId).length > 0) {
                    possiblePositionsFiltered = possiblePositions.filter(tid => tid.ThemeId == themeId);
                    if (callback != null) {
                        callback(possiblePositionsFiltered);
                    }
                }
                else {
                    if (themeId == null || themeId == "") {
                        themeId = 0;
                    }
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "flex",
                            cmd: "getAllAGameDefaultPositionsByTheme",
                            themeid: themeId
                        },
                        dataType: "json",
                        cache: false,
                        error: function (response) {
                            a$.ajaxerror(response);
                        },
                        success: function (data) {
                            if (data.errormessge != null && data.errormessage == "true") {
                                a$.jsonerror(data);
                                return;
                            }
                            else {
                                let defaultPositionList = $.parseJSON(data.defaultPositionsList);
                                possiblePositions.length = 0;
                                possiblePositions = defaultPositionList;
                                if (currentXtremeGameObject != null && currentXtremeGameObject.AssignedPositions != null) {
                                    currentXtremeGameObject.AssignedPositions.length = 0;
                                }
                                if (callback != null) {
                                    callback(defaultPositionList);
                                }
                            }
                        }
                    });
                }
            }
            function RenderPossiblePositions(listToRender, callback) {
                $("#xTremeLeaguePositionsList", element).empty();
                let positionListHolder = $("<div />");
                if (listToRender != null && listToRender.length > 0) {
                    for (let pc = 0; pc < listToRender.length; pc++) {
                        let positionItem = listToRender[pc];
                        let itemId = positionItem.AssignedPositionId || -(pc + 1);
                        let defaultPositionId = positionItem.PositionId || 0;

                        let positionRowItem = $("<div class=\"agame-theme-position-list-row\" />");
                        let positionNameHolder = $("<div class=\"agame-theme-position-inline-item position-name\" />");
                        let positionNameInput = $("<input id=\"positionName_" + itemId + "\" themeDefaultPositionId=\"" + defaultPositionId + "\" />");
                        positionNameInput.on("change", function () {
                            MarkInformationDirty();
                        });
                        positionNameInput.val(positionItem.PositionName);

                        let positionQuantityHolder = $("<div class=\"agame-theme-position-inline-item position-quantity\" />");
                        let positionQuantityInput = $("<input id=\"positionQuantity_" + itemId + "\" themeDefaultPositionId=\"" + defaultPositionId + "\" />");
                        positionQuantityInput.on("change", function () {
                            MarkInformationDirty();
                        });
                        positionQuantityInput.val(positionItem.Quantity);
                        let positionMultiplierHolder = $("<div class=\"agame-theme-position-inline-item position-multiplier\" />");
                        let positionMultiplierInput = $("<input id=\"positionMultiplier_" + itemId + "\" themeDefaultPositionId=\"" + defaultPositionId + "\" />");
                        positionMultiplierInput.on("change", function () {
                            MarkInformationDirty();
                        });
                        positionMultiplierInput.val(positionItem.Multiplier);

                        let positionButtonHolder = $("<div class=\"agame-theme-position-inline-item position-button\" />");
                        if (itemId < 0) {
                            let removeButton = $("<button class=\"btn-delete\" id=\"btnRemoveNewPosition_" + itemId + "\" />");
                            removeButton.append("<i class=\"fa fa-trash\" />");
                            positionButtonHolder.append(removeButton);
                        }
                        else {
                            positionButtonHolder.append("&nbsp;");
                        }

                        positionNameHolder.append(positionNameInput);

                        positionQuantityHolder.append(positionQuantityInput);

                        positionMultiplierHolder.append(positionMultiplierInput);

                        positionRowItem.append(positionNameHolder);
                        positionRowItem.append(positionQuantityHolder);
                        positionRowItem.append(positionMultiplierHolder);
                        positionRowItem.append(positionButtonHolder);

                        positionListHolder.append(positionRowItem);
                    }
                }
                else {
                    positionListHolder.append("No positions found for the theme.");
                }

                $("#xTremeLeaguePositionsList", element).append(positionListHolder);
                if (callback != null) {
                    callback();
                }
            }
            function AddPositionToGame(callback) {
                SavePositionsStep();

                let positionObject = new Object();
                positionObject.AssignedPositionId = -99999;
                positionObject.AGameLeagueID = -1;
                positionObject.ThemeDefaultPositionId = -1;
                positionObject.PositionName = $("#addPositionToGame", element).val();
                positionObject.Quantity = parseInt($("#addQuantityToGame", element).val());
                positionObject.Multiplier = parseInt($("#addMultiplierToGame", element).val());

                if (currentXtremeGameObject != null && currentXtremeGameObject.AssignedPositions != null) {
                    currentXtremeGameObject.AssignedPositions.push(positionObject);
                }
                ClearAddPositionOptions();
                if (callback != null) {
                    callback()
                }
            }
            function ResetCurrentGamePositionsToThemeDefaults() {
                currentXtremeGameObject.AssignedPositions.length = 0;
                MarkInformationDirty();
                GetPossiblePositionsForTheme(null, true, function (positionList) {
                    RenderPossiblePositions(positionList);
                });
            }
            function ClearAddPositionOptions() {
                $("#addPositionToGame", element).val("");
                $("#addQuantityToGame", element).val("");
                $("#addMultiplierToGame", element).val("");
            }
            function SaveEditorStep(stepToSave, callback) {
                currentXtremeGameObject = CollectLeagueDataToSave();

                switch (stepToSave) {
                    case "basic":
                        SaveBasicStep();
                        break;
                    case "divisions":
                        SaveDivisionStep();
                        break;
                    case "owners":
                        SaveOwnerStep();
                        break;
                    case "positions":
                        SavePositionsStep();
                        break;
                }
                if (callback != null) {
                    callback();
                }
                else {
                    return null;
                }
            }
            function SaveBasicStep() {
                if (currentXtremeGameObject == null) {
                    currentXtremeGameObject = new Object();
                }
                let teamsPerDivision = $("#xtremeEditorPlayoffTeamsPerDivision", element).val();

                let divisionCount = $("#xtremeEditorDivisionsInLeague", element).val();
                if (teamsPerDivision == null || teamsPerDivision == "") {
                    teamsPerDivision = 1;
                }
                if (divisionCount == null || divisionCount == "") {
                    divisionCount = defaultNumberOfDivisions;
                }
                currentXtremeGameObject.AGameThemeId = parseInt($("#xtremeEditorTheme", element).val());
                currentXtremeGameObject.NumberOfWeeks = parseInt($("#xtremeEditorWeeksToRun", element).val());
                currentXtremeGameObject.StartDate = new Date($("#xtremeEditorStartDate", element).val());
                currentXtremeGameObject.RosterVisibleDate = new Date($("#xtremeEditorRosterVisibleDate", element).val());
                currentXtremeGameObject.IsActive = true;
                currentXtremeGameObject.HasPlayoffs = $("#xtremeEditorHasPlayoffs", element).is(":checked");
                currentXtremeGameObject.PlayoffStartDate = new Date($("#xtremeEditorPlayoffStartDate", element).val());
                currentXtremeGameObject.HasPlayoffLimit = true;
                currentXtremeGameObject.NumberOfTeamsInPlayoffs = CalculateNumberOfPlayoffTeams(divisionCount, parseInt(teamsPerDivision));
                currentXtremeGameObject.IsExtremeLeague = true;
                currentXtremeGameObject.MaxOwnerCount = parseInt($("#xtremeEditorMaxOwnerCount", element).val());
                currentXtremeGameObject.DraftDate = new Date($("#xtremeEditorDraftDate", element).val()).toLocaleDateString();
                currentXtremeGameObject.DraftedPlayerCount = parseInt($("#xtremeEditorPlayerDraftCount", element).val() || 0);
                currentXtremeGameObject.ExtraPlayerCount = parseInt($("#xtremeEditorOveragePlayerCount", element).val() || 0);
            }
            function SaveDivisionStep(callback) {
                currentXtremeGameObject.LeagueDivisions = GetDivisionsData();
            }
            function SaveOwnerStep(callback) {
                currentXtremeGameObject.OwnersList = GetOwnersData();
            }
            function SavePositionsStep() {
                if (currentXtremeGameObject != null) {
                    currentXtremeGameObject.AssignedPositions.length = 0;

                    $("input[id^='positionName_']", element).each(function () {
                        let id = this.id;
                        let positionId = id.split("_")[1];
                        let defaultPositionId = $(this).attr("themedefaultpositionid");
                        let defaultPosition = possiblePositions.find(p => p.Id == defaultPositionId);
                        let nameValue = $(this).val();
                        let positionQuantity = parseInt($("#positionQuantity_" + positionId, element).val());
                        let positionMultiplier = parseInt($("#positionMultiplier_" + positionId, element).val());

                        let positionObject = new Object();

                        positionObject.AssignedPositionId = positionId;
                        positionObject.AGameLeagueId = -1;
                        positionObject.ThemeDefaultPositionId = defaultPositionId;
                        positionObject.PositionName = nameValue;
                        positionObject.Quantity = positionQuantity;
                        positionObject.GameQuantity = positionQuantity;
                        positionObject.Multiplier = positionMultiplier;
                        positionObject.GameMultiplier = positionMultiplier;
                        if (defaultPosition != null) {
                            positionObject.PositionRole = (defaultPosition.PositionRole || "CSR");
                        }

                        currentXtremeGameObject.AssignedPositions.push(positionObject);
                    });
                }
            }
            function ClearForm(callback) {
                if (callback != null) {
                    callback();
                }
            }
            function AddDaysToDate(dateToUse, daysToAdd) {
                let returnDate = null;
                if (daysToAdd == null) {
                    daysToAdd = 30;
                }
                else {
                    daysToAdd = Number.parseInt(daysToAdd);
                }
                let date = new Date(new Date().valueOf());
                if (dateToUse != null) {
                    date = new Date(new Date(dateToUse).valueOf());
                }
                date.setDate(date.getDate() + daysToAdd);
                returnDate = new Date(date);
                return returnDate;
            }
            function DetermineDefaultThemeId(defaultDateToCheck) {
                let fullYear = new Date().getFullYear();
                let internalDate = today;

                if (defaultDateToCheck != null) {
                    tempDate = new Date(defaultDateToCheck);
                    let dateBreakdownDay = tempDate.getDay() + 1;
                    let dateBreakdownMonth = tempDate.getMonth() + 1;
                    let fullDateString = dateBreakdownMonth + "/" + dateBreakdownDay + "/" + fullYear;
                    internalDate = new Date(fullDateString)
                }
                if (new Date("1/1/" + fullYear) <= internalDate && internalDate < new Date("3/1/" + fullYear)) {
                    return 8;
                }
                else if (new Date("3/1/" + fullYear) <= internalDate && internalDate < new Date("4/1/" + fullYear)) {
                    return 2;
                }
                else if (new Date("4/1/" + fullYear) <= internalDate && internalDate < new Date("6/1/" + fullYear)) {
                    return 3;
                }
                else if (new Date("6/1/" + fullYear) <= internalDate && internalDate < new Date("9/1/" + fullYear)) {
                    return 6;
                }
                else if (new Date("9/1/" + fullYear) <= internalDate && internalDate < new Date("11/1/" + fullYear)) {
                    return 1;
                }
                else if (new Date("11/1/" + fullYear) <= internalDate && internalDate < new Date("1/1/" + fullYear + 1)) {
                    return 7;
                }
                else {
                    return 5;
                }

            }
            function GenerateGameDaysForLeague(callback) {
                MarkInformationDirty();
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "generateGameDaysForGame",
                        leaguedata: JSON.stringify(currentXtremeGameObject)
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage == "true") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            let leagueObject = JSON.parse(data.leagueObject);
                            currentXtremeGameObject = leagueObject;
                            HideWorkingIndicator();
                            if (callback != null) {
                                callback(leagueObject);
                            }
                        }
                    }
                });
            }
            function GenerateScheduleForLeague(callback) {
                MarkInformationDirty();
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "generateScheduleForGame",
                        leaguedata: JSON.stringify(currentXtremeGameObject)
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage == "true") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            let leagueObject = JSON.parse(data.leagueObject);
                            currentXtremeGameObject = leagueObject;
                            HideWorkingIndicator();
                            if (callback != null) {
                                callback(leagueObject);
                            }
                        }
                    }
                });
            }
            function RenderScheduleForDivision(gameObject, divisionId, callback) {
                let divisionList = [];
                if (divisionId == null) {
                    divisionList = gameObject.LeagueDivisions;
                }
                else {
                    divisionList = gameObject.LeagueDivisions.filter(d => d.DivisionId == divisionId);
                }
                if (divisionList != null) {
                    for (let dc = 0; dc < divisionList.length; dc++) {
                        let currentDivisionItem = divisionList[dc];
                        let currentDivisionId = currentDivisionItem.DivisionId;
                        $("#currentDivisionScheduleHolder_" + currentDivisionId, element).empty();
                        let currentDivisionSchedule = $("<div />");
                        let currentDivisionScheduleTabHolder = $("<div />")
                        let currentDivisionWeekScheduleHolder = $("<div />");

                        //TODO: COllapse the rendering into a single function/method
                        if (currentDivisionItem.IsPlayoffs == true) {
                            for (let wc = 1; wc <= gameObject.PlayoffSchedule.length; wc++) {
                                let weekTab = $("<div class=\"agame-schedule-week-tab tabs\" id=\"scheduleTabWeek_" + currentDivisionId + "_" + wc + "\" />");
                                weekTab.append(wc);
                                weekTab.on("click", function () {
                                    let id = this.id;
                                    let divisionId = id.split("_")[1];
                                    let weekId = id.split("_")[2];
                                    ShowScheduleWeek(weekId, divisionId);
                                });

                                currentDivisionScheduleTabHolder.append(weekTab);
                                let weekMatchupHolder = $("<div id=\"scheduleTabWeekMatchup_" + currentDivisionId + "_" + wc + "\" />");
                                let currentWeekSchedule = currentDivisionItem.GameSchedule?.filter(s => s.WeekNumber == wc);
                                if (currentWeekSchedule != null && currentWeekSchedule.length > 0) {
                                    let weekScheduleItem = gameObject.PlayoffSchedule.find(ws => ws.WeekNumber == currentWeekSchedule[0].WeekNumber);
                                    if (weekScheduleItem == null) {
                                        weekScheduleItem = gameObject.PlayoffSchedule.find(ws => ws.WeekNumber == wc);
                                    }

                                    let weekDatesHolder = $("<div class=\"agame-schedule-week-dates-holder\"/>");
                                    let weekStartDate = new Date(weekScheduleItem.WeekStartDate).toLocaleDateString();
                                    let weekEndDate = new Date(weekScheduleItem.WeekEndDate).toLocaleDateString();

                                    weekDatesHolder.append("Game Date(s): " + weekStartDate + " - " + weekEndDate);
                                    weekMatchupHolder.append(weekDatesHolder);

                                    for (let sc = 0; sc < currentWeekSchedule.length; sc++) {
                                        let currentWeekScheduleItem = currentWeekSchedule[sc];
                                        let isHomeWinner = true;
                                        let isTiedScore = false;
                                        let guestTeamScore = parseFloat(currentWeekScheduleItem.GuestTeamScore) || 0;
                                        let homeTeamScore = parseFloat(currentWeekScheduleItem.HomeTeamScore) || 0;
                                        isTiedScore = (homeTeamScore == guestTeamScore);
                                        if (isTiedScore == false) {
                                            isHomeWinner = (homeTeamScore > guestTeamScore);
                                        }
                                        guestTeamScore = guestTeamScore.toFixed(2);
                                        homeTeamScore = homeTeamScore.toFixed(2);
                                        let winningScoreItem = $("<span class=\"agame-schedule-week-winner-item\"><span class=\"winner-label\"><i class=\"fa fa-trophy\"></i> Winner!</span>");
                                        let gameScheduleMatchupHolder = $("<div class=\"agame-schedule-game-matchup-holder\" />");

                                        let guestTeamRow = $("<div class=\"agame-schedule-team-row\" />");
                                        let guestTeamNameHolder = $("<div class=\"agame-schedule-team-name-holder\" />");
                                        let guestTeamScoreHolder = $("<div class=\"agame-schedule-team-score-holder\" />");
                                        let guestTeamName = currentWeekScheduleItem.GuestTeamId;
                                        let guestTeam = possibleGameTeams.find(t => t.TeamId == currentWeekScheduleItem.GuestTeamId);
                                        if (guestTeam != null) {
                                            guestTeamName = guestTeam.TeamName;
                                        }
                                        else {
                                            let divisionTeam = possibleGameTeams.find(t => t.ClientTeamId == currentWeekScheduleItem.GuestTeamId);
                                            if (divisionTeam != null) {
                                                guestTeamName = divisionTeam.ClientTeamName;
                                            }
                                        }
                                        guestTeamNameHolder.append(guestTeamName);
                                        guestTeamScoreHolder.append(guestTeamScore);
                                        if (wc < currentGameWeekNumber && isTiedScore == false && isHomeWinner == false) {
                                            guestTeamRow.addClass("winning-team");
                                            guestTeamNameHolder.append(winningScoreItem);
                                        }

                                        guestTeamRow.append(guestTeamNameHolder);
                                        guestTeamRow.append(guestTeamScoreHolder);

                                        let homeTeamRow = $("<div class=\"agame-schedule-team-row\" />");
                                        let homeTeamNameHolder = $("<div class=\"agame-schedule-team-name-holder\" />");
                                        let homeTeamScoreHolder = $("<div  class=\"agame-schedule-team-score-holder\" />");
                                        let homeTeamName = currentWeekScheduleItem.HomeTeamId;
                                        let homeTeam = possibleGameTeams.find(t => t.TeamId == currentWeekScheduleItem.HomeTeamId);
                                        if (homeTeam != null) {
                                            homeTeamName = homeTeam.TeamName;
                                        }
                                        else {
                                            let divisionTeam = possibleGameTeams.find(t => t.ClientTeamId == currentWeekScheduleItem.HomeTeamId);
                                            if (divisionTeam != null) {
                                                homeTeamName = divisionTeam.ClientTeamName;
                                            }
                                        }
                                        homeTeamNameHolder.append(homeTeamName);
                                        homeTeamScoreHolder.append(homeTeamScore);
                                        if (wc < currentGameWeekNumber && isTiedScore == false && isHomeWinner == true) {
                                            homeTeamRow.addClass("winning-team");
                                            homeTeamNameHolder.append(winningScoreItem);
                                        }

                                        homeTeamRow.append(homeTeamNameHolder);
                                        homeTeamRow.append(homeTeamScoreHolder);
                                        gameScheduleMatchupHolder.append(guestTeamRow);
                                        gameScheduleMatchupHolder.append(homeTeamRow);

                                        weekMatchupHolder.append(gameScheduleMatchupHolder);
                                    }
                                }
                                else {
                                    weekMatchupHolder.append("No Schedule Found for the week.");
                                }
                                currentDivisionWeekScheduleHolder.append(weekMatchupHolder);
                            }
                        }
                        else {
                            let preseasonSchedule = gameObject.LeagueSchedule.filter(w => w.WeekType == "T");
                            RenderPreseasonSchedule(gameObject, currentDivisionItem, preseasonSchedule, currentDivisionSchedule, currentDivisionScheduleTabHolder, currentDivisionWeekScheduleHolder);
                            let regularSeasonSchedule = gameObject.LeagueSchedule.filter(w => w.WeekType == "R");
                            RenderRegularSeasonSchedule(gameObject, currentDivisionItem, regularSeasonSchedule, currentDivisionSchedule, currentDivisionScheduleTabHolder, currentDivisionWeekScheduleHolder);
                        }

                        $("#currentDivisionScheduleHolder_" + currentDivisionId, element).append(currentDivisionSchedule);

                    }
                }
                if (callback != null) {
                    callback();
                }
            }
            function RenderPreseasonSchedule(gameObject, currentDivisionItem, listToRender, divisionObjectToRenderTo, tabHolderToRenderTo, weekHolderToRenderTo) {
                let currentDivisionId = currentDivisionItem.DivisionId;

                for (let wc = 1; wc <= listToRender.length; wc++) {
                    let weekTab = $("<div class=\"agame-schedule-week-tab tabs\" id=\"preSeasonScheduleTabWeek_" + currentDivisionId + "_" + wc + "\" />");
                    weekTab.append("PS-" + wc);
                    weekTab.on("click", function () {
                        let id = this.id;
                        let divisionId = id.split("_")[1];
                        let weekId = id.split("_")[2];
                        ShowScheduleWeek(weekId, divisionId, true);
                    });
                    $(tabHolderToRenderTo).append(weekTab);
                    let weekMatchupHolder = $("<div id=\"preSeasonScheduleTabWeekMatchup_" + currentDivisionId + "_" + wc + "\" />");
                    let currentWeekSchedule = currentDivisionItem.GameSchedule?.filter(s => s.WeekNumber == wc && s.WeekType == "T");
                    RenderWeekSchedule(gameObject, "T", wc, currentWeekSchedule, weekMatchupHolder);

                    $(weekHolderToRenderTo).append(weekMatchupHolder);
                }
                $(divisionObjectToRenderTo).append(tabHolderToRenderTo);
                $(divisionObjectToRenderTo).append(weekHolderToRenderTo);
            }
            function RenderRegularSeasonSchedule(gameObject, currentDivisionItem, listToRender, divisionObjectToRenderTo, tabHolderToRenderTo, weekHolderToRenderTo) {
                let currentDivisionId = currentDivisionItem.DivisionId;

                for (let wc = 1; wc <= listToRender.length; wc++) {
                    let weekTab = $("<div class=\"agame-schedule-week-tab tabs\" id=\"scheduleTabWeek_" + currentDivisionId + "_" + wc + "\" />");
                    weekTab.append(wc);
                    weekTab.on("click", function () {
                        let id = this.id;
                        let divisionId = id.split("_")[1];
                        let weekId = id.split("_")[2];
                        ShowScheduleWeek(weekId, divisionId);
                    });
                    $(tabHolderToRenderTo).append(weekTab);
                    let weekMatchupHolder = $("<div id=\"scheduleTabWeekMatchup_" + currentDivisionId + "_" + wc + "\" />");
                    let currentWeekSchedule = currentDivisionItem.GameSchedule?.filter(s => s.WeekNumber == wc && s.WeekType == "R");

                    RenderWeekSchedule(gameObject, "R", wc, currentWeekSchedule, weekMatchupHolder);

                    $(weekHolderToRenderTo).append(weekMatchupHolder);

                }
                $(divisionObjectToRenderTo).append(tabHolderToRenderTo);
                $(divisionObjectToRenderTo).append(weekHolderToRenderTo);
            }
            function RenderWeekSchedule(gameObject, weekType, weekNumber, scheduleList, renderToObject) {
                if (scheduleList != null && scheduleList.length > 0) {
                    let weekScheduleItem = gameObject.LeagueSchedule.find(ws => ws.WeekNumber == scheduleList[0].WeekNumber);
                    if (weekScheduleItem == null) {
                        weekScheduleItem = gameObject.LeagueSchedule.find(ws => ws.WeekNumber == weekNumber && ws.WeekType == weekType);
                    }

                    let weekDatesHolder = $("<div class=\"agame-schedule-week-dates-holder\"/>");
                    let weekStartDate = new Date(weekScheduleItem.WeekStartDate).toLocaleDateString();
                    let weekEndDate = new Date(weekScheduleItem.WeekEndDate).toLocaleDateString();

                    weekDatesHolder.append("Game Date(s): " + weekStartDate + " - " + weekEndDate);
                    $(renderToObject).append(weekDatesHolder);

                    for (let sc = 0; sc < scheduleList.length; sc++) {

                        let currentWeekScheduleItem = scheduleList[sc];
                        let isHomeWinner = true;
                        let isTiedScore = false;

                        let guestTeamScore = parseFloat(currentWeekScheduleItem.GuestTeamScore) || 0;
                        let homeTeamScore = parseFloat(currentWeekScheduleItem.HomeTeamScore) || 0;
                        isTiedScore = (homeTeamScore == guestTeamScore);
                        if (isTiedScore == false) {
                            isHomeWinner = (homeTeamScore > guestTeamScore);
                        }
                        guestTeamScore = guestTeamScore.toFixed(2);
                        homeTeamScore = homeTeamScore.toFixed(2);

                        let winningScoreItem = $("<span class=\"agame-schedule-week-winner-item\"><span class=\"winner-label\"><i class=\"fa fa-trophy\"></i> Winner!</span>");
                        let gameScheduleMatchupHolder = $("<div class=\"agame-schedule-game-matchup-holder\" />");

                        let guestTeamRow = $("<div class=\"agame-schedule-team-row\" />");
                        let guestTeamNameHolder = $("<div class=\"agame-schedule-team-name-holder\" />");
                        let guestTeamScoreHolder = $("<div class=\"agame-schedule-team-score-holder\" />");
                        let guestTeamName = currentWeekScheduleItem.GuestTeamId;
                        let guestTeam = possibleGameTeams.find(t => t.TeamId == currentWeekScheduleItem.GuestTeamId);
                        if (guestTeam != null) {
                            guestTeamName = guestTeam.TeamName;
                        }
                        else {
                            let divisionTeam = possibleGameTeams.find(t => t.ClientTeamId == currentWeekScheduleItem.GuestTeamId);
                            if (divisionTeam != null) {
                                guestTeamName = divisionTeam.ClientTeamName;
                            }
                        }
                        guestTeamNameHolder.append(guestTeamName);
                        guestTeamScoreHolder.append(guestTeamScore);
                        if (weekNumber < currentGameWeekNumber && isTiedScore == false && isHomeWinner == false) {
                            guestTeamRow.addClass("winning-team");
                            guestTeamNameHolder.append(winningScoreItem);
                        }

                        guestTeamRow.append(guestTeamNameHolder);
                        guestTeamRow.append(guestTeamScoreHolder);

                        let homeTeamRow = $("<div class=\"agame-schedule-team-row\" />");
                        let homeTeamNameHolder = $("<div class=\"agame-schedule-team-name-holder\" />");
                        let homeTeamScoreHolder = $("<div  class=\"agame-schedule-team-score-holder\" />");
                        let homeTeamName = currentWeekScheduleItem.HomeTeamId;
                        let homeTeam = possibleGameTeams.find(t => t.TeamId == currentWeekScheduleItem.HomeTeamId);
                        if (homeTeam != null) {
                            homeTeamName = homeTeam.TeamName;
                        }
                        else {
                            let divisionTeam = possibleGameTeams.find(t => t.ClientTeamId == currentWeekScheduleItem.HomeTeamId);
                            if (divisionTeam != null) {
                                homeTeamName = divisionTeam.ClientTeamName;
                            }
                        }
                        homeTeamNameHolder.append(homeTeamName);
                        homeTeamScoreHolder.append(homeTeamScore);
                        if (weekNumber < currentGameWeekNumber && isTiedScore == false && isHomeWinner == true) {
                            homeTeamRow.addClass("winning-team");
                            homeTeamNameHolder.append(winningScoreItem);
                        }

                        homeTeamRow.append(homeTeamNameHolder);
                        homeTeamRow.append(homeTeamScoreHolder);
                        gameScheduleMatchupHolder.append(guestTeamRow);
                        gameScheduleMatchupHolder.append(homeTeamRow);

                        $(renderToObject).append(gameScheduleMatchupHolder);
                    }
                }
                else {
                    $(renderToObject).append("No Schedule Found for the week.");
                }
            }
            function HandleAllScheduleDisplays() {
                $("div[id^='scheduleTabWeekMatchup_']", element).each(function () {
                    let id = this.id;
                    let divisionId = id.split("_")[1];
                    let weekId = id.split("_")[2];
                    HideScheduleWeek(weekId, divisionId);
                });
                $("div[id^='scheduleTabPlayoffWeekMatchup_']", element).each(function () {
                    let id = this.id;
                    let divisionId = id.split("_")[1];
                    let weekId = id.split("_")[2];
                    HidePlayoffScheduleWeek(weekId, divisionId);
                });
            }
            function HandleScheduleDisplay(weekToDisplay, divisionToDisplay) {
                if (weekToDisplay == null) {
                    weekToDisplay = 1;
                }
                HideAllScheduleWeeks();
                ShowScheduleWeek(weekToDisplay, divisionToDisplay, true);
            }
            function GetWeekSetupForGame(forceReload, callback) {
                if (forceReload == null) {
                    forReload = false;
                }
                console.log("GetWeekSetupForGame() NYI");
                if (callback != null) {
                    callback();
                }
            }
            function RenderWeekSetupForGameEditor(listToRender, callback) {
                if (listToRender == null) {
                    if (currentXtremeGameObject != null && currentXtremeGameObject.LeagueSchedule != null) {
                        listToRender = currentXtremeGameObject.LeagueSchedule;
                    }
                    else {
                        listToRender = [];
                    }
                }
                let numberOfWeeksForGame = parseInt($("#xtremeEditorWeeksToRun", element).val());
                let weeksToAddCount = 0;
                if (listToRender.length > numberOfWeeksForGame) {
                    listToRender.length = numberOfWeeksForGame;
                }
                else if (listToRender.length < numberOfWeeksForGame) {
                    if ($("#originalxTremeGameStorage", element).val() != "") {
                        let ogGame = JSON.parse($("#originalxTremeGameStorage", element).val());
                        if (ogGame != null && ogGame.LeagueSchedule != null) {
                            listToRender = ogGame.LeagueSchedule;
                        }
                    }
                    weeksToAddCount = (numberOfWeeksForGame - listToRender.length);
                }
                $("#leagueWeekSetupList", element).empty();
                let weekScheduleEditorHolder = $("<div />");
                if (listToRender != null && listToRender.length > 0) {
                    ShowAddWeekOption();
                    for (let wc = 0; wc < listToRender.length; wc++) {
                        let weekScheduleItem = listToRender[wc];
                        let weekNumber = weekScheduleItem.WeekNumber || (wc + 1);
                        let startDate = new Date(weekScheduleItem.WeekStartDate);
                        let endDate = new Date(weekScheduleItem.WeekEndDate);

                        let scheduleId = weekScheduleItem.ScheduleId || -(wc + 1);
                        let isFinalized = (weekScheduleItem.ScheduleStatus == "F" || new Date(endDate) < new Date(today));
                        let isCurrentWeek = false;
                        let weekScheduleRow = $("<div class=\"agame-schedule-editor-week-row\"/>");
                        let weekScheduleNumberHolder = $("<div class=\"agame-schedule-editor-week-row-item week-number-editor\" />");
                        let weekScheduleNumberInput = $("<input id=\"currentGameWeekNumber_" + scheduleId + "\" />");
                        let weekScheduleStartDateHolder = $("<div class=\"agame-schedule-editor-week-row-item week-start-date-editor\" />");
                        let weekScheduleStartDateInput = $("<input id=\"currentGameWeekStartDate_" + scheduleId + "\" class=\"datepicker popup-editor-datepicker\" />");
                        let weekScheduleEndDateHolder = $("<div class=\"agame-schedule-editor-week-row-item week-end-date-editor\" />");
                        let weekScheduleEndDateInput = $("<input id=\"currentGameWeekEndDate_" + scheduleId + "\" class=\"datepicker popup-editor-datepicker\" />");
                        let weekScheduleButtonHolder = $("<div class=\"agame-schedule-editor-week-row-item schedule-week-button-editor\" />");
                        if (scheduleId < 0) {
                            let removeWeekButton = $("<button id=\"removeWeek_" + scheduleId + "\" />");
                            removeWeekButton.append("<i class=\"fa fa-trash\"></i>");
                            weekScheduleButtonHolder.append(removeWeekButton);
                        }
                        else {
                            weekScheduleButtonHolder.append("&nbsp;");
                        }

                        if (new Date(startDate) <= new Date(today) && new Date(today) <= new Date(endDate)) {
                            isCurrentWeek = true;
                        }

                        if (isFinalized == true) {
                            weekScheduleNumberInput.prop("disabled", true);
                            weekScheduleStartDateInput.prop("disabled", true);
                            weekScheduleEndDateInput.prop("disabled", true);
                        }
                        else if (isCurrentWeek == true) {
                            weekScheduleNumberInput.prop("disabled", true);
                            weekScheduleStartDateInput.prop("disabled", true);
                            weekScheduleEndDateInput.prop("disabled", false);
                            weekScheduleRow.addClass("is-current-week");
                        }

                        weekScheduleNumberInput.val(weekNumber);
                        weekScheduleStartDateInput.val(startDate.toLocaleDateString());
                        weekScheduleEndDateInput.val(endDate.toLocaleDateString());

                        weekScheduleNumberHolder.append(weekScheduleNumberInput);
                        weekScheduleStartDateHolder.append(weekScheduleStartDateInput);
                        weekScheduleEndDateHolder.append(weekScheduleEndDateInput);

                        weekScheduleRow.append(weekScheduleNumberHolder);
                        weekScheduleRow.append(weekScheduleStartDateHolder);
                        weekScheduleRow.append(weekScheduleEndDateHolder);
                        weekScheduleRow.append(weekScheduleButtonHolder);

                        weekScheduleEditorHolder.append(weekScheduleRow);
                    }
                }
                else {
                    HideAddWeekOption();
                    weekScheduleEditorHolder.append("No Weekly schedule set.");
                    weekScheduleEditorHolder.append("<br />");
                    let generateDaysForLeagueButton = $("<button>Generate Schedule Weeks</button>");
                    generateDaysForLeagueButton.on("click", function () {
                        GenerateGameDaysForLeague(function () {
                            RenderWeekSetupForGameEditor(null, callback);
                        });
                    });
                    weekScheduleEditorHolder.append(generateDaysForLeagueButton);
                }

                $("#leagueWeekSetupList", element).append(weekScheduleEditorHolder);
                if (callback != null) {
                    callback();
                }
            }
            function ConfirmLeagueComplete(callback) {
                let gameCompleteDate = AddDaysToDate(today, 90); //Set as way out in the future.
                if (currentXtremeGameObject != null) {
                    if (currentXtremeGameObject.HasPlayoffs == true && (currentXtremeGameObject.PlayoffSchedule?.length || 0) > 0) {
                        let dateArray = currentXtremeGameObject.PlayoffSchedule.sort((a, b) => (new Date(a.WeekEndDate) < new Date(b.WeekEndDate) ? 1 : -1));
                        gameCompleteDate = new Date(dateArray[0].WeekEndDate);

                    }
                    else if ((currentXtremeGameObject.LeagueSchedule?.length || 0) > 0) {
                        let dateArray = currentXtremeGameObject.LeagueSchedule.sort((a, b) => (new Date(a.WeekEndDate) < new Date(b.WeekEndDate) ? 1 : -1));
                        gameCompleteDate = new Date(dateArray[0].WeekEndDate);
                    }
                }
                let isGameFinalized = (new Date(today) > gameCompleteDate);
                let isGameRunning = (new Date(today) > new Date(currentXtremeGameObject.StartDate) && new Date(today) < gameCompleteDate);
                let isGameNotStarted = (new Date(currentXtremeGameObject.StartDate) > new Date(today));

                let confirmMessage = "Are you sure?\nPress OK to continue or CANCEL to leave as is.";
                if (isGameFinalized == true) {
                    confirmMessage = "You are about to complete the current league.\nOnce this is done you will not be able to undo this and all results will be final.\nThis will allow you to create a new league for the future.\n\nPress OK to continue with completion or CANCEL to leave league as it is.";
                }
                if (isGameRunning == true) {
                    confirmMessage = "Your game is currently running; finalizing will cause it to complete as is without any finalized results.\n\nPress OK to continue with finalization or CANCEL to leave league as it is.";
                }
                if (isGameNotStarted == true) {
                    confirmMessage = "You are about to remove the current league setup.\nChoosing to continue will remove all setup and allow you to start over and create a new league.\n\nPress OK to continue or CANCEL to leave league as it is.";
                }

                if (confirm(confirmMessage)) {
                    if (callback != null) {
                        callback();
                    }
                    else {
                        return true;
                    }
                }
            }
            function HandleLeagueComplete(callback) {
                let commandText = "finalizeCurrentLeague";
                if (currentXtremeGameObject.IsExtremeLeague == true) {
                    commandText = "finalizeCurrentExtremeLeague";
                }
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: commandText
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage == "true") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            currentXtremeGameObject = null;
                            if (callback != null) {
                                callback();
                            }
                        }
                    }
                });

            }
            function MarkCurrentWeekTabs(weekToMark) {
                // if (weekToMark < 5000) {
                    // $("[id^='currentDivisionScheduleHolder_']", element).each(function () {
                    //     let id = this.id;
                    //     let divisionId = id.split("_")[1];
                    //     let weekItem = $("#scheduleTabWeek_" + divisionId + "_" + weekToMark, element);
                    //     weekItem.addClass("active");
                    //     $(weekItem).click();
                    // });
                // }
                if(weekToMark > 5000)
                {
                    weekToMark = 1;
                }

                $("[id^='currentDivisionScheduleHolder_']", element).each(function () {
                    let id = this.id;
                    let divisionId = id.split("_")[1];
                    let weekItem = $("#scheduleTabWeek_" + divisionId + "_" + weekToMark, element);
                    weekItem.addClass("active");
                    $(weekItem).click();
                });

            }
            function OpenDraftRoom(callback) {
                if (confirm("You are about to open the draft room.  This will allow individuals to signup as a team owner and allow them to set draft orders.\nAre you sure? \n\nPress OK to allow or CANCEL to leave as it is.")) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "flex",
                            cmd: "openAGameExtremeDraftRooms"
                        },
                        dataType: "json",
                        cache: false,
                        error: function (response) {
                            a$.ajaxerror(response);
                        },
                        success: function (data) {
                            if (data.errormessage != null && data.errormessage == "true") {
                                a$.jsonerror(data);
                                return;
                            }
                            else {
                                let leagueObject = JSON.parse(data.xtremeLeagueObject);
                                currentXtremeGameObject = leagueObject;

                                if (callback != null) {
                                    callback(leagueObject);
                                }
                            }
                        }
                    });
                }
                else {
                    if (callback != null) {
                        callback();
                    }
                }
            }
            function CloseDraftRoom(callback) {
                if (confirm("You are about to close the draft room.  This means that no one else can join or modify their draft order.\nAre you sure?\n\nPress OK to confirm or CANCEL to leave as is.")) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "flex",
                            cmd: "closeAGameExtremeDraftRooms"
                        },
                        dataType: "json",
                        cache: false,
                        error: function (response) {
                            a$.ajaxerror(response);
                        },
                        success: function (data) {
                            if (data.errormessage != null && data.errormessage == "true") {
                                a$.jsonerror(data);
                                return;
                            }
                            else {
                                let leagueObject = JSON.parse(data.xtremeLeagueObject);
                                currentXtremeGameObject = leagueObject;
                                if (callback != null) {
                                    callback(leagueObject);
                                }
                            }
                        }
                    });
                }
                else {
                    if (callback != null) {
                        callback();
                    }
                }
            }
            function GenerateTeamsForOwners(callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "generateTeamsForOwners",
                        xtremeleague: JSON.stringify(currentXtremeGameObject)
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage == "true") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {
                            let leagueObject = JSON.parse(data.xtremeLeagueObject);
                            currentXtremeGameObject = leagueObject;
                            if (callback != null) {
                                callback(leagueObject);
                            }
                        }
                    }
                });
            }

            function GetExtremeTeamById(extremeTeamId) {
                let returnObject = null;
                if (possibleGameTeams != null && possibleGameTeams.length > 0) {
                    returnObject = possibleGameTeams.find(t => t.ClientTeamId == extremeTeamId);
                }
                 if (returnObject == null) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "flex",
                            cmd: "getExtremeTeamById",
                            teamid: extremeTeamId,
                            deepLoad: true
                        },
                        dataType: "json",
                        cache: false,
                        error: function (response) {
                            a$.ajaxerror(response);
                        },
                        success: function (data) {
                            if (data.errormessage != null && data.errormessage == "true") {
                                a$.jsonerror(data);
                                return;
                            }
                            else {
                                let team = $.parseJSON(data.xtremeTeam);
                                if (team != null && team.ClientTeamId > 0) {
                                    returnObject = team;
                                    if (possibleGameTeams?.findIndex(t => t.ClientTeamId == team.ClientTeamId) < 0) {
                                        possibleGameTeams.push(team);
                                    }
                                }
                            }
                        }
                    });
                 }
                return returnObject;
            }
            function ClearCurrentLeagueCache(){
                possibleGameTeams.length = 0;
                possibleDivisions.length = 0;
                currentXtremeGameObject = null;
                originalXtremeGameObject = null;
                possibleGames.length = 0;
                possiblePositions.length = 0;
                possibleOwners.length = 0;
            }
            /*Show/Hide Sections*/
            function HideAll() {
                HideUserMessage();
                HideLeagueDivisionCounterHolder();
                HideXtremeEditorForm();
                HideErrorInformation();
                HideWorkingIndicator();
            }
            function HideAllEditorSteps() {
                $(".editor-step-item-holder", element).each(function () {
                    $(this).removeClass("active-step");
                    $(this).hide();
                });
            }
            function CollapseAllCurrentLeageDivisions(callback) {
                $("[id^='currentDivisionBody_']", element).each(function () {
                    $(this).hide();
                });
                if (callback != null) {
                    callback();
                }
            }
            function ExpandFirstDivision() {
                let firstDivision = $("[id^='currentDivisionBody_']", element)[0];
                if (firstDivision != null) {
                    $(firstDivision).show();
                }
            }
            function ShowEditorStep(stepToShow) {
                HideAllEditorSteps();
                switch (stepToShow.toLowerCase()) {
                    case "divisions":
                        BuildDivisionOptions(null, function () {
                            $("#LeagueDivisionSetupHolder", element).show();
                        });
                        break;
                    case "owners":
                        BuildOwnerOptions(null, function () {
                            SetCurrentOwnersAndDivisions();
                            RenderDivisionsListsForOwnerPanel(function () {
                                CalculateExtremeDivisionAssignmentCounts();
                                $("#LeagueOwnerSetupHolder", element).show();
                            });
                        });
                        break;
                    case "positions":
                        GetPossiblePositionsForTheme(null, false, function (positionList) {
                            RenderPossiblePositions(positionList, function () {
                                $("#LeaguePositionSetupHolder", element).show();
                            });
                        });
                        break;
                    case "weeks":
                        GetWeekSetupForGame(null, function (scheduleList) {
                            RenderWeekSetupForGameEditor(scheduleList, function () {
                                SetDatePickers();
                                $("#LeagueWeekSetupHolder", element).show();
                            });
                        });

                        break;
                    default:
                        $("#LeagueEditorBasicInformationHolder", element).show();
                        break;
                }
                HandleGameInProgressEditor();
                MarkEditorStepActive(stepToShow);
            }
            function MarkEditorStepActive(stepToMark) {
                $(".editor-item-save", element).each(function () {
                    $(this).removeClass("active-step");
                    if ($(this).attr("step").toLowerCase() == stepToMark.toLowerCase()) {
                        $(this).addClass("active-step");
                    }
                });
            }
            function ToggleDivisionDisplay(divisionId) {
                let isCurrentlyVisible = false;
                isCurrentlyVisible = $("#currentDivisionBody_" + divisionId, element).is(":visible");

                if (isCurrentlyVisible == false) {
                    ShowCurrentLeagueDivision(divisionId);
                }
                else {
                    HideCurrentLeagueDivision(divisionId)
                }
            }
            function ShowCurrentLeagueDivision(divisionId) {
                $("#currentDivisionBody_" + divisionId, element).show()
            }
            function HideCurrentLeagueDivision(divisionId) {
                $("#currentDivisionBody_" + divisionId, element).hide()
            }
            function HideXtremeEditorForm() {
                $(".editor-form", element).hide();
            }
            function ShowXtremeEditorForm() {
                HideAllEditorSteps();
                ShowEditorStep($("#currentEditorStep", element).val());
                $(".editor-form", element).show();
            }
            function HideErrorInformation() {
                $(".error-information-holder", element).hide();
            }
            function ShowErrorInformation() {
                $(".error-information-holder", element).show();
            }
            function MarkInformationDirty() {
                if ($("#xtremeEditor_InfoIsDirty", element).val() != "Y") {
                    $("#xtremeEditor_InfoIsDirty", element).val("Y");
                }
            }
            function HideAllScheduleWeeks(divisionId) {
                $("div[id^='scheduleTabWeekMatchup_" + divisionId + "_']", element).each(function () {
                    $(this).hide();
                });
                $("div[id^='preSeasonScheduleTabWeekMatchup_" + divisionId + "_']", element).each(function () {
                    $(this).hide();
                });
                $("div[id^='scheduleTabWeek_" + divisionId + "_']", element).each(function () {
                    $(this).removeClass("active");
                });
                $("div[id^='preSeasonScheduleTabWeek_" + divisionId + "_']", element).each(function () {
                    $(this).removeClass("active");
                });
            }
            function ShowScheduleWeek(weekId, divisionId, isPreseasonWeek) {
                if (isPreseasonWeek == null) {
                    isPreseasonWeek = false;
                }
                HideAllScheduleWeeks(divisionId);
                if (isPreseasonWeek == true) {
                    $("#preSeasonScheduleTabWeek_" + divisionId + "_" + weekId, element).addClass("active");
                    $("#preSeasonScheduleTabWeekMatchup_" + divisionId + "_" + weekId, element).show();
                }
                else {
                    $("#scheduleTabWeek_" + divisionId + "_" + weekId, element).addClass("active");
                    $("#scheduleTabWeekMatchup_" + divisionId + "_" + weekId, element).show();
                }
            }
            function HideScheduleWeek(weekId, divisionId, isPreseasonWeek) {
                if (isPreseasonWeek == null) {
                    isPreseasonWeek = false;
                }
                if (isPreseasonWeek == true) {
                    $("#preSeasonScheduleTabWeek_" + divisionId + "_" + weekId, element).removeClass("active");
                    $("#preSeasonScheduleTabWeekMatchup_" + divisionId + "_" + weekId, element).hide();
                }
                else {
                    $("#scheduleTabWeek_" + divisionId + "_" + weekId, element).removeClass("active");
                    $("#scheduleTabWeekMatchup_" + divisionId + "_" + weekId, element).hide();
                }
            }
            function ShowPlayoffScheduleWeek(weekId, divisionId) {
                HideAllScheduleWeeks(divisionId);
                $("#scheduleTabPlayoffWeek_" + divisionId + "_" + weekId, element).addClass("active");
                $("#scheduleTabPlayoffWeekMatchup_" + divisionId + "_" + weekId, element).show();
            }
            function HidePlayoffScheduleWeek(weekId, divisionId) {
                $("#scheduleTabPlayoffWeek_" + divisionId + "_" + weekId, element).removeClass("active");
                $("#scheduleTabPlayoffWeekMatchup_" + divisionId + "_" + weekId, element).hide();
            }
            function HideAddWeekOption() {
                $("#leagueWeekAddHolder", element).hide();
            }
            function ShowAddWeekOption() {
                $("#leagueWeekAddHolder", element).show();
            }
            function DisplayWorkingIndicator(messageToShow, callback) {
                if (messageToShow != null && messageToShow != "") {
                    $("#workingIndicatorMessage", $("#workingIndicatorHolder", element)).empty();
                    $("#workingIndicatorMessage", $("#workingIndicatorHolder", element)).append(messageToShow);
                }
                ShowWorkingIndicator();
                if (callback != null) {
                    callback();
                }
            }
            function HideWorkingIndicator() {
                $("#workingIndicatorHolder", element).hide();
            }
            function ShowWorkingIndicator() {
                $("#workingIndicatorHolder", element).show();
            }
            function HideGenerateScheduleButton() {
                $("#btnGenerateLeagueSchedule", element).hide();
            }
            function ShowGenerateScheduleButton() {
                $("#btnGenerateLeagueSchedule", element).show();
            }
            function HideLeagueDivisionCounterHolder() {
                $("#xtremeEditorDivisionCounterHolder", element).hide();
            }
            function ShowLeagueDivisionCounterHolder() {
                $("#xtremeEditorDivisionCounterHolder", element).show();
            }
            function ShowUserMessage()
            {
                $("#userMessageHolder", element).show();
            }
            function HideUserMessage()
            {
                $("#userMessageHolder", element).hide();
            }
            function WriteUserMessage(message)
            {
                $("#userMessageText", element).empty();
                $("#userMessageText", element).append(message);
                ShowUserMessage();
            }
            /*Show/Hide/Collapse/Toggle Sections End*/
            function HasAccess() {
                return appLib.canAccessAGameLeague();
            }
            scope.load = function () {
                HideAll();
                if (HasAccess() == true) {
                    scope.Initialize();
                    LoadCurrentXtremeLeagueInformation();
                }
                else {
                    $("#currentXtremeGameHolder", element).empty();
                    $("#currentXtremeGameHolder", element).append("You do not have access to this module.");
                }
            };

            ko.postbox.subscribe("AgameXtremeAdminReload", function () {
                WriteUserMessage("Reloading game information...");
                window.setTimeout(function () {
                    LoadCurrentXtremeLeagueInformation();
                }, 500);
            });

            ko.postbox.subscribe("AgameXtremeAdminLoad", function () {
                scope.load();
            });
        }
    };
}]);
