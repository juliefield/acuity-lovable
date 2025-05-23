angularApp.directive("ngAgameFlexGameList", ['api', '$compile', '$rootScope', function (api, $compile, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/AGAMEFLEX1/view/agameflexgamelist.htm?' + Date.now(),
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

            $("#lnkShowMyGames", element).off("click").on("click", function () {
                ShowMyGames();
                MarkCurrentDisplaySelector("myGameLinkHolder");
                //ko.postbox.publish("FlexGamesReload");
            });
            $("#lnkShowAllGameScores", element).off("click").on("click", function () {
                ShowAllGameScores();
                MarkCurrentDisplaySelector("allGameScoreLinkHolder");
                //ko.postbox.publish("LoadAllFlexGameListing");
            });

            $(".game-board-close-button", element).off("click").on("click", function () {
                scope.ClearLeaderboardData();
                scope.HideGameBoard();
                $(".game-board-holder").removeClass("expanded");
            });
            $(".game-board-refresh-button", element).off("click").on("click", function () {
                scope.WriteAdminStatus("Refresh the game board.");
            });

            $("#userStatsPanelLink", element).off("click").on("click", function () {
                scope.ShowUserStatsPanel();
            });

            $(".flex-game-display-filter").off("click").on("click", function () {
                scope.WriteUserStatus("Refreshing game list...", 5000);
                scope.LoadUserGameList(scope.CurrentUser, function () {
                    scope.DisplayUserGameList(function () {
                        scope.HideUserStatus();
                    });
                });
            });
            $(".flex-game-user-refresh-game-listing").off("click").on("click", function () {
                scope.WriteUserStatus("Refreshing game list...", 5000);
                window.setTimeout(function () {
                    ko.postbox.publish("RefreshAllFlexGameListing");
                    ko.postbox.publish("FlexGamesReload");
                    SetCurrentGameDisplay();
                }, 500);

                // scope.LoadUserGameList(scope.CurrentUser, function () {
                //     scope.DisplayUserGameList(function () {
                //         scope.HideUserStatus();
                //     });
                // });
            });
            $(".reward-winner-display-button-close", element).off("click").on("click", function () {
                HideWinningPrizePanel();
            });
            var canAccessAllGames = false;
            let redactedNameValue = " -- NAMES HIDDEN --";
            let redactedScoreValue = "--";
            var basePrizeUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/prizes/";
            var baseTrophyUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/trophy/";
            var defaultPrizeUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/prizes/prize-placeholder.png";
            var defaultTrophyUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/trophy/empty-trophy.png";
            var canViewUserNames = true;
            var canViewUserScores = true;
            var possiblePrizeOptions = [];
            var possibleTrophies = [];
            var possiblePositions = [];
            let scoringType = "Base";

            var statusCookieName = "acuity_user_status_filter";
            var secondsToDisplayPrizeFor = 15; //15seconds
            var availableAnimations = [
                "dragstrip",
                "straightline",
                "tacos"
                //"wizard"
            ];
            scope.Initialize = function (callback) {
                scope.GameIdToLoad = null;
                scope.NumberOfActionsItemsToDislay = 7;
                scope.UserProfileLinking = true;
                scope.IgnoreNavigateToGame = false;
                scope.AdminLinkUrl = a$.debugPrefix() + "/3/ng/agameflex/default.aspx";
                scope.WinnerTrophyUrl = a$.debugPrefix() + "/App_themes/Acuity3/images/gold-trophy.png";
                scope.FirstLoserTrophyUrl = a$.debugPrefix() + "/App_themes/Acuity3-new/images/silver-trophy.png";
                scope.CurrentLeaderTrophyUrl = a$.debugPrefix() + "/App_themes/Acuity3-new/images/starter-star.png";
                scope.CurrentAchivementBackgrounUrl = a$.debugPrefix() + "/App_themes/Dev-clint/images/parchment2.jpg";
                scope.CurrentUserStatsIconUrl = a$.debugPrefix() + "/App_themes/Acuity3/images/medal-icon.jpg";
                scope.FlexAdminButtonIconUrl = a$.debugPrefix() + "/App_themes/Acuity3/images/plus_button.jpg";
                scope.FlexAdminPossibleRoles = ["Admin", "CorpAdmin", "Management", "Quality Assurance", "Team Leader", "Group Leader"]

                scope.AllUserProfiles = [];

                scope.UserGameList = [];
                scope.CurrentUser = "";
                scope.CurrentUserCanLaunchFlexAdmin = false;
                scope.IntraTeamList = [];
                scope.TeamList = [];
                scope.CurrentAssignedRewards = [];
                scope.ManualRewardsList = [];

                scope.PossibleUsersList = [legacyContainer.scope.TP1Username, "xxxxxxxxyyyyyyy"]
                HandleViewOptions();
                GetScoringType();
                LoadIntraTeamList();
                LoadAllUserProfiles();
                LoadManualRewardsList();
                scope.SetAdminOptions();
                scope.SetDefaultFilters();
                scope.HideUserStatus();
                scope.HideGameBoard();
                scope.HideAdminPanel();
                scope.HideUserStatsPanel();
                scope.SetAdminLaunchAbility();
                SetGameToLoad();
                scope.ShowAdminPanel = false;
                HideWinningPrizePanel();
                LoadPossiblePositions();
                LoadPossiblePrizeOptions();
                LoadPossibleTrophies();
                SetGameTabOptions();

                if (callback != null) {
                    callback();
                }

            };
            function GetScoringType()
            {
                appLib.getConfigParameterByName("CLIENT_SCORING_CALC_TYPE", function(value){
                    scoringType = value.ParamValue.toLowerCase() || "Base".toLowerCase();
                });
            }
            function SetGameTabOptions() {
                if (legacyContainer.scope.TP1Role.toUpperCase() == "CSR".toUpperCase()) {
                    HideAllGamesTab();
                }
                else {
                    ShowAllGamesTab();
                }
            }
            function SetGameToLoad() {
                let gameId = scope.GameIdToLoad || a$.gup("gameid") || a$.gup("gameId");
                if (gameId != null && gameId != "" && (scope.GameIdToLoad == null || scope.GameIdToLoad == "")) {
                    scope.GameIdToLoad = parseInt(gameId);
                }
            }
            function ScrollToGame(gameExistsInList, callback) {
                let scrollTopValue = 0;
                if (gameExistsInList && !scope.IgnoreNavigateToGame) {
                    if ($("#game" + scope.GameIdToLoad) != null) {
                        let divPosition = $("#game" + scope.GameIdToLoad).offset();
                        let divHolderPosition = $(".flex-game-all-list-holder").offset();
                        scrollTopValue = divPosition.top - (divHolderPosition.top + 50);
                    }
                }

                $(".flex-game-all-list-holder").animate({ scrollTop: scrollTopValue }, "slow");

                if (callback != null) {
                    callback();
                }

            }
            function LoadAllUserProfiles() {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "userprofile",
                        cmd: "getAllProfiles"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        LoadUserProfileArray(data);
                    }
                });
            }
            function LoadUserProfileArray(data) {
                var userList = JSON.parse(data.userProfiles);
                scope.AllUserProfiles.length = 0;
                if (userList != null) {
                    for (var u = 0; u < userList.length; u++) {
                        scope.AllUserProfiles.push(userList[u]);
                    }
                }
            }
            function LoadIntraTeamList() {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "selfserve",
                        cmd: "getIntraTeamList",
                        userid: legacyContainer.scope.TP1Username
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var intraTeamList = JSON.parse(data.intraTeamList);
                        scope.IntraTeamList.length = 0;

                        for (var i = 0; i < intraTeamList.length; i++) {
                            scope.IntraTeamList.push(intraTeamList[i]);
                        }
                    }
                });
                //scope.IntraTeamList = [];
            }
            function LoadPossiblePrizeOptions(callback) {
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
                            possiblePrizeOptions.length = 0;
                            possiblePrizeOptions = returnData;
                        }
                        if (callback != null) {
                            callback(returnData);
                        }
                        return;
                    }
                });
            }
            function LoadPossibleTrophies(callback) {
                possibleTrophies.length = 0;
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
            function LoadPossiblePositions(callback) {
                possiblePositions.length = 0;
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
                            possiblePositions.length = 0;
                            possiblePositions = returnData;
                        }
                        if (callback != null) {
                            callback(returnData);
                        }
                        return;
                    }
                });
            }
            scope.SetAdminOptions = function () {
                var permission = scope.FlexAdminPossibleRoles.find(x => x == legacyContainer.scope.TP1Role);
                if (permission != null) {
                    scope.CurrentUserCanLaunchFlexAdmin = true;
                }
            };
            scope.SetAdminLaunchAbility = function () {
                if (scope.CurrentUserCanLaunchFlexAdmin) {
                    var adminLinkHref = scope.AdminLinkUrl;
                    var prefixInfo = a$.gup("prefix");
                    if (prefixInfo != null && prefixInfo != "") {
                        adminLinkHref += "?prefix=" + prefixInfo;
                    }

                    $(".flex-game-admin-option", element).prop("src", scope.FlexAdminButtonIconUrl);
                    //$("#userAdminGame", element).prop("href", scope.AdminLinkUrl);
                    $("#userAdminGame", element).prop("href", adminLinkHref);
                    $("#userAdminGame", element).show();
                } else {
                    $("#userAdminGame", element).prop("href", null);
                    $("#userAdminGame", element).hide();
                }
            };
            scope.SetDefaultFilters = function () {
                var previousSetFilters = $.cookie(statusCookieName);

                if (previousSetFilters != null) {
                    for (var i = 0; i < previousSetFilters.length; i++) {
                        $("input[name='filters'][value='" + previousSetFilters[i] + "']", element).prop("checked", true);
                    }
                } else {
                    $("#filterPreGame", element).prop("checked", true);
                    $("#filterInProgress", element).prop("checked", true);
                    $("#filterComplete", element).prop("checked", true);
                }

            };
            function LoadManualRewardsList() {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "getCurrentManualRewardOptions"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        let manualRewardOptions = JSON.parse(data.manualRewardOptions);
                        scope.ManualRewardsList.length = 0;
                        scope.ManualRewardsList = manualRewardOptions
                    }
                });
            }
            scope.LoadUserGameList = function (userToLoad, callback) {
                scope.WriteUserStatus("Collecting game data...", 15000);
                if (userToLoad == null) {
                    userToLoad = scope.CurrentUser || legacyContainer.scope.TP1Username;
                }

                scope.CurrentUser = userToLoad;
                scope.GetUserProfileInfoFromUserId(userToLoad, function (data) {
                    SetHeaderForUser(data);
                });
                scope.GetUserGameList(userToLoad, function (data) {
                    scope.WriteUserStatus("Proceesing game stats...", 10000);
                    LoadCountData();
                    LoadTickerForUser();
                    HideAllGameScores();
                    if (callback != null) {
                        callback();
                    } else {
                        scope.DisplayUserGameList();
                    }
                });

            };

            function SetHeaderForUser(userData) {
                if (userData != null) {
                    $(".flex-game-header-user-name", element).text(" for " + userData.userinfo.FullName);
                    if (userData.userinfo.AvatarImageFile != null && userData.userinfo.AvatarImageFile != "") {
                        var userAvatar = userData.userinfo.AvatarImageFile;
                        if (userAvatar != "empty_headshot.png") {
                            userAvatar.replace("../", "");
                            userAvatar.replace("./", "");
                            if (!userAvatar.startsWith("/")) {
                                userAvatar = "/" + userAvatar;
                            }
                            userAvatar = a$.debugPrefix() + userAvatar;

                            var avatarImage = $("<img class=\"user-profile-avatar\" src=\"" + userAvatar + "\"/>");
                            $(".user-profile-avatar-holder", element).empty();
                            $(".user-profile-avatar-holder", element).append(avatarImage);
                        }
                    }
                }
            }

            function GetUserGamesForStatsPanel() {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getFlexUserStats"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        let statsObject = JSON.parse(data.userFlexStats);
                        LoadUserStatsPanel(statsObject);
                    }
                });
            }
            function LoadUserStatsPanel(statsInfo) {
                let activeGameCount = 0;
                let activeGameCurrentLeaderCount = 0;
                let totalGameCount = 0;
                let gameTop1Count = 0;
                let gameTop5Count = 0;
                let gameTop10Count = 0;
                let silverMedalCount = 0;
                let userIsAdminCount = 0;

                if (statsInfo != null) {
                    activeGameCount = statsInfo.ActiveGames;
                    activeGameCurrentLeaderCount = statsInfo.CurrentGamesLeading;
                    totalGameCount = statsInfo.TotalGames;
                    gameTop1Count = statsInfo.GamesWon;
                    gameTop5Count = statsInfo.GamesInTop5;
                    gameTop10Count = statsInfo.GamesInTop10;
                    silverMedalCount = statsInfo.GamesFinishedSecond;
                    userIsAdminCount = statsInfo.GamesAdminOf;
                }

                if (scope.CurrentAchivementBackgrounUrl != null) {
                    $(".flex-game-user-stats-row").css("background-image", "url('" + scope.CurrentAchivementBackgrounUrl + "')");
                }
                if (scope.WinnerTrophyUrl != null && scope.WinnerTrophyUrl != "") {
                    $(".flex-game-gold-medal-image", element).prop("src", scope.WinnerTrophyUrl)
                } else {
                    $(".flex-game-gold-medal-image", element).hide();
                }
                if (scope.FirstLoserTrophyUrl != null && scope.FirstLoserTrophyUrl != "") {
                    $(".flex-game-silver-medal-image", element).prop("src", scope.FirstLoserTrophyUrl)
                } else {
                    $(".flex-game-silver-medal-image", element).hide();
                }
                if (scope.CurrentLeaderTrophyUrl != null && scope.CurrentLeaderTrophyUrl != "") {
                    $(".flex-game-current-leader-image", element).prop("src", scope.CurrentLeaderTrophyUrl)
                } else {
                    $(".flex-game-current-leader-image", element).hide();
                }

                if (scope.CurrentUserStatsIconUrl != null && scope.CurrentUserStatsIconUrl != "") {
                    $(".flex-game-user-stats-image", element).prop("src", scope.CurrentUserStatsIconUrl)
                } else {
                    $(".user-stats-panel-link", element).empty();
                    $(".user-stats-panel-link", element).text(">");
                }
                $(".flex-game-user-stats-data-active-game-count", element).text(activeGameCount);
                $(".flex-game-user-stats-data-current-leader-count", element).text(activeGameCurrentLeaderCount);
                $(".flex-game-user-stats-data-supervised-games-count", element).text(userIsAdminCount);
                $(".flex-game-user-stats-data-total-count", element).text(totalGameCount);
                $(".flex-game-user-stats-data-top1-count", element).text(gameTop1Count);
                $(".flex-game-user-stats-data-top2-count", element).text(silverMedalCount);
                $(".flex-game-user-stats-data-top5-count", element).text(gameTop5Count);
                $(".flex-game-user-stats-data-top10-count", element).text(gameTop10Count);

                $(".flex-game-user-stats-header").off("click").on("click", function () {
                    scope.HideUserStatsPanel();
                });

            }

            scope.GetUserProfileInfoFromUserId = function (userId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "userprofile",
                        cmd: "getUserData",
                        userid: userId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        scope.CurrentUserObject = JSON.parse(data.userobject);
                        if (callback != null) {
                            callback(data);
                        }
                    }
                });
            };
            scope.GetUserGameList = function (userToLoad, callback, ignoreCurrentStatusSelection) {
                scope.WriteUserStatus("Getting your game list...", 120000);
                var statusFilterOptionsArray = [];
                if (ignoreCurrentStatusSelection == null || ignoreCurrentStatusSelection == false) {
                    var checkedCount = 0;
                    $(".flex-game-display-filter").each(function () {
                        var item = $(this);
                        if (item.prop("checked") == true) {
                            checkedCount += 1;
                            statusFilterOptionsArray.push($(item).val());
                        }
                        $.cookie(statusCookieName, statusFilterOptionsArray, { expires: 1 });
                    });
                    if (checkedCount == 0) {
                        $(".flex-game-user-list-holder", element).empty();
                        $(".flex-game-user-list-holder", element).append($("<div class=\"no-status-selected\" />"));
                    }
                } else {
                    statusFilterOptionsArray.push("ALL");
                }
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getUserCurrentGameList",
                        userid: userToLoad,
                        statuslist: statusFilterOptionsArray.join(",")
                    },
                    dataType: "json",
                    cache: false,
                    beforeSend: () => {
                        scope.WriteUserStatus("Collecting the game listings...", 120000);
                    },
                    error: a$.ajaxerror,
                    success: function (data) {
                        scope.WriteUserStatus("Writing the game list...");
                        var userGameListToLoad = JSON.parse(data.userCurrentGameList);
                        scope.UserGameList.length = 0;
                        for (var i = 0; i < userGameListToLoad.length; i++) {
                            scope.UserGameList.push(userGameListToLoad[i]);
                        }
                        ko.postbox.publish("LoadAllFlexGameListing");
                        if (callback != null) {
                            callback();
                        }

                    }
                });
            };

            scope.LoadFullGameInformationByGameId = function (gameId, callback) {
                var game = null;
                GetGameByIdAsync(gameId, function (data) {
                    game = JSON.parse(data.gameList);
                    callback(game);
                });
            };

            function LoadCountData() {
                var gameCounter = [];
                var liveGameCount = 0;
                var inReviewGameCount = 0;
                var finalGameCount = 0;
                var pregameCount = 0;
                $(".game-count-pregame", element).text("");
                $(".game-count-live", element).text("");
                $(".game-count-in-review", element).text("");
                $(".game-count-final", element).text("");

                if (scope.UserGameList != null) {
                    let gameCounter = scope.UserGameList.filter(x => x.GameStatusCode == "P");
                    if (gameCounter != null) {
                        liveGameCount = gameCounter.length;
                    }
                    gameCounter = null;
                    gameCounter = scope.UserGameList.filter(x => x.GameStatusCode == "C");
                    if (gameCounter != null) {
                        inReviewGameCount = gameCounter.length;
                    }
                    gameCounter = null;
                    gameCounter = scope.UserGameList.filter(x => x.GameStatusCode == "F");
                    if (gameCounter != null) {
                        finalGameCount = gameCounter.length;
                    }
                    pregameCount = null;
                    gameCounter = scope.UserGameList.filter(x => x.GameStatusCode == "D");
                    if (gameCounter != null) {
                        pregameCount = gameCounter.length;
                    }
                }

                if (liveGameCount !== 0) {
                    $(".game-count-live", element).text("(" + liveGameCount + ")");
                }
                if (pregameCount !== 0) {
                    $(".game-count-pregame", element).text("(" + pregameCount + ")");
                }
                if (inReviewGameCount !== 0) {
                    $(".game-count-in-review", element).text("(" + inReviewGameCount + ")");
                }
                if (finalGameCount !== 0) {
                    $(".game-count-final", element).text("(" + finalGameCount + ")");
                }
            }

            function GetGameByIdAsync(gameId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getGameById",
                        gameid: gameId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (callback != null) {
                            callback(data);
                        }
                        return data;
                    }
                });
            }

            function GetGameById(gameId) {
                let returnObject = null;

                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "getGameById",
                        gameid: gameId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        returnObject = JSON.parse(data.gameList);
                    }
                });
                return returnObject;
            }
            scope.LoadGameScoringInformation = function (gameObject, callback) {
                var scores = null;
                GetGameScoringList(gameObject.FlexGameId, function (data) {
                    scores = JSON.parse(data.leaderBoard);
                    callback(gameObject, scores);
                });
            };

            function GetGameScoringList(gameId, callback) {

                var gameScoringCommand = "getLeaderboardForGame";
                let game = scope.UserGameList.find(g => g.GameId == gameId);
                let themeTypeId = 0;
                let sort = "";

                if (game != null && game.GameIdSource != null) {
                    if (game.GameIdSource.GameTypeId == 2) {
                        gameScoringCommand = "getTeamsLeaderboardForGame";
                    }
                    if (game.GameIdSource.ThemeIdSource != null) {
                        themeTypeId = game.GameIdSource.ThemeIdSource.ThemeTypeId;
                    }
                }

                switch (themeTypeId) {
                    case 3: //phrase game
                        sort = "phrase";
                        break;
                    default:
                        sort = "";
                        break;
                }

                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: gameScoringCommand,
                        gameid: gameId,
                        sort: sort
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
            };

            function GetAgentScoringData(gameId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "getLeaderboardForGame",
                        gameid: gameId
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

            function GetTeamScoringData(gameId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "getTeamsLeaderboardForGame",
                        gameid: gameId
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
            scope.WriteGameInformationToPanels = function (gameObject, callback) {
                WriteLeftPanel(gameObject);
                WriteCenterPanel(gameObject);
                WriteRightPanel(gameObject);
                UpdateRefreshButton(gameObject.FlexGameId);
                if (callback != null) {
                    callback();
                }
            };

            function UpdateRefreshButton(gameId) {
                scope.WriteAdminStatus("Updating refresh button click event.");
                $(".game-board-refresh-button", element).off("click").on("click", function () {
                    scope.LoadGameBoard(gameId);
                })
            }

            function WriteLeftPanel(gameObject) {
                var gameName = $("<div />").append("<label class=\"flex-game-data-label\">Game Name:</label>").append("<label class=\"flex-game-data-label-info\">" + gameObject.Name + "</label>");
                var supervisor = $("<div />").append("<label class=\"flex-game-data-label\">Supervisor:</label>").append("<label class=\"flex-game-data-label-info\">" + gameObject.AdminUserIdSource.UserFullName + "</label>");
                var gameType = $("<div />").append("<label class=\"flex-game-data-label\">Game Battle Type:</label>").append("<label class=\"flex-game-data-label-info\">" + gameObject.GameTypeIdSource.GameTypeName + "</label>");
                var gameTheme = $("<div />").append("<label class=\"flex-game-data-label\">Game Theme:</label>").append("<label class=\"flex-game-data-label-info\">" + gameObject.ThemeIdSource.Name + "</label>");
                let gameRewardList = gameObject.GameReward || "";
                //TODO: (cdj) Determine how to handle the game rewards once we move to a collection of prize options.
                let gameReward = $("<div />").append("<label class=\"flex-game-data-label\">Game Reward:</label>").append("<label class=\"flex-game-data-label-info\">" + gameRewardList + "</label>");

                $("#gameboardLeftPanel", element).empty();
                $("#gameboardLeftPanel", element).append(gameName);
                $("#gameboardLeftPanel", element).append(supervisor);
                $("#gameboardLeftPanel", element).append(gameType);
                $("#gameboardLeftPanel", element).append(gameTheme);
                $("#gameboardLeftPanel", element).append(gameReward);

            }
            function WriteCenterPanel(gameObject) {
                let scoringMetricName = gameObject.GameKpiName;
                if (gameObject.SubKpiName != null && gameObject.SubKpiName != "") {
                    scoringMetricName += ": " + gameObject.SubKpiName;
                }
                var scoringMetric = $("<div />").append("<label class=\"flex-game-data-label\">Scoring Metric:</label>").append("<label class=\"flex-game-data-label-info\">" + scoringMetricName + "</label>");
                var gameDatesCombined = new Date(gameObject.GameStartDate).toLocaleDateString("en-US") + " - " + new Date(gameObject.GameEndDate).toLocaleDateString("en-US");
                var gameFinishScore = null;
                if (gameObject.PointsToEndGame != 0 && gameObject.ThemeIdSource != null && gameObject.ThemeIdSource.RequiresEndingPointTotal == true) {
                    gameFinishScore = $("<div />").append("<label class=\"flex-game-data-label\">Finish Line Score:</label>").append("<label class=\"flex-game-data-label-info\">" + gameObject.PointsToEndGame + "</label>");
                }

                var gameDates = $("<div />").append("<label class=\"flex-game-data-label\">Dates:</label>").append("<label class=\"flex-game-data-label-info\">" + gameDatesCombined + "</label>");

                var participantCount = $("<div />")
                if (gameObject.GameTypeId == 2) {
                    participantCount.append("<label class=\"flex-game-data-label\">Teams:</label>").append("<label class=\"flex-game-data-label-info\">" + gameObject.ParticipatingTeams.length + "</label>");;
                }
                else {
                    participantCount.append("<label class=\"flex-game-data-label\">Participants:</label>").append("<label class=\"flex-game-data-label-info\">" + gameObject.GameParticipants.length + "</label>");;
                }

                $("#gameboardCenterPanel", element).empty();
                $("#gameboardCenterPanel", element).append(scoringMetric);
                $("#gameboardCenterPanel", element).append(gameDates);
                $("#gameboardCenterPanel", element).append(participantCount);
                $("#gameboardCenterPanel", element).append(gameFinishScore);
            }
            function WriteRightPanel(gameObject) {
                var gameScoringHolder = $("<div class=\"flex-game-scoring-range-display-holder\" />");
                if (gameObject.ThemeIdSource != null && gameObject.ThemeIdSource.ThemeTypeId != 1
                    && gameObject.ScoringRange != null && gameObject.ScoringRange.length > 0) {
                    var scoringRangeDataTableHolder = $("<div class=\"\" />");
                    var scoringRangeDataTable = $("<table />");

                    var scoringRangeDataHeaderRow = $("<tr />");
                    var scoringRangePointDataHeader = $("<th class=\"\" />");
                    scoringRangePointDataHeader.append("Points");
                    var scoringRangeLowDataHeader = $("<th class=\"\" />");
                    scoringRangeLowDataHeader.append("Low");
                    var scoringRangeHighDataHeader = $("<th class=\"\" />");
                    scoringRangeHighDataHeader.append("High");

                    scoringRangeDataHeaderRow.append(scoringRangePointDataHeader);
                    scoringRangeDataHeaderRow.append(scoringRangeLowDataHeader);
                    scoringRangeDataHeaderRow.append(scoringRangeHighDataHeader);
                    scoringRangeDataTable.append(scoringRangeDataHeaderRow);

                    for (var i = 0; i < gameObject.ScoringRange.length; i++) {
                        var scoreItem = gameObject.ScoringRange[i];

                        var scoringRangeDataRow = $("<tr class=\"\"/>");
                        var scoringRangePointData = $("<td />");
                        scoringRangePointData.append(scoreItem.Points);
                        var scoringRangeLowData = $("<td />");
                        scoringRangeLowData.append(scoreItem.Range1Low);
                        var scoringRangeHighData = $("<td />");
                        scoringRangeHighData.append(scoreItem.Range1High);

                        scoringRangeDataRow.append(scoringRangePointData);
                        scoringRangeDataRow.append(scoringRangeLowData);
                        scoringRangeDataRow.append(scoringRangeHighData);
                        scoringRangeDataTable.append(scoringRangeDataRow);

                    }
                    scoringRangeDataTableHolder.append(scoringRangeDataTable);
                    gameScoringHolder.append(scoringRangeDataTableHolder);
                }

                $("#gameboardRightPanel", element).empty();
                $("#gameboardRightPanel", element).append(gameScoringHolder);

            }
            scope.LoadGameBoard = function (gameIdToLoad) {
                scope.WriteUserStatus("Collecting all data for the full gameboard...", 10000);
                scope.LoadFullGameInformationByGameId(gameIdToLoad, function (gameObject) {
                    scope.WriteGameInformationToPanels(gameObject);
                    scope.WriteUserStatus("Loading current scores...", 10000);
                    var agentScores = null;
                    var teamScores = null;
                    GetAgentScoringData(gameObject.FlexGameId, function (data) {
                        agentScores = JSON.parse(data.leaderBoard);;
                    });
                    GetTeamScoringData(gameObject.FlexGameId, function (data) {
                        teamScores = JSON.parse(data.leaderBoard);;
                    });
                    scope.WriteUserStatus("Building the leaderboard for the full board...", 10000);
                    BuildLeaderBoard(gameObject, agentScores, teamScores, function () {
                        scope.ShowGameBoard();
                    });
                });
            };

            scope.LoadGameBoardInline = function (gameIdToLoad, callback) {
                scope.LoadFullGameInformationByGameId(gameIdToLoad, function (gameObject) {
                    var scoringList = null;
                    switch (gameObject.GameTypeId) {
                        case 2:
                            scoringList = GetTeamScoringData(gameObject.FlexGameId);
                            break;
                        default:
                            scoringList = GetAgentScoringData(gameObject.FlexGameId);
                            break;
                    }
                    if(1==2)
                    {
                        BuildLeaderBoardInline(gameObject, scoringList, null);
                    }

                });
                if (callback != null) {
                    callback();
                }
            };

            function BuildLeaderBoard(gameObject, agentScoringList, teamScoringList, callback) {
                scope.WriteUserStatus("Building the leaderboard piece by piece...", 10000);

                var gameBoardHolder = $("<div class=\"flex-game-game-board-container\" />");
                var totalColumns = 1;

                var animations = null;
                var gameboardImage = null;
                var boardData = null;
                var userLeaderboardDisplayItemType = "user";
                var teamLeaderboardDisplayItemType = "team";
                let isPhraseGame = false;
                let themeTagName = "";

                if (gameObject != null) {
                    if (gameObject.ThemeIdSource != null) {
                        themeTagName = gameObject.ThemeIdSource.ThemeTagName || "";

                        gameboardImage = gameObject.ThemeIdSource.ThemeBoardDisplayImageName || gameObject.ThemeIdSource.ThemeLeaderboardDisplayImageName;

                        if (gameObject.ThemeIdSource.HasAnimation == true && gameObject.ThemeIdSource.AnimationName != null && gameObject.ThemeIdSource.AnimationName != "") {
                            animations = GetAnimationsByName(gameObject.ThemeIdSource.AnimationName);
                        }

                        if (gameboardImage != null && gameboardImage != "") {
                            gameBoardHolder.css("background-image", "url('" + window.location.protocol + "//" + window.location.hostname + gameboardImage + "')");
                        }

                        isPhraseGame = (gameObject.ThemeIdSource.ThemeTypeId == 3) //phrase game should probalby use enums

                    }

                    if (gameObject.GameTypeIdSource != null) {
                        totalColumns = gameObject.GameTypeIdSource.MaxDisplayColumns || 1;
                        if (totalColumns > 1) {
                            userLeaderboardDisplayItemType = "userleaderboardstyle";
                        }
                    }
                }

                if (isPhraseGame == true) {
                    BuildGamePhraseRow(gameObject, gameBoardHolder);
                }
                else {
                    if (teamScoringList != null && teamScoringList.length > 0) {
                        var teamBoardHolder = $("<div class=\"flex-game-game-board-container-column column1of" + totalColumns + "\" />");
                        switch (gameObject.ThemeIdSource.GameUnitId) {
                            case 1:
                                gameboardImage = null;
                                break;
                            case 3:
                                boardData = BuildFullGameLeaderboardItems(teamScoringList, "positions", gameObject, teamLeaderboardDisplayItemType);
                                break;
                            default:
                                boardData = BuildFullGameLeaderboardItems(teamScoringList, "total", gameObject, teamLeaderboardDisplayItemType);
                                break;
                        }
                        if (boardData != null) {
                            teamBoardHolder.append(boardData);
                        }
                        gameBoardHolder.append(teamBoardHolder);
                    }
                    if (agentScoringList != null && agentScoringList.length > 0) {
                        var columncount = 1;
                        if (teamScoringList != null && teamScoringList.length > 0) {
                            columncount = 2;
                        }
                        var agentBoardHolder = $("<div class=\"flex-game-game-board-container-column column" + columncount + "of" + totalColumns + "\"  />");
                        switch (gameObject.ThemeIdSource.GameUnitId) {
                            case 1:
                                gameboardImage = null;
                                break;
                            case 3:
                                boardData = BuildFullGameLeaderboardItems(agentScoringList, "positions", gameObject, userLeaderboardDisplayItemType);
                                break;
                            default:
                                boardData = BuildFullGameLeaderboardItems(agentScoringList, "total", gameObject, userLeaderboardDisplayItemType);
                                break;
                        }
                        if (boardData != null) {
                            agentBoardHolder.append(boardData);
                        }
                        gameBoardHolder.append(agentBoardHolder);
                    }
                }


                if (animations != null) {
                    gameBoardHolder.append(animations);
                }

                $("#gameBoardInformationHolder", element).empty();
                $("#gameBoardInformationHolder", element).removeClass();
                $("#gameBoardInformationHolder", element).addClass("game-board-information-holder");
                $("#gameBoardInformationHolder", element).addClass(themeTagName);
                $("#gameBoardInformationHolder", element).append(gameBoardHolder);
                //$(".game-board-information-holder", element).empty();
                //$(".game-board-information-holder", element).append(gameBoardHolder);
                if (callback != null) {
                    callback();
                }
            };

            function BuildLeaderboardActions(actionsToDisplay, gameId, teamId) {

                var actionsToDisplayLimited = actionsToDisplay;
                if (actionsToDisplay.length > scope.NumberOfActionsItemsToDislay) {
                    actionsToDisplayLimited = actionsToDisplay.slice((scope.NumberOfActionsItemsToDislay * -1));
                }


                var returnData = $("<div class=\"action-items-overall-holder\"/>");
                let sparkValues = [];
                let sparkDatePoints = [];
                let moveValues = [];

                var sparklineHolder = $("<span class=\"inlinesparkline\" />");

                for (var a = 0; a < actionsToDisplayLimited.length; a++) {
                    var actionItem = actionsToDisplayLimited[a];
                    sparkValues.push(parseFloat(actionItem.KpiScore.toFixed(1)));

                    sparkDatePoints.push(new Date(actionItem.ActionDate).toLocaleDateString("en-US"));
                    moveValues.push(actionItem.MoveValue);
                }

                if (sparkValues.length > 1) {
                    $(sparklineHolder).attr("values", sparkValues.toString());

                }
                else {
                    $(sparklineHolder).append(sparkValues.toString());
                }
                $(sparklineHolder).attr("datePoints", sparkDatePoints);
                $(sparklineHolder).attr("moveValues", moveValues);
                returnData.append(sparklineHolder);

                // var returnData = $("<div class=\"action-items-overall-holder\"/>");
                // for(var a = 0; a < actionsToDisplayLimited.length; a++)
                // {
                //     var actionItem = actionsToDisplayLimited[a];

                //     var actionDataHolder = $("<div class=\"action-item-data-holder\"/>");
                //     var actionDataPoints = $("<div class=\"action-item-data-point\" />");
                //     var actionDataPointsValue = $("<div class=\"action-item-data-point-value\" />");
                //     var actionDataPopupInformation = $("<div class=\"action-item-data-point-popup\" id=\"datapop_game_" + gameId + "_" + a + "\" />");

                //     actionDataPopupInformation.append("<label class=\"action-item-data-date\">" + new Date(actionItem.ActionDate).toLocaleDateString("en-US") + "</label>");
                //     actionDataPopupInformation.append("<label class=\"action-item-data-score\">" + actionItem.KpiScore.toFixed(1) + "</label>&nbsp;-&nbsp;<label class=\"action-item-data-earned\">" + actionItem.MoveValue + "pt</label>");


                //     $(actionDataPopupInformation).hide();

                //     $(actionDataPoints).mouseenter(function(){
                //         $(this).find(".action-item-data-point-popup").show();
                //     }).mouseleave(function(){
                //         $(this).find(".action-item-data-point-popup").hide();
                //     });

                //     actionDataPoints.append(actionDataPopupInformation);
                //     actionDataPointsValue.append("");

                //     actionDataPoints.append(actionDataPointsValue)
                //     actionDataHolder.append(actionDataPoints);

                //     returnData.append(actionDataHolder);
                // }

                return returnData;
            }
            //TODO: Handle the animations information much better and dynamically
            function GetAnimationsByName(animationName) {
                var returnValue = "";
                switch (animationName) {
                    case "alien":
                        returnValue = "<div id=\"alien-wrap\"><div class=\"alien alienx1\"></div><div class=\"alien alienx2\"></div><div class=\"alien alienx3\"></div><div class=\"alien alienx4\"></div><div class=\"alien alienx5\"></div><div class=\"alien alienx6\"></div><div class=\"alien alienx7\"></div><div class=\"alien alienx8\"></div><div class=\"alien alienx9\"></div><div class=\"alien alienx10\"></div><div class=\"alien alienx11\"></div><div class=\"alien alienx12\"></div><div class=\"alien alienx13\"></div></div>";
                        break;
                    case "bubbles":
                        returnValue = "<div id=\"bubble-wrap\"><div class=\"bubble bubblex1\"></div><div class=\"bubble bubblex2\"></div><div class=\"bubble bubblex3\"></div><div class=\"bubble bubblex4\"></div><div class=\"bubble bubblex5\"></div><div class=\"bubble bubblex6\"></div><div class=\"bubble bubblex7\"></div><div class=\"bubble bubblex8\"></div><div class=\"bubble bubblex9\"></div><div class=\"bubble bubblex10\"></div></div>";
                        break;
                    case "pizza-animation":
                        returnValue = "<div id=\"pizza-wrap\"><div class=\"pizzas pizzax1\"></div><div class=\"pizzas pizzax2\"></div><div class=\"pizzas pizzax3\"></div><div class=\"pizzas pizzax4\"></div><div class=\"pizzas pizzax5\"></div><div class=\"pizzas pizzax6\"></div><div class=\"pizzas pizzax7\"></div><div class=\"pizzas pizzax8\"></div><div class=\"pizzas pizzax9\"></div><div class=\"pizzas pizzax10\"></div></div>";
                        break;
                    case "tacos":
                        returnValue = "<div id=\"tacos-wrap\"><div class=\"taco-item tacox1\"></div><div class=\"taco-item tacox2\"></div><div class=\"taco-item tacox3\"></div><div class=\"taco-item tacox4\"></div><div class=\"taco-item tacox5\"></div><div class=\"taco-item tacox6\"></div><div class=\"taco-item tacox7\"></div><div class=\"taco-item tacox8\"></div><div class=\"taco-item tacox9\"></div><div class=\"taco-item tacox10\"></div><div class=\"taco-item tacox11\"></div><div class=\"taco-item tacox12\"></div></div>";
                        break;
                    case "circus":
                        returnValue = "<div id=\"circus-wrap\"><div class=\"circus circusx1\"></div><div class=\"circus circusx2\"></div><div class=\"circus circusx3\"></div><div class=\"circus circusx4\"></div><div class=\"circus circusx5\"></div><div class=\"circus circusx6\"></div><div class=\"circus circusx7\"></div><div class=\"circus circusx8\"></div><div class=\"circus circusx9\"></div><div class=\"circus circusx10\"></div><div class=\"circus circusx11\"></div><div class=\"circus circusx12\"></div><div class=\"circus circusx13\"></div></div>";
                        break;
                    case "donut":
                        returnValue = "<div id=\"donut-wrap\"><div class=\"donut donutx1\"></div><div class=\"donut donutx2\"></div><div class=\"donut donutx3\"></div><div class=\"donut donutx4\"></div><div class=\"donut donutx5\"></div><div class=\"donut donutx6\"></div><div class=\"donut donutx7\"></div><div class=\"donut donutx8\"></div><div class=\"donut donutx9\"></div><div class=\"donut donutx10\"></div><div class=\"donut donutx11\"></div><div class=\"donut donutx12\"></div><div class=\"donut donutx13\"></div></div>";
                        break;
                    case "gridiron":
                        returnValue = "<div id=\"gridiron-wrap\"><div class=\"gridiron gridironx1\"></div><div class=\"gridiron gridironx2\"></div><div class=\"gridiron gridironx3\"></div><div class=\"gridiron gridironx4\"></div><div class=\"gridiron gridironx5\"></div><div class=\"gridiron gridironx6\"></div><div class=\"gridiron gridironx7\"></div><div class=\"gridiron gridironx8\"></div><div class=\"gridiron gridironx9\"></div><div class=\"gridiron gridironx10\"></div><div class=\"gridiron gridironx11\"></div><div class=\"gridiron gridironx12\"></div><div class=\"gridiron gridironx13\"></div></div>";
                        break;
                    case "hoops":
                        returnValue = "<div id=\"hoops-wrap\"><div class=\"hoops hoopsx1\"></div><div class=\"hoops hoopsx2\"></div><div class=\"hoops hoopsx3\"></div><div class=\"hoops hoopsx4\"></div><div class=\"hoops hoopsx5\"></div><div class=\"hoops hoopsx6\"></div><div class=\"hoops hoopsx7\"></div><div class=\"hoops hoopsx8\"></div><div class=\"hoops hoopsx9\"></div><div class=\"hoops hoopsx10\"></div><div class=\"hoops hoopsx11\"></div><div class=\"hoops hoopsx12\"></div><div class=\"hoops hoopsx13\"></div></div>";
                        break;
                    case "soccer":
                        returnValue = "<div id=\"soccer-wrap\"><div class=\"soccer soccerx1\"></div><div class=\"soccer soccerx2\"></div><div class=\"soccer soccerx3\"></div><div class=\"soccer soccerx4\"></div><div class=\"soccer soccerx5\"></div><div class=\"soccer soccerx6\"></div><div class=\"soccer soccerx7\"></div><div class=\"soccer soccerx8\"></div><div class=\"soccer soccerx9\"></div><div class=\"soccer soccerx10\"></div><div class=\"soccer soccerx11\"></div><div class=\"soccer soccerx12\"></div><div class=\"soccer soccerx13\"></div></div>";
                        break;
                    case "wheres-mrb":
                        returnValue = "<div id=\"wheres-mrb-wrap\"><div class=\"wheres-mrb-animation wheres-mrbx1\"></div><div class=\"wheres-mrb-animation wheres-mrbx2\"></div><div class=\"wheres-mrb-animation wheres-mrbx3\"></div><div class=\"wheres-mrb-animation wheres-mrbx4\"></div><div class=\"wheres-mrb-animation wheres-mrbx5\"></div><div class=\"wheres-mrb-animation wheres-mrbx6\"></div><div class=\"wheres-mrb-animation wheres-mrbx7\"></div><div class=\"wheres-mrb-animation wheres-mrbx8\"></div><div class=\"wheres-mrb-animation wheres-mrbx9\"></div><div class=\"wheres-mrb-animation wheres-mrbx10\"></div><div class=\"wheres-mrb-animation wheres-mrbx11\"></div><div class=\"wheres-mrb-animation wheres-mrbx12\"></div><div class=\"wheres-mrb-animation wheres-mrbx13\"></div></div>";
                        break;
                    default:
                        returnValue = null;
                        break;
                }
                return returnValue;
            }

            /* $(document).bind('mousemove', function(e){
                $('.taco-item').css({
                   left:  e.pageX + 20,
                   top:   e.pageY
                });
            }); */

            document.addEventListener('mousemove', (e) => {
                const sqrs = document.querySelectorAll('.taco-item');

                const mouseX = e.pageX;
                const mouseY = e.pageY;

                sqrs.forEach(sqr => {
                    const sqrX = sqr.offsetLeft + 20;
                    const sqrY = sqr.offsetTop + 20;

                    const diffX = mouseX - sqrX;
                    const diffY = mouseY - sqrY;

                    const radians = Math.atan2(diffY, diffX);

                    const angle = radians * 180 / Math.PI;

                    sqr.style.transform = `rotate(${angle}deg)`;
                })

            })

            function BuildLeaderBoardInline(gameObject, scoringList) {
                var gameBoardHolder = $("<div class=\"flex-game-game-board-container\" />");
                if (gameObject != null && gameObject.ThemeIdSource != null) {
                    var gameboardImage;
                    var boardData = null;
                    gameboardImage = gameObject.ThemeIdSource.ThemeBoardDisplayImageName || gameObject.ThemeIdSource.ThemeLeaderboardDisplayImageName;
                    switch (gameObject.ThemeIdSource.GameUnitId) {
                        case 1:
                            gameboardImage = null;
                            break;
                        case 3:
                            boardData = BuildGameLeaderboardItems(scoringList, "positions", gameObject);
                            break;
                        default:
                            let scoreDisplayType = "average"
                            if (gameObject != null && gameObject.ScoringOptionId == 2) //cumulative scoring type
                            {
                                scoreDisplayType = "total";
                            }
                            boardData = BuildGameLeaderboardItems(scoringList, scoreDisplayType, gameObject);
                            break;
                    }

                    if (gameboardImage != null && gameboardImage != "") {
                        gameBoardHolder.css("background-image", "url('" + window.location.protocol + "//" + window.location.hostname + gameboardImage + "')");
                    }

                    if (boardData != null) {
                        gameBoardHolder.append(boardData);
                    }
                }

                return gameBoardHolder;

            };

            function BuildFullGameLeaderboardItems(scoringList, scoreFieldToDisplay, game, displayOptions) {
                var displayUserProgressBar = (game.GameTypeId == 1);
                var displayTeamProgressBar = (game.GameTypeId == 2);
                var leaderboardInfo = $("<div class=\"flex-game-board-calendar-holder\" />");
                var participantHeader = $("<div class=\"flex-game-board-participant-header\" />");
                let isLeaderboardGame = false;

                if (displayOptions == "team") {
                    participantHeader.append($("<div class=\"rank-item team-leaderboard-column\" />").append("Rank"));
                    participantHeader.append($("<div class=\"team-name-item team-leaderboard-column\" />").append("Team Name"));
                    participantHeader.append($("<div class=\"team-score-item team-leaderboard-column\" />").append("Points"));

                    if (game != null) {
                        if (game.PointsToEndGame != 0 && game.ThemeIdSource != null && game.ThemeIdSource.RequiresEndingPointTotal == true) {
                            //participantHeader.append($("<div class=\"progress-item\" />").append("Game Progress"));
                            participantHeader.append($("<div class=\"progress-item\" />").append("&nbsp;"));
                        }
                        if (game.ThemeIdSource != null) {
                            isLeaderboardGame = (game.ThemeIdSource.ThemeTypeId == 1);
                        }
                        else {
                            participantHeader.append($("<div class=\"team-score-graph-item team-leaderboard-column\" />").append("Recent scores"));
                        }
                    }
                    leaderboardInfo.append(participantHeader);


                    for (var i = 0; i < scoringList.length; i++) {
                        var item = scoringList[i];
                        var participantItem = $("<div class=\"flex-game-board-participant-item\" />");
                        let itemRank = item.RankingGamePoints;
                        participantItem.append($("<div class=\"rank-item team-leaderboard-column\" />").append("<span>" + itemRank + "</span>"));
                        let teamName = item.TeamName || item.IntraTeamName || "";
                        //TODO: Handle the display of the names visibility here.
                        //participantItem.append($("<div class=\"team-name-item team-leaderboard-column\" />").append("<span>" + item.TeamName + "</span>"));
                        participantItem.append($("<div class=\"team-name-item team-leaderboard-column\" />").append("<span>" + teamName + "</span>"));
                        let itemGameScore = item.GameScore;
                        if (isLeaderboardGame == true && item.GameScore == 0) {
                            itemGameScore = item.TotalKpiScore;
                        }
                        //TODO: Handle the display of the scoring visibility here.
                        participantItem.append($("<div class=\"team-size-item score-item team-leaderboard-column\" />").append("<span>" + itemGameScore + "</span>"));

                        var actionHolder = $("<div class=\"leaderboard-action-holder team-leaderboard-column\" />");
                        if (item.TeamLeaderboardActions != null && item.TeamLeaderboardActions.length > 0) {
                            actionHolder.append(BuildLeaderboardActions(item.TeamLeaderboardActions, game.FlexGameId));
                        }

                        if (displayTeamProgressBar == true && game != null && game.PointsToEndGame != 0 && game.ThemeIdSource != null && game.ThemeIdSource.RequiresEndingPointTotal == true) {
                            var progressHolder = $("<div class=\"progress-item team-leaderboard-column\" />");
                            var widthValue = parseInt((item.GameScore / game.PointsToEndGame) * 100);
                            var completionPertangeLabel = $("<label class=\"flex-game-board-participant-item-percentage-complete\">" + widthValue + "%</label>");
                            var participantEmptyBar = $("<div class=\"flex-game-board-participant-item-empty-progress-bar\" />");
                            var participantCompletionBar = $("<div class=\"flex-game-board-participant-item-filled-progress-bar\" />");
                            participantCompletionBar.width(widthValue + "%");
                            participantCompletionBar.html("&nbsp;");

                            participantEmptyBar.append(participantCompletionBar);
                            progressHolder.append(completionPertangeLabel);
                            progressHolder.append(participantEmptyBar);
                        }
                        participantItem.append(progressHolder);
                        participantItem.append(actionHolder);

                        if (game.GameLeaderboard != null) {
                            let currentUserLeaderboardItem = game.GameLeaderboard.find(i => i.UserId == legacyContainer.scope.TP1Username && (i.TeamName == teamName || i.IntraTeamName == teamName));
                            if (currentUserLeaderboardItem != null) {
                                participantItem.addClass("currentUserItem");
                            }
                        }
                        leaderboardInfo.append(participantItem);
                    }
                }
                else if (displayOptions == "userleaderboardstyle") {
                    participantHeader.append($("<div class=\"rank-item\" />").append("Rank"));
                    participantHeader.append($("<div class=\"name-item\" />").append("Name"));
                    participantHeader.append($("<div class=\"teamname-item\" />").append("Team Name"));
                    participantHeader.append($("<div class=\"score-item\" />").append("Score"));
                    participantHeader.append($("<div class=\"tie-breaker-item\" />").append("Tie Breaker"));

                    leaderboardInfo.append(participantHeader);
                    var altRowClass = "";
                    var currentRank = 0;
                    for (var i = 0; i < scoringList.length; i++) {
                        var participantDataItem = scoringList[i];
                        var participantItem = $("<div class=\"flex-game-board-participant-item\" />");
                        var currentUser = scope.CurrentUser || legacyContainer.scope.TP1Username;

                        if (participantDataItem.UserIdSource.UserId.toLowerCase() == currentUser.toLowerCase()) {
                            participantItem.addClass("currentUserItem");
                        }

                        if (currentRank > 0 && participantDataItem.RankKpiScore != currentRank) {
                            if (altRowClass == "") {
                                altRowClass = "alt";
                            } else {
                                altRowClass = "";
                            }
                        }

                        participantItem.addClass(altRowClass);
                        currentRank = participantDataItem.RankKpiScore;
                        let itemRank = participantDataItem.RankKpiScore;
                        participantItem.append($("<div class=\"rank-item\" />").append("<span>" + itemRank + "</span>"));
                        var participantName = $("<div class=\"name-item\" />");
                        if (scope.UserProfileLinking == true) {
                            //var profileLink = GetUserProfileLink(participantDataItem.UserIdSource.UserFullName, participantDataItem.UserId, "flex-user-service", false);
                            var profileLink = BuildUserProfileLink(participantDataItem.UserId);

                            $(profileLink).off("click").on("click", function () {
                                let service = $(this).attr("service");
                                let bypass = false;
                                if (!bypass) {
                                    appApmContentTriggers.process(service, this);
                                }
                            });

                            if (profileLink != null && profileLink != "") {
                                participantName.append(profileLink);
                            } else {
                                participantName.append(participantDataItem.UserIdSource.UserFullName);
                            }
                        } else {
                            participantName.append(participantDataItem.UserIdSource.UserFullName);
                        }
                        participantItem.append(participantName);
                        var teamName = "";
                        if (participantDataItem.TeamId != null && participantDataItem.TeamName != "") {
                            teamName = participantDataItem.TeamName;
                        }
                        else if (participantDataItem.IntraTeamId != null && participantDataItem.IntraTeamName != "") {
                            teamName = participantDataItem.IntraTeamName
                        }
                        //TODO: Handle the name visibility information here.
                        participantItem.append($("<div class=\"teamname-item\" />").append(teamName));

                        var score = 0;
                        let tieBreakerScore = 0;
                        score = participantDataItem.KpiScoreTotal;
                        score = score.toFixed(2);
                        tieBreakerScore = participantDataItem.TieBreakerScore;
                        if(tieBreakerScore == null)
                        {
                            tieBreakerScore = "N/A";
                        }
                        else
                        {

                            if(scoringType == "stddev")
                            {
                                tieBreakerScore = tieBreakerScore.toFixed(4);
                            }
                            else
                            {
                                tieBreakerScore = tieBreakerScore.toFixed(2);
                            }
                        }

                        //TODO: Handle the scoring visibility here.
                        participantItem.append($("<div class=\"score-item\" />").append("<span>" + score + "</span>"));

                        participantItem.append($("<div class=\"tie-breaker-item\" />").append("<span>" + tieBreakerScore + "</span>"));

                        leaderboardInfo.append(participantItem);
                    }
                }
                else {
                    participantHeader.append($("<div class=\"rank-item\" />").append("Rank"));
                    participantHeader.append($("<div class=\"name-item\" />").append("Name"));
                    participantHeader.append($("<div class=\"score-item\" />").append("Score"));
                    participantHeader.append($("<div class=\"tie-breaker-item\" />").append("Tie Breaker"));
                    //participantHeader.append($("<div class=\"score-chance-item\" />").append("Days Scored"));
                    if (game != null && game.PointsToEndGame != 0 && game.ThemeIdSource != null && game.ThemeIdSource.RequiresEndingPointTotal == true) {
                        participantHeader.append($("<div class=\"progress-item\" />").append("&nbsp;"));
                    }

                    leaderboardInfo.append(participantHeader);

                    var altRowClass = "";
                    var currentRank = 0;
                    for (var i = 0; i < scoringList?.length; i++) {
                        var participantDataItem = scoringList[i];
                        var participantItem = $("<div class=\"flex-game-board-participant-item\" />");
                        var currentUser = scope.CurrentUser || legacyContainer.scope.TP1Username;

                        if (participantDataItem.UserIdSource.UserId.toLowerCase() == currentUser.toLowerCase()) {
                            participantItem.addClass("currentUserItem");
                        }

                        if (currentRank > 0 && participantDataItem.StackRank != currentRank) {
                            if (altRowClass == "") {
                                altRowClass = "alt";
                            } else {
                                altRowClass = "";
                            }
                        }

                        participantItem.addClass(altRowClass);
                        currentRank = participantDataItem.StackRank;
                        let itemRank = participantDataItem.StackRank;
                        participantItem.append($("<div class=\"rank-item\" />").append("<span>" + itemRank + "</span>"));
                        //participantItem.append($("<div class=\"name-item\" />").append(participantDataItem.UserIdSource.UserFullName));
                        var participantName = $("<div class=\"name-item\" />");
                        if (scope.UserProfileLinking == true) {
                            //var profileLink = GetUserProfileLink(participantDataItem.UserIdSource.UserFullName, participantDataItem.UserId, "flex-user-service", false);
                            var profileLink = BuildUserProfileLink(participantDataItem.UserId);
                            $(profileLink).off("click").on("click", function () {

                                let service = $(this).attr("service");
                                let bypass = false;
                                if (!bypass) {
                                    appApmContentTriggers.process(service, this);
                                }
                            });
                            if (profileLink != null && profileLink != "") {
                                participantName.append(profileLink);
                            } else {
                                participantName.append(participantDataItem.UserIdSource.UserFullName);
                            }
                        } else {
                            participantName.append(participantDataItem.UserIdSource.UserFullName);
                        }
                        if(canViewUserNames == true || participantDataItem.UserId == legacyContainer.scope.TP1Username)
                        {
                            participantItem.append(participantName);
                        }
                        else
                        {
                            participantItem.append(redactedNameValue);
                        }
                        var score = 0;
                        let tieBreakerScore = 0;
                        if (scoreFieldToDisplay.toLowerCase() == "total") {
                            score = participantDataItem.KpiScoreTotal;
                            score = score.toFixed(2);
                        } else if (scoreFieldToDisplay.toLowerCase() == "positions") {
                            score = participantDataItem.BoardPositions;
                        } else {
                            score = participantDataItem.KpiScoreAverage;
                            score = score.toFixed(2);
                        }
                        tieBreakerScore = participantDataItem.TieBreakerScore;
                        if(tieBreakerScore == null)
                        {
                            tieBreakerScore = "N/A";
                        }
                        else
                        {
                            if(scoringType == "stddev")
                            {
                                tieBreakerScore = tieBreakerScore.toFixed(4);
                            }
                            else
                            {
                                tieBreakerScore = tieBreakerScore.toFixed(2);
                            }
                        }


                        //TODO: Handle the scoring visibility here.
                        if(canViewUserScores == true || participantDataItem.UserId == legacyContainer.scope.TP1Username)
                        {
                            participantItem.append($("<div class=\"score-item\" />").append("<span>" + score + "</span>"));
                            participantItem.append($("<div class=\"tie-breaker-item\" />").append(`<span>${tieBreakerScore}</span>`));
                        }
                        else
                        {
                            participantItem.append($("<div class=\"score-item\" />").append(`<span>${redactedScoreValue}</span>`));
                            participantItem.append($("<div class=\"tie-breaker-item\" />").append(`<span>${redactedScoreValue}</span>`));
                        }

                        // if (participantDataItem.ScoringChances != null) {
                        //     participantItem.append($("<div class=\"score-chance-item\" />").append("<span>" + participantDataItem.ScoringChances + "</span>"));
                        // }
                        // else {
                        //     participantItem.append($("<div class=\"score-chance-item\" />").append("<span>N/A</span>"));
                        // }
                        if (displayUserProgressBar && game != null && game.PointsToEndGame != 0 && game.ThemeIdSource != null && game.ThemeIdSource.RequiresEndingPointTotal == true) {
                            var progressHolder = $("<div class=\"progress-item\" />");

                            var widthValue = parseInt((score / game.PointsToEndGame) * 100);
                            var completionPertangeLabel = $("<label class=\"flex-game-board-participant-item-percentage-complete\">" + widthValue + "%</label>");
                            var participantEmptyBar = $("<div class=\"flex-game-board-participant-item-empty-progress-bar\" />");
                            var participantCompletionBar = $("<div class=\"flex-game-board-participant-item-filled-progress-bar\" />");
                            participantCompletionBar.width(widthValue + "%");
                            participantCompletionBar.html("");

                            participantEmptyBar.append(participantCompletionBar);
                            progressHolder.append(completionPertangeLabel);
                            progressHolder.append(participantEmptyBar);

                            participantItem.append(progressHolder);

                        }
                        leaderboardInfo.append(participantItem);
                    }
                }
                return leaderboardInfo;
            }

            function BuildGameLeaderboardItems(scoringList, scoreFieldToDisplay, game) {
                var leaderboardInfo = $("<div class=\"flex-game-board-calendar-holder\" />");
                var participantHeader = $("<div class=\"flex-game-board-participant-header\" />");
                let isPhraseGame = (game?.ThemeIdSource?.ThemeTypeId == 3) || false;

                if(isPhraseGame == true)
                {
                    BuildGamePhraseRow(game, leaderboardInfo);
                }
                else{
                    if (game != null && game.GameTypeId == 2) {
                        let isLeaderboardGame = false;
                        participantHeader.append($("<div class=\"rank-item team-leaderboard-column\" />").append("Rank"));
                        participantHeader.append($("<div class=\"team-name-item team-leaderboard-column\" />").append("Team Name"));

                        participantHeader.append($("<div class=\"team-score-item team-leaderboard-column\" />").append("Points"));

                        if (game != null) {
                            if (game.PointsToEndGame != 0 && game.ThemeIdSource != null && game.ThemeIdSource.RequiresEndingPointTotal == true) {
                                //participantHeader.append($("<div class=\"progress-item\" />").append("Game Progress"));
                                participantHeader.append($("<div class=\"progress-item\" />").append("&nbsp;"));
                            }
                            if (game.ThemeIdSource != null) {
                                isLeaderboardGame = (game.ThemeIdSource.ThemeTypeId == 1);
                            }
                            else {
                                participantHeader.append($("<div class=\"team-score-graph-item team-leaderboard-column\" />").append("Recent scores"));
                            }
                        }
                        leaderboardInfo.append(participantHeader);

                        for (var i = 0; i < scoringList?.length; i++) {
                            var item = scoringList[i];
                            var participantItem = $("<div class=\"flex-game-board-participant-item\" />");
                            let itemRank = item.RankingGamePoints;
                            participantItem.append($("<div class=\"rank-item team-leaderboard-column\" />").append("<span>" + itemRank + "</span>"));
                            //participantItem.append($("<div class=\"team-name-item team-leaderboard-column\" />").append("<span>" + item.TeamName + "</span>"));
                            let teamName = item.TeamName || item.IntraTeamName || "";
                            //TODO: Handle the visibility of names here...
                            participantItem.append($("<div class=\"team-name-item team-leaderboard-column\" />").append("<span>" + teamName + "</span>"));
                            let itemGameScore = item.GameScore;
                            if (isLeaderboardGame == true && itemGameScore == 0) {
                                itemGameScore = item.TotalKpiScore;
                            }
                            //TODO: Handle the scoring visibility here?
                            participantItem.append($("<div class=\"team-size-item score-item team-leaderboard-column\" />").append("<span>" + itemGameScore + "</span>"));

                            var progressHolder = $("<div class=\"progress-item team-leaderboard-column\" />");
                            var widthValue = parseInt((item.GameScore / game.PointsToEndGame) * 100);
                            var actionHolder = $("<div class=\"leaderboard-action-holder team-leaderboard-column\" />");
                            if (item.TeamLeaderboardActions != null && item.TeamLeaderboardActions.length > 0) {
                                actionHolder.append(BuildLeaderboardActions(item.TeamLeaderboardActions, game.FlexGameId, item.TeamId));
                            }
                            if (game != null && game.PointsToEndGame != 0 && game.ThemeIdSource != null && game.ThemeIdSource.RequiresEndingPointTotal == true) {
                                var completionPertangeLabel = $("<label class=\"flex-game-board-participant-item-percentage-complete\">" + widthValue + "%</label>");
                                var participantEmptyBar = $("<div class=\"flex-game-board-participant-item-empty-progress-bar\" />");
                                var participantCompletionBar = $("<div class=\"flex-game-board-participant-item-filled-progress-bar\" />");
                                participantCompletionBar.width(widthValue + "%");
                                participantCompletionBar.html("&nbsp;");
                                participantEmptyBar.append(participantCompletionBar);
                                progressHolder.append(completionPertangeLabel);
                                progressHolder.append(participantEmptyBar);
                            }

                            participantItem.append(actionHolder);
                            participantItem.append(progressHolder);

                            leaderboardInfo.append(participantItem);
                        }
                    }
                    else {
                        participantHeader.append($("<div class=\"rank-item\" />").append("Rank"));
                        participantHeader.append($("<div class=\"name-item\" />").append("Name"));
                        participantHeader.append($("<div class=\"score-item\" />").append("Score"));
                        participantHeader.append($("<div class=\"tie-breaker-item\" />").append("Tie Breaker"));
                        // let scoreCountHeaderText = "Days Scored";
                        // if(scoreFieldToDisplay.toLowerCase() == "total")
                        // {
                        //     scoreCountHeaderText = "# of Scores";
                        // }
                        // participantHeader.append($("<div class=\"score-chance-item\" />").append(scoreCountHeaderText));
                        if (game != null && game.PointsToEndGame != 0 && game.ThemeIdSource != null && game.ThemeIdSource.RequiresEndingPointTotal == true) {
                            //participantHeader.append($("<div class=\"progress-item\" />").append("Game Progress"));
                            participantHeader.append($("<div class=\"progress-item\" />").append("&nbsp;"));
                        }
                        leaderboardInfo.append(participantHeader);

                        var altRowClass = "";
                        var currentRank = 0;
                        for (var i = 0; i < scoringList?.length; i++) {
                            var participantDataItem = scoringList[i];
                            var participantItem = $("<div class=\"flex-game-board-participant-item\" />");
                            var currentUser = scope.CurrentUser || legacyContainer.scope.TP1Username;

                            if (participantDataItem.UserIdSource.UserId.toLowerCase() == currentUser.toLowerCase()) {
                                participantItem.addClass("currentUserItem");
                            }

                            if (currentRank > 0 && participantDataItem.StackRank != currentRank) {
                                if (altRowClass == "") {
                                    altRowClass = "alt";
                                } else {
                                    altRowClass = "";
                                }
                            }

                            participantItem.addClass(altRowClass);
                            currentRank = participantDataItem.StackRank;
                            let itemRank = participantDataItem.StackRank;
                            participantItem.append($("<div class=\"rank-item\" />").append("<span>" + itemRank + "</span>"));
                            //participantItem.append($("<div class=\"name-item\" />").append(participantDataItem.UserIdSource.UserFullName));
                            var participantName = $("<div class=\"name-item\" />");
                            if (scope.UserProfileLinking == true) {
                                //var profileLink = GetUserProfileLink(participantDataItem.UserIdSource.UserFullName, participantDataItem.UserId, "flex-user-service", false);
                                var profileLink = BuildUserProfileLink(participantDataItem.UserId);
                                $(profileLink).off("click").on("click", function () {
                                    let service = $(this).attr("service");
                                    let bypass = false;
                                    if (!bypass) {
                                        appApmContentTriggers.process(service, this);
                                    }
                                });

                                if (profileLink != null && profileLink != "") {
                                    participantName.append(profileLink);
                                } else {
                                    participantName.append(participantDataItem.UserIdSource.UserFullName);
                                }
                            } else {
                                participantName.append(participantDataItem.UserIdSource.UserFullName);
                            }
                            if(canViewUserNames == true || participantDataItem.UserId == legacyContainer.scope.TP1Username)
                            {
                                participantItem.append(participantName);
                            }
                            else
                            {
                                participantItem.append(redactedNameValue);
                            }
                            var score = 0;
                            let tieBreakerScore = 0;
                            if (scoreFieldToDisplay.toLowerCase() == "total") {
                                score = participantDataItem.KpiScoreTotal;
                                score = score.toFixed(2);
                            } else if (scoreFieldToDisplay.toLowerCase() == "positions") {
                                score = participantDataItem.BoardPositions;
                            } else {
                                score = participantDataItem.KpiScoreAverage;
                                score = score.toFixed(2);
                            }
                            tieBreakerScore = participantDataItem.TieBreakerScore;
                            if(tieBreakerScore == null)
                            {
                                tieBreakerScore = "N/A";
                            }
                            else
                            {
                                if(scoringType == "stddev")
                                {
                                    tieBreakerScore = tieBreakerScore.toFixed(4);
                                }
                                else
                                {
                                    tieBreakerScore = tieBreakerScore.toFixed(2);
                                }
                            }

                            if(canViewUserScores == true || participantDataItem.UserId == legacyContainer.scope.TP1Username)
                            {
                                participantItem.append($("<div class=\"score-item\" />").append("<span>" + score + "</span>"));
                                participantItem.append($("<div class=\"tie-breaker-item\" />").append(`<span>${tieBreakerScore}</span>`));
                            }
                            else
                            {
                                participantItem.append($("<div class=\"score-item\" />").append(`<span>${redactedScoreValue}</span>`));
                                participantItem.append($("<div class=\"tie-breaker-item\" />").append(`<span>${redactedScoreValue}</span>`));
                            }
                            // if (participantDataItem.ScoringChances != null) {
                            //     participantItem.append($("<div class=\"score-chance-item\" />").append("<span>" + participantDataItem.ScoringChances + "</span>"));
                            // }
                            // else {
                            //     participantItem.append($("<div class=\"score-chance-item\" />").append("<span>N/A</span>"));
                            // }

                            if (game != null && game.PointsToEndGame != 0 && game.ThemeIdSource != null && game.ThemeIdSource.RequiresEndingPointTotal) {

                                var progressHolder = $("<div class=\"progress-item\" />");
                                var widthValue = parseInt((score / game.PointsToEndGame) * 100);
                                var completionPertangeLabel = $("<label class=\"flex-game-board-participant-item-percentage-complete\">" + widthValue + "%</label>");
                                var participantEmptyBar = $("<div class=\"flex-game-board-participant-item-empty-progress-bar\" />");
                                var participantCompletionBar = $("<div class=\"flex-game-board-participant-item-filled-progress-bar\" />");
                                participantCompletionBar.width(widthValue + "%");
                                participantCompletionBar.html("");

                                participantEmptyBar.append(participantCompletionBar);
                                progressHolder.append(completionPertangeLabel);
                                progressHolder.append(participantEmptyBar);
                                participantItem.append(progressHolder);

                            }

                            leaderboardInfo.append(participantItem);
                        }
                    }

                }

                return leaderboardInfo;
            }

            scope.ClearLeaderboardData = function () {
                //$(".game-board-information-holder", element).empty();
                $("#gameBoardInformationHolder", element).empty();
            };
            function BuildSparklineTooltip(sparkline, options, fields) {
                var sparklineObj = $(sparkline);
                var datePoints = $(sparklineObj[0].el).attr("datepoints");
                var datePointsArray = datePoints.split(",");
                var moveValues = $(sparklineObj[0].el).attr("movevalues");
                var moveValuesArray = moveValues.split(",");
                var values = $(sparklineObj[0].el).attr("values");
                var valuesArray = values.split(",");

                var index = fields.offset;

                var returnInfo = "";
                returnInfo += "<label class=\"action-item-data-date\">" + datePointsArray[index] + "</label>";
                returnInfo += "<label class=\"action-item-data-score\">" + valuesArray[index] + " (" + moveValuesArray[index] + ")</label>";
                // returnInfo += "&nbsp;-&nbsp;";
                // returnInfo += "<label class=\"action-item-data-earned\">" + moveValuesArray[index] + "</label>";

                return returnInfo;

            }
            scope.DisplayUserGameList = function (callback) {
                let gameFound = false;
                scope.WriteUserStatus("Rendering Game data...", 5000);
                $(".flex-game-user-list-holder", element).empty();
                if (scope.UserGameList.length == 0) {
                    var noGamesFound = $("<div class=\"flex-game-no-games-holder\" />");
                    let noGamesFoundLabel = $("<span class=\"flex-game-no-games-found\" />");
                    noGamesFoundLabel.append("No Games found with the status information you have selected.");
                    noGamesFound.append(noGamesFoundLabel);
                    $(".flex-game-user-list-holder", element).append(noGamesFound);
                } else {
                    scope.WriteUserStatus("Outputting game information...", 3000);
                    for (var i = 0; i < scope.UserGameList.length; i++) {
                        var item = scope.UserGameList[i];
                        var gameRow = $("<div class=\"flex-game-game-row\" id=\"game" + item.GameId + "\" />");
                        BuildGameCardForDisplay(item, gameRow);

                        $(".flex-game-user-list-holder", element).append(gameRow);

                        HideGameRowTab("all", item.GameId);
                        ShowGameRowTab("game", item.GameId);

                        if (!gameFound) {
                            gameFound = (scope.GameIdToLoad != null && item.GameId == scope.GameIdToLoad);
                        }

                    }
                }
                GetUserGamesForStatsPanel();
                $(".inlinesparkline", $(".leaderboard-action-holder")).sparkline('html', {

                    type: 'line',
                    width: '100%',
                    lineColor: '#333',
                    fillColor: '',
                    lineWidth: 1,
                    spotColor: '#666',
                    spotRadius: 3,
                    defaultPixelsPerValue: 5,
                    highlightSpotColor: '#009ad9',
                    valueSpots: { '0:10000000': '#666' },
                    minSpotColor: '#666',
                    maxSpotColor: '#666',
                    tooltipPrefix: "Score: ",
                    tooltipFormat: "topLevelSparkline",
                    tooltipFormatter: BuildSparklineTooltip
                });
                SetCurrentGameDisplay();
                ScrollToGame(gameFound);

                if (callback != null) {
                    callback();
                }
            };

            $(".game-board-expand-button").click(function () {
                $(".game-board-holder").addClass("expanded");
            });
            $(".game-board-minimize-button").click(function () {
                $(".game-board-holder").removeClass("expanded");
            });

            function BuildGameDetails(object, gameNameObject) {
                scope.WriteUserStatus("Building game card for " + gameNameObject + "...", 10000);

                let gameObject = object.GameIdSource;

                var returnItem = $("<div class=\"flex-game-item-row-detail-holder\" />");
                var gameTitle = $("<div class=\"flex-game-item-row-detail-game-title\" />");
                gameTitle.append("<div class=\"flex-game-item-row-detail-game-title-text\" />").append(gameNameObject);
                var gameRefreshButton = $("<button class=\"game-board-refresh-button\" value=\"Refresh\" />");
                gameRefreshButton.append("<i class=\"fad fa-sync-alt\"></i> Refresh");
                var gameDeleteButton = $("<button class=\"game-board-delete-button button--red\" id=\"deleteGame_" + gameObject.FlexGameId + "\" values=\"Delete\" />");
                gameDeleteButton.append("<i class=\"fad fa-trash-alt\"></i>");

                $(gameRefreshButton).off("click").on("click", function () {
                    scope.WriteUserStatus("Refreshing information...", 1000);
                    scope.LoadGameBoardInline(object.GameId);
                });

                $(gameDeleteButton).off("click").on("click", function () {
                    var buttonName = this.id;
                    var id = buttonName.split('_')[1];
                    if (ConfirmDelete(id)) {
                        DeleteGame(id, function () {
                            scope.DisplayUserGameList(function () {
                                scope.HideUserStatus();
                            });
                        });
                    }
                });

                gameTitle.append(gameRefreshButton);
                if (legacyContainer.scope.TP1Role.toLowerCase() == "admin") {
                    gameTitle.append(gameDeleteButton);
                }
                //availableAnimations
                let hasAvailableAnimation = false;
                if (gameObject != null && gameObject.ThemeIdSource != null) {
                    gameAnimationName = gameObject.ThemeIdSource.AnimationName;
                    hasAvailableAnimation = (availableAnimations.findIndex(i => i.toLowerCase() == gameAnimationName.toLowerCase()) > -1);
                }
                if (hasAvailableAnimation == true && (legacyContainer.scope.TP1Username.toLowerCase() == "cjarboe" || legacyContainer.scope.TP1Username.toLowerCase() == "jfield" || legacyContainer.scope.TP1Role.toLowerCase() == "admin")) {
                    let animatedBoardButton = $("<button id=\"aniamtedBoard_" + gameObject.FlexGameId + "\"> Animation </button>");
                    $(animatedBoardButton, element).off("click").on("click", function () {
                        let buttonId = this.id;
                        let gameId = buttonId.split("_")[1];
                        let animationUrl = a$.debugPrefix() + "/3/ng/AgameFlex/AGameFlexAnimation.aspx";
                        var prefixInfo = a$.gup("prefix");
                        if (prefixInfo != null && prefixInfo != "") {
                            animationUrl += "?prefix=" + prefixInfo;
                        }
                        animationUrl += "&gameId=" + gameId;
                        let animationWindowHeight = 500;
                        let animationWindowWidth = 1000;
                        let topLocation = 50;
                        let leftLocation = 50;
                        //TODO: Work on handling of the "centering" of the
                        if (screen.height) {
                            animationWindowHeight = parseInt((screen.height * .85));
                        }
                        if (screen.width) {
                            animationWindowWidth = parseInt((screen.width * .85));
                        }
                        if (animationWindowWidth > 100) {
                            leftLocation = parseInt((screen.width - animationWindowWidth) / 2);
                        }
                        if (animationWindowHeight > 100) {
                            topLocation = parseInt((screen.height - animationWindowHeight) / 2)
                        }
                        window.open(animationUrl, "animatedBoard", "height=" + animationWindowHeight + ",width=" + animationWindowWidth + ",left=" + leftLocation + ",top=" + topLocation + ",scrollbars=no,location=no,menubar=no,toolbar=no,resizable=no");
                    });
                    gameTitle.append(animatedBoardButton);
                }

                var gameInfoDetail = $("<div class=\"flex-game-item-row-detail-list\" />");

                var supervisorName = $("<div />").append("<label class=\"flex-game-data-label\">Supervisor:</label>").append("<label class=\"flex-game-data-label-info\">" + gameObject.AdminUserIdSource.UserFullName + "</label>");

                var gameDatesCombined = new Date(gameObject.GameStartDate).toLocaleDateString("en-US") + " - " + new Date(gameObject.GameEndDate).toLocaleDateString("en-US");
                var gameFinishScore = null;
                if (gameObject.PointsToEndGame != 0 && gameObject.ThemeIdSource != null && gameObject.ThemeIdSource.RequiresEndingPointTotal == true) {
                    gameFinishScore = $("<div />").append("<label class=\"flex-game-data-label\">Finish Line Score:</label>").append("<label class=\"flex-game-data-label-info\">" + gameObject.PointsToEndGame + "</label>");
                }
                var datesDetailInfo = $("<div />").append("<label class=\"flex-game-data-label\">Dates:</label>").append("<label class=\"flex-game-data-label-info\">" + gameDatesCombined + "</label>");
                var participantsInfo = null;

                if (gameObject.GameTypeId == 2) {
                    participantsInfo = $("<div />").append("<label class=\"flex-game-data-label\">Teams:</label>").append("<label class=\"flex-game-data-label-info\">" + gameObject.ParticipatingTeams.length + "</label>");
                }
                else {
                    participantsInfo = $("<div />").append("<label class=\"flex-game-data-label\">Participants:</label>").append("<label class=\"flex-game-data-label-info\">" + gameObject.GameParticipants.length + "</label>");
                }
                let gameRewardList = gameObject.GameReward || "";
                let gameRewards = $("<div />").append("<label class=\"flex-game-data-label\">Game Rewards:</label>").append("<label class=\"flex-game-data-label-info\">" + gameRewardList + "</label>");
                gameInfoDetail.append(supervisorName);
                gameInfoDetail.append(datesDetailInfo);
                gameInfoDetail.append(participantsInfo);

                if (gameFinishScore != null) {
                    gameInfoDetail.append(gameFinishScore);
                }
                if (gameRewards != null && gameRewardList != "") {
                    gameInfoDetail.append(gameRewards);
                }


                var gameLeaderboardHolder = $("<div class=\"flex-game-item-row-leaderboard-holder\" />");
                scope.LoadGameScoringInformation(gameObject, function (gameObject, scoringList) {
                    var leaderboardInfo = BuildLeaderBoardInline(gameObject, scoringList, null);
                    gameLeaderboardHolder.append(leaderboardInfo);
                });
                returnItem.append(gameTitle);
                returnItem.append(gameInfoDetail);
                returnItem.append(gameLeaderboardHolder);

                return returnItem;
            }
            function BuildGamePhraseRow(gameObject, rowHolderObject) {
                if (gameObject.GameTypeId == 2) //team batles
                {
                    BuildPhraseRow_Team(gameObject, rowHolderObject);
                }
                else {
                    BuildPhraseRow_Agent(gameObject, rowHolderObject);
                }

            }
            function BuildPhraseRow_Agent(gameObject, rowHolderObject) {
                let gamePhrase = gameObject.GamePhraseValue;

                for (let i = 0; i < gameObject.GameLeaderboard.length; i++) {
                    let currentScore = 0;
                    let participant = gameObject.GameParticipants.find(p => p.UserId == gameObject.GameLeaderboard[i].UserId);

                    let participantRow = $("<div class=\"phrase-game-participant-row \" />");
                    let participantNameHolder = $("<div class=\"phrase-game-participating-item-name\" />");
                    let participantPhraseHolder = $("<div class=\"phrase-game-participating-item-phrase-holder\" />");

                    let participantName = participant.UserFullName;
                    participantNameHolder.append(participantName);
                    let participantScore = gameObject.GameLeaderboard[i];
                    if (participantScore != null) {
                        currentScore = participantScore.BoardPositions || 0;
                    }
                    BuildPhraseUI(gamePhrase, currentScore, participantPhraseHolder);

                    participantRow.append(participantNameHolder);
                    participantRow.append(participantPhraseHolder);

                    rowHolderObject.append(participantRow);

                }
                // for(let p = 0; p < gameObject.GameParticipants.length; p++)
                // {
                //     let currentScore = 0;
                //     let participant = gameObject.GameParticipants[p];

                //     let participantRow = $("<div class=\"phrase-game-participant-row \" />");
                //     let participantNameHolder = $("<div class=\"phrase-game-participating-item-name\" />");
                //     let participantPhraseHolder = $("<div class=\"phrase-game-participating-item-phrase-holder\" />");

                //     let participantName = participant.UserFullName;
                //     participantNameHolder.append(participantName);
                //     let participantScore = gameObject.GameLeaderboard.find(u => u.UserId == participant.UserId);
                //     if(participantScore != null)
                //     {
                //         currentScore = participantScore.BoardPositions || 0;
                //     }
                //     BuildPhraseUI(gamePhrase, currentScore, participantPhraseHolder);

                //     participantRow.append(participantNameHolder);
                //     participantRow.append(participantPhraseHolder);

                //     rowHolderObject.append(participantRow);
                // }
            }
            function BuildPhraseRow_Team(gameObject, rowHolderObject) {
                let gamePhrase = gameObject.GamePhraseValue;
                let isIntraTeamGame = (gameObject.SubGameTypeId != null && gameObject.SubGameTypeId == 2)
                let participants = null;
                let gameType = "teams"
                if (isIntraTeamGame == true) {
                    participants = gameObject.ParticipatingIntraTeams;
                    gameType = "intrateams";
                }
                else {
                    participants = gameObject.ParticipatingTeams;
                }
                if (participants != null) {
                    for (let p = 0; p < participants.length; p++) {
                        let currentScore = 0;
                        let participant = participants[p];
                        let teamId = participant.IntraTeamId || participant.TeamId;

                        let teamMembersList = null;

                        if (isIntraTeamGame == true) {
                            let intraTeam = scope.IntraTeamList.find(t => t.IntraTeamId == teamId);
                            if (intraTeam != null) {
                                teamMembersList = intraTeam.AssignedUsers;
                            }
                        }
                        let participantRow = $("<div class=\"phrase-game-participant-row\" id=\"teamGameRow_" + gameObject.FlexGameId + "_" + teamId + "\" val1=\"" + gameObject.FlexGameId + "\" val2=\"" + teamId + "\"/>");

                        $(participantRow, element).off("click").on("click", function () {
                            ToggleTeamMembersListForGame(this);
                        });
                        let participantNameHolder = $("<div class=\"phrase-game-participating-item-name\" />");
                        let participantPhraseHolder = $("<div class=\"phrase-game-participating-item-phrase-holder\" />");

                        let teamMembersHolder = $("<div class=\"phrase-game-participant-team-member-holder\" id=\"teamMembersRow_" + gameObject.FlexGameId + "_" + teamId + "\" />");

                        if (teamMembersList != null && teamMembersList.length > 0) {
                            for (let i = 0; i < teamMembersList.length; i++) {
                                let member = teamMembersList[i];

                                let teamMemberItem = $("<div class=\"phrase-game-participanting-team-member-item-holder inline-item\" />");
                                let teamMemberAvatarHolder = $("<div class=\"team-member-avatar-holder\" />");
                                let avatarUrl = "/jq/avatars/empty_headshot.png";
                                if (member.AvatarImageFileName != "") {
                                    avatarUrl = member.AvatarImageFileName;
                                }
                                else {
                                    let user = scope.AllUserProfiles.find(p => p.UserId == member.UserId);
                                    if (user != null) {
                                        if (!user.AvatarImageFileName.toLowerCase().includes("empty_headshot")) {
                                            avatarUrl = user.AvatarImageFileName;
                                        }
                                    }
                                }
                                //scrub the avatar URL
                                avatarUrl.replace("../", "");
                                avatarUrl.replace("./", "");
                                if (!avatarUrl.startsWith("/")) {
                                    avatarUrl = "/" +
                                        avatarUrl;
                                }
                                avatarUrl = a$.debugPrefix() + avatarUrl;
                                let teamMemberAvatar = $("<img class=\"team-member-avatar\" src=\"" + avatarUrl + "\" />");
                                teamMemberAvatarHolder.append(teamMemberAvatar);

                                let teamMemberName = $("<div class=\"team-member-name\" />");
                                teamMemberName.append(member.UserFullName);

                                teamMemberItem.append(teamMemberAvatarHolder);
                                teamMemberItem.append(teamMemberName);

                                teamMembersHolder.append(teamMemberItem);
                            }
                        }

                        let participantName = participant.TeamName;
                        participantNameHolder.append(participantName);
                        BuildPhraseUI(gamePhrase, currentScore, participantPhraseHolder);

                        participantRow.append(participantNameHolder);
                        participantRow.append(participantPhraseHolder);
                        participantRow.append(teamMembersHolder);

                        rowHolderObject.append(participantRow);
                    }
                }

                $(".phrase-game-participant-team-member-holder", rowHolderObject).each(function () {
                    $(this).hide();
                });

            }
            function BuildPhraseUI(gamePhrase, currentScore, holderObject) {
                scope.WriteUserStatus("Building the Phrase Interactions...", 10000);
                let score = parseInt(currentScore) || 0;

                let renderString = gamePhrase;
                let renderHtml = $("<div class=\"phrase-scoring-holder-row\" />");
                for (var i = 0; i < renderString.length; i++) {
                    let renderItem = renderString[i];
                    if (renderItem != "_") {
                        if (renderItem == " ") {
                            renderItem = "&nbsp;";
                        }
                        else {
                            renderItem = renderItem.toUpperCase()
                        }

                        let scoreItem = $("<span class=\"phrase-base-score-item\">" + renderItem + "</span>");
                        renderHtml.append(scoreItem);
                    }
                    else {
                        let spaceItem = $("<span class=\"phrase-base-space-item\">&nbsp;</span>");
                        renderHtml.append(spaceItem);
                    }
                }

                $(".phrase-base-score-item", $(renderHtml)).each(function (i) {
                    while (i < score) {
                        $(this).addClass("phrase-score-item-active");
                        i++;
                    }
                });

                let scoreInfo = $("<span class=\"phrase-scoring-current-score-number\" />");
                let renderStringRemovedSpaces = renderString.replaceAll("_", "").replaceAll(" ", "");
                scoreInfo.append(score + "/" + renderStringRemovedSpaces.length);
                scoreInfo.append(" " + ((score / renderStringRemovedSpaces.length) * 100).toFixed(0) + "%");
                renderHtml.append(scoreInfo);

                $(holderObject, element).append(renderHtml);
            }
            scope.SetupAdminPanel = function () {
                if (scope.ShowAdminPanel == true && legacyContainer.scope.TP1Role == "Admin") {
                    $(adminPanel).show();

                    $(".admin-select-user", element).empty();
                    $(".admin-select-user", element).append($('<option />', { value: "", text: "" }));
                    for (var i = 0; i < scope.PossibleUsersList.length; i++) {
                        var item = scope.PossibleUsersList[i];
                        $(".admin-select-user", element).append($('<option />', { value: item, text: item }));
                    }

                    $(".admin-select-user", element).off("change").on("change", function () {
                        var userToLoad = $(this).val();
                        scope.HideGameBoard();
                        scope.LoadUserGameList(userToLoad);
                    });
                    scope.ShowAdminPanel();
                } else {
                    scope.HideAdminPanel()
                }
            };
            scope.WriteAdminStatus = function (message, logToConsoleOnly) {
                if (logToConsoleOnly != null && logToConsoleOnly == true) {
                    console.log(message);
                }
                else {
                    var statusMessage = $(".admin-status-output").html();
                    statusMessage = message + "<br />" + statusMessage;
                    $(".admin-status-output").html(statusMessage);
                }
            };

            scope.WriteUserStatus = function (message, displayForTiming) {
                //console.log("AGAME Flex Listing: " + message);
                scope.HideUserStatus();
                $(".flex-game-user-status").html(message);
                scope.ShowUserStatus(displayForTiming);
            };

            function BuildUserProfileLink(userId) {
                var returnLinkInfo = "";

                let user = scope.AllUserProfiles.find(p => p.UserId == userId);
                if (user != null) {
                    returnLinkInfo = GetUserProfileLink(user.UserFullName, user.UserId, "flex-user-service", user.AvatarImageFileName, user.DepartmentCode);
                }
                return returnLinkInfo;
            }
            function LoadTickerForUser() {
                HideTicker();
                // GetTickerDataForUser(function (data) {
                //     WriteTickerData(data);
                // });
            }
            function GetTickerDataForUser(callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "getFlexTickerMessages"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        var tickerData = JSON.parse(data.tickerList);
                        var returnData = [];
                        if (tickerData != null) {
                            for (var i = 0; i < tickerData.length; i++) {
                                returnData.push(tickerData[i]);
                            }
                        }
                        if (callback != null) {
                            callback(returnData);
                        }
                    }
                });
            }
            function WriteTickerData(tickerItems) {
                if (tickerItems != null) {
                    $(".flex-game-ticker", element).empty();

                    for (var i = 0; i < tickerItems.length; i++) {
                        let item = tickerItems[i];

                        var tickerItem = $("<div class=\"ticker-item\" />");
                        tickerItem.append(item.Message);

                        $(".flex-game-ticker", element).append(tickerItem);
                    }
                    if (tickerItems.length > 0) {
                        let timingTotal = 60;
                        if ($(".flex-game-ticker").width() < $(window).width()) {
                            $(".flex-game-ticker").width($(window).width());
                        }
                        else {
                            timingTotal = ($(".flex-game-ticker").width() / 15);
                            if (timingTotal > 120) {
                                timingTotal = 120;
                            }
                        }
                        timingTotal = timingTotal + "s";
                        $(".flex-game-ticker").css({ "animation-duration": timingTotal, "-webkit-animation-duration": timingTotal });
                    }
                }

            }
            function DeleteGame(gameId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
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
                            callback(data);
                        }
                    }
                });
            }

            function BuildGameCardForDisplay(gameObject, rowHolderObject) {
                let item = gameObject;
                let themeTagName = "";

                let gameItemTabHolder = $("<div class=\"flex-game-game-item-tab-holder\" id=\"gameDetailsTabHolder_" + item.GameId + "\" />");
                let gameChatTabHolder = $("<div class=\"flex-game-game-chat-tab-holder\" id=\"gameChatTabHolder_" + item.GameId + "\" />");
                let gamePrizesTabHolder = $("<div class=\"flex-game-game-prize-tab-holder\" id=\"gamePrizeTabHolder_" + item.GameId + "\" />");


                scope.WriteUserStatus("Rendering game card for " + item.GameName + "...", 10000);

                // if (item.GameIdSource.ThemeIdSource.ThemeTypeId != 3) {
                    let gameItemHolder = $("<div class=\"flex-game-game-items-holder\" />");
                    let gameTheme = $("<div class=\"flex-game-game-theme\" id=\"GameTheme_" + item.GameId + "\" />");
                    if (item.GameIdSource != null && item.GameIdSource.ThemeIdSource != null) {
                        let gameThemeBackground =
                            item.GameIdSource.ThemeIdSource.ThemeBoardDisplayImageName ||
                            item.GameIdSource.ThemeIdSource.ThemeLeaderboardDisplayImageName ||
                            null;

                        if (gameThemeBackground != null && gameThemeBackground != "") {
                            gameTheme.css("background-image", "url('" + window.location.protocol + "//" + window.location.hostname + gameThemeBackground + "')");
                        }
                        let gameThemeTypeName = "";
                        if (item.GameIdSource.ThemeIdSource.ThemeTypeIdSource != null) {
                            gameThemeTypeName = item.GameIdSource.ThemeIdSource.ThemeTypeIdSource.Name;
                        }
                        else {
                            gameThemeTypeName = "Unknown";
                        }
                        if (item.GameIdSource.ThemeIdSource != null && item.GameIdSource.ThemeIdSource.ThemeTagName != "") {
                            themeTagName = item.GameIdSource.ThemeIdSource.ThemeTagName;
                        }

                        let gameScoringRangesTable = null;
                        if (item.GameIdSource.ThemeIdSource.ThemeTypeIdSource != null && item.GameIdSource.ThemeIdSource.ThemeTypeIdSource.ThemeTypeId != 1 &&
                            item.GameIdSource.ScoringRange != null && item.GameIdSource.ScoringRange.length > 0) {
                            gameScoringRangesTable = $("<div class=\"flex-game-game-scoring-holder-card\" />");
                            let scoringRangesTable = $("<table class=\"flex-game-game-scoring-card-table\"/>");
                            let scoringRangesTableHeaderRow = $("<tr class=\"flex-game-game-scoring-card-table-row\"/>");
                            let scoringRangesTableHeaderPointsColumn = $("<td  class=\"flex-game-game-scoring-card-points card-table-header\"/>");
                            scoringRangesTableHeaderPointsColumn.append("Points");
                            let scoringRangesTableHeaderLowColumn = $("<td class=\"flex-game-game-scoring-card-low card-table-header\"/>");
                            scoringRangesTableHeaderLowColumn.append("Low");
                            let scoringRangesTableHeaderHighColumn = $("<td  class=\"flex-game-game-scoring-card-high card-table-header\"/>");
                            scoringRangesTableHeaderHighColumn.append("High");

                            scoringRangesTableHeaderRow.append(scoringRangesTableHeaderPointsColumn);
                            scoringRangesTableHeaderRow.append(scoringRangesTableHeaderLowColumn);
                            scoringRangesTableHeaderRow.append(scoringRangesTableHeaderHighColumn);
                            scoringRangesTable.append(scoringRangesTableHeaderRow);

                            for (var r = 0; r < item.GameIdSource.ScoringRange.length; r++) {
                                let scoreRangeItem = item.GameIdSource.ScoringRange[r];
                                let rangeRow = $("<tr class=\"flex-game-game-scoring-card-table-row\"/>");
                                let pointsColumn = $("<td class=\"flex-game-game-scoring-card-points card-table-item\"/>");
                                pointsColumn.append(scoreRangeItem.Points);
                                let lowColumn = $("<td class=\"flex-game-game-scoring-card-points card-table-item\"/>");
                                lowColumn.append(scoreRangeItem.Range1Low);
                                let highColumn = $("<td class=\"flex-game-game-scoring-card-points card-table-item\"/>");
                                highColumn.append(scoreRangeItem.Range1High);

                                rangeRow.append(pointsColumn);
                                rangeRow.append(lowColumn);
                                rangeRow.append(highColumn);

                                scoringRangesTable.append(rangeRow);
                            }

                            gameScoringRangesTable.append(scoringRangesTable);

                        }
                        gameTheme.append("<label class=\"flex-game-game-theme-type-name\"> Game Type: " + gameThemeTypeName + "</label>");
                        gameTheme.append(gameScoringRangesTable);
                    }
                    $(gameTheme).off("click").on("click", function () {
                        let iteamId = this.id;
                        let id = iteamId.split('_')[1];
                        scope.WriteUserStatus("Loading game board information...", 50000);
                        scope.LoadGameBoard(id, function () {
                            scope.ShowGameBoard();
                        });
                    });

                    let gameName = $("<div class=\"flex-game-game-item-game-name\" />");
                    if (item.CurrentRankForGame == 1) {
                        let trophyMarkingHolder = $("<div class=\"flex-game-game-list-trophy-holder\"  title=\"Current Leader\" />");

                        if (item.GameIdSource.Status == "F") {
                            trophyUrl = scope.WinnerTrophyUrl;
                        } else {
                            trophyUrl = scope.CurrentLeaderTrophyUrl;
                        }

                        let trophyHolderItem = $("<i />");
                        trophyHolderItem.addClass("fas fa-star trophy-icon trophy-icon--gold");

                        trophyMarkingHolder.append(trophyHolderItem);

                        trophyMarkingHolder.append("&nbsp;");
                        gameName.append(trophyMarkingHolder);
                    } else if (item.CurrentRankForGame == 2) {
                        let trophyMarkingHolder = $("<div class=\"flex-game-game-list-trophy-holder\" title=\"Silver Trophy\" />");

                        let trophyHolderItem = $("<i />");
                        trophyHolderItem.addClass("fad fa-trophy-alt trophy-icon trophy-icon--silver");
                        trophyMarkingHolder.append(trophyHolderItem);
                        trophyMarkingHolder.append("&nbsp;");

                        gameName.append(trophyMarkingHolder);
                    }

                    gameName.append(item.GameName);

                    let scoringMetric = $("<div class=\"flex-game-game-item-game-metric\" />");
                    scoringMetric.append("Game Metric: ");

                    if (item.SubKpiName != null && item.SubKpiName != "") {
                        scoringMetric.append("<span>" + item.ScoringMetric + ": <div class=\"subkpi\">" + item.SubKpiName + "</div></span>");
                    }
                    else {
                        scoringMetric.append("<span>" + item.ScoringMetric + "</span>");
                    }

                    let userScoreTotal = $("<div class=\"flex-game-game-item-user-score-total\" />");
                    let userStanding = $("<div class=\"flex-game-game-item-user-standing\" />");
                    let standingText;

                    if (item.UserIsGameAdmin == false && item.CurrentRankForGame != 0) {
                        let currentScore = item.UserScoreTotal;
                        if(item.GameIdSource.AcuityKpiMqfId == 0)
                        {
                            currentScore = item.UserScoreAverage;
                        }
                        currentScore = currentScore.toFixed(2);
                        userScoreTotal.append("Score: " + "<span>" + currentScore + "</span>");

                        standingText = "Rank " + "<span>" + item.CurrentRankForGame + " of " + item.TotalPlayersInGame + "</span>";
                    } else {
                        userScoreTotal = null;
                        standingText = "Total Participants: " + "<span>" + item.TotalPlayersInGame + "</span>";
                    }
                    userStanding.append(standingText);
                    let gameStatus = $("<div class=\"flex-game-game-item-game-status\" />");
                    gameStatus.append("Status: ");
                    gameStatus.append(item.GameStatusName);
                    gameStatus.addClass(item.GameStatusName.replace(/\s/g, ''));

                    let gameDates = $("<div class=\"flex-game-game-item-game-dates\" />");
                    if (item.GameIdSource != null) {
                        let endDate = new Date(item.GameIdSource.GameEndDate).toLocaleDateString("en-US");

                        let dateString;
                        switch (item.GameIdSource.Status) {
                            case "C":
                                dateString = "Ended on " + "<span>" + endDate + "</span>"
                                break;
                            case "F":
                                dateString = "Ended on " + "<span>" + endDate + "</span>"
                                break;
                            case "P":
                                if (item.DaysUntilEndOfGame == 0) {
                                    $(gameItemHolder).addClass("ends-today");
                                    dateString = "<i class=\"fas fa-exclamation-triangle\"></i> " + "Ends Today";
                                } else if (item.DaysUntilEndOfGame == 1) {
                                    dateString = "Ends <span>tomorrow</span>";
                                } else if (item.DaysUntilEndOfGame >= 7) {
                                    dateString = "Ends on " + "<span>" + endDate + "</span>";
                                } else {
                                    dateString = "Ends in " + "<span>" + item.DaysUntilEndOfGame + " day(s)" + "</span>";
                                }

                                break;
                        }
                        gameDates.append(dateString);
                    } else {
                        gameDates = null;
                    }

                    let gameLinkOptions = $("<div class=\"flex-game-game-list-button-holder\" />");

                    if (item.UserIsGameAdmin) {
                        let prefixInfo = a$.gup("prefix");
                        let linkReference = scope.AdminLinkUrl + "?gameid=" + item.GameId;

                        if (prefixInfo != null && prefixInfo != "") {
                            linkReference += "&prefix=" + prefixInfo;
                        }
                        let flexGameAdminLink = $("<a href=\"" + linkReference + "\" class=\"admin-link\" title=\"Edit Admin Settings\"><i class=\"fad fa-edit\"></i></a>");
                        gameName.append("&nbsp;");
                        gameName.append(flexGameAdminLink);
                    }


                    let gameType = $("<div class=\"flex-game-game-item-game-type\" />");
                    gameType.append("Game Battle Type: ");
                    gameType.append("<span>" + item.GameIdSource.GameTypeIdSource.GameTypeName + "</span>");

                    gameItemHolder.append(gameTheme);
                    gameItemHolder.append(gameStatus);
                    gameItemHolder.append(userStanding);
                    gameItemHolder.append(gameDates);
                    gameItemHolder.append(userScoreTotal);
                    gameItemHolder.append(scoringMetric);
                    gameItemHolder.append(gameType);
                    gameItemHolder.append($("<br class=\"clearfix\"/>"));
                    gameItemHolder.append(gameLinkOptions);
                    gameItemHolder.append($("<br class=\"clearfix\"/>"));

                    gameItemTabHolder.append(gameItemHolder);


                    let gameDetails = BuildGameDetails(item, gameName);
                    gameItemTabHolder.append(gameDetails);

                    rowHolderObject.append(gameItemTabHolder);
                // }
                // else {
                //     BuildPhraseGameGameCard(item, rowHolderObject);
                // }

                if (item.GameIdSource != null && item.GameIdSource.HasDiscussionBoard == true) {
                    scope.WriteUserStatus("Building chat panel for " + item.GameName + "...", 10000);
                    BuildChatPanel(item, gameChatTabHolder);
                }
                if (item.GameIdSource != null && (item.GameIdSource.HasPrizeOptions == true || item.GameIdSource.HasSpinnerOptions == true)) {
                    BuildPrizesPanel(item, gamePrizesTabHolder);
                }

                rowHolderObject.append(gameChatTabHolder);
                rowHolderObject.append(gamePrizesTabHolder);

                if (themeTagName != "") {
                    rowHolderObject.addClass(themeTagName);

                    gameItemTabHolder.addClass(themeTagName);
                    gameChatTabHolder.addClass(themeTagName);
                    gamePrizesTabHolder.addClass(themeTagName);
                }

                AddTabsToGameRow(item, rowHolderObject);
            }

            function AddTabsToGameRow(dataItem, gameRowHolder) {
                let tabsHolder = $("<div class=\"card-tabs\" id=\"cardTabsHolder_" + dataItem.GameId + "\" />");
                let gameIcon = $("<a class=\"card-tab_game\" />");
                gameIcon.append("<i class=\"fas fa-crown\"></i>");
                $(gameIcon, gameRowHolder).off("click").on("click", function () {
                    HandleGameTabClick("game", dataItem.GameId, this);
                });
                let chatIcon = $("<a class=\"card-tab_chat\" />");
                chatIcon.append("<i class=\"fas fa-comments\"></i>");
                $(chatIcon, gameRowHolder).off("click").on("click", function () {
                    HandleGameTabClick("chat", dataItem.GameId, this);
                });

                let prizesIcon = $("<a class=\"card-tab_prizes\" />");
                prizesIcon.append("<i class=\"fas fa-gift\"></i>");
                $(prizesIcon, gameRowHolder).off("click").on("click", function () {
                    HandleGameTabClick("prize", dataItem.GameId, this);
                    HandleSpinnerDisplay(dataItem.GameId);
                });

                tabsHolder.append(gameIcon);
                if (dataItem.GameIdSource != null && dataItem.GameIdSource.HasDiscussionBoard == true) {
                    tabsHolder.append(chatIcon);
                }
                if (dataItem.GameIdSource != null && (dataItem.GameIdSource.HasPrizeOptions == true || dataItem.GameIdSource.HasSpinnerOptions == true)) {
                    tabsHolder.append(prizesIcon);
                }
                gameRowHolder.append(tabsHolder);
            }
            function HandleGameTabClick(tabClicked, gameId, objectClicked) {
                $("[class^='card-tab_']", $(".card-tabs", $(objectClicked).parent().parent())).each(function () {
                    $(this).removeClass("active");
                });
                HideGameRowTab("all", gameId);
                ShowGameRowTab(tabClicked, gameId);
            }
            function BuildChatPanel(dataItem, chatHolderPanel) {

                let gameObject = dataItem.GameIdSource;
                let gameChatHolder = $("<div class=\"flex-game-chat-holder-item\" />");
                if (gameObject != null) {
                    let chatInfo = "<ng-acuity-discussion context=\"FlexGame\" gameid=\"" + gameObject.FlexGameId + "\"></ng-acuity-discussion>";
                    let chatElement = $compile(chatInfo)(scope);

                    angular.element(gameChatHolder).empty().append(chatElement);
                }
                else {
                    gameChatHolder.append("No game found to load the chat for.");
                }
                chatHolderPanel.append(gameChatHolder);
            }
            function BuildPrizesPanel(dataItem, prizeHolderPanel) {
                let gameObject = dataItem.GameIdSource;
                let gameId = dataItem.GameId;
                let themeTagName = "";
                let gameRewardHolder = $("<div class=\"rewards-panel-option-info-holder\" />");
                let gameSpinnerHolder = $("<div class=\"spinner-panel-option-info-holder\" />");
                let hasPrizeOption = gameObject.HasPrizeOptions;
                //spinner options are off for now.
                let hasSpinnerOption = false;//gameObject.HasSpinnerOptions;
                let gamePrizeHeader = $("<div class=\"flex-game-prize-holder-header\" />");
                let baseHeaderText = "Prize Rewards and Options";
                let headerTextInfo = $("<div class=\"flex-game-prize-card-header-text\" />");
                if (gameObject != null) {
                    if (gameObject.ThemeIdSource != null) {
                        themeTagName = gameObject.ThemeIdSource.themeTagName;
                    }
                    headerTextInfo.append(baseHeaderText + " for " + gameObject.Name);
                    //spinner options are off for now.
                    //hasSpinnerOption = (gameObject.HasSpinnerOptions == true);
                }
                prizeHolderPanel.append(headerTextInfo);

                if (hasPrizeOption == true) {
                    RenderRewardOptionsPanel(gameObject, gameRewardHolder);
                    if (hasSpinnerOption == true) {
                        gameRewardHolder.addClass("column1of2");
                    }
                    prizeHolderPanel.append(gameRewardHolder);
                }

                if (hasSpinnerOption == true) {
                    if (gameObject.SpinnerOptions?.length > 0) {
                        let prizeOptionHolder = $("<div class=\"flex-game-prize-holder-item " + themeTagName + "\" id=\"prizeSpinner_" + gameId + "\" />");
                        let prizeOptionButtonsHolder = $("<div class=\"flex-game-prize-options-button-holder " + themeTagName + "\" />");
                        let claimDateHolder = $("<div class=\"flex-game-prize-options-claim-date-holder " + themeTagName + "\" />");
                        let claimDateLabel = $("<label id=\"userRewardClaimDate_" + gameId + "\" />");
                        claimDateHolder.append(claimDateLabel);
                        let prizeRollerUserOptionHolder = $("<div class=\"flex-game-prize-roller-user-option-holder\" id=\"prizeRollerUserOptionHolder_" + gameId + "\" />");
                        let userToAssignTo = $("<select id=\"prizeAssignTo_" + gameId + "\" />");
                        let isCurrentUserIdInList = false;
                        if (gameObject != null && gameObject.GameParticipants.length != 0) {
                            userToAssignTo.append($("<option />"));

                            for (let u = 0; u < gameObject.GameParticipants.length; u++) {
                                let user = gameObject.GameParticipants[u];
                                let userOption = $("<option value=\"" + user.UserId + "\">" + user.UserFullName + "</option>");
                                if (user.UserId == legacyContainer.scope.TP1Username) {
                                    isCurrentUserIdInList = true;
                                }
                                userToAssignTo.append(userOption);
                            }
                        }

                        $(userToAssignTo, element).off("change").on("change", function () {
                            ClearActiveSpinnerItemClass(gameId);
                            EnableSpinnerButton(null, gameId);
                        });


                        if (isCurrentUserIdInList == true) {
                            userToAssignTo.val(legacyContainer.scope.TP1Username);
                            EnableSpinnerButton(null, gameId, legacyContainer.scope.TP1Username);
                        }
                        else {
                            let value = $(userToAssignTo, element).prop("selectedIndex", 0);
                            userToAssignTo.val(value.val());
                        }
                        if (gameObject != null && gameObject.AdminUserId == legacyContainer.scope.TP1Username) {
                            userToAssignTo.prop("disabled", false);
                        }
                        else {
                            userToAssignTo.prop("disabled", true);
                        }

                        RenderGameRewardOptionsButtons(prizeOptionButtonsHolder, gameId);

                        prizeOptionButtonsHolder.append(claimDateHolder);

                        prizeRollerUserOptionHolder.append("<label class=\"spinner-for-label " + themeTagName + "\">Participant to Spin/Roll for ➜</label>");
                        prizeRollerUserOptionHolder.append(userToAssignTo);

                        gamePrizeHeader.append(prizeRollerUserOptionHolder);

                        GetPossiblePrizesForGame(prizeOptionHolder, gameId, function () {
                            gameSpinnerHolder.append(gamePrizeHeader);
                            gameSpinnerHolder.append("<div class=\"clearfix\"></div>");
                            gameSpinnerHolder.append(prizeOptionButtonsHolder);
                            gameSpinnerHolder.append(prizeOptionHolder);
                            gameSpinnerHolder.append("<div class=\"clearfix\"></div>");
                        });
                        if (themeTagName != "") {
                            gamePrizeHeader.addClass(themeTagName);
                            prizeOptionHolder.addClass(themeTagName);
                        }
                    }
                    else {
                        gameSpinnerHolder.append("Spinner coming soon&trade;");
                    }
                    if (hasPrizeOption == true) {
                        gameSpinnerHolder.addClass("column2of2");
                    }
                    prizeHolderPanel.append(gameSpinnerHolder);
                }
            }
            function BuildPhraseGameGameCard(dataItem, rowHolderObject) {
                let gameObject = dataItem.GameIdSource;
                let gameItemTabHolder = $("<div class=\"flex-game-game-item-tab-holder\" id=\"gameDetailsTabHolder_" + gameObject.FlexGameId + "\" />");
                let currentThemeName = "";
                if (gameObject.ThemeIdSource != null) {
                    currentThemeName = gameObject.ThemeIdSource.ThemeTagName;
                }

                let gameCard = $("<div class=\"flex-game-game-card " + currentThemeName + "\" />");
                let gameCardHeaderHolder = $("<div class=\"flex-game-game-card-header-holder " + currentThemeName + "\" />");
                let gameCardHeaderLeft = $("<div class=\"flex-game-game-card-header-left " + currentThemeName + "\"/>");
                let gameCardHeaderRight = $("<div class=\"flex-game-game-card-header-right " + currentThemeName + "\"/>");
                let gameCardGameName = $("<div class=\"flex-game-game-card-game-name " + currentThemeName + "\" />");
                gameCardGameName.append(dataItem.GameName);
                let gameCardGameInformation = $("<div class=\"flex-game-game-card-game-information " + currentThemeName + "\" />");
                let supervisorName = gameObject.AdminUserIdSource.UserFullName || gameObject.AdminUserId || "";
                let supervisorLabel = $("<div class=\"flex-game-data-label " + currentThemeName + "\" />");
                supervisorLabel.append("Supervisor:");
                let gameDatesLabel = $("<div class=\"flex-game-data-label " + currentThemeName + "\" />");
                gameDatesLabel.append("Game Dates:");
                let participantsLabel = $("<div class=\"flex-game-data-label " + currentThemeName + "\" />");
                participantsLabel.append("Total Participants:");
                let gameRewardsLabel = $("<div class=\"flex-game-data-label " + currentThemeName + "\" />");
                gameRewardsLabel.append("Game Rewards:");
                let gameMetricLabel = $("<div class=\"flex-game-data-label " + currentThemeName + "\" />");
                gameMetricLabel.append("Game Metric:");

                let gameDates = new Date(gameObject.GameStartDate).toLocaleDateString("en-US") + " - " + new Date(gameObject.GameEndDate).toLocaleDateString("en-US");;
                let totalParticipants = gameObject.GameParticipants.length || 0;
                let gameRewardsList = gameObject.GameReward || "";
                let gameMetricName = "";

                if (gameObject.SubKpiName != "" && item.SubKpiName != "") {
                    gameMetricName = $("<span>" + gameObject.GameKpiName + ": <div class=\"subkpi\">" + gameObject.SubKpiName + "</div></span>");
                }
                else {
                    gameMetricName = $("<span>" + gameObject.GameKpiName + "</span>");
                }

                gameCardGameInformation.append(supervisorLabel);
                gameCardGameInformation.append($("<label class=\"flex-game-data-label-info " + currentThemeName + "\" />").append(supervisorName));
                gameCardGameInformation.append(gameDatesLabel);
                gameCardGameInformation.append($("<label class=\"flex-game-data-label-info " + currentThemeName + "\" />").append(gameDates));
                gameCardGameInformation.append(participantsLabel);
                gameCardGameInformation.append($("<label class=\"flex-game-data-label-info " + currentThemeName + "\" />").append(totalParticipants));

                gameCardGameInformation.append(gameMetricLabel);
                gameCardGameInformation.append($("<label class=\"flex-game-data-label-info " + currentThemeName + "\" />").append(gameMetricName));

                if (gameRewardsList != "") {
                    gameCardGameInformation.append(gameRewardsLabel);
                    gameCardGameInformation.append($("<label class=\"flex-game-data-label-info " + currentThemeName + "\" />").append(gameRewardsList));
                }


                gameCardHeaderLeft.append(gameCardGameName);
                gameCardHeaderLeft.append(gameCardGameInformation);

                let gameCardButtonHolder = $("<div class=\"inline-holder\"/>");
                let gameCardDeleteButton = $("<button class=\"button--red " + currentThemeName + "\" id=\"deleteGame_" + gameObject.FlexGameId + "\" values=\"Delete\" />");
                gameCardDeleteButton.append("<i class=\"fad fa-trash-alt\"></i>");
                $(gameCardDeleteButton, element).off("click").on("click", function () {
                    let buttonId = this.id;
                    let gameId = buttonId.split("_")[1];

                    if (ConfirmDelete(gameId)) {
                        DeleteGame(gameId, function () {
                            scope.DisplayUserGameList(function () {
                                scope.HideUserStatus();
                            });
                        });
                    }

                });

                let gameCardRefreshButton = $("<button class=\"game-board-refresh-button " + currentThemeName + "\" id=\"RefreshGame_" + gameObject.FlexGameId + "\" value=\"Refresh\" />");
                gameCardRefreshButton.append("<i class=\"fad fa-sync-alt\"></i> Refresh");

                $(gameCardRefreshButton, element).off("click").on("click", function () {
                    let buttonId = this.id;
                    let gameId = buttonId.split("_")[1];
                    scope.WriteUserStatus("Refreshing information...", 1000);
                    scope.LoadGameBoardInline(gameId);
                });

                if (legacyContainer.scope.TP1Role.toLowerCase() == "admin") {
                    gameCardButtonHolder.append(gameCardDeleteButton);
                }

                gameCardButtonHolder.append(gameCardRefreshButton);
                gameCardHeaderRight.append(gameCardButtonHolder);

                gameCardHeaderHolder.append(gameCardHeaderLeft);
                gameCardHeaderHolder.append(gameCardHeaderRight);

                let gameStatus = $("<div class=\"flex-game-game-item-game-status " + currentThemeName + "\" />");
                gameStatus.append("Status: ");
                gameStatus.append(dataItem.GameStatusName);
                gameStatus.addClass(dataItem.GameStatusName.replace(/\s/g, ''));
                gameCardHeaderHolder.append(gameStatus);


                let gameCardBodyHolder = $("<div class=\"flex-game-game-card-body-holder " + currentThemeName + "\" id=\"flexGameHolder_" + gameObject.FlexGameId + "\" />");

                $(gameCardBodyHolder, element).off("click").on("click", function () {
                    let id = this.id;
                    let gameId = id.split("_")[1];
                    scope.LoadGameBoard(gameId);
                });

                let gameCardFooterHolder = $("<div class=\"flex-game-game-card-footer-holder " + currentThemeName + "\" />");



                let gameCardBodyInfo = $("<div class=\"flex-game-game-card-body-list " + currentThemeName + "\" />");
                BuildGamePhraseRow(gameObject, gameCardBodyInfo);


                gameCardBodyHolder.append(gameCardBodyInfo);


                gameCard.append(gameCardHeaderHolder);
                gameCard.append(gameCardBodyHolder);
                gameCard.append(gameCardFooterHolder);

                gameItemTabHolder.append(gameCard);

                rowHolderObject.append(gameItemTabHolder);
            }
            function ConfirmDelete(gameId, callback) {
                let returnValue = false;
                let game = scope.UserGameList.find(g => g.GameId == parseInt(gameId));
                let gameName = "";
                let confirmText = "Are you sure you wish to delete the game?";
                if (game != null) {
                    gameName = game.GameName;
                }
                if (gameName != null && gameName != "") {
                    confirmText = "You are about to delete the game named:\n";
                    confirmText += gameName + "\n";
                    confirmText += "Press OK to delete or CANCEL to leave game available.";
                }

                returnValue = confirm(confirmText);
                if (callback) {
                    callback(returnValue);
                }

                return returnValue;
            }
            function ToggleTeamMembersListForGame(participantRow) {
                let rowObject = $(participantRow);
                if (rowObject != null) {
                    if ($(".phrase-game-participant-team-member-holder", rowObject).is(":visible")) {
                        $(".phrase-game-participant-team-member-holder", rowObject).hide();
                    }
                    else {
                        $(".phrase-game-participant-team-member-holder", rowObject).show();
                    }

                }
            }
            function MarkCurrentDisplaySelector(id) {
                $(".game-display-selector", element).each(function () {
                    $(this).removeClass("active");
                });

                $("#" + id, element).addClass("active");
            }

            /* Rewards Handling start*/
            function GetPossiblePrizesForGame(prizeHolderPanel, gameId, callback) {
                LoadPossiblePrizesForGame(gameId, function (prizeListToRender) {
                    RenderPossiblePrizesForGame(prizeHolderPanel, prizeListToRender, gameId, function () {
                        if (callback != null) {
                            callback();
                        }
                    });
                });
            }
            function LoadPossiblePrizesForGame(gameId, callback) {
                scope.WriteUserStatus("Gathering possible prize list...");
                let gameObject = null;
                if (scope.UserGameList != null && gameId != null) {
                    gameObject = scope.UserGameList.find(g => g.GameId == gameId).GameIdSource;
                    if (gameObject == null) {
                        gameObject = GetGameById(gameId);
                    }
                }
                let prizeOptions = [];
                if (gameObject?.SpinnerOptions?.length > 0) {
                    prizeOptions = gameObject.SpinnerOptions;
                }
                if (prizeOptions.length == 0) {
                    scope.HideUserStatus();
                    if (callback != null) {
                        callback(prizeOptions);
                    }
                    //TODO: Determine what we do with no prize options.
                    //currently we will return nothing?  Do we have a set of
                    //default options to display?
                    // a$.ajax({
                    //     type: "POST",
                    //     service: "C#",
                    //     async: false,
                    //     data: {
                    //         lib: "flex",
                    //         cmd: "getPossibleManualRewardsForGame",
                    //         gameid: gameId
                    //     },
                    //     dataType: "json",
                    //     cache: false,
                    //     error: a$.ajaxerror,
                    //     success: function (data) {
                    //         prizeOptions = JSON.parse(data.possibleManualRewards);
                    //         scope.HideUserStatus();
                    //         if (callback != null) {
                    //             callback(prizeOptions);
                    //         }
                    //     }
                    // });
                }
                else {
                    if (callback != null) {
                        callback(prizeOptions);
                    }
                    else {
                        return prizeOptions;
                    }
                }
            }
            function RenderPossiblePrizesForGame(prizeDisplayPanel, prizeListToDisplay, gameId, callback) {
                $(prizeDisplayPanel, element).empty();
                let spinnerPrizeCountHolder = $("<input type=\"hidden\" id=\"spinnerPrizeCount_" + gameId + "\" >");
                $(prizeDisplayPanel, element).append(spinnerPrizeCountHolder);

                let gameObject = scope.UserGameList.find(g => g.GameId == gameId)?.GameIdSource;

                if (gameObject == null) {
                    gameObject = GetGameById(gameId);
                    prizeListToDisplay = gameObject.SpinnerOptions;
                }

                $(spinnerPrizeCountHolder, element).val(prizeListToDisplay.length);
                //spinner options are off for now
                // if (gameObject.HasSpinnerOptions == true) {
                //     for (let sc = 0; sc < prizeListToDisplay.length; sc++) {
                //         let item = prizeListToDisplay[sc];

                //         let prizeHolder = $("<div class=\"spinner-item-holder\"  />");
                //         prizeHolder.attr("value", item.FlexGameSpinnerOptionId);
                //         prizeHolder.attr("prizeid", item.ClientPrizeOptionId);
                //         prizeHolder.attr("itemIndex", sc);
                //         let prizeOption = null;
                //         let prizeName = item.RewardName;
                //         if (item.ClientPrizeOptionIdSource != null) {
                //             prizeOption = item.ClientPrizeOptionIdSource;
                //         }
                //         if (prizeOption == null) {
                //             prizeOption = possiblePrizeOptions.find(o => o.Client = item.Client && o.PrizeOptionId == item.ClientPrizeOptionId);
                //         }

                //         let imageUrl = defaultPrizeUrl;
                //         if (prizeOption != null) {
                //             imageUrl = basePrizeUrl + prizeOption.PrizeImageUrl;
                //             prizeName = prizeOption.PrizeOptionName;
                //         }

                //         let prizeNameHolder = $("<div class=\"flex-game-prize-option prize-name\" />");

                //         prizeNameHolder.css("background-image", "url('" + imageUrl + "')");
                //         prizeNameHolder.append("<span>" + prizeName + "</span>");

                //         prizeHolder.append(prizeNameHolder);

                //         prizeDisplayPanel.append(prizeHolder);

                //     }
                // }
                //else
                //{
                // if (prizeListToDisplay != null && prizeListToDisplay.length > 0) {
                //     for (let p = 0; p < prizeListToDisplay.length; p++) {
                //         let item = prizeListToDisplay[p];
                //         //let prizeHolder = $("<div id=\"prizeOptionItemHolder_" + item.Id + "\" class=\"spinner-item-holder\"  />");
                //         let prizeHolder = $("<div class=\"spinner-item-holder\"  />");
                //         prizeHolder.attr("value", item.ManualRewardId);
                //         prizeHolder.attr("itemIndex", p);
                //         let imageUrl = "/3/ng/agameflex/images/prize-images/default.jpg";
                //         if (item.ImageUrl != null && item.ImageUrl != "") {
                //             imageUrl = item.ImageUrl;
                //         }

                //         let prizeNameHolder = $("<div class=\"flex-game-prize-option prize-name\" />");

                //         prizeNameHolder.css("background-image", "url('" + imageUrl + "')");
                //         let prizeName = item.RewardName;

                //         prizeNameHolder.append("<span>" + prizeName + "</span>");

                //         prizeHolder.append(prizeNameHolder);

                //         prizeDisplayPanel.append(prizeHolder);
                //     }
                // }
                //}
                if (prizeListToDisplay != null && prizeListToDisplay.length == 0) {
                    $(prizeDisplayPanel).append("Spinner options not available.");
                }

                if (callback != null) {
                    callback();
                }
            }
            function RenderGameRewardOptionsButtons(panelToAddButtonsTo, gameIdToAssign) {
                let rollButton = $("<button class=\"flex-game-prize-button-spinroll\" id=\"prizeOptionSpinner_" + gameIdToAssign + "\">Roll/Spin</button>");

                $(rollButton, element).off("click").on("click", function () {
                    let buttonId = this.id;
                    let gameId = buttonId.split("_")[1];
                    DisableSpinnerButton(rollButton, gameId);
                    DoGameRoll(gameId, function () {
                        EnableSpinnerButton(rollButton, gameId);
                    });
                });

                panelToAddButtonsTo.empty();
                panelToAddButtonsTo.append(rollButton);
            }
            function LoadCurrentAssignedRewardsForGame(gameId) {
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
                    error: a$.ajaxerror,
                    success: function (data) {
                        let assignments = JSON.parse(data.manualRewardAssignments);
                        scope.CurrentAssignedRewards.length = 0;
                        scope.CurrentAssignedRewards = assignments;
                        return assignments;
                    }
                });
            }
            function DoGameRoll(gameId, callback) {
                if (scope.CurrentAssignedRewards.length == 0) {
                    LoadCurrentAssignedRewardsForGame(gameId);
                }
                StartRoll(gameId, function (winningValue, userId) {
                    EndRoll(winningValue, userId, gameId, function () {
                        if (callback != null) {
                            callback();
                        }
                    });
                });
            }
            function StartRoll(gameId, callback) {
                let userId = $("#prizeAssignTo_" + gameId, element).val();
                if (userId == null || userId == "") {
                    alert("You must select a user");
                    return false;
                }
                let game = GetGameById(gameId);
                let currentOptionCount = 0;
                let spinnerCurrentCount = 0;
                let maxOptionsCount = parseInt($("#spinnerPrizeCount_" + gameId, element).val()) || 0;
                let spinnerMaxCount = 5;
                let winningOptionValueIndex = parseInt(Math.floor(Math.random() * maxOptionsCount)); //generate a random winning item.
                let winningOptionValue = $(".spinner-item-holder[itemIndex='" + winningOptionValueIndex + "']", $("#prizeSpinner_" + gameId, element)).attr("prizeid") || -1;
                if (scope.CurrentAssignedRewards.length == null ||
                    (scope.CurrentAssignedRewards.filter(g => g.GameId == gameId) != null
                        && scope.CurrentAssignedRewards.filter(g => g.GameId == gameId).length == 0)
                ) {
                    LoadCurrentAssignedRewardsForGame(gameId);
                }
                let winningOption = scope.CurrentAssignedRewards.find(r => r.UserId == userId && r.GameId == gameId);
                if (winningOption != null) {
                    if (winningOption.ManualRewardId != null && winningOption.ManualRewardId > 0) {
                        winningOptionValue = winningOption.ManualRewardId;
                        winningOptionValueIndex = $(".spinner-item-holder[prizeid='" + winningOptionValue + "']", $("#prizeSpinner_" + gameId, element)).attr("itemIndex");
                    }
                }

                let showWinningOption = false;
                $("#spinnerLoopNumber", element).val(0);
                let timer = setInterval(function () {
                    if (spinnerCurrentCount > spinnerMaxCount) {
                        clearInterval(timer);
                        callback(winningOptionValueIndex, userId);
                    }
                    else {
                        let currentOptionValue = $(".spinner-item-holder[itemIndex='" + currentOptionCount + "']", $("#prizeSpinner_" + gameId, element)).attr("prizeid");
                        if (spinnerCurrentCount >= spinnerMaxCount) {
                            showWinningOption = true;
                        }
                        let previousOptionItemCount = (currentOptionCount - 1);
                        if (previousOptionItemCount < 0) {
                            previousOptionItemCount = (maxOptionsCount - 1);
                        }
                        $(".spinner-item-holder[itemIndex='" + previousOptionItemCount + "']", $("#prizeSpinner_" + gameId, element)).removeClass("active-spinner-item");
                        $(".spinner-item-holder[itemIndex='" + currentOptionCount + "']", $("#prizeSpinner_" + gameId, element)).addClass("active-spinner-item");

                        if (showWinningOption == true && currentOptionValue == winningOptionValue) {
                            spinnerCurrentCount *= 10;
                        }

                        currentOptionCount++;
                        if (currentOptionCount == maxOptionsCount) {
                            currentOptionCount = 0;
                            spinnerCurrentCount++;
                            $("#spinnerLoopNumber").val(spinnerCurrentCount);
                        }
                    }
                }, 50);

            }
            function EndRoll(winningValueIndex, userId, gameId, callback) {
                if (userId == null || userId == "") {
                    userId = $("#prizeAssignTo_" + gameId, element).val() || legacyContainer.scope.TP1Username;
                }
                let winningValue = $(".spinner-item-holder[itemIndex='" + winningValueIndex + "']", $("#prizeSpinner_" + gameId, element)).attr("prizeid") || -1;
                AssignPrizeToUser(-1, gameId, winningValue, userId, function () {
                    LoadCurrentAssignedRewardsForGame(gameId);
                    LoadWinningPrizePanel(winningValue, gameId, function () {
                        ClearActiveSpinnerItemClass(gameId);
                        ShowWinningPrizePanel();
                        let hidePrize = setTimeout(function () {
                            HideWinningPrizePanel();
                        }, (secondsToDisplayPrizeFor * 1000));
                    });

                    if (callback != null) {
                        callback();
                    }
                });
            }
            function AssignPrizeToUser(assignmentId, gameId, prizeId, userId, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "markManualRewardAssignmentClaimed",
                        assignmentId: assignmentId,
                        gameid: gameId,
                        manualrewardid: prizeId,
                        userid: userId,
                        claimedDate: null
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
            function DisableSpinnerButton(button, gameId) {
                $(button, element).hide();
            }
            function EnableSpinnerButton(button, gameId, userId) {
                if (button == null) {
                    button = $("#prizeOptionSpinner_" + gameId, element);
                }
                if (scope.CurrentAssignedRewards.length == 0 || (scope.CurrentAssignedRewards.filter(r => r.GameId == gameId) != null && scope.CurrentAssignedRewards.filter(r => r.GameId == gameId).length == 0)) {
                    LoadCurrentAssignedRewardsForGame(gameId);
                }
                if (userId == null || userId == "") {
                    userId = $("#prizeAssignTo_" + gameId, element).val();
                }
                let rewardItem = scope.CurrentAssignedRewards.find(r => r.UserId == userId && r.GameId == gameId);

                $("#userRewardClaimDate_" + gameId, element).text("");
                $("#userRewardClaimDate_" + gameId, element).removeClass("claimedActive");
                if (rewardItem != null && rewardItem.ClaimedDate == null) {
                    $(button, element).show();
                }
                else {
                    if (rewardItem != null) {
                        let spinnerArray = $(".spinner-item-holder[prizeid='" + rewardItem.ManualRewardId + "']", $("#prizeSpinner_" + gameId, element));
                        if (spinnerArray.length > 1) {
                            $(spinnerArray[0]).addClass("active-spinner-item");
                        }
                        else {
                            $(".spinner-item-holder[prizeid='" + rewardItem.ManualRewardId + "']", $("#prizeSpinner_" + gameId, element)).addClass("active-spinner-item");
                        }

                        if (rewardItem.ClaimedDate != null) {
                            let claimDate = new Date(rewardItem.ClaimedDate);
                            let claimedDateText = "Claimed On: " + claimDate.toLocaleDateString() + " @ " + claimDate.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

                            $("#userRewardClaimDate_" + gameId, element).text(claimedDateText);
                            $("#userRewardClaimDate_" + gameId, element).addClass("claimedActive");
                        }
                    }
                    DisableSpinnerButton(button, gameId);
                }
            }
            function ClearActiveSpinnerItemClass(gameId) {
                if (gameId == null || gameId <= 0) {
                    $(".spinner-item-holder", element).each(function () {
                        $(this).removeClass("active-spinner-item");
                    });
                }
                else {
                    $(".spinner-item-holder", $("#prizeSpinner_" + gameId, element)).each(function () {
                        $(this).removeClass("active-spinner-item");
                    });
                }
            }
            function LoadWinningPrizePanel(prizeId, gameId, callback) {
                let prizeName = prizeId;
                let prize = possiblePrizeOptions.find(i => i.PrizeOptionId == prizeId);
                let imageUrl = defaultPrizeUrl;

                if (prize != null) {
                    prizeName = prize.PrizeOptionName;
                    if (prize.PrizeImageUrl != null && prize.PrizeImageUrl != "") {
                        imageUrl = basePrizeUrl + prize.PrizeImageUrl;
                    }
                }

                let prizeInformationToDisplayHolder = $("<div class=\"reward-winner-prize-to-display-holder\" />");
                if (imageUrl != null && imageUrl != "") {
                    prizeInformationToDisplayHolder.css("background-image", "url('" + imageUrl + "')");
                }

                let prizeNameHolder = $("<div class=\"reward-winner-prize-to-display-prize-name\" />");
                prizeNameHolder.append("<span>" + prizeName + "</span>");

                prizeInformationToDisplayHolder.append(prizeNameHolder);


                $(".reward-winner-display-panel-winning-prize", element).empty();
                $(".reward-winner-display-panel-winning-prize", element).append(prizeInformationToDisplayHolder);

                if (callback != null) {
                    callback();
                }
            }
            function RenderRewardOptionsPanel(gameObject, renderToObject) {
                let gameId = gameObject.FlexGameId;
                let themeTagName = gameObject?.ThemeIdSource?.ThemeTagName || "";
                let rewardsHolder = $("<div class=\"flex-game-rewards-holder-game-listing " + themeTagName + "\" />");

                if (gameObject.RewardOptions != null && gameObject.RewardOptions.length > 0) {
                    let rewardsHeaderHolder = $("<div class=\"flex-game-rewards-options-header-row " + themeTagName + "\" />");
                    rewardsHeaderHolder.append("<div class=\"flex-game-rewards-options-item header-item position " + themeTagName + "\">Position</div>");
                    rewardsHeaderHolder.append("<div class=\"flex-game-rewards-options-item header-item prize " + themeTagName + "\">Prize</div>");
                    rewardsHeaderHolder.append("<div class=\"flex-game-rewards-options-item header-item trophy " + themeTagName + "\">Trophy</div>");
                    rewardsHeaderHolder.append("<div class=\"flex-game-rewards-options-item header-item credits " + themeTagName + "\">Credits</div>");

                    rewardsHolder.append(rewardsHeaderHolder);

                    for (let rc = 0; rc < gameObject.RewardOptions.length; rc++) {
                        let rewardItem = gameObject.RewardOptions[rc];
                        let rewardLineItem = RenderRewardOption(rewardItem, themeTagName);

                        rewardsHolder.append(rewardLineItem);
                    }
                }
                else {
                    rewardsHolder.append("No Reward options found or set for this game.");
                }
                renderToObject.append(rewardsHolder);
            }
            function RenderRewardOption(rewardOption, themeTagName) {
                let returnItem = $("<div class=\"reward-option-line-item-row-holder " + themeTagName + "\" />");
                let position = possiblePositions.find(p => p.RewardPositionTypeId == rewardOption.RewardPositionTypeId);
                let prize = possiblePrizeOptions.find(p => p.PrizeOptionId == rewardOption.ClientPrizeOptionId);
                let trophy = possibleTrophies.find(t => t.TrophyId == rewardOption.TrophyId);

                let positionHolder = $("<div class=\"flex-game-rewards-options-item position " + themeTagName + "\" />");
                let prizeHolder = $("<div class=\"flex-game-rewards-options-item prize " + themeTagName + "\" />");
                let trophyHolder = $("<div class=\"flex-game-rewards-options-item trophy " + themeTagName + "\" />");
                let creditsHolder = $("<div class=\"flex-game-rewards-options-item credits " + themeTagName + "\" />");

                let creditsTotal = rewardOption.UserPointsToAward || 0;

                if (position != null) {
                    positionHolder.append(position.Name);
                }
                if (prize != null && prize.PrizeImageUrl != "") {
                    let prizeImage = $("<img src=\"" + basePrizeUrl + prize.PrizeImageUrl + "\" class=\"flex-game-prize-reward-image " + themeTagName + "\" title=\"" + prize.PrizeOptionName + "\" />");
                    prizeHolder.attr("title", prize.PrizeOptionName);
                    prizeHolder.append(prizeImage);
                }
                if (trophy != null && trophy.ImageUrl != "") {
                    let trophyImage = $("<img src=\"" + baseTrophyUrl + trophy.ImageUrl + "\" class=\"flex-game-trophy-reward-image " + themeTagName + "\" title=\"" + trophy.TrophyName + "\" />");
                    trophyHolder.attr("title", trophy.TrophyName);
                    trophyHolder.append(trophyImage);
                }

                creditsHolder.append(creditsTotal);

                returnItem.append(positionHolder);
                returnItem.append(prizeHolder);
                returnItem.append(trophyHolder);
                returnItem.append(creditsHolder);

                return returnItem;
            }
            /* Reward Handling end*/
            function HandleSpinnerDisplay(gameId) {
                //spinner options are off for now.
                // let game = scope.UserGameList.find(g => g.GameId == gameId)?.GameIdSource;

                // if (game == null) {
                //     game = GetGameById(gameId);
                // }

                // if (game != null) {

                // if (game.HasSpinnerOptions == true && game.SpinnerOptions.length > 0) {
                //     $("#prizeRollerUserOptionHolder_" + gameId).show();
                // }
                // else {
                $("#prizeRollerUserOptionHolder_" + gameId).hide();
                //}
                //}
            }
            function SetCurrentGameDisplay(callback) {
                let currentActiveDisplayId = "myGameLinkHolder";
                let firstLinkId = "";
                $(".game-display-selector", element).each(function () {
                    if ($(this).hasClass("active") == true && this.id != null && this.id != "") {
                        currentActiveDisplayId = this.id;
                        let firstItem = $("a", this).first(i => i.id != null && i.id != "");
                        if (firstItem != null) {
                            firstLinkId = $(firstItem)[0].id;
                        }
                    }
                });
                if (firstLinkId != null && firstLinkId != "") {
                    $("#" + firstLinkId, element).click();
                }
                else {
                    MarkCurrentDisplaySelector(currentActiveDisplayId);
                }

                if (callback != null) {
                    callback();
                }
            }
            /* Handling of the view options START */

            function HandleViewOptions() {
                appLib.getConfigParameterByName("ANONYMOUS_USERS", function (parameter) {
                    if (parameter != null) {
                        canViewUserNames = !(parameter.ParamValue.toUpperCase() == "ON".toUpperCase() ||
                            parameter.ParamValue.toUpperCase() == "YES".toUpperCase() ||
                            parameter.ParamValue.toUpperCase() == "true".toUpperCase());
                    }
                });
                appLib.getConfigParameterByName("ANONYMOUS_SCORES", function (parameter) {
                    if (parameter != null) {
                        canViewUserScores = !(parameter.ParamValue.toUpperCase() == "ON".toUpperCase() ||
                            parameter.ParamValue.toUpperCase() == "YES".toUpperCase() ||
                            parameter.ParamValue.toUpperCase() == "true".toUpperCase());
                    }
                });
                //Forcing the user scores to be available for anyone but CSRs
                if (legacyContainer?.scope?.TP1Role?.toUpperCase() != "CSR".toUpperCase()) {
                    canViewUserScores = true;
                }
                if (canViewUserScores == false && canViewUserNames == false) {
                    console.log("Scores and Names are hidden...why are we rendering anything?");
                }
            }
            /* Handling of the view options END */
            /* Show/Hide START */
            scope.HideGameBoard = function () {
                $(".game-board-holder", element).hide();
            };
            scope.ShowGameBoard = function () {
                scope.WriteUserStatus("Framing the gameboard...", 10000);
                $(".game-board-holder", element).show();
                $(".inlinesparkline", $(".game-board-holder")).sparkline('html', {
                    type: 'line',
                    width: '100%',
                    lineColor: '#333',
                    fillColor: '',
                    lineWidth: 1,
                    spotColor: '#666',
                    spotRadius: 3,
                    defaultPixelsPerValue: 5,
                    highlightSpotColor: '#009ad9',
                    valueSpots: { '0:10000000': '#666' },
                    minSpotColor: '#666',
                    maxSpotColor: '#666',
                    tooltipPrefix: "Score: ",
                    tooltipFormat: "topLevelSparkline",
                    tooltipFormatter: BuildSparklineTooltip

                });
                scope.HideUserStatus();
            };
            scope.ShowAdminPanel = function () {
                $(".admin-panel-holder", element).show();
            };
            scope.HideAdminPanel = function () {
                $(".admin-panel-holder", element).hide();
            };
            scope.ShowUserStatus = function (displayForTiming) {
                var currentDisplayStatus = $(".flex-game-user-status", element).css("display");

                if (displayForTiming == null) {
                    displayForTiming = 60000 //1 minute is default for displaying data.
                }

                if (currentDisplayStatus == "none") {
                    $(".flex-game-user-status").show();
                    window.setTimeout(function () {
                        scope.HideUserStatus();
                    }, displayForTiming);
                }
            };
            scope.HideUserStatus = function () {
                var currentDisplayStatus = $(".flex-game-user-status").css("display");

                if (currentDisplayStatus != "none") {
                    $(".flex-game-user-status").hide();
                }
            };
            scope.HideUserStatsPanel = function () {
                $("#userStatsPanelLink", element).off("click").on("click", function () {
                    scope.ShowUserStatsPanel();
                });
                $(".flex-game-user-stats-full-holder", element).hide();

            };
            scope.ShowUserStatsPanel = function () {
                $("#userStatsPanelLink", element).off("click").on("click", function () {
                    scope.HideUserStatsPanel();
                });
                $(".flex-game-user-stats-full-holder", element).show();
            };
            function HideGameRowTab(tabToHide, gameId) {
                tabToHide = tabToHide.toLowerCase();
                let hideAll = (tabToHide == "all" || tabToHide == null);

                if (tabToHide == "game" || hideAll == true) {
                    $("#gameDetailsTabHolder_" + gameId, element).hide();
                }
                if (tabToHide == "chat" || hideAll == true) {
                    $("#gameChatTabHolder_" + gameId, element).hide();
                }
                if (tabToHide == "prize" || hideAll == true) {
                    $("#gamePrizeTabHolder_" + gameId, element).hide();
                }
            }
            function ShowGameRowTab(tabToShow, gameId) {
                tabToShow = tabToShow.toLowerCase();
                let cardTabs = $(".card-tabs[id='cardTabsHolder_" + gameId + "']", element);
                let activeTabName = ".card-tab_game";

                if (tabToShow == "game") {
                    activeTabName = ".card-tab_game";
                    $("#gameDetailsTabHolder_" + gameId, element).show();
                }
                if (tabToShow == "chat") {
                    activeTabName = ".card-tab_chat";
                    $("#gameChatTabHolder_" + gameId, element).show();
                }
                if (tabToShow == "prize") {
                    activeTabName = ".card-tab_prizes";
                    $("#gamePrizeTabHolder_" + gameId, element).show();
                    $("#prizeAssignTo_" + gameId, element).trigger("change");
                }
                $(activeTabName, cardTabs).addClass("active");

            }
            function HideTicker() {
                $(".flex-game-ticker", element).hide();
            }
            function ShowTicker() {
                $(".flex-game-ticker", element).hide();
            }
            function HideAllGamesTab() {
                $("#allGameScoreLinkHolder", element).hide();
            }
            function ShowAllGamesTab() {
                $("#allGameScoreLinkHolder", element).show();
            }
            function HideGamesPanels() {
                HideMyGames();
                HideAllGameScores();
            }
            function HideMyGames() {
                $("#currentGamesHolder", element).hide();
            }
            function ShowMyGames() {
                HideGamesPanels();
                $("#currentGamesHolder", element).show();
            }
            function HideAllGameScores() {
                $("#allGamesHolder", element).hide();
            }
            function ShowAllGameScores() {
                HideGamesPanels();
                $("#allGamesHolder", element).show();
            }
            function HideWinningPrizePanel() {
                $(".reward-winner-display-panel-holder", element).hide();
            }
            function ShowWinningPrizePanel() {
                $(".reward-winner-display-panel-holder", element).show();
            }

            /* Show/Hide END */
            scope.load = function () {
                scope.ShowUserStatus("Initializing game information...", 20000);
                scope.Initialize(function () {
                    if (legacyContainer.scope.TP1Role == "Admin") {
                        scope.SetupAdminPanel();
                    } else {
                        scope.HideAdminPanel();
                    }
                });
                HideTicker();
                scope.LoadUserGameList();
            };

            scope.load();

            ko.postbox.subscribe("FlexGamesReload", function (requireReload) {
                scope.ShowUserStatus("Reloading game information...", 20000);
                if (requireReload == true) {
                    scope.UserGameList.length == 0;
                }
                scope.LoadUserGameList();
            });
            ko.postbox.subscribe("FlexGamesLoad", function () {
                scope.load();
            });
        }

    };
}]);
