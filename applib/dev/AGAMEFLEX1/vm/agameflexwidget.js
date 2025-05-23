angularApp.directive("ngAgameFlexWidget", ['api', '$rootScope', function(api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/AGAMEFLEX1/view/agameflexwidget.htm?' + Date.now(),
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
            scope.prefixInfo = a$.gup("prefix");
            scope.baseGameUrl = window.location.protocol + "//" + window.location.hostname + "/3/ng/AgameFlex/userGameListing.aspx";

            if (scope.includeheader == "true") {
                $(".flex-game-widget-header-holder", element).show();
            }
            else
            {
                $(".flex-game-widget-header-holder", element).hide();
            }

            scope.Initialize = function(callback) {
                scope.GameCountToDisplay = 10;
                scope.UserGameList = [];
                if(callback != null)
                {
                    callback();
                }
            };

            scope.LoadUserGameList = function(userToLoad, callback) {
                GetUserGameList(userToLoad, function(data){
                    LoadGameListing(data);
                });

                if(callback != null)
                {
                    callback();
                }
            };

            function GetUserGameList(userId, callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "flex",
                        cmd: "getWidgetGameListForUser",
                        userid: userId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data) {
                        if(callback != null)
                        {
                            callback(data);
                        }
                    }
                });
            }

            function LoadGameListing(data)
            {
                let gameList = JSON.parse(data.gameList);

                if(gameList != null)
                {
                    scope.UserGameList.length = 0;

                    if(gameList.length > scope.GameCountToDisplay)
                    {
                        gameList = gameList.slice(scope.GameCountToDisplay);
                    }
                    if(gameList.length == 0)
                    {
                        var gameHolder = $("<div class=\"empty-state flex-game-widget-game-item-holder\"/>");
                        gameHolder.append("<p>You are currently not participating in any games.</p>");
                        $(".flex-widget-user-game-listing-holder").append(gameHolder);
                    }
                    else
                    {
                        for(var g = 0; g < gameList.length; g++)
                        {
                            let game = gameList[g];
                            scope.UserGameList.push(game);
                            AddGameToListing(game, g, gameList.length);

                        }
                    }

                }
            }
            //function AddGameToListing(item, endofList)
            function AddGameToListing(item, gameCounter, totalGameCount)
            {
                //let endofList = (gameCounter + 1) > totalGameCount;
                var gameHolder = $("<div class=\"flex-game-widget-game-item-holder\"/>");
                var gameBackgroundHolder = $("<div class=\"flex-game-widget-game-background-holder\" />");
                var gameCardHolder = $("<div class=\"flex-game-widget-game-card-holder\"/>");

                var gameCard = $("<div class=\"flex-game-widget-game-card\"/>");
                if (item.GameIdSource != null && item.GameIdSource.ThemeIdSource != null) {
                    var gameThemeBackground =
                        item.GameIdSource.ThemeIdSource.ThemeBoardDisplayImageName ||
                        item.GameIdSource.ThemeIdSource.ThemeLeaderboardDisplayImageName ||
                        null;

                    if (gameThemeBackground != null && gameThemeBackground != "") {
                        gameCard.css("background-image", "url('" + window.location.protocol + "//" + window.location.hostname + gameThemeBackground + "')");
                        //handle the background of the whole holder.
                        gameBackgroundHolder.css("background-image", "url('" + window.location.protocol + "//" + window.location.hostname + gameThemeBackground + "')");
                    }
                }
                gameCard.append("&nbsp;");

                var gameStatus = $("<div class=\"flex-game-widget-game-status flex-game-status-info\"/>");
                gameStatus.append(item.GameStatusName);
                gameStatus.addClass(item.GameStatusName.replace(/\s/g, ''));

                var gameDataHolder = $("<div class=\"flex-game-widget-game-data-holder\" id=\"gotoGame_" + item.GameId + "\" />");

                var gameName = $("<div class=\"flex-game-widget-game-name\"/>");
                gameName.append(item.GameName);

                var gameEndDate = $("<div class=\"flex-game-widget-game-end-date\"/>");
                if (item.GameIdSource != null) {
                    var endDate = new Date(item.GameIdSource.GameEndDate).toLocaleDateString("en-US");

                    var dateString;
                    switch (item.GameIdSource.Status) {
                        case "C":
                            dateString = "Ended on " + "<span>" + endDate + "</span>"
                            break;
                        case "F":
                            dateString = "Ended on " + "<span>" + endDate + "</span>"
                            break;
                        case "P":
                            if (item.DaysUntilEndOfGame == 0) {
                                $(gameCard).addClass("ends-today");
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
                    gameEndDate.append(dateString);
                } else {
                    gameDates = null;
                }

                var gameMetric = $("<div class=\"flex-game-widget-game-metric\"/>");
                gameMetric.append("Game Metric: ");
                if(item.SubKpiName != null && item.SubKpiName != "")
                {
                    gameMetric.append("<span>" + item.ScoringMetric + ": <div class=\"subkpi\">" + item.SubKpiName  + "</div></span>");
                }
                else
                {
                    gameMetric.append("<span>" + item.ScoringMetric + "</span>");
                }

                var gameType = $("<div class=\"flex-game-widget-game-type\"/>");
                gameType.append("Game Type: ");
                gameType.append("<span>" + item.GameIdSource.GameTypeIdSource.GameTypeName + "</span>");


                var userStanding = $("<div class=\"flex-game-widget-user-standing\" />");
                var standingText;
                if (item.UserIsGameAdmin == false && item.CurrentRankForGame != 0) {
                    standingText = "Rank " + "<span>" + item.CurrentRankForGame + " of " + item.TotalPlayersInGame + "</span>";
                } else {
                    userScoreTotal = null;
                    standingText = "Total Participants: " + "<span>" + item.TotalPlayersInGame + "</span>";
                }
                userStanding.append(standingText);
                // let gotoGameButton = $("<button class=\"flex-game-widget-goto-button\" id=\"gotoGame_" + item.GameId + "\">Go</button>");
                // $(gotoGameButton).off("click").on("click", function(){
                //     let buttonId = this.id;
                //     let gameId = buttonId.split("_")[1];
                //     let hasPrefix = false;
                //     let documentLocation = scope.baseGameUrl;
                //     if(scope.prefixInfo != null && scope.prefixInfo != "")
                //     {
                //         documentLocation += "?prefix=" + scope.prefixInfo;
                //         hasPrefix = true;
                //     }
                //     if(hasPrefix)
                //     {
                //         documentLocation += "&";
                //     }
                //     else
                //     {
                //         documentLocation += "?";
                //     }
                //     documentLocation += "gameId=" + gameId;

                //     document.location.href = documentLocation;
                // });

                $(gameDataHolder).off("click").on("click", function(){
                    let buttonId = this.id;
                    let gameId = buttonId.split("_")[1];
                    let hasPrefix = false;
                    let documentLocation = scope.baseGameUrl;
                    if(scope.prefixInfo != null && scope.prefixInfo != "")
                    {
                        documentLocation += "?prefix=" + scope.prefixInfo;
                        hasPrefix = true;
                    }
                    if(hasPrefix)
                    {
                        documentLocation += "&";
                    }
                    else
                    {
                        documentLocation += "?";
                    }
                    documentLocation += "gameId=" + gameId;

                    //alert("debug: 2 Navigate to AGame > Flex > " + documentLocation);
                    ko.postbox.publish("SetNavigation", { type: "FlexGame", gameid: gameId });
                    //document.location.href = documentLocation;
                });

                gameBackgroundHolder.append("&nbsp;");

                gameCardHolder.append(gameCard);
                gameCardHolder.append(gameStatus);

                gameDataHolder.append(gameName);
                gameDataHolder.append(gameEndDate);
                gameDataHolder.append(gameMetric);
                gameDataHolder.append(gameType);
                gameDataHolder.append(userStanding);
                //gameDataHolder.append(gotoGameButton);

                gameHolder.append(gameBackgroundHolder);
                gameHolder.append(gameCardHolder);
                gameHolder.append(gameDataHolder);

                //gameHolder.append(gameBackgroundHolder);

                // if(!endofList)
                // {
                //     gameHolder.append($("<hr />"));
                // }
                $(".flex-widget-user-game-listing-holder").append(gameHolder);
            }

            scope.load = function() {
                console.log("Directive: AGameFlexWidget Load()");
                scope.Initialize(function(){
                    var userId = legacyContainer.scope.TP1Username;

                    scope.LoadUserGameList(userId);
                });

            };
//            scope.load(); //TODO: remove this and use a pub/sub to load the information on the widget.

            ko.postbox.subscribe("AGameFlexWidgetLoad", function(){
                scope.load();
            });
            ko.postbox.subscribe("AGameWidgetInit", function(){
                scope.Initialize();
            });
            ko.postbox.subscribe("AGameWidgetReload", function(){
                scope.LoadUserGameList(legacyContainer.scope.TP1Username);
            });
        }

    };
}]);
