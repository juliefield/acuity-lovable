angularApp.directive("ngUserAgameLeagueView", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/AGAMELEAGUES1/view/userAgameLeagueView.htm?' + Date.now(),
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
         let rosterLockDateTime = null;
         var mipViewableRoles = ["CSR"]
         var currentGameList = [];
         let gameThemeList = [];
         var currentTeamColorsList = [];

         //TODO: Determine what the base information should be here.
         let vsBackgroundImageUrl = "";
         let matchupFooterImageUrl = "";
         let baseTeamLogoUrl = a$.debugPrefix() + "/applib/css/images/team-svgs/default-team-icon.svg";
         let baseBackgroundUrl = a$.debugPrefix() + "/3/ng/AgameFlex/images/game-bg-default-leaderboard.jpg";
         let multiThemeFoundBackgroundUrl = a$.debugPrefix() + "/3/ng/AgameFlex/images/game-bg-default-leaderboard.jpg";
         let defaultGameIconUrl = a$.debugPrefix() + "/applib/css/images/launch-agame.png";
         let extremeGameLogoUrl = a$.debugPrefix() + "/App_Themes/Acuity3/images/xtreme-logo.png";
         let defaultAvatarUrl = a$.debugPrefix() + "/applib/css/images/empty_headshot.png";
         let starterImageUrl = a$.debugPrefix() + "/applib/css/images/starter-star.png";
         let goldTrophyUrl = a$.debugPrefix() + "/applib/css/images/gold-trophy.png";
         let hasModule = false;
         let canViewUserNames = true;
         let canViewUserScores = true;
         let scoringType = "base";
         //let rosterClosingDefaultText = "Wager + Roster Closes soon!";
         let rosterClosingDefaultText = "Roster Closes soon!";
         let rosterClosingDaysImageUrl = a$.debugPrefix() + "/applib/css/images/wager-daysleft.png";
         let rosterClosingHoursImageUrl = a$.debugPrefix() + "/applib/css/images/wager-hoursleft.png";

         scope.Initialize = function () {
            HideAll();
            hasModule = appLib.canAccessAGameLeague();
            GetBaseScoringType();
            LoadAvaialbleThemes();
         };

         function SetDatePickers() {
         }
         function GetBaseScoringType() {
            appLib.getConfigParameterByName("CLIENT_SCORING_CALC_TYPE", function (parameter) {
               if (parameter != null) {
                  scoringType = parameter.ParamValue;
               }
            });
         }
         /*Listing Load*/
         function LoadAvaialbleThemes(forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }

            if (gameThemeList == null || gameThemeList.length == 0 || forceReload == true) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getAGameThemeList"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     var returnList = JSON.parse(data.aGameThemeList);
                     gameThemeList.length = 0;
                     gameThemeList = returnList;
                     if (callback != null) {
                        callback(gameThemeList);
                     }
                  }
               });
            }
            else {
               if (callback != null) {
                  callback(gameThemeList);
               }
               else {
                  return;
               }
            }
         }
         function LoadAGameThemeById(themeId) {
            let returnObject = gameThemeList.find(t => t.AGameThemeId == themeId);

            if (returnObject == null) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getAGameThemeById",
                     themeid: themeId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     returnObject = JSON.parse(data.aGameTheme);
                     gameThemeList.push(returnObject);
                  }
               });
            }
            return returnObject;
         }
         function LoadCurrentUserLists(forceReload, gameDate, callback) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (gameDate == null) {
               gameDate = new Date().toLocaleDateString();
            }
            GetCurrentGameList(forceReload, gameDate, function (gameList) {
               if (gameList.length == 0) {
                  gameList = GetGameOfTheWeekList();
               }
               RenderCurrentGameList(gameList, callback);
            });
         }
         function GetGameOfTheWeekList() {
            let returnList = [];
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "getAGameOfTheWeek"
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  returnList = JSON.parse(data.currentListForUser);
               }
            });
            return returnList;
         }
         function GetCurrentGameList(forceReload, gameDate, callback) {
            if (gameDate == null) {
               gameDate = new Date().toLocaleDateString();
            }
            if (forceReload == null) {
               forceReload = false;
            }
            if (currentGameList != null && currentGameList.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(currentGameList);
               }
               else {
                  returncurrentGameList;;
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getCurrentUserAGamePlayerInfo",
                     userid: legacyContainer.scope.TP1Username,
                     gamedate: gameDate,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnList = JSON.parse(data.currentListForUser);
                     currentGameList.length = 0;
                     currentGameList = returnList;
                     if (callback != null) {
                        callback(currentGameList);
                     }
                     else {
                        return currentGameList;
                     }
                  }
               });
            }
         }
         function RenderCurrentGameList(listToRender, callback) {
            console.log("RenderCurrentGameList(listToRender, callback)", listToRender);
            if (listToRender == null) {
               listToRender = currentGameList;
            }
            $("#userAgameListing", element).empty();
            let currentGameListHolder = $("<div class=\"game-matchup-container\" />");
            let currentGameThemeBackground = multiThemeFoundBackgroundUrl;
            let directiveButtonHolder = $(`<div class="game-matchup-button-holder" />`);
            let refreshGamesButton = $(`<button id="btnRefreshGames" class="button btn refresh-button" title="Refresh"><i class="fa fa-refresh"></i></button>`);
            refreshGamesButton.on("click", function(){
               ko.postbox.publish("userAGameLeagueReload", true);
            });
            directiveButtonHolder.append(refreshGamesButton);
            let currentRosterExpiresTimingHolder = $(`<div class="game-matchup-roster-timing-holder" />`);
            let currentRosterExpiresCountdownHolder = $(`<div class="game-matchup-roster-close-countdown-holder" />`);
            let currentRosterExpiresTimingLabel = $(`<div class="game-matchup-roster-close-timer" />`);
            currentGameListHolder.append(directiveButtonHolder);

            listToRender = SortGameList(listToRender);

            if (listToRender != null && listToRender.length > 0) {
               let rosterLockTiming = GetRosterLockTiming(listToRender);
               if(rosterLockTiming!= null && rosterLockTiming.TimingValue >= 0)
                  {
                     currentRosterExpiresTimingLabel.append(rosterLockTiming.TimingValue);
                     let currentRosterExpiresTimingTextHolder = $(`<div class="game-matchup-roster-close-timer-text-holder" />`);
                     currentRosterExpiresTimingTextHolder.append(rosterClosingDefaultText);
                     if(rosterLockTiming.TimingType.toLowerCase() == "Hours".toLowerCase())
                     {
                        currentRosterExpiresCountdownHolder.css("background", `url("${rosterClosingHoursImageUrl}")`);
                     }
                     else
                     {
                        currentRosterExpiresCountdownHolder.css("background", `url("${rosterClosingDaysImageUrl}")`);
                     }

                     currentRosterExpiresCountdownHolder.append(currentRosterExpiresTimingLabel);

                     currentRosterExpiresTimingHolder.append(currentRosterExpiresCountdownHolder);
                     currentRosterExpiresTimingHolder.append(currentRosterExpiresTimingTextHolder);

                     currentRosterExpiresTimingHolder.css("cursor","pointer").off("click").on("click", function(){
                        ko.postbox.publish("SetNavigation", {type:"AGameRoster"});
                     });

                     directiveButtonHolder.append("&nbsp;&nbsp;");
                     directiveButtonHolder.append(currentRosterExpiresTimingHolder);
                  }

               let viewMipInfoRoleIndex = mipViewableRoles.findIndex(r => r == legacyContainer.scope.TP1Role);
               //let canViewMipInfo = (viewMipInfoRoleIndex > -1);
                  let canViewMipInfo = false;
               if (canViewMipInfo == true) {
                  AddMostImprovedUserInformation(currentGameListHolder, listToRender);
               }
               currentGameThemeBackground = baseBackgroundUrl;
               let currentGameThemeLogo = defaultGameIconUrl;
               let currentGameThemeTag = "";
               let currentGameThemeDefaultTeamIcon = baseTeamLogoUrl;

               for (let gIndex = 0; gIndex < listToRender.length; gIndex++) {
                  let gameItem = listToRender[gIndex];
                  let gameTheme = null;
                  let isExtremeGame = (gameItem.LeagueType == "xTreme") || false;

                  if (gameItem.ThemeIdSource == null) {
                     gameTheme = LoadAGameThemeById(gameItem.ThemeId);
                  }
                  else {
                     gameTheme = gameItem.ThemeIdSource;
                  }
                  if (gameTheme != null) {
                     if (currentGameThemeTag != "" && currentGameThemeTag != gameTheme.ThemeTag) {
                        currentGameThemeBackground = multiThemeFoundBackgroundUrl;
                     }
                     else {
                        if (gameTheme.ThemeBackgroundImage != null && gameTheme.ThemeBackgroundImage != "") {
                           currentGameThemeBackground = gameTheme.ThemeBackgroundImage;
                        }
                        if (gameTheme.ThemeDefaultTeamIcon != null && gameTheme.ThemeDefaultTeamIcon != "") {
                           currentGameThemeDefaultTeamIcon = gameTheme.ThemeDefaultTeamIcon;
                        }
                     }
                     if (currentGameThemeTag == "") {
                        currentGameThemeTag = gameTheme.ThemeTag;
                     }

                     if (gameTheme.ThemeImage != null && gameTheme.ThemeImage != "") {
                        currentGameThemeLogo = gameTheme.ThemeImage;
                     }
                  }

                  if (isExtremeGame == true) {
                     currentGameThemeLogo = extremeGameLogoUrl;
                  }

                  let gameHolder = $("<div class=\"game-matchup-data-row-holder\" id=\"gameMatchup_" + gameItem.LeagueId + "\" />");
                  if (currentGameThemeTag != "") {
                     gameHolder.addClass(currentGameThemeTag);
                  }

                  let gameRowHolder = $("<div class=\"game-matchup-all-data-holder\" id=\"GameRowHolder_" + gameItem.LeagueId + "\" />");
                  let gameThemeLogoHolder = $("<div class=\"game-data-common-holder game-logo-holder\" />");
                  let gameMatchupHolder = $("<div class=\"game-data-common-holder game-matchup-data-matchup-holder\" id=\"GameMatchupHolder_" + gameItem.LeagueId + "\" />");
                  let gameSectionHolder = $("<div class=\"game-matchup-data-section-holder\" />");
                  let footerSectionInfoHolder = $("<div class=\"game-matchup-data-footer-section\" id=\"GameMatchupFooterHolder_" + gameItem.LeagueId + "\" />");
                  let guestTeamInfoHolder = $("<div class=\"game-data-all-team-info-holder team-info-holder guest\" id=\"GameMatchupGuestTeamHolder_" + gameItem.LeagueId + "\" />");
                  let homeTeamInfoHolder = $("<div class=\"game-data-all-team-info-holder team-info-holder home\" id=\"GameMatchupHomeTeamHolder_" + gameItem.LeagueId + "\" />");

                  let gameDates = new Date(gameItem.GameStartDate).toLocaleDateString() + " - " + new Date(gameItem.GameEndDate).toLocaleDateString();

                  let gameThemeLogo = $("<img />");
                  gameThemeLogo.attr("src", currentGameThemeLogo);
                  gameThemeLogo.attr("height", "75px");
                  gameThemeLogoHolder.append(gameThemeLogo);


                  /* Guest Team Column */
                  let guestTeamLogoHolder = $("<div class=\"game-matchup-data-item-holder game-data-logo-holder\" id=\"GameTeamLogoGuestHolder_" + gameItem.LeagueId + "_" + gameItem.VisitorTeamsId + "\" />");
                  //TODO:Handle once we get schedule info
                  let guestTeamLogo = $("<object type=\"image/svg+xml\" id=\"teamLogo_" + gameItem.LeagueId + "_" + gameItem.VisitorTeamsId + "\" class=\"guest-team-logo\" />");
                  let guestTeamLogoSource = currentGameThemeDefaultTeamIcon;
                  let guestTeamColors = GetTeamColors(gameItem.VisitorTeamsId);
                  if (guestTeamColors != null && guestTeamColors.Colors?.length > 0) {
                     AddColorsToObject(guestTeamColors, guestTeamLogo);
                  }
                  guestTeamLogo.attr("data", guestTeamLogoSource);

                  guestTeamLogoHolder.append(guestTeamLogo);

                  let guestTeamNameHolder = $("<div class=\"game-matchup-data-item-holder game-data-team-name-holder\" />");
                  let guestTeamName = gameItem.AGameTeamName;
                  if (gameItem.VisitorTeamsId != gameItem.TeamId) {
                     guestTeamName = gameItem.OpponentTeamsName;
                  }
                  guestTeamNameHolder.append('<span>' + guestTeamName + '</span>');

                  let guestTeamOwnerName = gameItem.VisitorTeamOwnerName || "";
                  if(guestTeamOwnerName != null)
                  {
                     guestTeamNameHolder.append(`<div class="game-matchup-data-item-holder game-data-team-owner-name visitor-team">${guestTeamOwnerName} Team</div>`);
                  }

                  let guestTeamScoreHolder = $("<div class=\"game-matchup-data-item-holder game-data-score-holder\" />");
                  let guestTeamScore = FormatScore(gameItem.VisitorTeamScore, scoringType);
                  guestTeamScoreHolder.append(guestTeamScore);

                  let guestTeamHeader = $("<div class=\"game-guestteam-header\" />");
                  guestTeamHeader.append(guestTeamNameHolder);
                  let guestTeamBody = $("<div class=\"game-guestteam-body\" />");
                  guestTeamBody.append(guestTeamScoreHolder);
                  guestTeamBody.append(guestTeamLogoHolder);

                  let vsHolder = $("<div class=\"game-matchup-data-item-holder game-data-vs-matchup-holder\"/>");
                  vsHolder.append("vs");

                  guestTeamBody.append(vsHolder);

                  guestTeamInfoHolder.append(guestTeamHeader);
                  guestTeamInfoHolder.append(guestTeamBody);
                  /* Guest Team Column END*/
                  /* Home Team Column */
                  let homeTeamLogoHolder = $("<div class=\"game-matchup-data-item-holder game-data-logo-holder\" id=\"GameTeamLogoHomeHolder_" + gameItem.LeagueId + "_" + gameItem.HomeTeamsId + "\" />");
                  //TODO:Handle once we get schedule info
                  let homeTeamLogo = $("<object type=\"image/svg+xml\" id=\"teamLogo_" + gameItem.LeagueId + "_" + gameItem.HomeTeamsId + "\" class=\"home-team-logo\" />");
                  let homeTeamLogoSource = currentGameThemeDefaultTeamIcon;
                  let homeTeamColors = GetTeamColors(gameItem.HomeTeamsId);
                  if (homeTeamColors != null && homeTeamColors.Colors?.length > 0) {
                     AddColorsToObject(homeTeamColors, homeTeamLogo);
                  }
                  homeTeamLogo.attr("data", homeTeamLogoSource);
                  homeTeamLogoHolder.append(homeTeamLogo);

                  let homeTeamNameHolder = $("<div class=\"game-matchup-data-item-holder game-data-team-name-holder\" />");
                  let homeTeamName = gameItem.AGameTeamName;
                  if (gameItem.HomeTeamsId != gameItem.TeamId) {
                     homeTeamName = gameItem.OpponentTeamsName;
                  }
                  homeTeamNameHolder.append('<span>' + homeTeamName + '</span>');

                  let homeTeamOwnerName = gameItem.HomeTeamOwnerName || "";
                  if(homeTeamOwnerName != null)
                  {
                     homeTeamNameHolder.append(`<div class="game-matchup-data-item-holder game-data-team-owner-name home-team">${homeTeamOwnerName} Team</div>`);
                  }

                  let homeTeamScoreHolder = $("<div class=\"game-matchup-data-item-holder game-data-score-holder\" />");
                  let homeTeamScore = FormatScore(gameItem.HomeTeamScore, scoringType);
                  homeTeamScoreHolder.append(homeTeamScore);

                  let homeTeamHeader = $("<div class=\"game-hometeam-header\" />");
                  homeTeamHeader.append(homeTeamNameHolder);
                  let homeTeamBody = $("<div class=\"game-hometeam-body\" />");
                  homeTeamBody.append(homeTeamLogoHolder);
                  homeTeamBody.append(homeTeamScoreHolder);

                  homeTeamInfoHolder.append(homeTeamHeader);
                  homeTeamInfoHolder.append(homeTeamBody);
                  /* Home Team Column END*/
                  /*Footer Section of Game*/
                  let userPositionHolder = $("<div class=\"game-matchup-data-item-holder user-position-holder\" id=\"userPosition_" + gameItem.LeagueId + "\" />");

                  let userPositionCurrentPositionHolder = $("<div class=\"game-matchup-data-item-holder current-user-position-holder\" />");
                  let starterImage = $("<img src=\"" + starterImageUrl + "\" title=\"Starting Lineup\" class=\"user-is-starter-image\" />");
                  let userPositionCurrentPosition = gameItem.Position;
                  let userPositionCurrentPositionStatsHolder = $("<div class=\"game-matchup-data-item-holder current-user-position-stats-holder\" />");
                  let currentUserPositionStanding = gameItem.PositionPlayCurrentPosition || 0;
                  let currentUserPositionStandingMax = gameItem.PositionPlayTotalPlayers || 0;
                  let userPositionCurrentStats = currentUserPositionStanding + " of " + currentUserPositionStandingMax;

                  let isOnStartingLineup = (gameItem.PlayType == "Team Play") || false;

                  userPositionCurrentPositionHolder.append(userPositionCurrentPosition);

                  if (isOnStartingLineup == true) {
                     userPositionHolder.append(starterImage);
                  }
                  if (isExtremeGame != true && currentUserPositionStandingMax > 0) {
                     userPositionCurrentPositionStatsHolder.append(userPositionCurrentStats);
                  }
                  userPositionHolder.append(userPositionCurrentPositionHolder);
                  userPositionHolder.append(userPositionCurrentPositionStatsHolder);


                  let datesHolder = $("<div class=\"game-matchup-data-item-holder game-data-dates-holder\" />");
                  datesHolder.append(gameDates);

                  footerSectionInfoHolder.append(userPositionHolder);
                  footerSectionInfoHolder.append(datesHolder);
                  /*Footer Section of Game END*/

                  gameSectionHolder.append(homeTeamInfoHolder);
                  gameSectionHolder.append(guestTeamInfoHolder);
                  gameSectionHolder.append(footerSectionInfoHolder);

                  gameMatchupHolder.append(gameThemeLogoHolder);
                  gameMatchupHolder.append(gameSectionHolder);

                  gameRowHolder.append(gameMatchupHolder);

                  if (isOnStartingLineup == true) {
                     userPositionHolder.off("click").on("click", function () {
                        let id = this.id;
                        let divisionId = id.split("_")[1];

                        NavigateToAGameLeague("roster", divisionId);
                     });
                  }
                  else if (isExtremeGame != true) {
                     userPositionHolder.off("click").on("click", function () {
                        let id = this.id;
                        let divisionId = id.split("_")[1];
                        NavigateToAGameLeague("position", divisionId);
                     });

                  }

                  guestTeamInfoHolder.off("click").on("click", function () {
                     let id = this.id;
                     let divisionId = id.split("_")[1];
                     NavigateToAGameLeague("roster", divisionId);
                  });
                  homeTeamInfoHolder.off("click").on("click", function () {
                     let id = this.id;
                     let divisionId = id.split("_")[1];
                     NavigateToAGameLeague("roster", divisionId);
                  });
                  footerSectionInfoHolder.off("click").on("click", function () {
                     let id = this.id;
                     let divisionId = id.split("_")[1];
                     NavigateToAGameLeague("stats", divisionId);
                  });

                  gameHolder.append(gameRowHolder);

                  currentGameListHolder.append(gameHolder);
               }
            }
            else {
               let noGamesMessageText = "<i class=\"agame-dashboard-no-game-icon fa-sharp-duotone fa-solid fa-headset\"></i>Sorry, you are not assigned to any current Games. Please check back soon. ";
               let noGamesFoundHolder = $("<div class=\"agame-leagues-no-games-found-holder\" />");
               let noGamesFoundMessageHolder = $("<div class=\"agame-leagues-no-games-message-holder\" />");


               let aGameNavigationLinkHolder = $(`<div class="agame-leagues-no-games-navigation-holder" />`);
               let aGameNavigationLink = $(`<div class="agame-leagues-no-game-navigate-to-agame">Go to A-GAME</div>`);

               aGameNavigationLink.off("click").on("click", function(){
                  NavigateToAGameLeague("roster", -1);
               });
               aGameNavigationLinkHolder.append(aGameNavigationLink);

               noGamesFoundMessageHolder.append(noGamesMessageText);
               noGamesFoundMessageHolder.append("<br />");
               noGamesFoundMessageHolder.append("<hr />");
               noGamesFoundMessageHolder.append(aGameNavigationLinkHolder);


               noGamesFoundHolder.append(noGamesFoundMessageHolder);

               currentGameListHolder.append(noGamesFoundHolder);
            }

            $("#userAgameListing", element).css("background-image", "url('" + currentGameThemeBackground + "')");
            $("#userAgameListing", element).append(currentGameListHolder);

            if (callback != null) {
               callback();
            }
         }
         function AddMostImprovedUserInformation(renderToObject, dataList) {
            let userDataObjectFromList = null;
            if (dataList != null) {
               userDataObjectFromList = dataList.find(u => u.UserId == legacyContainer.scope.TP1Username);
            }
            let mostImprovedHolder = $("<div id=\"userMostImprovedInformation\" class=\"user-most-improved-holder\" />");
            let currentImproved = $("#userMostIMprovedInformation", $(renderToObject));
            if (currentImproved != null) {
               currentImproved.remove();
            }
            let mostImprovedImage = $("<img src=\"" + goldTrophyUrl + "\" alt=\"Most Improved\" />");

            let mostImprovedLabel = $("<div class=\"user-most-improved-text-holder item-label\" />");
            mostImprovedLabel.append(mostImprovedImage);
            mostImprovedLabel.append("&nbsp;");
            mostImprovedLabel.append("Most Improved Player:");

            let mostImprovedCountHolder = $("<div class=\"user-most-improved-text-holder user-count\" />");
            let mostImprovedRank = 0;
            let totalMipPositions = 0;
            if (userDataObjectFromList != null) {
               mostImprovedRank = userDataObjectFromList.CurrentMipPosition;
               totalMipPositions = userDataObjectFromList.TotalMipPositions;
            }
            let mipLabel = mostImprovedRank + " of " + totalMipPositions;

            mostImprovedCountHolder.append(mipLabel);

            mostImprovedHolder.append(mostImprovedLabel);
            mostImprovedHolder.append(mostImprovedCountHolder);

            $(mostImprovedHolder).off("click").on("click", function () {
               NavigateToAGameLeague("mip");
            });

            $(renderToObject).append(mostImprovedHolder);
         }
         /*Listing Load End*/
         /*MISC Functions*/
         function NavigateToAGameLeague(section, divisionId) {
            if (section == null) {
               section = "roster";
            }
            let userRole = legacyContainer.scope.TP1Role;
            ko.postbox.publish("SetNavigation", { type: "AGame", leagueid: divisionId, display: section, role: userRole });

            // let prefixInfo = a$.gup("prefix");
            // let agameLeaguePlayerHomeUrl = a$.debugPrefix() + "/3/ng/AGameLeague/AgentDisplay.aspx";
            // if(section == "position")
            // {
            //    console.log("Get the Position Play URL.");
            //    console.log("Determine what we need to properly handle the link");
            //    //TODO: Determine how we go to various parts of A-GAME
            //    agameLeaguePlayerHomeUrl = a$.debugPrefix() + "/3/ng/AGameLeague/AgentDisplay.aspx";
            // }
            // else if(section == "mip")
            // {
            //    console.log("Get MIP Information for user.");
            //    console.log("Navigate to MIP Data");
            //    //TODO: Determine how we go to various parts of A-GAME
            //    agameLeaguePlayerHomeUrl = a$.debugPrefix() + "/3/ng/AGameLeague/AgentDisplay.aspx";
            // }

            // if (prefixInfo != null && prefixInfo != "") {
            //    agameLeaguePlayerHomeUrl += "?prefix=" + prefixInfo;
            // }

            //document.location.href = agameLeaguePlayerHomeUrl;

         }

         function ColorTeamLogos() {
            let objectItems = $("object", document);
            for (let oIndex = 0; oIndex < objectItems.length; oIndex++) {
               let currentObject = objectItems[oIndex];
               let colors = [$(currentObject).attr("color2"),
               $(currentObject).attr("color1"),
               $(currentObject).attr("color3"),
               $(currentObject).attr("color4"),
               $(currentObject).attr("color5")];
               let pathsForObject = $("path", $(currentObject.contentDocument));
               let circlesForPaths = $("circle", $(currentObject.contentDocument));
               if(circlesForPaths != null && circlesForPaths.length > 0)
               {
                  pathsForObject.splice(1, 0, circlesForPaths[0]);
               }
               for (let pIndex = 0; pIndex < pathsForObject.length; pIndex++) {
                  let colorIndex = parseInt(pIndex % 5);

                  let pathObject = pathsForObject[pIndex];

                  let colorValue = colors[colorIndex];
                  if (colorValue != null && colorValue != "") {
                     $(pathObject).attr("fill", colorValue);
                  }

               }
            }
         }
         function GetTeamColors(teamId) {
            let returnObject = null;
            if (teamId != null) {
               returnObject = currentTeamColorsList.find(t => t.TeamId == teamId);
               if (returnObject == null) {
                  returnObject = new Object();
                  a$.ajax({
                     type: "POST",
                     service: "C#",
                     async: false,
                     data: {
                        lib: "selfserve",
                        cmd: "getTeamColorsForAGameTeam",
                        agameteamid: teamId
                     },
                     dataType: "json",
                     cache: false,
                     error: a$.ajaxerror,
                     success: function (data) {
                        let returnColors = JSON.parse(data.teamColors);
                        let colorsCount = returnColors.length;
                        if (colorsCount > 0) {
                           colorsCount > 5 ? colorsCount = 5 : colorsCount;
                           returnObject.TeamId = teamId;
                           returnObject.Colors = [colorsCount];
                           for (let cIndex = 0; cIndex < colorsCount; cIndex++) {
                              returnObject.Colors[cIndex] = returnColors[cIndex];
                           }
                           currentTeamColorsList.push(returnObject);
                        }
                     }
                  });
               }

            }
            return returnObject;
         }

         function AddColorsToObject(colorsObject, objectHolderToReference) {
            let colorsArray = colorsObject;
            if (colorsArray.Colors != null && colorsArray.Colors.length > 0) {
               let colorsAddedCount = 1;
               for (let cIndex = 0; cIndex < colorsArray.Colors.length; cIndex++) {
                  if (colorsArray.Colors[cIndex] != null && colorsArray.Colors[cIndex] != "") {
                     $(objectHolderToReference).attr("color" + colorsAddedCount, colorsArray.Colors[cIndex]);
                     colorsAddedCount++;
                  }
               }
            }

         }
         function FormatScore(scoreToFormat, formatType) {
            let returnValue = scoreToFormat;
            if (formatType == null) {
               formatType = "base";
            }
            switch (formatType.toLowerCase()) {
               case "stddev":
                  returnValue = scoreToFormat.toFixed(4);
                  break;
               default:
                  returnValue = scoreToFormat.toFixed(2);
                  break;
            }
            return returnValue;
         }
         function SortGameList(listToSort)
         {
            let sortedList = listToSort;

            sortedList = sortedList.sort((a,b) =>{
               if(a.LeagueType < b.LeagueType)
               {
                  return -1;
               }
               else if (a.LeagueType > b.LeagueType)
               {
                  return 1;
               }
               else
               {
                  if(a.LeagueId < b.LeagueId)
                  {
                     return -1;
                  }
                  else if(a.LeagueId > b.LeagueId)
                  {
                     return 1;
                  }
                  else
                  {
                     return 0;
                  }
               }
            });

            return sortedList;
         }
         function GetRosterLockTiming(gameList)
         {
            let division = gameList[0];
            let returnInfo = new Object();
            returnInfo.TimingValue = null;
            returnInfo.TimingType = "";

            if(gameList == null || division == null)
            {
               let pastDate = new Date();
               pastDate.setDate(pastDate.getDate() - 7);
               returnInfo.TimingValue = pastDate;
               returnInfo.TimingType = "Days";

               return returnInfo;
            }

            GetRosterLockInformation(function(returnDate){
               let rosterLockTiming = returnDate.valueOf() - new Date().valueOf();
               rosterLockTiming = Math.ceil((rosterLockTiming / (60*60*1000)));
               returnInfo.TimingValue = rosterLockTiming;
               returnInfo.TimingType = "Hours";

               if(rosterLockTiming > 24)
               {
                  returnInfo.TimingValue = ConvertRosterLockTimingToDays(rosterLockTiming);
                  returnInfo.TimingType = "Days";
               }
            }, division.LeagueId);

            return returnInfo;
         }
         function GetRosterLockInformation(callback, divisionId)
         {
            if(divisionId > 0)
            {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getRosterLockDate",
                     dateToLoad: new Date().toLocaleDateString(),
                     divisionId: divisionId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = data.rosterLockDate;
                     if(returnData != null)
                     {
                        let tmpDate = new Date(data.rosterLockDate);
                        //TODO: Determine how to handle the time.
                        rosterLockDateTime = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate(), 17, 0, 0);
                     }
                     if (callback != null) {
                        callback(rosterLockDateTime);
                     }
                     else
                     {
                        return rosterLockDateTime;
                     }
                  }
               });
            }
         }

         function ConvertRosterLockTimingToDays(timingValue)
         {
            return Math.floor((timingValue / 24));
         }
         /*MISC FUnctions END*/
         /*Show/Hide/Collapse/Toggle*/
         function HideAll() {
         }
         /*Show/Hide/Collapse/Toggle End*/
         function WriteNoAccess() {

            let noAccessMessageText = "You do not have access to this module.";
            let noAccessMessageHolder = $("<div class=\"no-access-message-holder\"/>");
            let noAccessMessageLabelHolder = $("<div class=\"no-access-label-holder\" />");

            noAccessMessageLabelHolder.append(noAccessMessageText);
            noAccessMessageHolder.append(noAccessMessageLabelHolder);

            $("#userAgameListing", element).empty();
            $("#userAgameListing", element).append(noAccessMessageHolder);
         }

         scope.load = function () {
            console.log("Directive: UserAgameLeagueView Load()");
            hasModule = appLib.canAccessAGameLeague();
            scope.Initialize();

            if (hasModule == false) {
               WriteNoAccess();
            }
            else {
               LoadCurrentUserLists();
               window.setTimeout(function () {
                  ColorTeamLogos();
               }, 5000);
            }
         };
         //scope.load();
         ko.postbox.subscribe("userAGameLeagueReload", function (forceReload) {
            if (forceReload == true) {
               currentGameList.length = 0;
            }
            scope.load();
         });
         ko.postbox.subscribe("userLeagueLoad", function () {
            scope.load();
         });
      }
   }
}]);
