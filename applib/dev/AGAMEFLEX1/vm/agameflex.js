angularApp.directive("ngAgameFlex", ['api', '$rootScope', function (api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/AGAMEFLEX1/view/agameflex.htm?' + Date.now(),
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
            //TODO: Add this to some sort of enum file?
            const BUDGET_DOLLAR_SPENT = 1;
            const BUDGET_DOLLAR_ALLOCATED = 3;
            const BUDGET_CREDITS_SPENT = 2;
            const BUDGET_CREDITS_ALLOCATED = 4;

            var basePrizeUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/prizes/";
            var baseTrophyUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/trophy/";
            var defaultPrizeUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/prizes/prize-placeholder.png";
            var defaultTrophyUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/trophy/empty-trophy.png";

            var statusCookieName = "acuity_admin_status_filter";
            var sortOrderCookieName = "acuity_admin_sort_order";
            var clientPossiblePrizes = [];
            var possiblePositionRewardOptionList = [];
            var possibleTrophies = [];
            var canManagePrizes = false;
            let hasFreeFormRewardChanged = false;
            var currentUserBudgetList = [];

            /* Button Event Setup START */
            $(".flex-game-btn-add-new-game").off("click").on("click", function () {
                scope.ShowAddNewGame();
            });
            $(".flex-game-btn-load-gamelist-all").off("click").on("click", function () {
                scope.LoadAllGameList();
            });
            $(".flex-game-form-btn-save").off("click").on("click", function () {
                scope.ValidateEditorForm(function () {
                    //set the step value to 1 so that it will not close the form and jsut save the information.
                    $("#editor-step").val("1");
                    scope.SaveEditForm();
                });
            });
            $(".flex-game-form-btn-save-and-close", element).off("click").on("click", function () {
                scope.ValidateEditorForm(function () {
                    //set the step to 4 or greater and it will close the form.
                    $("#editor-step").val("4");
                    scope.SaveEditForm(function () {
                        scope.WriteUserStatus("Reloading game list and all Game data...", 10000);
                        scope.LoadGameListForUser(GetUserIdToLoad());
                    });
                });
            });
            $(".flex-game-form-btn-cancel").off("click").on("click", function () {
                let gameId = parseInt($(".flex-game-form-current-game-id", element).val());
                scope.ClearEditForm();
                scope.ReloadCurrentData();
                scope.GetLeaderBoardInformationFromGame(gameId);
            });
            $(".flex-game-btn-show-edit-form").off("click").on("click", function () {
                ShowEditForm();
            });
            $(".flex-game-btn-hide-edit-form").off("click").on("click", function () {
                HideEditForm();
            });
            $(".flex-game-btn-clear-console").off("click").on("click", function () {
                scope.ClearAdminStatus();
            });
            $(".flex-game-full-leaderboard-close-btn").off("click").on("click", function () {
                scope.ClearCachedLeaderboardInformation();
                scope.HideFullLeaderBoard();
            });
            $(".flex-game-full-leaderboard-display-option").off("change").on("change", function () {
                var displayValue = $(this).val();
                scope.ChangeFullLeaderboardDisplay(displayValue, null);
            });
            $("#selectAllParticipant", element).off("click").on("click", function () {
                scope.MarkAllParticipants();
            });
            $(".flex-score-range-btn-save").off("click").on("click", function () {
                scope.SaveAllScoringRangesForGame(function () {
                    scope.ResetScoringRangesAdd(function () {
                        scope.WriteUserStatus("Reloading of current data so scores are freshened up.", 5000);
                        scope.ReloadCurrentData(function () {
                            scope.HideScoringRangeEditForm();
                        });
                    });
                });
            });
            $(".flex-score-range-btn-cancel").off("click").on("click", function () {
                scope.HideScoringRangeEditForm();
            });
            $(".flex-score-range-btn-close").off("click").on("click", function () {
                scope.CloseScoringRangeEditForm();
            });
            $(".flex-game-btn-show-range-form").off("click").on("click", function () {
                scope.ShowScoringRangeEditForm();
            });
            $(".flex-game-btn-show-copy-form").off("click").on("click", function () {
                scope.ShowCopyGameForm();
            });
            $(".flex-game-copy-btn-save").off("click").on("click", function () {
                scope.WriteUserStatus("Performing game copy", 3000);

                scope.SaveCopyGameForm(function () {
                    scope.WriteUserStatus("Copy complete.", 2000);
                    scope.ClearCopyGameForm(function () {
                        scope.HideCopyGameForm();
                    });
                    scope.ReloadCurrentData();
                });
            });
            $(".flex-game-copy-btn-cancel").off("click").on("click", function () {
                scope.ClearCopyGameForm(function () { scope.HideCopyGameForm(); });
            });
            $("#scoreAdd").off("click").on("click", function () {
                scope.AddScoringRangeItem(function () {
                    scope.ClearScoringRangeAddForm();
                    scope.ShowScoringRangeEditForm();
                });
            });
            $(".flex-game-display-filter").off("click").on("click", function () {
                scope.WriteUserStatus("Refreshing game list...", 7500);
                var userId = GetUserIdToLoad();                
                scope.LoadGameListForUser(userId, function (data) {
                    scope.DisplayGameList(data);
                    scope.HideUserStatus();
                });
            });
            $(".flex-game-btn-update-game-status").off("click").on("click", function () {
                scope.UpdateGameStatusPerDates();
            });
            $(".flex-game-btn-refresh-game-list", element).off("click").on("click", function () {
                ko.postbox.publish("flexGameRefresh");
                // scope.WriteUserStatus("Refreshing game list...", 5000);
                // var prefixInfo = a$.gup("prefix");
                // var hrefLocation = "default.aspx";
                // if (prefixInfo != null && prefixInfo != "") {
                //     hrefLocation += "?prefix=" + prefixInfo;
                // }

                // document.location.href = hrefLocation;
            });
            $(".flex-game-btn-return-game-list", element).off("click").on("click", function () {
                var prefixInfo = a$.gup("prefix");
                var hrefLocation = "userGameListing.aspx";
                if (prefixInfo != null && prefixInfo != "") {
                    hrefLocation += "?prefix=" + prefixInfo;
                }

                document.location.href = hrefLocation;
            });
            $(".flex-game-data-label_acuityscoring", element).off("click").on("click", function () {
                var currentlyVisible = $(".flex-game-editor-acuity-scoring-display-holder", element).is(":visible");
                if (currentlyVisible) {
                    $(".flex-game-editor-acuity-scoring-display-holder", element).hide();
                }
                else {
                    let metricId = $(".flex-game-editor-scoring-area", element).val();
                    let selectedSubTypeId = $(".flex-game-editor-scoring-sub-area", element).val();
                    if (selectedSubTypeId == "") {
                        selectedSubTypeId = null;
                    }

                    scope.LoadAcuityScoringRangeInformation(metricId, selectedSubTypeId, function () {
                        $(".flex-game-editor-acuity-scoring-display-holder", element).show();
                    });
                }
            });
            $(".flex-game-faq-help", element).off("click").on("click", function () {
                LoadFaqPanel();

            });
            $(".flex-game-intra-team_manager", element).off("click").on("click", function () {
                var prefixInfo = a$.gup("prefix");
                var hrefLocation = "flexIntraTeamManager.aspx";
                if (prefixInfo != null && prefixInfo != "") {
                    hrefLocation += "?prefix=" + prefixInfo;
                }
                document.location.href = hrefLocation;
            });
            $(".remove-all-participants", element).off("click").on("click", function () {
                RemoveAllParticipantsForGame();
            });
            $(".add-all-participants", element).off("click").on("click", function () {
                AddAllParticipantsToGame();
            });
            $(".flex-game-editor-filter-clear-all-options", element).off("click").on("click", function () {
                ClearAllFilterOptions();
                HandleParticipantFilterOptionsForGameType();
                LoadPossibleParticipantsFiltered();
            });
            $(".flex-game-editor-user-score-entry-btn-cancel", element).off("click").on("click", function () {
                ClearManualScoringEntryForm(function () {
                    $("#manual-entry-button-filter-clear", element).trigger("click");
                    let editingGameId = $(".flex-game-editor-user-entry-scores-game-id", element).val();
                    HideManualScoringEntryForm();
                    if (scope.hasUpdates == true) {

                        $("#loadDataAdmin_" + editingGameId, element).trigger("click");
                        scope.hasUpdates = false;
                    }
                });
            });
            $(".flex-game-editor-user-entry-scores-add-score-button", element).off("click").on("click", function () {
                ValidateManualEntryFormData(function () {
                    AddManualScoringEntryItem(function () {
                        ClearManualScoringEntryForm(function () {
                            let gameId = $(".flex-game-editor-user-entry-scores-game-id", element).val();
                            LoadManualScoringEntryForm(gameId, function () {
                                ShowManualScoringEntryForm();
                                scope.hasUpdates = true;
                            });
                        });
                    });
                });
            });
            $(".flex-game-manual-entry-scoring-manager", element).off("click").on("click", function () {
                var prefixInfo = a$.gup("prefix");
                var hrefLocation = "Flexscoringareamanager.aspx";
                if (prefixInfo != null && prefixInfo != "") {
                    hrefLocation += "?prefix=" + prefixInfo;
                }
                document.location.href = hrefLocation;
            });
            $(".flex-game-reward-manager", element).off("click").on("click", function () {
                var prefixInfo = a$.gup("prefix");
                var hrefLocation = window.location.protocol + "//" + window.location.hostname + "/3/ng/AcuityAdmin/default.aspx";
                if (prefixInfo != null && prefixInfo != "") {
                    hrefLocation += "?prefix=" + prefixInfo + "&area=ppm";
                }
                else {
                    hrefLocation += "?area=ppm";
                }
                window.open(hrefLocation)
                //document.location.href = hrefLocation;
            });
            $(".flex-game-editor-rewards-assignment-entry-btn-cancel", element).off("click").on("click", function () {
                ClearRewardsAssignmentEntryForm(function () {
                    HideRewardsAssignmentEntryForm();
                });
            });
            $(".flex-game-editor-rewards-assignement-entry-btn-save", element).off("click").on("click", function () {
                ValidateRewardsAssignmentForm(function () {
                    SaveRewardsAssignmentForm(function () {
                        HideRewardsAssignmentEntryForm();
                    });
                });
            });
            $("#manual-entry-button-filter-clear", element).off("click").on("click", function () {
                $("#manual-entry-filter-rec-date", element).val("");
                $("#manual-entry-filter-user-id", element).val("");
                FilterManualEntryForm();
            });
            $("#btnAddReward", element).off("click").on("click", function () {
                ValidateAddRewardItem(function () {
                    SaveCurrentRewardItem(-1, function () {
                        ClearAddRewardForm();
                        ReloadGameInformation();
                        HandleButtonsAvailable();
                    });
                });
            });
            $("#btnAddSpinnerOption", element).off("click").on("click", function () {
                ValidateAddSpinnerItem(function () {
                    SaveCurrentSpinnerOptionItem(-1, function () {
                        ClearAddSpinnerForm();
                        ReloadGameInformation();
                        HandleButtonsAvailable();
                    });
                });
            });
            $("#hasPrizeOptions", element).off("click").on("click", function () {
                let currentGameId = $(".flex-game-form-current-game-id", element).val();
                TogglePrizeForGame(currentGameId, function () {
                    HandleGamePrizeDisplay();
                });
            });
            $("#refreshPrizeListButton", element).on("click", function(){
                //$(this).hide();
                $(this).addClass("refresh-prize-option-active");
                ko.postbox.publish("reloadPrizeOptions");
            });
            $("#hasTieBreakerScoring", element).off("change").on("change", function(){
                if($(this).val() == "false")
                {
                    $("#tieBreakerKpi_MqfNumber", element).val("");
                    $("#tieBreakerKpi_ScoringTypeId", element).val("");
                }
            });
            $("#tieBreakerKpi_MqfNumber", element).off("change").on("change", function(){
                //TODO: Load the scoring type options information for the tie breaker
                scope.LoadOptionsLists("scoringtypestiebreaker");
            });
            /* Button Event Setup END */
            scope.Initialize = function () {
                scope.WriteUserStatus("Initalizaing data...", 10000);
                $(".error-information-holder", element).hide();
                $(".flex-game-editor-scoring-sub-area", element).hide();
                $(".flex-game-editor-sub-game-type", element).hide();
                hasFreeFormRewardChanged = false;

                scope.IsDevModeOn = (legacyContainer.scope.TP1Role == "Admin");

                scope.userId = "";
                scope.CurrentUser = "";
                scope.AllowIndividualScoringRangeSave = false;
                scope.CurrentStackRank = 1;
                scope.DisplayAltRow = "";
                scope.GameIdToLoad = null;
                scope.IgnoreNavigateToGame = false;

                scope.ConfigParameters = [];
                scope.GameAdminOptions = [];
                scope.GameList = [];
                scope.GameScoringOptionsList = [];
                scope.GameTypeList = [];
                scope.GroupOptions = [];
                scope.FinishOptions = [];
                scope.LocationOptions = [];
                scope.PossibleGroups = [];
                scope.PossibleParticipants = [];
                scope.PossibleTeams = [];
                scope.PossibleIntraTeams = [];
                scope.ProjectOptions = [];
                scope.ScoringAreasList = [];
                scope.ScoringBasisList = [];
                scope.ScoringTypeList = [];
                scope.SubGameTypeList = [];
                scope.SubScoringAreasList = [];
                scope.SupervisorList = [];
                scope.TeamOptions = [];
                scope.ThemeOptions = [];
                scope.ThemeTypeOptions = [];
                scope.UserAssignments = [];
                scope.CurrentGameRewardAssignments = [];
                scope.CurrentManualScoringItems = [];

                scope.FullAgentLeaderboardHtml = "";
                scope.FullTeamLeaderboardHtml = "";
                scope.FullGroupLeaderboardHtml = "";
                scope.HideLoadingIndicator();

                SetDatePickerFields();

                scope.HideScoringRangeEditForm();
                scope.HideUserInformation();
                scope.HideUserStatus();
                HideEditForm();
                scope.HideFullLeaderBoard();
                scope.HideCopyGameForm();
                scope.SetGameToLoad();
                HideManualScoringEntryForm();
                HideRewardsAssignmentEntryForm();
                HideFaqPanel();
                SetInitialTabStatusInformation();
                SetTabClickEvent();
                LoadUserAssignments(null, null);
                HideParticipantLoadingImage();
                HideManagerButtons();
                LoadConfigParameters(function () {
                    var defaultGameLength = 30;
                    var defaultScoringType = 2;
                    var defaultGameType = 1;
                    var defaultScoringInterval = 0;
                    var defaultScoringPoints = 0;
                    var defaultLowRange = 0;
                    var defaultHighRange = 10000;



                    if (scope.ConfigParameters != null) {
                        GetConfigParameterValue("FLEX_DEFAULT_GAMELENGTH", function (value) {
                            defaultGameLength = parseFloat(value) || defaultGameLength;
                        });
                        GetConfigParameterValue("FLEX_DEFAULT_SCORINGTYPE", function (value) {
                            defaultScoringType = parseFloat(value) || defaultScoringType;
                        });
                        GetConfigParameterValue("FLEX_DEFAULT_GAMETYPE", function (value) {
                            defaultGameType = parseFloat(value) || defaultGameType;
                        });
                        GetConfigParameterValue("FLEX_DEFAULT_SCORINGINTERVAL", function (value) {
                            defaultScoringInterval = parseFloat(value) || defaultScoringInterval;
                        });
                        GetConfigParameterValue("FLEX_DEFAULT_SCORINGPOINTS", function (value) {
                            defaultScoringPoints = parseFloat(value) || defaultScoringPoints;
                        });
                        GetConfigParameterValue("FLEX_DEFAULT_LOWRANGE", function (value) {
                            defaultLowRange = parseFloat(value) || defaultLowRange;
                        });
                        GetConfigParameterValue("FLEX_DEFAULT_HIGHRANGE", function (value) {
                            defaultHighRange = parseFloat(value) || defaultHighRange;
                        });
                    }

                    scope.DefaultLowRangeScore = defaultLowRange;
                    scope.DefaultHighRangeScore = defaultHighRange;
                    scope.DefaultMaximumPointScoreAvailable = defaultScoringPoints;
                    scope.DefaultPointScoreInterval = defaultScoringInterval;
                    scope.DefaultGameLength = defaultGameLength;
                    scope.DefaultScoringType = defaultScoringType;
                    scope.DefaultGameType = defaultGameType;

                    scope.WriteUserStatus("Loading information.", 5000);
                });

                scope.SetDefaultFilters();
                LoadPossibleRewardTypePositions();
                LoadPossibleClientPrizeOptions();
                LoadPossibleTrophyOptions();
                //TODO: Determine if the user can manage prizes.
                //canManagePrizes = (legacyContainer.scope.TP1Role == "Admin");
                canManagePrizes = true;
                scope.ShowAdminPanel = false;
                scope.hasUpdates = false;

            };

            function GetConfigParameterValue(parameterName, callback) {
                var returnValue = null;
                var parameter = scope.ConfigParameters.find(p => p.ParamName == parameterName);
                if (parameter != null) {
                    returnValue = parameter.ParamValue;
                }
                if (callback != null) {
                    callback(returnValue);
                } else {
                    return returnValue;
                }
            }
            function LoadSubGameTypesOptions(callback) {
                scope.WriteUserStatus("Load Game Subtype options...", 10000);
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getSubGameTypePossibleList",
                        isdevmode: scope.IsDevModeOn
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) {

                        let subGameList = $.parseJSON(data.subGameTypeList);

                        scope.SubGameTypeList.length = 0;
                        if (subGameList != null) {
                            for (var i = 0; i < subGameList.length; i++) {
                                scope.SubGameTypeList.push(subGameList[i]);
                            }
                        }
                        if (callback != null) {
                            callback();
                        }
                    }
                });
            }
            scope.SetGameToLoad = function (callback) {
                scope.WriteUserStatus("Processing game to load...", 10000);
                var gameId = scope.GameIdToLoad || a$.gup("gameid");
                if (gameId != null && gameId != "" && (scope.GameIdToLoad == null || scope.GameIdToLoad == "")) {
                    scope.GameIdToLoad = parseInt(gameId);
                }
                if (callback != null) {
                    callback();
                }
            };
            function SetDatePickerFields() {
                $(".flex-game-editor-start-date", element).datepicker();
                $(".flex-game-editor-end-date", element).datepicker();
                $(".flex-game-copy-editor-start-date", element).datepicker();
                $(".flex-game-copy-editor-end-date", element).datepicker();
                $(".flex-game-editor-user-entry-scores-date", element).datepicker();
                $("#manual-entry-filter-rec-date", element).datepicker({
                    showAnim: "slideDown"
                });
            };
            function LoadConfigParameters(callback) {
                scope.WriteUserStatus("Loading configrations...", 3000);

                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getConfigParameters"
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) {
                        var configParams = $.parseJSON(data.configParameters);
                        scope.ConfigParameters.length = 0;
                        if (configParams != null) {
                            for (var i = 0; i < configParams.length; i++) {
                                scope.ConfigParameters.push(configParams[i]);
                            }
                        }
                        if (callback != null) {
                            callback();
                        }
                    }
                });
            };
            function LoadUserAssignments(startDate, endDate, callback) {
                scope.WriteUserStatus("Collecting User Assignments...", 10000);
                if (startDate == null) {
                    var today = new Date();
                    var newDate = new Date();
                    newDate.setDate(today.getDate()- 45);
                    startDate = newDate.toLocaleDateString("en-US");
                }

                if (endDate == null) {
                    endDate = new Date().toLocaleDateString("en-US");
                }
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "getUserAssignmentsForDates",
                        startdate: startDate,
                        enddate: endDate
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var userassigns = $.parseJSON(data.userAssignmentList);
                        scope.UserAssignments.length = 0;
                        if (userassigns != null) {
                            for (var i = 0; i < userassigns.length; i++) {
                                scope.UserAssignments.push(userassigns[i]);
                            }
                        }
                        if (callback != null) {
                            callback();
                        }
                    }
                });
            };
            scope.LoadGameListForUser = function (userId, callback) {
                scope.WriteUserStatus("Loading game list...", 5000);
                var statusFilterOptionsArray = [];
                var listSortOrder = $("#userSortOrder", element).val();

                if (listSortOrder == null || listSortOrder == "") {
                    listSOrtOrder = "";
                }

                $(".flex-game-display-filter").each(function () {
                    var item = $(this);
                    if (item.prop("checked") == true) {
                        statusFilterOptionsArray.push($(item).val());
                    }
                });

                $.cookie(sortOrderCookieName, listSortOrder, { expires: .25 });
                $.cookie(statusCookieName, statusFilterOptionsArray, { expires: .25 });

                if (userId == null) {
                    userId = scope.CurrentUser || scope.userId;
                }
                scope.WriteUserStatus("Getting games...");
                $(".flex-game-list-panel", element).empty();
                let loadingImage = $("<img src=\"./images/blue-loading.gif\" height=\"25px\" />");
                $(".flex-game-list-panel", element).append(loadingImage);
                $(".flex-game-list-panel", element).append("Collecting and Loading games...");
                scope.WriteUserStatus("Loading Games...", 10000);
                window.setTimeout(function(){
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "flex",
                            cmd: "getGameListForUser",
                            userid: userId,
                            statuslist: statusFilterOptionsArray.join(","),
                            sort: listSortOrder
                        },
                        beforeSend: () => {
                            scope.WriteUserStatus("Collecting the games assigned to you...", 10000);
                        },
                        afterSend: () =>{
                        },
                        dataType: "json",
                        cache: false,
                        error: function (response) {
                            a$.ajaxerror(response);
                        },                        
                        success: function (data) {
                            scope.WriteUserStatus("Building the game list...", 10000);
                            window.setTimeout(function(){
                                if (callback != null) {
                                    callback(data);
                                }
                                else {
                                    scope.DisplayGameList(data);
                                }
                            }, 500);
                        }
                    });
                }, 500);
            };
            scope.LoadAllGameList = function (callback) {
                scope.WriteUserStatus("Loading all game data...", 10000);
                var statusFilterOptionsArray = [];
                var listSortOrder = $("#userSortOrder", element).val();

                if (listSortOrder == null || listSortOrder == "") {
                    listSOrtOrder = "";
                }

                $(".flex-game-display-filter").each(function () {
                    var item = $(this);
                    if (item.prop("checked") == true) {
                        statusFilterOptionsArray.push($(item).val());
                    }
                });

                $.cookie(sortOrderCookieName, listSortOrder, { expires: 1 });
                $.cookie(statusCookieName, statusFilterOptionsArray, { expires: 1 });
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getGameList",
                        statuslist: statusFilterOptionsArray.join(","),
                        sort: listSortOrder
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        scope.DisplayGameList(data, callback);

                    }
                });
            };
            scope.LoadGameByGameId = function (gameId, reloadGame, isAsyncRequest, callback) {
                if (reloadGame == null) {
                    reloadGame = true;
                }
                if (isAsyncRequest == null) {
                    isAsyncRequest = true;
                }
                scope.WriteUserStatus("Loading specific game data...", 10000);
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: isAsyncRequest,
                    data: {
                        lib: "flex",
                        cmd: "getGameById",
                        gameId: gameId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var game = $.parseJSON(data.gameList);
                        if (game != null) {
                            scope.GameList = [];
                            if (game.length != null && game.length > 1) {
                                for (var i = 0; i < game.length; i++) {
                                    scope.GameList.push(game[i]);
                                }
                            } else {
                                scope.GameList.push(game);
                            }
                            if (reloadGame == true) {
                                scope.LoadEditForm(game.FlexGameId, true)
                            }
                            if (callback != null) {
                                callback();
                            }
                            return true;
                        }
                    }
                });
            };
            scope.DisplayGameList = function (json, callback) {
                $(".flex-game-list-panel", element).empty();
                scope.WriteUserStatus("Building the game list...", 10000);
                window.setTimeout(function(){
                    scope.WriteUserStatus("Rendering game data to your screen...", 10000);
                    var gameFound = false;
                    scope.GameList = [];
                    var filters = [];
                    if (a$.jsonerror(json)) {
                        console.log('no data found for DisplayGameList.');
                    } else {
                        if (!a$.exists(json.gameList)) {
                            console.log("No games found in origin: " + json.origin);
                        } else {
                            var games = $.parseJSON(json.gameList); //JSON.parse(json.gameList)
    
                            if (games.length == 0) {
                                var noData = $("<div \>");
                                noData.text("No games found.");
    
                                $(".flex-game-list-panel", element).append(noData);
                            } else {
                                scope.WriteUserStatus("Building games...", 10000);
                                $(".flex-game-list-panel", element).empty();
                                for (let i = 0; i < games.length; i++) {
                                    let currentGame = games[i];
                                    let lastGameUpdateDate = currentGame.LastDataUpdate;
    
                                    if (lastGameUpdateDate == null) {
                                        lastGameUpdateDate = "N/A";
                                    } else {
                                        lastGameUpdateDate = new Date(lastGameUpdateDate).toLocaleDateString("en-US") + " at " + new Date(lastGameUpdateDate).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
                                    }
                                    let gameUpdateHolder = $("<div class=\"flex-game-game-last-update-holder\" />");
                                    let lastUpdateValue = $("<label class=\"flex-game-game-last-update-value\">Last Updated: " + lastGameUpdateDate + "</label>");
    
                                    gameUpdateHolder.append(lastUpdateValue);
    
                                    if (!gameFound) {
                                        gameFound = (scope.GameIdToLoad != null && currentGame.FlexGameId == scope.GameIdToLoad);
                                    }
    
    
                                    let currentGameThemeTag = "";
                                    if (currentGame.ThemeIdSource != null && currentGame.ThemeIdSource.ThemeTagName != null && currentGame.ThemeIdSource.ThemeTagName != "") {
                                        currentGameThemeTag = currentGame.ThemeIdSource.ThemeTagName;
                                    }
                                    scope.WriteUserStatus("Building game card for " + currentGame.Name + "...");
    
                                    let gameMaxParticipants = 0;
                                    let gameNumberOfPositions = 0;
                                    scope.GameList.push(currentGame);
                                    let currentGameStatusName = GetStatusNameFromCode(currentGame.Status);
                                    let currentGameStatusClass = GetGameStatusClassFromCode(currentGame.Status);
                                    let pointsToEndGame = currentGame.PointsToEndGame;
    
                                    let maxPointsPossibleInDate = Math.max.apply(Math, currentGame.ScoringRange.map(function (x) { return x.Points }));
                                    let minTimeToComplete = 0;
                                    if (pointsToEndGame != 0) {
                                        minTimeToComplete = Math.ceil(pointsToEndGame / maxPointsPossibleInDate);
                                    }
    
                                    let gameInfo = $("<div id=\"game" + currentGame.FlexGameId + "\" class=\"flex-game-gameinfo-holder " + currentGameThemeTag + " " + currentGameStatusClass + "\" \>");
    
                                    let gameName = $("<div class=\"flex-game-game-name " + currentGameThemeTag + "\" />");
                                    gameName.append($("<label class=\"flex-game-game-name-info " + currentGameThemeTag + "\" />").append(currentGame.Name));
    
                                    let gameBoard = $("<div class=\"flex-game-game-list-board-holder " + currentGameThemeTag + "\" />");
                                    let gameAdmin = $("<div class=\"flex-game-game-admin-userid " + currentGameThemeTag + "\" />");
                                    gameAdmin.append($("<label class=\"flex-game-data-label " + currentGameThemeTag + "\" />").append("Game Admin: "));
    
                                    if (currentGame.AdminUserIdSource != null) {
                                        gameAdmin.append($("<label class=\"flex-game-game-admin-user-info " + currentGameThemeTag + "\" />").append(currentGame.AdminUserIdSource.UserFullName));
                                    } else {
                                        gameAdmin.append($("<label class=\"flex-game-game-admin-user-info " + currentGameThemeTag + "\" />").append(currentGame.AdminUserId));
                                    }
    
                                    let gameTheme = $("<div class=\"flex-game-theme " + currentGameThemeTag + "\" />");
                                    gameTheme.append($("<label class=\"flex-game-data-label_theme " + currentGameThemeTag + "\" />").append("Theme: "));
    
                                    let themeLeaderboardImage = null;
                                    let gameboardImage = null;
    
                                    if (currentGame.ThemeIdSource != null && currentGame.ThemeIdSource != null && currentGame.ThemeIdSource.ThemeId > 0) {
                                        gameTheme.append($("<label class=\"flex-game-game-theme-info " + currentGameThemeTag + "\" />").append(currentGame.ThemeIdSource.Name));
    
                                        if (currentGame.ThemeIdSource.RequiresEndingPointTotal == true) {
                                            gameNumberOfPositions = currentGame.PointsToEndGame;
                                        } else {
                                            gameNumberOfPositions = currentGame.ThemeIdSource.ThemePositions;
                                        }
    
                                        gameMaxParticipants = currentGame.ThemeIdSource.MaxParticipantNumber;
    
                                        if (currentGame.ThemeIdSource.FinishTypeIdSource != null) {
                                            $(".flex-game-finish-type", element).text(currentGame.ThemeIdSource.FinishTypeIdSource.FinishTypeName);
                                        } else {
                                            $(".flex-game-finish-type", element).text("Finish Type name not found.");
                                        }
    
                                        if (currentGame.ThemeIdSource.ThemeLeaderboardDisplayImageName != null) {
                                            themeLeaderboardImage = currentGame.ThemeIdSource.ThemeLeaderboardDisplayImageName;
                                        }
    
                                        if (currentGame.ThemeIdSource.ThemeBoardDisplayImageName != null) {
                                            gameboardImage = currentGame.ThemeIdSource.ThemeBoardDisplayImageName;
                                        }
                                    } else {
                                        gameTheme.append($("<label class=\"flex-game-game-theme-info " + currentGameThemeTag + "\" />").append("No Theme Set"));
                                    }
                                    var gameType = $("<div class=\"flex-game-game-type " + currentGameThemeTag + "\" />");
                                    gameType.append($("<label class=\"flex-game-data-label " + currentGameThemeTag + "\" />").append("Game Type: "));
    
    
                                    let gameTypeName = "";
                                    if (currentGame.ThemeIdSource != null && currentGame.GameTypeIdSource != null && currentGame.GameTypeIdSource.GameTypeId > 0) {
                                        gameTypeName = currentGame.GameTypeIdSource.GameTypeName;
                                        if (currentGame.GameTypeIdSource.HasSubTypes == true && currentGame.SubGameTypeId != null) {
                                            let gameSubType = scope.SubGameTypeList.find(g => g.GameSubTypeId == currentGame.SubGameTypeId);
                                            if (gameSubType != null) {
                                                gameTypeName += " <span class=\"flex-game-game-sub-type-name\">" + gameSubType.SubTypeName + "<span>";
                                            }
                                        }
                                    } else {
                                        gameTypeName = "Game Type Unknown";
                                    }
                                    gameType.append($("<label class=\"flex-game-game-type-info " + currentGameThemeTag + "\" />").append(gameTypeName));
    
                                    var scoringType = null;
    
                                    var scoringType = $("<div class=\"flex-game-game-type " + currentGameThemeTag + "\" />");
                                    //NOTE: SCORING TYPE HAS BEEN RENAMED TO SCORING BASIS per Greg.
                                    scoringType.append($("<label class=\"flex-game-data-label " + currentGameThemeTag + "\" />").append("Scoring Basis: "));
    
                                    if (currentGame.ThemeIdSource != null && currentGame.ScoringTypeIdSource != null && currentGame.ScoringTypeIdSource.ScoringTypeId > 0) {
                                        scoringType.append($("<label class=\"flex-game-scoring-type-info " + currentGameThemeTag + "\" />").append(currentGame.ScoringTypeIdSource.ScoringTypeName));
                                    } else {
                                        scoringType.append($("<label class=\"flex-game-scoring-type-info " + currentGameThemeTag + "\" />").append("Scoring Basis Unknown."));
                                    }
                                    //NOTE: SCORING BASIS HAS BEEN RENAMED TO SCORING MODEL per Greg
                                    var scoringBasis = null;
                                    if (currentGame.ThemeIdSource != null && currentGame.ThemeIdSource.RequiresScoringBasis == true) {
                                        scoringBasis = $("<div class=\"flex-game-game-scoring-basis " + currentGameThemeTag + "\">");
                                        scoringBasis.append($("<label class=\"flex-game-data-label " + currentGameThemeTag + "\" />").append("Scoring Model: "));
    
                                        if (currentGame.ScoringBasisIdSource != null && currentGame.ScoringBasisIdSource.ScoringBasisId > 0) {
                                            scoringBasis.append($("<label class=\"flex-game-scoring-basis-info " + currentGameThemeTag + "\" />").append(currentGame.ScoringBasisIdSource.ScoringBasisName));
                                        } else {
                                            scoringBasis.append($("<label class=\"flex-game-scoring-basis-info " + currentGameThemeTag + "\" />").append("Scoring Model Unknown."));
                                        }
                                    }
                                    var scoringOption = null;
                                    if (currentGame.ScoringOptionIdSource != null) {
                                        scoringOption = $("<div class=\"flex-game-game-scoring-option " + currentGameThemeTag + "\">");
                                        scoringOption.append($("<label class=\"flex-game-data-label " + currentGameThemeTag + "\" />").append("Calculate Score:"));
    
                                        if (currentGame.ScoringOptionIdSource != null && currentGame.ScoringOptionIdSource.ScoringOptionId > 0) {
                                            scoringOption.append($("<label class=\"flex-game-scoring-basis-info " + currentGameThemeTag + "\" />").append(currentGame.ScoringOptionIdSource.ScoringOptionName));
                                        } else {
                                            scoringOption.append($("<label class=\"flex-game-scoring-basis-info " + currentGameThemeTag + "\" />").append("Scoring Option Unknown."));
                                        }
                                    }
                                    var gamePointsToEnd = null;
                                    if (currentGame.ThemeIdSource != null && currentGame.ThemeIdSource.RequiresEndingPointTotal == true) {
                                        gamePointsToEnd = $("<div class=\"flex-game-game-end-points " + currentGameThemeTag + "\" />");
                                        gamePointsToEnd.append($("<label class=\"flex-game-data-label " + currentGameThemeTag + "\" />").append("Points To End Game: "));
                                        gamePointsToEnd.append($("<label class=\"flex-game-end-points-info " + currentGameThemeTag + "\" />").append(pointsToEndGame));
                                        if (currentGame.GameTypeId == 1) {
                                            gamePointsToEnd.append($("<label class=\"flex-game-min-game-days " + currentGameThemeTag + "\" />").append("Min. days in game " + minTimeToComplete));
                                        }
                                    }
    
                                    // var gameStartDate = $("<div class=\"flex-game-start-date\">Start Date:" + new Date(currentGame.GameStartDate).toLocaleDateString("en-US") + "</div>");
                                    // var gameEndDate = $("<div class=\"flex-game-end-date\">End Date:" + new Date(currentGame.GameEndDate).toLocaleDateString("en-US") + "</div>");
                                    var gameDateCombine = $("<div class=\"flex-game-start-date " + currentGameThemeTag + "\" />");
                                    gameDateCombine.append($("<label class=\"flex-game-data-label " + currentGameThemeTag + "\" />").append("Game Dates: "));
                                    gameDateCombine.append($("<label class=\"flex-game-game-dates-info " + currentGameThemeTag + "\" />").append(new Date(currentGame.GameStartDate).toLocaleDateString("en-US") + " - " + new Date(currentGame.GameEndDate).toLocaleDateString("en-US")));
    
    
                                    var gameScoringArea = $("<div class=\"flex-game-scoring-area " + currentGameThemeTag + "\" />");
                                    gameScoringArea.append($("<label class=\"flex-game-data-label " + currentGameThemeTag + "\" />").append("Scoring Metric: "));
                                    let scoringMetricName = currentGame.GameKpiName;
                                    if (currentGame.SubKpiName != null && currentGame.SubKpiName != "") {
                                        scoringMetricName += ": " + currentGame.SubKpiName;
                                    }
                                    //gameScoringArea.append($("<label class=\"flex-game-game-dates-info " + currentGameThemeTag + "\" />").append(currentGame.GameKpiName));
                                    gameScoringArea.append($("<label class=\"flex-game-game-dates-info " + currentGameThemeTag + "\" />").append(scoringMetricName));
    
                                    var gameStatus = $("<div class=\"flex-game-status " + currentGameThemeTag + "\" />");
                                    gameStatus.append($("<label class=\"flex-game-status-info " + currentGameStatusName.replace(/\s/g, '') + "\" />").append("Status: " + currentGameStatusName));
    
    
                                    // var gamePositions = $("<div class=\"flex-game-game-position-count " + currentGameThemeTag + "\" />");
                                    // gamePositions.append($("<label class=\"flex-game-data-label " + currentGameThemeTag + "\" />").append("Positions "));
                                    // gamePositions.append($("<label class=\flex-game-position-count-info " + currentGameThemeTag + "\" />").append(gameNumberOfPositions));
    
    
                                    var gameParticpantCount = $("<div class=\"flex-game-participant-count " + currentGameThemeTag + "\" />");
                                    gameParticpantCount.append($("<label class=\"flex-game-data-label " + currentGameThemeTag + "\" />").append("# of Participants: "));
                                    gameParticpantCount.append($("<label class=\flex-game-position-count-info " + currentGameThemeTag + "\" />").append(currentGame.GameParticipants.length));
    
                                    var gameTeamCount = "";
                                    if (currentGame.GameTypeId != null && currentGame.GameTypeId > 1) {
                                        gameTeamCount = $("<div class=\"flex-game-team-count " + currentGameThemeTag + "\" />");
                                        let teamNumberLabel = "# of Teams";
                                        let teamCount = 0;
                                        if (currentGame.SubGameTypeId != null && currentGame.SubGameTypeId == 2) {
                                            teamNumberLabel = "# of Intra-Teams";
                                            teamCount = currentGame.ParticipatingIntraTeams.length || 0;
                                        }
                                        else {
                                            teamCount = currentGame.ParticipatingTeams.length || 0;
                                        }
                                        gameTeamCount.append($("<label class=\"flex-game-data-label " + currentGameThemeTag + "\" />").append(teamNumberLabel));
                                        gameTeamCount.append($("<label class=\"flex-game-position-count-info " + currentGameThemeTag + "\" />").append(teamCount));
                                    }
    
                                    var gameLeaderBoard = $("<div class=\"flex-game-leader-board-holder " + currentGameThemeTag + "\" />");
                                    if (themeLeaderboardImage != null && themeLeaderboardImage != "") {
                                        $(gameLeaderBoard).css("background-image", "url('" + window.location.protocol + "//" + window.location.hostname + themeLeaderboardImage + "')");
                                    }
                                    var maxNumberToShowOnLeaderboard = 5; //TODO (clint): Turn the maxleaderboard display number into a configuration variable/parameter or assign to the game?.
                                    var leaderboardInformation = null;
                                    var leaderBoardCount = 0;
    
    
                                    var gameCreationInformation = $("<div class=\"flex-game-create-by " + currentGameThemeTag + "\" />");
                                    gameCreationInformation.append($("<label class=\"flex-game-data-label " + currentGameThemeTag + "\"/>").append("Created By:"));
                                    gameCreationInformation.append($("<label class=\"flex-game-create-by-info " + currentGameThemeTag + "\" />").append(currentGame.EnterBy));
    
                                    let rewardInfo = $("<div class=\"flex-game-game-reward " + currentGameThemeTag + "\" />");
                                    if (currentGame.GameReward != null && currentGame.GameReward != "") {
                                        rewardInfo.append($("<label class=\"flex-game-data-label " + currentGameThemeTag + "\"/>").append("Game Reward:"));
                                        rewardInfo.append($("<label class=\"flex-game-game-reward-info " + currentGameThemeTag + "\"/>").append(currentGame.GameReward));
                                    }
                                    scope.GetLeaderBoardInformationFromGame(currentGame.FlexGameId, function (data) {
                                        leaderBoardCount = ($.parseJSON(data.leaderBoard).length) //(JSON.parse(data.leaderBoard).length);
                                        gameId = data.gameId || currentGame.FlexGameId;
                                        if (currentGame.GameTypeId == 2) {
                                            //leaderboardInformation = BuildTeamLeaderboard(data, maxNumberToShowOnLeaderboard, false, gameId, gameMaxParticipants);
                                            BuildTeamLeaderboard(data, maxNumberToShowOnLeaderboard, false, gameId, gameMaxParticipants, function (gameId, leaderboardInformation) {
                                                $(".flex-game-leader-board-holder", $("#game" + gameId, element)).empty();
                                                $(".flex-game-leader-board-holder", $("#game" + gameId, element)).append(leaderboardInformation);
                                                if (leaderBoardCount > 0) {
                                                    var fullLeaderBoardButton = $("<input type=\"button\" class=\"flex-game-leader-board-full-show-btn " + currentGameThemeTag + "\" value=\"Show Full Leaderboard\" id=\"fullBoard_" + gameId + "\">");
                                                    $(fullLeaderBoardButton, element).off("click").on("click", function () {
                                                        let buttonName = this.id;
                                                        let id = buttonName.split('_')[1];
                                                        scope.LoadLeaderboardInformationFromGame(id, "user", function (data, id) {
                                                            scope.BuildFullLeaderboard(data, id, gameNumberOfPositions);
                                                            let game = scope.GameList.find(g => g.FlexGameId == parseInt(id));
                                                            if (game.GameTypeId == 2) {
                                                                scope.ChangeFullLeaderboardDisplay("team", null);
                                                                $("input:radio[name=fullLeaderBoardDisplay]", element).val(["team"]);
                                                            }
                                                        });
                                                    });
                                                    $(".flex-game-leader-board-holder", $("#game" + gameId, element)).append(fullLeaderBoardButton);
                                                }
                                            });
                                        }
                                        else {
                                            BuildLeaderBoard(data, maxNumberToShowOnLeaderboard, false, gameId, gameNumberOfPositions, function (gameId, leaderboardInformation) {
                                                $(".flex-game-leader-board-holder", $("#game" + gameId, element)).empty();
                                                $(".flex-game-leader-board-holder", $("#game" + gameId, element)).append(leaderboardInformation);
    
                                                if (leaderBoardCount > 0) {
    
                                                    var fullLeaderBoardButton = $("<input type=\"button\" class=\"flex-game-leader-board-full-show-btn " + currentGameThemeTag + "\" value=\"Show Full Leaderboard\" id=\"fullBoard_" + gameId + "\">");
                                                    $(fullLeaderBoardButton, element).off("click").on("click", function () {
                                                        var buttonName = this.id;
                                                        var id = buttonName.split('_')[1];
                                                        scope.LoadLeaderboardInformationFromGame(id, "user", function (data, id) {
                                                            scope.BuildFullLeaderboard(data, id, gameNumberOfPositions);
                                                            let game = scope.GameList.find(g => g.FlexGameId == parseInt(id));
                                                            if (game.GameTypeId == 2) {
                                                                scope.ChangeFullLeaderboardDisplay("team", null);
                                                                $("input:radio[name=fullLeaderBoardDisplay]", element).val(["team"]);
                                                            }
                                                        });
                                                    });
                                                    $(".flex-game-leader-board-holder", $("#game" + gameId, element)).append(fullLeaderBoardButton);
                                                }
                                            });
                                        }
                                    });
    
                                    if (gameboardImage != null && gameboardImage != "") {
                                        $(gameBoard).append($("<img src=\"" + window.location.protocol + "//" + window.location.hostname + gameboardImage + "\" class=\"flex-game-board-image " + currentGameThemeTag + "\">"));
                                    } else {
                                        //$(gameBoard).html("No Gameboard to display.");
                                    }
                                    var gameScoring = null;
                                    if (currentGame.ThemeIdSource != null && currentGame.ThemeIdSource.RequiresScoringBasis != false) {
                                        gameScoring = $("<div class=\"flex-game-scoring-board-display-holder " + currentGameThemeTag + "\" />");
                                        $(gameScoring).append($("<div class=\"flex-game-scoring-board-display " + currentGameThemeTag + "\" id=\"scoringDisplay_" + currentGame.FlexGameId + "\" />"));
    
                                        scope.GetScoringRangesForGame(currentGame.FlexGameId, function (data, gameId) {
                                            var scoringList = $.parseJSON(data.scoringRangeList); //JSON.parse(data.scoringRangeList);
                                            //var itemGameId = 0;
    
                                            var scoringTable = $("<table />");
    
                                            for (var i = 0; i < scoringList.length; i++) {
                                                var currentItem = scoringList[i];
                                                //itemGameId = currentItem.GameId;
    
                                                if (i == 0) {
    
                                                    var itemHeaderRow = $("<tr />");
                                                    var range1LowHeader = $("<th class=\"flex-game-scoring-board-header flex-game-scoring-board-item " + currentGameThemeTag + "\" />");
                                                    range1LowHeader.append($("<label>Low Score</label>"));
                                                    var range1HighHeader = $("<th class=\"flex-game-scoring-board-header flex-game-scoring-board-item " + currentGameThemeTag + "\" />");
                                                    range1HighHeader.append($("<label>High Score</label>]"));
                                                    var pointsForRangeHeader = $("<th class=\"flex-game-scoring-board-header flex-game-scoring-board-item " + currentGameThemeTag + "\" />");
                                                    pointsForRangeHeader.append($("<label>Points</label>"));
    
    
                                                    itemHeaderRow.append(pointsForRangeHeader);
                                                    itemHeaderRow.append(range1LowHeader);
                                                    itemHeaderRow.append(range1HighHeader);
                                                    scoringTable.append(itemHeaderRow);
                                                }
                                                var itemRow = $("<tr />");
    
                                                let range1Low = $("<td class=\"flex-game-scoring-board-item " + currentGameThemeTag + "\" />");
                                                if (currentItem.Range1Low != null) {
                                                    range1Low.append($("<label>" + currentItem.Range1Low + "</label>"));
                                                } else {
                                                    range1Low.append($("<label>---</label>"));
                                                }
    
    
                                                var range1High = $("<td class=\"flex-game-scoring-board-item " + currentGameThemeTag + "\"/>");
                                                if (currentItem.Range1High != null) {
                                                    range1High.append($("<label>" + currentItem.Range1High + "</label>"));
                                                } else {
                                                    range1High.append($("<label>---</label>"));
                                                }
    
                                                var pointsForRange = $("<td class=\"flex-game-scoring-board-item " + currentGameThemeTag + "\"/>");
                                                pointsForRange.append($("<label>" + currentItem.Points + "</label>"));
    
                                                itemRow.append(pointsForRange);
                                                itemRow.append(range1Low);
                                                itemRow.append(range1High);
                                                scoringTable.append(itemRow);
                                            }
    
                                            var holder = $("#scoringDisplay_" + gameId, element);
                                            holder.empty();
                                            holder.append(scoringTable);
                                        });
    
                                    }
                                    gameInfo.append(gameBoard);
                                    gameInfo.append(gameTheme);
                                    gameInfo.append(gameScoring);
                                    gameInfo.append(gameStatus);
                                    gameInfo.append(gameName);
                                    var gameOverviewHolder = $("<div class=\"flex-game-game-overview-holder " + currentGameThemeTag + "\" />");
                                    gameOverviewHolder.append(gameAdmin);
                                    gameOverviewHolder.append(gameDateCombine);
                                    gameOverviewHolder.append(gameParticpantCount);
                                    gameOverviewHolder.append(gameTeamCount);
                                    gameOverviewHolder.append(gameType);
                                    gameOverviewHolder.append(gameScoringArea);
                                    gameOverviewHolder.append(scoringType);
                                    gameOverviewHolder.append(scoringBasis);
                                    gameOverviewHolder.append(scoringOption);
                                    gameOverviewHolder.append(gameCreationInformation);
                                    //gameOverviewHolder.append(gamePositions);
                                    gameOverviewHolder.append(gamePointsToEnd);
                                    gameOverviewHolder.append(rewardInfo);
                                    gameOverviewHolder.append("<div class=\"clearfix\"></div>");
    
    
                                    gameInfo.append(gameOverviewHolder);
                                    var gameParametersHolder = $("<span class=\"flex-game-game-parameters-holder " + currentGameThemeTag + "\" />");
                                    gameInfo.append($("<div class=\"clearfix\"></div>"));
                                    gameInfo.append(gameParametersHolder);
    
                                    gameInfo.append(gameLeaderBoard);
                                    gameInfo.append($("<div class=\"clearfix\"/>"));
                                    if (currentGame.Status == "D" || currentGame.Status == "A" || currentGame.Status == "X") {
    
    
    
                                        var gameScoreRangeButton = $("<button class=\"game-controls-button editgamescoring-btn\" id=\"manageGameRanges_" + currentGame.FlexGameId + "\"><i class=\"fad fa-edit\"></i> Edit Game Scoring</button>");
                                        $(gameScoreRangeButton, element).on("click", function () {
                                            var buttonName = this.id;
                                            var id = buttonName.split('_')[1];
                                            scope.LoadEditForm(id);
                                        });
    
                                        if (currentGame.ScoringBasisId == 2 && currentGame.ThemeIdSource != null && currentGame.ThemeIdSource.RequiresScoringBasis == true) {
                                            gameLeaderBoard.append(gameScoreRangeButton);
                                        }
                                        var buttonText = "Start Game";
                                        if (currentGame.Status == "X") {
                                            buttonText = "Re-start Game";
                                        }
                                        var startGameButton = $("<button class=\"game-controls-button\" id=\"startGame_" + currentGame.FlexGameId + "\" ><i class=\"fad fa-play-circle\"></i> " + buttonText + "</button>");
                                        $(startGameButton, element).on("click", function () {
                                            var buttonName = this.id;
                                            var id = buttonName.split('_')[1];
                                            scope.StartGame(id);
                                        });
    
                                        gameParametersHolder.append(startGameButton)
    
    
                                        var editButton = $("<button class=\"game-controls-button game-controls-button_outline\" id=\"editGame_" + currentGame.FlexGameId + "\"><i class=\"fad fa-edit\"></i> Edit Game</button>");
                                        $(editButton, element).on("click", function () {
                                            var buttonName = this.id;
                                            var id = buttonName.split('_')[1];
    
                                            scope.LoadEditForm(id, false, function () {
                                                HandleButtonsAvailable();
                                            });
    
                                        });
    
    
                                        gameParametersHolder.append(editButton)
                                    }
                                    //if (currentGame.Status == "I" || currentGame.Status == "X") {
                                    if (currentGame.Status == "I") {
                                        var reactivateGameButton = $("<input type=\"button\" value=\"Reactivate Game\" id=\"reactivateGame_" + currentGame.FlexGameId + "\" >");
                                        $(reactivateGameButton, element).on("click", function () {
                                            var buttonName = this.id;
                                            var id = buttonName.split('_')[1];
                                            scope.ReactivateGame(id);
                                        });
                                        gameParametersHolder.append(reactivateGameButton);
                                    }
    
                                    if (currentGame.Status == "P" || currentGame.Status == "X") {
                                        var stopGameButton = $("<button class=\"game-controls-button\" id=\"stopGame_" + currentGame.FlexGameId + "\" ><i class=\"fad fa-stop\"></i> End Game</button>");
                                        $(stopGameButton, element).on("click", function () {
                                            var buttonName = this.id;
                                            var id = buttonName.split('_')[1];
                                            scope.StopGame(id);
                                        });
    
                                        gameParametersHolder.append(stopGameButton);
    
                                        if (currentGame.Status != "X") {
                                            var pauseGameButton = $("<button class=\"game-controls-button\" id=\"pauseGame_" + currentGame.FlexGameId + "\" ><i class=\"fas fa-pause\"></i> Pause Game</button>");
                                            $(pauseGameButton, element).on("click", function () {
                                                var buttonName = this.id;
                                                var id = buttonName.split('_')[1];
                                                scope.PauseGame(id, function () {
                                                    scope.LoadGameListForUser();
                                                });
                                            });
                                            gameParametersHolder.append(pauseGameButton);
                                        }
    
                                    }
                                    if (currentGame.Status == "C") {
                                        var finalizeGameButton = $("<button class=\"game-controls-button\" id=\"finalizeGame_" + currentGame.FlexGameId + "\"><i class=\"fad fa-check-circle\"></i> Finalize Game</button>");
                                        $(finalizeGameButton, element).on("click", function () {
                                            var buttonName = this.id;
                                            var id = buttonName.split('_')[1];
                                            scope.FinalizeGame(id, function () {
                                                scope.WriteUserStatus("Finalization complete. <br> Reloading Game listing.", 5000);
                                                scope.ReloadCurrentData();
                                            });
                                        });
                                        gameParametersHolder.append(finalizeGameButton);
                                    }
                                    var copyGameButton = $("<button class=\"game-controls-button game-controls-button_outline\" id=\"copyGame_" + currentGame.FlexGameId + "\" ><i class=\"fad fa-clone\"></i> Clone Game</button>");
                                    $(copyGameButton, element).on("click", function () {
                                        var buttonName = this.id;
                                        var id = buttonName.split('_')[1];
                                        scope.CopyGame(id);
                                        5
                                    });
    
                                    gameParametersHolder.append(copyGameButton);
    
                                    if (currentGame.Status == "D" || currentGame.Status == "A" || currentGame.Status == "I") {
                                        var deleteGameButton = $("<button class=\"game-controls-button game-controls-button_outline\" id=\"deleteGame_" + currentGame.FlexGameId + "\" ><i class=\"fad fa-trash-alt\"></i> Delete Game</button>");
                                        $(deleteGameButton, element).on("click", function () {
                                            var buttonName = this.id;
                                            var id = buttonName.split('_')[1];
                                            scope.DeleteGame(id, function () {
                                                scope.ReloadCurrentData();
                                            });
                                        });
    
                                        gameParametersHolder.append(deleteGameButton);
    
                                    }
                                    if(currentGame.Status == "F")
                                    {
                                        let archiveGameButton = $("<button class=\"game-controls-button game-controls-button_outline\" id=\"archiveGame_" + currentGame.FlexGameId + "\" ><i class=\"fad fa-box-archive\"></i> Archive Game</button>");
                                        $(archiveGameButton, element).on("click", function(){
                                            let buttonName = this.id;
                                            let id = buttonName.split("_")[1];
                                            scope.ArchiveGame(id, function(){
                                                scope.ReloadCurrentData();
                                            });
                                        });
                                        gameParametersHolder.append(archiveGameButton);
                                    }
                                    var loadDataButton = $("<button class=\"game-controls-button game-controls-button_outline\" id=\"loadDataAdmin_" + currentGame.FlexGameId + "\"><i class=\"fas fa-sync-alt\"></i> Calculate Score</button>"); //used to be Refresh Data
                                    $(loadDataButton, element).on("click", function () {
                                        var buttonName = this.id;
                                        var id = buttonName.split('_')[1];
                                        scope.WriteUserStatus("Starting data update...", 2000);
                                        scope.ShowLoadingIndicator(buttonName);
                                        scope.UpdateDataForGame(id, function (data, gameId) {
                                            scope.CalculateScoreForGame(gameId, function () {
                                                scope.LoadGameByGameId(gameId, false, false, function () {
                                                    scope.GetLeaderBoardInformationFromGame(gameId, function (data) {
                                                        let newLeaderboardinfo = null;
                                                        let curGame = scope.GameList.find(g => g.FlexGameId == parseInt(gameId));
                                                        if (curGame.GameTypeId == 2) {
                                                            newLeaderboardinfo = BuildTeamLeaderboard(data, maxNumberToShowOnLeaderboard, false, gameId);
                                                        }
                                                        else {
                                                            newLeaderboardinfo = BuildLeaderBoard(data, maxNumberToShowOnLeaderboard, false, gameId);
                                                        }
    
                                                        var gameIdForLeaderboard = gameId;
                                                        let leaderboardData = $.parseJSON(data.leaderBoard);
                                                        if (leaderboardData != null && leaderboardData.length > 0) {
                                                            $("#leaderboard_" + id, element).empty();
                                                            $("#leaderboard_" + id, element).append(newLeaderboardinfo);
                                                            var fullLeaderBoardButton = null;
                                                            if ($("#fullBoard_" + id, element).length > 0) {
                                                                fullLeaderBoardButton = $("#fullBoard_" + id, element);
                                                            } else {
                                                                fullLeaderBoardButton = $("<input type=\"button\" class=\"flex-game-leader-board-full-show-btn " + currentGameThemeTag + "\" value=\"Show Full Leaderboard\" id=\"fullBoard_" + id + "\">");
                                                            }
    
                                                            $(fullLeaderBoardButton, element).off("click").on("click", function () {
                                                                var buttonName = this.id;
                                                                var id = buttonName.split('_')[1];
                                                                scope.LoadLeaderboardInformationFromGame(id, "user", function (data) {
                                                                    scope.BuildFullLeaderboard(data, id, gameNumberOfPositions);
                                                                });
                                                            });
                                                            if ($("#fullBoard_" + id, element) == null) {
                                                                $("#leaderboard_" + id, element).append(fullLeaderBoardButton);
                                                            }
                                                        } else {
                                                            $("#leaderboard_" + id, element).empty();
                                                        }
    
                                                        scope.BuildFullLeaderboard(data, id, gameNumberOfPositions, function () {
                                                            scope.WriteUserStatus("Scoring calculation complete.<br/>Leaderboards have been updated.", 4000);
                                                            scope.HideLoadingIndicator(gameId);
                                                        });
                                                    });
    
                                                });
                                            });
                                        });
                                    });
                                    gameParametersHolder.append(loadDataButton);
                                    gameParametersHolder.append(gameUpdateHolder);
    
                                    let editManualScoringButton = $("<button class=\"game-controls-button game-controls-button_outline game-control-button-manual-score\" id=\"manualScoring_" + currentGame.FlexGameId + "\">Enter Custom Scores</button>");
                                    $(editManualScoringButton, element).off("click").on("click", function () {
                                        let buttonId = this.id;
                                        let gameId = buttonId.split('_')[1];
                                        $("#manual-entry-button-filter-clear", element).trigger("click");
                                        scope.WriteUserStatus("Collecting current manual entry information for game...");
                                        LoadManualScoringEntryForm(gameId, function () {
                                            scope.HideUserStatus();
                                            ShowManualScoringEntryForm();
                                        });
                                    });
                                    let assignRewardsButton = $("<button class=\"game-controls-button game-controls-button_outline game-control-button-assign-rewards\" id=\"assignRewards_" + currentGame.FlexGameId + "\">Assign Game Rewards</button>");
                                    $(assignRewardsButton, element).off("click").on("click", function () {
                                        let buttonId = this.id;
                                        let gameId = buttonId.split('_')[1];
                                        scope.CurrentGameRewardAssignments.length = 0;
    
                                        LoadRewardsAssignmentEntryForm(gameId, function (gameId, itemsToRender) {
                                            RenderRewardsAssignmentEntryForm(gameId, itemsToRender, function () {
                                                ShowRewardsAssignmentEntryFrom(function () {
                                                    scope.HideUserStatus();
                                                });
                                            });
                                        });
                                    });
                                    //only allow for the entry buttons when there are participants found.
                                    if (currentGame != null && currentGame.GameParticipants != null && currentGame.GameParticipants.length > 0) {
                                        gameParametersHolder.append(editManualScoringButton);
                                        gameParametersHolder.append(assignRewardsButton);
                                    }
                                    let isUserEntry = (currentGame.ScoringTypeId == 3);
                                    if (!isUserEntry) {
                                        $(editManualScoringButton, element).hide();
                                        $(assignRewardsButton, element).hide();
                                    }
                                    let chatButtonMessage = "Enable Chat";
                                    let chatButtonMessageClass = "fa-comment";
                                    if (currentGame.HasDiscussionBoard == true) {
                                        chatButtonMessage = "Disable Chat";
                                        chatButtonMessageClass = "fa-comment-slash";
                                    }
                                    let chatToggleButton = $("<button class=\"game-controls-button game-controls-button_half game-controls-button_outline game-control-button-toggle-chat\" id=\"toggleChat_" + currentGame.FlexGameId + "\"><i class=\"far " + chatButtonMessageClass + "\"></i> " + chatButtonMessage + "</button>");
                                    $(chatToggleButton, element).off("click").on("click", function () {
                                        let buttonId = this.id;
                                        let gameId = buttonId.split('_')[1];
                                        scope.WriteUserStatus("Toggling chat...", 10000);
                                        ToggleChatForGame(gameId, function () {
                                            scope.WriteUserStatus("Reloading game list...");
                                            scope.LoadGameListForUser(legacyContainer.scope.TP1Username, function (data) {
                                                scope.DisplayGameList(data);
                                                scope.HideUserStatus();
                                            });
                                        });
                                    });
                                    gameParametersHolder.append(chatToggleButton);
    
                                    if (currentGame.Status != "D") {
                                        let manageRewardsButton = $("<button class=\"game-controls-button game-controlls-button_half game-controls-button_outline\" id=\"btnRunningGameManageRewards_" + currentGame.FlexGameId + "\">Manage Rewards</button>");
                                        manageRewardsButton.on("click", function () {
                                            let buttonId = this.id;
                                            let gameId = buttonId.split("_")[1];
                                            scope.LoadEditForm(gameId, false, function () {
                                                LoadCurrentGameSpinnerPrizeOptions(gameId);
                                                LoadCurrentGamePrizeOptions(gameId);
    
                                                $("#prizes-tab", element).click();
                                            });
                                        });
    
                                        gameParametersHolder.append(manageRewardsButton);
                                    }
                                    $(".flex-game-list-panel", element).append(gameInfo);
                                }
                            }
                        }
                        scope.HideUserStatus();
                        ScrollToGame(gameFound);
                        if (callback != null) {
                            callback();
                        }
                    }
                }, 500);
            };
            function ScrollToGame(gameExistsInList, callback) {
                var scrollTopValue = 0;
                if (gameExistsInList && !scope.IgnoreNavigateToGame) {
                    if ($("#game" + scope.GameIdToLoad) != null) {
                        var divPosition = $("#game" + scope.GameIdToLoad).offset();
                        var divHolderPosition = $(".flex-game-list-panel").offset();
                        scrollTopValue = divPosition.top - (divHolderPosition.top + 50);
                    }
                }

                $(".flex-game-list-panel").animate({ scrollTop: scrollTopValue }, "slow");

                if (callback != null) {
                    callback();
                }

            }
            function GetStatusNameFromCode(code, callback) {
                //TODO (clint): Load this information from the database?
                //Need some sort of table that will hold this data
                var returnValue = "Pre-Game";

                switch (code) {
                    case "C":
                        //returnValue = "Complete - Not Finalized";
                        returnValue = "In Review";
                        break;
                    case "F":
                        returnValue = "Final";
                        break;
                    case "P":
                        returnValue = "Live";
                        break;
                    case "I":
                        returnValue = "Paused/Inactive";
                        break;
                    case "O":
                        returnValue = "Archived";
                        break;
                    case "X":
                        returnValue = "Paused";
                        break;
                    case "D":
                        returnValue = "In-Development";
                        break;
                    default:
                        returnValue = "Pre-Game";
                        break;
                }

                if (callback != null) {
                    callback(returnValue);
                }
                return returnValue;
            }
            function GetGameStatusClassFromCode(code, callback) {
                //TODO (clint): Load this information from the database?
                //Need some sort of table that will hold this data

                var returnValue = "active";

                switch (code) {
                    case "C":
                        returnValue = "flex-game-status-complete";
                        break;
                    case "F":
                        returnValue = "flex-game-status-finalized";
                        break;
                    case "P":
                        returnValue = "flex-game-status-inprogress";
                        break;
                    case "I":
                        returnValue = "flex-game-status-inactive";
                        break;
                    case "O":
                        returnValue = "flex-game-status-archived";
                        break;
                    case "X":
                        returnValue = "flex-game-status-paused";
                        break;
                    case "X":
                        returnValue = "flex-game-status-indevelopment";
                        break;
                    default:
                        returnValue = "flex-game-status-active";
                        break;
                }
                if (callback != null) {
                    callback(returnValue);
                }
                return returnValue;
            }
            scope.UpdateDataForGame = function (gameId, callback) {
                scope.WriteUserStatus("Updating game data...", 10000);
                let game = scope.GameList.find(g => g.FlexGameId == gameId);
                if (game != null) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "flex",
                            cmd: "pushScoringData",
                            mqfNumber: game.AcuityKpiMqfId,
                            startdate: new Date(game.GameStartDate).toLocaleDateString("en-US"),
                            enddate: new Date(game.GameEndDate).toLocaleDateString("en-US"),
                            subtypeid: game.AcuityKpiSubType,
                            gameid: gameId
                        },
                        dataType: "json",
                        cache: false,
                        error: function () {
                            console.log(a$.ajaxerror);
                        },
                        success: function (data) {

                            if (callback != null) {
                                callback(data, gameId);
                            }
                        }
                    });
                }
            };
            scope.CalculateScoreForGame = function (id, callback) {
                scope.WriteUserStatus("Calculating score for game...", 2000);

                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "calculateScoreForGame",
                        gameid: id
                    },
                    dataType: "json",
                    cache: false,
                    error: function () {
                        a$.ajaxerror;
                        LogErrorWithCallback(callback);
                    },
                    success: function (data) {
                        scope.LoadGameByGameId(id, false, true, function () {
                            if (callback != null) {
                                callback(data, id);
                            }
                        });
                    }
                });
            };
            scope.LoadEditForm = function (id, retry, callback) {
                hasFreeFormRewardChanged = false;
                scope.WriteUserStatus("Loading game data for you to edit...", 10000);
                $(".flex-game-editor-sub-game-type", element).hide();
                let game = scope.GameList.find(g => g.FlexGameId == id);
                ShowTab("all");
                if (game == null) {
                    if (!retry) {
                        scope.LoadGameByGameId(id);
                    } else {
                        //TODO: (clint) Handle the coming back through of the information once
                        //we have tried to reload the information.                        
                        console.info("LoadEditForm() - second attempt to load game with gameId: " + id);
                    }
                }
                if (game != null) {

                    $(".flex-game-form-current-game-id", element).val(game.FlexGameId);
                    $(".flex-game-editor-name", element).val(game.Name);
                    $(".flex-game-theme-list", element).val(game.ThemeId);
                    $(".flex-game-editor-start-date", element).val(new Date(game.GameStartDate).toLocaleDateString("en-US"));
                    $(".flex-game-editor-end-date", element).val(new Date(game.GameEndDate).toLocaleDateString("en-US"));
                    $(".flex-game-editor-status", element).val(game.Status);
                    let currentGameAdminInListOptions = false;
                    $(".flex-game-editor-supervisor-list option", element).each(function(){
                        if(this.value.toLowerCase() == game.AdminUserId.toLowerCase())
                        {
                            currentGameAdminInListOptions = true;
                            return;
                        }
                    });
                    if(currentGameAdminInListOptions == false)
                    {
                        let userName = game.AdminUserId;
                        if(game.AdminUserIdSource != null)
                        {
                            userName = game.AdminUserIdSource.UserFullName;
                        }
                        $(".flex-game-editor-supervisor-list", element).append($('<option />', { value: game.AdminUserId.toLowerCase(), text: userName }));
                    }
                    $(".flex-game-editor-supervisor-list", element).val(game.AdminUserId);

                    LoadSubGameTypeList(game.GameTypeId, game.SubGameTypeId);

                    $(".flex-game-editor-game-type", element).val(game.GameTypeId);
                    $(".flex-game-editor-sub-game-type", element).val(game.SubGameTypeId);

                    $(".flex-game-editor-scoring-basis", element).val(game.ScoringBasisId);
                    $(".flex-game-editor-scoring-area", element).val(game.AcuityKpiMqfId);
                    $(".flex-game-editor-scoring-options", element).val(game.ScoringOptionId);
                    $(".flex-game-editor-end-points", element).val(game.PointsToEndGame);

                    LoadSubScoringList(game.AcuityKpiMqfId);

                    $(".flex-game-editor-scoring-sub-area", element).val(game.AcuityKpiSubType);
                    $(".flex-game-editor-scoring-type", element).val(game.ScoringTypeId);
                    $(".flex-game-editor-reward", element).val(game.GameReward);

                    if (game.AcuityKpiMqfId == 0 || (game.AcuityKpiMqfId >= 900000 && game.AcuityKpiMqfId <= 999999 )) //Balanced score
                    {
                        $(".flex-game-editor-scoring-type", element).attr("disabled", true);
                        $(".flex-game-editor-scoring-basis", element).attr("disabled", true);
                    }
                    else {

                        $(".flex-game-editor-scoring-type", element).removeAttr("disabled");
                        $(".flex-game-editor-scoring-basis", element).removeAttr("disabled");
                    }

                    if (game.ThemeIdSource != null) {
                        $(".flex-game-theme-type-list", element).val(game.ThemeIdSource.ThemeTypeId);
                        scope.HandleThemeTypeChange(game.ThemeIdSource.ThemeTypeId);
                        //scope.HandleGameThemeChange(game.ThemeIdSource.ThemeId);

                        if (game.ThemeIdSource.FinishTypeIdSource != null) {
                            $(".flex-game-finish-type", element).text(game.ThemeIdSource.FinishTypeIdSource.FinishTypeName);
                        } else {
                            $(".flex-game-finish-type", element).text("Finish Type Unknown");
                        }
                    }
                    $(".flex-game-theme-list", element).val(game.ThemeId);
                    $(".flex-game-editor-phrase-value", element).val(game.GamePhraseValue);

                    $(".flex-game-editor-has-discussion-board", element).val(new Boolean(game.HasDiscussionBoard).toString());
                    //$(".flex-game-editor-has-prize-options", element).val(new Boolean(game.HasPrizeOptions).toString());
                    $("#hasPrizeOptions", element).prop("checked", (game.HasPrizeOptions == true));
                    //$("#hasSpinnerOptions", element).prop("checked", (game.HasSpinnerOptions == true));
                    
                    $("#hasTieBreakerScoring", element).val(new Boolean(game.HasTieBreakerScoring).toString());
                    $("#tieBreakerKpi_MqfNumber", element).val(game.TieBreakerKpi_MqfNumber);
                    $("#tieBreakerKpi_ScoringTypeId", element).val(game.TieBreakerKpi_ScoringTypeId);

                    scope.WriteUserStatus("Loading game scoring data...", 10000);
                    scope.LoadGameScoringRange(game.FlexGameId, null, null);
                    scope.WriteUserStatus("Collecting participants...", 10000);
                    LoadPossibleParticipantsFiltered();
                    HandleDisplaySections(game, true);
                    scope.HandleGameThemeChange(game.ThemeId);
                    RenderPossibleRewardTypePositions();
                    RenderPossiblePrizeOptions();
                    RenderPossibleSpinnerOptions();
                    RenderPossibleTrophyOptions();
                    LoadCurrentGamePrizeOptions(game.FlexGameId);
                    LoadCurrentGameSpinnerPrizeOptions(game.FlexGameId);
                    LoadUserBudgetInformation(game.AdminUserId);
                    HandleGamePrizeDisplay(game);
                    HandleButtonsAvailable(game);
                    ShowEditForm();
                    HandleButtonsAvailable();
                }
                if (callback != null) {
                    callback();
                }
            };
            function HandleDisplaySections(gameObject, showAllSections, callback) {
                var currentDisplayStepNumber = parseInt($("#editor-step").val());
                var saveButtonText = "Save";

                let themeId = $(".flex-game-theme-list").val();
                let theme = scope.ThemeOptions.find(t => t.ThemeId == parseInt(themeId));
                let showScoring = true;
                let showPrizes = true;

                if (theme != null) {
                    showScoring = theme.RequiresScoringBasis;
                }

                if (showAllSections) {
                    ShowTab("all");
                    $(".flex-game-editor-game-basics-holder-step", element).show();
                    $(".flex-game-editor-scoring-holder-step", element).show();
                    $(".flex-game-editor-participants-holder-step", element).show();
                    $(".flex-game-editor-prizes-holder-step", element).show();

                    saveButtonText = "Save"
                    currentDisplayStepNumber = 3;
                } else {
                    HideTab("all");
                    $(".flex-game-editor-game-basics-holder-step", element).hide();
                    $(".flex-game-editor-scoring-holder-step", element).hide();
                    $(".flex-game-editor-participants-holder-step", element).hide();
                    $(".flex-game-editor-prizes-holder-step", element).hide();
                    if (gameObject != null && gameObject.FlexGameId > 0) {
                        if (currentDisplayStepNumber <= 0) {
                            currentDisplayStepNumber = 1;
                        }
                        showPrizes = (gameObject.FlexGameId > 0);

                        switch (currentDisplayStepNumber) {
                            case 2:
                                showScoring = false;
                                $(".flex-game-editor-game-basics-holder-step", element).hide();
                                $(".flex-game-editor-participants-holder-step", element).show();
                                saveButtonText = "Save and Continue";
                                break;
                            case 3:
                                showScoring = true;
                                $(".flex-game-editor-game-basics-holder-step", element).hide();
                                $(".flex-game-editor-participants-holder-step", element).hide();
                                saveButtonText = "Save";
                                break;
                            default:
                                showScoring = false;
                                $(".flex-game-editor-game-basics-holder-step", element).show();
                                $(".flex-game-editor-participants-holder-step", element).hide();
                                saveButtonText = "Save and Continue";
                                break;
                        }
                    } else {
                        showScoring = false
                        showPrizes = false;
                        $(".flex-game-editor-game-basics-holder-step", element).show();
                        $(".flex-game-editor-participants-holder-step", element).hide();
                        $(".flex-game-editor-prizes-holder-step", element).hide();
                        saveButtonText = "Save and Continue";
                    }
                }
                if (showScoring) {
                    ShowTab("scoring-tab");
                }
                else {
                    HideTab("scoring-tab")
                }

                if (showPrizes) {
                    ShowTab("prize-tab");
                }
                else {
                    HideTab("prize-tab");
                }

                if (saveButtonText != "Save") {
                    $(".flex-game-form-btn-save-and-close", element).hide();
                }
                else {
                    $(".flex-game-form-btn-save-and-close", element).show();
                }
                $(".flex-game-form-btn-save", element).val(saveButtonText);
                $("#editor-step").val(currentDisplayStepNumber + 1);
                if (callback != null) {
                    callback();
                }
            }
            scope.SaveGame = function (gameObject, callback) {
                scope.WriteUserStatus("Saving your game information...", 10000);
                if (gameObject != null) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "flex",
                            cmd: "saveGameInformation",
                            gameinfo: JSON.stringify(gameObject)
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            gameObject.FlexGameId = data.GameId;
                            scope.GameIdToLoad = data.GameId;
                            ClearAllFilterOptions();
                            if (callback != null) {
                                callback(data);
                            }
                        }
                    });
                }
            }
            scope.SaveEditForm = function (callback) {
                scope.WriteUserStatus("Collecting your game data changes...", 10000);
                scope.ClearAdminStatus();

                var currentEditorStep = $("#editor-step").val();

                var gameObject = CollectFormDataForGame();
                if (gameObject != null) {
                    scope.WriteUserStatus("Saving game data...", 10000);
                    scope.SaveGame(gameObject, function () {
                        let editorGameId = parseInt($(".flex-game-form-current-game-id", element).val());
                        if (editorGameId > 0) {
                            scope.WriteUserStatus("Saving rewards and prizes...", 5000);
                            SaveAllRewardItems();
                            SaveAllSpinnerOptionItems();
                            scope.WriteUserStatus("Saving scoring Ranges data...", 10000);
                            scope.SaveAllScoringRangesForGame(function () {
                                scope.ResetScoringRangesAdd();
                                $(".flex-game-scoring-range-table-body", element).empty();
                                if (currentEditorStep >= 4) {
                                    scope.WriteUserStatus("Reloading game data...", 10000);
                                    scope.ReloadCurrentData(function () {
                                        SaveSuccess(null, gameObject.FlexGameId, callback);
                                    });
                                }
                                else {
                                    scope.WriteUserStatus("Confirming game data save...", 10000);
                                    scope.LoadGameByGameId(gameObject.FlexGameId, true, false, function () {
                                        scope.WriteUserStatus("Loading saved information for game...", 10000);
                                        scope.LoadEditForm(gameObject.FlexGameId, function () {
                                            scope.WriteUserStatus("Loading data...", 100000);
                                            scope.HideUserStatus();
                                        });
                                    });
                                }
                            });
                        } else {
                            //scope.WriteUserStatus("Game saved.  Scoring areas are not available.", 2500);
                            scope.LoadEditForm(gameObject.FlexGameId, callback);
                        }
                    });
                }
            };
            function SaveSuccess(data, gameId, callback) {
                scope.WriteUserStatus("Information saved.", 5000);
                $(".flex-game-editor-status", element).removeAttr("disabled");
                $("#editor-step").val(0);
                HideEditForm();
                scope.CalculateScoreForGame(gameId);
                if (callback != null) {
                    callback();
                }
            };
            function UpadateFreeFormRewardForGame(callback) {
                //gameId
                let gameId = $(".flex-game-form-current-game-id", element).val();
                //rewardInfo
                let rewardInfo = $(".flex-game-editor-reward", element).val();
                if (gameId != null && gameId != "") {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "flex",
                            cmd: "updateFreeFormRewardForGame",
                            gameid: gameId,
                            rewardinfo: rewardInfo
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (jsonData) {
                            let index = scope.GameList.findIndex(g => g.FlexGameId == gameId);
                            scope.GameList.splice(index, 1);
                            if (callback != null) {
                                callback();
                            }
                        }
                    });
                }
            }
            function CollectFormDataForGame(callback) {
                var returnObject = new Object();
                var scoringBasisId = parseInt($(".flex-game-editor-scoring-basis", element).val());
                if (scoringBasisId == null || isNaN(scoringBasisId)) {
                    scoringBasisId = 2;
                }
                let gameThemeTypeId = parseInt($(".flex-game-theme-type-list", element).val());
                returnObject.FlexGameId = parseInt($(".flex-game-form-current-game-id", element).val());
                returnObject.Name = $(".flex-game-editor-name", element).val();
                returnObject.ThemeId = parseInt($(".flex-game-theme-list", element).val());
                returnObject.AdminUserId = $(".flex-game-editor-supervisor-list", element).val();
                returnObject.GameTypeId = parseInt($(".flex-game-editor-game-type", element).val());
                returnObject.SubGameTypeId = parseInt($(".flex-game-editor-sub-game-type", element).val());
                returnObject.ScoringTypeId = $(".flex-game-editor-scoring-type", element).val();
                returnObject.ScoringBasisId = scoringBasisId;
                returnObject.GameKpiName = $(".flex-game-editor-scoring-area :selected", element).text();
                returnObject.KpiSource = null;
                returnObject.AcuityKpiMqfId = parseInt($(".flex-game-editor-scoring-area", element).val());
                returnObject.AcuityKpiSubType = parseInt($(".flex-game-editor-scoring-sub-area", element).val());
                let scoringOptionId = $(".flex-game-editor-scoring-options", element).val();

                if ($(".flex-game-editor-scoring-options", element).val() == "") {
                    scoringOptionId = 1;
                }
                //gametypeId 1 = leaderboard game.  TODO: move to an ENUM?
                //if (returnObject.GameTypeId == 1) { 
                if (gameThemeTypeId == 1) {
                    scoringOptionId = 2; //for a leaderboard game type we will set the scoring option to cumulative
                }
                returnObject.ScoringOptionId = parseInt(scoringOptionId);
                returnObject.GameStartDate = new Date($(".flex-game-editor-start-date", element).val()).toLocaleDateString("en-US");
                returnObject.GameEndDate = new Date($(".flex-game-editor-end-date", element).val()).toLocaleDateString("en-US");
                returnObject.Status = $(".flex-game-editor-status", element).val();
                returnObject.EnterDate = new Date().toLocaleDateString("en-US");
                returnObject.EnterBy = legacyContainer.scope.TP1Username;
                if ($(".flex-game-editor-end-points", element).val() == null || $(".flex-game-editor-end-points", element).val() == "") {
                    returnObject.PointsToEndGame = 0;
                } else {
                    returnObject.PointsToEndGame = parseFloat($(".flex-game-editor-end-points", element).val());
                }

                returnObject.SubKpiName = $(".flex-game-editor-scoring-sub-area :selected", element).text();
                returnObject.GameReward = $(".flex-game-editor-reward", element).val();
                returnObject.GamePhraseValue = $(".flex-game-editor-phrase-value", element).val();

                returnObject.HasDiscussionBoard = ($(".flex-game-editor-has-discussion-board", element).val() == "true");
                returnObject.HasPrizeOptions = new Boolean($("#hasPrizeOptions", element).is(":checked"));
                //returnObject.HasSpinnerOptions = new Boolean($("#hasSpinnerOptions", element).is(":checked"));
                returnObject.HasSpinnerOptions = false;
                returnObject.HasTieBreakerScoring = ($("#hasTieBreakerScoring", element).val() == "true");
                returnObject.TieBreakerKpi_MqfNumber = parseInt($("#tieBreakerKpi_MqfNumber", element).val());
                returnObject.TieBreakerKpi_ScoringTypeId = parseInt($("#tieBreakerKpi_ScoringTypeId", element).val());
                
                if (callback != null) {
                    callback(returnObject);
                }

                return returnObject;
            };
            scope.GetLeaderBoardInformationFromGame = function (gameId, callback) {
                let game = scope.GameList.find(g => g.FlexGameId == gameId);
                let loadType = "user";

                if (game != null && game.GameTypeId == 2) {
                    loadType = "team"
                }

                scope.LoadLeaderboardInformationFromGame(gameId, loadType, callback);
            };
            scope.LoadLeaderboardInformationFromGame = function (gameId, displayType, callback) {
                var getLeaderboardCommand = "getLeaderboardForGame";
                if (displayType == null) {
                    displayType = "user";
                }

                switch (displayType.toLowerCase()) {
                    case "team":
                        getLeaderboardCommand = "getTeamsLeaderboardForGame";
                        break;
                }
                let sort = "";
                let game = scope.GameList.find(g => g.FlexGameId == gameId);
                if (game != null) {
                    sort = "phrase";
                }
                //sort
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: getLeaderboardCommand,
                        gameid: gameId,
                        sort: sort
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (callback) {
                            callback(data, gameId);
                        }
                    }
                });
            };
            function BuildLeaderBoard(jsonData, maxItemCountToDisplay, fullDisplay, gameId, maxGamePositions, callback) {
                ResetLeaderboardCounters();                
                var data = $.parseJSON(jsonData.leaderBoard); //JSON.parse(jsonData.leaderBoard);
                let gameName = "";
                if (gameId == null && data.length > 0) {
                    gameId = data[0].GameId;
                }
                let game = scope.GameList.find(g => g.FlexGameId == gameId);
                if (game != null) {
                    gameName = game.Name;
                }
                if (gameName != "") {
                    scope.WriteUserStatus("Building the leaderboard for " + gameName + "...", 10000);
                }
                else {
                    scope.WriteUserStatus("Building the leaderboard...", 10000);
                }

                $("#fullLeaderBoard_GameId", element).val(gameId);
                var builtLeaderboard = $("<div class=\"flex-game-leader-board-snapshot\" id=\"leaderboard_" + gameId + "\" />");

                if (data.length > 0) {
                    //let game = scope.GameList.find(g => g.FlexGameId == gameId);
                    let game = scope.GameList.find(g => g.FlexGameId == gameId);
                    if (game == null) {
                        game = scope.GameList.find(g => g.GameId == gameId);
                    }

                    var gameThemeTypeId = 1;
                    let isPhraseGame = false;
                    let isTeamGame = false;
                    if (game != null) {
                        if (game.ThemeIdSource != null) {
                            gameThemeTypeId = game.ThemeIdSource.ThemeTypeId;
                        }
                    }
                    isPhraseGame = (gameThemeTypeId == 3)
                    isTeamGame = (game.GameTypeId == 2);

                    if (data.length < maxItemCountToDisplay || fullDisplay) {
                        maxItemCountToDisplay = data.length;
                    }
                    var listHolder = $("<div class=\"flex-game-leader-board-list\" />");
                    var listingHeader = $("<div class=\"flex-game-leader-board-list-item_header\" />");
                    var rankHeader = $("<div class=\"header-item rank-item\" />");
                    rankHeader.text("Rank")
                    var nameHeader = $("<div class=\"header-item name-item\" />");
                    nameHeader.text("Name")
                    var teamNameHeader = $("<div class=\"header-item teamname-item\" />");
                    teamNameHeader.text("Team Name")
                    var scoreHeader = $("<div class=\"header-item score-item\" />");
                    scoreHeader.text("Score")
                    var scoringChancesHeader = $("<div class=\"header-item score-chance-item\" />");
                    scoringChancesHeader.text("Scoring Chances")

                    listingHeader.append(rankHeader);
                    listingHeader.append(nameHeader);
                    listingHeader.append(teamNameHeader);
                    listingHeader.append(scoreHeader);
                    listingHeader.append(scoringChancesHeader);


                    listHolder.append(listingHeader);

                    for (var i = 0; i < maxItemCountToDisplay; i++) {
                        var item = data[i];
                        var displayName = item.UserId;
                        var boardPositonsCompleted = parseInt(item.BoardPositions) || 0;
                        var completionPercentage = 0;
                        var leaderBoardColor = "hotpink";
                        var tripsAroundTheSun = 0;
                        var remainder = 0;
                        var amountIntoNext = 0;

                        if (maxGamePositions != null && maxGamePositions != 0) {
                            maxGamePositions = parseInt(maxGamePositions);
                            if (boardPositonsCompleted < maxGamePositions) {
                                tripsAroundTheSun = 0;
                                completionPercentage = parseFloat(boardPositonsCompleted / maxGamePositions);
                                amountIntoNext = boardPositonsCompleted;
                            } else {
                                var currentVal = boardPositonsCompleted;
                                while (currentVal > maxGamePositions) {
                                    tripsAroundTheSun += 1;
                                    currentVal -= maxGamePositions;
                                }

                                amountIntoNext = boardPositonsCompleted - (tripsAroundTheSun * maxGamePositions);

                                completionPercentage = parseFloat(amountIntoNext / maxGamePositions);
                            }

                            if (completionPercentage == 0 && tripsAroundTheSun > 0) {
                                completionPercentage = 0.004;
                            }

                            leaderBoardColor = GetLeaderboardColor(tripsAroundTheSun);
                        }

                        if (item.KpiScoreTotal == 0 && tripsAroundTheSun == 0) {
                            completionPercentage = 0.004;
                            leaderBoardColor = GetLeaderboardColor(-1); //no scoring information, use the default color;
                        }

                        var completionPercentageString = parseFloat(completionPercentage).toLocaleString('en-US', { style: 'percent', maximumSignificantDigits: 2 });
                        if (item.UserIdSource != null) {
                            displayName = item.UserIdSource.UserFullName;
                            if (item.UserIdSource.DepartmentCode != null && item.UserIdSource.DepartmentCode != "") {
                                displayName += " - " + item.UserIdSource.DepartmentCode;
                            }
                        }
                        //TODO(clint): Fix this to better build the row information                        
                        if (isPhraseGame == true && !isTeamGame) {
                            let phraseItem = $("<div class=\"flex-game-leader-board-list-item\" />");;
                            let rankItem = $("<div class=\"rank-item\" />");
                            rankItem.append(item.StackRank);
                            let nameItem = $("<div class=\"name-item\" />");
                            nameItem.append(displayName);
                            let teamNameItem = $("<div class=\"teamname-item\" />");

                            let userAssignment = scope.UserAssignments.find(a => a.UserId == item.UserId);
                            let displayTeamName = "";
                            if (userAssignment != null) {
                                if (userAssignment.length > 1) {
                                    displayTeamName = userAssignment.join(",");
                                }
                                else {
                                    displayTeamName = userAssignment.TeamName;
                                }
                            }

                            teamNameItem.append(displayTeamName);
                            let scoreItem = $("<div class=\"score-item\" />");
                            scoreItem.append(item.BoardPositions);

                            var scoringChances = $("<div class=\"score-chance-item\" />");
                            scoringChances.text(item.ScoringChances)


                            phraseItem.append(rankItem);
                            phraseItem.append(nameItem);
                            phraseItem.append(teamNameItem);
                            phraseItem.append(scoreItem);
                            phraseItem.append(scoringChances);

                            BuildPhraseScoreboardItem(game, item.BoardPositions, phraseItem);
                            listHolder.append(phraseItem);
                        }
                        else {
                            BuildLeaderboardItem(gameThemeTypeId, (i + 1), displayName, item, function (listItem) {
                                listHolder.append(listItem);
                            });
                        }
                    }

                    builtLeaderboard.append(listHolder);

                } else {
                    let noLeaderboardMessage = "No Leaderboard Data found.";
                    if (game != null) {
                        if (game.GameParticipants != null && game.GameParticipants.length == 0) {
                            noLeaderboardMessage = "Game currently has no participants.";
                            builtLeaderboard = "<p class=\"left\"><em>" + noLeaderboardMessage + "</em></p>";
                        }
                        else {
                            BuildParticipantOnlyLeaderboard(game, builtLeaderboard);
                        }
                    }
                    else {
                        builtLeaderboard = "<p class=\"left\"><em>" + noLeaderboardMessage + "</em></p>";
                    }
                }
                if (callback != null) {
                    callback(gameId, builtLeaderboard);
                }

                return builtLeaderboard;
            }
            function BuildParticipantOnlyLeaderboard(gameObject, renderToObject) {
                var listHolder = $("<div class=\"flex-game-leader-board-list\" />");
                var listingHeader = $("<div class=\"flex-game-leader-board-list-item_header\" />");
                var rankHeader = $("<div class=\"header-item rank-item\" />");
                rankHeader.text("Rank");
                var nameHeader = $("<div class=\"header-item name-item\" />");
                nameHeader.text("Name");
                var teamNameHeader = $("<div class=\"header-item teamname-item\" />");
                teamNameHeader.text("Team Name");
                var scoreHeader = $("<div class=\"header-item score-item\" />");
                scoreHeader.text("Score");
                var scoringChancesHeader = $("<div class=\"header-item score-chance-item\" />");
                scoringChancesHeader.text("Scoring Chances");

                listingHeader.append(rankHeader);
                listingHeader.append(nameHeader);
                listingHeader.append(teamNameHeader);
                listingHeader.append(scoreHeader);
                listingHeader.append(scoringChancesHeader);

                listHolder.append(listingHeader);
                let maxCountParticipants = gameObject.GameParticipants.length;
                if (maxCountParticipants > 5) {
                    maxCountParticipants = 5;
                }
                for (let pIndex = 0; pIndex < maxCountParticipants; pIndex++) {
                    let dataItem = gameObject.GameParticipants[pIndex];
                    let currentDisplayRowType = "";
                    if (pIndex % 2 != 0 && pIndex > 0) {
                        currentDisplayRowType = "alt";
                    }

                    let participantListItem = $("<div class=\"flex-game-leader-board-list-item\" />");
                    let rankItem = $("<div class=\"rank-item " + currentDisplayRowType + "\" />");
                    let nameItem = $("<div class=\"name-item " + currentDisplayRowType + "\" />");
                    let teamNameItem = $("<div class=\"teamname-item " + currentDisplayRowType + "\" />");
                    let scoreItem = $("<div class=\"score-item " + currentDisplayRowType + "\" />");
                    let scoringChanceItem = $("<div class=\"score-chance-item " + currentDisplayRowType + "\" />");

                    let userAssignment = scope.UserAssignments.find(a => a.UserId == dataItem.UserId);
                    let displayTeamName = "";

                    if (userAssignment != null) {
                        if (userAssignment.length > 1) {
                            displayTeamName = userAssignment.join(",");
                        }
                        else {
                            displayTeamName = userAssignment.TeamName;
                        }
                    }

                    rankItem.append("");
                    let participantName = dataItem.UserId;
                    participantName = dataItem.UserFullName;
                    if (dataItem.DepartmentCode != null && dataItem.DepartmentCode != "") {
                        participantName += " - " + dataItem.DepartmentCode;
                    }
                    nameItem.append(participantName);

                    teamNameItem.append(displayTeamName);
                    scoreItem.append("");
                    scoringChanceItem.append("");

                    participantListItem.append(rankItem);
                    participantListItem.append(nameItem);
                    participantListItem.append(teamNameItem);
                    participantListItem.append(scoreItem);
                    participantListItem.append(scoringChanceItem);

                    listHolder.append(participantListItem);
                }

                $(renderToObject).append(listHolder);
            }
            function BuildLeaderboardItem(gameThemeTypeId, counter, displayName, dataItem, callback) {
                var returnItem = $("<div class=\"flex-game-leader-board-list-item\" />");;
                var item = dataItem;
                let game = null;
                let themeId = null;
                if (item.GameId != null) {
                    game = scope.GameList.find(g => g.FlexGameId == item.GameId);
                    themeId = game.ThemeId;
                }
                var displayCounter = item.StackRank || counter;
                var currentStack = parseInt(scope.CurrentStackRank) || parseInt(item.StackRank);
                let itemStackRank = parseInt(item.StackRank) || 0;
                var currentDisplayRowType = scope.DisplayAltRow || "";
                var displayTeamName = "";
                if (currentStack != itemStackRank) {
                    if (currentDisplayRowType == "alt") {
                        currentDisplayRowType = "";
                    } else {
                        currentDisplayRowType = "alt";
                    }
                    scope.CurrentStackRank = item.StackRank;
                    scope.DisplayAltRow = currentDisplayRowType;
                }
                let theme = null;
                if (themeId != null) {
                    theme = scope.ThemeOptions.find(t => t.ThemeId == themeId);
                }
                else {
                    theme = scope.ThemeOptions.find(t => t.ThemeTypeId == gameThemeTypeId);
                }
                var rankItem = $("<div class=\"rank-item " + currentDisplayRowType + "\" />");
                var nameItem = $("<div class=\"name-item " + currentDisplayRowType + "\" />");
                var teamNameItem = $("<div class=\"teamname-item " + currentDisplayRowType + "\" />");
                var scoreItem = $("<div class=\"score-item " + currentDisplayRowType + "\" />");
                var scoringChanceItem = $("<div class=\"score-chance-item " + currentDisplayRowType + "\" />");
                let userAssignment = scope.UserAssignments.find(a => a.UserId == item.UserId);

                if (userAssignment != null) {
                    if (userAssignment.length > 1) {
                        displayTeamName = userAssignment.join(",");
                    }
                    else {
                        displayTeamName = userAssignment.TeamName;
                    }
                }
                if (dataItem.IntraTeamName != null && dataItem.IntraTeamName != "") {
                    if (displayTeamName != "") {
                        displayTeamName += ", ";
                    }
                    displayTeamName += dataItem.IntraTeamName;
                }
                rankItem.text(displayCounter);
                nameItem.text(displayName);
                teamNameItem.text(displayTeamName);

                var score = 0;
                if (theme != null) {
                    if (theme.FinishTypeId == 1 || theme.FinishTypeId == 2) {
                        if (theme.RequiresEndingPointTotal == true) {
                            score = item.BoardPositions;
                        } else {
                            //score = item.KpiScoreAverage;
                            score = GetScoreForGameFromItem(item, game);

                            if (score != null) {
                                score = score.toFixed(2);
                            }
                        }
                    }
                } else {
                    //score = item.KpiScoreAverage;
                    score = GetScoreForGameFromItem(item, game);

                    if (score != null) {
                        score = score.toFixed(2);
                    }
                    scoreItem.text(score);
                }

                scoreItem.text(score);
                scoringChanceItem.text(item.ScoringChances);

                returnItem.append(rankItem);
                returnItem.append(nameItem);
                returnItem.append(teamNameItem);
                returnItem.append(scoreItem);
                returnItem.append(scoringChanceItem);

                if (callback != null) {
                    callback(returnItem);
                }

                return returnItem;
            }
            function GetLeaderboardColor(count) {
                var returnValue = "hotpink";
                if (count > 0) {
                    switch (count) {
                        case 1:
                            returnValue = "yellow";
                            break;
                        case 2:
                            returnValue = "orange";
                            break;
                        case 3:
                            returnValue = "limegreen";
                            break;
                        case 4:
                            returnValue = "maroon";
                            break;
                        case 5:
                            returnValue = "oldlace";
                            break;
                        case 6:
                            returnValue = "darkcyan";
                            break;
                        case 7:
                            returnValue = "aqua";
                            break;
                        case 8:
                            returnValue = "turquoise";
                            break;
                        case 9:
                            returnValue = "blanchedAlmond";
                            break;
                        case 10:
                            returnValue = "blueviolet";
                            break;
                        case 11:
                        case 12:
                        case 13:
                        case 14:
                            returnValue = "cyan";
                            break;
                        default:
                            returnValue = "plum";
                            break;
                    }
                }

                return returnValue;
            }
            scope.BuildFullLeaderboard = function (data, gameId, maxGamePositions, callback) {

                gameId = parseInt(gameId);

                var fullLeaderBoardHolder = $("<div class=\"flex-game-full-leaderboard-holder\" />")

                var fullLeaderBoardMessage = BuildLeaderBoard(data, 0, true, gameId, maxGamePositions)

                let game = scope.GameList.find(g => g.FlexGameId == gameId);
                scope.WriteUserStatus("Building full leadboard information...", 10000);

                if (game != null) {
                    var jsonData = $.parseJSON(data.leaderBoard); //JSON.parse(data.leaderBoard);
                    var currentLeaderBoardCount = jsonData.length + 1;
                    if (game.ThemeIdSource != null && game.ThemeIdSource.ThemeLeaderboardDisplayImageName != null) {
                        var themeLeaderboardImage = game.ThemeIdSource.ThemeLeaderboardDisplayImageName;

                        $(fullLeaderBoardHolder).css("background-image", "url('" + window.location.protocol + "//" + window.location.hostname + themeLeaderboardImage + "')");
                    }

                    for (var p = 0; p < game.GameParticipants.length; p++) {
                        let participant = jsonData.find(x => x.UserId == game.GameParticipants[p].UserId);

                        if (participant == null) {
                            let participantFullName = game.GameParticipants[p].UserFullName;
                            if (game.GameParticipants[p].DepartmentCode != null && game.GameParticipants[p].DepartmentCode != "") {
                                participantFullName += " - " + game.GameParticipants[p].DepartmentCode;
                            }
                            $(fullLeaderBoardMessage).append($("<div class=\"flex-game-leader-board-list-item flex-game-no-score-found\">" + currentLeaderBoardCount + ". " + participantFullName + "  [NO SCORE]</div>"));
                            currentLeaderBoardCount++;
                        }
                    }
                    HandleFullLeaderboardDisplayForGameType(game.GameTypeId);
                }
                fullLeaderBoardHolder.append(fullLeaderBoardMessage);

                $(".flex-game-leaderboard", element).empty();
                $(".flex-game-leaderboard", element).append(fullLeaderBoardHolder);
                //default display type is always user.                
                $("input:radio[name=fullLeaderBoardDisplay]", element).val(["user"]);

                scope.FullAgentLeaderboardHtml = $(".flex-game-leaderboard", element).html();

                if (callback != null) {
                    callback(null);
                } else {
                    scope.ShowFullLeaderBoard();
                }

            };
            function HandleFullLeaderboardDisplayForGameType(gameTypeId, callback) {
                switch (gameTypeId) {
                    case 2:
                        $(".full-leaderboard-display-option-2").show();
                        break;
                    case 3:
                        break;
                    default:
                        $(".full-leaderboard-display-option-2").hide();
                        $(".full-leaderboard-display-option-3").hide();
                        break;
                }
                if (callback != null) {
                    callback();
                }

            }
            function BuildTeamLeaderboard(jsonData, maxItemCountToDisplay, fullDisplay, gameId, maxGamePositions, callback) {
                var data = $.parseJSON(jsonData.leaderBoard) //JSON.parse(jsonData.leaderBoard);                
                let game = scope.GameList.find(g => g.FlexGameId == gameId);

                $("#fullLeaderBoard_GameId", element).val(gameId);
                var builtLeaderboard = $("<div class=\"flex-game-leader-board-snapshot\" id=\"leaderboard_" + gameId + "\" />");

                if (data.length > 0) {
                    if (data.length < maxItemCountToDisplay || fullDisplay) {
                        maxItemCountToDisplay = data.length
                    }

                    var listHolder = $("<div class=\"flex-game-leader-board-list\" />");

                    var listingHeader = $("<div class=\"flex-game-leader-board-list-item_header\" />");
                    var rankHeader = $("<div class=\"header-item header-item_team rank-item\" />");
                    rankHeader.text("Rank")
                    var nameHeader = $("<div class=\"header-item header-item_team team-name-item\" />");
                    nameHeader.text("Team Name")
                    var scoreHeader = $("<div class=\"header-item header-item_team team-score-item\" />");
                    scoreHeader.text("Points")

                    listingHeader.append(rankHeader);
                    listingHeader.append(nameHeader);
                    listingHeader.append(scoreHeader);


                    listHolder.append(listingHeader);


                    for (var i = 0; i < maxItemCountToDisplay; i++) {
                        var item = data[i];
                        var displayName = item.TeamName;
                        var boardPositonsCompleted = parseInt(item.BoardPositions);
                        var completionPercentage = 0;
                        var leaderBoardColor = "hotpink";
                        var tripsAroundTheSun = 0;
                        var remainder = 0;

                        if (maxGamePositions != null && maxGamePositions != 0) {
                            maxGamePositions = parseInt(maxGamePositions);

                            completionPercentage = parseFloat(boardPositonsCompleted / maxGamePositions)

                            if (completionPercentage > 1) {
                                remainder = boardPositonsCompleted % maxGamePositions;

                                tripsAroundTheSun = ((boardPositonsCompleted - remainder) / maxGamePositions);
                                completionPercentage = parseFloat(remainder / maxGamePositions);
                            }

                            if (completionPercentage == 0 && tripsAroundTheSun > 0) {
                                completionPercentage = 0.004;
                            }

                            leaderBoardColor = GetLeaderboardColor(tripsAroundTheSun);
                        }

                        if (item.KpiScoreTotal == 0 && tripsAroundTheSun == 0) {
                            completionPercentage = 0.004;
                            leaderBoardColor = GetLeaderboardColor(10000);
                        }

                        var completionPercentageString = parseFloat(completionPercentage).toLocaleString('en-US', { style: 'percent', maximumSignificantDigits: 2 });

                        var listItem = BuildTeamLeaderboardItem(item, "game", game);

                        listHolder.append(listItem);
                    }
                    builtLeaderboard.append(listHolder);
                } else {
                    builtLeaderboard = "<p class=\"left\"><em>No Leaderboard Data found.</em></p>";
                }

                if (callback != null) {
                    callback(gameId, builtLeaderboard);
                }

                return builtLeaderboard;
            }
            function BuildTeamLeaderboardItem(dataItem, displayRank, gameObject, callback) {
                var currentDisplayRowType = scope.DisplayAltRow || "";

                if (currentDisplayRowType == "alt") {
                    currentDisplayRowType = "";
                } else {
                    currentDisplayRowType = "alt";
                }

                var item = dataItem;
                var returnItem = null;
                var displayRankValue = "";
                var displayAverageValue = "";
                let isPhraseGame = false;
                let isLeaderBoardGame = false;
                if (gameObject == null) {
                    gameObject = scope.GameList.find(g => g.FlexGameId == dataItem.GameId);
                }

                if (gameObject != null && gameObject.ThemeIdSource != null) {
                    isPhraseGame = (gameObject.ThemeIdSource.ThemeTypeId == 3);
                    isLeaderBoardGame = (gameObject.ThemeIdSource.ThemeTypeId == 1);
                }

                displayRankValue = item.RankingGamePoints;

                returnItem = $("<div class=\"flex-game-leader-board-list-item\" />");

                var rankItem = $("<div class=\"rank-item team-leaderboard-column " + currentDisplayRowType + "\" />");

                rankItem.text(displayRankValue);
                var teamNameItem = $("<div class=\"team-name-item team-leaderboard-column " + currentDisplayRowType + "\" />");
                let teamName = item.TeamName;
                if (teamName == null || teamName == "") {
                    teamName = item.IntraTeamName || item.Name || "";
                }
                teamNameItem.text(teamName);
                var teamScoreItem = $("<div class=\"team-score-item team-leaderboard-column " + currentDisplayRowType + "\" />");
                let itemGameScore = item.GameScore;
                if (itemGameScore == 0 && isLeaderBoardGame == true) {
                    itemGameScore = item.TotalKpiScore;
                }

                teamScoreItem.text(itemGameScore);


                returnItem.append(rankItem);
                returnItem.append(teamNameItem);
                returnItem.append(teamScoreItem);

                if (isPhraseGame == true) {
                    BuildPhraseScoreboardItem(gameObject, item.GameScore, returnItem);
                }
                if (callback != null) {
                    callback(returnItem);
                }
                return returnItem;
            }
            scope.BuildFullTeamLeaderboard = function (data, gameId, callback) {

                scope.WriteUserStatus("Building team leaderboard...", 10000);
                var fullLeaderBoardHolder = $("<div class=\"flex-game-full-leaderboard-holder\" />")

                var fullLeaderBoardMessage = BuildTeamLeaderboard(data, 0, true, gameId, 10000000);

                let game = scope.GameList.find(g => g.FlexGameId == gameId);

                if (game != null) {
                    var jsonData = $.parseJSON(data.leaderBoard); //JSON.parse(data.leaderBoard);

                    if (game.ThemeIdSource != null && game.ThemeIdSource.ThemeLeaderboardDisplayImageName != null) {
                        var themeLeaderboardImage = game.ThemeIdSource.ThemeLeaderboardDisplayImageName;

                        $(fullLeaderBoardHolder).css("background-image",
                            "url('" + window.location.protocol + "//" + window.location.hostname + themeLeaderboardImage + "')");
                    }
                }

                fullLeaderBoardHolder.append(fullLeaderBoardMessage);



                $(".flex-game-leaderboard", element).empty();
                $(".flex-game-leaderboard", element).append(fullLeaderBoardHolder);

                scope.FullTeamLeaderboardHtml = $(".flex-game-leaderboard", element).html()

                if (callback != null) {
                    callback();
                } else {
                    scope.ShowFullLeaderBoard();
                }


            };
            scope.BuildFullGroupLeaderboard = function (data, gameId, callback) {

            };
            scope.LoadCachedLeaderboard = function (previousHtml, callback) {
                $(".flex-game-leaderboard", element).empty();
                $(".flex-game-leaderboard", element).append(previousHtml);
                if (callback != null) {
                    callback();
                }
            };
            scope.ClearCachedLeaderboardInformation = function (callback) {
                scope.FullTeamLeaderboardHtml = "";
                scope.FullAgentLeaderboardHtml = "";
                scope.FullGroupLeaderboardHtml = "";
                if (callback != null) {
                    callback();
                }
            };
            scope.ChangeFullLeaderboardDisplay = function (displayType, callback) {
                var fullBoardGameId = $("#fullLeaderBoard_GameId", element).val();
                let game = scope.GameList.find(g => g.FlexGameId == fullBoardGameId);
                var maxGamePositions = game.ThemeIdSource.ThemePositions || 30;


                scope.LoadLeaderboardInformationFromGame(fullBoardGameId, displayType, function (data) {
                    switch (displayType.toLowerCase()) {
                        case "team":
                            if (scope.FullTeamLeaderboardHtml != "") {
                                scope.LoadCachedLeaderboard(scope.FullTeamLeaderboardHtml);
                            } else {
                                scope.BuildFullTeamLeaderboard(data, fullBoardGameId, callback);
                            }
                            break;
                        default:
                            if (scope.FullTeamLeaderboardHtml != "") {
                                scope.LoadCachedLeaderboard(scope.FullAgentLeaderboardHtml);
                            } else {
                                scope.GetLeaderBoardInformationFromGame(fullBoardGameId, function (data) {
                                    scope.BuildFullLeaderboard(data, fullBoardGameId, maxGamePositions, callback);
                                });

                            }
                            break;
                    }
                });

            };
            scope.ClearGameParticipants = function (gameId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "clearParticipantsForGame",
                        gameid: gameId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (callback != null) {
                            callback(data, gameId);
                        }
                    }
                });
            };
            scope.ReloadCurrentData = function (callback) {
                HideEditForm();
                scope.LoadGameListForUser();
                scope.IgnoreNavigateToGame = true;

                if (callback != null) {
                    callback();
                }
            };
            scope.ClearEditForm = function (skipHide, callback) {
                $(".flex-game-form-current-game-id", element).val("");
                $(".flex-game-editor-name", element).val("");
                $(".flex-game-theme-list", element).val("");
                $(".flex-game-editor-start-date", element).val("");
                $(".flex-game-editor-end-date", element).val("");
                $(".flex-game-editor-status", element).val("D");
                $(".flex-game-editor-supervisor-list", element).val("");
                $(".flex-game-editor-game-type", element).val("");
                $(".flex-game-editor-game-sub-type", element).val("");
                $(".flex-game-editor-scoring-type", element).val("");
                $(".flex-game-editor-scoring-basis", element).val("");
                $(".flex-game-finish-type", element).text("");
                $(".flex-game-editor-scoring-area", element).val("");
                $(".flex-game-editor-scoring-sub-area", element).val("");
                $(".flex-game-editor-end-points", element).val("");
                $(".flex-game-editor-scoring-options", element).val("");
                $(".flex-game-editor-select-all", element).prop("checked", false);
                $(".participant-option-checkbox", element).prop("checked", false);
                $(".flex-game-editor-status", element).removeAttr("disabled");
                $(".flex-game-scoring-ranges-new-game-id", element).val("");
                $(".flex-game-scoring-range-table-body", element).empty();
                $("#editor-step").val(0);
                $(".error-information-holder", element).empty();
                $(".flex-game-editor-scoring-type", element).removeAttr("disabled");
                $(".flex-game-editor-scoring-basis", element).removeAttr("disabled");
                $(".flex-game-editor-reward", element).val("");
                $(".flex-game-editor-phrase-value", element).val("");

                ClearAllFilterOptions();
                ClearParticipantFilterOptions(true);
                $("input", element).each(function () {
                    $(this).removeClass("errorField");
                });
                $("select", element).each(function () {
                    $(this).removeClass("errorField");
                });
                hasFreeFormRewardChanged = false;
                HideRewardItemErrorMessage();
                HideSpinnerItemErrorMessage();
                if (!skipHide) {
                    HideEditForm();
                }
                if (callback != null) {
                    callback();
                }
            };
            scope.ShowAddNewGame = function (callback) {
                scope.ClearEditForm(true);
                $(".flex-game-form-current-game-id", element).val(-1);
                $(".flex-game-scoring-ranges-new-game-id", element).val(-1);

                var userId = legacyContainer.scope.TP1Username;

                if (legacyContainer.scope.TP1Role == "Admin") {
                    userId = $(".flex-game-admin-select-user").val();

                    if (userId == null || userId == "") {
                        userId = legacyContainer.scope.TP1Username;
                    }
                }
                $(".flex-game-editor-supervisor-list", element).val(userId);
                $(".flex-game-editor-status", element).val("D");
                $(".flex-game-editor-status", element).attr("disabled", true);
                HideGameScoringEditorArea();
                $(".flex-game-editor-game-type", element).val(1);
                $(".flex-game-editor-scoring-area", element).val(0);
                let curDate = new Date();
                let startDate = curDate.setDate(curDate.getDate() + 1);

                $(".flex-game-editor-start-date", element).val(new Date(startDate).toLocaleDateString("en-US"));

                let endDate = curDate.setDate(curDate.getDate() + 7);

                $(".flex-game-editor-end-date", element).val(new Date(endDate).toLocaleDateString("en-Us"));
                LoadSubScoringList(0);

                HandleDisplaySections(null);
                LoadCurrentGamePrizeOptions(0);
                $("#hasTieBreakerScoring", element).val("false");
                $("#tieBreakerKpi_MqfNumber", element).val(-1);
                $("#tieBreakerKpi_ScoringTypeId", element).val(-1);
                
                let hasDiscussionBoard = "false";
                GetConfigParameterValue("FLEX_DISCUSSION_BOARD_DEFAULT",function(value){                    
                    if(value != null && (value.toLowerCase() == "On".toLowerCase() || value.toLowerCase() == "true".toLowerCase()))
                    {
                        hasDiscussionBoard = "true";
                    }
                });
                $(".flex-game-editor-has-discussion-board", element).val(hasDiscussionBoard);

                ShowEditForm();
                $(".flex-game-theme-list", element).change();

                if (callback != null) {
                    callback();
                }
            };
            function HideEditForm() {
                $("#game-info-tab", element).click();
                $(".flex-game-editor-holder", element).hide();
            };
            function ShowEditForm() {
                $(".flex-game-editor-holder", element).show();
            };
            scope.HideFullLeaderBoard = function () {
                $(".flex-game-full-scoreboard", element).hide();
            };
            scope.ShowFullLeaderBoard = function () {
                $(".flex-game-full-scoreboard", element).show();
            };
            function GetDataForLists(callback) {
                scope.WriteUserStatus("Collecting and setting up data options available for you...", 10000);

                scope.ThemeOptions = [];
                scope.FinishOptions = [];
                scope.GameAdminOptions = [];
                scope.PossibleParticipants = [];
                scope.PossibleTeams = [];
                scope.PossibleIntraTeams = [];
                scope.PossibleGroups = [];
                scope.ScoringAreasList = [];
                scope.SupervisorList = [];
                scope.GameTypeList = [];
                scope.SubGameTypeList = [];
                scope.ScoringTypeList = [];
                scope.ScoringBasisList = [];
                scope.CurrentUser = $(".flex-game-admin-select-user", element).val();


                LoadGameSupervisorOptionsLists();
                LoadGameTypeOptionsLists();
                LoadSubGameTypesOptions();
                LoadScoringTypeOptionsList();
                LoadScoringBasisOptionsList();
                LoadAdminUsersOptions();

                if (scope.CurrentUser == "" && legacyContainer.scope.TP1Role == "Admin") {
                    //TODO (clint):determine how we want to handle an admin user that has not 
                    //selected a user yet.  Need a default user to load for                    
                    $(".flex-game-admin-select-user", element).val(scope.CurrentUser);
                }

                LoadThemeTypeOptionData();
                LoadThemeOptionData();
                LoadFinishOptions();
                LoadScoringAreaOptions();
                LoadSubScoringAreaOptions();
                LoadScoringOptionsListData();
                LoadProjectsOptionsData();
                LoadGroupOptionsData();
                LoadLocationOptionsData();
                LoadTeamOptionsData();
                if (callback != null) {
                    callback();
                }
            };
            function LoadAdminUsersOptions(callback) {
                if (legacyContainer.scope.TP1Role == "Admin") {
                    var currentUserInList = false;
                    $(".flex-game-admin-select-user", element).empty();
                    $(".flex-game-admin-select-user", element).append($('<option />', { value: "", text: "" }));

                    for (var i = 0; i < scope.SupervisorList.length; i++) {
                        var item = scope.SupervisorList[i];

                        $(".flex-game-admin-select-user", element).append($('<option />', { value: item.UserId, text: item.UserFullName }));
                        if (item.UserId == legacyContainer.scope.TP1Username) {
                            currentUserInList = true;
                        }
                    }
                    if (!currentUserInList) {
                        $(".flex-game-admin-select-user", element).append($('<option />', { value: legacyContainer.scope.TP1Username, text: legacyContainer.scope.TP1Username }));
                    }

                }
                if (callback != null) {
                    callback();
                }
            }
            function LoadThemeOptionData(callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getThemeList"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var themes = $.parseJSON(data.themesList);
                        scope.ThemeOptions.length = 0;
                        if (themes != null) {
                            for (var i = 0; i < themes.length; i++) {
                                scope.ThemeOptions.push(themes[i]);
                            }
                            scope.LoadOptionsLists("themes");
                        }
                        if (callback != null) {
                            callback();
                        }
                    }
                });

            }
            function LoadScoringOptionsListData(callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getScoringOptionsList"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var scoringOptions = $.parseJSON(data.scoringOptionsList);
                        scope.GameScoringOptionsList.length = 0;
                        if (scoringOptions != null) {
                            for (var i = 0; i < scoringOptions.length; i++) {
                                scope.GameScoringOptionsList.push(scoringOptions[i]);
                            }
                            scope.LoadOptionsLists("scoringoptions");
                        }
                        if (callback != null) {
                            callback();
                        }
                    }
                });
            }
            function LoadThemeTypeOptionData(callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getThemeTypeList",
                        isdevmode: scope.IsDevModeOn
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var themeTypes = $.parseJSON(data.themeTypesList);
                        scope.ThemeTypeOptions.length = 0;
                        if (themeTypes != null) {
                            for (var i = 0; i < themeTypes.length; i++) {
                                scope.ThemeTypeOptions.push(themeTypes[i]);
                            }
                            scope.LoadOptionsLists("themeTypes");
                        }
                        if (callback != null) {
                            callback();
                        }
                    }
                });
            }
            function LoadFinishOptions(callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getFinishTypeList"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var finishTypes = $.parseJSON(data.finishTypeList);
                        scope.FinishOptions.length = 0;
                        if (finishTypes != null) {
                            for (var i = 0; i < finishTypes.length; i++) {
                                scope.FinishOptions.push(finishTypes[i]);
                            }
                            scope.LoadOptionsLists("finishtypes");

                        }
                        if (callback != null) {
                            callback();
                        }

                    }
                });
            }
            function LoadGameSupervisorOptionsLists(callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getSuperviorPossibleList",
                        userid: legacyContainer.scope.TP1Username
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var supervisorListOptions = $.parseJSON(data.supervisorList);
                        scope.SupervisorList.length = 0;
                        if (supervisorListOptions != null) {
                            for (var i = 0; i < supervisorListOptions.length; i++) {
                                scope.SupervisorList.push(supervisorListOptions[i]);
                            }
                            scope.LoadOptionsLists("supervisors");
                        }
                        if (callback != null) {
                            callback();
                        }

                    }
                });
            }
            function LoadGameTypeOptionsLists(callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getGameTypePossibleList",
                        isdevmode: scope.IsDevModeOn
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var gameTypeOptions = $.parseJSON(data.gameTypeList);
                        scope.GameTypeList.length = 0;
                        if (gameTypeOptions != null) {
                            for (var i = 0; i < gameTypeOptions.length; i++) {
                                scope.GameTypeList.push(gameTypeOptions[i]);
                            }
                            scope.LoadOptionsLists("gametypes");
                        }

                        if (callback != null) {
                            callback();
                        }
                    }
                });
            }
            function LoadScoringTypeOptionsList(callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getScoringTypesList",
                        isdevmode: scope.IsDevModeOn

                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var scoringTypeOptions = $.parseJSON(data.scoringTypeList);
                        scope.ScoringTypeList.length = 0;
                        if (scoringTypeOptions != null) {
                            for (var i = 0; i < scoringTypeOptions.length; i++) {
                                scope.ScoringTypeList.push(scoringTypeOptions[i]);
                            }
                            scope.LoadOptionsLists("scoringtypes");
                        }

                        if (callback != null) {
                            callback();
                        }
                    }
                });
            }
            function LoadScoringBasisOptionsList(callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getScoringBasisList",
                        isdevmode: scope.IsDevModeOn
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var scoringBasisOptions = $.parseJSON(data.scoringBasisList);
                        scope.ScoringBasisList.length = 0;
                        if (scoringBasisOptions != null) {
                            for (var i = 0; i < scoringBasisOptions.length; i++) {
                                scope.ScoringBasisList.push(scoringBasisOptions[i]);
                            }
                            scope.LoadOptionsLists("scoringbasis");
                        }

                        if (callback != null) {
                            callback();
                        }
                    }
                });
            }
            function LoadScoringAreaOptions(userId, callback) {
                if (userId == null || userId == "") {
                    userId = $(".flex-game-editor-supervisor-list", element).val();
                    if (userId == null || userId == "") {
                        userId = legacyContainer.scope.TP1Username;
                    }
                }
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getPossibleScoringAreas",
                        userid: userId,
                        includebalancedscore: true
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var scoreingAreas = $.parseJSON(data.scoringAreaList);
                        scope.ScoringAreasList.length = 0;
                        if (scoreingAreas != null) {
                            for (var i = 0; i < scoreingAreas.length; i++) {
                                scope.ScoringAreasList.push(scoreingAreas[i]);
                            }
                            scope.LoadOptionsLists("scoringareas");
                        }
                        if (callback != null) {
                            callback();
                        }

                    }
                });
            }
            function LoadSubScoringAreaOptions(callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getPossibleSubScoringAreas"

                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var subScoringAreas = $.parseJSON(data.subScoringAreaList);
                        scope.SubScoringAreasList.length = 0;
                        if (subScoringAreas != null) {
                            for (var i = 0; i < subScoringAreas.length; i++) {
                                scope.SubScoringAreasList.push(subScoringAreas[i]);
                            }
                        }
                        if (callback != null) {
                            callback();
                        }

                    }
                });
            }
            function LoadPossibleParticipantsFiltered(callback) {
                scope.WriteUserStatus("Building Possible Participant information...", 10000);

                let gameId = $(".flex-game-form-current-game-id", element).val();
                let game = scope.GameList.find(g => g.FlexGameId == parseInt(gameId));

                let projectId = $(".flex-game-editor-project-filter-options", element).val() || -1;
                let locationId = $(".flex-game-editor-location-filter-options", element).val() || -1;
                let groupId = $(".flex-game-editor-group-filter-options", element).val() || -1;
                let teamId = $(".flex-game-editor-team-filter-options", element).val() || -1;

                let gameTypeId = $(".flex-game-editor-game-type", element).val() || 1;
                let subGameTypeId = $(".flex-game-editor-sub-game-type", element).val() || -1;


                projectId == "" ? projectId = -1 : projectId = parseInt(projectId);
                locationId == "" ? locationId = -1 : locationId = parseInt(locationId);
                groupId == "" ? groupId = -1 : groupId = parseInt(groupId);
                teamId == "" ? teamId = -1 : teamId = parseInt(teamId);
                gameTypeId = "" ? gameTypeId = -1 : gameTypeId = parseInt(gameTypeId);
                subGameTypeId == "" ? subGameTypeId = -1 : subGameTypeId = parseInt(subGameTypeId);


                let filteredParticipants = [];
                let filteredTeams = [];
                let currentGameParticipants = [];
                if (teamId != -1) {
                    filteredTeams = scope.TeamOptions.filter(t => t.TeamId == teamId);
                }
                else if (groupId != -1) {
                    filteredTeams = scope.TeamOptions.filter(t => t.GroupId == groupId && t.ProjectId == projectId);
                }
                else if (locationId != -1) {
                    let groups = scope.GroupOptions.filter(g => g.LocationId == locationId && g.ProjectId == projectId);
                    filteredTeams.length = 0;
                    if (groups != null) {
                        for (let i = 0; i < groups.length; i++) {
                            let teams = scope.TeamOptions.filter(t => t.GroupId == groups[i].GroupId &&
                                t.ProjectId == projectId);
                            if (teams != null) {
                                for (let x = 0; x < teams.length; x++) {
                                    filteredTeams.push(teams[x]);
                                }
                            }
                        }
                    }
                }
                else if (projectId != -1) {
                    filteredTeams = scope.TeamOptions.filter(t => t.ProjectId == projectId);
                }
                else {
                    filteredParticipants = scope.PossibleParticipants;
                    if (gameTypeId == 2) {
                        filteredTeams = scope.TeamOptions;
                    }
                    else {
                        filteredTeams = scope.TeamOptions.filter(t => t.IsActive == true);
                    }
                }
                switch (gameTypeId) {
                    case 2: //team game
                        {
                            filteredParticipants.length = 0;

                            if (subGameTypeId == 2) {
                                filteredParticipants = scope.PossibleIntraTeams;
                                filteredTeams.length = 0;
                                currentGameParticipants = game.ParticipatingIntraTeams;

                            }
                            else {
                                currentGameParticipants = game.ParticipatingTeams;
                                for (let t = 0; t < filteredTeams.length; t++) {
                                    let teamItem = filteredTeams[t];

                                    if (filteredParticipants.find(t => t.TeamId == teamItem.TeamId) == null) {
                                        filteredParticipants.push(teamItem);
                                    }
                                }
                            }
                        }
                        break;
                    default: //agent game is default
                        {
                            if (filteredTeams != null && filteredTeams.length > 0) {
                                for (let t = 0; t < filteredTeams.length; t++) {
                                    let curTeam = filteredTeams[t];
                                    if (curTeam.AssignedUsers != null && curTeam.AssignedUsers.length > 0) {
                                        for (let u = 0; u < curTeam.AssignedUsers.length; u++) {
                                            let curUser = curTeam.AssignedUsers[u];
                                            if (filteredParticipants.findIndex(i => i.UserId == curUser.UserId) < 0) {
                                                filteredParticipants.push(curUser);
                                            }
                                        }
                                    }
                                }
                            }
                            if (game != null) {
                                currentGameParticipants = game.GameParticipants;
                            }
                        }
                        break;
                }
                let addNonAgentProfiles = $("#flexParticipantEditor_IncludeNonAgentProfiles", element).is(":checked");
                if(addNonAgentProfiles == true)
                {
                    AddNonAgentProfilesToList(filteredParticipants);
                }

                let currentParticipantsHolder = $("<div />");
                let availableParticipantsHolder = $("<div />");

                currentGameParticipants = currentGameParticipants.sort(function (a, b) {
                    let nameA = a.Name.toUpperCase();
                    let nameB = b.Name.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
                filteredParticipants = filteredParticipants.sort(function (a, b) {
                    let nameA = a.Name.toUpperCase();
                    let nameB = b.Name.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
                
                if (currentGameParticipants != null && currentGameParticipants.length > 0) {
                    $(".current-participants-count", element).empty();
                    $(".current-participants-count", element).append("<label>(" + currentGameParticipants.length + ")</label>")
                    for (let i = 0; i < currentGameParticipants.length; i++) {
                        let item = currentGameParticipants[i];

                        let isInFilteredList = false;
                        let gameProfiles = [];
                        switch (gameTypeId) {
                            case 2:
                                if (subGameTypeId == 2) {
                                    gameProfiles = []; //TODO: Determine where to get the intrateam list information from.
                                }
                                else {
                                    gameProfiles = scope.TeamOptions.find(t => t.TeamId == item.TeamId);
                                }
                                break;
                            default:
                                gameProfiles = scope.UserAssignments.find(u => u.UserId == item.UserId);
                                break;
                        }

                        if (gameProfiles != null) {
                            isInFilteredList = (gameProfiles.ProjectId == projectId) &&
                                (gameProfiles.LocationId == null || locationId == -1 || gameProfiles.LocationId == locationId) &&
                                (gameProfiles.GroupId == null || groupId == -1 || gameProfiles.GroupId == groupId) &&
                                (gameProfiles.TeamId == null || teamId == -1 || gameProfiles.TeamId == teamId)
                        }
                        let participantHolder = $("<div class=\"flex-participants-manager-current-user_row\" />");
                        let participantName = $("<label class=\"flex-participants-manager-current-user-name\" />").append(item.Name);
                        let participantButtons = $("<div class=\"flex-participants-manager-current-user-button-holder inline_button-holder\" />");

                        if (isInFilteredList == true) {
                            participantHolder.addClass("highlight");
                        }

                        let itemId = item.Id;
                        if (gameTypeId == 2) {
                            if (subGameTypeId == 2) {
                                itemId = item.IntraTeamId;
                            }
                            else {
                                itemId = item.TeamId;
                            }
                        }
                        let removeParticipantButton = $("<button class=\"flex-particpants-manager-current-user-remove-button\" id=\"removeUser_" + itemId + "\"><i class=\"fa fa-remove\"></i></button>");

                        $(removeParticipantButton, element).off("click").on("click", function () {
                            scope.WriteUserStatus("Removing participant from the game...", 10000);
                            let id = this.id;
                            let userId = id.split('_')[1];
                            RemoveParticipantFromGame(userId);
                        });
                        participantButtons.append(removeParticipantButton);

                        participantHolder.append(participantName);
                        participantHolder.append(participantButtons);

                        currentParticipantsHolder.append(participantHolder);
                    }
                }
                else {
                    currentParticipantsHolder.append("<div class=\"empty-message\">No Current Participants found.</div>");
                }

                if (filteredParticipants != null && filteredParticipants.length > 0) {
                    //$(".available-participants-count", element).empty();
                    //$(".available-participants-count", element).append("<label>(" + filteredParticipants.length + ")</label>")

                    for (let i = 0; i < filteredParticipants.length; i++) {
                        let item = filteredParticipants[i];
                        let itemId = item.Id;
                        let isAssigned = false;
                        if (currentGameParticipants != null) {

                            if (gameTypeId == 2) {
                                if (subGameTypeId == 2) {
                                    isAssigned = (currentGameParticipants.findIndex(u => u.IntraTeamId == item.Id) > -1);
                                    itemId = item.IntraTeamId;
                                }
                                else {
                                    isAssigned = (currentGameParticipants.findIndex(u => u.TeamId == item.Id) > -1);
                                    itemId = item.TeamId;
                                }
                            }
                            else {
                                isAssigned = (currentGameParticipants.findIndex(u => u.Id == item.Id) > -1);
                            }

                        }
                        if (!isAssigned) {
                            let participantHolder = $("<div class=\"flex-participants-manager-available-user_row\" />");
                            let participantName = $("<label class=\"flex-participants-manager-available-user-name\" />").append(item.Name);
                            let participantButtons = $("<div class=\"flex-participants-manager-available-user-button-holder inline_button-holder\" />");

                            let addParticipantButton = $("<button class=\"flex-participants-manager-available-user-remove-button\" id=\"addUser_" + itemId + "\"><i class=\"fa fa-plus\"></i></button>");

                            //participantName.append("<input type=\"checkbox\" class=\"participant-option-checkbox\" value=\"" + filteredParticipants[i].Id + "\">" );

                            $(addParticipantButton, element).off("click").on("click", function () {
                                scope.WriteUserStatus("Adding participant to the game...", 10000);
                                let id = this.id;
                                let userId = id.split('_')[1]
                                AddParticipantToGame(userId);
                            });
                            participantButtons.append(addParticipantButton);
                            participantHolder.append(participantName);
                            participantHolder.append(participantButtons);
                            availableParticipantsHolder.append(participantHolder);
                        }

                    }
                }
                else {
                    if (scope.TeamOptions.length == 0) {
                        ShowParticipantLoadingImage();
                        availableParticipantsHolder.append("<div>Loading possible users...</div>");
                    }
                    else {
                        HideParticipantLoadingImage();
                        availableParticipantsHolder.append("<div>No Available Participants found.</div>");
                    }
                }

                $(".flex-game-editor-participants-current", element).empty();
                $(".flex-game-editor-participants-current", element).append(currentParticipantsHolder);
                $(".flex-game-editor-participants-available", element).empty();
                $(".flex-game-editor-participants-available", element).append(availableParticipantsHolder);

                scope.HideUserStatus();
                if (callback != null) {
                    callback();
                }

            }
            function LoadProjectsOptionsData(callback) {
                scope.WriteUserStatus("Collecting project options...", 10000);
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "selfserve",
                        //cmd: "getProjectList"
                        cmd: "getProjectListForUser"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        let options = $.parseJSON(data.projectList);
                        scope.ProjectOptions.length = 0;
                        if (options != null) {
                            for (let i = 0; i < options.length; i++) {
                                scope.ProjectOptions.push(options[i]);
                            }
                            scope.LoadOptionsLists("projectsFilter");
                            scope.HideUserStatus();
                        }
                        if (callback != null) {
                            callback();
                        }

                    }
                });

            }
            function LoadGroupOptionsData(callback) {
                scope.WriteUserStatus("Collecting group options...", 10000);

                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "selfserve",
                        cmd: "getGroupList"
                    },
                    dataType: "json",
                    cache: false,
                    beforeSend: () => {
                        scope.WriteUserStatus("Sending group data request...", null);
                    },
                    error: a$.ajaxerror,
                    success: function (data) {
                        let options = $.parseJSON(data.groupList);
                        scope.GroupOptions.length = 0;
                        if (options != null) {
                            for (let i = 0; i < options.length; i++) {
                                scope.GroupOptions.push(options[i]);
                            }
                            scope.HideUserStatus();
                        }
                        if (callback != null) {
                            callback();
                        }

                    }
                });
            }
            function LoadLocationOptionsData() {
                scope.WriteUserStatus("Collecting location options...", 10000);
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
                        let options = $.parseJSON(data.locationList);
                        scope.LocationOptions.length = 0;
                        if (options != null) {
                            for (let i = 0; i < options.length; i++) {
                                scope.LocationOptions.push(options[i]);
                            }
                            scope.HideUserStatus();
                            //scope.LoadOptionsLists("locations");
                        }
                    }
                });
            }
            function LoadTeamOptionsData() {
                scope.WriteUserStatus("Collecting team options...", 10000);
                ShowParticipantLoadingImage();
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "selfserve",
                        cmd: "getTeamList",
                        excludeIneligible: true
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        let options = $.parseJSON(data.teamList);
                        scope.TeamOptions.length = 0;
                        HideParticipantLoadingImage();
                        if (options != null) {
                            for (let i = 0; i < options.length; i++) {
                                scope.TeamOptions.push(options[i]);
                            }
                            if ($("#participants-panel", element).is(":visible") == true) {
                                LoadPossibleParticipantsFiltered();
                            }
                            scope.HideUserStatus();
                            //scope.LoadOptionsLists("locations");
                        }
                    }
                });
            }
            scope.LoadOptionsLists = function (loadtypes, filteredOptions) {
                var loadAll = (loadtypes === "all");

                loadtypes = loadtypes.toLowerCase();

                if (loadtypes == "themes" || loadAll) {
                    if ($(".flex-game-theme-list", element) != null) {
                        $(".flex-game-theme-list", element).empty();
                        $(".flex-game-theme-list", element).append($('<option />', { value: "", text: "" }));
                        for (var i = 0; i < scope.ThemeOptions.length; i++) {
                            var item = scope.ThemeOptions[i];
                            var itemName = item.ShortName || item.Name;
                            $(".flex-game-theme-list", element).append($('<option />', { value: item.ThemeId, text: itemName }));
                        }
                    }
                }
                if (loadtypes == "themetypes" || loadAll) {
                    if ($(".flex-game-theme-type-list", element) != null) {
                        $(".flex-game-theme-type-list", element).empty();
                        $(".flex-game-theme-type-list", element).append($('<option />', { value: "", text: "Select Type" }));
                        for (var i = 0; i < scope.ThemeTypeOptions.length; i++) {
                            var item = scope.ThemeTypeOptions[i];
                            $(".flex-game-theme-type-list", element).append($('<option />', { value: item.ThemeTypeId, text: item.Name }));
                        }
                    }
                }
                if (loadtypes == "finishtypes" || loadAll) {

                    if ($(".flex-game-finish-type-list", element) != null) {
                        $(".flex-game-finish-type-list", element).empty();
                        $(".flex-game-finish-type-list", element).append($('<option />', { value: "", text: "" }));
                        for (var i = 0; i < scope.FinishOptions.length; i++) {
                            var item = scope.FinishOptions[i];
                            //TODO (clint): Determine do we use code or the ID.  Need to have database support one or other.
                            //Would prefer code so that it will help with performance
                            $(".flex-game-finish-type-list", element).append($('<option />', { value: item.FinishTypeId, text: item.FinishTypeName }));
                        }
                    }
                }
                if (loadtypes == "supervisors" || loadAll) {
                    if ($(".flex-game-editor-supervisor-list", element) != null) {
                        let currentUserInList = false;
                        $(".flex-game-editor-supervisor-list", element).empty();
                        $(".flex-game-editor-supervisor-list", element).append($('<option />', { value: "", text: "" }));

                        let supervisorList = scope.SupervisorList;

                        for (var i = 0; i < supervisorList.length; i++) {
                            var item = supervisorList[i];

                            $(".flex-game-editor-supervisor-list", element).append($('<option />', { value: item.UserId.toLowerCase(), text: item.UserFullName }));


                            if (item.UserId.toLowerCase() == legacyContainer.scope.TP1Username.toLowerCase()) {
                                currentUserInList = true;
                            }
                        }
                        if (!currentUserInList) {
                            $(".flex-game-editor-supervisor-list", element).append($('<option />', { value: legacyContainer.scope.TP1Username.toLowerCase(), text: legacyContainer.scope.TP1Username }));
                        }
                    }
                }
                if (loadtypes == "gametypes" || loadAll) {
                    if ($(".flex-game-editor-game-type", element) != null) {
                        $(".flex-game-editor-game-type", element).empty();
                        $(".flex-game-editor-game-type", element).append($('<option />', { value: "", text: "" }));

                        for (var i = 0; i < scope.GameTypeList.length; i++) {
                            var item = scope.GameTypeList[i];
                            $(".flex-game-editor-game-type", element).append($('<option />', { value: item.GameTypeId, text: item.GameTypeName }));
                        }

                        $(".flex-game-editor-game-type", element).off("change").on("change", function () {
                            var selectedGameType = $(this).val();
                            if (selectedGameType != null && selectedGameType != "") {
                                LoadSubGameTypeList(selectedGameType, -1);
                            } else {
                                $(".flex-game-editor-sub-game-type", element).hide();
                            }
                            scope.HandleGameTypeChange(selectedGameType);

                        });
                    }
                }
                //NOTE: SCORING TYPE HAS BEEN RENAMED TO SCORING BASIS IN THE UI
                if (loadtypes == "scoringtypes" || loadAll) {
                    if ($(".flex-game-editor-scoring-type", element) != null) {
                        let itemsToLoad = scope.ScoringTypeList;
                        if ($(".flex-game-editor-scoring-area", element) != null) {
                            let areaValue = $(".flex-game-editor-scoring-area", element).val();
                            if (areaValue != null) {
                                if (parseInt(areaValue) == 0) {
                                    itemsToLoad = scope.ScoringTypeList.filter(ti => ti.ScoringTypeName == "Balanced Score");
                                }
                                else if (parseInt(areaValue) == 999999) {
                                    itemsToLoad = scope.ScoringTypeList.filter(ti => ti.ScoringTypeName == "Manual Input");
                                }
                                else if (parseInt(areaValue) >= 900000 && parseInt(areaValue) < 999999)
                                {
                                    //itemsToLoad = scope.ScoringTypeList.filter(ti => ti.ScoringTypeName != "Balanced Score" && ti.ScoringTypeName != "Manual Input");
                                    itemsToLoad = scope.ScoringTypeList.filter(ti => ti.ScoringTypeName != "Balanced Score" 
                                        && ti.ScoringTypeName != "Manual Input"
                                        && ti.ScoringTypeName != "Scored Value"
                                        && ti.ScoringTypeName != "Standard Value"
                                    );
                                }
                                else {
                                    itemsToLoad = scope.ScoringTypeList.filter(ti => ti.ScoringTypeName != "Balanced Score"  
                                        && ti.ScoringTypeName != "Manual Input" 
                                        && ti.ScoringTypeName != "Counts"
                                        && ti.ScoringTypeName != "Total Item Value"
                                    );
                                }
                            }
                        }
                        $(".flex-game-editor-scoring-type", element).empty();
                        $(".flex-game-editor-scoring-type", element).append($('<option />', { value: "", text: "" }));

                        for (var i = 0; i < itemsToLoad.length; i++) {
                            var item = itemsToLoad[i];
                            $(".flex-game-editor-scoring-type", element).append($('<option />', { value: item.ScoringTypeId, text: item.ScoringTypeName }));
                        }
                    }
                }
                if(loadtypes == "scoringtypestiebreaker" || loadAll){
                    if ($("#tieBreakerKpi_ScoringTypeId", element) != null) {
                        let itemsToLoad = scope.ScoringTypeList;
                        if ($("#tieBreakerKpi_MqfNumber", element) != null) {
                            let areaValue = $("#tieBreakerKpi_MqfNumber", element).val();
                            if (areaValue != null) {
                                if (parseInt(areaValue) == 0) {
                                    itemsToLoad = scope.ScoringTypeList.filter(ti => ti.ScoringTypeName == "Balanced Score");
                                }
                                else if (parseInt(areaValue) == 999999) {
                                    itemsToLoad = scope.ScoringTypeList.filter(ti => ti.ScoringTypeName == "Manual Input");
                                }
                                else if (parseInt(areaValue) >= 900000 && parseInt(areaValue) < 999999)
                                {
                                    itemsToLoad = scope.ScoringTypeList.filter(ti => ti.ScoringTypeName != "Balanced Score" 
                                        && ti.ScoringTypeName != "Manual Input"
                                        && ti.ScoringTypeName != "Scored Value"
                                        && ti.ScoringTypeName != "Standard Value"
                                    );
                                }
                                else {
                                    itemsToLoad = scope.ScoringTypeList.filter(ti => ti.ScoringTypeName != "Balanced Score"  
                                        && ti.ScoringTypeName != "Manual Input" 
                                        && ti.ScoringTypeName != "Counts"
                                        && ti.ScoringTypeName != "Total Item Value"
                                    );
                                }
                            }
                        }
                        $("#tieBreakerKpi_ScoringTypeId", element).empty();
                        $("#tieBreakerKpi_ScoringTypeId", element).append($('<option />', { value: "", text: "" }));

                        for (var i = 0; i < itemsToLoad.length; i++) {
                            var item = itemsToLoad[i];                            
                            $("#tieBreakerKpi_ScoringTypeId", element).append($('<option />', { value: item.ScoringTypeId, text: item.ScoringTypeName }));
                        }
                    }
                }
                //NOTE: SCORING BASIS HAS BEEN RENAMED TO SCORING MODEL IN UI
                if (loadtypes == "scoringbasis" || loadAll) {
                    if ($(".flex-game-editor-scoring-basis", element) != null) {
                        $(".flex-game-editor-scoring-basis", element).empty();
                        $(".flex-game-editor-scoring-basis", element).append($('<option />', { value: "", text: "" }));

                        for (var i = 0; i < scope.ScoringBasisList.length; i++) {
                            var item = scope.ScoringBasisList[i];
                            $(".flex-game-editor-scoring-basis", element).append($('<option />', { value: item.ScoringBasisId, text: item.ScoringBasisName }));
                        }
                    }
                }
                if (loadtypes == "scoringareas" || loadAll) {
                    if ($(".flex-game-editor-scoring-area", element) != null) {
                        $(".flex-game-editor-scoring-area", element).empty();
                        $(".flex-game-editor-scoring-area", element).append($('<option />', { value: "", text: "" }));

                        for (var i = 0; i < scope.ScoringAreasList.length; i++) {
                            var item = scope.ScoringAreasList[i];
                            $(".flex-game-editor-scoring-area", element).append($('<option />', { value: item.MqfNumber, text: item.Text }));
                        }
                        $(".flex-game-editor-scoring-area", element).off("change").on("change", function () {
                            $(".flex-game-editor-acuity-scoring-display-holder", element).hide();
                            var scoringArea = $(this).val();

                            if (scoringArea != null && scoringArea != "") {
                                LoadSubScoringList(scoringArea);

                            } else {
                                $(".flex-game-editor-scoring-sub-area", element).hide();
                            }
                        });
                    }
                    
                    if ($("#tieBreakerKpi_MqfNumber", element) != null) {
                        let tieBreakerAreaValue = $("#tieBreakerKpi_MqfNumber", element).val();
                        if (tieBreakerAreaValue != null) {
                            if (parseInt(tieBreakerAreaValue) == 0) {
                                itemsToLoad = scope.ScoringTypeList.filter(ti => ti.ScoringTypeName == "Balanced Score");
                            }
                            else if (parseInt(tieBreakerAreaValue) == 999999) {
                                itemsToLoad = scope.ScoringTypeList.filter(ti => ti.ScoringTypeName == "Manual Input");
                            }
                            else if (parseInt(tieBreakerAreaValue) >= 900000 && parseInt(tieBreakerAreaValue) < 999999)
                            {
                                //itemsToLoad = scope.ScoringTypeList.filter(ti => ti.ScoringTypeName != "Balanced Score" && ti.ScoringTypeName != "Manual Input");
                                itemsToLoad = scope.ScoringTypeList.filter(ti => ti.ScoringTypeName != "Balanced Score" 
                                    && ti.ScoringTypeName != "Manual Input"
                                    && ti.ScoringTypeName != "Scored Value"
                                    && ti.ScoringTypeName != "Standard Value"
                                );
                            }
                            else {
                                itemsToLoad = scope.ScoringTypeList.filter(ti => ti.ScoringTypeName != "Balanced Score"  
                                    && ti.ScoringTypeName != "Manual Input" 
                                    && ti.ScoringTypeName != "Counts"
                                    && ti.ScoringTypeName != "Total Item Value"
                                );
                            }
                        }
                        $("#tieBreakerKpi_MqfNumber", element).empty();
                        $("#tieBreakerKpi_MqfNumber", element).append($('<option />', { value: "", text: "" }));

                        for (var i = 0; i < scope.ScoringAreasList.length; i++) {
                            var item = scope.ScoringAreasList[i];
                            $("#tieBreakerKpi_MqfNumber", element).append($('<option />', { value: item.MqfNumber, text: item.Text }));
                        }
                    }
                }

                if (loadtypes == "scoringoptions" || loadAll) {
                    if ($(".flex-game-editor-scoring-options", element) != null) {
                        $(".flex-game-editor-scoring-options", element).empty();
                        $(".flex-game-editor-scoring-options", element).append($('<option />', { value: "", text: "" }));

                        for (var i = 0; i < scope.GameScoringOptionsList.length; i++) {
                            var item = scope.GameScoringOptionsList[i];
                            $(".flex-game-editor-scoring-options", element).append($('<option />', { value: item.ScoringOptionId, text: item.ScoringOptionName }));
                        }
                    }
                }
                if (loadtypes == "projectsfilter" || loadAll) {
                    if ($(".flex-game-editor-project-filter-options", element) != null) {
                        $(".flex-game-editor-project-filter-options", element).empty();
                        $(".flex-game-editor-project-filter-options", element).append($('<option />', { value: "", text: "" }));

                        let optionList = scope.ProjectOptions;
                        optionList = scope.ProjectOptions.filter(p => p.IsActive == true);
                        for (var i = 0; i < optionList.length; i++) {
                            var item = optionList[i];
                            $(".flex-game-editor-project-filter-options", element).append($('<option />', { value: item.ProjectId, text: item.Name }));
                        }
                    }
                }
                if (loadtypes == "groupsfilter") {
                    if ($(".flex-game-editor-group-filter-options", element) != null) {
                        $(".flex-game-editor-group-filter-options", element).empty();
                        $(".flex-game-editor-group-filter-options", element).append($('<option />', { value: "", text: "" }));

                        let projectId = $(".flex-game-editor-project-filter-options", element).val() || -1;
                        let locationId = $(".flex-game-editor-location-filter-options", element).val() || -1;

                        let optionList = scope.GroupOptions;
                        optionList = scope.GroupOptions.filter(p => p.IsActive == true &&
                            (p.ProjectId == projectId) &&
                            (p.LocationId == locationId || locationId == -1 || locationId == "")
                        );

                        for (var i = 0; i < optionList.length; i++) {
                            var item = optionList[i];
                            $(".flex-game-editor-group-filter-options", element).append($('<option />', { value: item.GroupId, text: item.Name }));
                        }
                    }
                }
                if (loadtypes == "locationsfilter") {
                    if ($(".flex-game-editor-location-filter-options", element) != null) {
                        $(".flex-game-editor-location-filter-options", element).empty();
                        $(".flex-game-editor-location-filter-options", element).append($('<option />', { value: "", text: "" }));

                        let projectId = $(".flex-game-editor-project-filter-options", element).val() || -1;

                        let optionList = scope.LocationOptions;
                        optionList = scope.LocationOptions.filter(p => p.IsActive == true);

                        for (var i = 0; i < optionList.length; i++) {
                            var item = optionList[i];
                            $(".flex-game-editor-location-filter-options", element).append($('<option />', { value: item.LocationId, text: item.Name }));
                        }
                    }
                }
                if (loadtypes == "teamsfilter") {
                    if ($(".flex-game-editor-team-filter-options", element) != null) {
                        $(".flex-game-editor-team-filter-options", element).empty();
                        $(".flex-game-editor-team-filter-options", element).append($('<option />', { value: "", text: "" }));

                        let projectId = $(".flex-game-editor-project-filter-options", element).val() || -1;
                        let groupId = $(".flex-game-editor-group-filter-options", element).val() || -1;

                        let optionList = scope.TeamOptions;
                        optionList = scope.TeamOptions.filter(p => p.IsActive == true &&
                            (p.ProjectId == projectId) &&
                            (p.GroupId == groupId)
                        );

                        for (var i = 0; i < optionList.length; i++) {
                            var item = optionList[i];
                            $(".flex-game-editor-team-filter-options", element).append($('<option />', { value: item.TeamId, text: item.Name }));
                        }
                    }
                }
                return;
            };
            function LoadSubScoringList(value, callback) {
                $(".flex-game-editor-scoring-sub-area", element).empty();

                let selectedScoringArea = scope.ScoringAreasList.find(a => a.MqfNumber == parseInt(value));
                if (selectedScoringArea != null && selectedScoringArea.HasSubType == true) {
                    if (scope.SubScoringAreasList.length > 0) {
                        $(".flex-game-editor-scoring-sub-area", element).append($('<option />', { value: "", text: "Select Sub KPI" }));
                        for (var s = 0; s < scope.SubScoringAreasList.length; s++) {
                            var subItem = scope.SubScoringAreasList[s];
                            if (subItem.KpiId == selectedScoringArea.MqfNumber) {
                                $(".flex-game-editor-scoring-sub-area", element).append($('<option />', { value: subItem.SubTypeId, text: subItem.SubTypeDesc }));
                            }
                        }
                    }
                    $(".flex-game-editor-scoring-sub-area", element).off("change").on("change", function () {
                        $(".flex-game-editor-acuity-scoring-display-holder", element).hide();
                    });

                    $(".flex-game-editor-scoring-sub-area", element).show();
                    $(".flex-game-editor-scoring-area", element).addClass("active");
                } else {
                    $(".flex-game-editor-scoring-sub-area", element).hide();
                    $(".flex-game-editor-scoring-area", element).removeClass("active");
                }
                scope.LoadOptionsLists("scoringtypes");

                if (selectedScoringArea != null && selectedScoringArea.MqfNumber == 0) {
                    SetBalancedScoreInfo();
                }
                else if (selectedScoringArea != null && (selectedScoringArea.MqfNumber >= 900000 && selectedScoringArea.MqfNumber <= 999999)) {
                    SetUserEntryScoringMetric(selectedScoringArea.MqfNumber);
                }
                else {
                    $(".flex-game-editor-scoring-type", element).removeAttr("disabled");
                    $(".flex-game-editor-scoring-basis", element).removeAttr("disabled");
                    $(".flex-game-editor-game-type", element).removeAttr("disabled");
                }

                if (callback != null) {
                    callback();
                }
            }
            function LoadSubGameTypeList(value, currentValue, callback) {

                $(".flex-game-editor-sub-game-type", element).empty();
                let selectedGameType = scope.GameTypeList.find(gt => gt.GameTypeId == parseInt(value));

                if (selectedGameType != null && selectedGameType.HasSubTypes == true) {
                    if (scope.SubGameTypeList != null && scope.SubGameTypeList.length > 0) {
                        $(".flex-game-editor-sub-game-type", element).append($('<option />', { value: "", text: "Select Sub Game Type" }));
                        let subGameTypes = scope.SubGameTypeList.filter(gt => gt.GameTypeId == selectedGameType.GameTypeId);

                        for (var i = 0; i < subGameTypes.length; i++) {
                            let item = subGameTypes[i];
                            $(".flex-game-editor-sub-game-type", element).append($('<option />', { value: item.GameSubTypeId, text: item.SubTypeName }));
                        }
                    }
                    if (currentValue != null && currentValue > 0) {
                        $(".flex-game-editor-sub-game-type", element).val(currentValue);
                    }
                    $(".flex-game-editor-sub-game-type", element).off("change").on("change", function () {
                        let selectedGameType = $(".flex-game-editor-sub-game-type", element).val();
                        scope.HandleGameTypeChange(selectedGameType);
                    });
                    $(".flex-game-editor-sub-game-type", element).show();
                    $(".flex-game-editor-game-type", element).addClass("active");
                }
                else {
                    $(".flex-game-editor-sub-game-type", element).hide();
                    $(".flex-game-editor-game-type", element).removeClass("active");
                }

                if (callback != null) {
                    callback();
                }
            }
            function SetBalancedScoreInfo() {
                //set Scoring Type
                $(".flex-game-editor-scoring-type", element).val("4");
                $(".flex-game-editor-scoring-type", element).attr("disabled", true);
                //set Scoring Basis
                $(".flex-game-editor-scoring-basis", element).val("2");
                $(".flex-game-editor-scoring-basis", element).attr("disabled", true);
                //game type handling
                $(".flex-game-editor-game-type", element).removeAttr("disabled");
            }
            function SetUserEntryScoringMetric(mqfNumber) {
                $(".flex-game-editor-scoring-type", element).removeAttr("disabled");
                $(".flex-game-editor-scoring-basis", element).removeAttr("disabled");
                $(".flex-game-editor-game-type", element).removeAttr("disabled");
                switch(mqfNumber) {
                    case 999994:
                    case 999998:
                        //set Scoring Type
                        $(".flex-game-editor-scoring-type", element).val("5");
                        $(".flex-game-editor-scoring-type", element).attr("disabled", true);
                        //set Scoring Basis
                        $(".flex-game-editor-scoring-basis", element).val("4");
                        $(".flex-game-editor-scoring-basis", element).attr("disabled", true);
                        break;
                    // case 999995:
                    //     //set Scoring Type
                    //     $(".flex-game-editor-scoring-type", element).val("6");
                    //     $(".flex-game-editor-scoring-type", element).attr("disabled", true);
                    //     //set Scoring Basis
                    //     $(".flex-game-editor-scoring-basis", element).val("3");
                    //     $(".flex-game-editor-scoring-basis", element).attr("disabled", true);
                    //     break;
                    case 999996:
                        //set Scoring Type
                        $(".flex-game-editor-scoring-type", element).val("6");
                        $(".flex-game-editor-scoring-type", element).attr("disabled", true);
                        //set Scoring Basis
                        $(".flex-game-editor-scoring-basis", element).val("3");
                        $(".flex-game-editor-scoring-basis", element).attr("disabled", true);
                        break;
                    case 999997:
                    //set Scoring Type
                    $(".flex-game-editor-scoring-type", element).val("5");
                    $(".flex-game-editor-scoring-type", element).attr("disabled", true);
                    //set Scoring Basis
                    $(".flex-game-editor-scoring-basis", element).val("4");
                    $(".flex-game-editor-scoring-basis", element).attr("disabled", true);
                    break;
                    // case 999998:
                    //     //set Scoring Type
                    //     $(".flex-game-editor-scoring-type", element).val("5");
                    //     $(".flex-game-editor-scoring-type", element).attr("disabled", true);
                    //     //set Scoring Basis
                    //     $(".flex-game-editor-scoring-basis", element).val("4");
                    //     $(".flex-game-editor-scoring-basis", element).attr("disabled", true);
                    //     break;
                    case 999999:
                        //set Scoring Type
                        $(".flex-game-editor-scoring-type", element).val("3");
                        $(".flex-game-editor-scoring-type", element).attr("disabled", true);
                        //set Scoring Basis
                        $(".flex-game-editor-scoring-basis", element).val("2");
                        $(".flex-game-editor-scoring-basis", element).attr("disabled", true);
                        //set Game Type to Agent
                        $(".flex-game-editor-game-type", element).val("1");
                        $(".flex-game-editor-game-type", element).attr("disabled", true);
                        break;
                }


            }
            scope.HandleGameSupervisorChanged = function (newUserIdToLoadFor, callback) {
                LoadScoringAreaOptions(newUserIdToLoadFor);
                LoadSubScoringList(-1);
                //LoadSubGameTypeList(-1, -1);
                //scope.ReloadParticipantsList(newUserIdToLoadFor);
                if (callback != null) {
                    callback();
                }
            };
            scope.ManageGameScoringRange = function (gameId, callback) {
                scope.GetScoringRangesForGame(gameId, function (data) {
                    scope.LoadGameScoringRange(gameId, data, null);
                });

                if (callback != null) {
                    callback();
                }
            };
            scope.GetScoringRangesForGame = function (gameId, callback) {

                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getScoringRangeForGame",
                        gameid: gameId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {

                        if (callback != null) {
                            callback(data, gameId);
                        }
                    }
                });
                //}

            };
            scope.GetMinMaxRangesForGame = function (gameId, callback) {
                let game = scope.GameList.find(g => g.FlexGameId == gameId);
                if (game != null && game.ScoringRange != null) {
                    callback(game.ScoringRange);
                }
                else {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "flex",
                            cmd: "getMinMaxScoringRangeForGame",
                            gameid: gameId
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            let scoringRange = $.parseJSON(data.defaultScoreRange); //JSON.parse(data.defaultScoreRange);
                            if (callback != null) {
                                callback(scoringRange);
                            }
                        }
                    });
                }

            };
            scope.LoadGameScoringRange = function (gameId, rangesData, callback) {
                scope.WriteUserStatus("Loading the game scoring data...", 10000);
                let game = scope.GameList.find(g => g.FlexGameId == gameId);

                let scoringBasisValue = parseInt($(".flex-game-editor-scoring-basis", element).val());
                let scoringBasisOption = scope.ScoringBasisList.find(b => b.ScoringBasisId == scoringBasisValue);
                let requireCustomScoring = true;
                let isUsingAcuityScoring = (scoringBasisValue == 1); //TODO: Remove magic number here for Acuity Scoring.

                if (scoringBasisOption != null) {
                    requireCustomScoring = scoringBasisOption.RequiresCustomScoringRange;
                }

                ShowGameScoringEditorArea()

                if (game != null) {
                    $(".flex-game-read-only-game-name", element).html($("<label>" + game.Name + "</label>"));
                    $(".flex-game-read-only-scoring-area", element).html($("<label>" + game.GameKpiName + "</label>"));
                    $(".flex-game-scoring-ranges-new-game-id", element).val(game.FlexGameId);

                    scope.LoadAcuityScoringRangeInformation(game.AcuityKpiMqfId, game.AcuityKpiSubType, function () {
                        scope.GetMinMaxRangesForGame(game.FlexGameId, function (data) {
                            let defaultScoreItem = null;
                            if (data != null) {
                                defaultScoreItem = data[0];
                            }

                            if (defaultScoreItem != null) {
                                let range1low = defaultScoreItem.Range1Low || scope.DefaultLowRangeScore || 0;
                                let range1High = defaultScoreItem.Range1High || scope.DefaultHighRangeScore || 0;
                                $(".flex-game-read-only-min-holder", element).html($("<label>" + range1low + "</label>"));
                                $(".flex-game-read-only-max-holder", element).html($("<label>" + range1High + "</label>"));
                            }
                        });
                    });
                }
                let scoringRangeTableBody = $(".flex-game-scoring-range-table-body", element);
                $(scoringRangeTableBody).empty();
                let rangeListings = null;
                if (rangesData == null && game != null) {
                    if (game.ScoringRange != null) {
                        rangeListings = game.ScoringRange;
                    }
                    else {
                        rangeListings.length = 0;
                    }
                }
                else if (rangesData != null && rangesData.scoringRangeList != null) {
                    rangeListings = $.parseJSON(rangesData.scoringRangeList); //JSON.parse(rangesData.scoringRangeList);
                }
                else {
                    rangeListings = [];
                }

                for (var i = 0; i < rangeListings.length; i++) {
                    var scoringRangeItem = rangeListings[i];
                    var row = $("<tr />");
                    var counterCell = $("<td />");
                    counterCell.append("<span>" + (i + 1) + "</span>");
                    counterCell.append($("<input type=\"hidden\" id=\"scoreRangeId_" + scoringRangeItem.ScoreRangeId + "\" value=\"" + scoringRangeItem.ScoreRangeId + "\" />"));
                    counterCell.append($("<input type=\"hidden\" id=\"gameId_" + scoringRangeItem.ScoreRangeId + "\" value=\"" + game.FlexGameId + "\" />"));
                    counterCell.append($("<input type=\"hidden\" id=\"enterBy_" + scoringRangeItem.ScoreRangeId + "\" value=\"" + scoringRangeItem.EnterBy + "\"  />"));
                    counterCell.append($("<input type=\"hidden\" id=\"enterOn_" + scoringRangeItem.ScoreRangeId + "\" value=\"" + scoringRangeItem.EnterDate + "\" />"));

                    var lowCell = $("<td />");
                    let scoreRangeLow = scoringRangeItem.Range1Low || scope.DefaultLowRangeScore || 0;

                    var lowCellInput = $("<input type=\"text\" id=\"rangeLow_" + scoringRangeItem.ScoreRangeId + "\" value=\"" + scoreRangeLow + "\" class=\"range-editor\" />");

                    $(lowCellInput).off("change").on("change", function () {
                        var inputId = this.id;
                        var scoringRangeId = inputId.split('_')[1];
                        scope.HandleScoringInputChange(scoringRangeId)
                    });
                    lowCell.append(lowCellInput);

                    var highCell = $("<td />");
                    var scoreRangeHigh = null;
                    var scoreRangeHigh = scoringRangeItem.Range1High;
                    if(scoreRangeHigh == null)
                    {
                        scoreRangeHigh = scope.DefaultHighRangeScore;
                    }
                    var highCellInput = $("<input type=\"text\" id=\"rangeHigh_" + scoringRangeItem.ScoreRangeId + "\" value=\"" + scoreRangeHigh + "\" class=\"range-editor\" />");
                    $(highCellInput).off("change").on("change", function (i) {
                        var inputId = this.id;
                        var scoringRangeId = inputId.split('_')[1];
                        scope.HandleScoringInputChange(scoringRangeId)

                    });

                    highCell.append(highCellInput);

                    var gameScoreCell = $("<td />");
                    var gameScoreInput = $("<input type=\"text\" id=\"gameScore_" + scoringRangeItem.ScoreRangeId + "\" value=\"" + scoringRangeItem.Points + "\" class=\"range-editor\" />");
                    $(gameScoreInput).off("change").on("change", function () {
                        var inputId = this.id;
                        var scoringRangeId = inputId.split('_')[1];
                        scope.HandleScoringInputChange(scoringRangeId)

                    });
                    gameScoreCell.append(gameScoreInput);

                    var buttonCell = $("<td />");
                    var updateButton = null;
                    //if (scope.AllowIndividualScoringRangeSave == true || game.ScoringRange.length == 0) {
                    if (scope.AllowIndividualScoringRangeSave == true) {
                        updateButton = $("<button class=\"button\" title=\"Save Row\" id=\"scoreUpdate_" + scoringRangeItem.ScoreRangeId + "\"><i class=\"fad fa-save\"></i></button>");
                        $(updateButton, element).on("click", function () {
                            var buttonId = this.id;
                            var scoringRangeId = buttonId.split('_')[1];
                            scope.UpdateScoringRangeItem(scoringRangeId, function () {
                                scope.ManageGameScoringRange(gameId, function () { });
                            });
                        });
                    }

                    var deleteButton = $("<button class=\"button button--red\" title=\"Delete Row\" id=\"scoreRemove_" + scoringRangeItem.ScoreRangeId + "\"><i class=\"fas fa-trash-alt\"></i></button>");
                    $(deleteButton, element).on("click", function () {
                        var buttonId = this.id;
                        var scoringRangeId = buttonId.split('_')[1];
                        scope.DeleteScoringRangeItem(scoringRangeId, function () {
                            scope.ManageGameScoringRange(gameId, function () { });
                        });
                    });


                    row.append(counterCell);
                    row.append(lowCell);
                    row.append(highCell);
                    row.append(gameScoreCell);
                    if (isUsingAcuityScoring == true) {
                        lowCellInput.prop("disabled", "disabled");
                        highCellInput.prop("disabled", "disabled");
                        gameScoreInput.prop("disabled", "disabled");
                    }
                    if (requireCustomScoring) {
                        if (updateButton != null) {
                            buttonCell.append(updateButton);
                            buttonCell.append("&nbsp;&nbsp;");
                        }
                        buttonCell.append(deleteButton);
                    }

                    row.append(buttonCell);

                    $(scoringRangeTableBody).append(row);
                }

                var blankRow = $("<tr class=\"no-background\"><td colspan=\"5\"><div class=\"table-divider\"></div></td></tr>");
                $(scoringRangeTableBody).append(blankRow);

                if (requireCustomScoring) {
                    $(".flex-game-scoring-range-add-new-row").show();
                    $("#scoreAdd").show();
                }
                else {
                    $(".flex-game-scoring-range-add-new-row").hide();
                    $("#scoreAdd").hide();
                }
                scope.HideUserStatus();
                if (callback != null) {
                    callback();
                }
            };
            scope.LoadAcuityScoringRangeInformation = function (mqfNumber, subTypeId, callback) {
                let scoringOptions = scope.ScoringAreasList.find(i => i.MqfNumber == mqfNumber);

                if (scoringOptions != null && scoringOptions.AcuityScoringRanges != null && scoringOptions.AcuityScoringRanges.length > 0) {
                    var acuityScoringList = $("<table class=\"flex-game-editor-acuity-scoring-display-data-item-list\"/>");

                    var scoringHeader = $("<tr />");
                    var scoringHeaderScoreHeader = $("<td class=\"flex-game-editor-scrity-scoring-display-data-header\" />").append("Score");
                    var scoringHeaderLowHeader = $("<td class=\"flex-game-editor-scrity-scoring-display-data-header\" />").append("Low");
                    var scoringHeaderHighHeader = $("<td class=\"flex-game-editor-scrity-scoring-display-data-header\" />").append("High");

                    scoringHeader.append(scoringHeaderScoreHeader);
                    scoringHeader.append(scoringHeaderLowHeader);
                    scoringHeader.append(scoringHeaderHighHeader);

                    acuityScoringList.append(scoringHeader);

                    let dataPoints = null;
                    if (subTypeId != null && subTypeId != 0) {
                        dataPoints = scoringOptions.AcuityScoringRanges.filter(i => i.SubTypeId == subTypeId && i.MqfNumber == mqfNumber);
                    }
                    else {
                        dataPoints = scoringOptions.AcuityScoringRanges;
                    }
                    for (var i = 0; i < dataPoints.length; i++) {
                        let item = dataPoints[i];

                        var scoringRow = $("<tr />");
                        var scoreValueCell = $("<td class=\"flex-game-editor-scrity-scoring-display-data-item score-value-cell\" />");
                        scoreValueCell.append(item.ScoreValue);
                        var standardValueLowCell = $("<td class=\"flex-game-editor-scrity-scoring-display-data-item standard-value-cell-low\" />");
                        standardValueLowCell.append(item.StandardValueLow1);
                        var standardValueHighCell = $("<td class=\"flex-game-editor-scrity-scoring-display-data-item standard-value-cell-high\" />");
                        standardValueHighCell.append(item.StandardValueHigh1);

                        scoringRow.append(scoreValueCell);
                        scoringRow.append(standardValueLowCell);
                        scoringRow.append(standardValueHighCell);

                        acuityScoringList.append(scoringRow);
                    }
                    $(".flex-game-editor-acuity-scoring-display-data", element).empty();
                    $(".flex-game-editor-acuity-scoring-display-data", element).append(acuityScoringList);
                    $(".flex-game-editor-acuity-scoring-display-holder", element).hide();
                }
                else {
                    $(".flex-game-editor-acuity-scoring-display-data", element).empty();
                }

                if (callback != null) {
                    callback();
                }
            };
            scope.DeleteScoringRangeItem = function (scoreRangeId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "removeScoringRangeItem",
                        scorerangeid: scoreRangeId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (callback != null) {
                            callback();
                        }
                    }
                });

                if (callback != null) {
                    callback();
                }
            };
            scope.AddScoringRangeItem = function (callback) {

                var gameId = $(".flex-game-scoring-ranges-new-game-id", element).val();
                var lowRange = $(".flex-game-scoring-ranges-new-low", element).val();
                var highRange = $(".flex-game-scoring-ranges-new-high", element).val();
                var points = $(".flex-game-scoring-ranges-new-game-score", element).val();

                if (points == null || points == "") {
                    points = 0;
                }


                var scoringRangeItem = new Object();
                scoringRangeItem.ScoreRangeId = 0;
                scoringRangeItem.GameId = gameId;
                scoringRangeItem.Range1Low = lowRange;
                scoringRangeItem.Range1High = highRange;
                scoringRangeItem.Points = points;
                scoringRangeItem.EnterDate = new Date().toLocaleDateString("en-US");
                scoringRangeItem.EnterBy = legacyContainer.scope.TP1Username;
                scoringRangeItem.UpdateDate = null;
                scoringRangeItem.UpdateBy = null;

                scope.SaveAllScoringRangesForGame(function () {
                    //scope.SaveScoringRange(scoringRangeItem, function(data) {
                    scope.ResetScoringRangesAdd(function () {
                        scope.ManageGameScoringRange(gameId, callback);
                    });
                    //});
                });
            };
            scope.UpdateScoringRangeItem = function (scoreRangeId, callback) {


                var gameId = $("#gameId_" + scoreRangeId, element).val();
                var lowRange = $("#rangeLow_" + scoreRangeId, element).val();
                var highRange = $("#rangeHigh_" + scoreRangeId, element).val();
                var points = $("#gameScore_" + scoreRangeId, element).val();
                var enterBy = $("#enterBy_" + scoreRangeId, element).val();
                var enterOn = $("#enterOn_" + scoreRangeId, element).val();


                var scoringRangeItem = new Object();
                scoringRangeItem.ScoreRangeId = scoreRangeId;
                scoringRangeItem.GameId = gameId;
                scoringRangeItem.Range1Low = lowRange;
                scoringRangeItem.Range1High = highRange;
                scoringRangeItem.Points = points;
                scoringRangeItem.EnterDate = new Date(enterOn).toLocaleDateString("en-US");
                scoringRangeItem.EnterBy = enterBy;
                scoringRangeItem.UpdateDate = new Date().toLocaleDateString("en-US");
                scoringRangeItem.UpdateBy = legacyContainer.scope.TP1Username;

                scope.SaveScoringRange(scoringRangeItem, function (data) {
                    scope.WriteUserStatus("Scoring save updates complete.<br/>You may need to recalculate the scores for the leaderboard to update.", 3000);
                    callback();
                });
            };
            scope.SaveAllScoringRangesForGame = function (callback) {
                scope.WriteUserStatus("Saving Scoring Ranges -- just one moment...", 2000);

                //Scoring Basis of Acuity = ID of 1.
                var useAcuityScoring = (parseInt($(".flex-game-editor-scoring-basis", element).val()) == 1);

                if (useAcuityScoring) {
                    let gameId = scope.GameIdToLoad || parseInt($(".flex-game-form-current-game-id", element).val());
                    let mqfNumber = $(".flex-game-editor-scoring-area", element).val();
                    let subTypeId = $(".flex-game-editor-scoring-sub-area", element).val();

                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "flex",
                            cmd: "importAcuityScoringForGameScoring",
                            gameid: gameId,
                            mqfnumber: mqfNumber,
                            subtypeid: subTypeId
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            if (callback != null) {
                                callback();
                            }
                        }
                    });
                }
                else {

                    var knownScoringRangeIds = $(".flex-game-scoring-ranges-table tr input[id^='scoreRangeId']");
                    var newScoringRangeItemToSave = BuildScoringRangeItemFromId(0);

                    if (knownScoringRangeIds.length > 0) {
                        for (var i = 0; i < knownScoringRangeIds.length; i++) {
                            var scoringRangeId = $(knownScoringRangeIds[i]).val();
                            var scoringRangeItemToSave = BuildScoringRangeItemFromId(scoringRangeId);
                            if (scoringRangeItemToSave != null && scoringRangeItemToSave.ScoreRangeId > 0) {
                                scope.SaveScoringRange(scoringRangeItemToSave, function () {
                                    if (newScoringRangeItemToSave == null && callback != null) {
                                        callback();
                                    }
                                });
                            }
                        }
                    }
                    if (newScoringRangeItemToSave != null) {
                        scope.SaveScoringRange(newScoringRangeItemToSave, function () {
                            if (callback != null) {
                                callback();
                            }
                        });
                    } else {
                        if (callback != null) {
                            callback();
                        }
                    }
                }


                function BuildScoringRangeItemFromId(scoringRangeId) {

                    var gameId = null;
                    var lowRange = null;
                    var highRange = null;
                    var points = null;
                    var enterBy = null;
                    var enterOn = null;
                    var updateBy = null;
                    var updateOn = null;

                    if (scoringRangeId == 0) {
                        gameId = $(".flex-game-scoring-ranges-new-game-id", element).val();
                        lowRange = $(".flex-game-scoring-ranges-new-low", element).val();
                        highRange = $(".flex-game-scoring-ranges-new-high", element).val();
                        points = $(".flex-game-scoring-ranges-new-game-score", element).val();
                        enterBy = legacyContainer.scope.TP1Username;
                        enterOn = new Date().toLocaleDateString("en-US");

                        //only saving data where we actually have all of the values.
                        if (lowRange == null || lowRange == "" || highRange == null || highRange == "" || points == null || points == "") {
                            return null;
                        }
                    } else {
                        gameId = $("#gameId_" + scoringRangeId, element).val();
                        lowRange = $("#rangeLow_" + scoringRangeId, element).val();
                        highRange = $("#rangeHigh_" + scoringRangeId, element).val();
                        points = $("#gameScore_" + scoringRangeId, element).val();
                        enterBy = $("#enterBy_" + scoringRangeId, element).val();
                        enterOn = $("#enterOn_" + scoringRangeId, element).val();
                        updateBy = legacyContainer.scope.TP1Username;
                        updateOn = new Date().toLocaleDateString("en-US");
                    }

                    var scoringRangeItem = new Object();
                    scoringRangeItem.ScoreRangeId = scoringRangeId;
                    scoringRangeItem.GameId = gameId;
                    scoringRangeItem.Range1Low = lowRange;
                    scoringRangeItem.Range1High = highRange;
                    scoringRangeItem.Points = points;
                    scoringRangeItem.EnterDate = enterOn
                    scoringRangeItem.EnterBy = enterBy;
                    scoringRangeItem.UpdateDate = updateOn;
                    scoringRangeItem.UpdateBy = updateBy;
                    return scoringRangeItem;
                }
            };
            scope.SaveScoringRange = function (scoreRangeObject, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "saveScoringRangeItem",
                        scoringrangeitem: JSON.stringify(scoreRangeObject)
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (callback != null) {
                            callback();
                        }
                    }
                });
            };
            scope.HandleScoringInputChange = function (scoringRangeId, callback) {

                $("#flex-score-item-has-changed", element).val("true");


                if (callback != null) {
                    callback();
                }
            };
            scope.ResetScoringRangesAdd = function (callback) {
                $(".flex-game-scoring-ranges-new-low", element).val("");
                $(".flex-game-scoring-ranges-new-high", element).val("");
                $(".flex-game-scoring-ranges-new-game-score", element).val("");
                $("#flex-score-item-has-changed", element).val("false");

                if (callback != null) {
                    callback();
                }
            };
            scope.ShowScoringRangeEditForm = function (callback) {
                $(".flex-game-scoring-editor-holder", element).show();
                if (callback != null) {
                    callback();
                }
            };
            scope.HideScoringRangeEditForm = function () {
                $(".flex-game-scoring-editor-holder", element).hide();
            };
            scope.CloseScoringRangeEditForm = function () {
                scope.HideScoringRangeEditForm();
                var hasChanged = ($("#flex-score-item-has-changed", element).val().toLowerCase() == "true");
                if (hasChanged) {
                    if (confirm("You have unsaved changes.  Closing this will not save the information.")) {
                        scope.ReloadCurrentData();
                    } else {
                        scope.ShowScoringRangeEditForm();
                    }
                }
            };
            scope.ClearAdminStatus = function () {
                console.clear();
                $(".flex-game-admin-status-output").html("");
            };
            scope.ShowUserStatus = function (displayForTiming) {
                var currentDisplayStatus = $(".flex-game-user-status", element).css("display");

                if (displayForTiming == null) {
                    displayForTiming = 60000 //1 minute is default for displaying data. 
                }

                if (currentDisplayStatus == "none") {
                    $(".flex-game-user-status", element).show();
                    window.setTimeout(function () {
                        scope.HideUserStatus();
                    }, displayForTiming);
                }
            };
            scope.HideUserStatus = function () {
                var currentDisplayStatus = $(".flex-game-user-status", element).css("display");
                if (currentDisplayStatus != "none") {
                    $(".flex-game-user-status", element).hide();
                }
            };
            scope.WriteUserStatus = function (message, displayForTiming, callback) {
                //console.log("AGAME Flex Admin: " + message);
                scope.HideUserStatus();
                $(".flex-game-user-status", element).html(message);
                scope.ShowUserStatus(displayForTiming);
                if (callback != null) {
                    callback();
                }
            };
            scope.HideUserInformation = function () {
                var currentDisplayStatus = $(".flex-game-user-info-display").css("display");

                if (currentDisplayStatus != "none") {
                    $(".flex-game-user-info-display").hide();
                }
            };
            scope.ShowUserInformation = function (displayForTiming) {
                var currentDisplayStatus = $(".flex-game-user-info-display").css("display");

                if (currentDisplayStatus == "none") {
                    $(".flex-game-user-info-display").show();
                    if (displayForTiming != null) {
                        window.setTimeout(function () {
                            scope.HideUserInformation();
                        }, displayForTiming);
                    }
                }
            };
            scope.WriteUserInformation = function (message, displayForTiming) {
                $(".flex-game-user-info-display").empty();
                $(".flex-game-user-info-display").html(message);

                if (displayForTiming == null) {
                    displayForTiming = 60000; //display for 1 minute as a default.
                }
                scope.ShowUserInformation(displayForTiming);
            };
            scope.StartGame = function (gameId, callback) {
                var canContinue = true;
                let game = scope.GameList.find(g => g.FlexGameId == gameId);

                if (game != null) {
                    if (game.ScoringBasisId == 2 && game.ScoringRange.length <= 1) //custom scoring
                    {
                        var messageString = "You have created a game with custom scoring and may not have setup a set of scoring ranges.  Please confirm that any scoring ranges you have setup are correct.\n\nPress OK to continue or CANCEL to adjust the settings.";
                        canContinue = confirm(messageString);
                    }
                }

                if (canContinue) {
                    var confirmMessage = "You are about to start the game.";
                    confirmMessage += "\nOnce started, the following settings cannot be changed.";
                    confirmMessage += "\n - Game Name";
                    confirmMessage += "\n - Game Admin";
                    confirmMessage += "\n - Theme/Game Type";
                    confirmMessage += "\n - Start Date";
                    confirmMessage += "\n - Participants";

                    if (confirm(confirmMessage)) {

                        a$.ajax({
                            type: "POST",
                            service: "C#",
                            async: true,
                            data: {
                                lib: "flex",
                                cmd: "setGameStatus",
                                gameid: gameId,
                                status: "P",
                                gamedate: new Date().toLocaleDateString("en-US")
                            },
                            dataType: "json",
                            cache: false,
                            error: a$.ajaxerror,
                            success: function (data) {
                                scope.WriteUserStatus("Start successful.<br /> Reloading current game list.", 2000);
                                if (callback != null) {
                                    callback(data);
                                } else {
                                    scope.ReloadCurrentData();
                                }
                            }
                        });

                    } else {

                        return false;
                    }
                }


            };
            scope.StopGame = function (gameId, callback) {
                var confirmMessage = "You are about to stop the game.";
                confirmMessage += "\nThe following will occur:";
                confirmMessage += "\n - End Date will be set to today.";
                confirmMessage += "\n - No more changes to the game at all.";
                confirmMessage += "\n - Status of game will be set to complete/over - not finalized.";
                confirmMessage += "\n - Data can still be imported for the game until it is finalized.";

                if (confirm(confirmMessage)) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "flex",
                            cmd: "setGameStatus",
                            gameid: gameId,
                            status: "C",
                            gamedate: new Date().toLocaleDateString("en-US")
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            scope.WriteUserStatus("Stop successful.<br /> Reloading current game list.", 2000);
                            if (callback != null) {
                                callback(data);
                            } else {
                                scope.ReloadCurrentData();
                            }

                        }
                    });
                } else {

                    return false;
                }
            };
            scope.PauseGame = function (gameId, callback) {
                var confirmMessage = "You are about to pause the game.";
                confirmMessage += "\nThe following will occur:";
                confirmMessage += "\n - Scoring will stop until the game is re-started.";

                if (confirm(confirmMessage)) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "flex",
                            cmd: "setGameStatus",
                            gameid: gameId,
                            status: "X"
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            scope.WriteUserStatus("Pause successful.<br /> Reloading current game list.", 2000);
                            if (callback != null) {
                                callback(data);
                            } else {
                                scope.ReloadCurrentData();
                            }

                        }
                    });
                } else {

                    return false;
                }
            };
            scope.ReactivateGame = function (gameId, callback) {
                var confirmMessage = "You are about to make the game active.";
                confirmMessage += "\nThe following will occur:";
                confirmMessage += "\n - Options will now be available to load data for the game.";

                if (confirm(confirmMessage)) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "flex",
                            cmd: "setGameStatus",
                            gameid: gameId,
                            status: "A"
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            scope.WriteUserStatus("Reactivate successful.<br /> Reloading current game list.", 2000);
                            if (callback != null) {
                                callback(data);
                            } else {
                                scope.ReloadCurrentData();
                            }

                        }
                    });
                } else {

                    return false;
                }
            };
            scope.GoToGame = function (gameId) {
                // scope.WriteUserStatus("--------NOT YET IMPLEMENTED------<br><br>This will take the user to the game board.", 2500);
            };
            scope.CopyGame = function (gameIdToCopy, callback) {

                let game = scope.GameList.find(g => g.FlexGameId == gameIdToCopy);

                $(".flex-game-copy-game-id", element).val(gameIdToCopy);
                $(".flex-game-copy-game-name", element).html(game.Name);
                $(".flex-game-copy-editor-new-game-name", element).val("Copy of " + game.Name);
                if (game.ThemeIdSource != null && game.ThemeIdSource.ThemeId > 0) {
                    $(".flex-game-copy-game-theme", element).html(game.ThemeIdSource.Name);
                } else {
                    $(".flex-game-copy-game-theme", element).html("Theme not found.");
                }

                if (game.AdminUserIdSource != null) {
                    $(".flex-game-copy-game-supervisor", element).html(game.AdminUserIdSource.UserFullName);
                } else {
                    $(".flex-game-copy-game-supervisor", element).html(game.AdminUserId);
                }
                $(".flex-game-copy-game-scoring-area", element).html(game.GameKpiName);
                $(".flex-game-copy-editor-start-date", element).val(new Date(game.GameStartDate).toLocaleDateString("en-US"));
                $(".flex-game-copy-editor-end-date", element).val(new Date(game.GameEndDate).toLocaleDateString("en-US"));
                $("input[name=FlexGameCopyParticipantType][value=C]").prop("checked", true);
                $("input[name=FlexGameCopyScoringType][value=C]").prop("checked", true);

                if (callback != null) {
                    callback();
                } else {
                    scope.ShowCopyGameForm();
                }
            };
            scope.FinalizeGame = function (gameId, callback) {
                if (confirm("Finalizing this game will not perform any more scoring and all modifications will be final for the game.")) {
                    scope.WriteUserStatus("Finalizing game, this may take some time.", 2500);
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "flex",
                            cmd: "setGameStatus",
                            gameid: gameId,
                            status: "F"
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            if (callback != null) {
                                scope.HideUserStatus();
                                callback(data);
                            } else {
                                scope.ReloadCurrentData();
                            }

                        }
                    });

                    if (callback != null) {
                        callback();
                    }
                }
            };
            scope.ArchiveGame = function (gameId, callback) {
                scope.WriteUserStatus("Archiving Game...", 2500);
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "setGameStatus",
                        gameid: gameId,
                        status: "O"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (callback != null) {
                            scope.HideUserStatus();
                            callback(data);
                        } else {
                            scope.ReloadCurrentData();
                        }
                    }
                });
            };
            scope.DeleteGame = function (gameId, callback) {
                if (confirm('You are going to completely remove the game.  This can not be undone.')) {
                    scope.WriteUserStatus("Deleting game in process.", 5000);
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "flex",
                            cmd: "deleteGame",
                            gameid: gameId
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (data) {
                            if (callback != null) {
                                callback();
                            } else {
                            }
                        }
                    });
                } else {
                }

            };
            scope.SaveCopyGameForm = function (callback) {
                var gameId = $(".flex-game-copy-game-id", element).val();
                var participantCopyType = $("input[name=FlexGameCopyParticipantType]:checked").val();
                var scoringCopyType = $("input[name=FlexGameCopyScoringType]:checked").val();
                var gameName = $(".flex-game-copy-editor-new-game-name", element).val();
                var startDate = $(".flex-game-copy-editor-start-date", element).val();
                var endDate = $(".flex-game-copy-editor-end-date", element).val();

                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "copyGame",
                        gameid: gameId,
                        participantcopytype: participantCopyType,
                        scoringcopytype: scoringCopyType,
                        gamename: gameName,
                        gamestartdate: startDate,
                        gameenddate: endDate
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (callback != null) {
                            callback();
                        } else {
                            scope.ClearCopyGameForm();
                            scope.HideCopyGameForm();
                        }
                    }
                });


            };
            scope.ClearCopyGameForm = function (callback) {

                $(".flex-game-copy-game-id", element).val("");
                $(".flex-game-copy-game-name", element).html("");
                $(".flex-game-copy-editor-new-game-name", element).val("");
                $(".flex-game-copy-game-theme", element).html("");
                $(".flex-game-copy-game-supervisor", element).html("");
                $(".flex-game-copy-game-scoring-area", element).html("");
                $(".flex-game-copy-editor-start-date", element).val("");
                $(".flex-game-copy-editor-end-date", element).val("");
                $("input[name=FlexGameCopyParticipantType][value=C]").prop("checked", true);
                $("input[name=FlexGameCopyScoringType][value=C]").prop("checked", true);
                if (callback != null) {
                    callback();
                }
            };
            scope.HideCopyGameForm = function () {
                $(".flex-game-copy-game-holder").hide();
            };
            scope.ShowCopyGameForm = function () {
                $(".flex-game-copy-game-holder").show();
            };
            scope.MarkAllParticipants = function (participantListHolderClassName, checkAllCheckboxName) {
                var allParticipantsHolder = participantListHolderClassName || ".flex-game-editor-participant-list";
                var checkAllCheckboxName = checkAllCheckboxName || "#selectAllParticipant";

                var checkAllCheckbox = $(checkAllCheckboxName, element);
                var allParticipantCheckboxes = $("input[type='checkbox']", $(allParticipantsHolder, element));
                var checkValue = (checkAllCheckbox).is(":checked");

                $(allParticipantCheckboxes).each(function () {
                    $(this).prop("checked", checkValue);
                });
            };
            scope.SetDefaultFilters = function () {
                var previousSetFilters = $.cookie(statusCookieName);
                var previousSortOrder = $.cookie(sortOrderCookieName);

                if (previousSetFilters != null) {
                    for (var i = 0; i < previousSetFilters.length; i++) {
                        $("input[name='filters'][value='" + previousSetFilters[i] + "']", element).prop("checked", true);
                        //$(".flex-game-display-filter", element).val(previousSetFilters[i]);
                    }
                } else {
                    $("#filterInDev", element).prop("checked", true);
                    $("#filterActive", element).prop("checked", true);
                    $("#filterInProgress", element).prop("checked", true);
                    $("#filterComplete", element).prop("checked", true);
                }

                if (previousSortOrder != null) {
                    $("#userSortOrder", element).val(previousSortOrder);
                }

            };
            scope.SetLoadGameListButton = function (userId) {
                $(".flex-game-btn-load-gamelist").off("click").on("click", function () {
                    scope.LoadGameListForUser(userId);
                });
            };
            scope.UpdateGameStatusPerDates = function (callback) {

                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "automatedGameStatusUpdate",
                        enddate: new Date().toLocaleDateString("en-US")
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {

                        if (callback != null) {
                            callback(data, gameId);
                        }
                    }
                });
            };
            scope.ValidateGameInformation = function (gameObject, validationType, callback) {

                var gameIsValid = true;
                var errorList = [];
                var gameName = "";
                var gameSupervisor = "";
                var gameTheme = "";
                var scoringArea = "";
                var startDate = "";
                var endDate = "";
                var scoringBasis = "";
                var endingPoints = null;
                var scoringType = "";

                if (gameObject != null) {
                    gameName = gameObject.Name;
                    gameSupervisor = gameObject.AdminUserId;
                    gameTheme = gameObject.ThemeId;
                    startDate = gameObject.GameStartDate;
                    endDate = gameObject.GameEndDate;
                    scoringArea = gameObject.GameKpiName;
                    scoringBasis = gameObject.ScoringBasisId;
                    endingPoints = gameObject.PointsToEndGame;
                    scoringTypeId = gameObject.ScoringTypeId;
                } else {
                    validationType = validationType.toLowerCase();

                    if (validationType == "form") {
                        gameName = "";
                        gameSupervisor = "";
                        gameTheme = "";
                        startDate = "";
                        endDate = "";
                        scoringArea = "";
                        scoringBasis = "";
                    } else {
                        gameIsValid = false;
                        errorList.push("Unknown validation type.")
                    }
                }
                var selectedTheme = null;
                if (gameName == null || gameName == "") {
                    gameIsValid = false;
                    errorList.push("The game must have a name.");
                }
                if (gameSupervisor == null || gameSupervisor == "") {
                    gameIsValid = false;
                    errorList.push("The game must have a supervisor.");
                }
                if (gameTheme == null || gameTheme == "") {
                    gameIsValid = false;
                    errorList.push("The game must have a theme.");
                } else {
                    selectedTheme = scope.ThemeOptions.find(t => t.ThemeId == parseInt(gameTheme));
                }

                if (startDate == null || startDate == "") {
                    gameIsValid = false;
                    errorList.push("The game must have a start date.");
                }
                if (scoringArea == null || scoringArea == "") {
                    gameIsValid = false;
                    errorList.push("The game must have a scoring metric.");
                }

                //NOTE: SCORING BASIS WAS RENAMED TO SCORING MODEL
                if (selectedTheme != null && selectedTheme.RequiresScoringBasis == true) {
                    if (scoringBasis == null || scoringBasis == "") {
                        gameIsValid = false;
                        errorList.push("The game must have a scoring model.");
                    }
                }

                if (selectedTheme != null && selectedTheme.RequiresEndingPointTotal == true) {
                    if (endingPoints == null || parseInt(endingPoints) == 0 || endingPoints == "") {
                        gameIsValid = false;
                        errorList.push("Theme requires there to be an Ending Points value.");
                    }
                }

                if (callback != null) {
                    callback(gameIsValid, errorList);
                } else {
                }
            };
            function GetUserIdToLoad() {
                var userInformation = scope.CurrentUser;
                if (userInformation == null || userInformation == "") {
                    userInformation = $(".flex-game-admin-select-user :selected", element).val();
                }
                if (userInformation == "") {
                    userInformation = legacyContainer.scope.TP1Username;
                }

                return userInformation;
            }
            function ResetLeaderboardCounters() {

                scope.DisplayAltRow = "";
                scope.CurrentStackRank = 1;
            }
            scope.HandleGameTypeChange = function (newGameTypeId, callback) {
                if (scope.TeamOptions.length == 0) {
                    LoadTeamOptionsData();
                }
                ClearParticipantFilterOptions(true);
                HandleParticipantFilterOptionsForGameType();
                LoadPossibleParticipantsFiltered();

                if (callback != null) {
                    callback();
                }
            };
            function HandleParticipantFilterOptionsForGameType(callback) {
                gameTypeId = $(".flex-game-editor-game-type", element).val() || -1;
                gameTypeId = parseInt(gameTypeId);

                HideUiObjectByClassName(".team-filter-holder");
                switch (gameTypeId) {
                    case 1: //agent
                        ShowUiObjectByClassName(".team-filter-holder");
                        break;

                }
                if (callback != null) {
                    callback();
                }

            }
            function ClearParticipantFilterOptions(clearParticipants, callback) {
                if (clearParticipants != null && clearParticipants == true) {
                    scope.ClearParticipantList();
                }
                $(".flex-game-editor-project-filter-options", element).val("");
                $(".flex-game-editor-location-filter-options", element).val("");
                $(".flex-game-editor-group-filter-options", element).val("");
                $(".flex-game-editor-team-filter-options", element).val("");
                if (callback != null) {
                    callback();
                }

            }
            scope.HandleGameThemeChange = function (newGameThemeId, callback) {
                let gameTheme = scope.ThemeOptions.find(t => t.ThemeId == newGameThemeId);

                HideScoringBasis();
                HideGameScoringEditorArea();
                HideEndPoints();
                HideScoringOptions();
                HideGamePhrase();

                if (gameTheme != null) {
                    $(".flex-game-theme-type-list", element).val(gameTheme.ThemeTypeId);
                    if (gameTheme.RequiresScoringBasis == true) {
                        ShowScoringBasis();
                        ShowGameScoringEditorArea();
                    }
                    if (gameTheme.RequiresEndingPointTotal == true) {
                        ShowEndPoints();
                    }
                    if (gameTheme.IsCalculateScoreOptionAvailable == true) {
                        ShowScoringOptions();
                    }
                    if (gameTheme.RequiresPhraseValue == true) {
                        ShowGamePhrase();
                    }
                }
                if (callback != null) {
                    callback();
                }
            };
            scope.HandleThemeTypeChange = function (newThemeTypeId, callback) {
                if (newThemeTypeId != null) {
                    newThemeTypeId = parseInt(newThemeTypeId);
                }
                let themes = scope.ThemeOptions.filter(ft => ft.ThemeTypeId == newThemeTypeId);
                // if (themes == null || themes.length == 0)
                // {
                //     themes = scope.ThemeOptions;
                // }
                $(".flex-game-theme-list", element).empty();

                $(".flex-game-theme-list", element).append($('<option />', { value: "", text: "Select Theme" }));
                for (var i = 0; i < themes.length; i++) {
                    var item = themes[i];
                    var itemName = item.ShortName || item.Name;
                    $(".flex-game-theme-list", element).append($('<option />', { value: item.ThemeId, text: itemName }));
                }
                scope.HandleGameThemeChange(newThemeTypeId);

                if (callback != null) {
                    callback();
                }
            }
            scope.ClearParticipantList = function () {
                $(".flex-game-editor-participant-list", element).empty();
            };
            scope.HideLoadingIndicator = function (gameId) {
                if (gameId != null) {
                    $("#loadDataAdmin_" + gameId, element).removeClass("calculate-score-active");
                    $("#loadDataAdmin_" + gameId, element).removeAttr("disabled");

                }
            }
            scope.ShowLoadingIndicator = function (buttonId) {
                $("#" + buttonId, element).addClass("calculate-score-active");
                $("#" + buttonId, element).attr("disabled", true);
            }
            scope.ValidateEditorForm = function (callback) {
                $(".error-information-holder", element).empty();
                var formValid = true;
                var errorMessages = [];

                var gameName = $(".flex-game-editor-name", element).val();
                var startDate = $(".flex-game-editor-start-date", element).val();
                var endDate = $(".flex-game-editor-end-date", element).val();
                var gameSupervisor = $(".flex-game-editor-supervisor-list", element).val();
                var gameTheme = $(".flex-game-theme-list", element).val();
                var gameType = $(".flex-game-editor-game-type", element).val();
                var scoringMetric = $(".flex-game-editor-scoring-area", element).val();
                var scoringOption = $(".flex-game-editor-scoring-options", element).val();
                var subKpiScoringMetric = $(".flex-game-editor-scoring-sub-area", element).val();
                var scoringType = $(".flex-game-editor-scoring-type", element).val();
                var scoringBasis = $(".flex-game-editor-scoring-basis", element).val();
                var endingPoints = $(".flex-game-editor-end-points", element).val();
                
                let themeSelected = scope.ThemeOptions.find(t => t.ThemeId == parseInt(gameTheme));
                let scoreMetricSelected = scope.ScoringAreasList.find(a => a.MqfNumber == parseInt(scoringMetric));

                let hasTieBreakerScoring = $("#hasTieBreakerScoring", element).val();
                let tieBreakerScoringMqfNumber = $("#tieBreakerKpi_MqfNumber", element).val();
                let tieBreakerScoringScoringTypeId = $("#tieBreakerKpi_ScoringTypeId", element).val();

                if (gameName == "") {
                    errorMessages.push({ message: "Game Name Required", fieldclass: ".flex-game-editor-name", fieldid: "" });
                    formValid = false;
                }
                if (startDate == "") {
                    errorMessages.push({ message: "Start Date Required", fieldclass: ".flex-game-editor-start-date", fieldid: "" });
                    formValid = false;
                }
                if (endDate == "") {
                    errorMessages.push({ message: "End Date Required", fieldclass: ".flex-game-editor-end-date", fieldid: "" });
                    formValid = false;
                }
                if (gameSupervisor == "") {
                    errorMessages.push({ message: "Game Supervisor Required", fieldclass: ".flex-game-editor-supervisor-list", fieldid: "" });
                    formValid = false;
                }
                if (gameTheme == null || gameTheme == "") {
                    errorMessages.push({ message: "Game Theme Required", fieldclass: ".flex-game-theme-list", fieldid: "" });
                    formValid = false;
                }
                if (gameType == null || gameType == "") {
                    errorMessages.push({ message: "Game Type Required", fieldclass: ".flex-game-editor-game-type", fieldid: "" });
                    formValid = false;
                }
                if (scoringMetric == null || scoringMetric == "") {
                    errorMessages.push({ message: "Scoring Metric Required", fieldclass: ".flex-game-editor-scoring-area", fieldid: "" });
                    formValid = false;
                }
                //NOTE: SCORING TYPE RENAMED TO SCORING BASIS
                if (scoringType == null || scoringType == "") {
                    errorMessages.push({ message: "Scoring Basis Required", fieldclass: ".flex-game-editor-scoring-type", fieldid: "" });
                    formValid = false;
                }
                // if(scoringOption == null || scoringOption == "")
                // {
                //     errorMessages.push({ message: "Scoring Option Required", fieldclass: ".flex-game-editor-scoring-options", fieldid: "" });
                //     formValid = false;                    
                // }

                if (themeSelected != null) {
                    //NOTE: SCORING BASIS RENAMED TO SCORING MODEL
                    if (themeSelected.RequiresScoringBasis == true && (scoringBasis == null || scoringBasis == "")) {
                        errorMessages.push({ message: "Scoring Model Required", fieldclass: ".flex-game-editor-scoring-basis", fieldid: "" });
                        formValid = false;
                    }
                    if (themeSelected.RequiresEndingPointTotal == true && (endingPoints == null || endingPoints == "")) {
                        errorMessages.push({ message: "Ending Points Required", fieldclass: ".flex-game-editor-end-points", fieldid: "" });
                        formValid = false;
                    }
                }
                if (scoreMetricSelected != null) {
                    //NOTE: SCORING TYPE HAS BEEN RENAMED TO SCORING BASIS.
                    if (scoreMetricSelected.HasSubType == true && (subKpiScoringMetric == null || subKpiScoringMetric == "") && parseInt(scoringType) != 1) {
                        errorMessages.push({ message: "Scoring Basis can only be \"Scored Value\" in this Scoring Metric configuration.", fieldclass: ".flex-game-editor-scoring-type", fieldid: "" });
                        formValid = false;
                    }
                }

                if (startDate != "" && endDate != "" && new Date(startDate) > new Date(endDate)) {
                    errorMessages.push({ message: "Start date must occur before End Date", fieldclass: "", fieldid: "" });
                    formValid = false;
                }
                if (parseInt(scoringMetric) == 0 && parseInt(scoringType) != 4) {
                    //NOTE: SCORING TYPE RENAMED TO SCORING BASIS
                    errorMessages.push({ message: "The Balanced Score scoring metric must have Balanced Score selected for the scoring basis.", fieldclass: ".flex-game-editor-scoring-type", fieldid: "" });
                    formValid = false;
                }
                if (parseInt(scoringMetric) == 999999 && (scoringType == null || scoringType == "")) {
                    errorMessages.push({ message: "The User Input scoring metric can only have User INput as the scoring basis.", fieldclass: ".flex-game-editor-scoring-type", fieldid: "" });
                    formValid = false;
                }
                if (parseInt(scoringMetric) == 0 && parseInt(scoringBasis) != 2) {
                    //NOTE: SCORING BASIS RENAMED TO SCORING MODEL
                    errorMessages.push({ message: "The Balanced Score scoring metric can only have custom scoring as the Scoring Model.", fieldclass: ".flex-game-editor-scoring-basis", fieldid: "" });
                    formValid = false;
                }
                if(hasTieBreakerScoring == "true" || hasTieBreakerScoring == true)
                {
                    if(tieBreakerScoringMqfNumber == null || tieBreakerScoringMqfNumber == "" || tieBreakerScoringMqfNumber < 0)
                    {
                        errorMessages.push({ message: "Tie Breaker Scoring Metric required.", fieldclass: "", fieldid: "tieBreakerKpi_MqfNumber" });
                        formValid = false;
                    }
                    else if (tieBreakerScoringMqfNumber == scoringMetric)
                    {
                        errorMessages.push({ message: "Tie Breaker Scoring Metric can not match the Game Scoring Metric.", fieldclass: "", fieldid: "tieBreakerKpi_MqfNumber" });
                        formValid = false;
                    }

                    if(tieBreakerScoringScoringTypeId == null || tieBreakerScoringScoringTypeId == "" || tieBreakerScoringScoringTypeId < 0)
                    {
                        errorMessages.push({ message: "Tie Breaker Scoring Basis required.", fieldclass: "", fieldid: "tieBreakerKpi_ScoringTypeId" });
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
                            $(`#${item.fieldid}`, element).addClass("errorField");
                            $(`#${item.fieldid}`, element).off("blur").on("blur", function () {
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
            function ToggleChatForGame(gameId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "toggleChatForGame",
                        gameid: gameId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (callback != null) {
                            callback();
                        }
                    }
                });
            }
            function TogglePrizeForGame(gameId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "togglePrizeForGame",
                        gameid: gameId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (callback != null) {
                            callback();
                        }
                    }
                });
            }
            function ToggleSpinnerOptionForGame(gameId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "toggleSpinnerOptionForGame",
                        gameid: gameId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (callback != null) {
                            callback();
                        }
                    }
                });
            }
            function HideFaqPanel() {
                $(".flex-game-faq-holder", element).hide();
            };
            function ShowFaqPanel() {
                $(".flex-game-faq-holder", element).show();
            };
            function LoadFaqPanel() {
                var file = new XMLHttpRequest();
                file.onreadystatechange = function () {
                    if (file.readyState == XMLHttpRequest.DONE) {
                        if (file.status == 200) {
                            var info = file.responseText;
                            var faqButtonHolder = $("<div class=\"flex-game-button-holder\" />");
                            var faqCloseButton = $("<button class=\"flex-game-form-btn-cancel flex-game-form-btn-close\"><i class=\"fas fa-times\" aria-hidden=\"true\"></i></a>");
                            $(faqCloseButton).off("click").on("click", function () {
                                HideFaqPanel();
                            });
                            faqButtonHolder.append(faqCloseButton);

                            var faqInformation = $("<div class=\"faq-info-holder\" \>");
                            faqInformation.html(info);

                            $(".flex-game-faq-holder", element).empty();
                            $(".flex-game-faq-holder", element).append(faqButtonHolder);
                            $(".flex-game-faq-holder", element).append(faqInformation);

                            ShowFaqPanel();
                        }
                    }
                }
                file.open("GET", a$.debugPrefix() + "/applib/dev/AGAMEFLEX1/view/faqsFlex.htm", true);
                file.send();
            };
            function HideGameScoringEditorArea() {
                $(".flex-game-editor-scoring-area-holder", element).hide();
            }
            function ShowGameScoringEditorArea() {
                $(".flex-game-editor-scoring-area-holder", element).show();
            }
            function HideScoringBasis() {
                $(".flex-game-editor-scoring-basis-label", element).hide();
                $(".flex-game-editor-scoring-basis", element).hide();
            }
            function ShowScoringBasis() {
                $(".flex-game-editor-scoring-basis-label", element).show();
                $(".flex-game-editor-scoring-basis", element).show();
            }
            function HideEndPoints() {
                $(".flex-game-editor-end-points", element).hide();
                $(".flex-game-editor-ending-points-data-label", element).hide();
            }
            function ShowEndPoints() {
                $(".flex-game-editor-end-points", element).show();
                $(".flex-game-editor-ending-points-data-label", element).show();
            }
            function HideScoringOptions() {
                $(".flex-game-editor-scoring-options-label", element).hide();
                $(".flex-game-editor-scoring-options", element).hide();
            }
            function ShowScoringOptions() {
                $(".flex-game-editor-scoring-options-label", element).show();
                $(".flex-game-editor-scoring-options", element).show();
            }
            function HideGamePhrase() {
                $(".flex-game-editor-phrase-data-label", element).hide();
                $(".flex-game-editor-phrase-value", element).hide();
            }
            function ShowGamePhrase() {
                $(".flex-game-editor-phrase-data-label", element).show();
                $(".flex-game-editor-phrase-value", element).show();
            }
            function BuildPhraseScoreboardItem(gameObject, currentScore, holderObject, callback) {
                let score = parseInt(currentScore) || 0;

                let renderString = gameObject.GamePhraseValue;
                let renderHtml = $("<div class=\"leaderboard-editor-phrase-row\" />");
                for (var i = 0; i < renderString.length; i++) {
                    let renderItem = renderString[i];
                    if (renderItem != "_") {
                        if (renderItem == " ") {
                            renderItem = "&nbsp;";
                        }
                        else {
                            renderItem = renderItem.toUpperCase();
                        }
                        let scoreItem = $("<span class=\"leaderboard-editor-phrase-item\">" + renderItem + "</span>");

                        renderHtml.append(scoreItem);
                    }
                    else {
                        let spaceItem = $("<span class=\"leaderboard-editor-phrase-space-item\">&nbsp;</span>");
                        renderHtml.append(spaceItem);
                    }
                }

                $(".leaderboard-editor-phrase-item", $(renderHtml)).each(function (i) {
                    while (i < score) {
                        $(this).addClass("phrase-score-item-active");
                        i++;
                    }
                });
                $(holderObject, element).append(renderHtml);
                if (callback != null) {
                    callback();
                }

            }
            function SetInitialTabStatusInformation() {
                let defaultPanelId = "game-info-tab";
                SetEditorTabActive(defaultPanelId);
                ShowTabPanel(defaultPanelId);
            }
            function SetEditorTabActive(tabId) {
                $(".flex-game-editor-tab-item", element).each(function () {
                    $("#" + this.id).removeClass("active");
                    $("#" + this.id).addClass("inactive");
                });
                //"auto save" panels here.                
                if (tabId == "participants-tab" || tabId == "prizes-tab") {
                    $(".flex-game-form_buttons", element).hide();
                    $(".flex-game-form_buttonsNotNeeded", element).show();
                }
                else {
                    $(".flex-game-form_buttons", element).show();
                    $(".flex-game-form_buttonsNotNeeded", element).hide();
                    HandleButtonsAvailable();
                }
                $("#" + tabId, element).removeClass("inactive");
                $("#" + tabId, element).addClass("active");
            }
            function SetTabClickEvent() {
                $(".flex-game-editor-tab-item", element).each(function () {
                    $(this).off("click").on("click", function () {
                        ClearAllFilterOptions();
                        SetEditorTabActive(this.id);
                        ShowTabPanel(this.id);
                    });
                });
            }
            function ShowTabPanel(tabId) {
                ClearAllFilterOptions();
                $(".flex-game-editor-tab-panel", element).each(function () {
                    $(this).hide();
                });
                let displayPanel = tabId.replace("-tab", "-panel");
                $("#" + displayPanel, element).show();
            }
            function HideTab(tabId) {
                if (tabId == "all") {
                    $(".flex-game-editor-tab-item", element).each(function () {
                        $(this).hide();
                    });
                    $("#game-info-tab", element).show();
                    //$("#prizes-tab", element).show();
                    $("#user-score-entry-tab", element).show();
                }
                else {
                    $("#" + tabId, element).hide();
                }
            }
            function ShowTab(tabId) {
                ClearAllFilterOptions();
                if (tabId == "all") {
                    $(".flex-game-editor-tab-item", element).each(function () {
                        $(this).show();
                    });
                }
                else {
                    $("#" + tabId, element).show();
                }
            }
            function HideUiObjectByClassName(className) {
                $(className, element).hide();
            }
            function ShowUiObjectByClassName(className) {
                $(className, element).show();
            }
            function ClearAllFilterOptions() {
                ClearParticipantFilterOptions();
            }
            function RemoveAllParticipantsForGame() {
                let gameId = $(".flex-game-form-current-game-id", element).val();
                if (confirm("You are about to remove all of the participants from the game.\n\nPress OK to continue with this action.")) {
                    scope.WriteUserStatus("Removing all current particiapnts...", 10000);
                    scope.ClearGameParticipants(gameId, function (data, gameId) {
                        scope.LoadGameByGameId(gameId, false, false);
                        LoadPossibleParticipantsFiltered();
                        scope.HideUserStatus();
                    });
                }
            }
            function AddAllParticipantsToGame() {
                let userArray = [];

                $(".flex-participants-manager-available-user-remove-button", element).each(function () {
                    let id = this.id;
                    let userId = "";
                    if (id != null) {
                        userId = id.split('_')[1];
                    }
                    if (userId != null && userId != "") {
                        let userIndex = userArray.findIndex(u => u == userId);
                        if (userIndex < 0) {
                            userArray.push(userId);
                        }
                    }
                });
                for (let i = 0; i < userArray.length; i++) {
                    if ((i + 1) >= userArray.length) {
                        scope.ClearParticipantList();
                        AddParticipantToGame(userArray[i]);
                    }
                    else {
                        AddParticipantToGame(userArray[i], true, function () {
                            console.log("Performing add all option: [" + i + "] of [" + userArray.length + "]...");
                        });
                    }
                }
            }
            function RemoveParticipantFromGame(participantUserId, callback) {
                let gameId = $(".flex-game-form-current-game-id", element).val();
                let itemCommand = "removeParticipantFromGame";
                let gameTypeId = parseInt($(".flex-game-editor-game-type", element).val());
                let subGameTypeId = parseInt($(".flex-game-editor-sub-game-type", element).val());
                //TODO: Handling of "magic numbers"????
                switch (gameTypeId) {
                    case 2:
                        if (subGameTypeId == 2) {
                            itemCommand = "removeIntraTeamFromGame";
                        }
                        else {
                            itemCommand = "removeTeamFromGame";
                        }
                        break;
                }


                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: itemCommand,
                        itemId: participantUserId,
                        gameId: gameId
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) {
                        scope.LoadGameByGameId(gameId, false, false);
                        if (callback != null) {
                            callback();
                        }
                        else {
                            LoadPossibleParticipantsFiltered();
                            scope.HideUserStatus();
                        }
                    }
                });
            }
            function AddParticipantToGame(participantUserId, isAsync, callback) {
                scope.WriteUserStatus("Saving participant to game...", 10000);
                if (isAsync == null) {
                    isAsync = true;
                }
                let gameId = $(".flex-game-form-current-game-id", element).val();
                let itemCommand = "addParticipantToGame";
                let gameTypeId = parseInt($(".flex-game-editor-game-type", element).val());
                let subGameTypeId = parseInt($(".flex-game-editor-sub-game-type", element).val());
                //TODO: Handling of "magic numbers"????
                switch (gameTypeId) {
                    case 2:
                        if (subGameTypeId == 2) {
                            itemCommand = "addIntraTeamToGame";
                        }
                        else {
                            itemCommand = "addTeamToGame";
                        }
                        break;
                }


                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: isAsync,
                    data: {
                        lib: "flex",
                        cmd: itemCommand,
                        itemId: participantUserId,
                        gameId: gameId
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) {
                        scope.LoadGameByGameId(gameId, false, false);
                        if (callback != null) {
                            callback();
                        }
                        else {
                            LoadPossibleParticipantsFiltered();
                            scope.HideUserStatus();
                        }
                    }
                });
            }
            /*
            Manual User scoring entry options
            */
            function HideManualScoringEntryForm() {
                $(".flex-game-editor-user-score-entry-holder", element).hide();
            }
            function ShowManualScoringEntryForm() {
                $(".flex-game-editor-user-score-entry-holder", element).show();

            }
            function ClearManualScoringEntryForm(callback) {
                $(".flex-game-editor-user-entry-scores-date", element).val("");
                $(".flex-game-editor-user-entry-scores-user", element).val("");
                $(".flex-game-editor-user-entry-scores-area", element).val("");
                $(".flex-game-editor-user-entry-scores-score", element).val("");
                if (callback != null) {
                    callback();
                }
                else {
                    return;
                }

            }
            function AddManualScoringEntryItem(callback) {
                let manualScoreItem = new Object();
                manualScoreItem.FlexGameManualScoringId = -1;
                manualScoreItem.GameId = parseInt($(".flex-game-editor-user-entry-scores-game-id", element).val());
                manualScoreItem.UserId = $(".flex-game-editor-user-entry-scores-user", element).val();
                manualScoreItem.RecDate = new Date($(".flex-game-editor-user-entry-scores-date", element).val()).toLocaleDateString("en-US");
                manualScoreItem.FlexTestKpiId = parseInt($(".flex-game-editor-user-entry-scores-area", element).val());
                manualScoreItem.Score = parseFloat($(".flex-game-editor-user-entry-scores-score", element).val());
                manualScoreItem.EntDt = new Date().toLocaleDateString("en-US");
                manualScoreItem.EntBy = legacyContainer.scope.TP1Username;

                if (manualScoreItem != null) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "flex",
                            cmd: "saveManualScoreItem",
                            manualscoreitem: JSON.stringify(manualScoreItem)
                        },
                        dataType: "json",
                        cache: false,
                        error: function (response) {
                            a$.ajaxerror(response);
                        },
                        success: function (data) {
                            let id = data.flexGameManualScoringId;
                            ClearManualScoringEntryForm();
                            if (callback != null) {
                                callback();
                            }
                        }
                    });
                }
            }
            function UpdateManualScoringEntryItem(manualScoringId, callback) {
                let manualScoreItem = new Object();
                manualScoreItem.FlexGameManualScoringId = manualScoringId;
                manualScoreItem.GameId = parseInt($("#manualScoreGameId_" + manualScoringId, element).val());
                manualScoreItem.UserId = $("#manualScoreUserId_" + manualScoringId, element).val();
                manualScoreItem.RecDate = new Date($("#manualScoreScoringDate_" + manualScoringId, element).val()).toLocaleDateString("en-US");
                manualScoreItem.FlexTestKpiId = parseInt($("#manualScoreScoringAreaId_" + manualScoringId, element).val());
                manualScoreItem.Score = parseFloat($("#manualEntryItem_" + manualScoringId, element).val());
                manualScoreItem.EntDt = new Date($("#manualScoreEnterDate_" + manualScoringId, element).val()).toLocaleDateString("en-US");
                manualScoreItem.EntBy = $("#manualScoreEnterBy_" + manualScoringId, element).val();

                var gameId = manualScoreItem.GameId;

                if (manualScoreItem != null) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "flex",
                            cmd: "saveManualScoreItem",
                            manualscoreitem: JSON.stringify(manualScoreItem)
                        },
                        dataType: "json",
                        cache: false,
                        error: function (response) {
                            a$.ajaxerror(response);
                        },
                        success: function (data) {
                            let id = data.flexGameManualScoringId;
                            ClearManualScoringEntryForm();
                            if (callback != null) {
                                callback(manualScoringId, gameId);
                            }
                        }
                    });
                }
            }
            function RemoveManualScoringEntryItem(idToRemove, callback) {
                if (idToRemove != null && confirm("Are you sure you wish to remove this record?\n Press OK to continue.")) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "flex",
                            cmd: "removeManualScoreItem",
                            id: idToRemove
                        },
                        dataType: "json",
                        cache: false,
                        error: function (response) {
                            a$.ajaxerror(response);
                        },
                        success: function (data) {
                            if (callback != null) {
                                callback();
                            }
                        }
                    });
                }
            }
            function ValidateManualEntryFormData(callback) {
                $(".error-information-holder", element).empty();
                var formValid = true;
                var errorMessages = [];

                let gameId = $(".flex-game-editor-user-entry-scores-gameid", element).val();
                let userIdForScore = $(".flex-game-editor-user-entry-scores-user", element).val();
                let scoringArea = $(".flex-game-editor-user-entry-scores-area", element).val();
                let scoreDate = $(".flex-game-editor-user-entry-scores-date", element).val();
                let userScore = $(".flex-game-editor-user-entry-scores-score", element).val();

                let game = scope.GameList.find(g => g.FlexGameId == parseInt(gameId));

                if (userIdForScore == "") {
                    errorMessages.push({ message: "User Required", fieldclass: ".flex-game-editor-user-entry-scores-user", fieldid: "" });
                    formValid = false;
                }
                if (scoringArea == "") {
                    errorMessages.push({ message: "Scoring Area Required", fieldclass: ".flex-game-editor-user-entry-scores-area", fieldid: "" });
                    formValid = false;
                }
                if (scoreDate == "") {
                    errorMessages.push({ message: "Scoring Date Required", fieldclass: ".flex-game-editor-user-entry-scores-date", fieldid: "" });
                    formValid = false;
                }
                else {
                    if (game != null) {
                        if (new Date(game.StartGame) > new Date(scoreDate)) {
                            errorMessages.push({ message: "Scoring Date before start of game.", fieldclass: ".flex-game-editor-user-entry-scores-date", fieldid: "" });
                            formValid = false;
                        }
                        if (new Date(game.GameEndDate) < new Date(scoreDate)) {
                            errorMessages.push({ message: "Scoring Date after end of game.", fieldclass: ".flex-game-editor-user-entry-scores-date", fieldid: "" });
                            formValid = false;
                        }
                    }
                }
                //TODO: Handle the unique infomration to ensure we only have 1 of these things.
                // let manualScoringItem = scope.ManualScoringItemsForGame.find();
                // if(manualScoringItem != null)
                // {
                //     errorMessages.push({message: "Date, User, Area combination already exists.", fieldclass:".flex-game-editor-user-entry-scores-area", fieldid:""});
                //     formValid = false;
                // }
                if (userScore == "") {
                    errorMessages.push({ message: "Score Required", fieldclass: ".flex-game-editor-user-entry-scores-score", fieldid: "" });
                    formValid = false;
                }

                if (formValid) {
                    if (callback != null) {
                        callback();
                    }
                }
                else {
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
                    }
                    if (messageString != "") {
                        messageString += "</ul>";

                        $(".error-information-holder", element).html(messageString);
                        $(".error-information-holder", element).show();
                    }
                }

            }
            function LoadManualScoringEntryForm(gameId, callback) {
                $(".flex-game-editor-user-score-entry-current-list", element).empty();
                $(".flex-game-editor-user-entry-scores-game-id", element).val(gameId);
                let game = scope.GameList.find(g => g.FlexGameId == gameId);
                let entryFormDate = new Date().toLocaleDateString();
                if (game != null && game.GameEndDate != null) {
                    if (new Date(game.GameEndDate) < new Date()) {
                        entryFormDate = new Date(game.GameEndDate).toLocaleDateString();
                    }
                }
                $(".flex-game-editor-user-entry-scores-date", element).val(entryFormDate);

                LoadCurrentManualScoringForGame(gameId, function () {
                    LoadManualScoringEntryUsersList(gameId, function () {
                        LoadManualScoringEntryScoringOptionsList(gameId, function () {
                            if (callback != null) {
                                callback();
                            }
                        });
                    });
                });
            }
            function HideManualScoreInput(id) {
                $("#manualEntryLabel_" + id, element).show();
                $("#manualEntryItem_" + id, element).hide();
            }
            function ShowManualScoreInput(id) {
                let isCurrentlyVisible = false;
                isCurrentlyVisible = $("#manualEntryItem_" + id, element).is(":visible");
                if (isCurrentlyVisible) {
                    HideManualScoreInput(id);
                }
                else {
                    $("#manualEntryLabel_" + id, element).hide();
                    $("#manualEntryItem_" + id, element).show();
                }
            }
            function LoadManualScoringEntryUsersList(gameId, callback) {
                let game = scope.GameList.find(g => g.FlexGameId == gameId);
                let activeCount = 0;

                let currentUserFilter = $("#manual-entry-filter-user-id", element).val();
                if (game != null) {
                    if (game.GameParticipants != null && game.GameParticipants.length > 0) {

                        $(".flex-game-editor-user-entry-scores-user", element).empty();
                        $(".flex-game-editor-user-entry-scores-user", element).append($('<option />', { value: "", text: "" }));

                        $("#manual-entry-filter-user-id", element).empty();
                        $("#manual-entry-filter-user-id", element).append($('<option />', { value: "", text: "" }));
                        activeCount = game.GameParticipants.length;

                        for (let p = 0; p < game.GameParticipants.length; p++) {

                            let item = game.GameParticipants[p];
                            $(".flex-game-editor-user-entry-scores-user", element).append($('<option />', { value: item.UserId, text: item.UserFullName }));
                            $("#manual-entry-filter-user-id", element).append($('<option />', { value: item.UserId, text: item.UserFullName }));
                        }

                        $(".flex-game-editor-user-entry-scores-user", element).val(currentUserFilter);
                        $("#manual-entry-filter-user-id", element).val(currentUserFilter);
                    }
                }
                if (activeCount == 1) {
                    $(".flex-game-editor-user-entry-scores-user", element).prop("selectedIndex", 1);
                }
                if (callback != null) {
                    callback();
                }
            }
            function LoadManualScoringEntryScoringOptionsList(gameId, callback) {
                GetManualScoringOptionsForGame(gameId, function (scoringOptions) {
                    let activeCount = 0;
                    if (scoringOptions != null && scoringOptions.length > 0) {
                        $(".flex-game-editor-user-entry-scores-area", element).empty();
                        $(".flex-game-editor-user-entry-scores-area", element).append($('<option />', { value: "", text: "" }));

                        for (let o = 0; o < scoringOptions.length; o++) {
                            let item = scoringOptions[o];
                            if (item.IsActive == true) {
                                activeCount++;
                                $(".flex-game-editor-user-entry-scores-area", element).append($('<option />', { value: item.Id, text: item.Name }));
                            }
                        }
                    }
                    if (activeCount == 1) {
                        $(".flex-game-editor-user-entry-scores-area", element).prop("selectedIndex", 1);
                    }
                    if (callback != null) {
                        callback();
                    }
                });

            }
            function GetManualScoringOptionsForGame(gameId, callback) {
                let manualScoringOptions = [];
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getPossibleManualScoringAreas"
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) {
                        manualScoringOptions = $.parseJSON(data.manualScoringAreas);
                        if (callback != null) {
                            callback(manualScoringOptions);
                        }
                    }
                });
            }
            function LoadCurrentManualScoringForGame(gameId, callback) {
                GetCurrentManualScoringForGame(gameId, function (scoringItems) {
                    FilterManualEntryForm(null, callback);
                    // RenderCurrentManualScoringItems(scoringItems, function () {
                    //     if (callback != null) {
                    //         callback();
                    //     }
                    // })
                });
            }
            function GetCurrentManualScoringForGame(gameId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getCurrentManualScores",
                        gameid: gameId
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) {
                        let currentScoringItems = $.parseJSON(data.currentManualScores);
                        scope.CurrentManualScoringItems = currentScoringItems;
                        if (callback != null) {
                            callback(currentScoringItems);
                        }
                    }
                });
            }
            function SortScoringItems(arrayToSort) {
                return arrayToSort = arrayToSort.sort((a, b) => {
                    if (a.RecDate < b.RecDate) {
                        return -1;
                    }
                    if (a.RecDate > b.RecDate) {
                        return 1;
                    }
                    if (a.RecDate == b.RecDate) {
                        if (a.UserId < b.UserId) {
                            return -1;
                        }
                        if (a.UserId > b.UserId) {
                            return 1;
                        }
                        if (a.UserId == b.UserId) {
                            if (a.KpiName < b.KpiName) {
                                return -1;
                            }
                            if (a.KpiName > b.KpiName) {
                                return 1;
                            }
                            return 0;
                        }
                    }
                });
            }
            function RenderCurrentManualScoringItems(currentScoringItems, callback) {
                let currentScoreListHolder = $("<div class=\"flex-game-user-scores-editor-list-holder\" />");
                if (currentScoringItems != null && currentScoringItems.length > 0) {
                    currentScoringItems = SortScoringItems(currentScoringItems);

                    let gameId = currentScoringItems[0].GameId;
                    let game = scope.GameList.find(g => g.FlexGameId == gameId);

                    for (let i = 0; i < currentScoringItems.length; i++) {
                        let item = currentScoringItems[i];
                        let user = null;
                        if (game != null) {
                            user = game.GameParticipants.find(u => u.UserId == item.UserId);
                        }
                        let userName = item.UserId;
                        if (user != null) {
                            userName = user.UserFullName;
                        }

                        let currentScoreListItem = $("<div class=\"flex-game-user-scores-editor-list-item\" />");

                        let currentScoreListItemId = $("<input type=\"hidden\" id=\"flexGameManualScoringId_" + item.FlexGameManualScoringId + "\" value=\"" + item.FlexGameManualScoringId + "\" />");
                        let entByItem = $("<input type=\"hidden\" id=\"manualScoreEnterBy_" + item.FlexGameManualScoringId + "\" value=\"" + item.EntBy + "\" />");
                        let entDateItem = $("<input type=\"hidden\" id=\"manualScoreEnterDate_" + item.FlexGameManualScoringId + "\" value=\"" + new Date(item.EntDt).toLocaleDateString() + "\" />");
                        let currentUserId = $("<input type=\"hidden\" id=\"manualScoreUserId_" + item.FlexGameManualScoringId + "\" value=\"" + item.UserId + "\" />");
                        let currentScoringAreaId = $("<input type=\"hidden\" id=\"manualScoreScoringAreaId_" + item.FlexGameManualScoringId + "\" value=\"" + item.FlexTestKpiId + "\" />");
                        let currentScoringDate = $("<input type=\"hidden\" id=\"manualScoreScoringDate_" + item.FlexGameManualScoringId + "\" value=\"" + new Date(item.RecDate).toLocaleDateString("en-US") + "\" />");
                        let currentGameId = $("<input type=\"hidden\" id=\"manualScoreGameId_" + item.FlexGameManualScoringId + "\" value=\"" + item.GameId + "\" />");

                        let currentScoreListItemDateHolder = $("<div class=\"flex-game-user-scores-editor-item user-scores-score-date\" />");
                        currentScoreListItemDateHolder.append(new Date(item.RecDate).toLocaleDateString());

                        let currentScoreListItemUserHolder = $("<div class=\"flex-game-user-scores-editor-item user-scores-score-user-name\" />");
                        currentScoreListItemUserHolder.append(userName);

                        let currentScoreListItemScoreAreaHolder = $("<div class=\"flex-game-user-scores-editor-item user-scores-score-area\" />");
                        currentScoreListItemScoreAreaHolder.append(item.KpiName);

                        let currentScoreListItemScoreHolder = $("<div class=\"flex-game-user-scores-editor-item user-scores-score-item\" id=\"manualEntryLabel_" + item.FlexGameManualScoringId + "\" />");
                        currentScoreListItemScoreHolder.append(item.Score);
                        if (new Date(item.RecDate) <= new Date()) {
                            $(currentScoreListItemScoreHolder, element).off("click").on("click", function () {
                                let id = this.id;
                                let itemId = id.split('_')[1];
                                ShowManualScoreInput(itemId);
                            });
                        }

                        let currentScoreListItemScoreInput = $("<input id=\"manualEntryItem_" + item.FlexGameManualScoringId + "\" value=\"" + item.Score + "\" />");
                        $(currentScoreListItemScoreInput, element).off("blur").on("blur", function () {
                            let id = this.id;
                            let itemId = id.split('_')[1];
                            UpdateManualScoringEntryItem(itemId, function (itemId, gameId) {
                                HideManualScoreInput(itemId);
                                LoadManualScoringEntryForm(gameId);
                            });
                        });

                        $(currentScoreListItemScoreInput, element).hide();

                        let currentScoreListItemButtonHolder = $("<div class=\"flex-game-user-scores-editor-item user-scores-button-holder\" />");

                        // let currentScoreEditButton = $("<button id=\"editManualEntryItem_" + item.FlexGameManualScoringId + "\" ><i class=\"fa fa-edit\"></i></button>");
                        // $(currentScoreEditButton, element).off("click").on("click", function () {
                        //     let id = this.id;
                        //     let itemId = id.split('_')[1];
                        //     ShowManualScoreInput(itemId);
                        // });
                        // let currentScoreDeleteButton = $("<button class=\"button--red\" id=\"deleteManualEntryItem_" + item.FlexGameManualScoringId + "\"><i class=\"fa fa-trash\"></i></button>");
                        // $(currentScoreDeleteButton, element).off("click").on("click", function () {
                        //     let id = this.id;
                        //     let itemId = id.split('_')[1];

                        //     RemoveManualScoringEntryItem(itemId, function () {
                        //         let gameId = $(".flex-game-editor-user-entry-scores-game-id", element).val();
                        //         LoadManualScoringEntryForm(gameId);
                        //     });
                        // });

                        // currentScoreListItemButtonHolder.append(currentScoreEditButton);
                        // currentScoreListItemButtonHolder.append("&nbsp;");
                        // currentScoreListItemButtonHolder.append(currentScoreDeleteButton);

                        currentScoreListItem.append(currentScoreListItemId);
                        currentScoreListItem.append(entByItem);
                        currentScoreListItem.append(entDateItem);
                        currentScoreListItem.append(currentUserId);
                        currentScoreListItem.append(currentScoringAreaId);
                        currentScoreListItem.append(currentScoringDate);
                        currentScoreListItem.append(currentGameId);

                        currentScoreListItem.append(currentScoreListItemDateHolder);
                        currentScoreListItem.append(currentScoreListItemUserHolder);
                        currentScoreListItem.append(currentScoreListItemScoreAreaHolder);
                        currentScoreListItem.append(currentScoreListItemScoreHolder);
                        currentScoreListItem.append(currentScoreListItemScoreInput);
                        currentScoreListItem.append(currentScoreListItemButtonHolder);

                        currentScoreListHolder.append(currentScoreListItem);
                    }
                }
                else {
                    currentScoreListHolder.append("No scores currently found.");
                }

                $(".flex-game-editor-user-score-entry-current-list", element).empty();
                $(".flex-game-editor-user-score-entry-current-list", element).append(currentScoreListHolder);
                if (callback != null) {
                    callback();
                }
            }
            function FilterManualEntryForm(currentScoringItems, callback) {
                let dateFilter = "";
                let userFilter = $("#manual-entry-filter-user-id", element).val();
                if ($("#manual-entry-filter-rec-date", element).val() != "") {
                    dateFilter = new Date($("#manual-entry-filter-rec-date", element).val()).toLocaleDateString();
                }
                if (currentScoringItems == null) {
                    currentScoringItems = scope.CurrentManualScoringItems;
                }
                let entriesToRender = currentScoringItems;
                if (currentScoringItems != null && currentScoringItems.length > 0) {
                    entriesToRender = currentScoringItems.filter(mei => (new Date(mei.RecDate).toLocaleDateString() == dateFilter || dateFilter == null || dateFilter == "") && (mei.UserId == userFilter || userFilter == "" || userFilter == null));
                }
                RenderCurrentManualScoringItems(entriesToRender, callback);

            }
            /*
Manual User Scoring Entry Options END
*/
            /*Rewards Assignment Start*/
            function HideRewardsAssignmentEntryForm(callback) {
                $(".flex-game-editor-rewards-assignment-holder", element).hide();
                if (callback != null) {
                    callback();
                }
            }
            function ShowRewardsAssignmentEntryFrom(callback) {
                $(".flex-game-editor-rewards-assignment-holder", element).show();
                if (callback != null) {
                    callback();
                }
            }
            function ClearRewardsAssignmentEntryForm(callback) {
                //TODO: Determine what the clear function does for the form.
                if (callback != null) {
                    callback();
                }
            }
            function LoadRewardsAssignmentEntryForm(gameId, callback) {
                scope.WriteUserStatus("Loading the rewards assignment information...");

                let returnArray = [];

                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "getManualRewardAssignments",
                        gameid: gameId
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) {
                        let manualRewardAssignments = $.parseJSON(data.manualRewardAssignments);

                        scope.CurrentGameRewardAssignments.length = 0;
                        for (let o = 0; o < manualRewardAssignments.length; o++) {
                            scope.CurrentGameRewardAssignments.push(manualRewardAssignments[o]);
                        }

                        if (callback != null) {
                            callback(gameId, null);
                        }
                    }
                });

            }
            function RenderRewardsAssignmentEntryForm(gameId, currentPrizeAssignments, callback) {
                scope.WriteUserStatus("Rendering the rewards assignment information...");
                $("#flex-game-editor-rewards-assignment-game-id", element).val(gameId);

                if (currentPrizeAssignments == null) {
                    currentPrizeAssignments = scope.CurrentGameRewardAssignments;
                }
                let rewardsDataHolder = $("<div />");
                let game = scope.GameList.find(g => g.FlexGameId == gameId);

                let possibleUsers = game.GameParticipants || [];

                //get the rank based on the game information.
                for (let u = 0; u < possibleUsers.length; u++) {
                    possibleUsers[u].UserGameRank = 99999;
                    let boardItem = game.GameLeaderboard.find(cu => cu.UserId == possibleUsers[u].UserId);
                    if (boardItem != null) {
                        possibleUsers[u].UserGameRank = boardItem.StackRank;
                    }
                }
                //sort the users by the game rank
                possibleUsers = possibleUsers.sort((a, b) => {
                    if (a.UserGameRank < b.UserGameRank) {
                        return -1;
                    }
                    if (a.UserGameRank > b.UserGameRank) {
                        return 1;
                    }
                    return 0;
                });

                let possiblePrizes = GetPossiblePrizesForAssignments(gameId);
                for (let i = 0; i < possibleUsers.length; i++) {
                    let item = possibleUsers[i];

                    let rewardAssignmentRow = $("<div class=\"flex-game-editor-rewards-assignment-user-row-holder\" />");

                    let userRankHolder = $("<div class=\"flex-game-editor-rewards-assignment-item-holder user-item-rank\" />");
                    let userRank = item.UserGameRank;
                    if (userRank == 99999) //The Default rank...set to a blank space
                    {
                        userRank = "&nbsp;";
                    }
                    userRankHolder.append(userRank);

                    let userNameHolder = $("<div class=\"flex-game-editor-rewards-assignment-item-holder user-item-name\" />");

                    let userName = item.UserId;
                    if (item.UserFullName != null && item.UserFullName != "") {
                        userName = item.UserFullName;
                    }
                    let userId = $("<input type=\"hidden\" class=\"flex-game-editor-rewards-assignment-user-id\" id=\"prizeOptionUserId_" + item.UserId + "\" value=\"" + item.UserId + "\" />");
                    userNameHolder.append(userId);
                    userNameHolder.append(userName);

                    let prizeForUserHolder = $("<div class=\"flex-game-editor-rewards-assignment-item-holder prize-item\" />");
                    let prizeOptionSelector = $("<select class=\"flex-game-editor-rewards-editor-assignment-prize\" id=\"prizeOptionSelector_" + item.UserId + "\"></select>");
                    prizeOptionSelector.append($("<option />"));
                    let activePrizeCount = 0;

                    if (possiblePrizes != null) {
                        for (let p = 0; p < possiblePrizes.length; p++) {
                            let ppo = possiblePrizes[p];

                            if (ppo.IsActive == true) {
                                activePrizeCount++;
                                let prizeOption = $("<option value=\"" + ppo.PrizeOptionId + "\">" + ppo.PrizeOptionName + "</option>");
                                prizeOptionSelector.append(prizeOption);
                            }
                        }
                    }

                    // if (clientPossiblePrizes != null && clientPossiblePrizes.length > 0) {
                    //     for (let p = 0; p < clientPossiblePrizes.length; p++) {
                    //         let ppo = clientPossiblePrizes[p];

                    //         if (ppo.IsActive == true) {
                    //             activePrizeCount++;
                    //             let prizeOption = $("<option value=\"" + ppo.PrizeOptionId + "\">" + ppo.PrizeOptionName + "</option>");
                    //             prizeOptionSelector.append(prizeOption);
                    //         }
                    //     }
                    // }
                    // else {
                    //     for (let p = 0; p < possiblePrizes.length; p++) {
                    //         let ppo = possiblePrizes[p];

                    //         if (ppo.IsActive == true) {
                    //             activePrizeCount++;
                    //             let prizeOption = $("<option value=\"" + ppo.ManualRewardId + "\">" + ppo.RewardName + "</option>");
                    //             prizeOptionSelector.append(prizeOption);
                    //         }
                    //     }
                    // }

                    let claimDateInfo = $("<label class=\"flex-game-editor-rewards-editor-claim-date\" />");
                    prizeForUserHolder.append(prizeOptionSelector);
                    prizeForUserHolder.append(claimDateInfo);

                    let buttonOptionHolder = $("<div class=\"flex-game-editor-rewards-assignment-item-holder button-option-item\" />");
                    let assignedDate = new Date().toLocaleDateString();
                    let currentId = 0;

                    let currentAssignedItem = currentPrizeAssignments.find(i => i.UserId == item.UserId && i.GameId == gameId);
                    let claimDate = null;
                    //TODO: Fix multiple reward assignments for a user/game

                    if (currentAssignedItem != null) {
                        if (currentAssignedItem.ClaimedDate != null) {
                            $(prizeOptionSelector, element).prop("disabled", true);
                            claimDate = new Date(currentAssignedItem.ClaimedDate);
                            $(claimDateInfo, element).text(claimDate.toLocaleDateString() + "@" + claimDate.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }));
                        }

                        $(prizeOptionSelector, element).val(currentAssignedItem.ManualRewardId);
                        currentId = currentAssignedItem.FlexGameManualRewardAssignmentId;
                        assignedDate = new Date(currentAssignedItem.AssignedDate).toLocaleDateString();
                    }

                    let assignedDateInformation = $("<input type=\"hidden\" class=\"flex-game-editor-rewards-assignment-date\" id=\"prizeOptionAssignedDate_" + item.UserId + "\" value=\"" + assignedDate + "\" />");
                    let currentIdInfo = $("<input type=\"hidden\" class=\"flex-game-editor-rewards-assignment-id\" id=\"prizeOptionAssignedRewardId_" + item.UserId + "\" value=\"" + currentId + "\" />");
                    let claimedDateInfo = $("<input type=\"hidden\" id=\"prizeOptionClaimedDate_" + item.UserId + "\" />");
                    claimedDateInfo.val(claimDate);


                    buttonOptionHolder.append(assignedDateInformation);
                    buttonOptionHolder.append(currentIdInfo);
                    buttonOptionHolder.append(claimedDateInfo);

                    rewardAssignmentRow.append(userRankHolder);
                    rewardAssignmentRow.append(userNameHolder);
                    rewardAssignmentRow.append(prizeForUserHolder);
                    rewardAssignmentRow.append(buttonOptionHolder);

                    rewardsDataHolder.append(rewardAssignmentRow);
                }

                $(".flex-game-editor-rewards-assignment-current-assignments", element).empty();
                $(".flex-game-editor-rewards-assignment-current-assignments", element).append(rewardsDataHolder);


                //TODO: Determine what the render function does for the form.
                if (callback != null) {
                    callback();
                }
            }
            function GetPossiblePrizesForAssignments(gameId) {
                let returnArray = [];

                if (gameId != null) {
                    let game = scope.GameList.find(g => g.FlexGameId == gameId);
                    //spinner options are off for now.
                    // if (game != null && game.HasSpinnerOptions == true) {
                    //     for (let spinnerIndex = 0; spinnerIndex < game.SpinnerOptions.length; spinnerIndex++) {
                    //         let spinnerItem = game.SpinnerOptions[spinnerIndex];
                    //         if (spinnerItem.ClientPrizeOptionIdSource != null) {
                    //             returnArray.push(spinnerItem.ClientPrizeOptionIdSource);
                    //         }
                    //         else {
                    //             let prizeItem = clientPossiblePrizes.find(i => i.PrizeOptionId == spinnerItem.ClientPrizeOptionId)
                    //             if (prizeItem != null) {
                    //                 returnArray.push(prizeItem);
                    //             }
                    //         }
                    //     }
                    // }
                }

                // a$.ajax({
                //     type: "POST",
                //     service: "C#",
                //     async: false,
                //     data: {
                //         lib: "flex",
                //         cmd: "getCurrentManualRewardOptions"
                //     },
                //     dataType: "json",
                //     cache: false,
                //     error: function (response) {
                //         a$.ajaxerror(response);
                //     },
                //     success: function (data) {
                //         let manualRewardOptions = $.parseJSON(data.manualRewardOptions);
                //         for (let o = 0; o < manualRewardOptions.length; o++) {
                //             returnArray.push(manualRewardOptions[o]);
                //         }
                //     }
                // });
                return returnArray;
            }
            function ValidateRewardsAssignmentForm(callback) {
                //TODO: Determine the validations for the form.
                if (callback != null) {
                    callback();
                }
            }
            function SaveRewardsAssignmentForm(callback) {
                scope.WriteUserStatus("Collecting and Saving the assignments...");
                let game = scope.GameList.find(g => g.FlexGameId == gameId);

                let possibleUsers = game.GameParticipants;
                let rewardsToAssign = [];

                if (possibleUsers != null && possibleUsers.length > 0) {
                    for (let u = 0; u < possibleUsers.length; u++) {
                        let item = possibleUsers[u];
                        let rewardAssignment = BuildRewardAssignmentItemForUser(item.UserId);
                        if (rewardAssignment != null) {
                            rewardsToAssign.push(rewardAssignment);
                        }
                    }
                }
                if (rewardsToAssign.length > 0) {

                    SaveRewardsAssignment(rewardsToAssign);

                    if (callback != null) {
                        scope.HideUserStatus();
                        callback();
                    }
                }

            }
            function BuildRewardAssignmentItemForUser(userId) {
                let currentAssignmentId = $("#prizeOptionAssignedRewardId_" + userId, element).val();
                let prizeId = $("#prizeOptionSelector_" + userId, element).val();
                let assignedDate = new Date($("#prizeOptionAssignedDate_" + userId, element).val()).toLocaleDateString();
                let gameId = $("#flex-game-editor-rewards-assignment-game-id", element).val();
                let claimDate = $("#prizeOptionClaimedDate_" + userId, element).val();
                if (claimDate == null || claimDate == "") {
                    claimDate = null;
                }
                else {
                    claimDate = new Date(claimDate).toLocaleDateString();
                }

                if (prizeId == "") {
                    prizeId = -1;
                }

                let rewardAssignmentItem = new Object();
                rewardAssignmentItem.FlexGameManualRewardAssignmentId = currentAssignmentId;
                rewardAssignmentItem.ClientId = -1;
                rewardAssignmentItem.AssignedDate = assignedDate;
                rewardAssignmentItem.UserId = userId;
                rewardAssignmentItem.ManualRewardId = prizeId;
                rewardAssignmentItem.GameId = gameId;
                rewardAssignmentItem.AssignedDate = assignedDate;
                rewardAssignmentItem.ClaimedDate = claimDate;
                rewardAssignmentItem.FulfilledDate = null;
                rewardAssignmentItem.FulfilledBy = null;

                return rewardAssignmentItem;
            }
            function SaveRewardsAssignment(objectListToSave, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "saveManualRewardAssignments",
                        rewardassignments: JSON.stringify(objectListToSave)
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) {
                        if (callback != null) {
                            callback();
                        }
                        else {
                            return;
                        }
                    }
                });
            }
            /*Rewards Assignment End*/
            //Game Prize Options Start
            function LoadPossibleRewardTypePositions(forceReload, callback) {
                if (forceReload != null && forceReload == true) {
                    possiblePositionRewardOptionList.length = 0;
                }
                if (possiblePositionRewardOptionList != null && possiblePositionRewardOptionList.length > 0) {
                    if (callback != null) {
                        callback(possiblePositionRewardOptionList);
                    }
                }
                else {
                    a$.ajax({
                        type: "GET",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "flex",
                            cmd: "getAllRewardPositionOptions"
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (jsonData) {
                            let returnData = null;
                            if (jsonData.RewardPositionOptions != null) {
                                returnData = JSON.parse(jsonData.RewardPositionOptions);
                                possiblePositionRewardOptionList.length = 0;
                                possiblePositionRewardOptionList = returnData;
                            }
                            if (callback != null) {
                                callback(returnData);
                            }
                            return;
                        }
                    });
                }
            }
            function LoadPossibleClientPrizeOptions(forceReload, callback) {
                if (forceReload != null && forceReload == true) {
                    clientPossiblePrizes.length = 0;
                }
                if (clientPossiblePrizes != null && clientPossiblePrizes.length > 0) {
                    if (callback != null) {
                        callback(clientPossiblePrizes);
                    }

                }
                else {
                    a$.ajax({
                        type: "GET",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "getPrizeOptionsList",
                            includeinactive: false,
                            includeglobaloptions: false
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (jsonData) {
                            let returnData = null;
                            if (jsonData.prizeOptionsList != null) {
                                returnData = JSON.parse(jsonData.prizeOptionsList);
                                clientPossiblePrizes.length = 0;
                                clientPossiblePrizes = returnData;
                            }
                            if (callback != null) {
                                callback(returnData);
                            }
                            return;
                        }
                    });
                }
            }
            function LoadPossibleTrophyOptions(forceReload, callback) {
                if (forceReload != null && forceReload == true) {
                    possibleTrophies.length = 0;
                }
                if (possibleTrophies != null && possibleTrophies.length > 0) {
                    if (callback != null) {
                        callback(possibleTrophies);
                    }
                }
                else {
                    a$.ajax({
                        type: "GET",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "selfserve",
                            cmd: "getAllAvailableTrophies",
                            deepLoad: false
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (jsonData) {
                            let returnData = null;
                            if (jsonData.trophiesList != null) {
                                returnData = JSON.parse(jsonData.trophiesList);
                                possibleTrophies.length = 0;
                                possibleTrophies = returnData;
                            }
                            if (callback != null) {
                                callback(returnData);
                            }
                            return;
                        }
                    });
                }

            }
            function RenderPossibleRewardTypePositions() {
                $("#addPositionRewardList", element).empty();
                $("#addPositionRewardList", element).append($('<option />', { value: "", text: "Select Position" }));


                for (let posCnt = 0; posCnt < possiblePositionRewardOptionList.length; posCnt++) {
                    let dataItem = possiblePositionRewardOptionList[posCnt];
                    if(dataItem.IsActive == true)
                    {
                        $("#addPositionRewardList", element).append($('<option />', { value: dataItem.Id, text: dataItem.Name }));
                    }
                }
            }
            function RenderPossiblePrizeOptions() {
                $("#addPrizeRewardList", element).empty();
                $("#addPrizeRewardList", element).append($('<option />', { value: "", text: "Select Prize" }));


                for (let posCnt = 0; posCnt < clientPossiblePrizes.length; posCnt++) {
                    let dataItem = clientPossiblePrizes[posCnt];
                    if(dataItem.IsActive == true)
                    {
                        $("#addPrizeRewardList", element).append($('<option />', { value: dataItem.PrizeOptionId, text: dataItem.Name }));
                    }
                }
            }
            function RenderPossibleTrophyOptions() {
                $("#addTrophyList", element).empty();
                $("#addTrophyList", element).append($('<option />', { value: "", text: "Select Trophy" }));
                for (let posCnt = 0; posCnt < possibleTrophies.length; posCnt++) {
                    let dataItem = possibleTrophies[posCnt];
                    if(dataItem.IsActive == true)
                    {
                        $("#addTrophyList", element).append($('<option />', { value: dataItem.TrophyId, text: dataItem.Name }));
                    }
                }
            }
            function LoadCurrentGamePrizeOptions(gameId, callback) {
                GetCurrentGamePrizeOptions(gameId, function (optionList) {
                    RenderCurrentGamePrizeOptions(optionList, function () {
                        if (callback != null) {
                            callback();
                        }
                    });
                });
            }
            function GetCurrentGamePrizeOptions(gameId, callback) {
                let returnOptionList = [];
                if (gameId > 0) {
                    let game = scope.GameList.find(g => g.FlexGameId == gameId);
                    if (game != null && game.RewardOptions != null) {
                        returnOptionList = game.RewardOptions;
                    }
                    //TODO: Determine if we have something?
                }
                if (callback != null) {
                    callback(returnOptionList);
                }
                else {
                    return returnOptionList;
                }
            }
            function RenderCurrentGamePrizeOptions(listToRender, callback) {
                $("#gamePrizeOptionsListing", element).empty();
                let prizeListingHolder = $("<div />");
                if (listToRender != null && listToRender.length > 0) {
                    for (let listCntr = 0; listCntr < listToRender.length; listCntr++) {
                        let listItem = listToRender[listCntr];
                        RenderCurrentGamePrizeItem(listItem, prizeListingHolder);
                    }
                }
                else {
                    prizeListingHolder.append("No prize options found.");
                }
                $("#gamePrizeOptionsListing", element).append(prizeListingHolder);
                if (callback != null) {
                    callback();
                }
            }
            function RenderCurrentGamePrizeItem(itemToRender, objectToRenderTo) {
                let itemRowHolder = $("<div class=\"reward-option-item-row-holder\" />");
                if (itemToRender != null) {
                    let itemPositionHolder = $("<div class=\"reward-option-item position-name inline-item\" />");
                    let prizePositionSelector = $("<select class=\"reward-option-input\" id=\"editRewardsPositionOption_" + itemToRender.FlexGameRewardOptionId + "\" />");
                    LoadPossiblePostionOptionsForRow(prizePositionSelector);
                    itemPositionHolder.append(prizePositionSelector);

                    prizePositionSelector.val(itemToRender.RewardPositionTypeId);

                    let itemRewardAndImageHolder = $("<div class=\"reward-option-item prize-name-plus-image inline-item\" />");

                    let itemRewardHolder = $("<div class=\"reward-option-item prize-name inline-item\" />");
                    let prizeOptionsSelector = $("<select class=\"reward-option-input\" id=\"editRewardsPrizeOption_" + itemToRender.FlexGameRewardOptionId + "\" />");
                    LoadPossiblePrizeOptionsForRow(prizeOptionsSelector);
                    itemRewardHolder.append(prizeOptionsSelector);
                    prizeOptionsSelector.val(itemToRender.ClientPrizeOptionId);

                    let itemRewardImageHolder = $("<div class=\"reward-option-item prize-image inline-item\" />");
                    let prizeOptionImageItem = $("<img class=\"\" id=\"editRewardsPointsImage_" + itemToRender.FlexGameRewardOptionId + "\" />");

                    let prizeOption = clientPossiblePrizes.find(i => i.PrizeOptionId == itemToRender.ClientPrizeOptionId && i.Client == itemToRender.Client);
                    let imageSource = defaultPrizeUrl;
                    if (prizeOption != null) {
                        imageSource = basePrizeUrl + prizeOption.PrizeImageUrl;
                    }
                    prizeOptionImageItem.attr("src", imageSource);
                    //prizeOptionImageItem.attr("height", "50px");
                    prizeOptionImageItem.attr("width", "50px");
                    itemRewardImageHolder.append(prizeOptionImageItem);

                    let itemPointsHolder = $("<div class=\"reward-option-item acuity-points-options inline-item\" />");
                    let itemPointsValue = $("<input type=\"textbox\" class=\"reward-option-input\" id=\"editRewardsPointsValue_" + itemToRender.FlexGameRewardOptionId + "\" />");
                    itemPointsValue.val(itemToRender.UserPointsToAward);
                    itemPointsHolder.append(itemPointsValue);
                    //TODO: Determine how we want to handle the ability to assign points for the game admin.
                    itemPointsValue.prop("readonly", true);
                    itemPointsValue.attr("disabled", true);


                    let trophyOption = null;
                    let trophyImageSource = defaultTrophyUrl;
                    let itemTrophyAndImageHolder = $("<div class=\"reward-option-item prize-trophy-plus-image inline-item\" />");
                    let itemTrophyHolder = $("<div class=\"reward-option-item prize-trophy inline-item\" />");
                    let trophySelector = $("<select class=\"reward-option-input\" id=\"editTrophyOption_" + itemToRender.FlexGameRewardOptionId + "\"></select>");
                    LoadPossibleTrophyOptionsForRow(trophySelector)
                    itemTrophyHolder.append(trophySelector);
                    if (itemToRender.TrophyId != null) {
                        trophySelector.val(itemToRender.TrophyId);
                        trophyOption = possibleTrophies.find(t => t.TrophyId == itemToRender.TrophyId);
                    }
                    if (trophyOption != null) {
                        trophyImageSource = baseTrophyUrl + trophyOption.ImageUrl;
                    }
                    let itemTrophyImageHolder = $("<div class=\"reward-option-item prize-trophy-image inline-item\" />");
                    let trophyImageItem = $("<img class=\"\" id=\"editTrophyImage_" + itemToRender.FlexGameRewardOptionId + "\" />");

                    trophyImageItem.attr("src", trophyImageSource);
                    //trophyImageItem.attr("height", "50px");
                    trophyImageItem.attr("width", "50px");
                    itemTrophyImageHolder.append(trophyImageItem);

                    let itemButtonsHolder = $("<div class=\"reward-option-item button-holder inline-item\" />");
                    let removeButton = $("<button class=\"button btn button--red\" id=\"removeRewardsOption_" + itemToRender.FlexGameRewardOptionId + "\"><i class=\"fa fa-trash\"></i></button>");
                    let itemSaveButton = $("<button class=\"button btn \" id=\"saveRewardsOption_" + itemToRender.FlexGameRewardOptionId + "\"><i class=\"fa-solid fa-save\"></i></button>");


                    let itemIdValue = $("<input type=\"hidden\" class=\"reward-option-input\" id=\"editRewardsPointsId_" + itemToRender.FlexGameRewardOptionId + "\" />");
                    itemIdValue.val(itemToRender.FlexGameRewardOptionId);


                    prizePositionSelector.on("change", function () {
                        let itemId = this.id;
                        let id = itemId.split("_")[1];
                        console.log("Handle change of " + itemId);
                    });
                    prizeOptionsSelector.on("change", function () {
                        let itemId = this.id;
                        HandlePrizeOptionChange(itemId, false);
                    });
                    trophySelector.on("change", function () {
                        let itemId = this.id;
                        HandleTrophyOptionChange(itemId, false);
                    });
                    removeButton.on("click", function () {
                        let itemId = this.id;
                        let id = itemId.split("_")[1];
                        RemoveCurrentRewardItem(id, function () {
                            ReloadGameInformation();
                        });
                    });
                    itemSaveButton.on("click", function () {
                        let itemId = this.id;
                        let id = itemId.split("_")[1];
                        SaveCurrentRewardItem(id, function () {
                            ReloadGameInformation();
                        });
                    });

                    itemButtonsHolder.append(itemSaveButton);
                    itemButtonsHolder.append("&nbsp;");
                    itemButtonsHolder.append(removeButton);
                    itemButtonsHolder.append(itemIdValue);

                    //itemRowHolder.append(itemRewardHolder);
                    //itemRowHolder.append(itemRewardImageHolder);
                    itemRewardAndImageHolder.append(itemRewardHolder);
                    itemRewardAndImageHolder.append(itemRewardImageHolder);

                    //itemRowHolder.append(itemTrophyHolder);
                    //itemRowHolder.append(itemTrophyImageHolder);
                    itemTrophyAndImageHolder.append(itemTrophyHolder);
                    itemTrophyAndImageHolder.append(itemTrophyImageHolder);

                    itemRowHolder.append(itemPositionHolder);
                    itemRowHolder.append(itemRewardAndImageHolder);
                    itemRowHolder.append(itemTrophyAndImageHolder);

                    itemRowHolder.append(itemPointsHolder);
                    itemRowHolder.append(itemButtonsHolder);

                    $(objectToRenderTo).append(itemRowHolder);
                }
            }
            function LoadPossiblePostionOptionsForRow(objectToRenderTo) {
                $(objectToRenderTo, element).empty();
                $(objectToRenderTo, element).append($('<option />', { value: "", text: "" }));
                for (let itemCounter = 0; itemCounter < possiblePositionRewardOptionList.length; itemCounter++) {
                    let item = possiblePositionRewardOptionList[itemCounter];
                    $(objectToRenderTo, element).append($('<option />', { value: item.Id, text: item.Name }));
                }
            }
            function LoadPossiblePrizeOptionsForRow(objectToRenderTo) {
                $(objectToRenderTo, element).empty();
                $(objectToRenderTo, element).append($('<option />', { value: "", text: "" }));
                for (let itemCounter = 0; itemCounter < clientPossiblePrizes.length; itemCounter++) {
                    let item = clientPossiblePrizes[itemCounter];
                    $(objectToRenderTo, element).append($('<option />', { value: item.PrizeOptionId, text: item.Name }));
                }
            }
            function LoadPossibleTrophyOptionsForRow(objectToRenderTo) {
                $(objectToRenderTo, element).empty();
                $(objectToRenderTo, element).append($('<option />', { value: "", text: "" }));

                for (let itemCounter = 0; itemCounter < possibleTrophies.length; itemCounter++) {
                    let item = possibleTrophies[itemCounter];
                    $(objectToRenderTo, element).append($('<option />', { value: item.TrophyId, text: item.Name }));
                }
            }
            function HandlePrizeOptionChange(itemId, isAdd, callback) {
                let itemObject = $("#" + itemId);
                let keyValue = itemId.split("_")[1];
                let imageSource = defaultPrizeUrl;

                let itemValue = -1;
                let acuityPoints = 0;
                if (itemObject != null) {
                    itemValue = itemObject.val();
                }
                let prizeReference = clientPossiblePrizes.find(i => i.PrizeOptionId == itemValue);
                if (prizeReference != null) {
                    acuityPoints = prizeReference.PointsAwarded || 0;
                    imageSource = basePrizeUrl + prizeReference.PrizeImageUrl;


                }
                if (isAdd == true) {
                    $("#addAcuityPoints", element).val(acuityPoints);
                    $("#addPrizeRewardImage", element).attr("src", imageSource);
                }
                else {
                    $("#editRewardsPointsValue_" + keyValue, element).val(acuityPoints);
                    $("#editRewardsPointsImage_" + keyValue, element).attr("src", imageSource);
                }
                if (callback != null) {
                    callback();
                }
            }
            function HandleTrophyOptionChange(itemId, isAdd, callback) {
                let itemObject = $("#" + itemId);
                let keyValue = itemId.split("_")[1];
                let trophyImageSource = defaultTrophyUrl;
                let itemValue = -1;

                if (itemObject != null) {
                    itemValue = itemObject.val();
                }
                let trophyReference = possibleTrophies.find(t => t.TrophyId == itemValue);
                if (trophyReference != null) {
                    trophyImageSource = baseTrophyUrl + trophyReference.ImageUrl;
                }

                if (isAdd == true) {
                    $("#addTrophyImage", element).attr("src", trophyImageSource);
                }
                else {
                    $("#editTrophyImage_" + keyValue, element).attr("src", trophyImageSource);
                }

                if (callback != null) {
                    callback();
                }
            }
            function SaveAllRewardItems(callback) {
                $("input[id^='editRewardsPointsId_']", element).each(function () {
                    let itemId = this.id;
                    let id = itemId.split("_")[1];
                    SaveCurrentRewardItem(id);
                });

                if (callback != null) {
                    callback();
                }
            }
            function ValidateAddRewardItem(callback) {
                HideRewardItemErrorMessage();
                let isValidForm = true;
                let errorMessages = [];
                let rewardPosition = $("#addPositionRewardList", element).val() || "";
                if (rewardPosition == null || rewardPosition == "") {
                    isValidForm = false;
                    errorMessages.push({ message: "Position Required", fieldClass: "", fieldId: "addPositionRewardList" })
                }

                if (isValidForm == true) {
                    if (callback != null) {
                        callback();
                    }
                }
                else {
                    let errorMessage = "";
                    for (let errorIndex = 0; errorIndex < errorMessages.length; errorIndex++) {
                        let item = errorMessages[errorIndex];
                        if (item.fieldId != "") {
                            $("#" + item.fieldId, element).addClass("errorField");
                            $("#" + item.fieldId, element).off("blur").on("blur", function () {
                                $(this).removeClass("errorField");
                            });
                        }
                        if (errorMessage != "") {
                            errorMessage += "|";
                        }
                        errorMessage += item.message;
                    }

                    $(".sub-form-error-information-holder", $(".flex-game-prize-option-footer-holder", element)).empty();
                    $(".sub-form-error-information-holder", $(".flex-game-prize-option-footer-holder", element)).append(errorMessage);
                    ShowRewardItemErrorMessage();
                }
            }
            function SaveCurrentRewardItem(idToSave, callback) {
                let itemToSave = CollectRewardItemToSave(idToSave);
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "saveFlexGameRewardOption",
                        rewardOption: JSON.stringify(itemToSave)
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (jsonData) {
                        if (callback != null) {
                            callback();
                        }
                    }
                });
            }
            function CollectRewardItemToSave(idOfItem) {
                let returnObject = new Object();

                returnObject.FlexGameRewardOptionId = idOfItem;
                returnObject.FlexGameId = $(".flex-game-form-current-game-id", element).val(); //TODO: Get Current id
                if (idOfItem <= 0) {
                    returnObject.RewardPositionTypeId = $("#addPositionRewardList", element).val();
                    returnObject.ClientPrizeOptionId = $("#addPrizeRewardList", element).val() || 0;
                    returnObject.UserPointsToAward = $("#addAcuityPoints", element).val() || 0;
                    returnObject.TrophyId = $("#addTrophyList", element).val() || 0;
                }
                else {
                    returnObject.RewardPositionTypeId = $("#editRewardsPositionOption_" + idOfItem, element).val();
                    returnObject.ClientPrizeOptionId = $("#editRewardsPrizeOption_" + idOfItem, element).val() || 0;
                    returnObject.UserPointsToAward = $("#editRewardsPointsValue_" + idOfItem, element).val() || 0;
                    returnObject.TrophyId = $("#editTrophyOption_" + idOfItem, element).val() || 0;
                }

                return returnObject;
            }
            function RemoveCurrentRewardItem(idToRemove, callback) {
                if (confirm("Are you sure?")) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "flex",
                            cmd: "removeOptionFromGame",
                            idToRemove: idToRemove
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (jsonData) {
                            if (callback != null) {
                                callback();
                            }
                        }
                    });
                }
            }
            function ClearAddRewardForm() {
                $("#addPositionRewardList", element).val("");
                $("#addPrizeRewardList", element).val("");
                $("#addAcuityPoints", element).val("");
                $("#addTrophyList", element).val("");
                $("#addPrizeRewardImage", element).attr("src", defaultPrizeUrl);
                $("#addTrophyImage", element).attr("src", defaultTrophyUrl);
                HideRewardItemErrorMessage();
            }
            function ShowRewardItemErrorMessage() {

                $(".sub-form-error-information-holder", $(".flex-game-prize-option-footer-holder", element)).show();
            }
            function HideRewardItemErrorMessage() {
                $(".sub-form-error-information-holder", $(".flex-game-prize-option-footer-holder", element)).hide();
            }
            //Game Prize Options End
            /*Spinner Prize Options Start*/
            function RenderPossibleSpinnerOptions() {
                // $("#addSpinnerOptionList", element).empty();
                // $("#addSpinnerOptionList", element).append($('<option />', { value: "", text: "Select Spin Prize" }));


                // for (let posCnt = 0; posCnt < clientPossiblePrizes.length; posCnt++) {
                //     let dataItem = clientPossiblePrizes[posCnt];
                //     $("#addSpinnerOptionList", element).append($('<option />', { value: dataItem.PrizeOptionId, text: dataItem.Name }));
                // }
            }
            function LoadCurrentGameSpinnerPrizeOptions(gameId, callback) {
                // GetCurrentGameSpinnerOptions(gameId, function (optionList) {
                //     RenderCurrentGameSpinnerPrizeOptions(optionList, function () {
                //         if (callback != null) {
                //             callback();
                //         }
                //     });
                // });
            }
            function GetCurrentGameSpinnerOptions(gameId, callback) {
                let returnSpinnerOptionList = [];
                // if (gameId > 0) {
                //     let game = scope.GameList.find(g => g.FlexGameId == gameId);
                //     if (game != null && game.SpinnerOptions != null) {
                //         returnSpinnerOptionList = game.SpinnerOptions;
                //     }
                // }
                if (callback != null) {
                    callback(returnSpinnerOptionList);
                }
                else {
                    return returnSpinnerOptionList;
                }
            }
            function RenderCurrentGameSpinnerPrizeOptions(listToRender, callback) {
                // $("#gameSpinnerOptionListing", element).empty();
                // let spinnerListingHolder = $("<div />");
                // if (listToRender != null && listToRender.length > 0) {
                //     for (let lc = 0; lc < listToRender.length; lc++) {
                //         let listingItem = listToRender[lc];
                //         RenderCurrentGameSpinnerItem(listingItem, spinnerListingHolder);
                //     }
                // }
                // else {
                //     spinnerListingHolder.append("No Spinner Prize Options found.");
                // }
                // $("#gameSpinnerOptionListing", element).append(spinnerListingHolder);

                if (callback != null) {
                    callback();
                }
            }
            function RenderCurrentGameSpinnerItem(itemToRender, objectToRenderTo) {
                //let spinnerRowHolder = $("<div class=\"spinner-option-item-row-holder\" />");
                // if (itemToRender != null) {
                //     let spinnerOptionHolder = $("<div class=\"spinner-option-item spinner-option-item inline-item\" />");
                //     let spinnerOptionSelector = $("<select class=\"spinner-option-input\" id=\"editSpinnerOptionList_" + itemToRender.FlexGameSpinnerOptionId + "\" />");
                //     LoadPossiblePrizeOptionsForRow(spinnerOptionSelector);
                //     spinnerOptionHolder.append(spinnerOptionSelector);
                //     spinnerOptionSelector.val(itemToRender.ClientPrizeOptionId); //TODO: Determine how to handle manual reward selections.

                //     let spinnerOptionImageHolder = $("<div class=\"spinner-option-item spinner-option-image inline-item\" />");
                //     let spinnerOptionImage = $("<img class=\"\" id=\"editSpinnerOptionImage_" + itemToRender.FlexGameSpinnerOptionId + "\" />");

                //     let prizeOption = clientPossiblePrizes.find(i => i.PrizeOptionId == itemToRender.ClientPrizeOptionId && i.Client == itemToRender.Client);
                //     let imageSource = defaultPrizeUrl;
                //     if (prizeOption != null) {
                //         imageSource = basePrizeUrl + prizeOption.PrizeImageUrl;
                //     }
                //     spinnerOptionImage.attr("src", imageSource);
                //     spinnerOptionImage.attr("width", "50px");

                //     spinnerOptionImageHolder.append(spinnerOptionImage);

                //     let spinnerOptionButtonHolder = $("<div class=\"spinner-option-item button-holder inline-item\" />");
                //     let itemIdValue = $("<input type=\"hidden\" class=\"\" id=\"editSpinnerOptionId_" + itemToRender.FlexGameSpinnerOptionId + "\" />");
                //     let removeButton = $("<button class=\"button btn button--red\" id=\"btnRemoveSpinnerOption_" + itemToRender.FlexGameSpinnerOptionId + "\" ><i class=\"fa fa-trash\"></i></button>");
                //     //let editButton = $("<button class=\"button btn button--red\" id=\"btnEditSpinnerOption_" + itemToRender.FlexGameSpinnerOptionId + "\" ><i class=\"fa fa-trash\"></i></button>");


                //     spinnerOptionSelector.on("change", function () {
                //         let itemId = this.id;
                //         HandleSpinnerOptionChange(itemId, false, function () {
                //             SaveAllSpinnerOptionItems();
                //         });
                //     });


                //     removeButton.on("click", function () {
                //         let btnId = this.id;
                //         let itemId = btnId.split("_")[1];
                //         RemoveCurrentSpinnerOption(itemId, function () {
                //             ReloadGameInformation();
                //         });
                //     });

                //     spinnerOptionButtonHolder.append(itemIdValue);
                //     spinnerOptionButtonHolder.append(removeButton);

                //     spinnerRowHolder.append(spinnerOptionHolder);
                //     spinnerRowHolder.append(spinnerOptionImageHolder);
                //     spinnerRowHolder.append(spinnerOptionButtonHolder);

                //     $(objectToRenderTo).append(spinnerRowHolder);
                // }
            }
            function HandleSpinnerOptionChange(itemId, isAdd, callback) {
                // let itemObject = $("#" + itemId);
                // let keyValue = itemId.split("_")[1];
                // let imageSource = defaultPrizeUrl;

                // let itemValue = -1;
                // let acuityPoints = 0;
                // if (itemObject != null) {
                //     itemValue = itemObject.val();
                // }
                // let prizeReference = clientPossiblePrizes.find(i => i.PrizeOptionId == itemValue);
                // if (prizeReference != null) {
                //     acuityPoints = prizeReference.PointsValue || 0;
                //     imageSource = basePrizeUrl + prizeReference.PrizeImageUrl;
                // }

                // if (isAdd == true) {
                //     $("#addSpinnerOptionImage", element).attr("src", imageSource);
                // }
                // else {
                //     $("#editSpinnerOptionImage_" + keyValue, element).attr("src", imageSource);
                // }
                // if (callback != null) {
                //     callback();
                // }
            }
            function ValidateAddSpinnerItem(callback) {
                // HideSpinnerItemErrorMessage();
                // let isValidForm = true;
                // let errorMessages = [];
                // let spinnerReward = $("#addSpinnerOptionList", element).val() || "";

                // if (spinnerReward == null || spinnerReward == "") {
                //     isValidForm = false;
                //     errorMessages.push({ message: "Reward Required", fieldClass: "", fieldId: "addSpinnerOptionList" })
                // }

                // if (isValidForm == true) {
                //     if (callback != null) {
                //         callback();
                //     }
                // }
                // else {
                //     let errorMessage = "";
                //     for (let errorIndex = 0; errorIndex < errorMessages.length; errorIndex++) {
                //         let item = errorMessages[errorIndex];
                //         if (item.fieldId != "") {
                //             $("#" + item.fieldId, element).addClass("errorField");
                //             $("#" + item.fieldId, element).off("blur").on("blur", function () {
                //                 $(this).removeClass("errorField");
                //             });
                //         }
                //         if (errorMessage != "") {
                //             errorMessage += "|";
                //         }
                //         errorMessage += item.message;
                //     }

                //     $(".sub-form-error-information-holder", $(".flex-game-spinner-option-footer-holder", element)).empty();
                //     $(".sub-form-error-information-holder", $(".flex-game-spinner-option-footer-holder", element)).append(errorMessage);
                //     ShowSpinnerItemErrorMessage();
                //}
            }
            function SaveAllSpinnerOptionItems(callback) {
                // $("input[id^='editSpinnerOptionId_']", element).each(function () {
                //     let itemId = this.id;
                //     let id = itemId.split("_")[1];
                //     SaveCurrentSpinnerOptionItem(id);
                // });

                if (callback != null) {
                    callback();
                }

            }
            function SaveCurrentSpinnerOptionItem(idToSave, callback) {
                // let itemToSave = CollectSpinnerOptionToSave(idToSave);
                // a$.ajax({
                //     type: "POST",
                //     service: "C#",
                //     async: false,
                //     data: {
                //         lib: "flex",
                //         cmd: "saveFlexGameSpinnerOption",
                //         spinnerOption: JSON.stringify(itemToSave)
                //     },
                //     dataType: "json",
                //     cache: false,
                //     error: a$.ajaxerror,
                //     success: function (jsonData) {
                //         if (callback != null) {
                //             callback();
                //         }
                //     }
                // });
            }
            function CollectSpinnerOptionToSave(idOfItem) {
                let returnObject = new Object();
                returnObject.FlexGameSpinnerOptionId = idOfItem;
                returnObject.FlexGameId = $(".flex-game-form-current-game-id", element).val(); //TODO: Get Current id

                if (idOfItem <= 0) {
                    returnObject.ClientPrizeOptionId = $("#addSpinnerOptionList", element).val() || 0;
                }
                else {
                    returnObject.ClientPrizeOptionId = $("#editSpinnerOptionList_" + idOfItem, element).val() || 0;
                }
                //TODO: Determine how to handle these items
                returnObject.ManualRewardId = null;
                returnObject.TotalQuantityAvailableForGame = null;

                return returnObject;
            }
            function RemoveCurrentSpinnerOption(idToRemove, callback) {
                // if (confirm("Are you sure?")) {
                //     a$.ajax({
                //         type: "POST",
                //         service: "C#",
                //         async: false,
                //         data: {
                //             lib: "flex",
                //             cmd: "removeSpinnerOptionFromGame",
                //             idToRemove: idToRemove
                //         },
                //         dataType: "json",
                //         cache: false,
                //         error: a$.ajaxerror,
                //         success: function (jsonData) {
                //             if (callback != null) {
                //                 callback();
                //             }
                //         }
                //     });
                // }
            }
            function ClearAddSpinnerForm() {
                $("#addSpinnerOptionList", element).val("");
                $("#addSpinnerOptionImage", element).attr("src", defaultPrizeUrl);
                HideSpinnerItemErrorMessage();
            }
            function ShowSpinnerItemErrorMessage() {
                $(".sub-form-error-information-holder", $(".flex-game-spinner-option-footer-holder", element)).show();
            }
            function HideSpinnerItemErrorMessage() {
                $(".sub-form-error-information-holder", $(".flex-game-spinner-option-footer-holder", element)).hide();
            }
            /*Spinner Prize Options End*/
            /*Additonal User Profiles*/
            function AddNonAgentProfilesToList(listToAddUsersTo)
            {
                profilesToAdd = GetNonAgentProfiles();

                if(profilesToAdd != null && profilesToAdd.length > 0)
                {
                    for(let uIndex = 0; uIndex < profilesToAdd.length; uIndex++)
                    {
                        let userProfile = profilesToAdd[uIndex];
                        let curUserIndex = listToAddUsersTo.findIndex(u => u.UserId == userProfile.UserId);
                        if(curUserIndex < 0)
                        {
                            listToAddUsersTo.push(userProfile);
                        }
                    }
                }

            }
            function GetNonAgentProfiles()
            {
                let includeSysAdmin = $("#flexParticipantEditor_IncludeSystemUsers", element).is(":checked");
                let returnList = [];
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getNonAgentProfiles",
                        includesysadmin: includeSysAdmin
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        let userProfiles = JSON.parse(data.nonAgentUserProfiles);
                        returnList = userProfiles;
                    }
                });
                return returnList;
            }
            /*Additional User Profiles End*/
            function ReloadGameInformation() {
                scope.WriteUserInformation("Reloading game information...", 3000);
                let gameId = $(".flex-game-form-current-game-id", element).val();
                scope.LoadGameByGameId(gameId, true, false, function () {
                    HandleButtonsAvailable();
                });
            }
            function GetScoreForGameFromItem(scoreItem, gameObject) {
                let returnValue = 0;

                if (scoreItem != null && gameObject != null) {
                    //scoring option 2 = cumulative -- use the total score
                    //else use the average based on the information                    
                    if (gameObject.ScoringOptionId == 2) {
                        returnValue = scoreItem.KpiScoreTotal;
                    }
                    else {
                        returnValue = scoreItem.KpiScoreAverage;
                    }
                }

                return returnValue;
            }
            function HandleGamePrizeDisplay(gameObject) {
                let hasPrizeOptions = false;

                let hasSpinnerOptions = false;
                //spinner options off for now.
                if (gameObject != null) {
                    hasPrizeOptions = gameObject.HasPrizeOptions;
                    //hasSpinnerOptions = gameObject.HasSpinnerOptions;
                }
                else {
                    hasPrizeOptions = new Boolean($("#hasPrizeOptions", element).is(":checked")) || false;

                    //hasSpinnerOptions = new Boolean($("#hasSpinnerOptions", element).is(":checked")) || false;
                }    
                if (hasPrizeOptions == true || hasSpinnerOptions == true) {
                    if ($("#prizeOptionsOverallHolder", element).is(":visible") == false) {
                        HideFreeFormRewardSection();
                        ShowPrizeOptionSection();
                    }
                }
                else {
                    HidePrizeOptionSection();
                    ShowFreeFormRewardSection();
                }
                ToggleRewardOptionsSection(hasPrizeOptions);
                //ToggleSpinnerOptionsSection(hasSpinnerOptions);

                HandleRewardSectionDisplay(hasPrizeOptions, hasSpinnerOptions);


            }
            function HideManagerButtons() {
                if (legacyContainer.scope.TP1Username != "cjarboe") {
                    $(".flex-game-manual-entry-scoring-manager", element).hide();
                }
            }
            function HideParticipantLoadingImage() {
                $("#loading-flex-participants-image", element).hide();
            }
            function ShowParticipantLoadingImage() {
                $("#loading-flex-participants-image", element).show();
            }
            function HidePrizeOptionSection() {
                $("#prizeOptionsOverallHolder", element).hide();
            }
            function ShowPrizeOptionSection() {
                ToggleRewardOptionsSection(true);//Force section to be shown currently.
                //ToggleSpinnerOptionsSection(true);//Force section to be shown currently.

                $("#prizeOptionsOverallHolder", element).show();
            }
            function HideFreeFormRewardSection() {
                $("#freeFormRewardInputSection", element).hide();
                //ShowAwardsSelectionsHolder();
            }
            function ShowFreeFormRewardSection() {
                $("#freeFormRewardInputSection", element).show();
                //HideAwardsSelectionsHolder();
            }
            function ShowRewardOptionsSection() {
                $("#rewardListHolder", element).show();
            }
            function HideRewardOptionsSection() {
                $("#rewardListHolder", element).hide();
            }
            function HandleRewardSectionDisplay(hasRewardOptions, hasSpinnerOptions)
            {
                $("#rewardListHolder", element).removeClass("full-width");
                $("#spinnerListHolder", element).removeClass("full-width");
                if(hasRewardOptions == true && hasSpinnerOptions == false)
                {
                    $("#rewardListHolder", element).addClass("full-width");
                }
                else if (hasRewardOptions == false && hasSpinnerOptions == true)
                {
                    $("#spinnerListHolder", element).addClass("full-width");
                }
            }
            function ShowAwardsSelectionsHolder()
            {
                $("#awardsSelectionsHolder", element).show();
            }
            function HideAwardsSelectionsHolder()
            {
                $("#awardsSelectionsHolder", element).hide();
            }
            function ToggleRewardOptionsSection(showSection) {
                if (showSection == true) {
                    ShowRewardOptionsSection();
                }
                else {
                    HideRewardOptionsSection();
                }
            }
            function ShowSpinnerOptionsSection() {
                //$("#spinnerListHolder", element).show();
            }
            function HideSpinnerOptionsSection() {
                $("#spinnerListHolder", element).hide();
            }
            function ToggleSpinnerOptionsSection(showSection) {
                // if (showSection == true) {
                //     ShowSpinnerOptionsSection();
                // }
                // else {
                    HideSpinnerOptionsSection();
                //}
            }
            function HandleButtonsAvailable(gameObject) {
                let showSaveOptions = true;
                if (gameObject == null) {
                    let gameId = $(".flex-game-form-current-game-id", element).val();
                    gameObject = scope.GameList.find(g => g.FlexGameId == gameId);
                }

                if (gameObject != null) {
                    showSaveOptions = (
                        gameObject.Status == "A" ||
                        gameObject.Status == "D" ||
                        gameObject.Status == "I" ||
                        gameObject.Status == "X"
                    );
                }
                $(".flex-game-editor-tab-item", element).each(function () {
                    let tabId = this.id;
                    if ((tabId == "participants-tab" || tabId == "prizes-tab") && showSaveOptions == true && $(this).hasClass("active")) {
                        showSaveOptions = false;
                    }
                });
                if (showSaveOptions == false) {
                    $(".flex-game-form_buttons", element).hide();
                }
                else {
                    $(".flex-game-form_buttons", element).show();
                }
            }
            function LogErrorWithCallback(callback) {
                console.log("Error found...find something to do.");
                if (callback != null) {
                    callback(null);
                }
            }
            /*User Budget Information Start*/
            function LoadUserBudgetInformation(userId, callback) {
                GetUserBudgetInformation(userId, function (userBudgetItems) {
                    RenderUserBudgetInformation(userBudgetItems, function () {
                        if (callback != null) {
                            callback();
                        }
                    });
                });
            }
            function GetUserBudgetInformation(userIdToLoad, callback) {
                if(userIdToLoad == null || userIdToLoad == "")
                {
                    userIdToLoad = $(".flex-game-editor-supervisor-list", element).val();
                }
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getUserBudgetLedgerForUser",
                        userid: userIdToLoad
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (jsonData) {
                        let userLedger = JSON.parse(jsonData.userBudgetList);
                        returnList = userLedger;
                        if (callback != null) {
                            callback(userLedger);
                        }
                    }
                });
            }
            function RenderUserBudgetInformation(userBudgetList, callback) {
                
                if (userBudgetList == null) {
                    userBudgetList = currentUserBudgetList;
                }
                let totalDollarAmounts = 0;
                let availableDollarAmount = 0;
                let projectedDollarAmountUsed = 0;
                let availableCreditsAmount = 0;
                let projectedCreditsAmountUsed = 0;
                let today = new Date();
                let firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                let lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                //TODO: Determine how we handle no information returned.                
                if(userBudgetList != null && userBudgetList.length > 0)
                {
                    let dollarItems = userBudgetList.filter(bi => (bi.LedgerTypeId == BUDGET_DOLLAR_SPENT || bi.LedgerTypeId == BUDGET_DOLLAR_ALLOCATED  ) && new Date(bi.LedgerDate) >= firstOfMonth && new Date(bi.LedgerDate) <= lastOfMonth);
                    let totalBudget = 0;
                    let remainingBudget = 0;
                    let projectedUsedBudget = 0;
                    let totalCreditBudget = 0;
                    let remainingCredits = 0;
                    let projectedUsedCreditsBudget = 0;

                    for(let dIndex = 0; dIndex < dollarItems.length; dIndex++)
                    {
                        let dollarItem = dollarItems[dIndex];

                        if(dollarItem.BudgetAmount > 0) //Positive values are seen as available budget data
                        {
                            totalBudget += dollarItem.BudgetAmount;
                        }
                        remainingBudget += dollarItem.BudgetAmount;
                        if(dollarItem.LedgerTypeId == BUDGET_DOLLAR_ALLOCATED)
                        {
                            projectedUsedBudget += Math.abs(dollarItem.BudgetAmount);
                        }
                    }

                    let creditItems = userBudgetList.filter(bi => (bi.LedgerTypeId == BUDGET_CREDITS_SPENT || bi.LedgerTypeId == BUDGET_CREDITS_ALLOCATED) && new Date(bi.LedgerDate) >= firstOfMonth && new Date(bi.LedgerDate) <= lastOfMonth);
                    for(let cIndex = 0; cIndex < creditItems.length; cIndex++)
                    {
                        let creditItem = creditItems[cIndex];

                        if(creditItem.BudgetAmount > 0) //Positive values are seen as available budget data
                        {
                            totalCreditBudget += creditItem.BudgetAmount;
                        }
                        remainingCredits += creditItem.BudgetAmount;                        
                        if(creditItem.LedgerTypeId == BUDGET_CREDITS_ALLOCATED)
                        {
                            projectedUsedCreditsBudget += Math.abs(creditItem.BudgetAmount);
                        }
                    }

                    totalDollarAmounts = totalBudget.toLocaleString("en-US", { style: "currency", currency: "USD" });
                    availableDollarAmount = remainingBudget.toLocaleString("en-US", { style: "currency", currency: "USD" });
                    projectedDollarAmountUsed = projectedUsedBudget.toLocaleString("en-US", { style: "currency", currency: "USD" });
                    availableCreditsAmount = remainingCredits;
                    projectedCreditsAmountUsed = projectedUsedCreditsBudget;
                }
                
                $("#userTotalBudgetAmount", element).empty();
                $("#userTotalBudgetAmount", element).append(totalDollarAmounts);

                $("#userAvailableBudgetAmount", element).empty();
                $("#userAvailableBudgetAmount", element).append(availableDollarAmount);
                $("#userAvailableBudgetAmount", element).removeClass("text-red");
                if(availableDollarAmount < 0)
                {
                $("#userAvailableBudgetAmount", element).addClass("text-red");
                }

                $("#userProjectedDollarUsed", element).empty();
                $("#userProjectedDollarUsed", element).append(projectedDollarAmountUsed);


                $("#userAvaialbleCreditsAmount", element).empty();
                $("#userAvaialbleCreditsAmount", element).append(availableCreditsAmount);
                $("#userAvaialbleCreditsAmount", element).removeClass("text-red");
                if(availableCreditsAmount < 0)
                {
                $("#userAvaialbleCreditsAmount", element).addClass("text-red");
                }

                $("#userProjectedCreditUsed", element).empty();
                $("#userProjectedCreditUsed", element).append(projectedCreditsAmountUsed);

                if (callback != null) {
                        callback();
                    }
            }
            function ShowUserBudgetSection()
            {
                $("#userBudgetSectionHolder", element).show();
            }
            function HideUserBudgetSection()
            {
                $("#userBudgetSectionHolder", element).hide();
            }
            /*User Budget Information End*/
            scope.load = function () {
                scope.WriteUserStatus("Initializing manager...", 5000);
                scope.Initialize();
                scope.WriteUserStatus("Setting up things...", 5000);
                var userId = legacyContainer.scope.TP1Username;
                scope.userId = userId;
                $("#addPrizeRewardImage", element).attr("src", defaultPrizeUrl);
                $("#addTrophyImage", element).attr("src", defaultTrophyUrl);

                $("#addSpinnerOptionImage", element).attr("src", defaultPrizeUrl);

                GetDataForLists();
                $(".flex-game-editor-acuity-scoring-display-holder", element).hide();

                $(".flex-game-editor-supervisor-list").off("change").on("change", function () {
                    var supervisorUserId = $(".flex-game-editor-supervisor-list").val();
                    scope.HandleGameSupervisorChanged(supervisorUserId);
                });
                // $(".flex-game-editor-game-type", element).off("change").on("change", function() {
                //     var gameTypeId = $(".flex-game-editor-game-type", element).val();
                //     scope.HandleGameTypeChange(gameTypeId);
                // });
                $(".flex-game-theme-list").off("change").on("change", function () {
                    var gameThemeId = $(".flex-game-theme-list").val();
                    scope.HandleGameThemeChange(gameThemeId);
                });
                $(".flex-game-admin-select-user").off("change").on("change", function () {
                    //var newUserId = $(".flex-game-admin-select-user :selected", element).val();                                        
                    var newUserId = GetUserIdToLoad();
                    scope.SetLoadGameListButton(newUserId);
                    HideEditForm();
                    scope.LoadGameListForUser(newUserId);

                });
                $(".flex-game-display-options", element).off("change").on("change", function () {
                    scope.WriteUserStatus("Reloading game list...", 5000);
                    scope.LoadGameListForUser(userId, function (data) {
                        scope.DisplayGameList(data);
                        scope.HideUserStatus();
                    });
                });
                $(".flex-game-editor-scoring-basis", element).off("change").on("change", function () {
                    let gameId = parseInt($(".flex-game-form-current-game-id", element).val());
                    scope.LoadGameScoringRange(gameId, null, null);
                });
                $(".flex-game-theme-type-list", element).off("change").on("change", function () {
                    var themeTypeId = $(this).val();
                    scope.HandleThemeTypeChange(themeTypeId);
                });
                $(".flex-game-editor-project-filter-options", element).off("change").on("change", function () {
                    scope.LoadOptionsLists("groupsfilter");
                    scope.LoadOptionsLists("locationsfilter");
                    scope.LoadOptionsLists("teamsfilter");
                    HandleParticipantFilterOptionsForGameType();
                    LoadPossibleParticipantsFiltered();
                });
                $(".flex-game-editor-location-filter-options", element).off("change").on("change", function () {
                    scope.LoadOptionsLists("groupsFilter");
                    scope.LoadOptionsLists("teamsFilter");
                    HandleParticipantFilterOptionsForGameType();
                    LoadPossibleParticipantsFiltered();
                });
                $(".flex-game-editor-group-filter-options", element).off("change").on("change", function () {
                    scope.LoadOptionsLists("teamsFilter");
                    HandleParticipantFilterOptionsForGameType();
                    LoadPossibleParticipantsFiltered();
                });
                $(".flex-game-editor-team-filter-options", element).off("change").on("change", function () {
                    LoadPossibleParticipantsFiltered();
                });
                $("#manual-entry-filter-rec-date", element).off("change").on("change", function () {
                    FilterManualEntryForm();
                });
                $("#manual-entry-filter-user-id", element).off("change").on("change", function () {
                    FilterManualEntryForm();
                });
                $("#addPositionRewardList", element).off("change").on("change", function () {
                    console.log("Handle Position Reward change.\n Validate that the position has not been used already.");
                });
                $("#addPrizeRewardList", element).off("change").on("change", function () {
                    let itemId = this.id;
                    HandlePrizeOptionChange(itemId, true);
                });
                $("#addTrophyList", element).off("change").on("change", function () {
                    let itemId = this.id;
                    HandleTrophyOptionChange(itemId, true);
                });
                $("#addSpinnerOptionList", element).off("change").on("change", function () {
                    let itemId = this.id;
                    HandleSpinnerOptionChange(itemId, true);
                });
                $("#flexParticipantEditor_IncludeNonAgentProfiles", element).off("change").on("change", function(){
                    ShowParticipantLoadingImage();
                    window.setTimeout(function(){
                        scope.PossibleParticipants.length = 0;
                        LoadPossibleParticipantsFiltered(function(){
                            HideParticipantLoadingImage();
                        });
                    }, 500);                    
                });
                $("#flexParticipantEditor_IncludeSystemUsers", element).off("change").on("change", function(){
                    ShowParticipantLoadingImage();
                    window.setTimeout(function(){
                        scope.PossibleParticipants.length = 0;
                        LoadPossibleParticipantsFiltered(function(){
                            HideParticipantLoadingImage();
                        });    
                    },500);
                });
                // $("#hasSpinnerOptions", element).off("click").on("click", function () {
                //     let currentGameId = $(".flex-game-form-current-game-id", element).val();
                //     ToggleSpinnerOptionForGame(currentGameId, function () {
                //         HandleGamePrizeDisplay();
                //     });
                // });
                $(".flex-game-reward-manager", element).hide();
                //  if (canManagePrizes == true) {
                //     $(".flex-game-reward-manager", element).show();
                // }
                $(".flex-game-editor-reward", element).on("blur", function () {
                    if (hasFreeFormRewardChanged == true) {
                        UpadateFreeFormRewardForGame();
                    }
                });
                $(".flex-game-editor-reward", element).on("keypress", function () {
                    hasFreeFormRewardChanged = true;
                });
                scope.SetLoadGameListButton(userId);

                scope.WriteUserStatus("Loading game list...", 10000);
                window.setTimeout(function(){
                    scope.LoadGameListForUser(userId);
                }, 500);

                //TODO: Remove this once the budget section is released
                //HideUserBudgetSection();
                if (legacyContainer.scope.TP1Username != "cjarboe") {
                    $(".flex-game-intra-team_manager", element).hide();
                    //HideAwardsSelectionsHolder();
                }
                //spinner options off for now.
                $("#hasSpinnerOptions", element).hide();//spinner is not yet available.
                HideSpinnerOptionsSection();
                $("#spinnerOptionsHolder", element).hide();//spinner is not yet available.
                appLib.HandleResourceTexts(null);
            };
            scope.load();
            
            ko.postbox.subscribe("flexGameLoad", function(){
                scope.load();
            });
            ko.postbox.subscribe("flexGameRefresh", function(){
                scope.WriteUserStatus("Refreshing game list...", 5000);
                scope.load();
            });
            ko.postbox.subscribe("reloadPrizeOptions", function(){                
                LoadPossibleClientPrizeOptions(true, function(){                    
                    let gameId = $(".flex-game-form-current-game-id", element).val();
                    RenderPossiblePrizeOptions();
                    if(gameId > 0)
                    {
                        LoadCurrentGamePrizeOptions(gameId);
                    }
                    $("#prizes-tab", element).click();
                    $("#addPrizeRewardList", element).change();
                    $("#refreshPrizeListButton", element).removeClass("refresh-prize-option-active");                    
                });
            });
        }
    };
}]);
